import axios from "axios";
import { Badge, Box, Card, Center, Group, Loader, Progress, RingProgress, SimpleGrid, Stack, Table, Text, ThemeIcon } from "@mantine/core";
import { IconAlertTriangle, IconArrowRight, IconBrain, IconCircleCheck, IconHeadphones, IconTrophy, IconUpload } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { Area, AreaChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const BRAND = '#16a34a'
const API = import.meta.env.VITE_API_URL || 'http://localhost:8000/api'

export default function UserDashboard() {
    const { dark, C } = useOutletContext()
    const navigate = useNavigate()
    const [calls, setCalls] = useState([])
    const [allCalls, setAllCalls] = useState([]) // includes criteriaResults
    const [loading, setLoading] = useState(true)

    const savedUser = JSON.parse(localStorage.getItem('user') || '{}')
    const userName = savedUser.name || savedUser.email?.split('@')[0] || 'there'
    const token = localStorage.getItem('token')
    const headers = { Authorization: `Bearer ${token}` }

    useEffect(() => {
        axios.get(`${API}/calls`, { headers })
            .then(({ data }) => {
                const done = data.filter(c => c.status === 'done')
                setCalls(done)
                // Fetch full details for criteria analysis (last 10 calls)
                const recent = done.slice(0, 10)
                return Promise.all(recent.map(c => axios.get(`${API}/calls/${c._id}`, { headers }).then(r => r.data)))
            })
            .then(full => setAllCalls(full))
            .catch(() => { })
            .finally(() => setLoading(false))
    }, [])

    // ── Stats ──
    const total = calls.length
    const passed = calls.filter(c => c.pass).length
    const avgScore = total > 0 ? Math.round(calls.reduce((s, c) => s + c.percentage, 0) / total) : 0
    const bestScore = total > 0 ? Math.max(...calls.map(c => c.percentage)) : 0
    const passRate = total > 0 ? Math.round((passed / total) * 100) : 0

    // ── Score trend ──
    const trendData = [...calls]
        .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
        .slice(-8)
        .map(c => ({
            date: new Date(c.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            score: c.percentage,
            name: c.fileName,
        }))

    // ── Criteria weakness analysis ──
    const criteriaAccum = {}
    allCalls.forEach(call => {
        if (!call.criteriaResults?.length) return
        call.criteriaResults.forEach(cr => {
            if (!criteriaAccum[cr.label]) criteriaAccum[cr.label] = { total: 0, max: 0, count: 0 }
            criteriaAccum[cr.label].total += cr.score
            criteriaAccum[cr.label].max += cr.max
            criteriaAccum[cr.label].count += 1
        })
    })
    const criteriaPerf = Object.entries(criteriaAccum)
        .map(([label, v]) => ({ label, pct: v.max > 0 ? Math.round((v.total / v.max) * 100) : 0 }))
        .sort((a, b) => a.pct - b.pct) // worst first

    const weakAreas = criteriaPerf.filter(c => c.pct < 70).slice(0, 3)
    const strongAreas = criteriaPerf.filter(c => c.pct >= 80).slice(-3).reverse()

    const recentCalls = [...calls]
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5)

    const scoreColor = (s) => s >= 80 ? BRAND : s >= 60 ? '#f59e0b' : '#ef4444'

    const greeting = () => {
        const h = new Date().getHours()
        if (h < 12) return 'Good morning'
        if (h < 18) return 'Good afternoon'
        return 'Good evening'
    }

    const CustomTooltip = ({ active, payload, label }) => {
        if (!active || !payload?.length) return null
        return (
            <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 10, padding: '10px 14px', boxShadow: '0 4px 16px rgba(0,0,0,0.12)' }}>
                <div style={{ fontSize: 12, color: C.muted, marginBottom: 4 }}>{label}</div>
                <div style={{ fontSize: 18, fontWeight: 800, color: scoreColor(payload[0].value) }}>{payload[0].value}%</div>
            </div>
        )
    }

    if (loading) return (
        <Box p="xl" style={{ display: 'flex', justifyContent: 'center', paddingTop: 80 }}>
            <Loader color="green" />
        </Box>
    )

    const statCards = [
        { label: 'Total Calls', value: total, sub: 'All time', icon: IconHeadphones, color: '#2563eb', bg: '#eff6ff', border: '#bfdbfe' },
        { label: 'Avg Score', value: `${avgScore}%`, sub: 'Across all calls', icon: IconBrain, color: BRAND, bg: '#f0fdf4', border: '#bbf7d0' },
        { label: 'Passed', value: `${passed}/${total}`, sub: `${passRate}% pass rate`, icon: IconCircleCheck, color: '#7c3aed', bg: '#faf5ff', border: '#e9d5ff' },
        { label: 'Best Score', value: `${bestScore}%`, sub: 'All time', icon: IconTrophy, color: '#ea580c', bg: '#fff7ed', border: '#fed7aa' },
    ]

    return (
        <Box p="xl" maw={1200}>
            {/* Header */}
            <Stack gap={2} mb={32}>
                <Text fw={800} c={C.text} style={{ fontSize: 30, letterSpacing: '-0.5px' }}>
                    {greeting()}, {userName} 👋
                </Text>
                <Text size="sm" c={C.muted}>Here's how your calls are performing.</Text>
            </Stack>

            {/* KPI Cards */}
            <SimpleGrid cols={{ base: 1, xs: 2, md: 4 }} spacing="md" mb={24}>
                {statCards.map(s => (
                    <Card key={s.label} padding="xl" radius={14} style={{ background: C.surface, border: `1px solid ${C.border}`, boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                        <Group justify="space-between" mb={16}>
                            <Text size="sm" fw={600} c={C.muted} style={{ textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: 11 }}>{s.label}</Text>
                            <ThemeIcon size={40} radius={10} style={{ background: s.bg, border: `1px solid ${s.border}` }}>
                                <s.icon size={20} color={s.color} />
                            </ThemeIcon>
                        </Group>
                        <Text fw={900} c={C.text} style={{ fontSize: 36, letterSpacing: '-1px', lineHeight: 1 }}>{s.value}</Text>
                        <Text size="xs" c={C.muted} mt={8}>{s.sub}</Text>
                    </Card>
                ))}
            </SimpleGrid>

            {/* Charts row */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: 16, marginBottom: 24 }}>
                {/* Score Trend - interactive recharts */}
                <Card padding="xl" radius={14} style={{ background: C.surface, border: `1px solid ${C.border}`, boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                    <Group justify="space-between" mb={24}>
                        <div>
                            <Text fw={700} size="sm" c={C.text}>Score Trend</Text>
                            <Text size="xs" c={C.muted}>Last {trendData.length} calls</Text>
                        </div>
                        {trendData.length > 0 && (
                            <Text fw={900} style={{ fontSize: 28, color: scoreColor(trendData[trendData.length - 1]?.score || 0), letterSpacing: '-0.5px' }}>
                                {trendData[trendData.length - 1]?.score}%
                            </Text>
                        )}
                    </Group>
                    {trendData.length < 2 ? (
                        <Box style={{ height: 180, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Text size="sm" c={C.muted}>Upload more calls to see your trend</Text>
                        </Box>
                    ) : (
                        <ResponsiveContainer width="100%" height={180}>
                            <AreaChart data={trendData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="scoreGrad" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor={BRAND} stopOpacity={0.15} />
                                        <stop offset="95%" stopColor={BRAND} stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke={dark ? '#2a2d3a' : '#f1f5f9'} />
                                <XAxis dataKey="date" tick={{ fontSize: 11, fill: C.subtle }} axisLine={false} tickLine={false} />
                                <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: C.subtle }} axisLine={false} tickLine={false} />
                                <Tooltip content={<CustomTooltip />} />
                                <Area type="monotone" dataKey="score" stroke={BRAND} strokeWidth={2.5} fill="url(#scoreGrad)" dot={{ fill: BRAND, r: 4, strokeWidth: 0 }} activeDot={{ r: 6, fill: BRAND }} />
                            </AreaChart>
                        </ResponsiveContainer>
                    )}
                </Card>

                {/* Pass/Fail ring */}
                <Card padding="xl" radius={14} style={{ background: C.surface, border: `1px solid ${C.border}`, boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                    <Text fw={700} size="sm" c={C.text} mb={4}>Pass / Fail</Text>
                    <Text size="xs" c={C.muted} mb={20}>All time</Text>
                    {total === 0 ? (
                        <Text size="sm" c={C.muted} ta="center" py="xl">No calls yet</Text>
                    ) : (
                        <Center>
                            <Stack align="center" gap={16}>
                                <RingProgress size={130} thickness={14} roundCaps
                                    sections={[
                                        { value: passRate, color: BRAND },
                                        { value: 100 - passRate, color: '#fecaca' },
                                    ]}
                                    label={
                                        <Center>
                                            <Stack gap={0} align="center">
                                                <Text fw={900} style={{ fontSize: 22, color: BRAND, lineHeight: 1 }}>{passRate}%</Text>
                                                <Text size="xs" c={C.muted}>pass</Text>
                                            </Stack>
                                        </Center>
                                    }
                                />
                                <Group gap={20}>
                                    <Group gap={6}>
                                        <div style={{ width: 10, height: 10, borderRadius: 3, background: BRAND }} />
                                        <Text size="xs" c={C.muted}>Pass ({passed})</Text>
                                    </Group>
                                    <Group gap={6}>
                                        <div style={{ width: 10, height: 10, borderRadius: 3, background: '#fecaca' }} />
                                        <Text size="xs" c={C.muted}>Fail ({total - passed})</Text>
                                    </Group>
                                </Group>
                            </Stack>
                        </Center>
                    )}
                </Card>
            </div>

            {/* Criteria Performance row */}
            {criteriaPerf.length > 0 && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
                    {/* Weak areas */}
                    <Card padding="xl" radius={14} style={{ background: C.surface, border: `1px solid ${C.border}`, boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                        <Group gap={8} mb={20}>
                            <div style={{ width: 32, height: 32, borderRadius: 8, background: '#fef2f2', border: '1px solid #fecaca', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <IconAlertTriangle size={16} color="#ef4444" />
                            </div>
                            <div>
                                <Text fw={700} size="sm" c={C.text}>Needs Improvement</Text>
                                <Text size="xs" c={C.muted}>Areas to focus on</Text>
                            </div>
                        </Group>
                        {weakAreas.length === 0 ? (
                            <Text size="sm" c={BRAND} fw={600}>🎉 All criteria performing well!</Text>
                        ) : (
                            <Stack gap={14}>
                                {criteriaPerf.slice(0, 4).map(c => (
                                    <div key={c.label}>
                                        <Group justify="space-between" mb={6}>
                                            <Text size="sm" c={C.text} fw={500}>{c.label}</Text>
                                            <Text size="sm" fw={700} c={scoreColor(c.pct)}>{c.pct}%</Text>
                                        </Group>
                                        <Progress value={c.pct} color={c.pct >= 80 ? 'green' : c.pct >= 60 ? 'yellow' : 'red'} radius="xl" size={8} />
                                    </div>
                                ))}
                            </Stack>
                        )}
                    </Card>

                    {/* All criteria */}
                    <Card padding="xl" radius={14} style={{ background: C.surface, border: `1px solid ${C.border}`, boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                        <Group gap={8} mb={20}>
                            <div style={{ width: 32, height: 32, borderRadius: 8, background: '#f0fdf4', border: '1px solid #bbf7d0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <IconBrain size={16} color={BRAND} />
                            </div>
                            <div>
                                <Text fw={700} size="sm" c={C.text}>All Criteria</Text>
                                <Text size="xs" c={C.muted}>Avg across your calls</Text>
                            </div>
                        </Group>
                        <Stack gap={14}>
                            {criteriaPerf.map(c => (
                                <div key={c.label}>
                                    <Group justify="space-between" mb={6}>
                                        <Text size="sm" c={C.text} fw={500}>{c.label}</Text>
                                        <Text size="sm" fw={700} c={scoreColor(c.pct)}>{c.pct}%</Text>
                                    </Group>
                                    <Progress value={c.pct} color={c.pct >= 80 ? 'green' : c.pct >= 60 ? 'yellow' : 'red'} radius="xl" size={8} />
                                </div>
                            ))}
                        </Stack>
                    </Card>
                </div>
            )}

            {/* Upload CTA */}
            <Card padding="lg" radius={14} mb={24} style={{ background: `linear-gradient(135deg, #f0fdf4, #dcfce7)`, border: '1px solid #bbf7d0' }}>
                <Group justify="space-between" align="center">
                    <Group gap={16}>
                        <div style={{ width: 44, height: 44, borderRadius: 12, background: BRAND, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <IconUpload size={22} color="#fff" />
                        </div>
                        <div>
                            <Text fw={700} size="sm" c="#166534">Upload a new call</Text>
                            <Text size="xs" c="#16a34a">Get your AI score in under 60 seconds</Text>
                        </div>
                    </Group>
                    <button onClick={() => navigate('/dashboard/upload')}
                        style={{ padding: '10px 20px', borderRadius: 10, background: BRAND, color: '#fff', border: 'none', fontWeight: 700, fontSize: 14, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, fontFamily: 'DM Sans, sans-serif' }}>
                        Upload now <IconArrowRight size={15} />
                    </button>
                </Group>
            </Card>

            {/* Recent Calls */}
            <Card padding={0} radius={14} style={{ background: C.surface, border: `1px solid ${C.border}`, boxShadow: '0 2px 8px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
                <Box p="lg" style={{ borderBottom: `1px solid ${C.border}` }}>
                    <Group justify="space-between">
                        <Text fw={700} size="sm" c={C.text}>Recent Calls</Text>
                        <button onClick={() => navigate('/dashboard/calls')}
                            style={{ background: 'none', border: 'none', color: BRAND, fontSize: 13, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, fontFamily: 'DM Sans, sans-serif' }}>
                            View all <IconArrowRight size={13} />
                        </button>
                    </Group>
                </Box>
                {recentCalls.length === 0 ? (
                    <Box p="xl" style={{ textAlign: 'center' }}>
                        <Text style={{ fontSize: 32, marginBottom: 8 }}>🎙️</Text>
                        <Text size="sm" fw={600} c={C.text} mb={4}>No calls yet</Text>
                        <Text size="xs" c={C.muted}>Upload your first call to get started</Text>
                    </Box>
                ) : (
                    <Table>
                        <Table.Thead>
                            <Table.Tr>
                                {['File', 'Scorecard', 'Score', 'Status', 'Date', 'Duration', ''].map(h => (
                                    <Table.Th key={h} style={{ fontSize: 11, color: C.subtle, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', padding: '10px 20px', background: C.tableTh }}>{h}</Table.Th>
                                ))}
                            </Table.Tr>
                        </Table.Thead>
                        <Table.Tbody>
                            {recentCalls.map(call => (
                                <Table.Tr key={call._id} style={{ cursor: 'pointer', transition: 'background 0.15s' }}
                                    onClick={() => navigate(`/dashboard/calls/${call._id}`)}>
                                    <Table.Td style={{ padding: '14px 20px' }}>
                                        <Group gap={10}>
                                            <div style={{ width: 34, height: 34, borderRadius: 9, background: '#f0fdf4', border: '1px solid #bbf7d0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15 }}>🎵</div>
                                            <Text size="sm" fw={600} c={C.text} style={{ maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{call.fileName}</Text>
                                        </Group>
                                    </Table.Td>
                                    <Table.Td style={{ padding: '14px 20px' }}><Text size="sm" c={C.muted}>{call.scorecardName}</Text></Table.Td>
                                    <Table.Td style={{ padding: '14px 20px' }}><Text size="sm" fw={800} c={scoreColor(call.percentage)} style={{ fontSize: 16 }}>{call.percentage}%</Text></Table.Td>
                                    <Table.Td style={{ padding: '14px 20px' }}>
                                        <Badge variant="light" color={call.pass ? 'green' : 'red'} size="sm" radius={6}>
                                            {call.pass ? '✓ PASS' : '✗ FAIL'}
                                        </Badge>
                                    </Table.Td>
                                    <Table.Td style={{ padding: '14px 20px' }}><Text size="sm" c={C.muted}>{new Date(call.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</Text></Table.Td>
                                    <Table.Td style={{ padding: '14px 20px' }}><Text size="sm" c={C.muted}>{call.duration || '—'}</Text></Table.Td>
                                    <Table.Td style={{ padding: '14px 20px' }}>
                                        <button style={{ background: 'none', border: 'none', color: BRAND, fontSize: 13, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, fontFamily: 'DM Sans, sans-serif' }}>
                                            View <IconArrowRight size={13} />
                                        </button>
                                    </Table.Td>
                                </Table.Tr>
                            ))}
                        </Table.Tbody>
                    </Table>
                )}
            </Card>
        </Box>
    )
}