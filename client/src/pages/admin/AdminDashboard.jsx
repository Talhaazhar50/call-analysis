import { Badge, Box, Flex, Grid, Paper, RingProgress, Text, Title } from "@mantine/core";
import { IconClipboardCheck, IconPhone, IconTrendingUp, IconUsers } from "@tabler/icons-react";
import { useOutletContext } from "react-router-dom";
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const BRAND = '#16a34a'

const trendData = [
    { month: 'Oct', score: 68 },
    { month: 'Nov', score: 72 },
    { month: 'Dec', score: 69 },
    { month: 'Jan', score: 75 },
    { month: 'Feb', score: 78 },
    { month: 'Mar', score: 84 },
]

const recentCalls = [
    { agent: 'Sarah Johnson', initials: 'S', color: BRAND, scorecard: 'Sales QA', score: 92, status: 'passed', date: 'Mar 10, 2025' },
    { agent: 'Mark Davis', initials: 'M', color: '#2563eb', scorecard: 'Support QA', score: 61, status: 'failed', date: 'Mar 10, 2025' },
    { agent: 'Emily Chen', initials: 'E', color: '#7c3aed', scorecard: 'Sales QA', score: 88, status: 'passed', date: 'Mar 9, 2025' },
    { agent: 'Carlos Rivera', initials: 'C', color: '#ea580c', scorecard: 'Support QA', score: 74, status: 'passed', date: 'Mar 9, 2025' },
]

export default function AdminDashboard() {
    const { C } = useOutletContext()

    const stats = [
        { label: 'Total Calls', value: '1,284', sub: '+12% this month', icon: IconPhone, color: '#2563eb', bg: '#eff6ff', border: '#bfdbfe' },
        { label: 'Avg Score', value: '78.4%', sub: '+3.2% this month', icon: IconTrendingUp, color: BRAND, bg: '#f0fdf4', border: '#bbf7d0' },
        { label: 'Total Agents', value: '48', sub: '+4 this month', icon: IconUsers, color: '#7c3aed', bg: '#f5f3ff', border: '#ddd6fe' },
        { label: 'Pass Rate', value: '71%', sub: '-2% this month', icon: IconClipboardCheck, color: '#ea580c', bg: '#fff7ed', border: '#fed7aa' },
    ]

    const thStyle = {
        fontSize: 11, color: C.subtle, fontWeight: 600,
        textTransform: 'uppercase', letterSpacing: '0.05em',
        padding: '10px 16px', textAlign: 'left',
        background: C.tableTh,
    }
    const tdStyle = { padding: '14px 16px', borderTop: `1px solid ${C.border}` }

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
                        <ResponsiveContainer width="100%" height={220}>
                            <LineChart data={trendData} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke={C.border} />
                                <XAxis dataKey="month" tick={{ fontSize: 11, fill: C.subtle }} axisLine={false} tickLine={false} />
                                <YAxis domain={[60, 90]} tick={{ fontSize: 11, fill: C.subtle }} axisLine={false} tickLine={false} />
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
                    </Paper>
                </Grid.Col>

                <Grid.Col span={{ base: 12, md: 4 }}>
                    <Paper p={24} radius={12} style={{ border: `1px solid ${C.border}`, background: C.surface, boxShadow: '0 1px 4px rgba(0,0,0,0.06)', height: '100%' }}>
                        <Text style={{ fontWeight: 700, fontSize: 15, color: C.text, marginBottom: 4 }}>Pass / Fail Rate</Text>
                        <Text style={{ fontSize: 12, color: C.subtle, marginBottom: 16 }}>This month</Text>
                        <Flex direction="column" align="center">
                            <RingProgress size={160} thickness={16} roundCaps
                                sections={[
                                    { value: 71, color: BRAND },
                                    { value: 29, color: '#fca5a5' },
                                ]}
                                label={
                                    <Box style={{ textAlign: 'center' }}>
                                        <Text style={{ fontSize: 22, fontWeight: 800, color: C.text }}>71%</Text>
                                        <Text style={{ fontSize: 11, color: C.subtle }}>Pass Rate</Text>
                                    </Box>
                                }
                            />
                            <Box mt={16} style={{ width: '100%' }}>
                                {[
                                    { label: 'Passed', value: '912 calls', color: BRAND },
                                    { label: 'Failed', value: '372 calls', color: '#fca5a5' },
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
                    </Paper>
                </Grid.Col>
            </Grid>

            {/* Recent Calls */}
            <Paper radius={12} style={{ border: `1px solid ${C.border}`, background: C.surface, boxShadow: '0 1px 4px rgba(0,0,0,0.06)', overflow: 'hidden' }}>
                <Box px={20} py={16} style={{ borderBottom: `1px solid ${C.border}` }}>
                    <Text style={{ fontWeight: 700, fontSize: 15, color: C.text }}>Recent Calls</Text>
                    <Text style={{ fontSize: 12, color: C.subtle, marginTop: 2 }}>Latest analyzed calls across all agents</Text>
                </Box>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr>
                            {['Agent', 'Scorecard', 'Score', 'Status', 'Date'].map(h => (
                                <th key={h} style={thStyle}>{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {recentCalls.map((call) => (
                            <tr key={call.agent}
                                onMouseEnter={(e) => e.currentTarget.style.background = C.hover}
                                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                            >
                                <td style={tdStyle}>
                                    <Flex align="center" gap={10}>
                                        <Box style={{
                                            width: 30, height: 30, borderRadius: '50%',
                                            background: call.color + '20', border: `1.5px solid ${call.color}40`,
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        }}>
                                            <Text style={{ fontSize: 11, fontWeight: 700, color: call.color }}>{call.initials}</Text>
                                        </Box>
                                        <Text style={{ fontSize: 13, fontWeight: 600, color: C.text }}>{call.agent}</Text>
                                    </Flex>
                                </td>
                                <td style={tdStyle}><Text style={{ fontSize: 13, color: C.muted }}>{call.scorecard}</Text></td>
                                <td style={tdStyle}>
                                    <Text style={{ fontSize: 13, fontWeight: 700, color: call.score >= 70 ? BRAND : '#dc2626' }}>
                                        {call.score}%
                                    </Text>
                                </td>
                                <td style={tdStyle}>
                                    <Badge radius={6} style={{
                                        background: call.status === 'passed' ? '#f0fdf4' : '#fef2f2',
                                        color: call.status === 'passed' ? BRAND : '#dc2626',
                                        border: `1px solid ${call.status === 'passed' ? '#bbf7d0' : '#fecaca'}`,
                                        fontWeight: 600, fontSize: 11,
                                    }}>
                                        {call.status === 'passed' ? '✓ PASS' : '✗ FAIL'}
                                    </Badge>
                                </td>
                                <td style={tdStyle}><Text style={{ fontSize: 13, color: C.subtle }}>{call.date}</Text></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </Paper>
        </Box>
    )
}