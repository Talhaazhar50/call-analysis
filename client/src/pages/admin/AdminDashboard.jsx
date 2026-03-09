import {
    Box, Flex, Text, Title, Grid, Paper,
    Table, Badge, RingProgress, Group,
    Stack,
} from '@mantine/core'
import {
    IconPhoneCall, IconStarFilled, IconUsers,
    IconTrendingUp, IconTrendingDown, IconCircleCheck, IconCircleX,
} from '@tabler/icons-react'
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid,
    Tooltip, ResponsiveContainer,
} from 'recharts'

const BRAND = '#16a34a'

// Mock data
const stats = [
    {
        label: 'Total Calls',
        value: '1,284',
        change: '+12%',
        up: true,
        icon: IconPhoneCall,
        color: '#3b82f6',
        bg: '#eff6ff',
    },
    {
        label: 'Avg Score',
        value: '78.4%',
        change: '+3.2%',
        up: true,
        icon: IconStarFilled,
        color: BRAND,
        bg: '#f0fdf4',
    },
    {
        label: 'Total Agents',
        value: '48',
        change: '+4',
        up: true,
        icon: IconUsers,
        color: '#8b5cf6',
        bg: '#f5f3ff',
    },
    {
        label: 'Pass Rate',
        value: '71%',
        change: '-2%',
        up: false,
        icon: IconCircleCheck,
        color: '#f59e0b',
        bg: '#fffbeb',
    },
]

const chartData = [
    { month: 'Oct', score: 68 },
    { month: 'Nov', score: 72 },
    { month: 'Dec', score: 69 },
    { month: 'Jan', score: 75 },
    { month: 'Feb', score: 78 },
    { month: 'Mar', score: 78.4 },
]

const recentCalls = [
    { id: 1, agent: 'Sarah Johnson', scorecard: 'Sales QA', score: 92, status: 'Pass', date: 'Mar 10, 2025' },
    { id: 2, agent: 'Mark Davis', scorecard: 'Support QA', score: 61, status: 'Fail', date: 'Mar 10, 2025' },
    { id: 3, agent: 'Emily Chen', scorecard: 'Sales QA', score: 88, status: 'Pass', date: 'Mar 9, 2025' },
    { id: 4, agent: 'James Wilson', scorecard: 'Onboarding QA', score: 74, status: 'Pass', date: 'Mar 9, 2025' },
    { id: 5, agent: 'Aisha Patel', scorecard: 'Support QA', score: 55, status: 'Fail', date: 'Mar 8, 2025' },
    { id: 6, agent: 'Tom Brown', scorecard: 'Sales QA', score: 81, status: 'Pass', date: 'Mar 8, 2025' },
]

