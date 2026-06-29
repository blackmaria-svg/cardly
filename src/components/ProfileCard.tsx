'use client'

export default function ProfileCard({ profile }: { profile: any }) {
  const socials = [
    { key: 'instagram', label: 'Instagram', color: '#EC4899', url: (v:string)=>`https://instagram.com/${v}` },
    { key: 'tiktok', label: 'TikTok', color: '#fff', url: (v:string)=>`https://tiktok.com/@${v}` },
    { key: 'facebook', label: 'Facebook', color: '#3B82F6', url: (v:string)=>`https://facebook.com/${v}` },
    { key: 'whatsapp', label: 'WhatsApp', color: '#22C55E', url: (v:string)=>`https://wa.me/${v}` },
  ].filter(s => profile[s.key])

  return (
    <div style={{ marginBottom: 24 }}>
      <div style={{ height: 150, background: 'linear-gradient(135deg,#8B5CF6,#5B21B6)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: -40, right: -40, width: 160, height: 160, background: 'radial-gradient(circle,rgba(255,255,255,0.2),transparent 70%)', borderRadius: '50%' }} />
      </div>
      <div style={{ padding: '0 20px', marginTop: -44, textAlign: 'center', position: 'relative' }}>
        {profile.profile_image_url ? (
          <img src={profile.profile_image_url} alt={profile.business_name} style={{ width: 88, height: 88, borderRadius: '50%', border: '4px solid #08060F', objectFit: 'cover', margin: '0 auto', display: 'block' }} />
        ) : (
          <div style={{ width: 88, height: 88, borderRadius: '50%', border: '4px solid #08060F', background: 'linear-gradient(135deg,#A78BFA,#7C3AED)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 36, fontWeight: 700, color: '#fff', margin: '0 auto' }}>{profile.business_name?.[0]||'?'}</div>
        )}
        <h1 style={{ fontSize: 24, fontWeight: 700, color: '#fff', letterSpacing: '-0.5px', margin: '14px 0 4px' }}>{profile.business_name}</h1>
        {profile.bio && <p style={{ fontSize: 14, color: '#A1A1AA', lineHeight: 1.5, margin: '0 0 12px', maxWidth: 320, marginLeft: 'auto', marginRight: 'auto' }}>{profile.bio}</p>}
        {profile.phone && <a href={`tel:${profile.phone}`} style={{ fontSize: 14, color: '#C4B5FD', textDecoration: 'none', display: 'inline-block', marginBottom: 16 }}>📞 {profile.phone}</a>}
        {socials.length > 0 && (
          <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap', marginTop: 8 }}>
            {socials.map(s => (
              <a key={s.key} href={s.url(profile[s.key])} target="_blank" rel="noreferrer" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: s.color, textDecoration: 'none', fontSize: 13, fontWeight: 500, padding: '8px 16px', borderRadius: 100 }}>{s.label}</a>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
