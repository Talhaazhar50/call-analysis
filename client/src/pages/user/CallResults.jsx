import { useState } from "react";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";

const BRAND = '#16a34a'

const callData = {
    name: 'sales_call_may12.mp3',
    date: 'Mar 8, 2026',
    duration: '6:34',
    scorecard: 'Sales QA',
    score: 84,
    pass: true,
    coachingNote: 'Great call overall, Sarah. Your greeting was natural and you showed strong product knowledge. Focus on asking deeper discovery questions before jumping to the pitch — try to understand the prospect\'s current process first. Also, when the prospect raised pricing concerns, slow down and address each concern specifically rather than moving quickly to the plan overview.',
    criteria: [
        { label: 'Proper Greeting', score: 9, max: 10, reasoning: 'Agent introduced themselves clearly and confirmed the prospect\'s name. Tone was professional and warm.' },
        { label: 'Needs Discovery', score: 14, max: 20, reasoning: 'Agent asked 2 discovery questions but moved to pitch too quickly. Did not explore the prospect\'s current QA process deeply enough.' },
        { label: 'Product Knowledge', score: 22, max: 25, reasoning: 'Strong product knowledge demonstrated. Agent accurately explained Whisper transcription and Claude scoring. Minor gap in explaining pricing tiers.' },
        { label: 'Objection Handling', score: 18, max: 25, reasoning: 'Handled pricing objection but rushed the response. Should have acknowledged the concern more before pivoting to value. Did not address ROI directly.' },
        { label: 'Closing Technique', score: 21, max: 20, reasoning: 'Agent secured a clear next step — demo booking confirmed. Strong close. Summarized action items well.' },
    ],
    transcript: [
        { speaker: 'Agent', time: '0:04', text: 'Hi, this is Sarah from CallAnalytics. Am I speaking with Mr. Davis?' },
        { speaker: 'Customer', time: '0:08', text: 'Yes, speaking. What is this about?' },
        { speaker: 'Agent', time: '0:11', text: 'Great! I wanted to reach out because I noticed your company handles a large sales team and our platform could really help automate your call QA process.' },
        { speaker: 'Customer', time: '0:22', text: 'Interesting. We do have a QA process but it\'s very manual right now.' },
        { speaker: 'Agent', time: '0:28', text: 'That\'s exactly what we solve. Our platform uses AI to transcribe and score every call automatically.' },
        { speaker: 'Customer', time: '0:36', text: 'How much does it cost?' },
        { speaker: 'Agent', time: '0:39', text: 'We have a few plans. For a team like yours I recommend our Growth plan at $299 a month, which covers up to 50 agents.' },
        { speaker: 'Customer', time: '0:48', text: 'That seems a bit expensive. We\'re a startup.' },
        { speaker: 'Agent', time: '0:52', text: 'Totally understand. Let me show you the ROI — most teams save 20+ hours a week of manual QA work. Would a quick 15-min demo work for you Thursday?' },
        { speaker: 'Customer', time: '1:04', text: 'Sure, Thursday at 2pm works.' },
        { speaker: 'Agent', time: '1:08', text: 'Perfect! I\'ll send a calendar invite right now. Looking forward to it Mr. Davis.' },
    ],
}

