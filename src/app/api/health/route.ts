import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

export async function GET() {
  const startTime = Date.now()

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseKey) {
    return NextResponse.json(
      {
        status: 'error',
        message: 'Supabase credentials are not configured',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    )
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseKey, {
      auth: { persistSession: false },
    })

    // Perform a lightweight query to wake up/keep active the Supabase database
    const { error } = await supabase
      .from('resort_settings')
      .select('id')
      .limit(1)
      .maybeSingle()

    const latencyMs = Date.now() - startTime

    if (error) {
      return NextResponse.json(
        {
          status: 'unhealthy',
          database: 'error',
          error: error.message,
          latencyMs,
          timestamp: new Date().toISOString(),
        },
        { status: 502 }
      )
    }

    return NextResponse.json(
      {
        status: 'ok',
        database: 'connected',
        property: 'piero',
        latencyMs,
        timestamp: new Date().toISOString(),
      },
      {
        status: 200,
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate',
        },
      }
    )
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json(
      {
        status: 'error',
        message,
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    )
  }
}

export async function HEAD() {
  return GET()
}
