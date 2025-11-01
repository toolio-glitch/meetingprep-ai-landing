import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';

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
    const { email, password } = await request.json();
    
    if (!email || !password) {
      const response = NextResponse.json(
        { error: 'Email and password required' }, 
        { status: 400 }
      );
      return addCorsHeaders(response);
    }

    const supabase = await createClient();
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      const response = NextResponse.json(
        { error: error.message }, 
        { status: 400 }
      );
      return addCorsHeaders(response);
    }

    const response = NextResponse.json({
      user: data.user,
      session: data.session,
    });
    return addCorsHeaders(response);

  } catch (error) {
    console.error('Login API error:', error);
    const response = NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    );
    return addCorsHeaders(response);
  }
}