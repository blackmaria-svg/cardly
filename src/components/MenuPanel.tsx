'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function MenuPanel({ menuItems: initial, paymentQrUrl }: any) {
  const [items, setItems] = useState<any[]>(initial)
  const [cart, setCart] = useState<any[]>([])
  const [pay, setPay] = useState(false)
  const [done, setDone] = useState(false)
  const [busy, setBusy] = useState(false)

  const cats = [...new Set(items.map((i:any)=>i.category||'Other'))] as string[]
  const total = cart.reduce((s,i)=>s+i.price*i.qty, 0)
  const count = cart.reduce((s,i)=>s+i.qty, 0)

  function stockLeft(it:any) { return (it.stock||0) - (cart.find(c=>c.id===it.id)?.qty||0) }
  const qty = (id:string)=>cart.find(x=>x.id===id)?.qty||0

  function add(it:any) {
    if (stockLeft(it) <= 0) return
    setCart(p=>{ const e=p.find(x=>x.id===it.id); return e?p.map(x=>x.id===it.id?{...x,qty:x.qty+1}:x):[...p,{...it,qty:1}] })
  }
  function sub(id:string) {
    setCart(p=>{ const e=p.find(x=>x.id===id); return e?.qty===1?p.filter(x=>x.id!==id):p.map(x=>x.id===id?{...x,qty:x.qty-1}:x) })
  }

  async function confirmPaid() {
    setBusy(true)
    // reduce stock for each item bought
    for (const c of cart) {
      const item = items.find(i=>i.id===c.id)
      const newStock = Math.max(0, (item?.stock||0) - c.qty)
      await supabase.from('menu_items').update({ stock: newStock, is_available: newStock > 0 }).eq('id', c.id)
    }
    setItems(prev => prev.map(i => { const c = cart.find(x=>x.id===i.id); return c ? { ...i, stock: Math.max(0,(i.stock||0)-c.qty) } : i }))
    setBusy(false)
    setDone(true)
  }

  if (done) return (
    <div style={{ margin: '0 20px' }}>
      <div style={{ background: 'rgba(48,209,88,0.08)', border: '1px solid rgba(48,209,88,0.25)', borderRadius: 24, padding: 40, textAlign: 'center' }}>
        <div style={{ width: 64, height: 64, borderRadius: '50%', background: '#30D158', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32, margin: '0 auto 18px', color: '#fff' }}>✓</div>
        <p style={{ color: '#fff', fontWeight: 600, fontSize: 19, margin: '0 0 8px' }}>Order placed</p>
        <p style={{ color: '#86EFAC', fontSize: 14, margin: '0 0 18px' }}>Tunjuk bukti bayaran kat staff. Terima kasih!</p>
        <button onClick={()=>{ setDone(false); setPay(false); setCart([]) }} style={{ background: 'rgba(255,255,255,0.08)', color: '#fff', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 100, padding: '10px 24px', fontSize: 14, cursor: 'pointer' }}>Order lagi</button>
      </div>
    </div>
  )

  if (pay) return (
    <div style={{ margin: '0 20px' }}>
      <button onClick={()=>setPay(false)} style={{ background: 'none', border: 'none', color: '#C4B5FD', fontSize: 14, cursor: 'pointer', marginBottom: 16, padding: 0 }}>← Balik menu</button>
      <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 18, padding: 20, marginBottom: 14 }}>
        <p style={{ fontSize: 11, color: '#8B5CF6', letterSpacing: '1px', fontWeight: 600, margin: '0 0 14px' }}>ORDER ANDA</p>
        {cart.map(i=>(
          <div key={i.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.05)', fontSize: 14, color: '#E4E4E7' }}>
            <span>{i.name} × {i.qty}</span><span>RM {(i.price*i.qty).toFixed(2)}</span>
          </div>
        ))}
        <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 14, fontWeight: 700, fontSize: 16, color: '#fff' }}>
          <span>Total</span><span style={{ color: '#C4B5FD' }}>RM {total.toFixed(2)}</span>
        </div>
      </div>
      <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 18, padding: 24, textAlign: 'center' }}>
        <p style={{ color: '#fff', fontWeight: 600, fontSize: 16, margin: '0 0 4px' }}>Scan untuk bayar</p>
        <p style={{ color: '#71717A', fontSize: 12, margin: '0 0 18px' }}>DuitNow · Touch n Go · mana-mana QR</p>
        {paymentQrUrl ? (
          <img src={paymentQrUrl} alt="Pay QR" style={{ width: 200, height: 200, borderRadius: 14, margin: '0 auto', display: 'block', objectFit: 'cover' }} />
        ) : (
          <div style={{ width: 180, height: 180, background: 'rgba(255,255,255,0.05)', borderRadius: 14, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#52525B', fontSize: 13 }}>QR belum set</div>
        )}
      </div>
      <button onClick={confirmPaid} disabled={busy} style={{ width: '100%', marginTop: 14, background: 'linear-gradient(135deg,#8B5CF6,#6D28D9)', color: '#fff', border: 'none', borderRadius: 14, padding: '16px', fontSize: 15, fontWeight: 600, cursor: 'pointer', opacity: busy?0.6:1 }}>
        {busy ? 'Tunggu…' : "Saya dah bayar"}
      </button>
    </div>
  )

  return (
    <div style={{ margin: '0 20px' }}>
      {cats.map(cat=>(
        <div key={cat} style={{ marginBottom: 24 }}>
          <p style={{ fontSize: 11, color: '#8B5CF6', letterSpacing: '1px', fontWeight: 600, margin: '0 0 12px', textTransform: 'uppercase' }}>{cat}</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {items.filter((i:any)=>(i.category||'Other')===cat).map((it:any)=>{
              const left = stockLeft(it)
              const soldOut = (it.stock||0) <= 0
              return (
                <div key={it.id} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 14, opacity: soldOut?0.5:1 }}>
                  {it.image_url && <img src={it.image_url} alt={it.name} style={{ width: 56, height: 56, borderRadius: 12, objectFit: 'cover' }} />}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ color: '#fff', fontWeight: 600, fontSize: 15, margin: '0 0 2px' }}>{it.name}</p>
                    {it.description && <p style={{ color: '#71717A', fontSize: 12, margin: '0 0 4px' }}>{it.description}</p>}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <p style={{ color: '#C4B5FD', fontWeight: 700, fontSize: 14, margin: 0 }}>RM {Number(it.price).toFixed(2)}</p>
                      {soldOut ? <span style={{ fontSize: 11, color: '#FF453A', fontWeight: 600 }}>Sold out</span>
                        : <span style={{ fontSize: 11, color: left<=5?'#FF9F0A':'#30D158' }}>{left} left</span>}
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    {qty(it.id)>0 && (<><button onClick={()=>sub(it.id)} style={{ width: 30, height: 30, borderRadius: '50%', border: '1px solid rgba(139,92,246,0.4)', background: 'transparent', color: '#C4B5FD', fontSize: 18, cursor: 'pointer', lineHeight: 1 }}>−</button><span style={{ color: '#fff', fontSize: 14, fontWeight: 600, minWidth: 16, textAlign: 'center' }}>{qty(it.id)}</span></>)}
                    <button onClick={()=>add(it)} disabled={soldOut||left<=0} style={{ width: 30, height: 30, borderRadius: '50%', border: 'none', background: (soldOut||left<=0)?'rgba(255,255,255,0.1)':'linear-gradient(135deg,#8B5CF6,#6D28D9)', color: '#fff', fontSize: 18, cursor: (soldOut||left<=0)?'not-allowed':'pointer', lineHeight: 1 }}>+</button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      ))}
      {count > 0 && (
        <button onClick={()=>setPay(true)} style={{ position: 'fixed', bottom: 20, left: 20, right: 20, maxWidth: 440, margin: '0 auto', background: 'linear-gradient(135deg,#8B5CF6,#6D28D9)', color: '#fff', border: 'none', borderRadius: 16, padding: '16px', fontSize: 15, fontWeight: 700, cursor: 'pointer', boxShadow: '0 8px 32px rgba(139,92,246,0.5)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>View order ({count})</span><span>RM {total.toFixed(2)} →</span>
        </button>
      )}
    </div>
  )
}
