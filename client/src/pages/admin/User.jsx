import { IconDotsVertical, IconEdit, IconPlus, IconSearch, IconTrash, IconUserOff } from "@tabler/icons-react";
import { useState } from "react";
import { useOutletContext } from "react-router-dom";

import {
    Box, Flex, Text, Title, Button, Badge, Paper,
    Modal, Stack, TextInput, Select, Switch, ActionIcon, Menu, Divider,
} from '@mantine/core'

const BRAND = '#16a34a'

const initialUsers = [
    { id: 1, name: 'Sarah Johnson', email: 'sarah@acme.com', role: 'agent', team: 'Operations', lastLogin: 'Mar 10, 2025', active: true },
    { id: 2, name: 'James Miller', email: 'james@acme.com', role: 'agent', team: 'Operations', lastLogin: 'Mar 10, 2025', active: true },
    { id: 3, name: 'Emily Chen', email: 'emily@acme.com', role: 'agent', team: 'Support', lastLogin: 'Mar 9, 2025', active: true },
    { id: 4, name: 'Carlos Rivera', email: 'carlos@acme.com', role: 'agent', team: 'Support', lastLogin: 'Mar 9, 2025', active: false },
    { id: 5, name: 'Aisha Khan', email: 'aisha@acme.com', role: 'admin', team: 'HR', lastLogin: 'Mar 8, 2025', active: true },
]

const avatarColor = (name) => {
    const colors = [BRAND, '#2563eb', '#7c3aed', '#ea580c', '#0891b2', '#db2777']
    return colors[name.charCodeAt(0) % colors.length]
}

const emptyForm = { name: '', email: '', role: 'agent', team: '' }

