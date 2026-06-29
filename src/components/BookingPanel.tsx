'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function BookingPanel({ services, slots }: any) {
  const [selSlot, setSelSlot] = useState('')
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [booked, setBooked] = useState(false)
  const [busy, setBusy] = useState(false)

  async function book() {
    if (!selSlot) return alert('Pick a time slot')
    if (!name || !phone) return alert('Enter your name and phone')
    setBusy(true)
    const { error } = await supabase.from('booking_slots').update({ is_booked: true, customer_name: name, customer_phone: phone }).eq('id', selSlot)
    setBusy(false)
    if (!error) setBooked(true); else alert('Booking failed, try again')
  }

  if (booked) return (
    <div style={{ margin: '0 20px' }}>
      <div style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)', borderRadius: 20, padding: 32, textAlign: 'center' }}>
        <div style={{ fontSize: 44, marginBottom: 12 }}>✓</div>
        <p style={{ color: '#fff', fontWeight: 700, fontSize: 18, margin: '0 0 6px' }}>Booking confirmed!</p>
        <p style={{ color: '#86EFAC', fontSize: 14, margin: 0 }}>See you soon, {name}.</p>
      </div>
    </div>
  )

  const inp: any = { width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, padding: '13px 16px', color: '#fff', fontSize: 14, outline: 'none', boxSizing: 'border-box' }

  return (
    <div style={{ margin: '0 20px', display: 'flex', flexDirection: 'column', gap: 16 }}>
      {services.length > 0 && (
        <div>
          <p style={{ fontSize: 11, color: '#8B5CF6', letterSpacing: '1px', fontWeight: 600, margin: '0 0 12px' }}>✂️ SERVICES</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {services.map((s:any)=>(
              <div key={s.id} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, padding: '14px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div><p style={{ color: '#fff', fontWeight: 600, margin: '0 0 3px', fontSize: 15 }}>{s.name}</p><p style={{ color: '#71717A', fontSize: 12, margin: 0 }}>{s.duration_minutes} min</p></div>
                <span style={{ color: '#C4B5FD', fontWeight: 700, fontSize: 15 }}>RM {s.price}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div>
        <p style={{ fontSize: 11, color: '#8B5CF6', letterSpacing: '1px', fontWeight: 600, margin: '0 0 12px' }}>📅 PICK A SLOT</p>
        {slots.length === 0 ? (
          <p style={{ color: '#52525B', fontSize: 14 }}>No slots available right now.</p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            {slots.map((sl:any)=>(
              <button key={sl.id} onClick={()=>setSelSlot(sl.id)} style={{ background: selSlot===sl.id?'linear-gradient(135deg,#8B5CF6,#6D28D9)':'rgba(255,255,255,0.04)', border: selSlot===sl.id?'1px solid #8B5CF6':'1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: '12px', color: '#fff', fontSize: 13, cursor: 'pointer', textAlign: 'left' }}>
                {new Date(sl.slot_datetime).toLocaleString('en-MY', { weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
              </button>
            ))}
          </div>
        )}
      </div>

      {slots.length > 0 && (
        <>
          <input style={inp} placeholder="Your name" value={name} onChange={e=>setName(e.target.value)} />
          <input style={inp} placeholder="Phone number" value={phone} onChange={e=>setPhone(e.target.value)} />
          <button onClick={book} disabled={busy} style={{ background: 'linear-gradient(135deg,#8B5CF6,#6D28D9)', color: '#fff', border: 'none', borderRadius: 14, padding: '15px', fontSize: 15, fontWeight: 700, cursor: 'pointer', opacity: busy?0.6:1 }}>{busy?'Booking…':'Confirm booking'}</button>
        </>
      )}
    </div>
  )
}
