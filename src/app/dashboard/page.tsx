'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function Dashboard() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [form, setForm] = useState({
    username: '',
    business_name: '',
    business_type: 'generic',
    bio: '',
    phone: '',
    address: '',
    instagram: '',
    tiktok: '',
    facebook: '',
    whatsapp: '',
  })

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }
      setUser(user)
      const { data: profile } = await supabase
        .from('profiles').select('*').eq('user_id', user.id).single()
      if (profile) {
        setProfile(profile)
        setForm({
          username: profile.username || '',
          business_name: profile.business_name || '',
          business_type: profile.business_type || 'generic',
          bio: profile.bio || '',
          phone: profile.phone || '',
          address: profile.address || '',
          instagram: profile.instagram || '',
          tiktok: profile.tiktok || '',
          facebook: profile.facebook || '',
          whatsapp: profile.whatsapp || '',
        })
      }
      setLoading(false)
    }
    load()
  }, [router])

  async function handleSave() {
    if (!form.username) return alert('Username is required')
    setSaving(true)
    if (profile) {
      await supabase.from('profiles').update(form).eq('id', profile.id)
    } else {
      await supabase.from('profiles').insert({ ...form, user_id: user.id })
    }
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  async function handleQrUpload(e: any) {
    const file = e.target.files[0]
    if (!file || !profile) return
    const { data } = await supabase.storage
      .from('qr-codes')
      .upload(profile.id + '/qr.png', file, { upsert: true })
    if (data) {
      const { data: url } = supabase.storage
        .from('qr-codes').getPublicUrl(profile.id + '/qr.png')
      await supabase.from('profiles')
        .update({ payment_qr_url: url.publicUrl }).eq('id', profile.id)
      alert('QR code uploaded!')
    }
  }

  async function handleSignOut() {
    await supabase.auth.signOut()
    router.push('/')
  }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <p className="text-gray-400">Loading...</p>
    </div>
  )

  return (
    <main className="min-h-screen bg-gray-50 pb-16">
      <div className="bg-white border-b border-gray-100 px-4 py-4 flex items-center justify-between max-w-md mx-auto">
        <h1 className="font-bold text-lg text-purple-700">Cardly</h1>
        <button onClick={handleSignOut} className="text-sm text-gray-400 hover:text-gray-600">Sign out</button>
      </div>
      <div className="max-w-md mx-auto px-4 pt-6 space-y-4">
        {form.username && (
          <div className="bg-purple-50 rounded-2xl p-4">
            <p className="text-xs text-purple-400 mb-1">Your card link</p>
            <p className="text-purple-700 font-medium text-sm">{'cardly.vercel.app/u/' + form.username}</p>
          </div>
        )}
        <div className="bg-white rounded-2xl p-4 shadow-sm space-y-3">
          <h2 className="font-semibold text-gray-700">Business info</h2>
          <div>
            <label className="text-xs text-gray-400 block mb-1">Username</label>
            <input className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm" placeholder="e.g. adambarber" value={form.username} onChange={e => setForm({ ...form, username: e.target.value.toLowerCase().replace(/\s/g, '') })} />
          </div>
          <div>
            <label className="text-xs text-gray-400 block mb-1">Business name</label>
            <input className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm" placeholder="e.g. Adam Barbershop" value={form.business_name} onChange={e => setForm({ ...form, business_name: e.target.value })} />
          </div>
          <div>
            <label className="text-xs text-gray-400 block mb-1">Business type</label>
            <select className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm bg-white" value={form.business_type} onChange={e => setForm({ ...form, business_type: e.target.value })}>
              <option value="generic">General business</option>
              <option value="barber">Barber / Salon</option>
              <option value="food">Food and Drinks</option>
            </select>
          </div>
          <div>
            <label className="text-xs text-gray-400 block mb-1">Bio</label>
            <textarea className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm resize-none" rows={3} placeholder="Tell customers about your business..." value={form.bio} onChange={e => setForm({ ...form, bio: e.target.value })} />
          </div>
          <div>
            <label className="text-xs text-gray-400 block mb-1">Phone</label>
            <input className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm" placeholder="e.g. 0123456789" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
          </div>
          <div>
            <label className="text-xs text-gray-400 block mb-1">Address</label>
            <input className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm" placeholder="e.g. Jalan Ampang, KL" value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} />
          </div>
        </div>
        <div className="bg-white rounded-2xl p-4 shadow-sm space-y-3">
          <h2 className="font-semibold text-gray-700">Social media</h2>
          {['instagram', 'tiktok', 'facebook', 'whatsapp'].map((platform) => (
            <div key={platform}>
              <label className="text-xs text-gray-400 block mb-1 capitalize">{platform}</label>
              <input className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm" placeholder={platform === 'whatsapp' ? '60123456789' : 'your ' + platform + ' username'} value={(form as any)[platform]} onChange={e => setForm({ ...form, [platform]: e.target.value })} />
            </div>
          ))}
        </div>
        {form.business_type === 'food' && (
          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <h2 className="font-semibold text-gray-700 mb-3">Payment QR code</h2>
            <p className="text-xs text-gray-400 mb-3">Upload your DuitNow or Touch n Go QR code</p>
            <input type="file" accept="image/*" onChange={handleQrUpload} className="text-sm text-gray-600" />
          </div>
        )}
        <button onClick={handleSave} disabled={saving} className="w-full bg-purple-600 text-white py-3 rounded-2xl font-semibold hover:bg-purple-700 transition disabled:opacity-50">
          {saving ? 'Saving...' : saved ? 'Saved!' : 'Save profile'}
        </button>
        {form.username && (
          <a href={'/u/' + form.username} target="_blank" className="block w-full border border-purple-300 text-purple-600 py-3 rounded-2xl font-medium text-center hover:bg-purple-50 transition">
            Preview my card
          </a>
        )}
      </div>
    </main>
  )
}