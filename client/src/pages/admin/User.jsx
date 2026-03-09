import { useMemo, useState } from "react";

import {
    Box, Flex, Text, Title, Button, TextInput, Select,
    Badge, Table, Avatar, Switch, Menu, ActionIcon,
    Modal, Stack, Group, ScrollArea, Paper, Divider,
} from '@mantine/core'
import {
    IconPlus, IconSearch, IconDotsVertical,
    IconEdit, IconTrash, IconUserOff, IconMailPlus,
} from '@tabler/icons-react'

const BRAND = '#16a34a'

const initialUsers = [
    { id: 1, name: 'Ava Thompson', email: 'ava.thompson@example.com', role: 'Admin', team: 'Operations', lastLogin: 'Mar 10, 2026', status: true },
    { id: 2, name: 'Noah Williams', email: 'noah.williams@example.com', role: 'User', team: 'Finance', lastLogin: 'Mar 9, 2026', status: true },
    { id: 3, name: 'Sophia Martinez', email: 'sophia.martinez@example.com', role: 'User', team: 'HR', lastLogin: 'Mar 7, 2026', status: false },
    { id: 4, name: 'Liam Brown', email: 'liam.brown@example.com', role: 'Admin', team: 'Engineering', lastLogin: 'Mar 10, 2026', status: true },
    { id: 5, name: 'Emily Chen', email: 'emily.chen@example.com', role: 'User', team: 'Support', lastLogin: 'Mar 8, 2026', status: true },
]

const teamOptions = ['Operations', 'Finance', 'HR', 'Engineering', 'Support'].map(v => ({ value: v, label: v }))
const roleOptions = ['User', 'Admin'].map(v => ({ value: v, label: v }))
const emptyForm = { name: '', email: '', role: 'User', team: '' }

function getInitials(name) {
    return name.split(' ').filter(Boolean).slice(0, 2).map(p => p[0]?.toUpperCase()).join('')
}

function avatarColor(name) {
    const colors = ['#16a34a', '#2563eb', '#7c3aed', '#db2777', '#ea580c']
    const i = name.charCodeAt(0) % colors.length
    return colors[i]
}

function UserModal({ opened, onClose, title, form, setForm, onSubmit, submitLabel }) {
    return (
        <Modal
            opened={opened}
            onClose={onClose}
            title={<Text style={{ fontWeight: 700, fontSize: 16, color: '#111827' }}>{title}</Text>}
            centered
            radius={12}
            overlayProps={{ blur: 2 }}
            styles={{
                content: { border: '1px solid #f3f4f6' },
                header: { borderBottom: '1px solid #f3f4f6', paddingBottom: 16 },
            }}
        >
            <Stack gap={16} pt={8}>
                <TextInput
                    label="Full Name"
                    placeholder="Enter full name"
                    value={form.name}
                    onChange={(e) => setForm(p => ({ ...p, name: e.target.value }))}
                    styles={{
                        label: { fontSize: 13, fontWeight: 500, color: '#374151', marginBottom: 6 },
                        input: { borderRadius: 8, border: '1px solid #e5e7eb', height: 42, fontSize: 14, '&:focus': { borderColor: BRAND } },
                    }}
                />
                <TextInput
                    label="Email Address"
                    placeholder="Enter email"
                    value={form.email}
                    onChange={(e) => setForm(p => ({ ...p, email: e.target.value }))}
                    styles={{
                        label: { fontSize: 13, fontWeight: 500, color: '#374151', marginBottom: 6 },
                        input: { borderRadius: 8, border: '1px solid #e5e7eb', height: 42, fontSize: 14, '&:focus': { borderColor: BRAND } },
                    }}
                />
                <Select
                    label="Role"
                    data={roleOptions}
                    value={form.role}
                    onChange={(v) => setForm(p => ({ ...p, role: v || 'User' }))}
                    allowDeselect={false}
                    styles={{
                        label: { fontSize: 13, fontWeight: 500, color: '#374151', marginBottom: 6 },
                        input: { borderRadius: 8, border: '1px solid #e5e7eb', height: 42, fontSize: 14 },
                    }}
                />
                <Select
                    label="Team"
                    placeholder="Select team"
                    data={teamOptions}
                    value={form.team}
                    onChange={(v) => setForm(p => ({ ...p, team: v || '' }))}
                    styles={{
                        label: { fontSize: 13, fontWeight: 500, color: '#374151', marginBottom: 6 },
                        input: { borderRadius: 8, border: '1px solid #e5e7eb', height: 42, fontSize: 14 },
                    }}
                />
                <Flex justify="flex-end" gap={10} mt={8}>
                    <Button
                        variant="default"
                        radius={8}
                        onClick={onClose}
                        style={{ border: '1px solid #e5e7eb', color: '#374151', fontWeight: 500 }}
                    >
                        Cancel
                    </Button>
                    <Button
                        radius={8}
                        leftSection={<IconMailPlus size={15} />}
                        onClick={onSubmit}
                        style={{ background: BRAND, color: '#fff', fontWeight: 600, border: 'none' }}
                    >
                        {submitLabel}
                    </Button>
                </Flex>
            </Stack>
        </Modal>
    )
}

