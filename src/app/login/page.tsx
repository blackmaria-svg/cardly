'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)

  async function handleGoogle() {
    setGoogleLoading(true)
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin + '/auth/callback' },
    })
    if (error) { alert(error.message); setGoogleLoading(false) }
  }

  async function handleEmail() {
    if (!email) return
    setLoading(true)
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: window.location.origin + '/auth/callback' },
    })
    setLoading(false)
    if (error) alert(error.message)
    else setSent(true)
  }

  return (
    <main style={{ minHeight: '100vh', background: '#08060F', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, fontFamily: '-apple-system,BlinkMacSystemFont,system-ui,sans-serif', position: 'relative', overflow: 'hidden' }}>
      <div className="glow" style={{ position: 'absolute', top: '25%', left: '50%', transform: 'translate(-50%,-50%)', width: 600, height: 600, background: 'radial-gradient(circle, rgba(139,92,246,0.25) 0%, transparent 65%)', pointerEvents: 'none' }} />

      <div className="fade-up" style={{ width: '100%', maxWidth: 380, position: 'relative' }}>
        <Link href="/" style={{ color: '#52525B', textDecoration: 'none', fontSize: 13, display: 'inline-flex', alignItems: 'center', gap: 6, marginBottom: 40 }}>← Back</Link>

        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={{ width: 56, height: 56, borderRadius: 16, background: 'linear-gradient(135deg,#8B5CF6,#6D28D9)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, margin: '0 auto 24px', boxShadow: '0 8px 32px rgba(139,92,246,0.4)' }}>◈</div>
          {sent ? (
            <>
              <h1 style={{ fontSize: 26, fontWeight: 700, letterSpacing: '-1px', color: '#fff', marginBottom: 12 }}>Check your inbox</h1>
              <p style={{ fontSize: 15, color: '#A1A1AA', lineHeight: 1.6 }}>We sent a sign-in link to<br /><span style={{ color: '#C4B5FD' }}>{email}</span></p>
            </>
          ) : (
            <>
              <h1 style={{ fontSize: 28, fontWeight: 700, letterSpacing: '-1.5px', color: '#fff', marginBottom: 10 }}>Welcome to Cardly</h1>
              <p style={{ fontSize: 15, color: '#A1A1AA' }}>Sign in to build your card</p>
            </>
          )}
        </div>

        {!sent && (
          <>
            <button onClick={handleGoogle} disabled={googleLoading} style={{ width: '100%', background: '#fff', color: '#1A1A1A', border: 'none', borderRadius: 14, padding: '15px', fontSize: 15, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, opacity: googleLoading ? 0.6 : 1 }}>
              <svg width="20" height="20" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
              {googleLoading ? 'Connecting...' : 'Continue with Google'}
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: 16, margin: '28px 0' }}>
              <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.08)' }} />
              <span style={{ fontSize: 12, color: '#52525B' }}>or</span>
              <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.08)' }} />
            </div>

            <input type="email" placeholder="you@email.com" value={email} onChange={e => setEmail(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleEmail()}
              style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 14, padding: '15px 18px', color: '#fff', fontSize: 15, outline: 'none', marginBottom: 12 }} />
            <button onClick={handleEmail} disabled={loading} style={{ width: '100%', background: 'rgba(139,92,246,0.15)', color: '#C4B5FD', border: '1px solid rgba(139,92,246,0.3)', borderRadius: 14, padding: '15px', fontSize: 15, fontWeight: 600, cursor: 'pointer', opacity: loading ? 0.6 : 1 }}>
              {loading ? 'Sending...' : 'Continue with email'}
            </button>
            <p style={{ fontSize: 12, color: '#52525B', textAlign: 'center', marginTop: 24, lineHeight: 1.5 }}>By continuing you agree to our terms.<br />No password needed.</p>
          </>
        )}
      </div>
    </main>
  )
}