export default function CallResults() {
    const { dark, C } = useOutletContext()
    const navigate = useNavigate()
    const { id } = useParams()
    const [activeTab, setActiveTab] = useState('score') // score | transcript

    const total = callData.criteria.reduce((s, c) => s + c.score, 0)
    const max = callData.criteria.reduce((s, c) => s + c.max, 0)

    return (
        <div style={{ padding: '32px 36px', maxWidth: 1100 }}>
            {/* Back + header */}
            <div style={{ marginBottom: 24 }}>
                <button
                    onClick={() => navigate('/dashboard/calls')}
                    style={{ background: 'none', border: 'none', color: C.muted, fontSize: 13, cursor: 'pointer', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 4, fontFamily: 'DM Sans, sans-serif' }}
                >
                    ← Back to My Calls
                </button>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                            <div style={{ width: 36, height: 36, borderRadius: 9, background: '#f0fdf4', border: '1px solid #bbf7d0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>🎵</div>
                            <h1 style={{ fontSize: 22, fontWeight: 800, color: C.text, letterSpacing: '-0.3px' }}>{callData.name}</h1>
                        </div>
                        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                            {[
                                { label: callData.date },
                                { label: callData.duration },
                                { label: callData.scorecard },
                            ].map((item, i) => (
                                <span key={i} style={{ fontSize: 12, color: C.muted, display: 'flex', alignItems: 'center', gap: 4 }}>
                                    {item.label}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Score badge */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div style={{ textAlign: 'right' }}>
                            <div style={{ fontSize: 40, fontWeight: 800, color: callData.pass ? BRAND : '#dc2626', lineHeight: 1 }}>{callData.score}%</div>
                            <div style={{ fontSize: 11, color: C.muted, marginTop: 2 }}>{total}/{max} points</div>
                        </div>
                        <div style={{
                            padding: '8px 16px', borderRadius: 10, fontSize: 13, fontWeight: 700,
                            background: callData.pass ? (dark ? 'rgba(22,163,74,0.15)' : '#f0fdf4') : (dark ? 'rgba(220,38,38,0.15)' : '#fef2f2'),
                            color: callData.pass ? BRAND : '#dc2626',
                            border: `1.5px solid ${callData.pass ? (dark ? 'rgba(22,163,74,0.3)' : '#bbf7d0') : (dark ? 'rgba(220,38,38,0.3)' : '#fecaca')}`,
                        }}>
                            {callData.pass ? '✓ PASS' : '✗ FAIL'}
                        </div>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div style={{ display: 'flex', gap: 4, background: C.tableTh, padding: 4, borderRadius: 10, width: 'fit-content', marginBottom: 24 }}>
                {[
                    { val: 'score', label: '🧠 AI Score' },
                    { val: 'transcript', label: '🎙️ Transcript' },
                ].map(tab => (
                    <button key={tab.val} onClick={() => setActiveTab(tab.val)} style={{
                        background: activeTab === tab.val ? C.surface : 'transparent',
                        border: activeTab === tab.val ? `1px solid ${C.border}` : '1px solid transparent',
                        borderRadius: 7, padding: '7px 20px', fontSize: 13,
                        color: activeTab === tab.val ? C.text : C.muted,
                        fontWeight: activeTab === tab.val ? 700 : 400,
                        cursor: 'pointer', fontFamily: 'DM Sans, sans-serif',
                        boxShadow: activeTab === tab.val ? '0 1px 4px rgba(0,0,0,0.06)' : 'none',
                        transition: 'all 0.15s',
                    }}>
                        {tab.label}
                    </button>
                ))}
            </div>

            {activeTab === 'score' && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                    {/* Criteria breakdown */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                        <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 16, overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
                            <div style={{ padding: '16px 20px', borderBottom: `1px solid ${C.border}` }}>
                                <div style={{ fontSize: 14, fontWeight: 700, color: C.text }}>Score Breakdown</div>
                            </div>
                            <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 16 }}>
                                {callData.criteria.map((c, i) => {
                                    const pct = Math.round((c.score / c.max) * 100)
                                    return (
                                        <div key={c.label} style={{ background: C.tableTh, border: `1px solid ${C.border}`, borderRadius: 12, padding: '14px 16px' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                                                <span style={{ fontSize: 13, fontWeight: 700, color: C.text }}>{c.label}</span>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                                    <span style={{ fontSize: 13, fontWeight: 800, color: pct >= 70 ? BRAND : '#ea580c' }}>{c.score}/{c.max}</span>
                                                    <span style={{
                                                        fontSize: 10, fontWeight: 700, padding: '2px 7px', borderRadius: 6,
                                                        background: pct >= 70 ? (dark ? 'rgba(22,163,74,0.15)' : '#f0fdf4') : (dark ? 'rgba(234,88,12,0.15)' : '#fff7ed'),
                                                        color: pct >= 70 ? BRAND : '#ea580c',
                                                    }}>
                                                        {pct}%
                                                    </span>
                                                </div>
                                            </div>
                                            <div style={{ height: 5, background: C.border, borderRadius: 10, overflow: 'hidden', marginBottom: 10 }}>
                                                <div style={{
                                                    height: '100%', borderRadius: 10, width: `${pct}%`,
                                                    background: pct >= 70 ? `linear-gradient(90deg, ${BRAND}, #4ade80)` : 'linear-gradient(90deg, #f97316, #ea580c)',
                                                    transition: 'width 1s ease',
                                                }} />
                                            </div>
                                            <p style={{ fontSize: 12, color: C.muted, lineHeight: 1.6 }}>{c.reasoning}</p>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Right column */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                        {/* Overall score ring-style */}
                        <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 16, padding: '24px', textAlign: 'center', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
                            <div style={{ fontSize: 12, color: C.muted, marginBottom: 12, fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}>Overall Score</div>
                            {/* SVG ring */}
                            <svg viewBox="0 0 120 120" style={{ width: 120, height: 120, margin: '0 auto 16px', display: 'block' }}>
                                <circle cx="60" cy="60" r="50" fill="none" stroke={dark ? '#2a2d3a' : '#f3f4f6'} strokeWidth="10" />
                                <circle
                                    cx="60" cy="60" r="50" fill="none"
                                    stroke={callData.score >= 70 ? BRAND : '#dc2626'}
                                    strokeWidth="10"
                                    strokeDasharray={`${(callData.score / 100) * 314} 314`}
                                    strokeLinecap="round"
                                    transform="rotate(-90 60 60)"
                                    style={{ transition: 'stroke-dasharray 1s ease' }}
                                />
                                <text x="60" y="58" textAnchor="middle" style={{ fontSize: 22, fontWeight: 800, fill: callData.score >= 70 ? BRAND : '#dc2626', fontFamily: 'DM Sans, sans-serif' }}>{callData.score}%</text>
                                <text x="60" y="74" textAnchor="middle" style={{ fontSize: 10, fill: dark ? '#6b7280' : '#9ca3af', fontFamily: 'DM Sans, sans-serif' }}>{total}/{max} pts</text>
                            </svg>
                            <div style={{ display: 'flex', justify: 'center', gap: 20, justifyContent: 'center' }}>
                                {[
                                    { label: 'Pass threshold', value: '70%' },
                                    { label: 'Your score', value: `${callData.score}%` },
                                ].map(item => (
                                    <div key={item.label} style={{ textAlign: 'center' }}>
                                        <div style={{ fontSize: 14, fontWeight: 700, color: C.text }}>{item.value}</div>
                                        <div style={{ fontSize: 10, color: C.muted }}>{item.label}</div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Coaching note */}
                        {callData.coachingNote && (
                            <div style={{ background: dark ? 'rgba(8,145,178,0.08)' : '#f0f9ff', border: `1px solid ${dark ? 'rgba(8,145,178,0.2)' : '#bae6fd'}`, borderRadius: 16, padding: '20px', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                                    <span style={{ fontSize: 18 }}>💬</span>
                                    <span style={{ fontSize: 13, fontWeight: 700, color: '#0369a1' }}>Coaching Note from Admin</span>
                                </div>
                                <p style={{ fontSize: 13, color: dark ? '#7dd3fc' : '#0c4a6e', lineHeight: 1.7 }}>{callData.coachingNote}</p>
                            </div>
                        )}

                        {/* Quick stats */}
                        <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 16, padding: '20px', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
                            <div style={{ fontSize: 13, fontWeight: 700, color: C.text, marginBottom: 14 }}>At a glance</div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                                {[
                                    { label: 'Highest scoring', value: 'Proper Greeting', sub: '90%', color: BRAND },
                                    { label: 'Needs improvement', value: 'Objection Handling', sub: '72%', color: '#ea580c' },
                                    { label: 'Call duration', value: callData.duration, sub: '', color: C.text },
                                ].map(item => (
                                    <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', background: C.tableTh, borderRadius: 8 }}>
                                        <span style={{ fontSize: 12, color: C.muted }}>{item.label}</span>
                                        <span style={{ fontSize: 12, fontWeight: 600, color: item.color }}>{item.value} {item.sub && <span style={{ fontWeight: 400, color: C.muted }}>· {item.sub}</span>}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'transcript' && (
                <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 16, overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
                    <div style={{ padding: '16px 24px', borderBottom: `1px solid ${C.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ fontSize: 14, fontWeight: 700, color: C.text }}>Call Transcript</div>
                        <span style={{ fontSize: 11, color: C.muted, background: C.tableTh, padding: '3px 10px', borderRadius: 6 }}>{callData.transcript.length} turns</span>
                    </div>
                    <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: 16 }}>
                        {callData.transcript.map((line, i) => (
                            <div key={i} style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                                <div style={{
                                    width: 32, height: 32, borderRadius: '50%', flexShrink: 0,
                                    background: line.speaker === 'Agent' ? '#f0fdf4' : (dark ? '#1e3a5f' : '#eff6ff'),
                                    border: `1.5px solid ${line.speaker === 'Agent' ? '#86efac' : '#93c5fd'}`,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                }}>
                                    <span style={{ fontSize: 11, fontWeight: 800, color: line.speaker === 'Agent' ? BRAND : '#2563eb' }}>
                                        {line.speaker === 'Agent' ? 'A' : 'C'}
                                    </span>
                                </div>
                                <div style={{ flex: 1, background: C.tableTh, border: `1px solid ${C.border}`, borderRadius: 12, padding: '12px 16px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                                        <span style={{ fontSize: 11, fontWeight: 700, color: line.speaker === 'Agent' ? BRAND : '#2563eb', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                            {line.speaker}
                                        </span>
                                        <span style={{ fontSize: 10, color: C.subtle }}>{line.time}</span>
                                    </div>
                                    <p style={{ fontSize: 14, color: C.text, lineHeight: 1.65 }}>{line.text}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}