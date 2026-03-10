import { useState } from "react";
import { useOutletContext } from "react-router-dom";

import {
    Box, Flex, Text, Title, Button, Badge, Paper,
    Modal, Stack, TextInput, Select, ActionIcon,
    Progress, Divider, ScrollArea, Textarea,
} from '@mantine/core'
import {
    IconSearch, IconPlayerPlay, IconPlayerPause,
    IconDownload, IconEye, IconMicrophone,
    IconChevronDown, IconCircleCheck, IconCircleX, IconClock,
} from '@tabler/icons-react'

const BRAND = '#16a34a'

const mockCalls = [
    {
        id: 1, agent: 'Sarah Johnson', agentInitials: 'SJ', agentColor: BRAND,
        date: '2024-03-10', time: '09:23 AM', duration: '8:42',
        scorecard: 'Sales QA Scorecard', score: 84, maxScore: 100, status: 'passed',
        phone: '+1 (555) 234-5678',
        transcript: `Agent: Hi, this is Sarah from CallAnalytics. Am I speaking with Mr. Davis?\nCustomer: Yes, speaking.\nAgent: Great! I hope I'm not catching you at a bad time. I wanted to reach out because I saw your company recently expanded and I thought our platform could really help your team.\nCustomer: Sure, I have a few minutes. What does it do?\nAgent: Our platform records and analyzes all your sales calls automatically. It transcribes them and then scores each call based on your custom quality criteria.\nCustomer: Interesting. How much does it cost?\nAgent: We have a few plans depending on team size. For a team like yours I'd recommend our Growth plan at $299 a month.\nCustomer: That sounds reasonable. Can we do a demo?\nAgent: Absolutely! I have availability this Thursday or Friday afternoon. Which works better for you?\nCustomer: Thursday at 2pm works.\nAgent: Perfect, I'll send you a calendar invite right now. Looking forward to showing you everything!`,
        criteria: [
            { label: 'Proper Greeting', score: 9, max: 10, category: 'Communication', reasoning: 'Agent introduced herself with full name and company immediately.' },
            { label: 'Needs Discovery', score: 16, max: 20, category: 'Process', reasoning: 'Asked about company expansion but did not probe deeper into specific pain points.' },
            { label: 'Product Knowledge', score: 22, max: 25, category: 'Product Knowledge', reasoning: 'Clearly explained core features and value proposition.' },
            { label: 'Objection Handling', score: 20, max: 25, category: 'Process', reasoning: 'No major objections raised so limited opportunity to demonstrate this skill.' },
            { label: 'Closing Technique', score: 17, max: 20, category: 'Process', reasoning: 'Secured a demo booking with specific time and sent calendar invite.' },
        ],
        summary: 'Strong overall performance. Sarah demonstrated excellent product knowledge and secured a demo. Main area for improvement is deeper needs discovery before presenting the solution.',
        coachingNotes: '',
    },
    {
        id: 2, agent: 'James Miller', agentInitials: 'JM', agentColor: '#2563eb',
        date: '2024-03-10', time: '10:45 AM', duration: '5:18',
        scorecard: 'Sales QA Scorecard', score: 58, maxScore: 100, status: 'failed',
        phone: '+1 (555) 876-5432',
        transcript: `Agent: Hello?\nCustomer: Hi, is this CallAnalytics?\nAgent: Yeah. What can I do for you?\nCustomer: I was told someone would call me about your service.\nAgent: Right yeah. So we do call recording and stuff. You interested?\nCustomer: Can you tell me more about it?\nAgent: It records calls and scores them. Pretty useful. Costs about 300 bucks a month.\nCustomer: Ok... and what makes it better than competitors?\nAgent: I mean it uses AI so it's pretty accurate.\nCustomer: I'll have to think about it.\nAgent: Sure, let me know.`,
        criteria: [
            { label: 'Proper Greeting', score: 3, max: 10, category: 'Communication', reasoning: 'Agent answered with "Hello?" and did not introduce name or company.' },
            { label: 'Needs Discovery', score: 8, max: 20, category: 'Process', reasoning: 'Did not ask any qualifying questions about the customer needs or team size.' },
            { label: 'Product Knowledge', score: 14, max: 25, category: 'Product Knowledge', reasoning: 'Gave vague explanation of the product without highlighting specific benefits.' },
            { label: 'Objection Handling', score: 15, max: 25, category: 'Process', reasoning: 'When asked about competitors, gave a weak one-sentence response.' },
            { label: 'Closing Technique', score: 18, max: 20, category: 'Process', reasoning: 'Failed to secure any next step. Let customer go with no follow-up plan.' },
        ],
        summary: 'Below standard performance. James failed to introduce himself, skipped needs discovery entirely, and lost the deal by not securing a clear next step. Immediate coaching recommended.',
        coachingNotes: '',
    },
    {
        id: 3, agent: 'Emily Chen', agentInitials: 'EC', agentColor: '#7c3aed',
        date: '2024-03-09', time: '02:15 PM', duration: '12:05',
        scorecard: 'Support QA Scorecard', score: 91, maxScore: 100, status: 'passed',
        phone: '+1 (555) 345-6789',
        transcript: `Agent: Thank you for calling CallAnalytics support, this is Emily. How can I help you today?\nCustomer: Hi Emily, I'm having trouble getting my recordings to upload. It keeps failing halfway through.\nAgent: I'm sorry to hear that, I completely understand how frustrating that must be. Let me help you get that sorted out right away. Can I ask how large are the files you're trying to upload?\nCustomer: They're usually around 50 to 80 megabytes.\nAgent: Got it. And are you uploading from the web app or the desktop client?\nCustomer: The web app.\nAgent: Perfect. So what I'd recommend is switching to our desktop client for large files — it handles anything over 25MB much better. Let me walk you through the installation right now if you have a couple of minutes?\nCustomer: Sure that works.\nAgent: Great. So first go to app.callanalytics.com/download...`,
        criteria: [
            { label: 'Empathy & Tone', score: 19, max: 20, category: 'Communication', reasoning: 'Immediately acknowledged frustration and maintained warm tone throughout.' },
            { label: 'Issue Resolution', score: 36, max: 40, category: 'Process', reasoning: 'Identified root cause quickly and provided a clear actionable solution.' },
            { label: 'Compliance Check', score: 18, max: 20, category: 'Compliance', reasoning: 'Followed all required verification steps before accessing account.' },
            { label: 'Call Closing', score: 18, max: 20, category: 'Communication', reasoning: 'Confirmed resolution and asked if there was anything else before ending.' },
        ],
        summary: 'Excellent support call. Emily demonstrated strong empathy, quickly diagnosed the issue, and guided the customer to a solution.',
        coachingNotes: '',
    },
    {
        id: 4, agent: 'Carlos Rivera', agentInitials: 'CR', agentColor: '#ea580c',
        date: '2024-03-09', time: '04:30 PM', duration: '3:52',
        scorecard: 'Sales QA Scorecard', score: 72, maxScore: 100, status: 'passed',
        phone: '+1 (555) 456-7890',
        transcript: `Agent: Hi this is Carlos from CallAnalytics, is this a good time?\nCustomer: Sure, go ahead.\nAgent: Great. I'm reaching out because we help sales teams automatically score and analyze their calls using AI. Are you currently doing any kind of call QA?\nCustomer: We do some manual reviewing yeah.\nAgent: How much time does your team spend on that each week?\nCustomer: Probably 10-15 hours.\nAgent: That's actually very common. Our platform can cut that down to almost zero.\nCustomer: Interesting. What kind of contract do you require?\nAgent: We're month to month, no long term commitment needed.\nCustomer: Ok I'd be open to seeing a demo.\nAgent: Perfect, I can send you a link to book a time that works for you.`,
        criteria: [
            { label: 'Proper Greeting', score: 8, max: 10, category: 'Communication', reasoning: 'Good intro with name and company but did not ask for the prospect by name.' },
            { label: 'Needs Discovery', score: 17, max: 20, category: 'Process', reasoning: 'Asked about current QA process and time spent — good discovery questions.' },
            { label: 'Product Knowledge', score: 18, max: 25, category: 'Product Knowledge', reasoning: 'Explained core value but missed opportunity to share specific metrics or case studies.' },
            { label: 'Objection Handling', score: 14, max: 25, category: 'Process', reasoning: 'Handled contract concern well but no other objections were raised.' },
            { label: 'Closing Technique', score: 15, max: 20, category: 'Process', reasoning: 'Secured demo but used a passive approach — sending a link vs booking directly.' },
        ],
        summary: 'Decent call with good discovery skills. Carlos secured a demo but could be more assertive in the close.',
        coachingNotes: '',
    },
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

export default function Calls() {
    const { C } = useOutletContext()
    const [calls, setCalls] = useState(mockCalls)
    const [search, setSearch] = useState('')
    const [statusFilter, setStatusFilter] = useState('')
    const [scorecardFilter, setScorecardFilter] = useState('')
    const [agentFilter, setAgentFilter] = useState('')
    const [selectedCall, setSelectedCall] = useState(null)
    const [playing, setPlaying] = useState(false)
    const [coachingNote, setCoachingNote] = useState('')

    const agents = [...new Set(mockCalls.map(c => c.agent))].map(a => ({ value: a, label: a }))
    const scorecards = [...new Set(mockCalls.map(c => c.scorecard))].map(s => ({ value: s, label: s }))

    const filtered = calls.filter(c => {
        const q = search.toLowerCase()
        const matchSearch = !q || c.agent.toLowerCase().includes(q) || c.scorecard.toLowerCase().includes(q) || c.phone.includes(q)
        const matchStatus = !statusFilter || c.status === statusFilter
        const matchScorecard = !scorecardFilter || c.scorecard === scorecardFilter
        const matchAgent = !agentFilter || c.agent === agentFilter
        return matchSearch && matchStatus && matchScorecard && matchAgent
    })

    const openCall = (call) => { setSelectedCall(call); setCoachingNote(call.coachingNotes || ''); setPlaying(false) }
    const saveCoachingNote = () => {
        setCalls(p => p.map(c => c.id === selectedCall.id ? { ...c, coachingNotes: coachingNote } : c))
        setSelectedCall(p => ({ ...p, coachingNotes: coachingNote }))
    }

    const statCards = [
        { label: 'Total Calls', value: calls.length, color: '#2563eb', bg: '#eff6ff', border: '#bfdbfe' },
        { label: 'Passed', value: calls.filter(c => c.status === 'passed').length, color: BRAND, bg: '#f0fdf4', border: '#bbf7d0' },
        { label: 'Failed', value: calls.filter(c => c.status === 'failed').length, color: '#dc2626', bg: '#fef2f2', border: '#fecaca' },
        { label: 'Avg Score', value: Math.round(calls.reduce((s, c) => s + (c.score / c.maxScore) * 100, 0) / calls.length) + '%', color: '#7c3aed', bg: '#f5f3ff', border: '#ddd6fe' },
    ]

    const thStyle = {
        fontSize: 11, color: C.subtle, fontWeight: 600,
        textTransform: 'uppercase', letterSpacing: '0.05em',
        padding: '10px 16px', whiteSpace: 'nowrap', background: C.tableTh,
    }
    const tdStyle = { padding: '14px 16px', borderTop: `1px solid ${C.border}` }

    return (
        <Box>
            <Flex justify="space-between" align="flex-start" mb={24} style={{ flexWrap: 'wrap', gap: 12 }}>
                <Box>
                    <Title order={2} style={{ color: C.text, fontWeight: 700, fontSize: 22, letterSpacing: '-0.3px' }}>All Calls</Title>
                    <Text style={{ color: C.muted, fontSize: 14, marginTop: 4 }}>View and analyze all recorded calls</Text>
                </Box>
                <Button leftSection={<IconDownload size={15} />} radius={8} variant="default"
                    style={{ border: `1px solid ${C.inputBorder}`, color: C.text, fontWeight: 600, fontSize: 14, height: 40, background: C.surface }}>
                    Export CSV
                </Button>
            </Flex>

            {/* Stat Cards */}
            <Flex gap={12} mb={24} style={{ flexWrap: 'wrap' }}>
                {statCards.map((s) => (
                    <Paper key={s.label} p={16} radius={10} style={{ flex: '1 1 140px', border: `1px solid ${s.border}`, background: s.bg }}>
                        <Text style={{ fontSize: 11, color: s.color, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }}>{s.label}</Text>
                        <Text style={{ fontSize: 26, fontWeight: 800, color: s.color, letterSpacing: '-0.5px' }}>{s.value}</Text>
                    </Paper>
                ))}
            </Flex>

            {/* Filters */}
            <Paper p={16} radius={10} mb={16} style={{ border: `1px solid ${C.border}`, background: C.surface, boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
                <Flex gap={12} style={{ flexWrap: 'wrap' }}>
                    <TextInput placeholder="Search agent, scorecard, phone..." value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        leftSection={<IconSearch size={15} color={C.subtle} />} style={{ flex: '1 1 220px' }}
                        styles={{ input: { background: C.inputBg, border: `1px solid ${C.inputBorder}`, color: C.text, borderRadius: 8, height: 38, fontSize: 13 } }} />
                    <Select placeholder="All Agents" data={agents} value={agentFilter}
                        onChange={(v) => setAgentFilter(v || '')} clearable style={{ minWidth: 160 }}
                        styles={{ input: { background: C.inputBg, border: `1px solid ${C.inputBorder}`, color: C.text, borderRadius: 8, height: 38, fontSize: 13 } }} />
                    <Select placeholder="All Scorecards" data={scorecards} value={scorecardFilter}
                        onChange={(v) => setScorecardFilter(v || '')} clearable style={{ minWidth: 180 }}
                        styles={{ input: { background: C.inputBg, border: `1px solid ${C.inputBorder}`, color: C.text, borderRadius: 8, height: 38, fontSize: 13 } }} />
                    <Select placeholder="All Statuses"
                        data={[{ value: 'passed', label: 'Passed' }, { value: 'failed', label: 'Failed' }]}
                        value={statusFilter} onChange={(v) => setStatusFilter(v || '')} clearable style={{ minWidth: 140 }}
                        styles={{ input: { background: C.inputBg, border: `1px solid ${C.inputBorder}`, color: C.text, borderRadius: 8, height: 38, fontSize: 13 } }} />
                </Flex>
            </Paper>

            {/* Table */}
            <Paper radius={12} style={{ border: `1px solid ${C.border}`, background: C.surface, overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
                <ScrollArea>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr>
                                {['Agent', 'Date', 'Duration', 'Scorecard', 'Score', 'Status', 'Actions'].map(h => (
                                    <th key={h} style={thStyle}>{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map((call) => {
                                const pct = Math.round((call.score / call.maxScore) * 100)
                                return (
                                    <tr key={call.id} style={{ cursor: 'pointer' }}
                                        onMouseEnter={(e) => e.currentTarget.style.background = C.hover}
                                        onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                                        onClick={() => openCall(call)}
                                    >
                                        <td style={tdStyle}>
                                            <Flex align="center" gap={10}>
                                                <Avatar initials={call.agentInitials} color={call.agentColor} />
                                                <Box>
                                                    <Text style={{ fontSize: 13, fontWeight: 600, color: C.text }}>{call.agent}</Text>
                                                    <Text style={{ fontSize: 11, color: C.subtle }}>{call.phone}</Text>
                                                </Box>
                                            </Flex>
                                        </td>
                                        <td style={tdStyle}>
                                            <Text style={{ fontSize: 13, color: C.text }}>{call.date}</Text>
                                            <Text style={{ fontSize: 11, color: C.subtle }}>{call.time}</Text>
                                        </td>
                                        <td style={tdStyle}>
                                            <Flex align="center" gap={6}>
                                                <IconClock size={13} color={C.subtle} />
                                                <Text style={{ fontSize: 13, color: C.muted }}>{call.duration}</Text>
                                            </Flex>
                                        </td>
                                        <td style={tdStyle}><Text style={{ fontSize: 13, color: C.muted }}>{call.scorecard}</Text></td>
                                        <td style={tdStyle}>
                                            <Flex align="center" gap={10}>
                                                <Text style={{ fontWeight: 700, fontSize: 14, color: pct >= 70 ? BRAND : '#dc2626' }}>{pct}%</Text>
                                                <Progress value={pct} color={pct >= 70 ? 'green' : 'red'} size={4} radius={4} style={{ width: 60 }} />
                                            </Flex>
                                        </td>
                                        <td style={tdStyle}>
                                            <Badge radius={6}
                                                leftSection={call.status === 'passed' ? <IconCircleCheck size={12} /> : <IconCircleX size={12} />}
                                                style={{
                                                    background: call.status === 'passed' ? '#f0fdf4' : '#fef2f2',
                                                    color: call.status === 'passed' ? BRAND : '#dc2626',
                                                    border: `1px solid ${call.status === 'passed' ? '#bbf7d0' : '#fecaca'}`,
                                                    fontWeight: 600, fontSize: 11, textTransform: 'capitalize',
                                                }}>
                                                {call.status}
                                            </Badge>
                                        </td>
                                        <td style={tdStyle}>
                                            <ActionIcon variant="subtle" radius={6} style={{ color: BRAND }}
                                                onClick={(e) => { e.stopPropagation(); openCall(call) }}>
                                                <IconEye size={16} />
                                            </ActionIcon>
                                        </td>
                                    </tr>
                                )
                            })}
                            {filtered.length === 0 && (
                                <tr><td colSpan={7} style={{ padding: '40px 16px', textAlign: 'center' }}>
                                    <Text style={{ color: C.subtle, fontSize: 14 }}>No calls match your filters</Text>
                                </td></tr>
                            )}
                        </tbody>
                    </table>
                </ScrollArea>
            </Paper>

            {/* Call Detail Modal */}
            <Modal opened={!!selectedCall} onClose={() => setSelectedCall(null)}
                size="1000px" centered radius={12} overlayProps={{ blur: 2 }}
                padding={0} styles={{ header: { display: 'none' }, body: { padding: 0 }, content: { background: C.surface } }}
            >
                {selectedCall && (
                    <Flex style={{ height: '85vh', overflow: 'hidden' }}>
                        {/* Left — Transcript */}
                        <Box style={{ flex: 1, borderRight: `1px solid ${C.border}`, display: 'flex', flexDirection: 'column', background: C.surface }}>
                            <Flex align="center" justify="space-between" p={20} style={{ borderBottom: `1px solid ${C.border}`, flexShrink: 0 }}>
                                <Flex align="center" gap={12}>
                                    <Avatar initials={selectedCall.agentInitials} color={selectedCall.agentColor} size={38} />
                                    <Box>
                                        <Text style={{ fontWeight: 700, fontSize: 15, color: C.text }}>{selectedCall.agent}</Text>
                                        <Text style={{ fontSize: 12, color: C.subtle }}>{selectedCall.date} · {selectedCall.time} · {selectedCall.duration}</Text>
                                    </Box>
                                </Flex>
                                <Flex align="center" gap={8}>
                                    <Badge radius={6} style={{
                                        background: selectedCall.status === 'passed' ? '#f0fdf4' : '#fef2f2',
                                        color: selectedCall.status === 'passed' ? BRAND : '#dc2626',
                                        border: `1px solid ${selectedCall.status === 'passed' ? '#bbf7d0' : '#fecaca'}`,
                                        fontWeight: 700, fontSize: 13,
                                    }}>
                                        {Math.round((selectedCall.score / selectedCall.maxScore) * 100)}%
                                    </Badge>
                                    <ActionIcon variant="subtle" color="gray" radius={6} onClick={() => setSelectedCall(null)}>
                                        <IconChevronDown size={16} />
                                    </ActionIcon>
                                </Flex>
                            </Flex>

                            {/* Audio Player */}
                            <Box p={16} style={{ borderBottom: `1px solid ${C.border}`, flexShrink: 0 }}>
                                <Flex align="center" gap={12}>
                                    <ActionIcon radius={20} size={36} onClick={() => setPlaying(p => !p)}
                                        style={{ background: BRAND, color: '#fff', flexShrink: 0 }}>
                                        {playing ? <IconPlayerPause size={16} /> : <IconPlayerPlay size={16} />}
                                    </ActionIcon>
                                    <Box style={{ flex: 1 }}>
                                        <Box style={{ height: 4, background: C.border, borderRadius: 4, position: 'relative', cursor: 'pointer' }}>
                                            <Box style={{ position: 'absolute', left: 0, top: 0, height: '100%', width: '35%', background: BRAND, borderRadius: 4 }} />
                                        </Box>
                                    </Box>
                                    <Flex align="center" gap={4}>
                                        <IconMicrophone size={13} color={C.subtle} />
                                        <Text style={{ fontSize: 12, color: C.subtle }}>{selectedCall.duration}</Text>
                                    </Flex>
                                </Flex>
                            </Box>

                            {/* Transcript */}
                            <ScrollArea style={{ flex: 1 }} p={20}>
                                <Text style={{ fontSize: 12, color: C.subtle, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 12 }}>
                                    Transcript
                                </Text>
                                {selectedCall.transcript.split('\n').filter(Boolean).map((line, i) => {
                                    const isAgent = line.startsWith('Agent:')
                                    return (
                                        <Box key={i} mb={12}>
                                            <Text style={{ fontSize: 11, fontWeight: 700, marginBottom: 3, color: isAgent ? BRAND : C.muted, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                                                {isAgent ? 'Agent' : 'Customer'}
                                            </Text>
                                            <Text style={{ fontSize: 13, color: C.text, lineHeight: 1.6 }}>
                                                {line.replace('Agent: ', '').replace('Customer: ', '')}
                                            </Text>
                                        </Box>
                                    )
                                })}
                            </ScrollArea>
                        </Box>

                        {/* Right — Scores */}
                        <Box style={{ width: 380, background: C.surface }}>
                            <ScrollArea style={{ height: '85vh' }}>
                                <Box p={20}>
                                    <Text style={{ fontSize: 12, color: C.subtle, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 16 }}>
                                        Score Breakdown
                                    </Text>
                                    <Stack gap={10} mb={24}>
                                        {selectedCall.criteria.map((c) => {
                                            const pct = Math.round((c.score / c.max) * 100)
                                            return (
                                                <Paper key={c.label} p={14} radius={10} style={{ border: `1px solid ${C.border}`, background: C.hover }}>
                                                    <Flex justify="space-between" align="center" mb={6}>
                                                        <Box>
                                                            <Text style={{ fontSize: 13, fontWeight: 600, color: C.text }}>{c.label}</Text>
                                                            <Text style={{ fontSize: 11, color: C.subtle }}>{c.category}</Text>
                                                        </Box>
                                                        <Text style={{ fontSize: 14, fontWeight: 800, color: pct >= 70 ? BRAND : '#dc2626' }}>
                                                            {c.score}/{c.max}
                                                        </Text>
                                                    </Flex>
                                                    <Progress value={pct} color={pct >= 70 ? 'green' : 'red'} size={4} radius={4} mb={8} />
                                                    <Text style={{ fontSize: 12, color: C.muted, lineHeight: 1.5 }}>{c.reasoning}</Text>
                                                </Paper>
                                            )
                                        })}
                                    </Stack>

                                    <Divider style={{ borderColor: C.border, marginBottom: 16 }} />

                                    <Text style={{ fontSize: 12, color: C.subtle, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 10 }}>
                                        AI Summary
                                    </Text>
                                    <Paper p={14} radius={10} style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', marginBottom: 20 }}>
                                        <Text style={{ fontSize: 13, color: '#166534', lineHeight: 1.6 }}>{selectedCall.summary}</Text>
                                    </Paper>

                                    <Text style={{ fontSize: 12, color: C.subtle, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 10 }}>
                                        Coaching Notes
                                    </Text>
                                    <Textarea placeholder="Add coaching notes for this agent..." value={coachingNote}
                                        onChange={(e) => setCoachingNote(e.target.value)} minRows={3} mb={10}
                                        styles={{ input: { background: C.inputBg, border: `1px solid ${C.inputBorder}`, color: C.text, borderRadius: 8, fontSize: 13 } }} />
                                    <Button fullWidth radius={8} onClick={saveCoachingNote}
                                        style={{ background: BRAND, color: '#fff', fontWeight: 600, fontSize: 13, border: 'none', height: 38 }}>
                                        Save Coaching Note
                                    </Button>
                                </Box>
                            </ScrollArea>
                        </Box>
                    </Flex>
                )}
            </Modal>
        </Box>
    )
}