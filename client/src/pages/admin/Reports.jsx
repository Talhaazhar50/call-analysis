import axios from "axios";
import { Badge, Box, Flex, Grid, Loader, Paper, Progress, Text, Title } from "@mantine/core";
import { IconAlertTriangle, IconClipboardList, IconFlame, IconUsers } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const BRAND = '#16a34a'
const API = import.meta.env.VITE_API_URL || 'http://localhost:8000/api'

const MOCK_CALLS = [
    { _id: 'm1', pass: true, percentage: 92, coached: true, scorecardName: 'Sales QA', user: { _id: 'u1', name: 'Sarah Johnson', email: 'sarah@acme.com' }, criteriaResults: [{ label: 'Proper Greeting', category: 'Communication', score: 9, max: 10 }, { label: 'Needs Discovery', category: 'Process', score: 16, max: 20 }, { label: 'Product Knowledge', category: 'Product', score: 22, max: 25 }, { label: 'Objection Handling', category: 'Process', score: 24, max: 25 }, { label: 'Closing Technique', category: 'Process', score: 19, max: 20 }] },
    { _id: 'm2', pass: false, percentage: 58, coached: false, scorecardName: 'Sales QA', user: { _id: 'u2', name: 'James Miller', email: 'james@acme.com' }, criteriaResults: [{ label: 'Proper Greeting', category: 'Communication', score: 3, max: 10 }, { label: 'Needs Discovery', category: 'Process', score: 8, max: 20 }, { label: 'Product Knowledge', category: 'Product', score: 14, max: 25 }, { label: 'Objection Handling', category: 'Process', score: 15, max: 25 }, { label: 'Closing Technique', category: 'Process', score: 18, max: 20 }] },
    { _id: 'm3', pass: true, percentage: 91, coached: true, scorecardName: 'Support QA', user: { _id: 'u3', name: 'Emily Chen', email: 'emily@acme.com' }, criteriaResults: [{ label: 'Empathy & Tone', category: 'Communication', score: 19, max: 20 }, { label: 'Issue Resolution', category: 'Process', score: 36, max: 40 }, { label: 'Compliance Check', category: 'Compliance', score: 18, max: 20 }, { label: 'Call Closing', category: 'Communication', score: 18, max: 20 }] },
    { _id: 'm4', pass: true, percentage: 72, coached: false, scorecardName: 'Sales QA', user: { _id: 'u4', name: 'Carlos Rivera', email: 'carlos@acme.com' }, criteriaResults: [{ label: 'Proper Greeting', category: 'Communication', score: 8, max: 10 }, { label: 'Needs Discovery', category: 'Process', score: 17, max: 20 }, { label: 'Product Knowledge', category: 'Product', score: 18, max: 25 }, { label: 'Objection Handling', category: 'Process', score: 14, max: 25 }, { label: 'Closing Technique', category: 'Process', score: 15, max: 20 }] },
    { _id: 'm5', pass: false, percentage: 54, coached: false, scorecardName: 'Support QA', user: { _id: 'u2', name: 'James Miller', email: 'james@acme.com' }, criteriaResults: [{ label: 'Empathy & Tone', category: 'Communication', score: 10, max: 20 }, { label: 'Issue Resolution', category: 'Process', score: 20, max: 40 }, { label: 'Compliance Check', category: 'Compliance', score: 12, max: 20 }, { label: 'Call Closing', category: 'Communication', score: 12, max: 20 }] },
    { _id: 'm6', pass: false, percentage: 44, coached: false, scorecardName: 'Sales QA', user: { _id: 'u2', name: 'James Miller', email: 'james@acme.com' }, criteriaResults: [{ label: 'Proper Greeting', category: 'Communication', score: 4, max: 10 }, { label: 'Needs Discovery', category: 'Process', score: 9, max: 20 }, { label: 'Product Knowledge', category: 'Product', score: 10, max: 25 }, { label: 'Objection Handling', category: 'Process', score: 10, max: 25 }, { label: 'Closing Technique', category: 'Process', score: 11, max: 20 }] },
    { _id: 'm7', pass: true, percentage: 88, coached: true, scorecardName: 'Support QA', user: { _id: 'u3', name: 'Emily Chen', email: 'emily@acme.com' }, criteriaResults: [{ label: 'Empathy & Tone', category: 'Communication', score: 17, max: 20 }, { label: 'Issue Resolution', category: 'Process', score: 34, max: 40 }, { label: 'Compliance Check', category: 'Compliance', score: 19, max: 20 }, { label: 'Call Closing', category: 'Communication', score: 18, max: 20 }] },
    { _id: 'm8', pass: false, percentage: 61, coached: false, scorecardName: 'Sales QA', user: { _id: 'u4', name: 'Carlos Rivera', email: 'carlos@acme.com' }, criteriaResults: [{ label: 'Proper Greeting', category: 'Communication', score: 6, max: 10 }, { label: 'Needs Discovery', category: 'Process', score: 14, max: 20 }, { label: 'Product Knowledge', category: 'Product', score: 15, max: 25 }, { label: 'Objection Handling', category: 'Process', score: 12, max: 25 }, { label: 'Closing Technique', category: 'Process', score: 14, max: 20 }] },
]

