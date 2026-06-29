'use client'
import { useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function AuthCallback() {
  const router = useRouter()

  useEffect(() => {
    // Supabase JS auto-detects the token in the URL hash and stores the session.
    // We just wait for it, then send the user to the dashboard.
    const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) router.replace('/dashboard')
    })

    // also check immediately in case session is already set
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) router.replace('/dashboard')
    })

    // fallback after 3s
    const t = setTimeout(() => router.replace('/dashboard'), 3000)

    return () => { sub.subscription.unsubscribe(); clearTimeout(t) }
  }, [router])

  return (
    <main style={{ minHeight: '100vh', background: '#08060F', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: '-apple-system,system-ui,sans-serif' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ width: 48, height: 48, borderRadius: 14, background: 'linear-gradient(135deg,#8B5CF6,#6D28D9)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, margin: '0 auto 16px' }}>◈</div>
        <p style={{ color: '#A1A1AA', fontSize: 14 }}>Signing you in…</p>
      </div>
    </main>
  )
}
