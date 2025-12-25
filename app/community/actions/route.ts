import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}))
  const feature = body?.feature
  const payload = body?.payload

  if (!feature || !payload) {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 })
  }

  // This is client-ready behavior:
  // - returns a reference number
  // - you can later replace with DB write (Supabase)
  const ref = Math.random().toString(16).slice(2, 8).toUpperCase()

  return NextResponse.json({ ok: true, ref })
}
