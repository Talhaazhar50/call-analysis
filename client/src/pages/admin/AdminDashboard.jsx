import axios from "axios";
import { Badge, Box, Flex, Grid, Loader, Paper, RingProgress, Text, Title } from "@mantine/core";
import { IconClipboardCheck, IconPhone, IconTrendingUp, IconUsers } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const BRAND = '#16a34a'
const API = import.meta.env.VITE_API_URL || 'http://localhost:8000/api'

export default function AdminDashboard() {
    const { C, dark } = useOutletContext()
    const navigate = useNavigate()
    const [calls, setCalls] = useState([])
    const [users, setUsers] = useState([])
    const [loading, setLoading] = useState(true)

    const token = localStorage.getItem('token')
    const headers = { Authorization: `Bearer ${token}` }

    useEffect(() => {
        Promise.all([
            axios.get(`${API}/calls/admin/all`, { headers }),
            axios.get(`${API}/users`, { headers }).catch(() => ({ data: [] })),
        ]).then(([callsRes, usersRes]) => {
            setCalls(callsRes.data.filter(c => c.status === 'done'))
            setUsers(usersRes.data)
        }).catch(() => { }).finally(() => setLoading(false))
    }, [])

    // ── Computed stats ──
    const total = calls.length
    const passed = calls.filter(c => c.pass).length
    const passRate = total > 0 ? Math.round((passed / total) * 100) : 0
    const avgScore = total > 0 ? Math.round(calls.reduce((s, c) => s + c.percentage, 0) / total) : 0
    const totalAgents = users.filter(u => u.role === 'user').length || users.length

    // ── Score trend by month (last 6) ──
    const monthOrder = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    const monthMap = {}
    calls.forEach(c => {
        const d = new Date(c.createdAt)
        const key = d.toLocaleString('default', { month: 'short' })
        const sortKey = d.getFullYear() * 100 + d.getMonth()
        if (!monthMap[key]) monthMap[key] = { scores: [], month: key, sortKey }
        monthMap[key].scores.push(c.percentage)
    })
    const trendData = Object.values(monthMap)
        .sort((a, b) => a.sortKey - b.sortKey)
        .slice(-6)
        .map(m => ({
            month: m.month,
            score: Math.round(m.scores.reduce((a, b) => a + b, 0) / m.scores.length),
        }))

    // ── Recent calls (latest 5) ──
    const recentCalls = [...calls]
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5)

    const thStyle = {
        fontSize: 11, color: C.subtle, fontWeight: 600,
        textTransform: 'uppercase', letterSpacing: '0.05em',
        padding: '10px 16px', textAlign: 'left',
        background: C.tableTh,
    }
    const tdStyle = { padding: '14px 16px', borderTop: `1px solid ${C.border}` }

    const stats = [
        { label: 'Total Calls', value: total.toLocaleString(), sub: 'All time', icon: IconPhone, color: '#2563eb', bg: '#eff6ff', border: '#bfdbfe' },
        { label: 'Avg Score', value: `${avgScore}%`, sub: 'Across all calls', icon: IconTrendingUp, color: BRAND, bg: '#f0fdf4', border: '#bbf7d0' },
        { label: 'Total Agents', value: String(totalAgents), sub: 'Registered users', icon: IconUsers, color: '#7c3aed', bg: '#f5f3ff', border: '#ddd6fe' },
        { label: 'Pass Rate', value: `${passRate}%`, sub: `${passed} of ${total} calls`, icon: IconClipboardCheck, color: '#ea580c', bg: '#fff7ed', border: '#fed7aa' },
    ]

    if (loading) return (
        <Box style={{ display: 'flex', justifyContent: 'center', paddingTop: 80 }}>
            <Loader color="green" />
        </Box>
    )

    return (
        <Box>
            <Box mb={28}>
                <Title order={2} style={{ color: C.text, fontWeight: 700, fontSize: 22, letterSpacing: '-0.3px' }}>
                    Dashboard
                </Title>
                <Text style={{ color: C.muted, fontSize: 14, marginTop: 4 }}>
                    Overview of your team's call quality performance
                </Text>
            </Box>

            {/* Stat Cards */}
            <Grid gutter={16} mb={24}>
                {stats.map((s) => (
                    <Grid.Col key={s.label} span={{ base: 6, md: 3 }}>
                        <Paper p={20} radius={12} style={{ border: `1px solid ${C.border}`, background: C.surface, boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
                            <Flex justify="space-between" align="flex-start" mb={12}>
                                <Text style={{ fontSize: 13, color: C.muted, fontWeight: 500 }}>{s.label}</Text>
                                <Box style={{
                                    width: 34, height: 34, borderRadius: 9,
                                    background: s.bg, border: `1px solid ${s.border}`,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                }}>
                                    <s.icon size={17} color={s.color} />
                                </Box>
                            </Flex>
                            <Text style={{ fontSize: 28, fontWeight: 800, color: C.text, letterSpacing: '-1px', lineHeight: 1 }}>
                                {s.value}
                            </Text>
                            <Text style={{ fontSize: 12, color: C.subtle, marginTop: 6 }}>{s.sub}</Text>
                        </Paper>
                    </Grid.Col>
                ))}
            </Grid>

            {/* Charts */}
            <Grid gutter={16} mb={24}>
                <Grid.Col span={{ base: 12, md: 8 }}>
                    <Paper p={24} radius={12} style={{ border: `1px solid ${C.border}`, background: C.surface, boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
                        <Text style={{ fontWeight: 700, fontSize: 15, color: C.text, marginBottom: 4 }}>Avg Score Trend</Text>
                        <Text style={{ fontSize: 12, color: C.subtle, marginBottom: 20 }}>Last 6 months</Text>
                        {trendData.length < 2 ? (
                            <Box style={{ height: 220, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Text style={{ fontSize: 13, color: C.muted }}>Not enough data yet — upload more calls</Text>
                            </Box>
                        ) : (
                            <ResponsiveContainer width="100%" height={220}>
                                <LineChart data={trendData} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke={C.border} />
                                    <XAxis dataKey="month" tick={{ fontSize: 11, fill: C.subtle }} axisLine={false} tickLine={false} />
                                    <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: C.subtle }} axisLine={false} tickLine={false} />
                                    <Tooltip
                                        contentStyle={{
                                            background: C.surface, border: `1px solid ${C.border}`,
                                            borderRadius: 8, fontSize: 13, color: C.text,
                                        }}
                                    />
                                    <Line type="monotone" dataKey="score" stroke={BRAND} strokeWidth={2.5}
                                        dot={{ fill: BRAND, r: 4, strokeWidth: 0 }} activeDot={{ r: 6 }} />
                                </LineChart>
                            </ResponsiveContainer>
                        )}
                    </Paper>
                </Grid.Col>

                <Grid.Col span={{ base: 12, md: 4 }}>
                    <Paper p={24} radius={12} style={{ border: `1px solid ${C.border}`, background: C.surface, boxShadow: '0 1px 4px rgba(0,0,0,0.06)', height: '100%' }}>
                        <Text style={{ fontWeight: 700, fontSize: 15, color: C.text, marginBottom: 4 }}>Pass / Fail Rate</Text>
                        <Text style={{ fontSize: 12, color: C.subtle, marginBottom: 16 }}>All time</Text>
                        {total === 0 ? (
                            <Box style={{ height: 160, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Text style={{ fontSize: 13, color: C.muted }}>No calls yet</Text>
                            </Box>
                        ) : (
                            <Flex direction="column" align="center">
                                <RingProgress size={160} thickness={16} roundCaps
                                    sections={[
                                        { value: passRate, color: BRAND },
                                        { value: 100 - passRate, color: '#fca5a5' },
                                    ]}
                                    label={
                                        <Box style={{ textAlign: 'center' }}>
                                            <Text style={{ fontSize: 22, fontWeight: 800, color: C.text }}>{passRate}%</Text>
                                            <Text style={{ fontSize: 11, color: C.subtle }}>Pass Rate</Text>
                                        </Box>
                                    }
                                />
                                <Box mt={16} style={{ width: '100%' }}>
                                    {[
                                        { label: 'Passed', value: `${passed} calls`, color: BRAND },
                                        { label: 'Failed', value: `${total - passed} calls`, color: '#fca5a5' },
                                    ].map((r) => (
                                        <Flex key={r.label} justify="space-between" align="center" mb={8}>
                                            <Flex align="center" gap={8}>
                                                <Box style={{ width: 10, height: 10, borderRadius: 3, background: r.color }} />
                                                <Text style={{ fontSize: 13, color: C.muted }}>{r.label}</Text>
                                            </Flex>
                                            <Text style={{ fontSize: 13, fontWeight: 600, color: C.text }}>{r.value}</Text>
                                        </Flex>
                                    ))}
                                </Box>
                            </Flex>
                        )}
                    </Paper>
                </Grid.Col>
            </Grid>

            {/* Recent Calls */}
            <Paper radius={12} style={{ border: `1px solid ${C.border}`, background: C.surface, boxShadow: '0 1px 4px rgba(0,0,0,0.06)', overflow: 'hidden' }}>
                <Box px={20} py={16} style={{ borderBottom: `1px solid ${C.border}` }}>
                    <Text style={{ fontWeight: 700, fontSize: 15, color: C.text }}>Recent Calls</Text>
                    <Text style={{ fontSize: 12, color: C.subtle, marginTop: 2 }}>Latest analyzed calls across all agents</Text>
                </Box>
                {recentCalls.length === 0 ? (
                    <Box p={40} style={{ textAlign: 'center' }}>
                        <Text style={{ color: C.muted, fontSize: 14 }}>No calls yet</Text>
                    </Box>
                ) : (
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr>
                                {['Agent', 'Scorecard', 'Score', 'Status', 'Date'].map(h => (
                                    <th key={h} style={thStyle}>{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {recentCalls.map((call) => {
                                const agentName = call.user?.name || call.user?.email?.split('@')[0] || 'Unknown'
                                const initials = agentName.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
                                return (
                                    <tr key={call._id}
                                        style={{ cursor: 'pointer' }}
                                        onMouseEnter={e => e.currentTarget.style.background = C.hover}
                                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                                        onClick={() => navigate(`/dashboard/calls/${call._id}`)}
                                    >
                                        <td style={tdStyle}>
                                            <Flex align="center" gap={10}>
                                                <Box style={{
                                                    width: 30, height: 30, borderRadius: '50%',
                                                    background: '#16a34a20', border: '1.5px solid #16a34a40',
                                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                }}>
                                                    <Text style={{ fontSize: 11, fontWeight: 700, color: BRAND }}>{initials}</Text>
                                                </Box>
                                                <Text style={{ fontSize: 13, fontWeight: 600, color: C.text }}>{agentName}</Text>
                                            </Flex>
                                        </td>
                                        <td style={tdStyle}>
                                            <Text style={{ fontSize: 13, color: C.muted }}>{call.scorecardName}</Text>
                                        </td>
                                        <td style={tdStyle}>
                                            <Text style={{ fontSize: 13, fontWeight: 700, color: call.percentage >= 70 ? BRAND : '#dc2626' }}>
                                                {call.percentage}%
                                            </Text>
                                        </td>
                                        <td style={tdStyle}>
                                            <Badge radius={6} style={{
                                                background: call.pass ? '#f0fdf4' : '#fef2f2',
                                                color: call.pass ? BRAND : '#dc2626',
                                                border: `1px solid ${call.pass ? '#bbf7d0' : '#fecaca'}`,
                                                fontWeight: 600, fontSize: 11,
                                            }}>
                                                {call.pass ? '✓ PASS' : '✗ FAIL'}
                                            </Badge>
                                        </td>
                                        <td style={tdStyle}>
                                            <Text style={{ fontSize: 13, color: C.subtle }}>
                                                {new Date(call.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                            </Text>
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                )}
            </Paper>
        </Box>
    )
}