export default function User() {
    const { C } = useOutletContext()
    const [users, setUsers] = useState(initialUsers)
    const [search, setSearch] = useState('')
    const [roleFilter, setRoleFilter] = useState('')
    const [statusFilter, setStatusFilter] = useState('')
    const [modalOpen, setModalOpen] = useState(false)
    const [editId, setEditId] = useState(null)
    const [form, setForm] = useState(emptyForm)

    const filtered = users.filter(u => {
        const q = search.toLowerCase()
        const matchSearch = !q || u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)
        const matchRole = !roleFilter || u.role === roleFilter
        const matchStatus = !statusFilter || (statusFilter === 'active' ? u.active : !u.active)
        return matchSearch && matchRole && matchStatus
    })

    const openCreate = () => { setEditId(null); setForm(emptyForm); setModalOpen(true) }
    const openEdit = (u) => { setEditId(u.id); setForm({ name: u.name, email: u.email, role: u.role, team: u.team }); setModalOpen(true) }
    const handleSave = () => {
        if (!form.name || !form.email) return
        if (editId) setUsers(p => p.map(u => u.id === editId ? { ...u, ...form } : u))
        else setUsers(p => [...p, { id: Date.now(), ...form, lastLogin: 'Never', active: true }])
        setModalOpen(false)
    }
    const handleDelete = (id) => setUsers(p => p.filter(u => u.id !== id))
    const handleToggle = (id) => setUsers(p => p.map(u => u.id === id ? { ...u, active: !u.active } : u))

    const inputStyles = {
        label: { fontSize: 13, fontWeight: 500, color: C.text, marginBottom: 6 },
        input: { background: C.inputBg, border: `1px solid ${C.inputBorder}`, color: C.text, borderRadius: 8, height: 42, fontSize: 14 },
    }

    const thStyle = {
        fontSize: 11, color: C.subtle, fontWeight: 600,
        textTransform: 'uppercase', letterSpacing: '0.05em',
        padding: '10px 16px', textAlign: 'left', background: C.tableTh,
    }
    const tdStyle = { padding: '14px 16px', borderTop: `1px solid ${C.border}` }

    return (
        <Box>
            <Flex justify="space-between" align="flex-start" mb={24} style={{ flexWrap: 'wrap', gap: 12 }}>
                <Box>
                    <Title order={2} style={{ color: C.text, fontWeight: 700, fontSize: 22, letterSpacing: '-0.3px' }}>Users</Title>
                    <Text style={{ color: C.muted, fontSize: 14, marginTop: 4 }}>Manage agents and admin accounts</Text>
                </Box>
                <Button leftSection={<IconPlus size={15} />} radius={8} onClick={openCreate}
                    style={{ background: BRAND, color: '#fff', fontWeight: 600, fontSize: 14, border: 'none', height: 40 }}>
                    Invite User
                </Button>
            </Flex>

            {/* Filters */}
            <Paper p={16} radius={10} mb={16} style={{ border: `1px solid ${C.border}`, background: C.surface, boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
                <Flex gap={12} style={{ flexWrap: 'wrap' }}>
                    <TextInput placeholder="Search users..." value={search} onChange={(e) => setSearch(e.target.value)}
                        leftSection={<IconSearch size={15} color={C.subtle} />} style={{ flex: '1 1 200px' }}
                        styles={{ input: { background: C.inputBg, border: `1px solid ${C.inputBorder}`, color: C.text, borderRadius: 8, height: 38 } }} />
                    <Select placeholder="All Roles" data={[{ value: 'admin', label: 'Admin' }, { value: 'agent', label: 'Agent' }]}
                        value={roleFilter} onChange={(v) => setRoleFilter(v || '')} clearable style={{ minWidth: 130 }}
                        styles={{ input: { background: C.inputBg, border: `1px solid ${C.inputBorder}`, color: C.text, borderRadius: 8, height: 38 } }} />
                    <Select placeholder="All Status" data={[{ value: 'active', label: 'Active' }, { value: 'inactive', label: 'Inactive' }]}
                        value={statusFilter} onChange={(v) => setStatusFilter(v || '')} clearable style={{ minWidth: 130 }}
                        styles={{ input: { background: C.inputBg, border: `1px solid ${C.inputBorder}`, color: C.text, borderRadius: 8, height: 38 } }} />
                </Flex>
            </Paper>

            {/* Table */}
            <Paper radius={12} style={{ border: `1px solid ${C.border}`, background: C.surface, overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr>
                            {['Name', 'Role', 'Team', 'Last Login', 'Status', 'Actions'].map(h => (
                                <th key={h} style={thStyle}>{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.map((u) => {
                            const color = avatarColor(u.name)
                            return (
                                <tr key={u.id}
                                    onMouseEnter={(e) => e.currentTarget.style.background = C.hover}
                                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                                >
                                    <td style={tdStyle}>
                                        <Flex align="center" gap={10}>
                                            <Box style={{
                                                width: 32, height: 32, borderRadius: '50%',
                                                background: color + '20', border: `1.5px solid ${color}40`,
                                                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                                            }}>
                                                <Text style={{ fontSize: 11, fontWeight: 700, color }}>{u.name.slice(0, 2).toUpperCase()}</Text>
                                            </Box>
                                            <Box>
                                                <Text style={{ fontSize: 13, fontWeight: 600, color: C.text }}>{u.name}</Text>
                                                <Text style={{ fontSize: 11, color: C.subtle }}>{u.email}</Text>
                                            </Box>
                                        </Flex>
                                    </td>
                                    <td style={tdStyle}>
                                        <Badge radius={6} style={{
                                            background: u.role === 'admin' ? '#eff6ff' : '#f5f3ff',
                                            color: u.role === 'admin' ? '#2563eb' : '#7c3aed',
                                            border: `1px solid ${u.role === 'admin' ? '#bfdbfe' : '#ddd6fe'}`,
                                            fontWeight: 600, fontSize: 11, textTransform: 'capitalize',
                                        }}>{u.role}</Badge>
                                    </td>
                                    <td style={tdStyle}><Text style={{ fontSize: 13, color: C.muted }}>{u.team}</Text></td>
                                    <td style={tdStyle}><Text style={{ fontSize: 13, color: C.subtle }}>{u.lastLogin}</Text></td>
                                    <td style={tdStyle}>
                                        <Flex align="center" gap={8}>
                                            <Switch checked={u.active} onChange={() => handleToggle(u.id)} color="green" size="sm" />
                                            <Badge radius={6} style={{
                                                background: u.active ? '#f0fdf4' : C.hover,
                                                color: u.active ? BRAND : C.subtle,
                                                border: `1px solid ${u.active ? '#bbf7d0' : C.border}`,
                                                fontWeight: 600, fontSize: 11,
                                            }}>{u.active ? 'Active' : 'Inactive'}</Badge>
                                        </Flex>
                                    </td>
                                    <td style={tdStyle}>
                                        <Menu shadow="md" width={150} position="bottom-end" withinPortal>
                                            <Menu.Target>
                                                <ActionIcon variant="subtle" color="gray" radius={6}><IconDotsVertical size={15} /></ActionIcon>
                                            </Menu.Target>
                                            <Menu.Dropdown style={{ borderRadius: 10, background: C.surface, border: `1px solid ${C.border}` }}>
                                                <Menu.Item leftSection={<IconEdit size={14} />} style={{ fontSize: 13, color: C.text }} onClick={() => openEdit(u)}>Edit</Menu.Item>
                                                <Menu.Item leftSection={<IconUserOff size={14} />} style={{ fontSize: 13, color: C.text }} onClick={() => handleToggle(u.id)}>
                                                    {u.active ? 'Deactivate' : 'Activate'}
                                                </Menu.Item>
                                                <Divider style={{ borderColor: C.border }} />
                                                <Menu.Item color="red" leftSection={<IconTrash size={14} />} style={{ fontSize: 13 }} onClick={() => handleDelete(u.id)}>Delete</Menu.Item>
                                            </Menu.Dropdown>
                                        </Menu>
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </Paper>

            {/* Modal */}
            <Modal opened={modalOpen} onClose={() => setModalOpen(false)} centered radius={12} size="md"
                overlayProps={{ blur: 2 }}
                title={<Text style={{ fontWeight: 700, fontSize: 16, color: C.text }}>{editId ? 'Edit User' : 'Invite User'}</Text>}
                styles={{
                    content: { background: C.surface, border: `1px solid ${C.border}` },
                    header: { background: C.surface, borderBottom: `1px solid ${C.border}` },
                }}
            >
                <Stack gap={14} pt={8}>
                    <TextInput label="Full Name" placeholder="e.g. Sarah Johnson" value={form.name}
                        onChange={(e) => setForm(p => ({ ...p, name: e.target.value }))} styles={inputStyles} />
                    <TextInput label="Email" placeholder="email@company.com" value={form.email}
                        onChange={(e) => setForm(p => ({ ...p, email: e.target.value }))} styles={inputStyles} />
                    <Flex gap={12}>
                        <Select label="Role" data={[{ value: 'agent', label: 'Agent' }, { value: 'admin', label: 'Admin' }]}
                            value={form.role} onChange={(v) => setForm(p => ({ ...p, role: v || 'agent' }))}
                            style={{ flex: 1 }} styles={inputStyles} />
                        <Select label="Team" data={['Operations', 'Support', 'HR', 'Finance'].map(v => ({ value: v, label: v }))}
                            value={form.team} onChange={(v) => setForm(p => ({ ...p, team: v || '' }))}
                            style={{ flex: 1 }} styles={inputStyles} />
                    </Flex>
                    <Flex gap={10} justify="flex-end" mt={4}>
                        <Button variant="default" radius={8} onClick={() => setModalOpen(false)}
                            style={{ border: `1px solid ${C.inputBorder}`, color: C.text, fontWeight: 500 }}>Cancel</Button>
                        <Button radius={8} onClick={handleSave}
                            style={{ background: BRAND, color: '#fff', fontWeight: 600, border: 'none' }}>
                            {editId ? 'Save Changes' : 'Send Invite'}
                        </Button>
                    </Flex>
                </Stack>
            </Modal>
        </Box>
    )
}