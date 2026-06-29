'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

// Change this to YOUR email — only you can see the admin panel
const ADMIN_EMAIL = 'mhaziqizzudin1506@gmail.com'

export default function Admin() {
  const [authed, setAuthed] = useState<boolean | null>(null)
  const [profiles, setProfiles] = useState<any[]>([])
  const [bookings, setBookings] = useState<any[]>([])
  const [stats, setStats] = useState({ total: 0, barber: 0, food: 0, generic: 0, booked: 0 })

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user || user.email !== ADMIN_EMAIL) { setAuthed(false); return }
      setAuthed(true)

      const { data: profs } = await supabase.from('profiles').select('*').order('created_at', { ascending: false })
      const { data: slots } = await supabase.from('booking_slots').select('*').eq('is_booked', true).order('slot_datetime', { ascending: false })
      setProfiles(profs || [])
      setBookings(slots || [])
      setStats({
        total: profs?.length || 0,
        barber: profs?.filter(p => p.business_type === 'barber').length || 0,
        food: profs?.filter(p => p.business_type === 'food').length || 0,
        generic: profs?.filter(p => p.business_type === 'generic').length || 0,
        booked: slots?.length || 0,
      })
    }
    load()
  }, [])

  const C = { card: 'rgba(255,255,255,0.035)', border: '1px solid rgba(255,255,255,0.08)' }

  if (authed === null) return <div style={{ minHeight: '100vh', background: '#08060F', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#71717A', fontFamily: 'system-ui' }}>Loading…</div>
  if (authed === false) return (
    <div style={{ minHeight: '100vh', background: '#08060F', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'system-ui', padding: 24 }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 44, marginBottom: 16 }}>🔒</div>
        <p style={{ color: '#fff', fontWeight: 600, fontSize: 18, margin: '0 0 6px' }}>Admin only</p>
        <p style={{ color: '#71717A', fontSize: 14, margin: '0 0 20px' }}>Sign in with the owner account.</p>
        <Link href="/login" style={{ color: '#C4B5FD', textDecoration: 'none', fontSize: 14 }}>Go to login →</Link>
      </div>
    </div>
  )

  const typeMeta: any = { barber: { e: '✂️', c: '#8B5CF6' }, food: { e: '🍜', c: '#EC4899' }, generic: { e: '🏪', c: '#06B6D4' } }

  return (
    <main style={{ minHeight: '100vh', background: '#08060F', color: '#fff', fontFamily: '-apple-system,BlinkMacSystemFont,system-ui,sans-serif', paddingBottom: 60 }}>
      <nav style={{ background: 'rgba(8,6,15,0.7)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,255,255,0.05)', padding: '14px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 100 }}>
        <span style={{ fontWeight: 700, fontSize: 17 }}>◈ Cardly <span style={{ color: '#8B5CF6', fontSize: 13 }}>Admin</span></span>
        <Link href="/dashboard" style={{ color: '#A1A1AA', textDecoration: 'none', fontSize: 13 }}>My dashboard →</Link>
      </nav>

      <div style={{ maxWidth: 800, margin: '0 auto', padding: '32px 20px' }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, letterSpacing: '-1px', margin: '0 0 24px' }}>Overview</h1>

        {/* STATS */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: 12, marginBottom: 36 }}>
          {[
            { label: 'Total businesses', value: stats.total, color: '#fff' },
            { label: 'Barbers', value: stats.barber, color: '#8B5CF6' },
            { label: 'Food vendors', value: stats.food, color: '#EC4899' },
            { label: 'Other', value: stats.generic, color: '#06B6D4' },
            { label: 'Total bookings', value: stats.booked, color: '#30D158' },
          ].map((s, i) => (
            <div key={i} style={{ background: C.card, border: C.border, borderRadius: 16, padding: '18px 20px' }}>
              <p style={{ fontSize: 28, fontWeight: 700, color: s.color, margin: '0 0 4px', letterSpacing: '-1px' }}>{s.value}</p>
              <p style={{ fontSize: 12, color: '#71717A', margin: 0 }}>{s.label}</p>
            </div>
          ))}
        </div>

        {/* ALL BUSINESSES */}
        <h2 style={{ fontSize: 18, fontWeight: 700, margin: '0 0 16px' }}>All businesses</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 36 }}>
          {profiles.map(p => {
            const m = typeMeta[p.business_type] || typeMeta.generic
            return (
              <div key={p.id} style={{ background: C.card, border: C.border, borderRadius: 14, padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 14 }}>
                <span style={{ fontSize: 22 }}>{m.e}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontWeight: 600, fontSize: 15, margin: '0 0 2px' }}>{p.business_name || '(no name)'}</p>
                  <p style={{ fontSize: 12, color: '#71717A', margin: 0 }}>/u/{p.username} · {p.phone || 'no phone'}</p>
                </div>
                <a href={`/u/${p.username}`} target="_blank" style={{ color: m.c, fontSize: 12, textDecoration: 'none', border: `1px solid ${m.c}40`, borderRadius: 100, padding: '5px 12px' }}>View</a>
              </div>
            )
          })}
          {profiles.length === 0 && <p style={{ color: '#52525B', fontSize: 14 }}>No businesses yet.</p>}
        </div>

        {/* RECENT BOOKINGS */}
        <h2 style={{ fontSize: 18, fontWeight: 700, margin: '0 0 16px' }}>Recent bookings</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {bookings.map(b => (
            <div key={b.id} style={{ background: C.card, border: C.border, borderRadius: 14, padding: '14px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <p style={{ fontWeight: 600, fontSize: 14, margin: '0 0 2px' }}>{b.customer_name || 'Customer'}</p>
                <p style={{ fontSize: 12, color: '#71717A', margin: 0 }}>{b.customer_phone} · {new Date(b.slot_datetime).toLocaleString('en-MY', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</p>
              </div>
              <span style={{ fontSize: 11, color: '#30D158', background: 'rgba(48,209,88,0.1)', borderRadius: 100, padding: '4px 12px' }}>Booked</span>
            </div>
          ))}
          {bookings.length === 0 && <p style={{ color: '#52525B', fontSize: 14 }}>No bookings yet.</p>}
        </div>
      </div>
    </main>
  )
}