function SectionHeader({ icon: Icon, title, sub, color = BRAND }) {
    return (
        <Flex align="center" gap={10} mb={16}>
            <Box style={{ width: 34, height: 34, borderRadius: 9, background: color + '15', border: `1px solid ${color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Icon size={17} color={color} />
            </Box>
            <Box>
                <Text style={{ fontSize: 15, fontWeight: 700, lineHeight: 1.2 }}>{title}</Text>
                {sub && <Text style={{ fontSize: 12, opacity: 0.6, marginTop: 2 }}>{sub}</Text>}
            </Box>
        </Flex>
    )
}

export default function Reports() {
    const { C } = useOutletContext()
    const [calls, setCalls] = useState([])
    const [loading, setLoading] = useState(true)

    const token = localStorage.getItem('token')
    const headers = { Authorization: `Bearer ${token}` }

    useEffect(() => {
        axios.get(`${API}/calls/admin/all`, { headers })
            .then(r => setCalls(r.data.filter(c => c.status === 'done')))
            .catch(() => { })
            .finally(() => setLoading(false))
    }, [])

    if (loading) return (
        <Box style={{ display: 'flex', justifyContent: 'center', paddingTop: 80 }}>
            <Loader color="green" />
        </Box>
    )

    const useMock = calls.length < 3
    const data = useMock ? MOCK_CALLS : calls

    // ── 1. Criteria Heatmap ──────────────────────────────────────────────────
    const criteriaMap = {}
    data.forEach(call => {
        call.criteriaResults?.forEach(cr => {
            if (!criteriaMap[cr.label]) criteriaMap[cr.label] = { label: cr.label, totalScore: 0, totalMax: 0, count: 0, failCount: 0 }
            const pct = cr.max > 0 ? (cr.score / cr.max) * 100 : 0
            criteriaMap[cr.label].totalScore += cr.score
            criteriaMap[cr.label].totalMax += cr.max
            criteriaMap[cr.label].count += 1
            if (pct < 70) criteriaMap[cr.label].failCount += 1
        })
    })
    const criteriaData = Object.values(criteriaMap)
        .map(c => ({ label: c.label, avgPct: c.totalMax > 0 ? Math.round((c.totalScore / c.totalMax) * 100) : 0, failRate: Math.round((c.failCount / c.count) * 100), count: c.count }))
        .sort((a, b) => a.avgPct - b.avgPct)

    // ── 2. Agent Comparison ──────────────────────────────────────────────────
    const agentMap = {}
    data.forEach(call => {
        const id = call.user?._id || call.user
        const name = call.user?.name || call.user?.email?.split('@')[0] || 'Unknown'
        const email = call.user?.email || ''
        if (!agentMap[id]) agentMap[id] = { name, email, calls: [], passed: 0, coached: 0 }
        agentMap[id].calls.push(call.percentage)
        if (call.pass) agentMap[id].passed += 1
        if (call.coached) agentMap[id].coached += 1
    })
    const agentData = Object.values(agentMap)
        .map(a => ({ name: a.name, email: a.email, totalCalls: a.calls.length, avgScore: Math.round(a.calls.reduce((s, v) => s + v, 0) / a.calls.length), passRate: Math.round((a.passed / a.calls.length) * 100), coached: a.coached }))
        .sort((a, b) => b.avgScore - a.avgScore)

    // ── 3. Scorecard Effectiveness ───────────────────────────────────────────
    const scorecardMap = {}
    data.forEach(call => {
        const name = call.scorecardName || 'Unknown'
        if (!scorecardMap[name]) scorecardMap[name] = { name, total: 0, passed: 0, scores: [] }
        scorecardMap[name].total += 1
        if (call.pass) scorecardMap[name].passed += 1
        scorecardMap[name].scores.push(call.percentage)
    })
    const scorecardData = Object.values(scorecardMap)
        .map(s => ({ name: s.name, total: s.total, passRate: Math.round((s.passed / s.total) * 100), avgScore: Math.round(s.scores.reduce((a, b) => a + b, 0) / s.scores.length) }))
        .sort((a, b) => a.passRate - b.passRate)

    // ── 4. Repeat Failures ───────────────────────────────────────────────────
    const failMap = {}
    data.filter(c => !c.pass).forEach(call => {
        const id = call.user?._id || call.user
        const name = call.user?.name || call.user?.email?.split('@')[0] || 'Unknown'
        const email = call.user?.email || ''
        if (!failMap[id]) failMap[id] = { name, email, fails: [], scorecards: [] }
        failMap[id].fails.push(call)
        if (!failMap[id].scorecards.includes(call.scorecardName)) failMap[id].scorecards.push(call.scorecardName)
    })
    const repeatFailers = Object.values(failMap).filter(a => a.fails.length > 1).sort((a, b) => b.fails.length - a.fails.length)

    const colors = [BRAND, '#2563eb', '#7c3aed', '#ea580c', '#0891b2', '#db2777']
    const avatarColor = (name = '') => colors[(name.charCodeAt(0) || 0) % colors.length]

    const thStyle = { fontSize: 11, color: C.subtle, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', padding: '10px 16px', textAlign: 'left', background: C.tableTh }
    const tdStyle = { padding: '13px 16px', borderTop: `1px solid ${C.border}` }

    return (
        <Box>
            <Box mb={28}>
                <Flex align="center" justify="space-between" style={{ flexWrap: 'wrap', gap: 8 }}>
                    <Box>
                        <Title order={2} style={{ color: C.text, fontWeight: 700, fontSize: 22, letterSpacing: '-0.3px' }}>Reports</Title>
                        <Text style={{ color: C.muted, fontSize: 14, marginTop: 4 }}>
                            Deep insights across {data.length} analyzed calls
                        </Text>
                    </Box>
                    {useMock && (
                        <Badge radius={8} style={{ background: '#fefce8', color: '#854d0e', border: '1px solid #fef08a', fontWeight: 600, fontSize: 12, padding: '6px 12px' }}>
                            Preview mode - showing sample data
                        </Badge>
                    )}
                </Flex>
            </Box>

            <Grid gutter={24}>

                {/* ── Criteria Heatmap ── */}
                <Grid.Col span={12}>
                    <Paper p={24} radius={12} style={{ border: `1px solid ${C.border}`, background: C.surface, boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
                        <SectionHeader icon={IconFlame} title="Criteria Failure Heatmap" sub="Which criteria agents struggle with most, sorted by lowest average score" color="#ea580c" />
                        {criteriaData.map((c) => (
                            <Box key={c.label} mb={14}>
                                <Flex justify="space-between" align="center" mb={5}>
                                    <Flex align="center" gap={8}>
                                        <Text style={{ fontSize: 13, fontWeight: 600, color: C.text, minWidth: 180 }}>{c.label}</Text>
                                        <Badge radius={6} style={{
                                            fontSize: 10, fontWeight: 600,
                                            background: c.failRate >= 50 ? '#fef2f2' : c.failRate >= 25 ? '#fff7ed' : '#f0fdf4',
                                            color: c.failRate >= 50 ? '#dc2626' : c.failRate >= 25 ? '#ea580c' : BRAND,
                                            border: `1px solid ${c.failRate >= 50 ? '#fecaca' : c.failRate >= 25 ? '#fed7aa' : '#bbf7d0'}`,
                                        }}>
                                            {c.failRate}% fail rate
                                        </Badge>
                                        <Text style={{ fontSize: 11, color: C.subtle }}>{c.count} calls</Text>
                                    </Flex>
                                    <Text style={{ fontSize: 14, fontWeight: 800, color: c.avgPct >= 70 ? BRAND : '#dc2626' }}>{c.avgPct}%</Text>
                                </Flex>
                                <Progress value={c.avgPct} color={c.avgPct >= 70 ? 'green' : c.avgPct >= 50 ? 'orange' : 'red'} size={10} radius={4} />
                            </Box>
                        ))}
                    </Paper>
                </Grid.Col>

                {/* ── Agent Comparison ── */}
                <Grid.Col span={{ base: 12, md: 7 }}>
                    <Paper p={24} radius={12} style={{ border: `1px solid ${C.border}`, background: C.surface, boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
                        <SectionHeader icon={IconUsers} title="Agent Comparison" sub="Side-by-side performance ranked by average score" color="#2563eb" />
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr>{['Agent', 'Calls', 'Avg Score', 'Pass Rate', 'Coached'].map(h => <th key={h} style={thStyle}>{h}</th>)}</tr>
                            </thead>
                            <tbody>
                                {agentData.map((a, i) => {
                                    const color = avatarColor(a.name)
                                    const initials = a.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
                                    const medals = ['🥇', '🥈', '🥉']
                                    return (
                                        <tr key={a.email} onMouseEnter={e => e.currentTarget.style.background = C.hover} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                                            <td style={tdStyle}>
                                                <Flex align="center" gap={10}>
                                                    {i < 3 ? (
                                                        <Text style={{ fontSize: 18, lineHeight: 1 }}>{medals[i]}</Text>
                                                    ) : (
                                                        <Box style={{ width: 28, height: 28, borderRadius: '50%', background: color + '20', border: `1.5px solid ${color}40`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                            <Text style={{ fontSize: 10, fontWeight: 700, color }}>{initials}</Text>
                                                        </Box>
                                                    )}
                                                    <Box>
                                                        <Text style={{ fontSize: 13, fontWeight: 600, color: C.text }}>{a.name}</Text>
                                                        <Text style={{ fontSize: 11, color: C.subtle }}>{a.email}</Text>
                                                    </Box>
                                                </Flex>
                                            </td>
                                            <td style={tdStyle}><Text style={{ fontSize: 13, color: C.muted }}>{a.totalCalls}</Text></td>
                                            <td style={tdStyle}>
                                                <Flex align="center" gap={8}>
                                                    <Text style={{ fontSize: 13, fontWeight: 700, color: a.avgScore >= 70 ? BRAND : '#dc2626' }}>{a.avgScore}%</Text>
                                                    <Progress value={a.avgScore} color={a.avgScore >= 70 ? 'green' : 'red'} size={4} radius={4} style={{ width: 50 }} />
                                                </Flex>
                                            </td>
                                            <td style={tdStyle}><Text style={{ fontSize: 13, fontWeight: 600, color: a.passRate >= 70 ? BRAND : '#ea580c' }}>{a.passRate}%</Text></td>
                                            <td style={tdStyle}><Text style={{ fontSize: 13, color: C.muted }}>{a.coached}/{a.totalCalls}</Text></td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </Paper>
                </Grid.Col>

                {/* ── Scorecard Effectiveness ── */}
                <Grid.Col span={{ base: 12, md: 5 }}>
                    <Paper p={24} radius={12} style={{ border: `1px solid ${C.border}`, background: C.surface, boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
                        <SectionHeader icon={IconClipboardList} title="Scorecard Effectiveness" sub="Pass rates per scorecard" color="#7c3aed" />
                        <ResponsiveContainer width="100%" height={200}>
                            <BarChart data={scorecardData} margin={{ top: 4, right: 8, left: -20, bottom: 40 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke={C.border} />
                                <XAxis dataKey="name" tick={{ fontSize: 11, fill: C.subtle }} axisLine={false} tickLine={false} angle={-20} textAnchor="end" interval={0} />
                                <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: C.subtle }} axisLine={false} tickLine={false} />
                                <Tooltip contentStyle={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, fontSize: 12 }} formatter={(v) => [`${v}%`, 'Pass Rate']} />
                                <Bar dataKey="passRate" radius={[6, 6, 0, 0]}>
                                    {scorecardData.map((entry, i) => (
                                        <Cell key={i} fill={entry.passRate >= 70 ? BRAND : entry.passRate >= 50 ? '#f59e0b' : '#ef4444'} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                        <Box mt={8}>
                            {scorecardData.map(s => (
                                <Flex key={s.name} justify="space-between" align="center" py={10} style={{ borderTop: `1px solid ${C.border}` }}>
                                    <Text style={{ fontSize: 13, color: C.text, fontWeight: 500 }}>{s.name}</Text>
                                    <Flex align="center" gap={12}>
                                        <Text style={{ fontSize: 12, color: C.subtle }}>{s.total} calls</Text>
                                        <Badge radius={6} style={{
                                            background: s.passRate >= 70 ? '#f0fdf4' : s.passRate >= 50 ? '#fff7ed' : '#fef2f2',
                                            color: s.passRate >= 70 ? BRAND : s.passRate >= 50 ? '#ea580c' : '#dc2626',
                                            border: `1px solid ${s.passRate >= 70 ? '#bbf7d0' : s.passRate >= 50 ? '#fed7aa' : '#fecaca'}`,
                                            fontWeight: 700, fontSize: 11,
                                        }}>{s.passRate}% pass</Badge>
                                    </Flex>
                                </Flex>
                            ))}
                        </Box>
                    </Paper>
                </Grid.Col>

                {/* ── Repeat Failures ── */}
                <Grid.Col span={12}>
                    <Paper p={24} radius={12} style={{ border: `1px solid ${C.border}`, background: C.surface, boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
                        <SectionHeader icon={IconAlertTriangle} title="Repeat Failures" sub="Agents who failed more than once — high priority for coaching" color="#dc2626" />
                        {repeatFailers.length === 0 ? (
                            <Box style={{ padding: '24px 0', textAlign: 'center' }}>
                                <Text style={{ fontSize: 28, marginBottom: 8 }}>🎉</Text>
                                <Text style={{ fontSize: 14, color: C.muted }}>No repeat failures — all agents are passing consistently!</Text>
                            </Box>
                        ) : (
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead>
                                    <tr>{['Agent', 'Total Fails', 'Scorecards Failed', 'Avg Score on Fails', 'Coached', 'Risk'].map(h => <th key={h} style={thStyle}>{h}</th>)}</tr>
                                </thead>
                                <tbody>
                                    {repeatFailers.map((a) => {
                                        const color = avatarColor(a.name)
                                        const initials = a.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
                                        const avgFailScore = Math.round(a.fails.reduce((s, c) => s + c.percentage, 0) / a.fails.length)
                                        const coachedCount = a.fails.filter(c => c.coached).length
                                        const risk = a.fails.length >= 4 ? 'High' : 'Medium'
                                        const riskStyle = risk === 'High'
                                            ? { background: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca' }
                                            : { background: '#fff7ed', color: '#ea580c', border: '1px solid #fed7aa' }
                                        return (
                                            <tr key={a.email} onMouseEnter={e => e.currentTarget.style.background = C.hover} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                                                <td style={tdStyle}>
                                                    <Flex align="center" gap={10}>
                                                        <Box style={{ width: 30, height: 30, borderRadius: '50%', background: color + '20', border: `1.5px solid ${color}40`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                            <Text style={{ fontSize: 10, fontWeight: 700, color }}>{initials}</Text>
                                                        </Box>
                                                        <Box>
                                                            <Text style={{ fontSize: 13, fontWeight: 600, color: C.text }}>{a.name}</Text>
                                                            <Text style={{ fontSize: 11, color: C.subtle }}>{a.email}</Text>
                                                        </Box>
                                                    </Flex>
                                                </td>
                                                <td style={tdStyle}><Text style={{ fontSize: 14, fontWeight: 800, color: '#dc2626' }}>{a.fails.length}</Text></td>
                                                <td style={tdStyle}>
                                                    <Flex gap={4} style={{ flexWrap: 'wrap' }}>
                                                        {a.scorecards.map(s => (
                                                            <Badge key={s} radius={6} style={{ fontSize: 10, background: C.hover, color: C.muted, border: `1px solid ${C.border}` }}>{s}</Badge>
                                                        ))}
                                                    </Flex>
                                                </td>
                                                <td style={tdStyle}><Text style={{ fontSize: 13, fontWeight: 700, color: '#dc2626' }}>{avgFailScore}%</Text></td>
                                                <td style={tdStyle}><Text style={{ fontSize: 13, color: C.muted }}>{coachedCount}/{a.fails.length}</Text></td>
                                                <td style={tdStyle}><Badge radius={6} style={{ ...riskStyle, fontWeight: 700, fontSize: 11 }}>{risk}</Badge></td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                        )}
                    </Paper>
                </Grid.Col>

            </Grid>
        </Box>
    )
}