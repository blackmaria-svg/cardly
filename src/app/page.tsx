import Link from 'next/link'

export default function Home() {
  const bg = '#08060F'
  return (
    <main style={{ background: bg, color: '#fff', fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif', overflowX: 'hidden' }}>

      {/* ===== NAV ===== */}
      <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, padding: '18px 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(8,6,15,0.6)', backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <span style={{ fontWeight: 700, fontSize: 19, letterSpacing: '-0.5px', display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ width: 26, height: 26, borderRadius: 8, background: 'linear-gradient(135deg,#8B5CF6,#6D28D9)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>◈</span>
          Cardly
        </span>
        <Link href="/login" style={{ background: '#fff', color: '#08060F', textDecoration: 'none', fontSize: 14, padding: '9px 20px', borderRadius: 100, fontWeight: 600 }}>Get started</Link>
      </nav>

      {/* ===== HERO ===== */}
      <section style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '140px 24px 60px', position: 'relative' }}>
        <div className="glow" style={{ position: 'absolute', top: '20%', left: '50%', transform: 'translate(-50%,-50%)', width: 700, height: 700, background: 'radial-gradient(circle, rgba(139,92,246,0.3) 0%, transparent 65%)', pointerEvents: 'none' }} />

        <div className="fade-up" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(139,92,246,0.12)', border: '1px solid rgba(139,92,246,0.25)', borderRadius: 100, padding: '7px 16px', marginBottom: 40, position: 'relative' }}>
          <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#8B5CF6' }} />
          <span style={{ fontSize: 13, color: '#C4B5FD', letterSpacing: '0.2px' }}>Tap. Done.</span>
        </div>

        <h1 className="fade-up" style={{ fontSize: 'clamp(52px, 10vw, 120px)', fontWeight: 700, lineHeight: 0.95, letterSpacing: '-4px', marginBottom: 28, position: 'relative', animationDelay: '0.1s' }}>
          One tap.<br />
          <span style={{ background: 'linear-gradient(120deg,#fff 20%,#8B5CF6 60%,#C4B5FD)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Everything you are.</span>
        </h1>

        <p className="fade-up" style={{ fontSize: 'clamp(16px,2.5vw,20px)', color: '#A1A1AA', maxWidth: 460, lineHeight: 1.6, marginBottom: 44, position: 'relative', animationDelay: '0.2s' }}>
          The smart card that shares your socials, books your slots, and takes payments.
        </p>

        <div className="fade-up" style={{ display: 'flex', gap: 14, position: 'relative', animationDelay: '0.3s' }}>
          <Link href="/login" style={{ background: 'linear-gradient(135deg,#8B5CF6,#6D28D9)', color: '#fff', textDecoration: 'none', fontSize: 16, padding: '16px 38px', borderRadius: 100, fontWeight: 600, boxShadow: '0 8px 32px rgba(139,92,246,0.4)' }}>Get your card</Link>
          <Link href="/u/demo" style={{ background: 'rgba(255,255,255,0.06)', color: '#fff', textDecoration: 'none', fontSize: 16, padding: '16px 38px', borderRadius: 100, fontWeight: 500, border: '1px solid rgba(255,255,255,0.1)' }}>See demo</Link>
        </div>

        {/* floating phone */}
        <div className="float fade-up" style={{ marginTop: 90, position: 'relative', animationDelay: '0.4s' }}>
          <div style={{ width: 260, height: 530, background: 'linear-gradient(170deg,#1A1232,#0B0818)', borderRadius: 46, border: '1px solid rgba(139,92,246,0.3)', padding: 10, boxShadow: '0 0 100px rgba(139,92,246,0.35), 0 50px 100px rgba(0,0,0,0.7)' }}>
            <div style={{ width: '100%', height: '100%', borderRadius: 38, overflow: 'hidden', background: '#0B0818', position: 'relative' }}>
              <div style={{ height: 130, background: 'linear-gradient(135deg,#8B5CF6,#5B21B6)' }} />
              <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'linear-gradient(135deg,#A78BFA,#7C3AED)', border: '4px solid #0B0818', margin: '-36px auto 0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 30 }}>✂️</div>
              <div style={{ textAlign: 'center', padding: '14px 18px' }}>
                <div style={{ fontWeight: 700, fontSize: 17 }}>Adam Barbershop</div>
                <div style={{ fontSize: 12, color: '#A1A1AA', marginTop: 3 }}>Sharp cuts since 2015</div>
                <div style={{ display: 'flex', gap: 6, justifyContent: 'center', marginTop: 14 }}>
                  {['◐','◑','◒'].map((d,i)=>(<span key={i} style={{ width: 34, height: 34, borderRadius: '50%', background: 'rgba(139,92,246,0.15)', border: '1px solid rgba(139,92,246,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, color: '#C4B5FD' }}>{d}</span>))}
                </div>
                <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 7 }}>
                  {['10:00 AM','2:30 PM','4:00 PM'].map(t=>(<div key={t} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12, padding: '11px', fontSize: 13, color: '#E4E4E7' }}>{t}</div>))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== THREE WORLDS ===== */}
      <section style={{ padding: '120px 24px', maxWidth: 1200, margin: '0 auto' }}>
        <h2 style={{ fontSize: 'clamp(36px,6vw,68px)', fontWeight: 700, letterSpacing: '-2.5px', textAlign: 'center', lineHeight: 1.05, marginBottom: 80 }}>
          One card.<br /><span style={{ color: '#71717A' }}>Three worlds.</span>
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(320px,1fr))', gap: 20 }}>
          {[
            { emoji: '✂️', tag: 'BARBER & SALON', title: 'Book in\na tap', desc: 'Customers pick a slot, drop their name, done. Your chair fills itself.', glow: '#8B5CF6', items: ['Live slots', 'Service menu', 'Instant confirm'] },
            { emoji: '🍜', tag: 'FOOD & DRINKS', title: 'Order &\npay fast', desc: 'Menu, cart, DuitNow QR. No queue, no cashier, no waiting.', glow: '#EC4899', items: ['Visual menu', 'Tap to cart', 'QR payment'] },
            { emoji: '🏪', tag: 'EVERY BUSINESS', title: 'Connect\ninstantly', desc: 'Socials, contact, location, links. Your whole presence in one tap.', glow: '#06B6D4', items: ['All socials', 'Direct WhatsApp', 'Custom links'] },
          ].map((w,i)=>(
            <div key={i} style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 28, padding: 36, position: 'relative', overflow: 'hidden', minHeight: 420 }}>
              <div style={{ position: 'absolute', top: -60, right: -60, width: 180, height: 180, background: `radial-gradient(circle, ${w.glow}25, transparent 70%)`, borderRadius: '50%' }} />
              <div style={{ fontSize: 52, marginBottom: 28 }}>{w.emoji}</div>
              <div style={{ fontSize: 11, letterSpacing: '2px', color: w.glow, fontWeight: 700, marginBottom: 16 }}>{w.tag}</div>
              <h3 style={{ fontSize: 38, fontWeight: 700, letterSpacing: '-1.5px', lineHeight: 1, marginBottom: 18, whiteSpace: 'pre-line' }}>{w.title}</h3>
              <p style={{ fontSize: 15, color: '#A1A1AA', lineHeight: 1.6, marginBottom: 28 }}>{w.desc}</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {w.items.map(it=>(<span key={it} style={{ fontSize: 12, color: '#D4D4D8', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 100, padding: '6px 14px' }}>{it}</span>))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ===== HOW (4 steps) ===== */}
      <section style={{ padding: '120px 24px', background: 'linear-gradient(180deg,transparent,rgba(139,92,246,0.04),transparent)' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <h2 style={{ fontSize: 'clamp(36px,6vw,68px)', fontWeight: 700, letterSpacing: '-2.5px', textAlign: 'center', marginBottom: 80, lineHeight: 1.05 }}>
            Live in<br /><span style={{ background: 'linear-gradient(120deg,#8B5CF6,#C4B5FD)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>five minutes.</span>
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: 20 }}>
            {[
              { n: '1', icon: '✍️', t: 'Sign up', d: 'Google or email. Ten seconds.' },
              { n: '2', icon: '🎨', t: 'Build profile', d: 'Add your info, pick your type.' },
              { n: '3', icon: '💳', t: 'Get card', d: 'We program your NFC card.' },
              { n: '4', icon: '✨', t: 'Tap & grow', d: 'Customers tap. You grow.' },
            ].map(s=>(
              <div key={s.n} style={{ textAlign: 'center', padding: '20px' }}>
                <div style={{ width: 64, height: 64, borderRadius: 20, background: 'rgba(139,92,246,0.12)', border: '1px solid rgba(139,92,246,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, margin: '0 auto 20px' }}>{s.icon}</div>
                <div style={{ fontSize: 12, color: '#8B5CF6', fontWeight: 700, marginBottom: 8 }}>STEP {s.n}</div>
                <h3 style={{ fontSize: 19, fontWeight: 600, marginBottom: 8 }}>{s.t}</h3>
                <p style={{ fontSize: 14, color: '#71717A', lineHeight: 1.5 }}>{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section style={{ padding: '140px 24px', textAlign: 'center', position: 'relative' }}>
        <div className="glow" style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 900, height: 500, background: 'radial-gradient(ellipse, rgba(139,92,246,0.22) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ position: 'relative' }}>
          <h2 style={{ fontSize: 'clamp(44px,8vw,90px)', fontWeight: 700, letterSpacing: '-3px', lineHeight: 1, marginBottom: 36 }}>
            Your card<br />is waiting.
          </h2>
          <Link href="/login" style={{ background: '#fff', color: '#08060F', textDecoration: 'none', fontSize: 17, padding: '18px 48px', borderRadius: 100, fontWeight: 700, display: 'inline-block' }}>Start free →</Link>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer style={{ borderTop: '1px solid rgba(255,255,255,0.05)', padding: '36px 24px', textAlign: 'center' }}>
        <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 6 }}>◈ Cardly</div>
        <p style={{ fontSize: 12, color: '#52525B' }}>Made in Malaysia 🇲🇾</p>
      </footer>
    </main>
  )
}
