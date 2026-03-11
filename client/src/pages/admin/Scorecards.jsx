import axios from "axios";
import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";

import {
    Box, Flex, Text, Title, Button, Badge, Paper,
    Modal, Stack, TextInput, Select, Textarea, Switch,
    ActionIcon, Divider, Grid, Menu, Loader, Alert,
} from '@mantine/core'
import {
    IconPlus, IconEdit, IconTrash, IconDotsVertical,
    IconClipboardList, IconGripVertical, IconX, IconAlertCircle,
} from '@tabler/icons-react'

const BRAND = '#16a34a'
const API = import.meta.env.VITE_API_URL || 'http://localhost:8000/api'
const teamOptions = ['Operations', 'Finance', 'HR', 'Engineering', 'Support'].map(v => ({ value: v, label: v }))
const categoryOptions = ['Communication', 'Compliance', 'Product Knowledge', 'Process', 'General'].map(v => ({ value: v, label: v }))

const emptyForm = {
    name: '', description: '', team: '', active: true,
    criteria: [{ id: Date.now(), label: '', weight: '', category: '' }],
}

function CriteriaRow({ criterion, onChange, onRemove, showRemove, C }) {
    return (
        <Flex gap={10} align="flex-start">
            <IconGripVertical size={16} color={C.subtle} style={{ marginTop: 10, flexShrink: 0 }} />
            <TextInput
                placeholder="Criterion label"
                value={criterion.label}
                onChange={(e) => onChange({ ...criterion, label: e.target.value })}
                style={{ flex: 2 }}
                styles={{ input: { background: C.inputBg, border: `1px solid ${C.inputBorder}`, color: C.text, borderRadius: 8, height: 38, fontSize: 13 } }}
            />
            <TextInput
                placeholder="Pts"
                value={criterion.weight}
                onChange={(e) => onChange({ ...criterion, weight: e.target.value })}
                style={{ width: 80 }}
                styles={{ input: { background: C.inputBg, border: `1px solid ${C.inputBorder}`, color: C.text, borderRadius: 8, height: 38, fontSize: 13, textAlign: 'center' } }}
            />
            <Select
                placeholder="Category"
                data={categoryOptions}
                value={criterion.category}
                onChange={(v) => onChange({ ...criterion, category: v || '' })}
                style={{ width: 160 }}
                styles={{ input: { background: C.inputBg, border: `1px solid ${C.inputBorder}`, color: C.text, borderRadius: 8, height: 38, fontSize: 13 } }}
            />
            {showRemove && (
                <ActionIcon variant="subtle" color="red" radius={6} onClick={onRemove} style={{ marginTop: 4 }}>
                    <IconX size={14} />
                </ActionIcon>
            )}
        </Flex>
    )
}

