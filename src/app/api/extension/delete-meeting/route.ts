import { NextRequest, NextResponse } from 'next/server';
import { MeetingService } from '@/lib/database';

// Add CORS headers for extension requests
function addCorsHeaders(response: NextResponse) {
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'DELETE, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  return response;
}

export async function OPTIONS(_request: NextRequest) {
  const response = new NextResponse(null, { status: 204 });
  return addCorsHeaders(response);
}

export async function DELETE(request: NextRequest) {
  try {
    console.log('Extension API called - deleting meeting...');

    // Get authorization header
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      const response = NextResponse.json({ error: 'Authorization required' }, { status: 401 });
      return addCorsHeaders(response);
    }

    // Get meetingId and userId from query params
    const { searchParams } = new URL(request.url);
    const meetingId = searchParams.get('meetingId');
    const userId = searchParams.get('userId');
    
    if (!meetingId || !userId) {
      const response = NextResponse.json({ error: 'Meeting ID and User ID required' }, { status: 400 });
      return addCorsHeaders(response);
    }

    // Delete the meeting (briefs are deleted automatically via CASCADE)
    const success = await MeetingService.deleteMeeting(meetingId, userId);
    
    if (!success) {
      const response = NextResponse.json({ 
        success: false,
        error: 'Failed to delete meeting' 
      }, { status: 500 });
      return addCorsHeaders(response);
    }

    const response = NextResponse.json({
      success: true,
      message: 'Meeting deleted successfully'
    });
    
    return addCorsHeaders(response);

  } catch (error) {
    console.error('Extension API error:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    
    const response = NextResponse.json(
      { 
        success: false,
        error: errorMessage 
      }, 
      { status: 500 }
    );
    return addCorsHeaders(response);
  }
}



