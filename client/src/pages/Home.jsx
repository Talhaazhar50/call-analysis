import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

const BRAND = '#16a34a'

const mockTranscript = [
    { speaker: 'Agent', text: 'Hi, this is Sarah from CallAnalytics. Am I speaking with Mr. Davis?' },
    { speaker: 'Customer', text: 'Yes, speaking. What is this about?' },
    { speaker: 'Agent', text: 'Great! I wanted to reach out because our platform could really help your team automate call QA.' },
    { speaker: 'Customer', text: 'Interesting. How much does it cost?' },
    { speaker: 'Agent', text: 'We have a few plans. For a team like yours I recommend our Growth plan at $299 a month.' },
]

const scoreCriteria = [
    { label: 'Proper Greeting', score: 9, max: 10, color: '#16a34a' },
    { label: 'Needs Discovery', score: 14, max: 20, color: '#16a34a' },
    { label: 'Product Knowledge', score: 22, max: 25, color: '#16a34a' },
    { label: 'Objection Handling', score: 18, max: 25, color: '#ea580c' },
    { label: 'Closing Technique', score: 17, max: 20, color: '#16a34a' },
]

const agentData = [
    { name: 'Emily C.', score: 91, color: '#7c3aed', initials: 'EC' },
    { name: 'Sarah J.', score: 84, color: '#16a34a', initials: 'SJ' },
    { name: 'Aisha K.', score: 88, color: '#ea580c', initials: 'AK' },
    { name: 'Carlos R.', score: 72, color: '#0891b2', initials: 'CR' },
    { name: 'James M.', score: 58, color: '#2563eb', initials: 'JM' },
]

const features = [
    {
        tag: 'Transcription',
        title: 'Every word captured automatically.',
        desc: 'Whisper AI transcribes calls in seconds with speaker labels. No manual work, no missed context.',
        demo: 'transcript',
    },
    {
        tag: 'AI Scoring',
        title: 'Scored like your best QA reviewer.',
        desc: 'Claude reads the transcript and scores each criterion based on meaning — not keywords.',
        demo: 'scoring',
    },
    {
        tag: 'Reports',
        title: 'See who needs coaching at a glance.',
        desc: 'Track agent performance over time, spot training gaps, and export data for coaching sessions.',
        demo: 'leaderboard',
    },
]

const steps = [
    { num: '01', icon: '⬆️', title: 'Upload a Call', desc: 'Agents upload MP3 or WAV recordings directly from the dashboard.' },
    { num: '02', icon: '🎙️', title: 'AI Transcribes', desc: 'Whisper converts audio to a clean, speaker-labeled transcript in seconds.' },
    { num: '03', icon: '🧠', title: 'Claude Scores It', desc: 'The AI reads the transcript and scores it against your custom scorecard.' },
    { num: '04', icon: '📊', title: 'Review & Coach', desc: 'Admins review scores, add notes, and track improvement over time.' },
]

const stats = [
    { value: '10x', label: 'Faster than manual QA' },
    { value: '98%', label: 'Transcription accuracy' },
    { value: '< 60s', label: 'Time to score a call' },
    { value: '100%', label: 'Calls reviewed' },
]

const testimonials = [
    {
        quote: 'We went from reviewing 5% of calls manually to scoring 100% automatically. Our pass rate improved by 23% in 6 weeks.',
        name: 'Mariam Hassan', role: 'Head of QA, FinanceFlow', initials: 'MH', color: '#7c3aed',
    },
    {
        quote: 'The AI scoring is shockingly accurate. It catches things our human reviewers miss and explains its reasoning clearly.',
        name: 'Daniel Park', role: 'Sales Director, Growthly', initials: 'DP', color: '#0891b2',
    },
    {
        quote: 'Setup took one afternoon. We had our first batch of scored calls the same day. The ROI was immediate.',
        name: 'Fatima Al-Rashid', role: 'Operations Manager, NovaCare', initials: 'FA', color: '#ea580c',
    },
    {
        quote: 'Our agents actually improved because they could see exactly where they lost points on every call.',
        name: 'James Okafor', role: 'Sales Team Lead, PulseGrow', initials: 'JO', color: '#16a34a',
    },
]

// ── Demo Components ──

