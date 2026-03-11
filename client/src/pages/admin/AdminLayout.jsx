import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import { getColors } from "../../styles/theme";

import {
    Box, Flex, Text, Tooltip, ActionIcon,
} from '@mantine/core'
import {
    IconHeadphones, IconLayoutDashboard, IconUsers,
    IconClipboardList, IconPhone, IconChartBar,
    IconSettings, IconLogout, IconSun, IconMoon,
} from '@tabler/icons-react'

const navItems = [
    { icon: IconLayoutDashboard, label: 'Dashboard', to: '/admin' },
    { icon: IconUsers, label: 'Users', to: '/admin/users' },
    { icon: IconClipboardList, label: 'Scorecards', to: '/admin/scorecards' },
    { icon: IconPhone, label: 'All Calls', to: '/admin/calls' },
    { icon: IconChartBar, label: 'Reports', to: '/admin/reports' },
    { icon: IconSettings, label: 'Settings', to: '/admin/settings' },
]

export default function AdminLayout() {
    const { dark, toggle } = useTheme()
    const C = getColors(dark)
    const navigate = useNavigate()
    const { user, logout } = useAuth()

    const displayName = user?.name || user?.email?.split('@')[0] || 'Admin'
    const email = user?.email || ''
    const initials = displayName.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)

    const handleLogout = () => {
        logout()
        navigate('/login')
    }

    return (
        <Flex style={{ minHeight: '100vh', background: C.bg }}>

            {/* Sidebar */}
            <Box style={{
                width: 240, flexShrink: 0,
                background: C.sidebar,
                borderRight: `1px solid ${C.border}`,
                display: 'flex', flexDirection: 'column',
                position: 'fixed', top: 0, left: 0, bottom: 0,
                transition: 'background 0.2s, border-color 0.2s',
            }}>

                {/* Logo */}
                <Flex align="center" gap={10} px={20} py={18}
                    style={{ borderBottom: `1px solid ${C.border}` }}
                >
                    <Box style={{
                        width: 32, height: 32, borderRadius: 8,
                        background: C.brand,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                        <IconHeadphones size={17} color="#fff" />
                    </Box>
                    <Box>
                        <Text style={{ fontWeight: 700, fontSize: 14, color: C.text, lineHeight: 1.2 }}>
                            CallAnalytics
                        </Text>
                        <Text style={{ fontSize: 10, color: C.subtle, letterSpacing: '0.05em' }}>
                            ADMIN PORTAL
                        </Text>
                    </Box>
                </Flex>

                {/* Nav */}
                <Box style={{ flex: 1, padding: '12px 10px', overflowY: 'auto' }}>
                    <Text style={{
                        fontSize: 10, fontWeight: 600, color: C.subtle,
                        letterSpacing: '0.08em', textTransform: 'uppercase',
                        paddingLeft: 10, marginBottom: 8,
                    }}>
                        Menu
                    </Text>
                    {navItems.map((item) => (
                        <NavLink
                            key={item.to}
                            to={item.to}
                            end={item.to === '/admin'}
                            style={({ isActive }) => ({
                                display: 'flex',
                                alignItems: 'center',
                                gap: 10,
                                padding: '9px 12px',
                                borderRadius: 8,
                                marginBottom: 2,
                                textDecoration: 'none',
                                fontSize: 13.5,
                                fontWeight: isActive ? 600 : 500,
                                color: isActive ? C.brand : C.muted,
                                background: isActive ? (dark ? '#16a34a18' : '#f0fdf4') : 'transparent',
                                transition: 'all 0.15s',
                            })}
                            onMouseEnter={(e) => {
                                if (!e.currentTarget.classList.contains('active'))
                                    e.currentTarget.style.background = C.hover
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.background = 'transparent'
                            }}
                        >
                            {({ isActive }) => (
                                <>
                                    <item.icon size={17} color={isActive ? C.brand : C.muted} />
                                    {item.label}
                                </>
                            )}
                        </NavLink>
                    ))}
                </Box>

                {/* Bottom */}
                <Box style={{ padding: '12px 10px', borderTop: `1px solid ${C.border}` }}>

                    {/* Dark mode toggle */}
                    <Flex
                        align="center" justify="space-between"
                        px={12} py={8} mb={6}
                        style={{ borderRadius: 8, background: dark ? '#22263a' : '#f9fafb' }}
                    >
                        <Flex align="center" gap={8}>
                            {dark
                                ? <IconMoon size={15} color={C.brand} />
                                : <IconSun size={15} color="#f59e0b" />
                            }
                            <Text style={{ fontSize: 13, color: C.muted, fontWeight: 500 }}>
                                {dark ? 'Dark Mode' : 'Light Mode'}
                            </Text>
                        </Flex>
                        <Box
                            onClick={toggle}
                            style={{
                                width: 38, height: 22, borderRadius: 11,
                                background: dark ? C.brand : '#e5e7eb',
                                position: 'relative', cursor: 'pointer',
                                transition: 'background 0.2s',
                                flexShrink: 0,
                            }}
                        >
                            <Box style={{
                                position: 'absolute',
                                top: 3, left: dark ? 19 : 3,
                                width: 16, height: 16, borderRadius: '50%',
                                background: '#fff',
                                transition: 'left 0.2s',
                                boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                            }} />
                        </Box>
                    </Flex>

                    {/* User — real data */}
                    <Flex align="center" justify="space-between" px={12} py={8}>
                        <Flex align="center" gap={8}>
                            <Box style={{
                                width: 30, height: 30, borderRadius: '50%',
                                background: dark ? '#16a34a30' : '#f0fdf4',
                                border: `1.5px solid ${dark ? '#16a34a50' : '#bbf7d0'}`,
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                            }}>
                                <Text style={{ fontSize: 11, fontWeight: 700, color: C.brand }}>{initials}</Text>
                            </Box>
                            <Box>
                                <Text style={{ fontSize: 12, fontWeight: 600, color: C.text, lineHeight: 1.2 }}>
                                    {displayName}
                                </Text>
                                <Text style={{
                                    fontSize: 10, color: C.subtle,
                                    maxWidth: 120, overflow: 'hidden',
                                    textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                                }}>
                                    {email}
                                </Text>
                            </Box>
                        </Flex>
                        <Tooltip label="Logout" position="right">
                            <ActionIcon
                                variant="subtle" radius={6} size={28}
                                onClick={handleLogout}
                                style={{ color: '#ef4444' }}
                            >
                                <IconLogout size={15} />
                            </ActionIcon>
                        </Tooltip>
                    </Flex>

                </Box>
            </Box>

            {/* Main Content */}
            <Box style={{
                marginLeft: 240, flex: 1, padding: 32,
                background: C.bg,
                minHeight: '100vh',
                transition: 'background 0.2s',
            }}>
                <Outlet context={{ dark, C }} />
            </Box>

        </Flex>
    )
}