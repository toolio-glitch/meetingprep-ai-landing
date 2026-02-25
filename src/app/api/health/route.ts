import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

export async function GET() {
  const status: Record<string, string> = { api: 'ok' }

  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: { autoRefreshToken: false, persistSession: false }
    })

    const { error } = await supabase.from('user_subscriptions').select('id').limit(1)
    status.database = error ? 'error' : 'ok'
  } catch {
    status.database = 'error'
  }

  const healthy = Object.values(status).every(v => v === 'ok')

  return NextResponse.json(
    { status: healthy ? 'healthy' : 'degraded', services: status, timestamp: new Date().toISOString() },
    { status: healthy ? 200 : 503 }
  )
}
