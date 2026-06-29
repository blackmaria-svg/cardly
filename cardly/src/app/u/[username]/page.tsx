import { supabase } from '@/lib/supabase'
import ProfileCard from '@/components/ProfileCard'
import BookingPanel from '@/components/BookingPanel'
import MenuPanel from '@/components/MenuPanel'

export const dynamic = 'force-dynamic'

export default async function PublicProfile({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params
  const { data: profile } = await supabase.from('profiles').select('*').eq('username', username).single()

  if (!profile) {
    return (
      <main style={{ minHeight: '100vh', background: '#08060F', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: '-apple-system,system-ui,sans-serif', padding: 24 }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🔍</div>
          <p style={{ color: '#fff', fontWeight: 600, fontSize: 18, margin: '0 0 6px' }}>Card not found</p>
          <p style={{ color: '#52525B', fontSize: 14, margin: 0 }}>This card hasn’t been set up yet.</p>
        </div>
      </main>
    )
  }

  const { data: services } = await supabase.from('services').select('*').eq('profile_id', profile.id)
  const { data: slots } = await supabase.from('booking_slots').select('*').eq('profile_id', profile.id).eq('is_booked', false).gte('slot_datetime', new Date().toISOString()).order('slot_datetime')
  const { data: menuItems } = await supabase.from('menu_items').select('*').eq('profile_id', profile.id).eq('is_available', true)

  return (
    <main style={{ minHeight: '100vh', background: '#08060F', fontFamily: '-apple-system,BlinkMacSystemFont,system-ui,sans-serif', maxWidth: 480, margin: '0 auto', paddingBottom: 100 }}>
      <ProfileCard profile={profile} />
      {profile.business_type === 'barber' && <BookingPanel services={services||[]} slots={slots||[]} />}
      {profile.business_type === 'food' && <MenuPanel menuItems={menuItems||[]} paymentQrUrl={profile.payment_qr_url} businessName={profile.business_name} />}
      {profile.business_type === 'generic' && profile.address && (
        <div style={{ margin: '0 20px' }}>
          <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 18, padding: '18px 22px' }}>
            <p style={{ fontSize: 11, color: '#8B5CF6', letterSpacing: '1px', fontWeight: 600, margin: '0 0 8px' }}>📍 LOCATION</p>
            <p style={{ fontSize: 15, color: '#E4E4E7', margin: 0, lineHeight: 1.5 }}>{profile.address}</p>
          </div>
        </div>
      )}
      <div style={{ textAlign: 'center', marginTop: 40 }}>
        <a href="/" style={{ fontSize: 12, color: '#3F3F46', textDecoration: 'none' }}>Powered by ◈ Cardly</a>
      </div>
    </main>
  )
}
