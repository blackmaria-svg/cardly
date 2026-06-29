 'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleLogin() {
    if (!email) return alert('Please enter your email')
    setLoading(true)
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/dashboard`,
      },
    })
    setLoading(false)
    if (error) alert(error.message)
    else setSent(true)
  }

  if (sent) return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-3xl p-8 max-w-sm w-full text-center shadow-sm">
        <div className="text-4xl mb-4">📧</div>
        <h2 className="font-semibold text-lg mb-2">Check your email</h2>
        <p className="text-gray-500 text-sm">
          We sent a login link to <strong>{email}</strong>.
          Click the link in the email to access your dashboard.
        </p>
      </div>
    </main>
  )

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-sm">
        <div className="text-center mb-6">
          <div className="text-4xl mb-3">💳</div>
          <h1 className="text-2xl font-bold text-gray-800">Cardly</h1>
          <p className="text-gray-500 text-sm mt-1">Sign in to manage your card</p>
        </div>

        <label className="text-sm text-gray-500 mb-1 block">Email address</label>
        <input
          type="email"
          placeholder="you@email.com"
          className="w-full border border-gray-200 rounded-xl px-4 py-3 mb-4 text-sm focus:outline-none focus:border-purple-400"
          value={email}
          onChange={e => setEmail(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleLogin()}
        />

        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full bg-purple-600 text-white py-3 rounded-xl font-medium hover:bg-purple-700 transition disabled:opacity-50"
        >
          {loading ? 'Sending...' : 'Send login link'}
        </button>

        <p className="text-xs text-gray-400 text-center mt-4">
          No password needed. We email you a magic link.
        </p>
      </div>
    </main>
  )
}