export default function UsersPage() {
    const [users, setUsers] = useState(initialUsers)
    const [search, setSearch] = useState('')
    const [roleFilter, setRoleFilter] = useState('All')
    const [statusFilter, setStatusFilter] = useState('All')
    const [inviteOpen, setInviteOpen] = useState(false)
    const [editOpen, setEditOpen] = useState(false)
    const [inviteForm, setInviteForm] = useState(emptyForm)
    const [editForm, setEditForm] = useState(emptyForm)
    const [editId, setEditId] = useState(null)

    const filtered = useMemo(() => users.filter(u => {
        const matchSearch = u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase())
        const matchRole = roleFilter === 'All' || u.role === roleFilter
        const matchStatus = statusFilter === 'All' || (statusFilter === 'Active' ? u.status : !u.status)
        return matchSearch && matchRole && matchStatus
    }), [users, search, roleFilter, statusFilter])

    const handleInvite = () => {
        if (!inviteForm.name || !inviteForm.email) return
        setUsers(p => [{ id: Date.now(), ...inviteForm, status: true, lastLogin: 'Never', avatar: '' }, ...p])
        setInviteForm(emptyForm)
        setInviteOpen(false)
    }

    const handleEdit = (user) => {
        setEditId(user.id)
        setEditForm({ name: user.name, email: user.email, role: user.role, team: user.team })
        setEditOpen(true)
    }

    const handleSave = () => {
        setUsers(p => p.map(u => u.id === editId ? { ...u, ...editForm } : u))
        setEditOpen(false)
        setEditId(null)
        setEditForm(emptyForm)
    }

    const toggleStatus = (id) => setUsers(p => p.map(u => u.id === id ? { ...u, status: !u.status } : u))
    const deactivate = (id) => setUsers(p => p.map(u => u.id === id ? { ...u, status: false } : u))
    const deleteUser = (id) => setUsers(p => p.filter(u => u.id !== id))

    return (
        <Box>
            {/* Header */}
            <Flex
                justify="space-between"
                align="flex-start"
                mb={24}
                style={{ flexWrap: 'wrap', gap: 12 }}
            >
                <Box>
                    <Title order={2} style={{ color: '#111827', fontWeight: 700, fontSize: 22, letterSpacing: '-0.3px' }}>
                        Users
                    </Title>
                    <Text style={{ color: '#6b7280', fontSize: 14, marginTop: 4 }}>
                        Manage team members, roles and account status
                    </Text>
                </Box>
                <Button
                    leftSection={<IconPlus size={15} />}
                    radius={8}
                    onClick={() => setInviteOpen(true)}
                    style={{
                        background: BRAND, color: '#fff',
                        fontWeight: 600, fontSize: 14,
                        border: 'none', height: 40,
                        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                    }}
                >
                    Invite User
                </Button>
            </Flex>

            {/* Filters */}
            <Paper
                p={16}
                radius={12}
                mb={16}
                style={{ border: '1px solid #f3f4f6', background: '#fff', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}
            >
                <Flex gap={12} style={{ flexWrap: 'wrap' }}>
                    <TextInput
                        placeholder="Search by name or email..."
                        leftSection={<IconSearch size={15} color="#9ca3af" />}
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        style={{ flex: 2, minWidth: 200 }}
                        styles={{
                            input: { borderRadius: 8, border: '1px solid #e5e7eb', height: 38, fontSize: 14, '&:focus': { borderColor: BRAND } },
                        }}
                    />
                    <Select
                        placeholder="All Roles"
                        data={[{ value: 'All', label: 'All Roles' }, ...roleOptions]}
                        value={roleFilter}
                        onChange={(v) => setRoleFilter(v || 'All')}
                        allowDeselect={false}
                        style={{ minWidth: 130 }}
                        styles={{
                            input: { borderRadius: 8, border: '1px solid #e5e7eb', height: 38, fontSize: 14 },
                        }}
                    />
                    <Select
                        placeholder="All Statuses"
                        data={[
                            { value: 'All', label: 'All Statuses' },
                            { value: 'Active', label: 'Active' },
                            { value: 'Inactive', label: 'Inactive' },
                        ]}
                        value={statusFilter}
                        onChange={(v) => setStatusFilter(v || 'All')}
                        allowDeselect={false}
                        style={{ minWidth: 140 }}
                        styles={{
                            input: { borderRadius: 8, border: '1px solid #e5e7eb', height: 38, fontSize: 14 },
                        }}
                    />
                </Flex>
            </Paper>

            {/* Table */}
            <Paper
                radius={12}
                style={{
                    border: '1px solid #f3f4f6',
                    background: '#fff',
                    boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
                    overflow: 'hidden',
                }}
            >
                {/* Table Header */}
                <Flex
                    justify="space-between"
                    align="center"
                    px={20}
                    py={14}
                    style={{ borderBottom: '1px solid #f3f4f6' }}
                >
                    <Text style={{ fontWeight: 600, fontSize: 15, color: '#111827' }}>
                        All Users
                    </Text>
                    <Badge
                        radius={6}
                        style={{
                            background: '#f0fdf4', color: BRAND,
                            border: '1px solid #bbf7d0',
                            fontWeight: 600, fontSize: 12,
                        }}
                    >
                        {filtered.length} records
                    </Badge>
                </Flex>

                <ScrollArea>
                    <Table highlightOnHover style={{ minWidth: 800 }}>
                        <Table.Thead>
                            <Table.Tr style={{ background: '#f9fafb' }}>
                                {['Name', 'Email', 'Role', 'Team', 'Last Login', 'Status', ''].map((h) => (
                                    <Table.Th
                                        key={h}
                                        style={{
                                            fontSize: 12, color: '#6b7280', fontWeight: 600,
                                            textTransform: 'uppercase', letterSpacing: '0.05em',
                                            padding: '11px 20px',
                                        }}
                                    >
                                        {h}
                                    </Table.Th>
                                ))}
                            </Table.Tr>
                        </Table.Thead>
                        <Table.Tbody>
                            {filtered.length === 0 ? (
                                <Table.Tr>
                                    <Table.Td colSpan={7}>
                                        <Flex direction="column" align="center" py={40} gap={6}>
                                            <Text style={{ fontWeight: 600, color: '#374151' }}>No users found</Text>
                                            <Text style={{ fontSize: 13, color: '#9ca3af' }}>Try adjusting your filters</Text>
                                        </Flex>
                                    </Table.Td>
                                </Table.Tr>
                            ) : filtered.map((user) => (
                                <Table.Tr key={user.id}>
                                    {/* Name */}
                                    <Table.Td style={{ padding: '14px 20px' }}>
                                        <Flex align="center" gap={10}>
                                            <Box
                                                style={{
                                                    width: 34, height: 34, borderRadius: '50%',
                                                    background: avatarColor(user.name),
                                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                    flexShrink: 0,
                                                }}
                                            >
                                                <Text style={{ color: '#fff', fontSize: 12, fontWeight: 700 }}>
                                                    {getInitials(user.name)}
                                                </Text>
                                            </Box>
                                            <Text style={{ fontSize: 14, fontWeight: 600, color: '#111827' }}>
                                                {user.name}
                                            </Text>
                                        </Flex>
                                    </Table.Td>

                                    {/* Email */}
                                    <Table.Td style={{ padding: '14px 20px' }}>
                                        <Text style={{ fontSize: 13, color: '#6b7280' }}>{user.email}</Text>
                                    </Table.Td>

                                    {/* Role */}
                                    <Table.Td style={{ padding: '14px 20px' }}>
                                        <Badge
                                            radius={6}
                                            style={{
                                                background: user.role === 'Admin' ? '#f5f3ff' : '#eff6ff',
                                                color: user.role === 'Admin' ? '#7c3aed' : '#2563eb',
                                                border: `1px solid ${user.role === 'Admin' ? '#ddd6fe' : '#bfdbfe'}`,
                                                fontWeight: 600, fontSize: 12,
                                            }}
                                        >
                                            {user.role}
                                        </Badge>
                                    </Table.Td>

                                    {/* Team */}
                                    <Table.Td style={{ padding: '14px 20px' }}>
                                        <Text style={{ fontSize: 13, color: '#374151' }}>{user.team}</Text>
                                    </Table.Td>

                                    {/* Last Login */}
                                    <Table.Td style={{ padding: '14px 20px' }}>
                                        <Text style={{ fontSize: 13, color: '#9ca3af' }}>{user.lastLogin}</Text>
                                    </Table.Td>

                                    {/* Status */}
                                    <Table.Td style={{ padding: '14px 20px' }}>
                                        <Flex align="center" gap={8}>
                                            <Switch
                                                checked={user.status}
                                                onChange={() => toggleStatus(user.id)}
                                                size="sm"
                                                color="green"
                                            />
                                            <Badge
                                                radius={6}
                                                style={{
                                                    background: user.status ? '#f0fdf4' : '#f9fafb',
                                                    color: user.status ? BRAND : '#6b7280',
                                                    border: `1px solid ${user.status ? '#bbf7d0' : '#e5e7eb'}`,
                                                    fontWeight: 600, fontSize: 11,
                                                }}
                                            >
                                                {user.status ? 'Active' : 'Inactive'}
                                            </Badge>
                                        </Flex>
                                    </Table.Td>

                                    {/* Actions */}
                                    <Table.Td style={{ padding: '14px 20px' }}>
                                        <Menu shadow="md" width={160} position="bottom-end" withinPortal>
                                            <Menu.Target>
                                                <ActionIcon variant="subtle" color="gray" radius={6}>
                                                    <IconDotsVertical size={16} />
                                                </ActionIcon>
                                            </Menu.Target>
                                            <Menu.Dropdown style={{ borderRadius: 10, border: '1px solid #f3f4f6' }}>
                                                <Menu.Item
                                                    leftSection={<IconEdit size={14} />}
                                                    onClick={() => handleEdit(user)}
                                                    style={{ fontSize: 13 }}
                                                >
                                                    Edit
                                                </Menu.Item>
                                                <Menu.Item
                                                    leftSection={<IconUserOff size={14} />}
                                                    onClick={() => deactivate(user.id)}
                                                    style={{ fontSize: 13 }}
                                                >
                                                    Deactivate
                                                </Menu.Item>
                                                <Divider />
                                                <Menu.Item
                                                    color="red"
                                                    leftSection={<IconTrash size={14} />}
                                                    onClick={() => deleteUser(user.id)}
                                                    style={{ fontSize: 13 }}
                                                >
                                                    Delete
                                                </Menu.Item>
                                            </Menu.Dropdown>
                                        </Menu>
                                    </Table.Td>
                                </Table.Tr>
                            ))}
                        </Table.Tbody>
                    </Table>
                </ScrollArea>
            </Paper>

            <UserModal
                opened={inviteOpen}
                onClose={() => setInviteOpen(false)}
                title="Invite User"
                form={inviteForm}
                setForm={setInviteForm}
                onSubmit={handleInvite}
                submitLabel="Send Invite"
            />

            <UserModal
                opened={editOpen}
                onClose={() => setEditOpen(false)}
                title="Edit User"
                form={editForm}
                setForm={setEditForm}
                onSubmit={handleSave}
                submitLabel="Save Changes"
            />
        </Box>
    )
}