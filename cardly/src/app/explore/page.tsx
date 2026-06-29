'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

export default function Explore() {
  const [profiles, setProfiles] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')

  useEffect(() => {
    async function load() {
      const { data } = await supabase.from('profiles').select('*').order('created_at', { ascending: false })
      setProfiles(data || [])
      setLoading(false)
    }
    load()
  }, [])

  const typeMeta: any = {
    barber: { emoji: '✂️', label: 'Barber', color: '#8B5CF6' },
    food: { emoji: '🍜', label: 'Food', color: '#EC4899' },
    generic: { emoji: '🏪', label: 'Business', color: '#06B6D4' },
  }

  const filtered = profiles.filter(p => {
    const matchType = filter === 'all' || p.business_type === filter
    const matchSearch = !search || p.business_name?.toLowerCase().includes(search.toLowerCase())
    return matchType && matchSearch
  })

  return (
    <main style={{ minHeight: '100vh', background: '#08060F', color: '#fff', fontFamily: '-apple-system,BlinkMacSystemFont,system-ui,sans-serif', paddingBottom: 60 }}>
      <nav style={{ background: 'rgba(8,6,15,0.7)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,255,255,0.05)', padding: '14px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 100 }}>
        <Link href="/" style={{ fontWeight: 700, fontSize: 17, color: '#fff', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 7 }}>
          <span style={{ width: 24, height: 24, borderRadius: 7, background: 'linear-gradient(135deg,#8B5CF6,#6D28D9)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 13 }}>◈</span>Cardly
        </Link>
        <Link href="/login" style={{ background: '#fff', color: '#08060F', textDecoration: 'none', fontSize: 13, padding: '8px 16px', borderRadius: 100, fontWeight: 600 }}>Get your card</Link>
      </nav>

      <div style={{ maxWidth: 720, margin: '0 auto', padding: '40px 20px 0' }}>
        <h1 style={{ fontSize: 'clamp(32px,6vw,48px)', fontWeight: 700, letterSpacing: '-2px', margin: '0 0 8px' }}>Discover</h1>
        <p style={{ fontSize: 15, color: '#A1A1AA', margin: '0 0 28px' }}>Browse every business on Cardly.</p>

        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search businesses…"
          style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 14, padding: '14px 18px', color: '#fff', fontSize: 15, outline: 'none', boxSizing: 'border-box', marginBottom: 16 }} />

        <div style={{ display: 'flex', gap: 8, marginBottom: 28, overflowX: 'auto' }}>
          {[['all','All'],['barber','✂️ Barber'],['food','🍜 Food'],['generic','🏪 Business']].map(([k,l])=>(
            <button key={k} onClick={()=>setFilter(k)} style={{ whiteSpace: 'nowrap', background: filter===k?'linear-gradient(135deg,#8B5CF6,#6D28D9)':'rgba(255,255,255,0.05)', border: filter===k?'none':'1px solid rgba(255,255,255,0.08)', color: '#fff', borderRadius: 100, padding: '9px 18px', fontSize: 14, fontWeight: 500, cursor: 'pointer' }}>{l}</button>
          ))}
        </div>

        {loading ? (
          <p style={{ color: '#52525B', textAlign: 'center', padding: 40 }}>Loading…</p>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 60 }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>🔍</div>
            <p style={{ color: '#A1A1AA', margin: 0 }}>No businesses found.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 14 }}>
            {filtered.map(p => {
              const m = typeMeta[p.business_type] || typeMeta.generic
              return (
                <Link key={p.id} href={`/u/${p.username}`} style={{ textDecoration: 'none', background: 'rgba(255,255,255,0.035)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 20, padding: 20, display: 'block', transition: 'all 0.2s' }}>
                  {p.profile_image_url ? (
                    <img src={p.profile_image_url} alt={p.business_name} style={{ width: 52, height: 52, borderRadius: '50%', objectFit: 'cover', marginBottom: 14 }} />
                  ) : (
                    <div style={{ width: 52, height: 52, borderRadius: '50%', background: `linear-gradient(135deg,${m.color},${m.color}99)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, marginBottom: 14 }}>{m.emoji}</div>
                  )}
                  <p style={{ color: '#fff', fontWeight: 600, fontSize: 16, margin: '0 0 4px', letterSpacing: '-0.3px' }}>{p.business_name || p.username}</p>
                  {p.bio && <p style={{ color: '#71717A', fontSize: 13, margin: '0 0 12px', lineHeight: 1.4, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{p.bio}</p>}
                  <span style={{ display: 'inline-block', fontSize: 11, color: m.color, background: `${m.color}1a`, border: `1px solid ${m.color}33`, borderRadius: 100, padding: '4px 12px', fontWeight: 600 }}>{m.emoji} {m.label}</span>
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </main>
  )
}
