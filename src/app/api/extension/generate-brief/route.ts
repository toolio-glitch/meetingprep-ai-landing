import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';
import { generateMeetingBrief, type MeetingData } from '@/lib/openai';

// Add CORS headers for Chrome extension
function addCorsHeaders(response: NextResponse) {
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  return response;
}

export async function OPTIONS(request: NextRequest) {
  return addCorsHeaders(new NextResponse(null, { status: 200 }));
}

export async function POST(request: NextRequest) {
  try {
    // For now, skip auth verification and generate brief
    // TODO: Implement proper extension authentication later
    console.log('Extension API called - generating brief...');

    // Get meeting data from request
    const { meeting } = await request.json();
    
    if (!meeting) {
      const response = NextResponse.json({ error: 'Meeting data required' }, { status: 400 });
      return addCorsHeaders(response);
    }

    // Generate AI brief using OpenAI
    const brief = await generateMeetingBrief(meeting as MeetingData);
    
    // TODO: Save brief to database
    // await saveBriefToDatabase(user.id, meeting, brief);
    
    const response = NextResponse.json({ 
      brief,
      meeting,
      generated_at: new Date().toISOString()
    });
    return addCorsHeaders(response);

  } catch (error) {
    console.error('Extension API error:', error);
    const response = NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    );
    return addCorsHeaders(response);
  }
}

// Mock brief generation function removed - now using OpenAI integration

// TODO: Implement database saving
async function saveBriefToDatabase(userId: string, meeting: any, brief: string) {
  // This will save the generated brief to Supabase
  // For future implementation
}
