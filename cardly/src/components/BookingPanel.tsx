'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function BookingPanel({ services, slots }: any) {
  const [selSlot, setSelSlot] = useState<any>(null)
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [booked, setBooked] = useState(false)
  const [busy, setBusy] = useState(false)

  // group slots by date
  const byDate: Record<string, any[]> = {}
  slots.forEach((s: any) => {
    const d = new Date(s.slot_datetime)
    const key = d.toLocaleDateString('en-MY', { weekday: 'long', day: 'numeric', month: 'long' })
    if (!byDate[key]) byDate[key] = []
    byDate[key].push(s)
  })

  function status(slot: any) {
    if (slot.is_booked) return 'full'
    if (slot.waiting) return 'waiting'
    return 'open'
  }
  const dot = { open: '#30D158', waiting: '#FF9F0A', full: '#FF453A' }
  const dotLabel = { open: 'Available', waiting: 'Waiting', full: 'Full' }

  async function book() {
    if (!selSlot) return
    if (!name || !phone) return alert('Enter your name and phone')
    setBusy(true)
    const { error } = await supabase.from('booking_slots').update({ is_booked: true, customer_name: name, customer_phone: phone }).eq('id', selSlot.id)
    setBusy(false)
    if (!error) setBooked(true); else alert('Booking failed, try again')
  }

  if (booked) return (
    <div style={{ margin: '0 20px' }}>
      <div style={{ background: 'rgba(48,209,88,0.08)', border: '1px solid rgba(48,209,88,0.25)', borderRadius: 24, padding: 40, textAlign: 'center' }}>
        <div style={{ width: 64, height: 64, borderRadius: '50%', background: '#30D158', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32, margin: '0 auto 18px', color: '#fff' }}>✓</div>
        <p style={{ color: '#fff', fontWeight: 600, fontSize: 19, margin: '0 0 8px', letterSpacing: '-0.3px' }}>You're booked</p>
        <p style={{ color: '#86EFAC', fontSize: 14, margin: 0 }}>{selSlot && new Date(selSlot.slot_datetime).toLocaleString('en-MY', { weekday: 'long', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</p>
      </div>
    </div>
  )

  const inp: any = { width: '100%', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 14, padding: '15px 18px', color: '#fff', fontSize: 15, outline: 'none', boxSizing: 'border-box' }

  return (
    <div style={{ margin: '0 20px', display: 'flex', flexDirection: 'column', gap: 28 }}>

      {/* SERVICES */}
      {services.length > 0 && (
        <div>
          <p style={{ fontSize: 12, color: '#71717A', letterSpacing: '0.5px', fontWeight: 500, margin: '0 0 14px' }}>Services</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 1, background: 'rgba(255,255,255,0.06)', borderRadius: 18, overflow: 'hidden' }}>
            {services.map((s: any) => (
              <div key={s.id} style={{ background: '#0E0B1A', padding: '16px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div><p style={{ color: '#fff', fontWeight: 500, margin: '0 0 2px', fontSize: 15 }}>{s.name}</p><p style={{ color: '#71717A', fontSize: 13, margin: 0 }}>{s.duration_minutes} min</p></div>
                <span style={{ color: '#fff', fontWeight: 600, fontSize: 15 }}>RM {s.price}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* AVAILABILITY */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '0 0 16px' }}>
          <p style={{ fontSize: 12, color: '#71717A', letterSpacing: '0.5px', fontWeight: 500, margin: 0 }}>Availability</p>
          <div style={{ display: 'flex', gap: 14 }}>
            {(['open','waiting','full'] as const).map(k => (
              <span key={k} style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 11, color: '#A1A1AA' }}>
                <span style={{ width: 7, height: 7, borderRadius: '50%', background: dot[k] }} />{dotLabel[k]}
              </span>
            ))}
          </div>
        </div>

        {Object.keys(byDate).length === 0 ? (
          <p style={{ color: '#52525B', fontSize: 14 }}>No slots available right now.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {Object.entries(byDate).map(([date, daySlots]) => (
              <div key={date} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 20, padding: 18 }}>
                <p style={{ fontSize: 14, color: '#fff', fontWeight: 600, margin: '0 0 14px', letterSpacing: '-0.2px' }}>{date}</p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(88px, 1fr))', gap: 8 }}>
                  {daySlots.map((sl: any) => {
                    const st = status(sl)
                    const active = selSlot?.id === sl.id
                    const disabled = st === 'full'
                    return (
                      <button key={sl.id} disabled={disabled} onClick={() => setSelSlot(sl)}
                        style={{
                          background: active ? 'linear-gradient(135deg,#8B5CF6,#6D28D9)' : disabled ? 'rgba(255,69,58,0.06)' : 'rgba(255,255,255,0.04)',
                          border: active ? '1px solid #8B5CF6' : `1px solid ${disabled ? 'rgba(255,69,58,0.15)' : 'rgba(255,255,255,0.08)'}`,
                          borderRadius: 14, padding: '12px 8px', cursor: disabled ? 'not-allowed' : 'pointer',
                          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, opacity: disabled ? 0.5 : 1, transition: 'all 0.15s',
                        }}>
                        <span style={{ width: 8, height: 8, borderRadius: '50%', background: (dot as any)[st] }} />
                        <span style={{ fontSize: 13, fontWeight: 600, color: active ? '#fff' : disabled ? '#FF453A' : '#fff' }}>
                          {new Date(sl.slot_datetime).toLocaleTimeString('en-MY', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </button>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* BOOK FORM */}
      {selSlot && (
        <div className="fade-up" style={{ background: 'rgba(139,92,246,0.06)', border: '1px solid rgba(139,92,246,0.2)', borderRadius: 20, padding: 20, display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <p style={{ fontSize: 11, color: '#8B5CF6', letterSpacing: '0.5px', fontWeight: 600, margin: '0 0 4px' }}>SELECTED</p>
              <p style={{ color: '#fff', fontWeight: 600, fontSize: 15, margin: 0 }}>{new Date(selSlot.slot_datetime).toLocaleString('en-MY', { weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</p>
            </div>
            <button onClick={() => setSelSlot(null)} style={{ background: 'none', border: 'none', color: '#71717A', fontSize: 13, cursor: 'pointer' }}>Change</button>
          </div>
          <input style={inp} placeholder="Your name" value={name} onChange={e => setName(e.target.value)} />
          <input style={inp} placeholder="Phone number" value={phone} onChange={e => setPhone(e.target.value)} />
          <button onClick={book} disabled={busy} style={{ background: 'linear-gradient(135deg,#8B5CF6,#6D28D9)', color: '#fff', border: 'none', borderRadius: 14, padding: '16px', fontSize: 15, fontWeight: 600, cursor: 'pointer', opacity: busy ? 0.6 : 1, boxShadow: '0 8px 24px rgba(139,92,246,0.35)' }}>
            {busy ? 'Booking…' : 'Confirm booking'}
          </button>
        </div>
      )}
    </div>
  )
}
