import axios from "axios";
import { IconDotsVertical, IconSearch, IconTrash, IconUserOff } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";

import {
    Box, Flex, Text, Title, Badge, Paper,
    TextInput, Select, Switch, ActionIcon, Menu, Divider, Loader,
} from '@mantine/core'

const BRAND = '#16a34a'
const API = import.meta.env.VITE_API_URL || 'http://localhost:8000/api'

const avatarColor = (name = '') => {
    const colors = [BRAND, '#2563eb', '#7c3aed', '#ea580c', '#0891b2', '#db2777']
    return colors[(name.charCodeAt(0) || 0) % colors.length]
}

export default function User() {
    const { C } = useOutletContext()
    const [users, setUsers] = useState([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')
    const [roleFilter, setRoleFilter] = useState('')
    const [statusFilter, setStatusFilter] = useState('')

    const token = localStorage.getItem('token')
    const headers = { Authorization: `Bearer ${token}` }

    useEffect(() => {
        axios.get(`${API}/users`, { headers })
            .then(r => setUsers(r.data))
            .catch(() => { })
            .finally(() => setLoading(false))
    }, [])

    const handleToggle = async (id) => {
        const user = users.find(u => u._id === id)
        try {
            await axios.patch(`${API}/users/${id}/toggle`, {}, { headers })
            setUsers(p => p.map(u => u._id === id ? { ...u, isActive: !u.isActive } : u))
        } catch {
            alert('Failed to update user status')
        }
    }

    const handleDelete = async (id) => {
        if (!confirm('Delete this user? This cannot be undone.')) return
        try {
            await axios.delete(`${API}/users/${id}`, { headers })
            setUsers(p => p.filter(u => u._id !== id))
        } catch {
            alert('Failed to delete user')
        }
    }

    const filtered = users.filter(u => {
        const q = search.toLowerCase()
        const matchSearch = !q || u.name?.toLowerCase().includes(q) || u.email?.toLowerCase().includes(q)
        const matchRole = !roleFilter || u.role === roleFilter
        const matchStatus = !statusFilter || (statusFilter === 'active' ? u.isActive : !u.isActive)
        return matchSearch && matchRole && matchStatus
    })

    const thStyle = {
        fontSize: 11, color: C.subtle, fontWeight: 600,
        textTransform: 'uppercase', letterSpacing: '0.05em',
        padding: '10px 16px', textAlign: 'left', background: C.tableTh,
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
                    <Title order={2} style={{ color: C.text, fontWeight: 700, fontSize: 22, letterSpacing: '-0.3px' }}>Users</Title>
                    <Text style={{ color: C.muted, fontSize: 14, marginTop: 4 }}>
                        {users.length} registered user{users.length !== 1 ? 's' : ''}
                    </Text>
                </Box>
            </Flex>

            {/* Filters */}
            <Paper p={16} radius={10} mb={16} style={{ border: `1px solid ${C.border}`, background: C.surface, boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
                <Flex gap={12} style={{ flexWrap: 'wrap' }}>
                    <TextInput placeholder="Search name or email..." value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        leftSection={<IconSearch size={15} color={C.subtle} />} style={{ flex: '1 1 200px' }}
                        styles={{ input: { background: C.inputBg, border: `1px solid ${C.inputBorder}`, color: C.text, borderRadius: 8, height: 38 } }} />
                    <Select placeholder="All Roles"
                        data={[{ value: 'admin', label: 'Admin' }, { value: 'user', label: 'User' }]}
                        value={roleFilter} onChange={(v) => setRoleFilter(v || '')} clearable style={{ minWidth: 130 }}
                        styles={{ input: { background: C.inputBg, border: `1px solid ${C.inputBorder}`, color: C.text, borderRadius: 8, height: 38 } }} />
                    <Select placeholder="All Status"
                        data={[{ value: 'active', label: 'Active' }, { value: 'inactive', label: 'Inactive' }]}
                        value={statusFilter} onChange={(v) => setStatusFilter(v || '')} clearable style={{ minWidth: 130 }}
                        styles={{ input: { background: C.inputBg, border: `1px solid ${C.inputBorder}`, color: C.text, borderRadius: 8, height: 38 } }} />
                </Flex>
            </Paper>

            {/* Table */}
            <Paper radius={12} style={{ border: `1px solid ${C.border}`, background: C.surface, overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr>
                            {['Name', 'Role', 'Auth Method', 'Status', 'Joined', 'Actions'].map(h => (
                                <th key={h} style={thStyle}>{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.map((u) => {
                            const color = avatarColor(u.name || u.email)
                            const displayName = u.name || u.email?.split('@')[0] || 'Unknown'
                            const initials = displayName.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
                            const authMethod = u.googleId ? 'Google' : 'OTP Email'
                            return (
                                <tr key={u._id}
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
                                                <Text style={{ fontSize: 11, fontWeight: 700, color }}>{initials}</Text>
                                            </Box>
                                            <Box>
                                                <Text style={{ fontSize: 13, fontWeight: 600, color: C.text }}>{displayName}</Text>
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
                                    <td style={tdStyle}>
                                        <Badge radius={6} style={{
                                            background: u.googleId ? '#eff6ff' : C.hover,
                                            color: u.googleId ? '#2563eb' : C.muted,
                                            border: `1px solid ${u.googleId ? '#bfdbfe' : C.border}`,
                                            fontWeight: 500, fontSize: 11,
                                        }}>{authMethod}</Badge>
                                    </td>
                                    <td style={tdStyle}>
                                        <Flex align="center" gap={8}>
                                            <Switch checked={!!u.isActive} onChange={() => handleToggle(u._id)} color="green" size="sm" />
                                            <Badge radius={6} style={{
                                                background: u.isActive ? '#f0fdf4' : C.hover,
                                                color: u.isActive ? BRAND : C.subtle,
                                                border: `1px solid ${u.isActive ? '#bbf7d0' : C.border}`,
                                                fontWeight: 600, fontSize: 11,
                                            }}>{u.isActive ? 'Active' : 'Inactive'}</Badge>
                                        </Flex>
                                    </td>
                                    <td style={tdStyle}>
                                        <Text style={{ fontSize: 13, color: C.subtle }}>
                                            {new Date(u.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                        </Text>
                                    </td>
                                    <td style={tdStyle}>
                                        <Menu shadow="md" width={150} position="bottom-end" withinPortal>
                                            <Menu.Target>
                                                <ActionIcon variant="subtle" color="gray" radius={6}><IconDotsVertical size={15} /></ActionIcon>
                                            </Menu.Target>
                                            <Menu.Dropdown style={{ borderRadius: 10, background: C.surface, border: `1px solid ${C.border}` }}>
                                                <Menu.Item leftSection={<IconUserOff size={14} />} style={{ fontSize: 13, color: C.text }}
                                                    onClick={() => handleToggle(u._id)}>
                                                    {u.isActive ? 'Deactivate' : 'Activate'}
                                                </Menu.Item>
                                                <Divider style={{ borderColor: C.border }} />
                                                <Menu.Item color="red" leftSection={<IconTrash size={14} />} style={{ fontSize: 13 }}
                                                    onClick={() => handleDelete(u._id)}>
                                                    Delete
                                                </Menu.Item>
                                            </Menu.Dropdown>
                                        </Menu>
                                    </td>
                                </tr>
                            )
                        })}
                        {filtered.length === 0 && (
                            <tr><td colSpan={6} style={{ padding: '40px 16px', textAlign: 'center' }}>
                                <Text style={{ color: C.subtle, fontSize: 14 }}>No users found</Text>
                            </td></tr>
                        )}
                    </tbody>
                </table>
            </Paper>
        </Box>
    )
}