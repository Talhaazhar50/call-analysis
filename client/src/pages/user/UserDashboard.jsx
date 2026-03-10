import { useNavigate, useOutletContext } from "react-router-dom";

import {
    SimpleGrid, Card, Text, Group, Stack, Badge, Button,
    Progress, Table, Avatar, ThemeIcon, Box, Paper
} from '@mantine/core'
import {
    IconHeadphones, IconBrain, IconCircleCheck, IconTrophy,
    IconUpload, IconArrowRight, IconArrowUpRight
} from '@tabler/icons-react'

const BRAND = '#16a34a'

const recentCalls = [
    { id: 1, name: 'sales_call_may12.mp3', score: 84, pass: true, date: 'Mar 8, 2026', duration: '6:34', scorecard: 'Sales QA' },
    { id: 2, name: 'followup_davis.mp3', score: 61, pass: false, date: 'Mar 6, 2026', duration: '4:12', scorecard: 'Sales QA' },
    { id: 3, name: 'inbound_jones.mp3', score: 91, pass: true, date: 'Mar 4, 2026', duration: '8:02', scorecard: 'Support QA' },
    { id: 4, name: 'cold_call_batch3.mp3', score: 74, pass: true, date: 'Mar 1, 2026', duration: '3:50', scorecard: 'Sales QA' },
]

const trendData = [62, 61, 70, 74, 78, 84, 91]
const trendLabels = ['Feb 8', 'Feb 15', 'Feb 20', 'Feb 26', 'Mar 1', 'Mar 8', 'Mar 10']
const criteriaData = [
    { label: 'Proper Greeting', pct: 92 },
    { label: 'Product Knowledge', pct: 85 },
    { label: 'Closing Technique', pct: 78 },
    { label: 'Needs Discovery', pct: 66 },
    { label: 'Objection Handling', pct: 54 },
]

const stats = [
    { label: 'Total Calls', value: recentCalls.length, sub: 'This month', icon: IconHeadphones, color: '#2563eb', bg: '#eff6ff', borderColor: '#bfdbfe' },
    { label: 'Avg Score', value: '78%', sub: '+6% vs last month', icon: IconBrain, color: BRAND, bg: '#f0fdf4', borderColor: '#bbf7d0' },
    { label: 'Passed', value: '3/4', sub: '75% pass rate', icon: IconCircleCheck, color: '#7c3aed', bg: '#faf5ff', borderColor: '#e9d5ff' },
    { label: 'Best Score', value: '91%', sub: 'All time', icon: IconTrophy, color: '#ea580c', bg: '#fff7ed', borderColor: '#fed7aa' },
]