function TranscriptDemo() {
    const [visibleLines, setVisibleLines] = useState(0)

    useEffect(() => {
        setVisibleLines(0)
        const timers = mockTranscript.map((_, i) =>
            setTimeout(() => setVisibleLines(i + 1), i * 900 + 400)
        )
        const reset = setTimeout(() => setVisibleLines(0), mockTranscript.length * 900 + 2000)
        return () => { timers.forEach(clearTimeout); clearTimeout(reset) }
    }, [])

    return (
        <div style={{ padding: 20, height: '100%', display: 'flex', flexDirection: 'column', gap: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#f87171', animation: 'pulse 1.5s infinite' }} />
                <span style={{ fontSize: 11, color: '#6b7280', fontWeight: 600, letterSpacing: '0.05em' }}>LIVE TRANSCRIPTION</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, flex: 1, overflowY: 'hidden' }}>
                {mockTranscript.slice(0, visibleLines).map((line, i) => (
                    <div key={i} style={{
                        display: 'flex', gap: 10, alignItems: 'flex-start',
                        opacity: 1, transform: 'translateY(0)',
                        animation: 'slideIn 0.3s ease',
                    }}>
                        <div style={{
                            width: 24, height: 24, borderRadius: '50%', flexShrink: 0,
                            background: line.speaker === 'Agent' ? '#f0fdf4' : '#eff6ff',
                            border: `1px solid ${line.speaker === 'Agent' ? '#bbf7d0' : '#bfdbfe'}`,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>
                            <span style={{ fontSize: 9, fontWeight: 700, color: line.speaker === 'Agent' ? BRAND : '#2563eb' }}>
                                {line.speaker === 'Agent' ? 'A' : 'C'}
                            </span>
                        </div>
                        <div>
                            <div style={{ fontSize: 10, fontWeight: 700, color: line.speaker === 'Agent' ? BRAND : '#2563eb', marginBottom: 2, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                                {line.speaker}
                            </div>
                            <div style={{ fontSize: 12, color: '#374151', lineHeight: 1.5 }}>{line.text}</div>
                        </div>
                    </div>
                ))}
                {visibleLines < mockTranscript.length && visibleLines > 0 && (
                    <div style={{ display: 'flex', gap: 4, paddingLeft: 34 }}>
                        {[0, 1, 2].map(i => (
                            <div key={i} style={{
                                width: 6, height: 6, borderRadius: '50%', background: '#d1d5db',
                                animation: `bounce 1s infinite ${i * 0.15}s`,
                            }} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

function ScoringDemo() {
    const [animated, setAnimated] = useState(false)
    const [key, setKey] = useState(0)

    useEffect(() => {
        setAnimated(false)
        const t1 = setTimeout(() => setAnimated(true), 300)
        const t2 = setTimeout(() => {
            setAnimated(false)
            setKey(k => k + 1)
        }, 5000)
        return () => { clearTimeout(t1); clearTimeout(t2) }
    }, [key])

    const total = scoreCriteria.reduce((s, c) => s + c.score, 0)
    const max = scoreCriteria.reduce((s, c) => s + c.max, 0)
    const pct = Math.round((total / max) * 100)

    return (
        <div style={{ padding: '16px 20px' }} key={key}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                <span style={{ fontSize: 10, color: '#6b7280', fontWeight: 700, letterSpacing: '0.07em' }}>AI SCORE BREAKDOWN</span>
                <div style={{
                    fontSize: 17, fontWeight: 800,
                    color: pct >= 70 ? BRAND : '#dc2626',
                    background: pct >= 70 ? '#f0fdf4' : '#fef2f2',
                    border: `1.5px solid ${pct >= 70 ? '#bbf7d0' : '#fecaca'}`,
                    borderRadius: 9, padding: '3px 12px',
                    animation: animated ? 'popIn 0.4s cubic-bezier(0.16,1,0.3,1)' : 'none',
                }}>
                    {pct}%
                </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 11 }}>
                {scoreCriteria.map((c, i) => {
                    const cpct = Math.round((c.score / c.max) * 100)
                    return (
                        <div key={c.label}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                                <span style={{ fontSize: 11, color: '#374151', fontWeight: 500 }}>{c.label}</span>
                                <span style={{ fontSize: 11, fontWeight: 700, color: cpct >= 70 ? BRAND : '#ea580c' }}>{c.score}/{c.max}</span>
                            </div>
                            <div style={{ height: 6, background: '#f3f4f6', borderRadius: 10, overflow: 'hidden' }}>
                                <div style={{
                                    height: '100%', borderRadius: 10,
                                    background: cpct >= 70
                                        ? `linear-gradient(90deg, ${BRAND}, #4ade80)`
                                        : 'linear-gradient(90deg, #f97316, #ea580c)',
                                    width: animated ? `${cpct}%` : '0%',
                                    transition: `width 0.9s cubic-bezier(0.16,1,0.3,1) ${i * 0.1}s`,
                                    boxShadow: cpct >= 70 ? '0 0 6px rgba(22,163,74,0.4)' : 'none',
                                }} />
                            </div>
                        </div>
                    )
                })}
            </div>

            <div style={{ marginTop: 14, padding: '10px 12px', background: '#f0fdf4', borderRadius: 10, border: '1px solid #bbf7d0' }}>
                <div style={{ fontSize: 9, color: BRAND, fontWeight: 800, marginBottom: 4, letterSpacing: '0.07em' }}>🧠 AI SUMMARY</div>
                <div style={{ fontSize: 11, color: '#166534', lineHeight: 1.6 }}>
                    Strong call. Agent showed good product knowledge and secured a demo. Work on objection handling depth.
                </div>
            </div>
        </div>
    )
}

function LeaderboardDemo() {
    return (
        <div style={{ padding: 20 }}>
            <div style={{ fontSize: 11, color: '#6b7280', fontWeight: 600, letterSpacing: '0.05em', marginBottom: 14 }}>AGENT LEADERBOARD</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {agentData.sort((a, b) => b.score - a.score).map((agent, i) => (
                    <div key={agent.name} style={{
                        display: 'flex', alignItems: 'center', gap: 10,
                        padding: '8px 10px', borderRadius: 8,
                        background: i === 0 ? '#f0fdf4' : '#fafafa',
                        border: `1px solid ${i === 0 ? '#bbf7d0' : '#f3f4f6'}`,
                    }}>
                        <div style={{ fontSize: 11, fontWeight: 700, color: i === 0 ? '#f59e0b' : i === 1 ? '#9ca3af' : '#d1d5db', width: 16 }}>
                            {i + 1}
                        </div>
                        <div style={{
                            width: 26, height: 26, borderRadius: '50%', flexShrink: 0,
                            background: agent.color + '20', border: `1.5px solid ${agent.color}40`,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>
                            <span style={{ fontSize: 9, fontWeight: 700, color: agent.color }}>{agent.initials}</span>
                        </div>
                        <span style={{ fontSize: 12, fontWeight: 500, color: '#111827', flex: 1 }}>{agent.name}</span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <div style={{ width: 60, height: 4, background: '#f3f4f6', borderRadius: 4, overflow: 'hidden' }}>
                                <div style={{
                                    height: '100%', borderRadius: 4,
                                    background: agent.score >= 70 ? BRAND : '#dc2626',
                                    width: `${agent.score}%`,
                                    transition: 'width 1s ease',
                                }} />
                            </div>
                            <span style={{ fontSize: 12, fontWeight: 700, color: agent.score >= 70 ? BRAND : '#dc2626', minWidth: 32 }}>
                                {agent.score}%
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

function FeatureCard({ feature, isActive, onClick }) {
    return (
        <div
            onClick={onClick}
            style={{
                padding: '20px 24px', borderRadius: 12, cursor: 'pointer',
                background: isActive ? '#fff' : 'transparent',
                border: `1px solid ${isActive ? '#e5e7eb' : 'transparent'}`,
                boxShadow: isActive ? '0 2px 12px rgba(0,0,0,0.06)' : 'none',
                transition: 'all 0.2s',
            }}
        >
            <div style={{
                display: 'inline-block', fontSize: 10, fontWeight: 700,
                letterSpacing: '0.08em', color: BRAND,
                background: '#f0fdf4', border: '1px solid #bbf7d0',
                borderRadius: 100, padding: '2px 10px', marginBottom: 10,
            }}>
                {feature.tag}
            </div>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: '#111827', marginBottom: 8, lineHeight: 1.3 }}>
                {feature.title}
            </h3>
            <p style={{ fontSize: 13, color: '#6b7280', lineHeight: 1.65 }}>{feature.desc}</p>
            {isActive && (
                <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', gap: 6, color: BRAND, fontSize: 13, fontWeight: 600 }}>
                    <span>Learn more</span><span>→</span>
                </div>
            )}
        </div>
    )
}

export default function Home() {
    const [scrolled, setScrolled] = useState(false)
    const [visible, setVisible] = useState(false)
    const [activeFeature, setActiveFeature] = useState(0)
    const [uploadStep, setUploadStep] = useState(0)

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 20)
        window.addEventListener('scroll', onScroll)
        setTimeout(() => setVisible(true), 100)
        return () => window.removeEventListener('scroll', onScroll)
    }, [])

    useEffect(() => {
        const t = setInterval(() => setActiveFeature(p => (p + 1) % 3), 4000)
        return () => clearInterval(t)
    }, [])

    useEffect(() => {
        const steps = [0, 1, 2, 3, 4]
        let i = 0
        const t = setInterval(() => {
            i = (i + 1) % 5
            setUploadStep(i)
        }, 1800)
        return () => clearInterval(t)
    }, [])

    return (
        <div style={{ fontFamily: "'DM Sans', system-ui, sans-serif", background: '#ffffff', color: '#111827', overflowX: 'hidden' }}>
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;0,9..40,800;1,9..40,400&family=DM+Serif+Display:ital@0;1&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }

        .hero-title {
          font-family: 'DM Serif Display', Georgia, serif;
          font-size: clamp(40px, 6.5vw, 82px);
          line-height: 1.06;
          letter-spacing: -2px;
          color: #0a0a0a;
        }
        .hero-title em { font-style: italic; color: ${BRAND}; }

        .fade-up { opacity: 0; transform: translateY(20px); transition: opacity 0.7s ease, transform 0.7s ease; }
        .fade-up.visible { opacity: 1; transform: translateY(0); }
        .delay-1 { transition-delay: 0.1s; }
        .delay-2 { transition-delay: 0.2s; }
        .delay-3 { transition-delay: 0.3s; }
        .delay-4 { transition-delay: 0.4s; }
        .delay-5 { transition-delay: 0.55s; }

        .nav-link { font-size: 14px; font-weight: 500; color: #374151; text-decoration: none; transition: color 0.15s; }
        .nav-link:hover { color: ${BRAND}; }

        .btn-primary {
          display: inline-flex; align-items: center; gap: 8px;
          background: ${BRAND}; color: #fff;
          font-family: 'DM Sans', sans-serif; font-size: 15px; font-weight: 600;
          padding: 13px 28px; border-radius: 10px; border: none;
          cursor: pointer; text-decoration: none;
          transition: background 0.15s, transform 0.1s, box-shadow 0.15s;
          box-shadow: 0 2px 8px rgba(22,163,74,0.3);
        }
        .btn-primary:hover { background: #15803d; transform: translateY(-1px); box-shadow: 0 4px 16px rgba(22,163,74,0.4); }

        .btn-secondary {
          display: inline-flex; align-items: center; gap: 8px;
          background: #fff; color: #374151;
          font-family: 'DM Sans', sans-serif; font-size: 15px; font-weight: 500;
          padding: 13px 28px; border-radius: 10px; border: 1.5px solid #e5e7eb;
          cursor: pointer; text-decoration: none;
          transition: border-color 0.15s, transform 0.1s;
        }
        .btn-secondary:hover { border-color: #9ca3af; transform: translateY(-1px); }

        .section-label {
          font-size: 11px; font-weight: 700; letter-spacing: 0.12em;
          text-transform: uppercase; color: ${BRAND};
        }

        .section-title {
          font-family: 'DM Serif Display', serif;
          font-size: clamp(28px, 4vw, 44px);
          line-height: 1.15; letter-spacing: -0.5px; color: #0a0a0a;
        }

        .stat-value {
          font-family: 'DM Serif Display', serif;
          font-size: 52px; color: ${BRAND}; line-height: 1; letter-spacing: -1px;
        }

        .demo-window {
          background: #fff;
          border-radius: 16px;
          border: 1px solid #e5e7eb;
          box-shadow: 0 8px 32px rgba(0,0,0,0.08);
          overflow: hidden;
          height: 340px;
          overflow-y: auto;
        }

        .demo-window-dark {
          background: #0f1117;
          border-radius: 16px;
          border: 1px solid #2a2d3a;
          box-shadow: 0 24px 64px rgba(0,0,0,0.2);
          overflow: hidden;
        }

        .demo-bar {
          padding: 10px 14px;
          border-bottom: 1px solid #f3f4f6;
          display: flex; align-items: center; gap: 6px;
          background: #fafafa;
        }

        .demo-bar-dark {
          padding: 10px 14px;
          border-bottom: 1px solid #2a2d3a;
          display: flex; align-items: center; gap: 6px;
          background: #13151f;
        }

        .dot { width: 9px; height: 9px; border-radius: 50%; }

        .upload-step {
          display: flex; align-items: center; gap: 12;
          padding: 10px 14px; border-radius: 8px;
          transition: all 0.3s;
        }

        .testimonial-card {
          background: #fafafa; border: 1px solid #f3f4f6;
          border-radius: 16px; padding: 28px;
          transition: box-shadow 0.2s, transform 0.2s;
        }
        .testimonial-card:hover { box-shadow: 0 8px 24px rgba(0,0,0,0.06); transform: translateY(-2px); }

        @keyframes slideIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; } 50% { opacity: 0.4; }
        }

        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }

        @keyframes scrollBounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(6px); }
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @media (max-width: 900px) {
          .features-layout { flex-direction: column !important; }
          .hero-btns { flex-direction: column; align-items: stretch; }
          .hero-btns a { text-align: center; justify-content: center; }
          .stats-grid { grid-template-columns: 1fr 1fr !important; }
          .steps-grid { grid-template-columns: 1fr 1fr !important; }
          .testimonials-grid { grid-template-columns: 1fr !important; }
          .how-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>

            {/* ── Navbar ── */}
            <nav style={{
                position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
                background: scrolled ? 'rgba(255,255,255,0.92)' : 'transparent',
                backdropFilter: scrolled ? 'blur(12px)' : 'none',
                borderBottom: scrolled ? '1px solid #f3f4f6' : '1px solid transparent',
                transition: 'all 0.3s ease',
            }}>
                <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{ width: 32, height: 32, borderRadius: 8, background: BRAND, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <span style={{ fontSize: 16 }}>🎧</span>
                        </div>
                        <span style={{ fontWeight: 800, fontSize: 16, color: '#0a0a0a', letterSpacing: '-0.3px' }}>CallAnalytics</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
                        <div style={{ display: 'flex', gap: 28 }}>
                            {['Features', 'How it works', 'Pricing'].map(item => (
                                <a key={item} href={`#${item.toLowerCase().replace(' ', '-')}`} className="nav-link">{item}</a>
                            ))}
                        </div>
                        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                            <Link to="/login" className="nav-link" style={{ padding: '8px 16px' }}>Sign in</Link>
                            <Link to="/login" className="btn-primary" style={{ padding: '9px 20px', fontSize: 14 }}>Get started free</Link>
                        </div>
                    </div>
                </div>
            </nav>

            {/* ── Hero ── */}
            <section style={{
                minHeight: '100vh', display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center',
                padding: '120px 24px 80px', position: 'relative', overflow: 'hidden',
                background: '#fafafa',
            }}>
                <div style={{
                    position: 'absolute', top: '15%', left: '50%', transform: 'translateX(-50%)',
                    width: 700, height: 700, borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(22,163,74,0.07) 0%, transparent 70%)',
                    pointerEvents: 'none',
                }} />

                <div style={{ maxWidth: 720, textAlign: 'center', position: 'relative' }}>
                    <div className={`fade-up ${visible ? 'visible' : ''}`} style={{
                        display: 'inline-flex', alignItems: 'center', gap: 8,
                        background: '#f0fdf4', border: '1px solid #bbf7d0',
                        borderRadius: 100, padding: '6px 14px 6px 8px', marginBottom: 32,
                    }}>
                        <span style={{ background: BRAND, color: '#fff', fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 100, letterSpacing: '0.05em' }}>NEW</span>
                        <span style={{ fontSize: 13, color: '#166534', fontWeight: 500 }}>Claude AI scoring now available</span>
                        <span style={{ color: BRAND, fontSize: 13 }}>→</span>
                    </div>

                    <h1 className={`hero-title fade-up delay-1 ${visible ? 'visible' : ''}`} style={{ marginBottom: 24 }}>
                        Your calls scored<br />by <em>AI</em>, not<br />spreadsheets.
                    </h1>

                    <p className={`fade-up delay-2 ${visible ? 'visible' : ''}`} style={{
                        fontSize: 19, color: '#6b7280', lineHeight: 1.7,
                        maxWidth: 520, margin: '0 auto 40px', fontWeight: 400,
                    }}>
                        Upload a call. Get a full AI score breakdown in under 60 seconds — against your own scorecards.
                    </p>

                    <div className={`fade-up delay-3 ${visible ? 'visible' : ''} hero-btns`}
                        style={{ display: 'flex', gap: 12, justifyContent: 'center', marginBottom: 48 }}>
                        <Link to="/login" className="btn-primary">Start for free →</Link>
                        <a href="#features" className="btn-secondary">See how it works</a>
                    </div>

                    <div className={`fade-up delay-4 ${visible ? 'visible' : ''}`} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, flexWrap: 'wrap' }}>
                        <div style={{ display: 'flex' }}>
                            {['#7c3aed', '#ea580c', BRAND, '#2563eb', '#0891b2'].map((c, i) => (
                                <div key={i} style={{
                                    width: 30, height: 30, borderRadius: '50%',
                                    background: c + '30', border: '2px solid #fff',
                                    marginLeft: i === 0 ? 0 : -8,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                }}>
                                    <span style={{ fontSize: 10, fontWeight: 700, color: c }}>{['EC', 'MH', 'SJ', 'DP', 'FA'][i]}</span>
                                </div>
                            ))}
                        </div>
                        <span style={{ fontSize: 13, color: '#9ca3af' }}>
                            Trusted by <strong style={{ color: '#374151' }}>500+ QA teams</strong> worldwide
                        </span>
                    </div>
                </div>

                {/* Hero Interactive Demo Cards */}
                {/* Hero Interactive Demo Cards */}
                <div className={`fade-up delay-5 ${visible ? 'visible' : ''}`}
                    style={{ maxWidth: 1060, width: '100%', marginTop: 64, display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 20, position: 'relative' }}>

                    {/* shared card style */}
                    {[
                        {
                            step: 'Step 1', label: 'Upload', accent: '#16a34a', accentBg: '#f0fdf4', accentBorder: '#bbf7d0',
                            content: (
                                <div style={{ padding: '20px 20px 24px' }}>
                                    {/* fake audio file row */}
                                    <div style={{
                                        display: 'flex', alignItems: 'center', gap: 10,
                                        background: '#f9fafb', border: '1px solid #f3f4f6',
                                        borderRadius: 10, padding: '10px 14px', marginBottom: 12,
                                    }}>
                                        <div style={{ width: 32, height: 32, borderRadius: 8, background: '#f0fdf4', border: '1px solid #bbf7d0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>🎵</div>
                                        <div style={{ flex: 1, minWidth: 0 }}>
                                            <div style={{ fontSize: 12, fontWeight: 600, color: '#111827', marginBottom: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>sales_call_may12.mp3</div>
                                            <div style={{ fontSize: 10, color: '#9ca3af' }}>4.2 MB · 6:34 min</div>
                                        </div>
                                        <div style={{ width: 20, height: 20, borderRadius: '50%', background: '#f0fdf4', border: '1px solid #bbf7d0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <span style={{ fontSize: 10, color: BRAND }}>✓</span>
                                        </div>
                                    </div>

                                    {/* drop zone */}
                                    <div style={{
                                        border: '2px dashed #d1fae5', borderRadius: 12,
                                        padding: '22px 16px', textAlign: 'center', background: '#fafffe',
                                    }}>
                                        <div style={{ fontSize: 26, marginBottom: 8 }}>⬆️</div>
                                        <div style={{ fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 4 }}>Drop another call here</div>
                                        <div style={{ fontSize: 11, color: '#9ca3af' }}>MP3, WAV, M4A · Max 500MB</div>
                                    </div>

                                    {/* upload progress */}
                                    <div style={{ marginTop: 14 }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                                            <span style={{ fontSize: 11, color: '#6b7280' }}>Uploading...</span>
                                            <span style={{ fontSize: 11, fontWeight: 700, color: BRAND }}>72%</span>
                                        </div>
                                        <div style={{ height: 5, background: '#f3f4f6', borderRadius: 10, overflow: 'hidden' }}>
                                            <div style={{ height: '100%', width: '72%', background: `linear-gradient(90deg, ${BRAND}, #4ade80)`, borderRadius: 10 }} />
                                        </div>
                                    </div>
                                </div>
                            ),
                        },
                        {
                            step: 'Step 2', label: 'Transcript', accent: '#2563eb', accentBg: '#eff6ff', accentBorder: '#bfdbfe',
                            content: <TranscriptDemo />,
                        },
                        {
                            step: 'Step 3', label: 'AI Score', accent: '#ca8a04', accentBg: '#fefce8', accentBorder: '#fde047',
                            content: <ScoringDemo />,
                        },
                    ].map(({ step, label, accent, accentBg, accentBorder, content }) => (
                        <div key={label} style={{
                            background: '#fff',
                            borderRadius: 20,
                            border: '1px solid #e5e7eb',
                            overflow: 'hidden',
                            boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 8px 32px rgba(0,0,0,0.06)',
                            display: 'flex', flexDirection: 'column',
                        }}>
                            {/* card header */}
                            <div style={{
                                padding: '14px 20px',
                                background: accentBg,
                                borderBottom: `1px solid ${accentBorder}`,
                                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                    <div style={{ width: 6, height: 6, borderRadius: '50%', background: accent }} />
                                    <span style={{ fontSize: 11, fontWeight: 800, color: accent, letterSpacing: '0.07em', textTransform: 'uppercase' }}>
                                        {step} — {label}
                                    </span>
                                </div>
                                <div style={{ width: 20, height: 20, borderRadius: '50%', background: accent + '20', border: `1px solid ${accent}40`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <span style={{ fontSize: 9, color: accent }}>●</span>
                                </div>
                            </div>
                            {content}
                        </div>
                    ))}
                </div>

                <div style={{ marginTop: 48, color: '#d1d5db', fontSize: 20, animation: 'scrollBounce 2s infinite' }}>↓</div>
            </section>

            {/* ── Stats ── */}
            <section style={{ background: '#0a0a0a', padding: '72px 24px' }}>
                <div style={{ maxWidth: 1000, margin: '0 auto' }}>
                    <div className="stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 48, textAlign: 'center' }}>
                        {stats.map((s) => (
                            <div key={s.label}>
                                <div className="stat-value">{s.value}</div>
                                <div style={{ fontSize: 14, color: '#6b7280', marginTop: 8 }}>{s.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Features — Interactive ── */}
            <section id="features" style={{ padding: '100px 24px', background: '#fff' }}>
                <div style={{ maxWidth: 1100, margin: '0 auto' }}>
                    <div style={{ textAlign: 'center', marginBottom: 64 }}>
                        <div className="section-label" style={{ marginBottom: 16 }}>Features</div>
                        <h2 className="section-title">Everything your QA team needs</h2>
                        <p style={{ fontSize: 17, color: '#6b7280', marginTop: 16, maxWidth: 460, margin: '16px auto 0', lineHeight: 1.7 }}>
                            Built for operations, QA managers, and sales leaders who care about call quality.
                        </p>
                    </div>

                    {/* Interactive feature switcher */}
                    <div className="features-layout" style={{ display: 'flex', gap: 40, alignItems: 'flex-start' }}>

                        {/* Left — clickable feature list */}
                        <div style={{ width: 340, flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 4 }}>
                            {features.map((f, i) => (
                                <FeatureCard
                                    key={f.tag}
                                    feature={f}
                                    isActive={activeFeature === i}
                                    onClick={() => setActiveFeature(i)}
                                />
                            ))}

                            {/* Progress dots */}
                            <div style={{ display: 'flex', gap: 6, paddingLeft: 24, marginTop: 8 }}>
                                {features.map((_, i) => (
                                    <div key={i} onClick={() => setActiveFeature(i)} style={{
                                        width: activeFeature === i ? 20 : 6,
                                        height: 6, borderRadius: 3,
                                        background: activeFeature === i ? BRAND : '#e5e7eb',
                                        cursor: 'pointer', transition: 'all 0.3s',
                                    }} />
                                ))}
                            </div>
                        </div>

                        {/* Right — demo window */}
                        <div style={{ flex: 1, minHeight: 380 }}>
                            <div className="demo-window" style={{ height: 380 }}>
                                <div className="demo-bar">
                                    <div className="dot" style={{ background: '#ff5f57' }} />
                                    <div className="dot" style={{ background: '#febc2e' }} />
                                    <div className="dot" style={{ background: '#28c840' }} />
                                    <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
                                        <div style={{ background: '#f3f4f6', borderRadius: 6, padding: '3px 16px', fontSize: 11, color: '#9ca3af' }}>
                                            {activeFeature === 0 ? 'Transcription' : activeFeature === 1 ? 'AI Scoring' : 'Leaderboard'}
                                        </div>
                                    </div>
                                </div>
                                {activeFeature === 0 && <TranscriptDemo />}
                                {activeFeature === 1 && <ScoringDemo />}
                                {activeFeature === 2 && <LeaderboardDemo />}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── How It Works ── */}
            <section id="how-it-works" style={{ padding: '100px 24px', background: '#f9fafb' }}>
                <div style={{ maxWidth: 1100, margin: '0 auto' }}>
                    <div style={{ textAlign: 'center', marginBottom: 72 }}>
                        <div className="section-label" style={{ marginBottom: 16 }}>How it works</div>
                        <h2 className="section-title">From upload to insights<br />in 4 simple steps</h2>
                    </div>

                    <div className="how-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, alignItems: 'center' }}>
                        {/* Left — steps */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                            {steps.map((s, i) => (
                                <div key={s.num}
                                    onClick={() => setUploadStep(i)}
                                    style={{
                                        display: 'flex', gap: 16, alignItems: 'flex-start',
                                        padding: '16px 20px', borderRadius: 12, cursor: 'pointer',
                                        background: uploadStep === i ? '#fff' : 'transparent',
                                        border: `1px solid ${uploadStep === i ? '#e5e7eb' : 'transparent'}`,
                                        boxShadow: uploadStep === i ? '0 2px 12px rgba(0,0,0,0.05)' : 'none',
                                        transition: 'all 0.2s',
                                    }}
                                >
                                    <div style={{
                                        width: 36, height: 36, borderRadius: 10, flexShrink: 0,
                                        background: uploadStep === i ? '#f0fdf4' : '#f3f4f6',
                                        border: `1px solid ${uploadStep === i ? '#bbf7d0' : '#e5e7eb'}`,
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        fontSize: 18,
                                    }}>
                                        {s.icon}
                                    </div>
                                    <div>
                                        <div style={{ fontSize: 10, fontWeight: 700, color: uploadStep === i ? BRAND : '#9ca3af', letterSpacing: '0.06em', marginBottom: 4 }}>
                                            {s.num}
                                        </div>
                                        <div style={{ fontSize: 15, fontWeight: 700, color: '#111827', marginBottom: 4 }}>{s.title}</div>
                                        <div style={{ fontSize: 13, color: '#6b7280', lineHeight: 1.6 }}>{s.desc}</div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Right — animated preview */}
                        <div className="demo-window-dark" style={{ padding: 0 }}>
                            <div className="demo-bar-dark">
                                <div className="dot" style={{ background: '#ff5f57' }} />
                                <div className="dot" style={{ background: '#febc2e' }} />
                                <div className="dot" style={{ background: '#28c840' }} />
                                <div style={{ flex: 1, textAlign: 'center', fontSize: 11, color: '#4b5268' }}>
                                    CallAnalytics — {steps[Math.min(uploadStep, steps.length - 1)]?.title}
                                </div>
                            </div>
                            <div style={{ padding: 24 }}>
                                {uploadStep === 0 && (
                                    <div style={{ border: '2px dashed #2a2d3a', borderRadius: 12, padding: 32, textAlign: 'center' }}>
                                        <div style={{ fontSize: 36, marginBottom: 12 }}>📂</div>
                                        <div style={{ fontSize: 14, color: '#8b93a7' }}>Drop your call recording here</div>
                                        <div style={{ fontSize: 11, color: '#4b5268', marginTop: 6 }}>MP3, WAV, M4A · Max 500MB</div>
                                        <div style={{ marginTop: 16, display: 'inline-block', background: BRAND, color: '#fff', fontSize: 12, fontWeight: 600, padding: '8px 20px', borderRadius: 8, cursor: 'pointer' }}>
                                            Browse files
                                        </div>
                                    </div>
                                )}
                                {uploadStep === 1 && (
                                    <div style={{ textAlign: 'center', padding: '20px 0' }}>
                                        <div style={{ fontSize: 36, marginBottom: 12 }}>🎙️</div>
                                        <div style={{ fontSize: 14, color: '#f1f5f9', fontWeight: 600, marginBottom: 16 }}>Transcribing audio...</div>
                                        {mockTranscript.slice(0, 2).map((l, i) => (
                                            <div key={i} style={{ textAlign: 'left', marginBottom: 12, padding: '10px 14px', background: '#1a1d27', borderRadius: 8, border: '1px solid #2a2d3a' }}>
                                                <div style={{ fontSize: 9, fontWeight: 700, color: l.speaker === 'Agent' ? '#4ade80' : '#60a5fa', marginBottom: 4 }}>{l.speaker.toUpperCase()}</div>
                                                <div style={{ fontSize: 11, color: '#8b93a7', lineHeight: 1.5 }}>{l.text}</div>
                                            </div>
                                        ))}
                                        <div style={{ display: 'flex', gap: 4, justifyContent: 'center', marginTop: 8 }}>
                                            {[0, 1, 2].map(i => (
                                                <div key={i} style={{ width: 6, height: 6, borderRadius: '50%', background: '#4ade80', animation: `bounce 0.8s infinite ${i * 0.15}s` }} />
                                            ))}
                                        </div>
                                    </div>
                                )}
                                {uploadStep === 2 && (
                                    <div>
                                        <div style={{ fontSize: 11, color: '#8b93a7', fontWeight: 600, marginBottom: 12, letterSpacing: '0.05em' }}>🧠 CLAUDE SCORING...</div>
                                        {scoreCriteria.slice(0, 3).map((c, i) => (
                                            <div key={c.label} style={{ marginBottom: 10 }}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                                                    <span style={{ fontSize: 11, color: '#8b93a7' }}>{c.label}</span>
                                                    <span style={{ fontSize: 11, fontWeight: 700, color: '#4ade80' }}>{c.score}/{c.max}</span>
                                                </div>
                                                <div style={{ height: 4, background: '#2a2d3a', borderRadius: 4, overflow: 'hidden' }}>
                                                    <div style={{ height: '100%', width: `${(c.score / c.max) * 100}%`, background: '#4ade80', borderRadius: 4, transition: 'width 1s ease', transitionDelay: `${i * 0.2}s` }} />
                                                </div>
                                            </div>
                                        ))}
                                        <div style={{ fontSize: 11, color: '#4b5268', textAlign: 'center', marginTop: 8 }}>Analyzing 2 more criteria...</div>
                                    </div>
                                )}
                                {uploadStep === 3 && (
                                    <div style={{ textAlign: 'center', padding: '16px 0' }}>
                                        <div style={{ fontSize: 48, fontWeight: 800, color: '#4ade80', marginBottom: 8 }}>84%</div>
                                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(22,163,74,0.15)', border: '1px solid rgba(22,163,74,0.3)', borderRadius: 8, padding: '6px 16px', marginBottom: 16 }}>
                                            <span style={{ color: '#4ade80', fontWeight: 700, fontSize: 13 }}>✓ PASS</span>
                                        </div>
                                        <div style={{ background: '#1a1d27', border: '1px solid #2a2d3a', borderRadius: 10, padding: 14, textAlign: 'left' }}>
                                            <div style={{ fontSize: 9, color: '#4ade80', fontWeight: 700, marginBottom: 6, letterSpacing: '0.05em' }}>AI SUMMARY</div>
                                            <div style={{ fontSize: 11, color: '#8b93a7', lineHeight: 1.6 }}>Strong call. Agent showed excellent product knowledge and secured a demo booking. Work on objection handling depth.</div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Scorecard Builder Promo ── */}
            <section style={{ padding: '80px 24px', background: '#fff' }}>
                <div style={{ maxWidth: 1100, margin: '0 auto' }}>
                    <div style={{
                        background: '#0a0a0a', borderRadius: 24, padding: '56px 64px',
                        display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'center',
                        position: 'relative', overflow: 'hidden',
                    }}>
                        <div style={{ position: 'absolute', top: 0, right: 0, bottom: 0, left: 0, background: 'radial-gradient(circle at 80% 50%, rgba(22,163,74,0.07) 0%, transparent 60%)', pointerEvents: 'none' }} />
                        <div style={{ position: 'relative' }}>
                            <div className="section-label" style={{ marginBottom: 16 }}>Custom Scorecards</div>
                            <h2 style={{ fontFamily: 'DM Serif Display, serif', fontSize: 38, color: '#f1f5f9', lineHeight: 1.2, letterSpacing: '-0.5px', marginBottom: 16 }}>
                                Your criteria.<br /><em style={{ color: BRAND, fontStyle: 'italic' }}>Your standards.</em>
                            </h2>
                            <p style={{ fontSize: 15, color: '#6b7280', lineHeight: 1.75, marginBottom: 28 }}>
                                Build scorecards with custom criteria, weights, and categories. The AI learns your exact standards and applies them consistently to every call.
                            </p>
                            <Link to="/login" className="btn-primary">Build your scorecard →</Link>
                        </div>

                        {/* Scorecard builder mini mockup */}
                        <div style={{ background: '#1a1d27', borderRadius: 16, border: '1px solid #2a2d3a', overflow: 'hidden', position: 'relative' }}>
                            <div style={{ background: '#13151f', borderBottom: '1px solid #2a2d3a', padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <span style={{ fontSize: 12, fontWeight: 600, color: '#f1f5f9' }}>Sales QA Scorecard</span>
                                <span style={{ fontSize: 10, background: 'rgba(22,163,74,0.15)', color: '#4ade80', padding: '2px 8px', borderRadius: 4, fontWeight: 600 }}>Active</span>
                            </div>
                            <div style={{ padding: 16 }}>
                                {[
                                    { label: 'Proper Greeting', pts: 10, cat: 'Communication' },
                                    { label: 'Needs Discovery', pts: 20, cat: 'Process' },
                                    { label: 'Product Knowledge', pts: 25, cat: 'Knowledge' },
                                    { label: 'Objection Handling', pts: 25, cat: 'Process' },
                                    { label: 'Closing Technique', pts: 20, cat: 'Process' },
                                ].map((c, i) => (
                                    <div key={c.label} style={{
                                        display: 'flex', alignItems: 'center', gap: 10,
                                        padding: '8px 0', borderBottom: '1px solid #2a2d3a',
                                    }}>
                                        <div style={{ width: 4, height: 4, borderRadius: '50%', background: '#4b5268', flexShrink: 0 }} />
                                        <span style={{ flex: 1, fontSize: 11, color: '#8b93a7' }}>{c.label}</span>
                                        <span style={{ fontSize: 10, color: '#4b5268', background: '#22263a', padding: '2px 8px', borderRadius: 4 }}>{c.cat}</span>
                                        <span style={{ fontSize: 11, fontWeight: 700, color: '#4ade80', minWidth: 28, textAlign: 'right' }}>{c.pts}pt</span>
                                    </div>
                                ))}
                                <div style={{ paddingTop: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span style={{ fontSize: 11, color: '#4b5268' }}>Total</span>
                                    <span style={{ fontSize: 14, fontWeight: 800, color: '#4ade80' }}>100 pts</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Testimonials ── */}
            <section style={{ padding: '100px 24px', background: '#f9fafb' }}>
                <div style={{ maxWidth: 1100, margin: '0 auto' }}>
                    <div style={{ textAlign: 'center', marginBottom: 64 }}>
                        <div className="section-label" style={{ marginBottom: 16 }}>Testimonials</div>
                        <h2 className="section-title">Teams love CallAnalytics</h2>
                    </div>
                    <div className="testimonials-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 20 }}>
                        {testimonials.map((t) => (
                            <div key={t.name} className="testimonial-card">
                                <div style={{ fontSize: 40, color: '#d1fae5', fontFamily: 'Georgia, serif', lineHeight: 1, marginBottom: 16 }}>"</div>
                                <p style={{ fontSize: 15, color: '#374151', lineHeight: 1.75, marginBottom: 24 }}>{t.quote}</p>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                    <div style={{ width: 40, height: 40, borderRadius: '50%', background: t.color + '20', border: `2px solid ${t.color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                        <span style={{ fontSize: 13, fontWeight: 700, color: t.color }}>{t.initials}</span>
                                    </div>
                                    <div>
                                        <div style={{ fontSize: 14, fontWeight: 700, color: '#111827' }}>{t.name}</div>
                                        <div style={{ fontSize: 12, color: '#9ca3af', marginTop: 2 }}>{t.role}</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── CTA ── */}
            <section style={{ padding: '100px 24px', background: '#0a0a0a', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 600, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(22,163,74,0.1) 0%, transparent 70%)', pointerEvents: 'none' }} />
                <div style={{ maxWidth: 600, margin: '0 auto', position: 'relative' }}>
                    <h2 style={{ fontFamily: 'DM Serif Display, serif', fontSize: 'clamp(32px, 5vw, 54px)', color: '#fff', lineHeight: 1.15, letterSpacing: '-1px', marginBottom: 20 }}>
                        Ready to score every call<br /><em style={{ color: BRAND, fontStyle: 'italic' }}>automatically?</em>
                    </h2>
                    <p style={{ fontSize: 17, color: '#6b7280', marginBottom: 40, lineHeight: 1.7 }}>
                        Join hundreds of teams using CallAnalytics to improve call quality, coach agents faster, and hit performance targets.
                    </p>
                    <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
                        <Link to="/login" className="btn-primary" style={{ fontSize: 16, padding: '14px 32px' }}>Get started free →</Link>
                        <Link to="/login" style={{ fontSize: 16, padding: '14px 32px', display: 'inline-flex', alignItems: 'center', borderRadius: 10, border: '1.5px solid #2a2d3a', color: '#9ca3af', textDecoration: 'none', fontFamily: 'DM Sans, sans-serif', fontWeight: 500, transition: 'border-color 0.15s' }}>Sign in</Link>
                    </div>
                    <p style={{ fontSize: 13, color: '#4b5268', marginTop: 20 }}>No credit card required · Free 14-day trial</p>
                </div>
            </section>

            {/* ── Footer ── */}
            <footer style={{ background: '#0a0a0a', borderTop: '1px solid #1a1d27', padding: '40px 24px' }}>
                <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{ width: 28, height: 28, borderRadius: 7, background: BRAND, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <span style={{ fontSize: 14 }}>🎧</span>
                        </div>
                        <span style={{ fontWeight: 700, fontSize: 14, color: '#fff' }}>CallAnalytics</span>
                    </div>
                    <div style={{ display: 'flex', gap: 24 }}>
                        {['Privacy Policy', 'Terms of Service', 'Help Center'].map(item => (
                            <a key={item} href="#" style={{ fontSize: 13, color: '#4b5268', textDecoration: 'none' }}
                                onMouseEnter={(e) => e.target.style.color = '#6b7280'}
                                onMouseLeave={(e) => e.target.style.color = '#4b5268'}>
                                {item}
                            </a>
                        ))}
                    </div>
                    <span style={{ fontSize: 13, color: '#4b5268' }}>© 2025 CallAnalytics</span>
                </div>
            </footer>
        </div>
    )
}