import { useState } from "react";
import { useOutletContext } from "react-router-dom";

import {
    Box, Flex, Text, Title, Button, Badge, Paper,
    Modal, Stack, TextInput, Select, Textarea, Switch,
    ActionIcon, Divider, Grid, Menu,
} from '@mantine/core'
import {
    IconPlus, IconEdit, IconTrash, IconDotsVertical,
    IconClipboardList, IconGripVertical, IconX,
} from '@tabler/icons-react'

const BRAND = '#16a34a'
const teamOptions = ['Operations', 'Finance', 'HR', 'Engineering', 'Support'].map(v => ({ value: v, label: v }))
const categoryOptions = ['Communication', 'Compliance', 'Product Knowledge', 'Process', 'General'].map(v => ({ value: v, label: v }))

const initialScorecards = [
    {
        id: 1, name: 'Sales QA Scorecard', description: 'Used for evaluating outbound sales calls',
        team: 'Operations', active: true,
        criteria: [
            { id: 1, label: 'Proper Greeting', weight: 10, category: 'Communication' },
            { id: 2, label: 'Needs Discovery', weight: 20, category: 'Process' },
            { id: 3, label: 'Product Knowledge', weight: 25, category: 'Product Knowledge' },
            { id: 4, label: 'Objection Handling', weight: 25, category: 'Process' },
            { id: 5, label: 'Closing Technique', weight: 20, category: 'Process' },
        ],
    },
    {
        id: 2, name: 'Support QA Scorecard', description: 'Standard scorecard for customer support calls',
        team: 'Support', active: true,
        criteria: [
            { id: 1, label: 'Empathy & Tone', weight: 20, category: 'Communication' },
            { id: 2, label: 'Issue Resolution', weight: 40, category: 'Process' },
            { id: 3, label: 'Compliance Check', weight: 20, category: 'Compliance' },
            { id: 4, label: 'Call Closing', weight: 20, category: 'Communication' },
        ],
    },
    {
        id: 3, name: 'Onboarding QA', description: 'For new customer onboarding calls',
        team: 'HR', active: false,
        criteria: [
            { id: 1, label: 'Welcome & Intro', weight: 15, category: 'Communication' },
            { id: 2, label: 'Product Walkthrough', weight: 50, category: 'Product Knowledge' },
            { id: 3, label: 'Next Steps Clarity', weight: 35, category: 'Process' },
        ],
    },
]

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
    const [scorecards, setScorecards] = useState(initialScorecards)
    const [modalOpen, setModalOpen] = useState(false)
    const [editId, setEditId] = useState(null)
    const [form, setForm] = useState(emptyForm)
    const [viewCard, setViewCard] = useState(null)

    const totalPoints = (criteria) => criteria.reduce((s, c) => s + (parseInt(c.weight) || 0), 0)

    const openCreate = () => {
        setEditId(null)
        setForm({ ...emptyForm, criteria: [{ id: Date.now(), label: '', weight: '', category: '' }] })
        setModalOpen(true)
    }

    const openEdit = (card) => {
        setEditId(card.id)
        setForm({ name: card.name, description: card.description, team: card.team, active: card.active, criteria: card.criteria.map(c => ({ ...c })) })
        setModalOpen(true)
    }

    const handleSave = () => {
        if (!form.name) return
        if (editId) setScorecards(p => p.map(c => c.id === editId ? { ...c, ...form } : c))
        else setScorecards(p => [...p, { id: Date.now(), ...form }])
        setModalOpen(false)
    }

    const handleDelete = (id) => setScorecards(p => p.filter(c => c.id !== id))
    const handleToggle = (id) => setScorecards(p => p.map(c => c.id === id ? { ...c, active: !c.active } : c))
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

    return (
        <Box>
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

            <Grid gutter={16}>
                {scorecards.map((card) => (
                    <Grid.Col key={card.id} span={{ base: 12, sm: 6, lg: 4 }}>
                        <Paper p={20} radius={12} style={{
                            border: `1px solid ${C.border}`, background: C.surface,
                            boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
                            opacity: card.active ? 1 : 0.6, cursor: 'pointer', transition: 'box-shadow 0.15s',
                        }}
                            onClick={() => setViewCard(card)}
                            onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.12)'}
                            onMouseLeave={(e) => e.currentTarget.style.boxShadow = '0 1px 4px rgba(0,0,0,0.04)'}
                        >
                            <Flex justify="space-between" align="flex-start" mb={12}>
                                <Flex align="center" gap={10}>
                                    <Box style={{
                                        width: 36, height: 36, borderRadius: 9, background: '#f0fdf4',
                                        border: '1px solid #bbf7d0', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                                    }}>
                                        <IconClipboardList size={18} color={BRAND} />
                                    </Box>
                                    <Box>
                                        <Text style={{ fontWeight: 700, fontSize: 14, color: C.text, lineHeight: 1.3 }}>{card.name}</Text>
                                        <Text style={{ fontSize: 11, color: C.subtle, marginTop: 2 }}>{card.team}</Text>
                                    </Box>
                                </Flex>
                                <Menu shadow="md" width={150} position="bottom-end" withinPortal>
                                    <Menu.Target>
                                        <ActionIcon variant="subtle" color="gray" radius={6} onClick={(e) => e.stopPropagation()}>
                                            <IconDotsVertical size={15} />
                                        </ActionIcon>
                                    </Menu.Target>
                                    <Menu.Dropdown style={{ borderRadius: 10, background: C.surface, border: `1px solid ${C.border}` }} onClick={(e) => e.stopPropagation()}>
                                        <Menu.Item leftSection={<IconEdit size={14} />} style={{ fontSize: 13, color: C.text }} onClick={() => openEdit(card)}>Edit</Menu.Item>
                                        <Divider style={{ borderColor: C.border }} />
                                        <Menu.Item color="red" leftSection={<IconTrash size={14} />} style={{ fontSize: 13 }} onClick={() => handleDelete(card.id)}>Delete</Menu.Item>
                                    </Menu.Dropdown>
                                </Menu>
                            </Flex>

                            <Text style={{ fontSize: 13, color: C.muted, marginBottom: 16, lineHeight: 1.5 }}>
                                {card.description || 'No description'}
                            </Text>

                            <Divider style={{ borderColor: C.border, marginBottom: 14 }} />

                            <Flex justify="space-between" align="center" mb={14}>
                                <Flex gap={16}>
                                    <Box>
                                        <Text style={{ fontSize: 11, color: C.subtle }}>Criteria</Text>
                                        <Text style={{ fontSize: 16, fontWeight: 700, color: C.text }}>{card.criteria.length}</Text>
                                    </Box>
                                    <Box>
                                        <Text style={{ fontSize: 11, color: C.subtle }}>Total Points</Text>
                                        <Text style={{ fontSize: 16, fontWeight: 700, color: C.text }}>{totalPoints(card.criteria)}</Text>
                                    </Box>
                                </Flex>
                                <Badge radius={6} style={{
                                    background: card.active ? '#f0fdf4' : C.hover,
                                    color: card.active ? BRAND : C.subtle,
                                    border: `1px solid ${card.active ? '#bbf7d0' : C.border}`,
                                    fontWeight: 600, fontSize: 11,
                                }}>
                                    {card.active ? 'Active' : 'Inactive'}
                                </Badge>
                            </Flex>

                            <Flex align="center" justify="space-between" pt={12}
                                style={{ borderTop: `1px solid ${C.border}` }} onClick={(e) => e.stopPropagation()}>
                                <Text style={{ fontSize: 13, color: C.muted }}>{card.active ? 'Disable scorecard' : 'Enable scorecard'}</Text>
                                <Switch checked={card.active} onChange={() => handleToggle(card.id)} color="green" size="sm" />
                            </Flex>
                        </Paper>
                    </Grid.Col>
                ))}
            </Grid>

            {/* View Modal */}
            {viewCard && (
                <Modal opened={!!viewCard} onClose={() => setViewCard(null)} size="lg" centered radius={12}
                    overlayProps={{ blur: 2 }} styles={modalStyles}
                    title={
                        <Flex align="center" gap={10}>
                            <IconClipboardList size={18} color={BRAND} />
                            <Text style={{ fontWeight: 700, fontSize: 16, color: C.text }}>{viewCard.name}</Text>
                        </Flex>
                    }
                >
                    <Stack gap={16}>
                        <Flex gap={10} wrap="wrap">
                            <Badge style={{ background: '#f0fdf4', color: BRAND, border: '1px solid #bbf7d0', fontWeight: 600 }}>{viewCard.team}</Badge>
                            <Badge style={{ background: '#eff6ff', color: '#2563eb', border: '1px solid #bfdbfe', fontWeight: 600 }}>{viewCard.criteria.length} criteria</Badge>
                            <Badge style={{ background: '#f5f3ff', color: '#7c3aed', border: '1px solid #ddd6fe', fontWeight: 600 }}>{totalPoints(viewCard.criteria)} pts</Badge>
                        </Flex>
                        <Text style={{ fontSize: 13, color: C.muted }}>{viewCard.description}</Text>
                        <Divider style={{ borderColor: C.border }} />
                        <Text style={{ fontWeight: 600, fontSize: 14, color: C.text }}>Criteria Breakdown</Text>
                        <Stack gap={8}>
                            {viewCard.criteria.map((c, i) => (
                                <Flex key={c.id} justify="space-between" align="center" p={12}
                                    style={{ background: C.hover, border: `1px solid ${C.border}`, borderRadius: 8 }}>
                                    <Flex align="center" gap={10}>
                                        <Text style={{ fontSize: 11, color: C.subtle, fontWeight: 600, width: 20 }}>{i + 1}.</Text>
                                        <Box>
                                            <Text style={{ fontSize: 13, fontWeight: 600, color: C.text }}>{c.label}</Text>
                                            <Text style={{ fontSize: 11, color: C.subtle }}>{c.category}</Text>
                                        </Box>
                                    </Flex>
                                    <Badge radius={6} style={{ background: '#f0fdf4', color: BRAND, border: '1px solid #bbf7d0', fontWeight: 700, fontSize: 13 }}>
                                        {c.weight} pts
                                    </Badge>
                                </Flex>
                            ))}
                        </Stack>
                    </Stack>
                </Modal>
            )}

            {/* Create/Edit Modal */}
            <Modal opened={modalOpen} onClose={() => setModalOpen(false)} size="xl" centered radius={12}
                overlayProps={{ blur: 2 }} styles={modalStyles}
                title={<Text style={{ fontWeight: 700, fontSize: 16, color: C.text }}>{editId ? 'Edit Scorecard' : 'Create Scorecard'}</Text>}
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
                    <Flex gap={10} px={24}>
                        {['Label', 'Points', 'Category'].map(h => (
                            <Text key={h} style={{ fontSize: 11, color: C.subtle, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', flex: h === 'Label' ? 2 : h === 'Points' ? undefined : undefined, width: h === 'Points' ? 80 : h === 'Category' ? 160 : undefined }}>
                                {h}
                            </Text>
                        ))}
                    </Flex>
                    <Stack gap={8}>
                        {form.criteria.map((c) => (
                            <CriteriaRow key={c.id} criterion={c} C={C}
                                onChange={(updated) => updateCriterion(c.id, updated)}
                                onRemove={() => removeCriterion(c.id)}
                                showRemove={form.criteria.length > 1}
                            />
                        ))}
                    </Stack>
                    <Divider style={{ borderColor: C.border }} />
                    <Flex justify="space-between" align="center">
                        <Flex align="center" gap={8}>
                            <Switch checked={form.active} onChange={() => setForm(p => ({ ...p, active: !p.active }))} color="green" size="sm" />
                            <Text style={{ fontSize: 13, color: C.text }}>Active</Text>
                        </Flex>
                        <Flex gap={10}>
                            <Button variant="default" radius={8} onClick={() => setModalOpen(false)}
                                style={{ border: `1px solid ${C.inputBorder}`, color: C.text, fontWeight: 500 }}>Cancel</Button>
                            <Button radius={8} onClick={handleSave}
                                style={{ background: BRAND, color: '#fff', fontWeight: 600, border: 'none' }}>
                                {editId ? 'Save Changes' : 'Create Scorecard'}
                            </Button>
                        </Flex>
                    </Flex>
                </Stack>
            </Modal>
        </Box>
    )
}