// Analytics endpoint for extension events
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { eventType, userId, userEmail, extensionId, metadata } = body

    if (!eventType) {
      return NextResponse.json(
        { error: 'Event type is required' },
        { status: 400 }
      )
    }

    // Use service role client to bypass RLS for analytics
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })

    // Insert analytics event
    const { data, error } = await supabase
      .from('extension_analytics')
      .insert({
        event_type: eventType,
        user_id: userId || null,
        user_email: userEmail || null,
        extension_id: extensionId || null,
        metadata: metadata || {}
      })
      .select()
      .single()

    if (error) {
      console.error('Analytics insert error:', error)
      return NextResponse.json(
        { error: 'Failed to log event' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true, event: data })
  } catch (error: any) {
    console.error('Analytics error:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}

