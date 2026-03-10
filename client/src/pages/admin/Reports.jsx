import { useState } from "react";

import {
    Box, Flex, Text, Title, Button, Badge, Paper,
    Select, Grid, RingProgress, Progress, Divider, ScrollArea, Stack,
} from '@mantine/core'
import {
    IconDownload, IconTrendingUp, IconTrendingDown,
    IconMinus, IconCalendar, IconUsers, IconClipboardList,
} from '@tabler/icons-react'
import {
    LineChart, Line, BarChart, Bar, XAxis, YAxis,
    CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts'

const BRAND = '#16a34a'

const scoreTrend = [
    { date: 'Feb 1', score: 71 },
    { date: 'Feb 8', score: 74 },
    { date: 'Feb 15', score: 70 },
    { date: 'Feb 22', score: 76 },
    { date: 'Mar 1', score: 78 },
    { date: 'Mar 8', score: 81 },
    { date: 'Mar 10', score: 79 },
]

const agentScores = [
    { agent: 'Emily C.', score: 91 },
    { agent: 'Sarah J.', score: 84 },
    { agent: 'Aisha K.', score: 88 },
    { agent: 'Carlos R.', score: 72 },
    { agent: 'Tom W.', score: 65 },
    { agent: 'James M.', score: 58 },
]

const agentLeaderboard = [
    { name: 'Emily Chen', initials: 'EC', color: '#7c3aed', calls: 38, avgScore: 91, passRate: 95, trend: 'up' },
    { name: 'Aisha Khan', initials: 'AK', color: '#ea580c', calls: 22, avgScore: 88, passRate: 91, trend: 'up' },
    { name: 'Sarah Johnson', initials: 'SJ', color: BRAND, calls: 45, avgScore: 84, passRate: 87, trend: 'up' },
    { name: 'Carlos Rivera', initials: 'CR', color: '#0891b2', calls: 29, avgScore: 72, passRate: 72, trend: 'flat' },
    { name: 'Tom Walsh', initials: 'TW', color: '#9ca3af', calls: 19, avgScore: 65, passRate: 63, trend: 'down' },
    { name: 'James Miller', initials: 'JM', color: '#2563eb', calls: 31, avgScore: 58, passRate: 48, trend: 'down' },
]

const failedCriteria = [
    { label: 'Objection Handling', scorecard: 'Sales QA', failRate: 61, avgScore: 14, maxScore: 25 },
    { label: 'Needs Discovery', scorecard: 'Sales QA', failRate: 54, avgScore: 11, maxScore: 20 },
    { label: 'Closing Technique', scorecard: 'Sales QA', failRate: 48, avgScore: 12, maxScore: 20 },
    { label: 'Issue Resolution', scorecard: 'Support QA', failRate: 38, avgScore: 27, maxScore: 40 },
    { label: 'Compliance Check', scorecard: 'Support QA', failRate: 31, avgScore: 14, maxScore: 20 },
]

const scorecardPerformance = [
    { name: 'Sales QA Scorecard', calls: 106, avgScore: 74, passRate: 71, trend: 'up' },
    { name: 'Support QA Scorecard', calls: 78, avgScore: 83, passRate: 86, trend: 'up' },
    { name: 'Onboarding QA', calls: 34, avgScore: 68, passRate: 62, trend: 'flat' },
]

function Avatar({ initials, color, size = 32 }) {
    return (
        <Box style={{
            width: size, height: size, borderRadius: '50%',
            background: color + '20', border: `1.5px solid ${color}40`,
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        }}>
            <Text style={{ fontSize: size * 0.35, fontWeight: 700, color }}>{initials}</Text>
        </Box>
    )
}

function TrendIcon({ trend }) {
    if (trend === 'up') return <IconTrendingUp size={14} color={BRAND} />
    if (trend === 'down') return <IconTrendingDown size={14} color="#dc2626" />
    return <IconMinus size={14} color="#9ca3af" />
}

function scoreColor(score) {
    if (score >= 80) return BRAND
    if (score >= 65) return '#ea580c'
    return '#dc2626'
}

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <Box style={{
                background: '#fff', border: '1px solid #f3f4f6',
                borderRadius: 8, padding: '8px 14px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
            }}>
                <Text style={{ fontSize: 12, color: '#6b7280', marginBottom: 4 }}>{label}</Text>
                {payload.map((p) => (
                    <Text key={p.name} style={{ fontSize: 13, fontWeight: 700, color: p.color }}>
                        {p.value}%
                    </Text>
                ))}
            </Box>
        )
    }
    return null
}

