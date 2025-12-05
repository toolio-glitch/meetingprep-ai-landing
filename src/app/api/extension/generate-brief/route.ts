import { NextRequest, NextResponse } from 'next/server';
import { generateMeetingBrief, type MeetingData } from '@/lib/openai';
import { MeetingPrepService, SubscriptionService } from '@/lib/database';
import type { BriefGenerationResponse, MeetingData as DatabaseMeetingData } from '@/lib/database.types';

// Helper function to convert human-readable date to ISO format
function convertToISODate(dateString: string): string {
  if (!dateString) return new Date().toISOString().split('T')[0];
  
  try {
    // Handle formats like "Tuesday, 28 October" or "Tuesday, 28 October 2024"
    let cleanDate = dateString.replace(/^(Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday),?\s*/i, '');
    
    // If no year specified, assume current year
    const currentYear = new Date().getFullYear();
    if (!/\d{4}/.test(cleanDate)) {
      cleanDate += ` ${currentYear}`;
    }
    
    const parsedDate = new Date(cleanDate);
    
    // Check if date is valid
    if (isNaN(parsedDate.getTime())) {
      console.warn('Invalid date format, using today:', dateString);
      return new Date().toISOString().split('T')[0];
    }
    
    return parsedDate.toISOString().split('T')[0]; // YYYY-MM-DD format
  } catch (error) {
    console.error('Date conversion error:', error);
    return new Date().toISOString().split('T')[0];
  }
}

// Helper function to convert time range to single time format
function convertToTimeFormat(timeString: string): string {
  if (!timeString) return '09:00';
  
  try {
    // Handle formats like "2:00 – 3:00pm" or "14:00 - 15:00"
    // Extract the start time from the range
    const startTimeMatch = timeString.match(/(\d{1,2}):(\d{2})/);
    
    if (startTimeMatch) {
      let hours = parseInt(startTimeMatch[1]);
      const minutes = startTimeMatch[2];
      
      // Handle PM times (if the string contains PM and hour is not 12)
      if (timeString.toLowerCase().includes('pm') && hours !== 12) {
        hours += 12;
      }
      // Handle AM times (if the string contains AM and hour is 12)
      else if (timeString.toLowerCase().includes('am') && hours === 12) {
        hours = 0;
      }
      
      // Format as HH:MM
      return `${hours.toString().padStart(2, '0')}:${minutes}`;
    }
    
    console.warn('Could not parse time, using default:', timeString);
    return '09:00';
  } catch (error) {
    console.error('Time conversion error:', error);
    return '09:00';
  }
}

// Add CORS headers for Chrome extension
function addCorsHeaders(response: NextResponse) {
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  return response;
}

export async function OPTIONS(_request: NextRequest) {
  return addCorsHeaders(new NextResponse(null, { status: 200 }));
}

export async function POST(request: NextRequest) {
  try {
    console.log('Extension API called - generating brief...');

    // Get meeting data and user info from request
    const { meeting, userId } = await request.json();
    
    if (!meeting) {
      const response = NextResponse.json({ error: 'Meeting data required' }, { status: 400 });
      return addCorsHeaders(response);
    }

    const isAnonymous = !userId;
    console.log('API received userId:', userId, '(Anonymous:', isAnonymous, ')');
    
    // For authenticated users, check subscription limits
    if (!isAnonymous) {
      const { canGenerate, usage } = await SubscriptionService.canGenerateBrief(userId);
      
      if (!canGenerate) {
        const response = NextResponse.json({ 
          success: false,
          error: 'Brief limit exceeded. Please upgrade your plan.',
          usage: {
            briefs_used: usage.used,
            briefs_limit: usage.limit,
            plan: usage.plan
          }
        } as BriefGenerationResponse, { status: 403 });
        return addCorsHeaders(response);
      }
    }

    // Start timing for performance tracking
    const startTime = Date.now();
    
    // Generate AI brief using OpenAI
    const briefContent = await generateMeetingBrief(meeting as MeetingData);
    
    const generationTime = Date.now() - startTime;
    
    // For authenticated users, save to database
    // For anonymous users, just return the brief without saving
    let result;
    
    if (!isAnonymous) {
      // Normalize meeting data for database
      const normalizedMeeting: DatabaseMeetingData = {
        ...meeting,
        attendees: Array.isArray(meeting.attendees) ? meeting.attendees : [meeting.attendees],
        date: convertToISODate(meeting.date),
        time: convertToTimeFormat(meeting.time)
      };
      
      console.log('Saving to database for user:', userId);
      
      try {
        result = await MeetingPrepService.createMeetingWithBrief(
          userId,
          normalizedMeeting,
          briefContent,
          generationTime
        );
        
        if (!result) {
          console.error('Database save returned null result');
          // Don't fail the request - still return the brief
          result = {
            brief: { content: briefContent },
            meeting: normalizedMeeting
          };
        } else {
          console.log('Database save successful');
        }
      } catch (dbError) {
        console.error('Database save error:', dbError);
        // Don't fail the request - still return the brief
        result = {
          brief: { content: briefContent },
          meeting: meeting
        };
      }
    } else {
      // Anonymous user - no database save
      console.log('Anonymous user - skipping database save');
      result = {
        brief: { content: briefContent },
        meeting: meeting
      };
    }

    // Get updated usage stats for authenticated users only
    let updatedUsage = null;
    if (!isAnonymous) {
      const usageCheck = await SubscriptionService.canGenerateBrief(userId);
      updatedUsage = usageCheck.usage;
    }
    
    const responseData: BriefGenerationResponse = {
      success: true,
      brief: result.brief,
      meeting: result.meeting,
      generated_at: new Date().toISOString(),
      generation_time_ms: generationTime
    };
    
    // Only include usage stats for authenticated users
    if (updatedUsage) {
      responseData.usage = {
        briefs_used: updatedUsage.used,
        briefs_limit: updatedUsage.limit,
        plan: updatedUsage.plan
      };
    }
    
    const response = NextResponse.json(responseData);
    return addCorsHeaders(response);

  } catch (error) {
    console.error('Extension API error:', error);
    
    // Handle specific errors
    let errorMessage = 'Internal server error';
    let statusCode = 500;
    
    if (error instanceof Error) {
      if (error.message.includes('Brief limit exceeded')) {
        errorMessage = error.message;
        statusCode = 403;
      } else if (error.message.includes('Failed to create')) {
        errorMessage = 'Failed to save brief. Please try again.';
        statusCode = 500;
      }
    }
    
    const response = NextResponse.json(
      { 
        success: false,
        error: errorMessage 
      } as BriefGenerationResponse, 
      { status: statusCode }
    );
    return addCorsHeaders(response);
  }
}

// Database integration complete - briefs are now saved to Supabase