export default function UserDashboard() {
    const { dark, C } = useOutletContext()
    const navigate = useNavigate()

    const maxTrend = Math.max(...trendData)
    const minTrend = Math.min(...trendData)

    return (
        <Box p="xl" maw={1100}>
            {/* Header */}
            <Stack gap={4} mb="xl">
                <Text fw={800} size="xl" c={C.text} style={{ letterSpacing: '-0.5px', fontSize: 26 }}>
                    Good morning, Sarah 👋
                </Text>
                <Text size="sm" c={C.muted}>Here's how your calls are performing this week.</Text>
            </Stack>

            {/* Stat Cards */}
            <SimpleGrid cols={{ base: 1, xs: 2, md: 4 }} spacing="md" mb="lg">
                {stats.map(stat => (
                    <Card
                        key={stat.label}
                        padding="lg"
                        radius="md"
                        style={{ background: C.surface, border: `1px solid ${C.border}`, boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}
                    >
                        <Group justify="space-between" mb="md">
                            <Text size="xs" fw={600} c={C.muted}>{stat.label}</Text>
                            <ThemeIcon size={36} radius="md" style={{ background: stat.bg, border: `1px solid ${stat.borderColor}` }}>
                                <stat.icon size={18} color={stat.color} />
                            </ThemeIcon>
                        </Group>
                        <Text fw={800} style={{ fontSize: 28, color: stat.color, lineHeight: 1 }} mb={6}>
                            {stat.value}
                        </Text>
                        <Text size="xs" c={C.subtle}>{stat.sub}</Text>
                    </Card>
                ))}
            </SimpleGrid>

            {/* Charts Row */}
            <SimpleGrid cols={{ base: 1, md: 2 }} spacing="md" mb="md">
                {/* Score Trend */}
                <Card padding="lg" radius="md" style={{ background: C.surface, border: `1px solid ${C.border}`, boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
                    <Group justify="space-between" mb="lg">
                        <Stack gap={2}>
                            <Text fw={700} size="sm" c={C.text}>Score Trend</Text>
                            <Text size="xs" c={C.muted}>Last 7 sessions</Text>
                        </Stack>
                        <Text fw={800} size="xl" c={BRAND}>91%</Text>
                    </Group>

                    <svg viewBox="0 0 320 100" style={{ width: '100%', height: 100, overflow: 'visible' }}>
                        <defs>
                            <linearGradient id="trendGradU" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor={BRAND} stopOpacity="0.15" />
                                <stop offset="100%" stopColor={BRAND} stopOpacity="0" />
                            </linearGradient>
                        </defs>
                        {[0, 25, 50, 75, 100].map(y => (
                            <line key={y} x1="0" y1={y} x2="320" y2={y} stroke={dark ? '#2a2d3a' : '#f3f4f6'} strokeWidth="1" />
                        ))}
                        <path
                            d={`M ${trendData.map((v, i) => {
                                const x = (i / (trendData.length - 1)) * 300 + 10
                                const y = 100 - ((v - minTrend + 5) / (maxTrend - minTrend + 10)) * 90
                                return `${x},${y}`
                            }).join(' L ')} L 310,100 L 10,100 Z`}
                            fill="url(#trendGradU)"
                        />
                        <polyline
                            points={trendData.map((v, i) => {
                                const x = (i / (trendData.length - 1)) * 300 + 10
                                const y = 100 - ((v - minTrend + 5) / (maxTrend - minTrend + 10)) * 90
                                return `${x},${y}`
                            }).join(' ')}
                            fill="none" stroke={BRAND} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                        />
                        {trendData.map((v, i) => {
                            const x = (i / (trendData.length - 1)) * 300 + 10
                            const y = 100 - ((v - minTrend + 5) / (maxTrend - minTrend + 10)) * 90
                            return (
                                <g key={i}>
                                    <circle cx={x} cy={y} r="4" fill={BRAND} />
                                    <circle cx={x} cy={y} r="2" fill="#fff" />
                                </g>
                            )
                        })}
                    </svg>

                    <Group justify="space-between" mt={6}>
                        {trendLabels.map(l => (
                            <Text key={l} size="xs" c={C.subtle} style={{ fontSize: 9 }}>{l}</Text>
                        ))}
                    </Group>
                </Card>

                {/* Criteria Performance */}
                <Card padding="lg" radius="md" style={{ background: C.surface, border: `1px solid ${C.border}`, boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
                    <Stack gap={2} mb="lg">
                        <Text fw={700} size="sm" c={C.text}>Top Criteria Performance</Text>
                        <Text size="xs" c={C.muted}>Avg across all your calls</Text>
                    </Stack>
                    <Stack gap="sm">
                        {criteriaData.map(item => (
                            <Box key={item.label}>
                                <Group justify="space-between" mb={5}>
                                    <Text size="xs" fw={500} c={C.text}>{item.label}</Text>
                                    <Text size="xs" fw={700} c={item.pct >= 70 ? BRAND : '#ea580c'}>{item.pct}%</Text>
                                </Group>
                                <Progress
                                    value={item.pct}
                                    size={5}
                                    radius="xl"
                                    color={item.pct >= 70 ? 'green' : 'orange'}
                                    styles={{ root: { background: C.border } }}
                                />
                            </Box>
                        ))}
                    </Stack>
                </Card>
            </SimpleGrid>

            {/* Upload CTA */}
            <Paper
                radius="md"
                p="lg"
                mb="md"
                style={{
                    background: dark ? 'rgba(22,163,74,0.08)' : '#f0fdf4',
                    border: `1px solid ${dark ? 'rgba(22,163,74,0.2)' : '#bbf7d0'}`,
                }}
            >
                <Group justify="space-between" wrap="nowrap">
                    <Group gap="md">
                        <ThemeIcon size={44} radius="md" style={{ background: BRAND }}>
                            <IconUpload size={22} color="#fff" />
                        </ThemeIcon>
                        <Stack gap={2}>
                            <Text fw={700} size="sm" c={C.text}>Upload a new call</Text>
                            <Text size="xs" c={C.muted}>Get your AI score in under 60 seconds</Text>
                        </Stack>
                    </Group>
                    <Button
                        onClick={() => navigate('/dashboard/upload')}
                        rightSection={<IconArrowRight size={16} />}
                        style={{ background: BRAND, flexShrink: 0 }}
                    >
                        Upload now
                    </Button>
                </Group>
            </Paper>

            {/* Recent Calls Table */}
            <Card padding={0} radius="md" style={{ background: C.surface, border: `1px solid ${C.border}`, boxShadow: '0 1px 4px rgba(0,0,0,0.04)', overflow: 'hidden' }}>
                <Group justify="space-between" p="md" style={{ borderBottom: `1px solid ${C.border}` }}>
                    <Text fw={700} size="sm" c={C.text}>Recent Calls</Text>
                    <Button variant="subtle" size="xs" color="green" rightSection={<IconArrowRight size={14} />}
                        onClick={() => navigate('/dashboard/calls')}>
                        View all
                    </Button>
                </Group>

                <Table highlightOnHover striped={false} style={{ '--table-highlight-color': C.hover }}>
                    <Table.Thead style={{ background: C.tableTh }}>
                        <Table.Tr>
                            {['File', 'Scorecard', 'Score', 'Status', 'Date', 'Duration', ''].map(h => (
                                <Table.Th key={h} style={{ fontSize: 11, fontWeight: 700, color: C.muted, letterSpacing: '0.05em', textTransform: 'uppercase', padding: '10px 20px' }}>
                                    {h}
                                </Table.Th>
                            ))}
                        </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                        {recentCalls.map(call => (
                            <Table.Tr
                                key={call.id}
                                style={{ cursor: 'pointer', borderTop: `1px solid ${C.border}` }}
                                onClick={() => navigate(`/dashboard/calls/${call.id}`)}
                            >
                                <Table.Td style={{ padding: '12px 20px' }}>
                                    <Group gap="sm">
                                        <ThemeIcon size={32} radius="md" style={{ background: C.tableTh, border: `1px solid ${C.border}` }}>
                                            <span style={{ fontSize: 14 }}>🎵</span>
                                        </ThemeIcon>
                                        <Text size="sm" fw={500} c={C.text} style={{ maxWidth: 180, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                            {call.name}
                                        </Text>
                                    </Group>
                                </Table.Td>
                                <Table.Td style={{ padding: '12px 20px' }}>
                                    <Badge variant="light" color="gray" size="sm">{call.scorecard}</Badge>
                                </Table.Td>
                                <Table.Td style={{ padding: '12px 20px' }}>
                                    <Text size="sm" fw={800} c={call.score >= 70 ? BRAND : '#dc2626'}>{call.score}%</Text>
                                </Table.Td>
                                <Table.Td style={{ padding: '12px 20px' }}>
                                    <Badge
                                        variant="light"
                                        color={call.pass ? 'green' : 'red'}
                                        size="sm"
                                    >
                                        {call.pass ? '✓ PASS' : '✗ FAIL'}
                                    </Badge>
                                </Table.Td>
                                <Table.Td style={{ padding: '12px 20px' }}>
                                    <Text size="sm" c={C.muted}>{call.date}</Text>
                                </Table.Td>
                                <Table.Td style={{ padding: '12px 20px' }}>
                                    <Text size="sm" c={C.muted}>{call.duration}</Text>
                                </Table.Td>
                                <Table.Td style={{ padding: '12px 20px' }}>
                                    <Button variant="subtle" size="xs" color="green" rightSection={<IconArrowRight size={12} />}>
                                        View
                                    </Button>
                                </Table.Td>
                            </Table.Tr>
                        ))}
                    </Table.Tbody>
                </Table>
            </Card>
        </Box>
    )
}