export default function Reports() {
    const [dateRange, setDateRange] = useState('last30')
    const [teamFilter, setTeamFilter] = useState('')
    const [agentFilter, setAgentFilter] = useState('')
    const [scorecardFilter, setScorecardFilter] = useState('')

    const totalCalls = 218
    const avgScore = 76
    const passRate = 71
    const failedCalls = Math.round(totalCalls * (1 - passRate / 100))

    const statCards = [
        { label: 'Total Calls', value: totalCalls, sub: '+12% vs last period', color: '#2563eb', bg: '#eff6ff', border: '#bfdbfe', trend: 'up' },
        { label: 'Avg Score', value: avgScore + '%', sub: '+3pts vs last period', color: BRAND, bg: '#f0fdf4', border: '#bbf7d0', trend: 'up' },
        { label: 'Pass Rate', value: passRate + '%', sub: '+5% vs last period', color: '#7c3aed', bg: '#f5f3ff', border: '#ddd6fe', trend: 'up' },
        { label: 'Failed Calls', value: failedCalls, sub: '-8% vs last period', color: '#dc2626', bg: '#fef2f2', border: '#fecaca', trend: 'down' },
    ]

    const thStyle = {
        fontSize: 11, color: '#6b7280', fontWeight: 600,
        textTransform: 'uppercase', letterSpacing: '0.05em',
        padding: '10px 16px', textAlign: 'left', whiteSpace: 'nowrap',
        background: '#f9fafb',
    }
    const tdStyle = { padding: '13px 16px', borderTop: '1px solid #f3f4f6' }

    return (
        <Box>
            {/* Header */}
            <Flex justify="space-between" align="flex-start" mb={24} style={{ flexWrap: 'wrap', gap: 12 }}>
                <Box>
                    <Title order={2} style={{ color: '#111827', fontWeight: 700, fontSize: 22, letterSpacing: '-0.3px' }}>
                        Reports
                    </Title>
                    <Text style={{ color: '#6b7280', fontSize: 14, marginTop: 4 }}>
                        Performance analytics across agents, scorecards and time
                    </Text>
                </Box>
                <Flex gap={10}>
                    <Button
                        leftSection={<IconDownload size={15} />}
                        radius={8} variant="default"
                        style={{ border: '1px solid #e5e7eb', color: '#374151', fontWeight: 600, fontSize: 14, height: 40 }}
                    >
                        Export CSV
                    </Button>
                    <Button
                        leftSection={<IconDownload size={15} />}
                        radius={8}
                        style={{ background: BRAND, color: '#fff', fontWeight: 600, fontSize: 14, height: 40, border: 'none' }}
                    >
                        Export PDF
                    </Button>
                </Flex>
            </Flex>

            {/* Filters */}
            <Paper p={16} radius={10} mb={24}
                style={{ border: '1px solid #f3f4f6', background: '#fff', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}
            >
                <Flex gap={12} align="center" style={{ flexWrap: 'wrap' }}>
                    <Flex align="center" gap={6}>
                        <IconCalendar size={15} color="#9ca3af" />
                        <Text style={{ fontSize: 13, color: '#6b7280', fontWeight: 500 }}>Filters:</Text>
                    </Flex>
                    <Select
                        value={dateRange}
                        onChange={(v) => setDateRange(v || 'last30')}
                        data={[
                            { value: 'last7', label: 'Last 7 days' },
                            { value: 'last30', label: 'Last 30 days' },
                            { value: 'last90', label: 'Last 90 days' },
                            { value: 'thisMonth', label: 'This Month' },
                            { value: 'lastMonth', label: 'Last Month' },
                        ]}
                        style={{ minWidth: 150 }}
                        styles={{ input: { borderRadius: 8, border: '1px solid #e5e7eb', height: 38, fontSize: 13 } }}
                    />
                    <Select
                        placeholder="All Teams" value={teamFilter}
                        onChange={(v) => setTeamFilter(v || '')} clearable
                        data={['Operations', 'Support', 'HR', 'Finance'].map(v => ({ value: v, label: v }))}
                        style={{ minWidth: 140 }}
                        styles={{ input: { borderRadius: 8, border: '1px solid #e5e7eb', height: 38, fontSize: 13 } }}
                        leftSection={<IconUsers size={14} color="#9ca3af" />}
                    />
                    <Select
                        placeholder="All Agents" value={agentFilter}
                        onChange={(v) => setAgentFilter(v || '')} clearable
                        data={agentLeaderboard.map(a => ({ value: a.name, label: a.name }))}
                        style={{ minWidth: 160 }}
                        styles={{ input: { borderRadius: 8, border: '1px solid #e5e7eb', height: 38, fontSize: 13 } }}
                    />
                    <Select
                        placeholder="All Scorecards" value={scorecardFilter}
                        onChange={(v) => setScorecardFilter(v || '')} clearable
                        data={scorecardPerformance.map(s => ({ value: s.name, label: s.name }))}
                        style={{ minWidth: 180 }}
                        styles={{ input: { borderRadius: 8, border: '1px solid #e5e7eb', height: 38, fontSize: 13 } }}
                        leftSection={<IconClipboardList size={14} color="#9ca3af" />}
                    />
                </Flex>
            </Paper>

            {/* Stat Cards */}
            <Grid gutter={16} mb={24}>
                {statCards.map((s) => (
                    <Grid.Col key={s.label} span={{ base: 6, md: 3 }}>
                        <Paper p={20} radius={12}
                            style={{ border: `1px solid ${s.border}`, background: s.bg, boxShadow: 'none' }}
                        >
                            <Flex justify="space-between" align="flex-start" mb={10}>
                                <Text style={{ fontSize: 11, color: s.color, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                    {s.label}
                                </Text>
                                <TrendIcon trend={s.trend} />
                            </Flex>
                            <Text style={{ fontSize: 30, fontWeight: 800, color: s.color, letterSpacing: '-1px', lineHeight: 1 }}>
                                {s.value}
                            </Text>
                            <Text style={{ fontSize: 12, color: s.color + 'aa', marginTop: 6 }}>{s.sub}</Text>
                        </Paper>
                    </Grid.Col>
                ))}
            </Grid>

            {/* Charts Row 1 — Trend + Ring */}
            <Grid gutter={16} mb={24}>
                <Grid.Col span={{ base: 12, md: 8 }}>
                    <Paper p={20} radius={12}
                        style={{ border: '1px solid #f3f4f6', background: '#fff', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}
                    >
                        <Flex justify="space-between" align="center" mb={20}>
                            <Box>
                                <Text style={{ fontWeight: 700, fontSize: 15, color: '#111827' }}>Score Trend</Text>
                                <Text style={{ fontSize: 12, color: '#9ca3af', marginTop: 2 }}>Average score over time</Text>
                            </Box>
                            <Badge style={{ background: '#f0fdf4', color: BRAND, border: '1px solid #bbf7d0', fontWeight: 600 }}>
                                +3pts this period
                            </Badge>
                        </Flex>
                        <ResponsiveContainer width="100%" height={220}>
                            <LineChart data={scoreTrend} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                                <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                                <YAxis domain={[60, 100]} tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                                <Tooltip content={<CustomTooltip />} />
                                <Line
                                    type="monotone" dataKey="score"
                                    stroke={BRAND} strokeWidth={2.5}
                                    dot={{ fill: BRAND, r: 4, strokeWidth: 0 }}
                                    activeDot={{ r: 6, fill: BRAND }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </Paper>
                </Grid.Col>

                <Grid.Col span={{ base: 12, md: 4 }}>
                    <Paper p={20} radius={12}
                        style={{ border: '1px solid #f3f4f6', background: '#fff', boxShadow: '0 1px 4px rgba(0,0,0,0.04)', height: '100%' }}
                    >
                        <Text style={{ fontWeight: 700, fontSize: 15, color: '#111827', marginBottom: 4 }}>Pass vs Fail</Text>
                        <Text style={{ fontSize: 12, color: '#9ca3af', marginBottom: 16 }}>Overall call outcomes</Text>
                        <Flex direction="column" align="center">
                            <RingProgress
                                size={160} thickness={16} roundCaps
                                sections={[
                                    { value: passRate, color: BRAND },
                                    { value: 100 - passRate, color: '#fecaca' },
                                ]}
                                label={
                                    <Box style={{ textAlign: 'center' }}>
                                        <Text style={{ fontSize: 22, fontWeight: 800, color: '#111827' }}>{passRate}%</Text>
                                        <Text style={{ fontSize: 11, color: '#9ca3af' }}>Pass Rate</Text>
                                    </Box>
                                }
                            />
                            <Flex gap={20} mt={12}>
                                <Flex align="center" gap={6}>
                                    <Box style={{ width: 10, height: 10, borderRadius: 3, background: BRAND }} />
                                    <Text style={{ fontSize: 12, color: '#6b7280' }}>Passed ({passRate}%)</Text>
                                </Flex>
                                <Flex align="center" gap={6}>
                                    <Box style={{ width: 10, height: 10, borderRadius: 3, background: '#fecaca' }} />
                                    <Text style={{ fontSize: 12, color: '#6b7280' }}>Failed ({100 - passRate}%)</Text>
                                </Flex>
                            </Flex>
                        </Flex>
                    </Paper>
                </Grid.Col>
            </Grid>

            {/* Agent Bar Chart */}
            <Paper p={20} radius={12} mb={24}
                style={{ border: '1px solid #f3f4f6', background: '#fff', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}
            >
                <Box mb={20}>
                    <Text style={{ fontWeight: 700, fontSize: 15, color: '#111827' }}>Agent Performance</Text>
                    <Text style={{ fontSize: 12, color: '#9ca3af', marginTop: 2 }}>Average score per agent</Text>
                </Box>
                <ResponsiveContainer width="100%" height={220}>
                    <BarChart data={agentScores} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
                        <XAxis dataKey="agent" tick={{ fontSize: 12, fill: '#6b7280' }} axisLine={false} tickLine={false} />
                        <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                        <Tooltip content={<CustomTooltip />} />
                        <Bar dataKey="score" fill={BRAND} radius={[6, 6, 0, 0]} maxBarSize={48} />
                    </BarChart>
                </ResponsiveContainer>
            </Paper>

            {/* Tables Row */}
            <Grid gutter={16} mb={24}>

                {/* Agent Leaderboard */}
                <Grid.Col span={{ base: 12, md: 7 }}>
                    <Paper radius={12}
                        style={{ border: '1px solid #f3f4f6', background: '#fff', boxShadow: '0 1px 4px rgba(0,0,0,0.04)', overflow: 'hidden' }}
                    >
                        <Box px={20} py={16} style={{ borderBottom: '1px solid #f3f4f6' }}>
                            <Text style={{ fontWeight: 700, fontSize: 15, color: '#111827' }}>Agent Leaderboard</Text>
                            <Text style={{ fontSize: 12, color: '#9ca3af', marginTop: 2 }}>Ranked by average score</Text>
                        </Box>
                        <ScrollArea>
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead>
                                    <tr>
                                        <th style={thStyle}>#</th>
                                        <th style={thStyle}>Agent</th>
                                        <th style={thStyle}>Calls</th>
                                        <th style={thStyle}>Avg Score</th>
                                        <th style={thStyle}>Pass Rate</th>
                                        <th style={thStyle}>Trend</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {[...agentLeaderboard].sort((a, b) => b.avgScore - a.avgScore).map((agent, i) => (
                                        <tr key={agent.name}
                                            onMouseEnter={(e) => e.currentTarget.style.background = '#f9fafb'}
                                            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                                        >
                                            <td style={tdStyle}>
                                                <Text style={{
                                                    fontSize: 13, fontWeight: 700,
                                                    color: i === 0 ? '#f59e0b' : i === 1 ? '#9ca3af' : i === 2 ? '#ea580c' : '#d1d5db',
                                                }}>
                                                    {i + 1}
                                                </Text>
                                            </td>
                                            <td style={tdStyle}>
                                                <Flex align="center" gap={10}>
                                                    <Avatar initials={agent.initials} color={agent.color} />
                                                    <Text style={{ fontSize: 13, fontWeight: 600, color: '#111827' }}>{agent.name}</Text>
                                                </Flex>
                                            </td>
                                            <td style={tdStyle}>
                                                <Text style={{ fontSize: 13, color: '#374151' }}>{agent.calls}</Text>
                                            </td>
                                            <td style={tdStyle}>
                                                <Flex align="center" gap={8}>
                                                    <Text style={{ fontSize: 13, fontWeight: 700, color: scoreColor(agent.avgScore), minWidth: 36 }}>
                                                        {agent.avgScore}%
                                                    </Text>
                                                    <Progress
                                                        value={agent.avgScore}
                                                        color={agent.avgScore >= 80 ? 'green' : agent.avgScore >= 65 ? 'orange' : 'red'}
                                                        size={4} radius={4} style={{ width: 60 }}
                                                    />
                                                </Flex>
                                            </td>
                                            <td style={tdStyle}>
                                                <Text style={{ fontSize: 13, color: scoreColor(agent.passRate) }}>{agent.passRate}%</Text>
                                            </td>
                                            <td style={tdStyle}><TrendIcon trend={agent.trend} /></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </ScrollArea>
                    </Paper>
                </Grid.Col>

                {/* Most Failed Criteria */}
                <Grid.Col span={{ base: 12, md: 5 }}>
                    <Paper radius={12}
                        style={{ border: '1px solid #f3f4f6', background: '#fff', boxShadow: '0 1px 4px rgba(0,0,0,0.04)', overflow: 'hidden' }}
                    >
                        <Box px={20} py={16} style={{ borderBottom: '1px solid #f3f4f6' }}>
                            <Text style={{ fontWeight: 700, fontSize: 15, color: '#111827' }}>Most Failed Criteria</Text>
                            <Text style={{ fontSize: 12, color: '#9ca3af', marginTop: 2 }}>Common training gaps</Text>
                        </Box>
                        <Box p={16}>
                            <Stack gap={0}>
                                {failedCriteria.map((c, i) => (
                                    <Box key={c.label}>
                                        <Box py={12}>
                                            <Flex justify="space-between" align="center" mb={6}>
                                                <Box>
                                                    <Text style={{ fontSize: 13, fontWeight: 600, color: '#111827' }}>{c.label}</Text>
                                                    <Text style={{ fontSize: 11, color: '#9ca3af' }}>{c.scorecard}</Text>
                                                </Box>
                                                <Badge radius={6} style={{
                                                    background: '#fef2f2', color: '#dc2626',
                                                    border: '1px solid #fecaca', fontWeight: 700, fontSize: 11,
                                                }}>
                                                    {c.failRate}% fail
                                                </Badge>
                                            </Flex>
                                            <Flex align="center" gap={8}>
                                                <Progress
                                                    value={(c.avgScore / c.maxScore) * 100}
                                                    color="red" size={4} radius={4} style={{ flex: 1 }}
                                                />
                                                <Text style={{ fontSize: 11, color: '#9ca3af', whiteSpace: 'nowrap' }}>
                                                    avg {c.avgScore}/{c.maxScore}
                                                </Text>
                                            </Flex>
                                        </Box>
                                        {i < failedCriteria.length - 1 && <Divider style={{ borderColor: '#f3f4f6' }} />}
                                    </Box>
                                ))}
                            </Stack>
                        </Box>
                    </Paper>
                </Grid.Col>
            </Grid>

            {/* Scorecard Performance */}
            <Paper radius={12}
                style={{ border: '1px solid #f3f4f6', background: '#fff', boxShadow: '0 1px 4px rgba(0,0,0,0.04)', overflow: 'hidden' }}
            >
                <Box px={20} py={16} style={{ borderBottom: '1px solid #f3f4f6' }}>
                    <Text style={{ fontWeight: 700, fontSize: 15, color: '#111827' }}>Scorecard Performance</Text>
                    <Text style={{ fontSize: 12, color: '#9ca3af', marginTop: 2 }}>How each scorecard is performing</Text>
                </Box>
                <ScrollArea>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr>
                                <th style={thStyle}>Scorecard</th>
                                <th style={thStyle}>Total Calls</th>
                                <th style={thStyle}>Avg Score</th>
                                <th style={thStyle}>Pass Rate</th>
                                <th style={thStyle}>Trend</th>
                            </tr>
                        </thead>
                        <tbody>
                            {scorecardPerformance.map((s) => (
                                <tr key={s.name}
                                    onMouseEnter={(e) => e.currentTarget.style.background = '#f9fafb'}
                                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                                >
                                    <td style={tdStyle}>
                                        <Flex align="center" gap={10}>
                                            <Box style={{
                                                width: 32, height: 32, borderRadius: 8,
                                                background: '#f0fdf4', border: '1px solid #bbf7d0',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            }}>
                                                <IconClipboardList size={15} color={BRAND} />
                                            </Box>
                                            <Text style={{ fontSize: 13, fontWeight: 600, color: '#111827' }}>{s.name}</Text>
                                        </Flex>
                                    </td>
                                    <td style={tdStyle}>
                                        <Text style={{ fontSize: 13, color: '#374151' }}>{s.calls}</Text>
                                    </td>
                                    <td style={tdStyle}>
                                        <Flex align="center" gap={8}>
                                            <Text style={{ fontSize: 13, fontWeight: 700, color: scoreColor(s.avgScore), minWidth: 36 }}>
                                                {s.avgScore}%
                                            </Text>
                                            <Progress
                                                value={s.avgScore}
                                                color={s.avgScore >= 80 ? 'green' : s.avgScore >= 65 ? 'orange' : 'red'}
                                                size={4} radius={4} style={{ width: 80 }}
                                            />
                                        </Flex>
                                    </td>
                                    <td style={tdStyle}>
                                        <Text style={{ fontSize: 13, fontWeight: 600, color: scoreColor(s.passRate) }}>{s.passRate}%</Text>
                                    </td>
                                    <td style={tdStyle}><TrendIcon trend={s.trend} /></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </ScrollArea>
            </Paper>
        </Box>
    )
}