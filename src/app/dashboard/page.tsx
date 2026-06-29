'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

const C = {
  bg: '#08060F', card: 'rgba(255,255,255,0.035)', border: '1px solid rgba(255,255,255,0.08)',
  borderP: '1px solid rgba(139,92,246,0.3)', text: '#fff', muted: '#A1A1AA', faint: '#52525B',
  purple: '#8B5CF6', lavender: '#C4B5FD', font: '-apple-system,BlinkMacSystemFont,system-ui,sans-serif',
}
const inputStyle: any = { width: '100%', background: 'rgba(255,255,255,0.05)', border: C.border, borderRadius: 12, padding: '13px 16px', color: C.text, fontSize: 14, outline: 'none', boxSizing: 'border-box' }
const labelStyle: any = { fontSize: 12, color: C.muted, display: 'block', marginBottom: 6 }

export default function Dashboard() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [tab, setTab] = useState('profile')
  const [services, setServices] = useState<any[]>([])
  const [menu, setMenu] = useState<any[]>([])
  const [slots, setSlots] = useState<any[]>([])
  const [bookings, setBookings] = useState<any[]>([])
  const [newSv, setNewSv] = useState({ name: '', price: '', duration_minutes: '' })
  const [newMn, setNewMn] = useState({ name: '', description: '', price: '', category: '' })
  const [newSlot, setNewSlot] = useState('')
  const [form, setForm] = useState({
    username: '', business_name: '', business_type: 'generic', bio: '',
    phone: '', address: '', instagram: '', tiktok: '', facebook: '', whatsapp: '',
  })

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }
      setUser(user)
      const { data: p } = await supabase.from('profiles').select('*').eq('user_id', user.id).single()
      if (p) {
        setProfile(p)
        setForm({ username: p.username||'', business_name: p.business_name||'', business_type: p.business_type||'generic', bio: p.bio||'', phone: p.phone||'', address: p.address||'', instagram: p.instagram||'', tiktok: p.tiktok||'', facebook: p.facebook||'', whatsapp: p.whatsapp||'' })
        const { data: sv } = await supabase.from('services').select('*').eq('profile_id', p.id)
        setServices(sv||[])
        const { data: mn } = await supabase.from('menu_items').select('*').eq('profile_id', p.id)
        setMenu(mn||[])
        const { data: sl } = await supabase.from('booking_slots').select('*').eq('profile_id', p.id).order('slot_datetime')
        setSlots(sl||[])
        setBookings((sl||[]).filter((x:any)=>x.is_booked))
      }
      setLoading(false)
    }
    load()
  }, [router])

  async function save() {
    if (!form.username) return alert('Username is required')
    setSaving(true)
    if (profile) { await supabase.from('profiles').update(form).eq('id', profile.id) }
    else { const { data } = await supabase.from('profiles').insert({ ...form, user_id: user.id }).select().single(); setProfile(data) }
    setSaving(false); setSaved(true); setTimeout(()=>setSaved(false), 2500)
  }
  async function addSv() {
    if (!newSv.name || !profile) return
    const { data } = await supabase.from('services').insert({ name: newSv.name, price: parseFloat(newSv.price)||0, duration_minutes: parseInt(newSv.duration_minutes)||30, profile_id: profile.id }).select().single()
    if (data) { setServices([...services, data]); setNewSv({ name:'', price:'', duration_minutes:'' }) }
  }
  async function delSv(id: string) { await supabase.from('services').delete().eq('id', id); setServices(services.filter(x=>x.id!==id)) }
  async function addMn() {
    if (!newMn.name || !profile) return
    const { data } = await supabase.from('menu_items').insert({ name: newMn.name, description: newMn.description, price: parseFloat(newMn.price)||0, category: newMn.category||'Other', profile_id: profile.id }).select().single()
    if (data) { setMenu([...menu, data]); setNewMn({ name:'', description:'', price:'', category:'' }) }
  }
  async function delMn(id: string) { await supabase.from('menu_items').delete().eq('id', id); setMenu(menu.filter(x=>x.id!==id)) }
  async function addSlot() {
    if (!newSlot || !profile) return
    const { data } = await supabase.from('booking_slots').insert({ slot_datetime: newSlot, profile_id: profile.id, is_booked: false }).select().single()
    if (data) { setSlots([...slots, data]); setNewSlot('') }
  }
  async function delSlot(id: string) { await supabase.from('booking_slots').delete().eq('id', id); setSlots(slots.filter(x=>x.id!==id)) }
  async function upQr(e: any) {
    const f = e.target.files[0]; if (!f || !profile) return
    const { data } = await supabase.storage.from('qr-codes').upload(profile.id+'/qr.png', f, { upsert: true })
    if (data) { const { data: u } = supabase.storage.from('qr-codes').getPublicUrl(profile.id+'/qr.png'); await supabase.from('profiles').update({ payment_qr_url: u.publicUrl }).eq('id', profile.id); alert('QR uploaded') }
  }
  async function upAvatar(e: any) {
    const f = e.target.files[0]; if (!f || !profile) return
    const { data } = await supabase.storage.from('avatars').upload(profile.id+'/a.png', f, { upsert: true })
    if (data) { const { data: u } = supabase.storage.from('avatars').getPublicUrl(profile.id+'/a.png'); await supabase.from('profiles').update({ profile_image_url: u.publicUrl }).eq('id', profile.id); alert('Photo uploaded') }
  }
  async function signOut() { await supabase.auth.signOut(); router.push('/') }

  if (loading) return <div style={{ minHeight: '100vh', background: C.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: C.font }}><p style={{ color: C.muted }}>Loading…</p></div>

  const tabs: any[] = [['profile','Profile','👤'], ['social','Social','🔗']]
  if (form.business_type === 'barber') tabs.push(['services','Services','✂️'], ['slots','Slots','📅'], ['bookings','Bookings','📋'])
  if (form.business_type === 'food') tabs.push(['menu','Menu','🍜'], ['payment','Payment','💳'])

  return (
    <main style={{ minHeight: '100vh', background: C.bg, color: C.text, fontFamily: C.font }}>
      <nav style={{ background: 'rgba(8,6,15,0.7)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,255,255,0.05)', padding: '14px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 100 }}>
        <span style={{ fontWeight: 700, fontSize: 17, display: 'flex', alignItems: 'center', gap: 7 }}><span style={{ width: 24, height: 24, borderRadius: 7, background: 'linear-gradient(135deg,#8B5CF6,#6D28D9)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 13 }}>◈</span>Cardly</span>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          {form.username && <a href={'/u/'+form.username} target="_blank" style={{ color: C.lavender, textDecoration: 'none', fontSize: 13, padding: '7px 14px', border: C.borderP, borderRadius: 100 }}>Preview →</a>}
          <button onClick={signOut} style={{ background: 'none', border: 'none', color: C.faint, cursor: 'pointer', fontSize: 13 }}>Sign out</button>
        </div>
      </nav>

      <div style={{ maxWidth: 640, margin: '0 auto', padding: '28px 20px 60px' }}>
        {form.username && (
          <div style={{ background: 'linear-gradient(135deg,rgba(139,92,246,0.12),rgba(109,40,217,0.06))', border: C.borderP, borderRadius: 18, padding: '18px 22px', marginBottom: 24 }}>
            <p style={{ fontSize: 11, color: C.purple, marginBottom: 5, letterSpacing: '1px', fontWeight: 600 }}>YOUR CARD LINK</p>
            <p style={{ fontSize: 15, fontWeight: 600, color: C.lavender, wordBreak: 'break-all' }}>cardly-blackmaria.vercel.app/u/{form.username}</p>
          </div>
        )}

        <div style={{ display: 'flex', gap: 4, marginBottom: 22, background: C.card, borderRadius: 14, padding: 5, border: C.border, overflowX: 'auto' }}>
          {tabs.map(([k,l,e])=>(
            <button key={k} onClick={()=>setTab(k)} style={{ flex: 1, minWidth: 80, padding: '10px 12px', borderRadius: 10, border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 600, whiteSpace: 'nowrap', background: tab===k?'linear-gradient(135deg,#8B5CF6,#6D28D9)':'transparent', color: tab===k?'#fff':C.muted }}>{e} {l}</button>
          ))}
        </div>

        {tab === 'profile' && (
          <div style={{ background: C.card, border: C.border, borderRadius: 20, padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
            <h2 style={{ fontSize: 17, fontWeight: 700, margin: 0 }}>Business info</h2>
            <div><label style={labelStyle}>Username (card URL)</label><input style={inputStyle} placeholder="adambarber" value={form.username} onChange={e=>setForm({...form, username: e.target.value.toLowerCase().replace(/[^a-z0-9]/g,'')})} /></div>
            <div><label style={labelStyle}>Business name</label><input style={inputStyle} placeholder="Adam Barbershop" value={form.business_name} onChange={e=>setForm({...form, business_name: e.target.value})} /></div>
            <div><label style={labelStyle}>Business type</label>
              <select style={{...inputStyle, background: '#15102B'}} value={form.business_type} onChange={e=>setForm({...form, business_type: e.target.value})}>
                <option value="generic">General business</option><option value="barber">Barber / Salon</option><option value="food">Food and Drinks</option>
              </select></div>
            <div><label style={labelStyle}>Bio</label><textarea style={{...inputStyle, resize: 'none'}} rows={3} placeholder="Tell customers about you…" value={form.bio} onChange={e=>setForm({...form, bio: e.target.value})} /></div>
            <div><label style={labelStyle}>Phone</label><input style={inputStyle} placeholder="0123456789" value={form.phone} onChange={e=>setForm({...form, phone: e.target.value})} /></div>
            <div><label style={labelStyle}>Address</label><input style={inputStyle} placeholder="Jalan Ampang, KL" value={form.address} onChange={e=>setForm({...form, address: e.target.value})} /></div>
            <div><label style={labelStyle}>Profile photo</label><input type="file" accept="image/*" onChange={upAvatar} style={{ fontSize: 13, color: C.muted }} /></div>
            <button onClick={save} disabled={saving} style={{ background: 'linear-gradient(135deg,#8B5CF6,#6D28D9)', color: '#fff', border: 'none', borderRadius: 12, padding: '14px', fontSize: 15, fontWeight: 700, cursor: 'pointer', opacity: saving?0.6:1 }}>{saving?'Saving…':saved?'✓ Saved':'Save profile'}</button>
          </div>
        )}

        {tab === 'social' && (
          <div style={{ background: C.card, border: C.border, borderRadius: 20, padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
            <h2 style={{ fontSize: 17, fontWeight: 700, margin: 0 }}>Social media</h2>
            {[['instagram','Instagram','username'],['tiktok','TikTok','username'],['facebook','Facebook','username or page'],['whatsapp','WhatsApp','60123456789']].map(([k,l,p])=>(
              <div key={k}><label style={labelStyle}>{l}</label><input style={inputStyle} placeholder={p} value={(form as any)[k]} onChange={e=>setForm({...form, [k]: e.target.value})} /></div>
            ))}
            <button onClick={save} disabled={saving} style={{ background: 'linear-gradient(135deg,#8B5CF6,#6D28D9)', color: '#fff', border: 'none', borderRadius: 12, padding: '14px', fontSize: 15, fontWeight: 700, cursor: 'pointer', opacity: saving?0.6:1 }}>{saving?'Saving…':saved?'✓ Saved':'Save'}</button>
          </div>
        )}

        {tab === 'services' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ background: C.card, border: C.border, borderRadius: 20, padding: 24 }}>
              <h2 style={{ fontSize: 17, fontWeight: 700, margin: '0 0 16px' }}>Add service</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <input style={inputStyle} placeholder="Service name (Haircut)" value={newSv.name} onChange={e=>setNewSv({...newSv, name: e.target.value})} />
                <div style={{ display: 'flex', gap: 10 }}>
                  <input style={inputStyle} placeholder="Price (25)" value={newSv.price} onChange={e=>setNewSv({...newSv, price: e.target.value})} />
                  <input style={inputStyle} placeholder="Mins (30)" value={newSv.duration_minutes} onChange={e=>setNewSv({...newSv, duration_minutes: e.target.value})} />
                </div>
                <button onClick={addSv} style={{ background: 'linear-gradient(135deg,#8B5CF6,#6D28D9)', color: '#fff', border: 'none', borderRadius: 12, padding: '12px', fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>+ Add service</button>
              </div>
            </div>
            {services.map(sv=>(
              <div key={sv.id} style={{ background: C.card, border: C.border, borderRadius: 14, padding: '14px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div><p style={{ fontWeight: 600, margin: '0 0 3px' }}>{sv.name}</p><p style={{ fontSize: 13, color: C.muted, margin: 0 }}>RM {sv.price} · {sv.duration_minutes} min</p></div>
                <button onClick={()=>delSv(sv.id)} style={{ background: 'rgba(239,68,68,0.12)', color: '#F87171', border: '1px solid rgba(239,68,68,0.25)', borderRadius: 8, padding: '6px 12px', fontSize: 12, cursor: 'pointer' }}>Delete</button>
              </div>
            ))}
          </div>
        )}

        {tab === 'slots' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ background: C.card, border: C.border, borderRadius: 20, padding: 24 }}>
              <h2 style={{ fontSize: 17, fontWeight: 700, margin: '0 0 8px' }}>Add booking slot</h2>
              <p style={{ fontSize: 13, color: C.muted, margin: '0 0 16px' }}>Pick a date and time customers can book</p>
              <div style={{ display: 'flex', gap: 10 }}>
                <input type="datetime-local" style={inputStyle} value={newSlot} onChange={e=>setNewSlot(e.target.value)} />
                <button onClick={addSlot} style={{ background: 'linear-gradient(135deg,#8B5CF6,#6D28D9)', color: '#fff', border: 'none', borderRadius: 12, padding: '0 20px', fontSize: 14, fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap' }}>+ Add</button>
              </div>
            </div>
            {slots.map(sl=>(
              <div key={sl.id} style={{ background: C.card, border: C.border, borderRadius: 14, padding: '14px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div><p style={{ fontWeight: 600, margin: '0 0 3px' }}>{new Date(sl.slot_datetime).toLocaleString('en-MY', { weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</p><p style={{ fontSize: 12, color: sl.is_booked?'#F87171':'#34D399', margin: 0 }}>{sl.is_booked?'Booked by '+(sl.customer_name||'customer'):'Available'}</p></div>
                <button onClick={()=>delSlot(sl.id)} style={{ background: 'rgba(239,68,68,0.12)', color: '#F87171', border: '1px solid rgba(239,68,68,0.25)', borderRadius: 8, padding: '6px 12px', fontSize: 12, cursor: 'pointer' }}>Delete</button>
              </div>
            ))}
          </div>
        )}

        {tab === 'menu' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ background: C.card, border: C.border, borderRadius: 20, padding: 24 }}>
              <h2 style={{ fontSize: 17, fontWeight: 700, margin: '0 0 16px' }}>Add menu item</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <input style={inputStyle} placeholder="Item name (Nasi Lemak)" value={newMn.name} onChange={e=>setNewMn({...newMn, name: e.target.value})} />
                <input style={inputStyle} placeholder="Description (optional)" value={newMn.description} onChange={e=>setNewMn({...newMn, description: e.target.value})} />
                <div style={{ display: 'flex', gap: 10 }}>
                  <input style={inputStyle} placeholder="Price (8.50)" value={newMn.price} onChange={e=>setNewMn({...newMn, price: e.target.value})} />
                  <input style={inputStyle} placeholder="Category (Rice)" value={newMn.category} onChange={e=>setNewMn({...newMn, category: e.target.value})} />
                </div>
                <button onClick={addMn} style={{ background: 'linear-gradient(135deg,#8B5CF6,#6D28D9)', color: '#fff', border: 'none', borderRadius: 12, padding: '12px', fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>+ Add item</button>
              </div>
            </div>
            {menu.map(mn=>(
              <div key={mn.id} style={{ background: C.card, border: C.border, borderRadius: 14, padding: '14px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div><p style={{ fontWeight: 600, margin: '0 0 3px' }}>{mn.name} <span style={{ fontSize: 11, color: C.purple }}>· {mn.category}</span></p><p style={{ fontSize: 13, color: C.muted, margin: 0 }}>RM {mn.price}</p></div>
                <button onClick={()=>delMn(mn.id)} style={{ background: 'rgba(239,68,68,0.12)', color: '#F87171', border: '1px solid rgba(239,68,68,0.25)', borderRadius: 8, padding: '6px 12px', fontSize: 12, cursor: 'pointer' }}>Delete</button>
              </div>
            ))}
          </div>
        )}

        {tab === 'bookings' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ background: C.card, border: C.border, borderRadius: 20, padding: 24 }}>
              <h2 style={{ fontSize: 17, fontWeight: 700, margin: '0 0 6px' }}>Your bookings</h2>
              <p style={{ fontSize: 13, color: C.muted, margin: 0 }}>{bookings.length} customer{bookings.length===1?'':'s'} booked</p>
            </div>
            {bookings.length === 0 ? (
              <div style={{ background: C.card, border: C.border, borderRadius: 16, padding: 32, textAlign: 'center' }}>
                <div style={{ fontSize: 36, marginBottom: 10 }}>📭</div>
                <p style={{ color: C.muted, fontSize: 14, margin: 0 }}>No bookings yet. Share your card to get some!</p>
              </div>
            ) : bookings.map(b => (
              <div key={b.id} style={{ background: C.card, border: C.border, borderRadius: 16, padding: '16px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <p style={{ fontWeight: 600, fontSize: 15, margin: '0 0 3px' }}>{b.customer_name || 'Customer'}</p>
                  <p style={{ fontSize: 13, color: C.muted, margin: '0 0 4px' }}>{new Date(b.slot_datetime).toLocaleString('en-MY', { weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</p>
                  {b.customer_phone && <a href={'tel:'+b.customer_phone} style={{ fontSize: 13, color: C.lavender, textDecoration: 'none' }}>📞 {b.customer_phone}</a>}
                </div>
                {b.customer_phone && <a href={'https://wa.me/'+b.customer_phone.replace(/[^0-9]/g,'').replace(/^0/,'60')} target="_blank" style={{ background: 'rgba(34,197,94,0.12)', color: '#34D399', border: '1px solid rgba(34,197,94,0.25)', borderRadius: 100, padding: '7px 14px', fontSize: 12, textDecoration: 'none', fontWeight: 600 }}>WhatsApp</a>}
              </div>
            ))}
          </div>
        )}

        {tab === 'payment' && (
          <div style={{ background: C.card, border: C.border, borderRadius: 20, padding: 24 }}>
            <h2 style={{ fontSize: 17, fontWeight: 700, margin: '0 0 8px' }}>Payment QR</h2>
            <p style={{ fontSize: 13, color: C.muted, margin: '0 0 18px', lineHeight: 1.5 }}>Upload your DuitNow or Touch n Go QR code. Customers scan it to pay for their order.</p>
            {profile?.payment_qr_url && <img src={profile.payment_qr_url} alt="QR" style={{ width: 160, height: 160, borderRadius: 12, marginBottom: 16, objectFit: 'cover' }} />}
            <input type="file" accept="image/*" onChange={upQr} style={{ fontSize: 13, color: C.muted }} />
          </div>
        )}
      </div>
    </main>
  )
}