export default function Scorecards() {
    const { C } = useOutletContext()
    const [scorecards, setScorecards] = useState([])
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState('')
    const [modalOpen, setModalOpen] = useState(false)
    const [editId, setEditId] = useState(null)
    const [form, setForm] = useState(emptyForm)
    const [viewCard, setViewCard] = useState(null)

    const token = localStorage.getItem('token')
    const headers = { Authorization: `Bearer ${token}` }

    // ── Fetch all scorecards ──
    const fetchScorecards = async () => {
        try {
            setLoading(true)
            const { data } = await axios.get(`${API}/scorecards`, { headers })
            setScorecards(data)
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to load scorecards')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => { fetchScorecards() }, [])

    const totalPoints = (criteria) => criteria.reduce((s, c) => s + (parseInt(c.weight) || 0), 0)

    const openCreate = () => {
        setEditId(null)
        setForm({ ...emptyForm, criteria: [{ id: Date.now(), label: '', weight: '', category: '' }] })
        setModalOpen(true)
    }

    const openEdit = (card) => {
        setEditId(card._id)
        setForm({
            name: card.name,
            description: card.description,
            team: card.team,
            active: card.active,
            criteria: card.criteria.map(c => ({ ...c, id: c._id || Date.now() })),
        })
        setModalOpen(true)
    }

    const handleSave = async () => {
        if (!form.name) return
        const payload = {
            ...form,
            criteria: form.criteria
                .filter(c => c.label)
                .map(({ label, weight, category }) => ({ label, weight: Number(weight) || 0, category })),
        }
        setSaving(true)
        try {
            if (editId) {
                const { data } = await axios.put(`${API}/scorecards/${editId}`, payload, { headers })
                setScorecards(p => p.map(c => c._id === editId ? data : c))
            } else {
                const { data } = await axios.post(`${API}/scorecards`, payload, { headers })
                setScorecards(p => [data, ...p])
            }
            setModalOpen(false)
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to save scorecard')
        } finally {
            setSaving(false)
        }
    }

    const handleDelete = async (id) => {
        try {
            await axios.delete(`${API}/scorecards/${id}`, { headers })
            setScorecards(p => p.filter(c => c._id !== id))
            if (viewCard?._id === id) setViewCard(null)
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to delete scorecard')
        }
    }

    const handleToggle = async (id) => {
        try {
            const { data } = await axios.patch(`${API}/scorecards/${id}/toggle`, {}, { headers })
            setScorecards(p => p.map(c => c._id === id ? data : c))
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update scorecard')
        }
    }

    const addCriterion = () => setForm(p => ({ ...p, criteria: [...p.criteria, { id: Date.now(), label: '', weight: '', category: '' }] }))
    const updateCriterion = (id, updated) => setForm(p => ({ ...p, criteria: p.criteria.map(c => c.id === id ? updated : c) }))
    const removeCriterion = (id) => setForm(p => ({ ...p, criteria: p.criteria.filter(c => c.id !== id) }))

    const inputStyles = {
        label: { fontSize: 13, fontWeight: 500, color: C.text, marginBottom: 6 },
        input: { background: C.inputBg, border: `1px solid ${C.inputBorder}`, color: C.text, borderRadius: 8, height: 42, fontSize: 14 },
    }

    const modalStyles = {
        content: { background: C.surface, border: `1px solid ${C.border}` },
        header: { background: C.surface, borderBottom: `1px solid ${C.border}` },
    }

    if (loading) return (
        <Box p="xl" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 300 }}>
            <Loader color="green" />
        </Box>
    )

    return (
        <Box>
            {error && (
                <Alert icon={<IconAlertCircle size={16} />} color="red" mb={16} onClose={() => setError('')} withCloseButton>
                    {error}
                </Alert>
            )}

            <Flex justify="space-between" align="flex-start" mb={24} style={{ flexWrap: 'wrap', gap: 12 }}>
                <Box>
                    <Title order={2} style={{ color: C.text, fontWeight: 700, fontSize: 22, letterSpacing: '-0.3px' }}>Scorecards</Title>
                    <Text style={{ color: C.muted, fontSize: 14, marginTop: 4 }}>Create and manage quality scorecards for call analysis</Text>
                </Box>
                <Button leftSection={<IconPlus size={15} />} radius={8} onClick={openCreate}
                    style={{ background: BRAND, color: '#fff', fontWeight: 600, fontSize: 14, border: 'none', height: 40 }}>
                    Create Scorecard
                </Button>
            </Flex>

            {scorecards.length === 0 ? (
                <Paper p={48} radius={12} style={{ border: `1px solid ${C.border}`, background: C.surface, textAlign: 'center' }}>
                    <IconClipboardList size={40} color={C.subtle} style={{ marginBottom: 12 }} />
                    <Text style={{ color: C.text, fontWeight: 600, marginBottom: 6 }}>No scorecards yet</Text>
                    <Text style={{ color: C.muted, fontSize: 14, marginBottom: 20 }}>Create your first scorecard to start scoring calls</Text>
                    <Button onClick={openCreate} style={{ background: BRAND, color: '#fff', border: 'none' }}>
                        Create Scorecard
                    </Button>
                </Paper>
            ) : (
                <Grid gutter={16}>
                    {scorecards.map((card) => (
                        <Grid.Col key={card._id} span={{ base: 12, sm: 6, lg: 4 }}>
                            <Paper p={20} radius={12} style={{
                                border: `1px solid ${C.border}`, background: C.surface,
                                boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
                                opacity: card.active ? 1 : 0.6,
                                transition: 'opacity 0.2s',
                            }}>
                                <Flex justify="space-between" align="flex-start" mb={12}>
                                    <Flex align="center" gap={10}>
                                        <Box style={{
                                            width: 36, height: 36, borderRadius: 9,
                                            background: '#f0fdf4', border: '1px solid #bbf7d0',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        }}>
                                            <IconClipboardList size={18} color={BRAND} />
                                        </Box>
                                        <Box>
                                            <Text style={{ fontWeight: 700, fontSize: 14, color: C.text, lineHeight: 1.3 }}>{card.name}</Text>
                                            {card.team && <Text style={{ fontSize: 11, color: C.subtle }}>{card.team}</Text>}
                                        </Box>
                                    </Flex>
                                    <Menu shadow="md" width={160} position="bottom-end">
                                        <Menu.Target>
                                            <ActionIcon variant="subtle" radius={6} style={{ color: C.muted }}>
                                                <IconDotsVertical size={15} />
                                            </ActionIcon>
                                        </Menu.Target>
                                        <Menu.Dropdown style={{ background: C.surface, border: `1px solid ${C.border}` }}>
                                            <Menu.Item leftSection={<IconEdit size={13} />} onClick={() => openEdit(card)}
                                                style={{ fontSize: 13, color: C.text }}>Edit</Menu.Item>
                                            <Menu.Item leftSection={<IconClipboardList size={13} />} onClick={() => setViewCard(card)}
                                                style={{ fontSize: 13, color: C.text }}>View Details</Menu.Item>
                                            <Menu.Divider />
                                            <Menu.Item leftSection={<IconTrash size={13} />} color="red" onClick={() => handleDelete(card._id)}
                                                style={{ fontSize: 13 }}>Delete</Menu.Item>
                                        </Menu.Dropdown>
                                    </Menu>
                                </Flex>

                                {card.description && (
                                    <Text style={{ fontSize: 12, color: C.muted, marginBottom: 12, lineHeight: 1.5 }}>{card.description}</Text>
                                )}

                                <Flex gap={8} mb={14} style={{ flexWrap: 'wrap' }}>
                                    <Badge radius={6} style={{ background: '#f0fdf4', color: BRAND, border: '1px solid #bbf7d0', fontSize: 11 }}>
                                        {card.criteria.length} criteria
                                    </Badge>
                                    <Badge radius={6} style={{ background: C.tableTh, color: C.muted, border: `1px solid ${C.border}`, fontSize: 11 }}>
                                        {totalPoints(card.criteria)} pts total
                                    </Badge>
                                </Flex>

                                <Divider style={{ borderColor: C.border, marginBottom: 12 }} />

                                <Flex justify="space-between" align="center">
                                    <Text style={{ fontSize: 12, color: C.subtle }}>
                                        {card.active ? 'Active' : 'Inactive'}
                                    </Text>
                                    <Switch
                                        checked={card.active}
                                        onChange={() => handleToggle(card._id)}
                                        color="green" size="sm"
                                    />
                                </Flex>
                            </Paper>
                        </Grid.Col>
                    ))}
                </Grid>
            )}

            {/* ── Create / Edit Modal ── */}
            <Modal
                opened={modalOpen}
                onClose={() => setModalOpen(false)}
                size="lg"
                title={<Text style={{ fontWeight: 700, fontSize: 16, color: C.text }}>{editId ? 'Edit Scorecard' : 'Create Scorecard'}</Text>}
                styles={modalStyles}
            >
                <Stack gap={16} pt={8}>
                    <Flex gap={12} style={{ flexWrap: 'wrap' }}>
                        <TextInput label="Scorecard Name" placeholder="e.g. Sales QA Scorecard"
                            value={form.name} onChange={(e) => setForm(p => ({ ...p, name: e.target.value }))}
                            style={{ flex: 1, minWidth: 200 }} styles={inputStyles} />
                        <Select label="Assign to Team" placeholder="Select team" data={teamOptions}
                            value={form.team} onChange={(v) => setForm(p => ({ ...p, team: v || '' }))}
                            style={{ minWidth: 160 }} styles={inputStyles} />
                    </Flex>
                    <Textarea label="Description" placeholder="Describe what this scorecard is used for"
                        value={form.description} onChange={(e) => setForm(p => ({ ...p, description: e.target.value }))}
                        minRows={2}
                        styles={{
                            label: { fontSize: 13, fontWeight: 500, color: C.text, marginBottom: 6 },
                            input: { background: C.inputBg, border: `1px solid ${C.inputBorder}`, color: C.text, borderRadius: 8, fontSize: 14 },
                        }} />
                    <Divider style={{ borderColor: C.border }} />
                    <Flex justify="space-between" align="center">
                        <Box>
                            <Text style={{ fontWeight: 600, fontSize: 14, color: C.text }}>Criteria</Text>
                            <Text style={{ fontSize: 12, color: C.subtle, marginTop: 2 }}>Total: {totalPoints(form.criteria)} points</Text>
                        </Box>
                        <Button size="xs" radius={6} leftSection={<IconPlus size={13} />} onClick={addCriterion}
                            style={{ background: '#f0fdf4', color: BRAND, border: '1px solid #bbf7d0', fontWeight: 600, fontSize: 12 }}>
                            Add Criterion
                        </Button>
                    </Flex>

                    <Stack gap={8}>
                        {form.criteria.map((c) => (
                            <CriteriaRow
                                key={c.id}
                                criterion={c}
                                onChange={(updated) => updateCriterion(c.id, updated)}
                                onRemove={() => removeCriterion(c.id)}
                                showRemove={form.criteria.length > 1}
                                C={C}
                            />
                        ))}
                    </Stack>

                    <Divider style={{ borderColor: C.border }} />
                    <Flex justify="space-between" align="center">
                        <Box>
                            <Text style={{ fontSize: 14, fontWeight: 500, color: C.text }}>Active</Text>
                            <Text style={{ fontSize: 12, color: C.subtle }}>Inactive scorecards won't appear when uploading calls</Text>
                        </Box>
                        <Switch checked={form.active} onChange={() => setForm(p => ({ ...p, active: !p.active }))} color="green" size="md" />
                    </Flex>

                    <Flex gap={10} justify="flex-end" mt={8}>
                        <Button variant="default" radius={8} onClick={() => setModalOpen(false)}
                            style={{ border: `1px solid ${C.border}`, color: C.text, background: C.surface }}>
                            Cancel
                        </Button>
                        <Button radius={8} loading={saving} onClick={handleSave}
                            style={{ background: BRAND, color: '#fff', border: 'none', fontWeight: 600 }}>
                            {editId ? 'Save Changes' : 'Create Scorecard'}
                        </Button>
                    </Flex>
                </Stack>
            </Modal>

            {/* ── View Details Modal ── */}
            {viewCard && (
                <Modal
                    opened={!!viewCard}
                    onClose={() => setViewCard(null)}
                    size="md"
                    title={<Text style={{ fontWeight: 700, fontSize: 16, color: C.text }}>{viewCard.name}</Text>}
                    styles={modalStyles}
                >
                    <Stack gap={12} pt={4}>
                        {viewCard.description && (
                            <Text style={{ fontSize: 13, color: C.muted }}>{viewCard.description}</Text>
                        )}
                        <Divider style={{ borderColor: C.border }} />
                        <Flex justify="space-between" mb={4}>
                            <Text style={{ fontSize: 12, fontWeight: 600, color: C.subtle, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Criterion</Text>
                            <Flex gap={40}>
                                <Text style={{ fontSize: 12, fontWeight: 600, color: C.subtle, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Pts</Text>
                                <Text style={{ fontSize: 12, fontWeight: 600, color: C.subtle, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Category</Text>
                            </Flex>
                        </Flex>
                        {viewCard.criteria.map((c, i) => (
                            <Flex key={i} justify="space-between" align="center" py={10}
                                style={{ borderTop: `1px solid ${C.border}` }}>
                                <Text style={{ fontSize: 13, color: C.text, fontWeight: 500 }}>{c.label}</Text>
                                <Flex gap={40} align="center">
                                    <Text style={{ fontSize: 13, fontWeight: 700, color: BRAND, minWidth: 24, textAlign: 'right' }}>{c.weight}</Text>
                                    <Badge radius={6} style={{ background: C.tableTh, color: C.muted, border: `1px solid ${C.border}`, fontSize: 11, minWidth: 100, textAlign: 'center' }}>
                                        {c.category}
                                    </Badge>
                                </Flex>
                            </Flex>
                        ))}
                        <Divider style={{ borderColor: C.border }} />
                        <Flex justify="space-between">
                            <Text style={{ fontSize: 13, fontWeight: 700, color: C.text }}>Total</Text>
                            <Text style={{ fontSize: 13, fontWeight: 700, color: BRAND }}>{totalPoints(viewCard.criteria)} pts</Text>
                        </Flex>
                    </Stack>
                </Modal>
            )}
        </Box>
    )
}
