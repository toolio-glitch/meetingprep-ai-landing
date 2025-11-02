import { NextRequest, NextResponse } from 'next/server';
import { MeetingPrepService } from '@/lib/database';

// Add CORS headers for extension requests
function addCorsHeaders(response: NextResponse) {
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'GET, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  return response;
}

export async function OPTIONS(_request: NextRequest) {
  const response = new NextResponse(null, { status: 204 });
  return addCorsHeaders(response);
}

export async function GET(request: NextRequest) {
  try {
    console.log('Extension API called - fetching meetings...');

    // Get authorization header
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      const response = NextResponse.json({ error: 'Authorization required' }, { status: 401 });
      return addCorsHeaders(response);
    }

    const token = authHeader.substring(7);
    
    // Get userId from query params (extension passes it)
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    
    if (!userId) {
      const response = NextResponse.json({ error: 'User ID required' }, { status: 400 });
      return addCorsHeaders(response);
    }

    // Fetch user meetings with their briefs
    const meetings = await MeetingPrepService.getUserMeetingsWithBriefs(userId, 50);
    
    const response = NextResponse.json({
      success: true,
      meetings: meetings
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

