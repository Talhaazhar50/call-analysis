import { useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";

const BRAND = '#16a34a'

const allCalls = [
    { id: 1, name: 'sales_call_may12.mp3', score: 84, pass: true, date: 'Mar 8, 2026', duration: '6:34', scorecard: 'Sales QA', coached: true },
    { id: 2, name: 'followup_davis.mp3', score: 61, pass: false, date: 'Mar 6, 2026', duration: '4:12', scorecard: 'Sales QA', coached: false },
    { id: 3, name: 'inbound_jones.mp3', score: 91, pass: true, date: 'Mar 4, 2026', duration: '8:02', scorecard: 'Support QA', coached: false },
    { id: 4, name: 'cold_call_batch3.mp3', score: 74, pass: true, date: 'Mar 1, 2026', duration: '3:50', scorecard: 'Sales QA', coached: true },
    { id: 5, name: 'demo_call_abc.mp3', score: 55, pass: false, date: 'Feb 26, 2026', duration: '12:15', scorecard: 'Sales QA', coached: false },
    { id: 6, name: 'support_ticket_22.mp3', score: 88, pass: true, date: 'Feb 22, 2026', duration: '5:40', scorecard: 'Support QA', coached: false },
    { id: 7, name: 'onboarding_new_client.mp3', score: 79, pass: true, date: 'Feb 18, 2026', duration: '9:22', scorecard: 'Onboarding QA', coached: true },
    { id: 8, name: 'renewal_call_xyz.mp3', score: 48, pass: false, date: 'Feb 15, 2026', duration: '7:05', scorecard: 'Sales QA', coached: true },
]

export default function MyCalls() {
    const { dark, C } = useOutletContext()
    const navigate = useNavigate()
    const [search, setSearch] = useState('')
    const [filter, setFilter] = useState('all') // all | pass | fail | coached
    const [sort, setSort] = useState('date')

    const filtered = allCalls
        .filter(c => {
            if (search && !c.name.toLowerCase().includes(search.toLowerCase()) && !c.scorecard.toLowerCase().includes(search.toLowerCase())) return false
            if (filter === 'pass' && !c.pass) return false
            if (filter === 'fail' && c.pass) return false
            if (filter === 'coached' && !c.coached) return false
            return true
        })
        .sort((a, b) => {
            if (sort === 'score') return b.score - a.score
            if (sort === 'score-asc') return a.score - b.score
            return 0
        })

    const passCount = allCalls.filter(c => c.pass).length
    const avgScore = Math.round(allCalls.reduce((s, c) => s + c.score, 0) / allCalls.length)

    return (
        <div style={{ padding: '32px 36px' }}>
            <div style={{ marginBottom: 28 }}>
                <h1 style={{ fontSize: 24, fontWeight: 800, color: C.text, letterSpacing: '-0.5px', marginBottom: 4 }}>My Calls</h1>
                <p style={{ fontSize: 14, color: C.muted }}>All your uploaded calls and AI scores in one place.</p>
            </div>

            {/* Mini stat strip */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 24 }}>
                {[
                    { label: 'Total', value: allCalls.length, color: '#2563eb' },
                    { label: 'Avg Score', value: `${avgScore}%`, color: BRAND },
                    { label: 'Passed', value: passCount, color: '#7c3aed' },
                    { label: 'Failed', value: allCalls.length - passCount, color: '#dc2626' },
                ].map(s => (
                    <div key={s.label} style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, padding: '16px 18px' }}>
                        <div style={{ fontSize: 11, color: C.muted, fontWeight: 600, marginBottom: 6 }}>{s.label}</div>
                        <div style={{ fontSize: 22, fontWeight: 800, color: s.color }}>{s.value}</div>
                    </div>
                ))}
            </div>

            {/* Filters */}
            <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 14, overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
                <div style={{ padding: '14px 20px', borderBottom: `1px solid ${C.border}`, display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
                    {/* Search */}
                    <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
                        <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: C.muted, fontSize: 14 }}>🔍</span>
                        <input
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            placeholder="Search calls..."
                            style={{
                                width: '100%', paddingLeft: 36, paddingRight: 12, height: 36,
                                background: C.inputBg, border: `1px solid ${C.inputBorder}`,
                                borderRadius: 8, fontSize: 13, color: C.text,
                                fontFamily: 'DM Sans, sans-serif', outline: 'none',
                            }}
                        />
                    </div>

                    {/* Filter tabs */}
                    <div style={{ display: 'flex', gap: 4, background: C.tableTh, padding: 4, borderRadius: 8 }}>
                        {[
                            { val: 'all', label: 'All' },
                            { val: 'pass', label: '✓ Pass' },
                            { val: 'fail', label: '✗ Fail' },
                            { val: 'coached', label: '💬 Coached' },
                        ].map(tab => (
                            <button key={tab.val} onClick={() => setFilter(tab.val)} style={{
                                background: filter === tab.val ? C.surface : 'transparent',
                                border: filter === tab.val ? `1px solid ${C.border}` : '1px solid transparent',
                                borderRadius: 6, padding: '5px 12px', fontSize: 12,
                                color: filter === tab.val ? C.text : C.muted,
                                fontWeight: filter === tab.val ? 600 : 400,
                                cursor: 'pointer', fontFamily: 'DM Sans, sans-serif',
                                boxShadow: filter === tab.val ? '0 1px 3px rgba(0,0,0,0.06)' : 'none',
                                transition: 'all 0.15s',
                            }}>
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    {/* Sort */}
                    <select
                        value={sort}
                        onChange={e => setSort(e.target.value)}
                        style={{
                            background: C.inputBg, border: `1px solid ${C.inputBorder}`,
                            borderRadius: 8, padding: '5px 10px', fontSize: 12,
                            color: C.text, fontFamily: 'DM Sans, sans-serif', cursor: 'pointer', outline: 'none',
                        }}
                    >
                        <option value="date">Sort: Newest</option>
                        <option value="score">Sort: Highest Score</option>
                        <option value="score-asc">Sort: Lowest Score</option>
                    </select>
                </div>

                {/* Table */}
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ background: C.tableTh }}>
                            {['File', 'Scorecard', 'Score', 'Status', 'Coached', 'Date', 'Duration', ''].map(h => (
                                <th key={h} style={{ padding: '10px 18px', textAlign: 'left', fontSize: 11, fontWeight: 700, color: C.muted, letterSpacing: '0.05em', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.length === 0 ? (
                            <tr>
                                <td colSpan={8} style={{ padding: '48px 20px', textAlign: 'center', color: C.muted, fontSize: 14 }}>
                                    No calls found
                                </td>
                            </tr>
                        ) : filtered.map(call => (
                            <tr key={call.id}
                                style={{ borderTop: `1px solid ${C.border}`, cursor: 'pointer', transition: 'background 0.15s' }}
                                onMouseEnter={e => e.currentTarget.style.background = C.hover}
                                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                                onClick={() => navigate(`/dashboard/calls/${call.id}`)}
                            >
                                <td style={{ padding: '12px 18px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                        <div style={{ width: 30, height: 30, borderRadius: 7, background: C.tableTh, border: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13 }}>🎵</div>
                                        <span style={{ fontSize: 13, fontWeight: 500, color: C.text, maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{call.name}</span>
                                    </div>
                                </td>
                                <td style={{ padding: '12px 18px' }}>
                                    <span style={{ fontSize: 11, color: C.muted, background: C.tableTh, padding: '3px 8px', borderRadius: 6, whiteSpace: 'nowrap' }}>{call.scorecard}</span>
                                </td>
                                <td style={{ padding: '12px 18px' }}>
                                    <span style={{ fontSize: 14, fontWeight: 800, color: call.score >= 70 ? BRAND : '#dc2626' }}>{call.score}%</span>
                                </td>
                                <td style={{ padding: '12px 18px' }}>
                                    <span style={{
                                        fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 20, whiteSpace: 'nowrap',
                                        background: call.pass ? (dark ? 'rgba(22,163,74,0.15)' : '#f0fdf4') : (dark ? 'rgba(220,38,38,0.15)' : '#fef2f2'),
                                        color: call.pass ? BRAND : '#dc2626',
                                        border: `1px solid ${call.pass ? (dark ? 'rgba(22,163,74,0.3)' : '#bbf7d0') : (dark ? 'rgba(220,38,38,0.3)' : '#fecaca')}`,
                                    }}>
                                        {call.pass ? '✓ PASS' : '✗ FAIL'}
                                    </span>
                                </td>
                                <td style={{ padding: '12px 18px' }}>
                                    {call.coached
                                        ? <span style={{ fontSize: 11, fontWeight: 600, color: '#0891b2', background: dark ? 'rgba(8,145,178,0.1)' : '#f0f9ff', border: '1px solid rgba(8,145,178,0.2)', padding: '3px 8px', borderRadius: 6 }}>💬 Yes</span>
                                        : <span style={{ fontSize: 11, color: C.subtle }}>—</span>
                                    }
                                </td>
                                <td style={{ padding: '12px 18px', fontSize: 12, color: C.muted, whiteSpace: 'nowrap' }}>{call.date}</td>
                                <td style={{ padding: '12px 18px', fontSize: 12, color: C.muted }}>{call.duration}</td>
                                <td style={{ padding: '12px 18px' }}>
                                    <button style={{ background: 'none', border: 'none', fontSize: 12, color: BRAND, fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap' }}>View →</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}