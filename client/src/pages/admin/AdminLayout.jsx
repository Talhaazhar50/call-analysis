import { NavLink, Outlet, useNavigate } from "react-router-dom";

import {
    Box, Flex, Text, Stack, UnstyledButton, Tooltip,
} from '@mantine/core'
import {
    IconLayoutDashboard, IconUsers, IconClipboardList,
    IconPhoneCall, IconChartBar, IconSettings, IconLogout, IconHeadphones,
} from '@tabler/icons-react'

const BRAND = '#16a34a'
const SIDEBAR_W = 240

const navItems = [
    { icon: IconLayoutDashboard, label: 'Dashboard', to: '/admin' },
    { icon: IconUsers, label: 'Users', to: '/admin/users' },
    { icon: IconClipboardList, label: 'Scorecards', to: '/admin/scorecards' },
    { icon: IconPhoneCall, label: 'All Calls', to: '/admin/calls' },
    { icon: IconChartBar, label: 'Reports', to: '/admin/reports' },
    { icon: IconSettings, label: 'Settings', to: '/admin/settings' },
]

export default function AdminLayout() {
    const navigate = useNavigate()

    const handleLogout = () => {
        localStorage.removeItem('token')
        navigate('/login')
    }

    return (
        <Flex style={{ minHeight: '100vh', background: '#f9fafb' }}>

            {/* ── Sidebar ── */}
            <Box
                style={{
                    width: SIDEBAR_W,
                    minHeight: '100vh',
                    background: '#fff',
                    borderRight: '1px solid #f3f4f6',
                    display: 'flex',
                    flexDirection: 'column',
                    position: 'fixed',
                    top: 0, left: 0,
                    zIndex: 100,
                }}
            >
                {/* Logo */}
                <Flex
                    align="center"
                    gap={10}
                    px={20}
                    py={20}
                    style={{ borderBottom: '1px solid #f3f4f6' }}
                >
                    <Box
                        style={{
                            width: 32, height: 32, borderRadius: 8,
                            background: BRAND,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            flexShrink: 0,
                        }}
                    >
                        <IconHeadphones size={17} color="#fff" />
                    </Box>
                    <Box>
                        <Text style={{ fontWeight: 700, fontSize: 14, color: '#111827', lineHeight: 1.2 }}>
                            CallAnalytics
                        </Text>
                        <Text style={{ fontSize: 11, color: '#9ca3af' }}>Admin Portal</Text>
                    </Box>
                </Flex>

                {/* Nav Items */}
                <Stack gap={4} p={12} style={{ flex: 1 }}>
                    {navItems.map((item) => (
                        <NavLink
                            key={item.to}
                            to={item.to}
                            end={item.to === '/admin'}
                            style={{ textDecoration: 'none' }}
                        >
                            {({ isActive }) => (
                                <Flex
                                    align="center"
                                    gap={10}
                                    px={12}
                                    py={9}
                                    style={{
                                        borderRadius: 8,
                                        background: isActive ? '#f0fdf4' : 'transparent',
                                        cursor: 'pointer',
                                        transition: 'background 0.15s',
                                    }}
                                    onMouseEnter={(e) => {
                                        if (!isActive) e.currentTarget.style.background = '#f9fafb'
                                    }}
                                    onMouseLeave={(e) => {
                                        if (!isActive) e.currentTarget.style.background = 'transparent'
                                    }}
                                >
                                    <item.icon
                                        size={18}
                                        color={isActive ? BRAND : '#6b7280'}
                                        strokeWidth={isActive ? 2.2 : 1.8}
                                    />
                                    <Text
                                        style={{
                                            fontSize: 14,
                                            fontWeight: isActive ? 600 : 400,
                                            color: isActive ? BRAND : '#374151',
                                        }}
                                    >
                                        {item.label}
                                    </Text>
                                </Flex>
                            )}
                        </NavLink>
                    ))}
                </Stack>

                {/* Bottom — User + Logout */}
                <Box
                    p={12}
                    style={{ borderTop: '1px solid #f3f4f6' }}
                >
                    <Flex
                        align="center"
                        gap={10}
                        p={10}
                        mb={4}
                        style={{
                            background: '#f9fafb',
                            borderRadius: 8,
                        }}
                    >
                        <Box
                            style={{
                                width: 32, height: 32, borderRadius: '50%',
                                background: BRAND,
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                flexShrink: 0,
                            }}
                        >
                            <Text style={{ color: '#fff', fontSize: 13, fontWeight: 700 }}>A</Text>
                        </Box>
                        <Box style={{ flex: 1, minWidth: 0 }}>
                            <Text style={{ fontSize: 13, fontWeight: 600, color: '#111827' }}>
                                Admin
                            </Text>
                            <Text
                                style={{
                                    fontSize: 11, color: '#9ca3af',
                                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                                }}
                            >
                                admin@company.com
                            </Text>
                        </Box>
                    </Flex>

                    <UnstyledButton
                        onClick={handleLogout}
                        style={{ width: '100%' }}
                    >
                        <Flex
                            align="center"
                            gap={10}
                            px={12}
                            py={9}
                            style={{ borderRadius: 8, cursor: 'pointer' }}
                            onMouseEnter={(e) => e.currentTarget.style.background = '#fef2f2'}
                            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                        >
                            <IconLogout size={17} color="#ef4444" />
                            <Text style={{ fontSize: 14, color: '#ef4444', fontWeight: 500 }}>
                                Logout
                            </Text>
                        </Flex>
                    </UnstyledButton>
                </Box>
            </Box>

            {/* ── Main Content ── */}
            <Box
                style={{
                    marginLeft: SIDEBAR_W,
                    flex: 1,
                    minHeight: '100vh',
                    padding: '32px',
                }}
            >
                <Outlet />
            </Box>
        </Flex>
    )
}