export default function AdminDashboard() {
    return (
        <Box>
            {/* Page Header */}
            <Box mb={28}>
                <Title
                    order={2}
                    style={{ color: '#111827', fontWeight: 700, fontSize: 22, letterSpacing: '-0.3px' }}
                >
                    Dashboard
                </Title>
                <Text style={{ color: '#6b7280', fontSize: 14, marginTop: 4 }}>
                    Overview of your team's call quality performance
                </Text>
            </Box>

            {/* Stat Cards */}
            <Grid mb={24} gutter={16}>
                {stats.map((s) => (
                    <Grid.Col key={s.label} span={{ base: 12, sm: 6, lg: 3 }}>
                        <Paper
                            p={20}
                            radius={12}
                            style={{
                                border: '1px solid #f3f4f6',
                                background: '#fff',
                                boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
                            }}
                        >
                            <Flex justify="space-between" align="flex-start">
                                <Box>
                                    <Text style={{ color: '#6b7280', fontSize: 13, marginBottom: 8 }}>
                                        {s.label}
                                    </Text>
                                    <Text style={{ color: '#111827', fontSize: 26, fontWeight: 700, lineHeight: 1 }}>
                                        {s.value}
                                    </Text>
                                    <Flex align="center" gap={4} mt={8}>
                                        {s.up
                                            ? <IconTrendingUp size={14} color={BRAND} />
                                            : <IconTrendingDown size={14} color="#ef4444" />}
                                        <Text style={{ fontSize: 12, color: s.up ? BRAND : '#ef4444', fontWeight: 500 }}>
                                            {s.change} this month
                                        </Text>
                                    </Flex>
                                </Box>
                                <Box
                                    style={{
                                        width: 42, height: 42, borderRadius: 10,
                                        background: s.bg,
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    }}
                                >
                                    <s.icon size={20} color={s.color} />
                                </Box>
                            </Flex>
                        </Paper>
                    </Grid.Col>
                ))}
            </Grid>

            {/* Chart + Pass Fail */}
            <Grid mb={24} gutter={16}>

                {/* Score Trend Chart */}
                <Grid.Col span={{ base: 12, lg: 8 }}>
                    <Paper
                        p={24}
                        radius={12}
                        style={{
                            border: '1px solid #f3f4f6',
                            background: '#fff',
                            boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
                        }}
                    >
                        <Text style={{ fontWeight: 600, fontSize: 15, color: '#111827', marginBottom: 4 }}>
                            Avg Score Trend
                        </Text>
                        <Text style={{ fontSize: 13, color: '#9ca3af', marginBottom: 20 }}>
                            Last 6 months
                        </Text>
                        <ResponsiveContainer width="100%" height={220}>
                            <LineChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                                <XAxis
                                    dataKey="month"
                                    tick={{ fontSize: 12, fill: '#9ca3af' }}
                                    axisLine={false}
                                    tickLine={false}
                                />
                                <YAxis
                                    domain={[60, 90]}
                                    tick={{ fontSize: 12, fill: '#9ca3af' }}
                                    axisLine={false}
                                    tickLine={false}
                                />
                                <Tooltip
                                    contentStyle={{
                                        borderRadius: 8,
                                        border: '1px solid #f3f4f6',
                                        fontSize: 13,
                                    }}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="score"
                                    stroke={BRAND}
                                    strokeWidth={2.5}
                                    dot={{ fill: BRAND, strokeWidth: 0, r: 4 }}
                                    activeDot={{ r: 6 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </Paper>
                </Grid.Col>

                {/* Pass / Fail */}
                <Grid.Col span={{ base: 12, lg: 4 }}>
                    <Paper
                        p={24}
                        radius={12}
                        style={{
                            border: '1px solid #f3f4f6',
                            background: '#fff',
                            boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
                            height: '100%',
                        }}
                    >
                        <Text style={{ fontWeight: 600, fontSize: 15, color: '#111827', marginBottom: 4 }}>
                            Pass / Fail Rate
                        </Text>
                        <Text style={{ fontSize: 13, color: '#9ca3af', marginBottom: 24 }}>
                            This month
                        </Text>
                        <Flex justify="center" mb={24}>
                            <RingProgress
                                size={160}
                                thickness={16}
                                roundCaps
                                sections={[
                                    { value: 71, color: BRAND },
                                    { value: 29, color: '#fee2e2' },
                                ]}
                                label={
                                    <Box style={{ textAlign: 'center' }}>
                                        <Text style={{ fontSize: 22, fontWeight: 800, color: '#111827' }}>71%</Text>
                                        <Text style={{ fontSize: 11, color: '#9ca3af' }}>Pass Rate</Text>
                                    </Box>
                                }
                            />
                        </Flex>
                        <Stack gap={10}>
                            <Flex justify="space-between" align="center">
                                <Flex align="center" gap={8}>
                                    <Box style={{ width: 10, height: 10, borderRadius: 2, background: BRAND }} />
                                    <Text style={{ fontSize: 13, color: '#374151' }}>Passed</Text>
                                </Flex>
                                <Text style={{ fontSize: 13, fontWeight: 600, color: '#111827' }}>912 calls</Text>
                            </Flex>
                            <Flex justify="space-between" align="center">
                                <Flex align="center" gap={8}>
                                    <Box style={{ width: 10, height: 10, borderRadius: 2, background: '#fca5a5' }} />
                                    <Text style={{ fontSize: 13, color: '#374151' }}>Failed</Text>
                                </Flex>
                                <Text style={{ fontSize: 13, fontWeight: 600, color: '#111827' }}>372 calls</Text>
                            </Flex>
                        </Stack>
                    </Paper>
                </Grid.Col>
            </Grid>

            {/* Recent Calls Table */}
            <Paper
                radius={12}
                style={{
                    border: '1px solid #f3f4f6',
                    background: '#fff',
                    boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
                    overflow: 'hidden',
                }}
            >
                <Box px={24} py={18} style={{ borderBottom: '1px solid #f3f4f6' }}>
                    <Text style={{ fontWeight: 600, fontSize: 15, color: '#111827' }}>
                        Recent Calls
                    </Text>
                    <Text style={{ fontSize: 13, color: '#9ca3af', marginTop: 2 }}>
                        Latest analyzed calls across all agents
                    </Text>
                </Box>
                <Table highlightOnHover>
                    <Table.Thead>
                        <Table.Tr style={{ background: '#f9fafb' }}>
                            {['Agent', 'Scorecard', 'Score', 'Status', 'Date'].map((h) => (
                                <Table.Th
                                    key={h}
                                    style={{
                                        fontSize: 12, color: '#6b7280', fontWeight: 600,
                                        textTransform: 'uppercase', letterSpacing: '0.05em', padding: '12px 20px'
                                    }}
                                >
                                    {h}
                                </Table.Th>
                            ))}
                        </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                        {recentCalls.map((call) => (
                            <Table.Tr key={call.id}>
                                <Table.Td style={{ padding: '14px 20px' }}>
                                    <Flex align="center" gap={10}>
                                        <Box
                                            style={{
                                                width: 32, height: 32, borderRadius: '50%',
                                                background: '#f0fdf4',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                flexShrink: 0,
                                            }}
                                        >
                                            <Text style={{ fontSize: 12, fontWeight: 700, color: BRAND }}>
                                                {call.agent.charAt(0)}
                                            </Text>
                                        </Box>
                                        <Text style={{ fontSize: 14, color: '#111827', fontWeight: 500 }}>
                                            {call.agent}
                                        </Text>
                                    </Flex>
                                </Table.Td>
                                <Table.Td style={{ padding: '14px 20px' }}>
                                    <Text style={{ fontSize: 13, color: '#6b7280' }}>{call.scorecard}</Text>
                                </Table.Td>
                                <Table.Td style={{ padding: '14px 20px' }}>
                                    <Text
                                        style={{
                                            fontSize: 14, fontWeight: 600,
                                            color: call.score >= 70 ? BRAND : '#ef4444',
                                        }}
                                    >
                                        {call.score}%
                                    </Text>
                                </Table.Td>
                                <Table.Td style={{ padding: '14px 20px' }}>
                                    <Badge
                                        radius={6}
                                        style={{
                                            background: call.status === 'Pass' ? '#f0fdf4' : '#fef2f2',
                                            color: call.status === 'Pass' ? BRAND : '#ef4444',
                                            border: `1px solid ${call.status === 'Pass' ? '#bbf7d0' : '#fecaca'}`,
                                            fontWeight: 600, fontSize: 12,
                                        }}
                                    >
                                        {call.status === 'Pass'
                                            ? <Flex align="center" gap={4}><IconCircleCheck size={12} />{call.status}</Flex>
                                            : <Flex align="center" gap={4}><IconCircleX size={12} />{call.status}</Flex>}
                                    </Badge>
                                </Table.Td>
                                <Table.Td style={{ padding: '14px 20px' }}>
                                    <Text style={{ fontSize: 13, color: '#9ca3af' }}>{call.date}</Text>
                                </Table.Td>
                            </Table.Tr>
                        ))}
                    </Table.Tbody>
                </Table>
            </Paper>
        </Box>
    )
}