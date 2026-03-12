import axios from "axios";
import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";

import {
    Box, Flex, Text, Title, Button, Badge, Paper,
    Modal, Stack, TextInput, Select, ActionIcon,
    Progress, ScrollArea, Textarea, Loader,
} from '@mantine/core'
import {
    IconSearch, IconDownload, IconEye,
    IconCircleCheck, IconCircleX, IconChevronDown, IconSchool,
} from '@tabler/icons-react'

const BRAND = '#16a34a'
const API = import.meta.env.VITE_API_URL || 'http://localhost:8000/api'

function Avatar({ name = '', size = 32 }) {
    const colors = [BRAND, '#2563eb', '#7c3aed', '#ea580c', '#0891b2', '#db2777']
    const color = colors[(name.charCodeAt(0) || 0) % colors.length]
    const initials = name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
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

function exportToCSV(calls) {
    const headers = ['Agent Name', 'Agent Email', 'File', 'Date', 'Time', 'Scorecard', 'Score (%)', 'Status', 'Coached']
    const rows = calls.map(call => {
        const agentName = call.user?.name || call.user?.email?.split('@')[0] || 'Unknown'
        const agentEmail = call.user?.email || ''
        const date = new Date(call.createdAt)
        const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
        const timeStr = date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
        return [
            agentName,
            agentEmail,
            call.fileName || '',
            dateStr,
            timeStr,
            call.scorecardName || '',
            call.percentage ?? '',
            call.pass ? 'Pass' : 'Fail',
            call.coached ? 'Coached' : 'Pending',
        ]
    })

    const csvContent = [headers, ...rows]
        .map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
        .join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `calls-export-${new Date().toISOString().slice(0, 10)}.csv`
    link.click()
    URL.revokeObjectURL(url)
}

export default function Calls() {
    const { C } = useOutletContext()
    const [calls, setCalls] = useState([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')
    const [statusFilter, setStatusFilter] = useState('')
    const [scorecardFilter, setScorecardFilter] = useState('')
    const [coachedFilter, setCoachedFilter] = useState('')
    const [selectedCall, setSelectedCall] = useState(null)
    const [coachingNote, setCoachingNote] = useState('')
    const [savingNote, setSavingNote] = useState(false)

    const token = localStorage.getItem('token')
    const headers = { Authorization: `Bearer ${token}` }

    useEffect(() => {
        axios.get(`${API}/calls/admin/all`, { headers })
            .then(r => setCalls(r.data.filter(c => c.status === 'done')))
            .catch(() => { })
            .finally(() => setLoading(false))
    }, [])

    const openCall = (call) => {
        setSelectedCall(call)
        setCoachingNote(call.notes || '')
    }

    const saveCoachingNote = async () => {
        setSavingNote(true)
        try {
            await axios.patch(`${API}/calls/${selectedCall._id}/coached`, {}, { headers })
            const newCoached = !selectedCall.coached
            setCalls(p => p.map(c => c._id === selectedCall._id ? { ...c, notes: coachingNote, coached: newCoached } : c))
            setSelectedCall(p => ({ ...p, notes: coachingNote, coached: newCoached }))
        } catch (e) {
            alert('Failed to update coached status')
        }
        setSavingNote(false)
    }

    const scorecards = [...new Set(calls.map(c => c.scorecardName).filter(Boolean))].map(s => ({ value: s, label: s }))
    const coachedCount = calls.filter(c => c.coached).length
    const notCoachedCount = calls.filter(c => !c.coached).length

    const filtered = calls.filter(c => {
        const agentName = c.user?.name || c.user?.email?.split('@')[0] || ''
        const q = search.toLowerCase()
        const matchSearch = !q || agentName.toLowerCase().includes(q) || c.scorecardName?.toLowerCase().includes(q) || c.fileName?.toLowerCase().includes(q)
        const matchStatus = !statusFilter || (statusFilter === 'passed' ? c.pass : !c.pass)
        const matchScorecard = !scorecardFilter || c.scorecardName === scorecardFilter
        const matchCoached = !coachedFilter || (coachedFilter === 'coached' ? c.coached : !c.coached)
        return matchSearch && matchStatus && matchScorecard && matchCoached
    })

    const statCards = [
        { label: 'Total Calls', value: calls.length, color: '#2563eb', bg: '#eff6ff', border: '#bfdbfe' },
        { label: 'Passed', value: calls.filter(c => c.pass).length, color: BRAND, bg: '#f0fdf4', border: '#bbf7d0' },
        { label: 'Failed', value: calls.filter(c => !c.pass).length, color: '#dc2626', bg: '#fef2f2', border: '#fecaca' },
        { label: 'Avg Score', value: calls.length ? Math.round(calls.reduce((s, c) => s + c.percentage, 0) / calls.length) + '%' : '—', color: '#7c3aed', bg: '#f5f3ff', border: '#ddd6fe' },
        { label: 'Coached', value: coachedCount, color: '#0891b2', bg: '#f0f9ff', border: '#bae6fd' },
    ]

    const thStyle = {
        fontSize: 11, color: C.subtle, fontWeight: 600,
        textTransform: 'uppercase', letterSpacing: '0.05em',
        padding: '10px 16px', whiteSpace: 'nowrap', background: C.tableTh, textAlign: 'left',
    }
    const tdStyle = { padding: '14px 16px', borderTop: `1px solid ${C.border}` }

    if (loading) return (
        <Box style={{ display: 'flex', justifyContent: 'center', paddingTop: 80 }}>
            <Loader color="green" />
        </Box>
    )

    return (
        <Box>
            <Flex justify="space-between" align="flex-start" mb={24} style={{ flexWrap: 'wrap', gap: 12 }}>
                <Box>
                    <Title order={2} style={{ color: C.text, fontWeight: 700, fontSize: 22, letterSpacing: '-0.3px' }}>All Calls</Title>
                    <Text style={{ color: C.muted, fontSize: 14, marginTop: 4 }}>
                        View and analyze all recorded calls · {notCoachedCount} pending coaching
                    </Text>
                </Box>
                <Button
                    leftSection={<IconDownload size={15} />}
                    radius={8}
                    variant="default"
                    onClick={() => exportToCSV(filtered)}
                    style={{ border: `1px solid ${C.inputBorder}`, color: C.text, fontWeight: 600, fontSize: 14, height: 40, background: C.surface }}
                >
                    Export CSV
                </Button>
            </Flex>

            {/* Stat Cards */}
            <Flex gap={12} mb={24} style={{ flexWrap: 'wrap' }}>
                {statCards.map((s) => (
                    <Paper key={s.label} p={16} radius={10} style={{ flex: '1 1 120px', border: `1px solid ${s.border}`, background: s.bg }}>
                        <Text style={{ fontSize: 11, color: s.color, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }}>{s.label}</Text>
                        <Text style={{ fontSize: 26, fontWeight: 800, color: s.color, letterSpacing: '-0.5px' }}>{s.value}</Text>
                    </Paper>
                ))}
            </Flex>

            {/* Filters */}
            <Paper p={16} radius={10} mb={16} style={{ border: `1px solid ${C.border}`, background: C.surface, boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
                <Flex gap={12} style={{ flexWrap: 'wrap' }}>
                    <TextInput placeholder="Search agent, scorecard, file..." value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        leftSection={<IconSearch size={15} color={C.subtle} />} style={{ flex: '1 1 220px' }}
                        styles={{ input: { background: C.inputBg, border: `1px solid ${C.inputBorder}`, color: C.text, borderRadius: 8, height: 38, fontSize: 13 } }} />
                    <Select placeholder="All Scorecards" data={scorecards} value={scorecardFilter}
                        onChange={(v) => setScorecardFilter(v || '')} clearable style={{ minWidth: 180 }}
                        styles={{ input: { background: C.inputBg, border: `1px solid ${C.inputBorder}`, color: C.text, borderRadius: 8, height: 38, fontSize: 13 } }} />
                    <Select placeholder="All Statuses"
                        data={[{ value: 'passed', label: '✓ Passed' }, { value: 'failed', label: '✗ Failed' }]}
                        value={statusFilter} onChange={(v) => setStatusFilter(v || '')} clearable style={{ minWidth: 140 }}
                        styles={{ input: { background: C.inputBg, border: `1px solid ${C.inputBorder}`, color: C.text, borderRadius: 8, height: 38, fontSize: 13 } }} />
                    <Select placeholder="All Coaching"
                        data={[{ value: 'coached', label: '🎓 Coached' }, { value: 'pending', label: '⏳ Pending Coaching' }]}
                        value={coachedFilter} onChange={(v) => setCoachedFilter(v || '')} clearable style={{ minWidth: 170 }}
                        styles={{ input: { background: C.inputBg, border: `1px solid ${C.inputBorder}`, color: C.text, borderRadius: 8, height: 38, fontSize: 13 } }} />
                </Flex>
            </Paper>

            {/* Table */}
            <Paper radius={12} style={{ border: `1px solid ${C.border}`, background: C.surface, overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
                <ScrollArea>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr>
                                {['Agent', 'File', 'Date', 'Scorecard', 'Score', 'Status', 'Coached', 'Actions'].map(h => (
                                    <th key={h} style={thStyle}>{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map((call) => {
                                const agentName = call.user?.name || call.user?.email?.split('@')[0] || 'Unknown'
                                return (
                                    <tr key={call._id} style={{ cursor: 'pointer' }}
                                        onMouseEnter={(e) => e.currentTarget.style.background = C.hover}
                                        onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                                        onClick={() => openCall(call)}
                                    >
                                        <td style={tdStyle}>
                                            <Flex align="center" gap={10}>
                                                <Avatar name={agentName} />
                                                <Box>
                                                    <Text style={{ fontSize: 13, fontWeight: 600, color: C.text }}>{agentName}</Text>
                                                    <Text style={{ fontSize: 11, color: C.subtle }}>{call.user?.email}</Text>
                                                </Box>
                                            </Flex>
                                        </td>
                                        <td style={tdStyle}>
                                            <Text style={{ fontSize: 12, color: C.muted, maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                {call.fileName}
                                            </Text>
                                        </td>
                                        <td style={tdStyle}>
                                            <Text style={{ fontSize: 13, color: C.text }}>
                                                {new Date(call.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                            </Text>
                                            <Text style={{ fontSize: 11, color: C.subtle }}>
                                                {new Date(call.createdAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                                            </Text>
                                        </td>
                                        <td style={tdStyle}><Text style={{ fontSize: 13, color: C.muted }}>{call.scorecardName}</Text></td>
                                        <td style={tdStyle}>
                                            <Flex align="center" gap={10}>
                                                <Text style={{ fontWeight: 700, fontSize: 14, color: call.percentage >= 70 ? BRAND : '#dc2626' }}>{call.percentage}%</Text>
                                                <Progress value={call.percentage} color={call.percentage >= 70 ? 'green' : 'red'} size={4} radius={4} style={{ width: 60 }} />
                                            </Flex>
                                        </td>
                                        <td style={tdStyle}>
                                            <Badge radius={6}
                                                leftSection={call.pass ? <IconCircleCheck size={12} /> : <IconCircleX size={12} />}
                                                style={{
                                                    background: call.pass ? '#f0fdf4' : '#fef2f2',
                                                    color: call.pass ? BRAND : '#dc2626',
                                                    border: `1px solid ${call.pass ? '#bbf7d0' : '#fecaca'}`,
                                                    fontWeight: 600, fontSize: 11,
                                                }}>
                                                {call.pass ? 'Pass' : 'Fail'}
                                            </Badge>
                                        </td>
                                        <td style={tdStyle}>
                                            {call.coached ? (
                                                <Badge radius={6} leftSection={<IconSchool size={11} />} style={{
                                                    background: '#f0f9ff', color: '#0891b2',
                                                    border: '1px solid #bae6fd', fontWeight: 600, fontSize: 11,
                                                }}>
                                                    Coached
                                                </Badge>
                                            ) : (
                                                <Badge radius={6} style={{
                                                    background: C.hover, color: C.subtle,
                                                    border: `1px solid ${C.border}`, fontWeight: 500, fontSize: 11,
                                                }}>
                                                    Pending
                                                </Badge>
                                            )}
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
                                <tr><td colSpan={8} style={{ padding: '40px 16px', textAlign: 'center' }}>
                                    <Text style={{ color: C.subtle, fontSize: 14 }}>No calls found</Text>
                                </td></tr>
                            )}
                        </tbody>
                    </table>
                </ScrollArea>
            </Paper>

            {/* Call Detail Modal */}
            <Modal opened={!!selectedCall} onClose={() => setSelectedCall(null)}
                size="1100px" centered radius={12} overlayProps={{ blur: 2 }}
                padding={0} styles={{ header: { display: 'none' }, body: { padding: 0 }, content: { background: C.surface } }}
            >
                {selectedCall && (
                    <Flex style={{ height: '85vh', overflow: 'hidden' }}>
                        {/* Left — Transcript */}
                        <Box style={{ flex: 1, borderRight: `1px solid ${C.border}`, display: 'flex', flexDirection: 'column' }}>
                            <Flex align="center" justify="space-between" p={20} style={{ borderBottom: `1px solid ${C.border}`, flexShrink: 0 }}>
                                <Flex align="center" gap={12}>
                                    <Avatar name={selectedCall.user?.name || selectedCall.user?.email || '?'} size={38} />
                                    <Box>
                                        <Text style={{ fontWeight: 700, fontSize: 15, color: C.text }}>
                                            {selectedCall.user?.name || selectedCall.user?.email?.split('@')[0] || 'Unknown'}
                                        </Text>
                                        <Text style={{ fontSize: 12, color: C.subtle }}>
                                            {selectedCall.fileName} · {new Date(selectedCall.createdAt).toLocaleDateString()}
                                        </Text>
                                    </Box>
                                </Flex>
                                <Flex align="center" gap={8}>
                                    {selectedCall.coached && (
                                        <Badge radius={6} leftSection={<IconSchool size={11} />} style={{
                                            background: '#f0f9ff', color: '#0891b2',
                                            border: '1px solid #bae6fd', fontWeight: 600, fontSize: 11,
                                        }}>Coached</Badge>
                                    )}
                                    <Badge radius={6} style={{
                                        background: selectedCall.pass ? '#f0fdf4' : '#fef2f2',
                                        color: selectedCall.pass ? BRAND : '#dc2626',
                                        border: `1px solid ${selectedCall.pass ? '#bbf7d0' : '#fecaca'}`,
                                        fontWeight: 700, fontSize: 13,
                                    }}>
                                        {selectedCall.percentage}%
                                    </Badge>
                                    <ActionIcon variant="subtle" color="gray" radius={6} onClick={() => setSelectedCall(null)}>
                                        <IconChevronDown size={16} />
                                    </ActionIcon>
                                </Flex>
                            </Flex>

                            {/* Transcript */}
                            <ScrollArea style={{ flex: 1 }}>
                                <Box p={20}>
                                    <Text style={{ fontSize: 12, color: C.subtle, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 12 }}>
                                        Transcript
                                    </Text>
                                    {selectedCall.transcript?.length > 0 ? (
                                        selectedCall.transcript.map((seg, i) => (
                                            <Box key={i} mb={12}>
                                                <Text style={{ fontSize: 11, fontWeight: 700, marginBottom: 3, color: seg.speaker === 'A' ? BRAND : C.muted, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                                                    {seg.speaker === 'A' ? 'Agent' : 'Customer'}
                                                </Text>
                                                <Text style={{ fontSize: 13, color: C.text, lineHeight: 1.6 }}>{seg.text}</Text>
                                            </Box>
                                        ))
                                    ) : (
                                        <Text style={{ fontSize: 13, color: C.muted }}>No transcript available</Text>
                                    )}
                                </Box>
                            </ScrollArea>
                        </Box>

                        {/* Right — Scores + Notes */}
                        <Box style={{ width: 380, background: C.surface }}>
                            <ScrollArea style={{ height: '85vh' }}>
                                <Box p={20}>
                                    <Text style={{ fontSize: 12, color: C.subtle, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 16 }}>
                                        Score Breakdown
                                    </Text>
                                    <Stack gap={10} mb={24}>
                                        {selectedCall.criteriaResults?.map((c, i) => {
                                            const pct = c.maxScore > 0 ? Math.round((c.score / c.maxScore) * 100) : 0
                                            return (
                                                <Paper key={i} p={14} radius={10} style={{ border: `1px solid ${C.border}`, background: C.hover }}>
                                                    <Flex justify="space-between" align="center" mb={6}>
                                                        <Box>
                                                            <Text style={{ fontSize: 13, fontWeight: 600, color: C.text }}>{c.label}</Text>
                                                            {c.category && <Text style={{ fontSize: 11, color: C.subtle }}>{c.category}</Text>}
                                                        </Box>
                                                        <Text style={{ fontSize: 14, fontWeight: 800, color: pct >= 70 ? BRAND : '#dc2626' }}>
                                                            {c.score}/{c.maxScore}
                                                        </Text>
                                                    </Flex>
                                                    <Progress value={pct} color={pct >= 70 ? 'green' : 'red'} size={4} radius={4} mb={c.feedback ? 8 : 0} />
                                                    {c.feedback && <Text style={{ fontSize: 12, color: C.muted, lineHeight: 1.5 }}>{c.feedback}</Text>}
                                                </Paper>
                                            )
                                        })}
                                    </Stack>

                                    {selectedCall.overallFeedback && (
                                        <>
                                            <Text style={{ fontSize: 12, color: C.subtle, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 10 }}>
                                                AI Summary
                                            </Text>
                                            <Paper p={14} radius={10} style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', marginBottom: 20 }}>
                                                <Text style={{ fontSize: 13, color: '#166534', lineHeight: 1.6 }}>{selectedCall.overallFeedback}</Text>
                                            </Paper>
                                        </>
                                    )}

                                    <Text style={{ fontSize: 12, color: C.subtle, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 10 }}>
                                        Coaching Notes
                                    </Text>
                                    <Textarea placeholder="Add coaching notes for this agent..." value={coachingNote}
                                        onChange={(e) => setCoachingNote(e.target.value)} minRows={3} mb={10}
                                        styles={{ input: { background: C.inputBg, border: `1px solid ${C.inputBorder}`, color: C.text, borderRadius: 8, fontSize: 13 } }} />

                                    <Button fullWidth radius={8} onClick={saveCoachingNote} loading={savingNote}
                                        style={{
                                            background: selectedCall.coached ? C.hover : BRAND,
                                            color: selectedCall.coached ? C.muted : '#fff',
                                            fontWeight: 600, fontSize: 13, border: `1px solid ${C.border}`, height: 38,
                                        }}>
                                        {selectedCall.coached ? '✓ Coached — Click to Undo' : '🎓 Mark as Coached'}
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