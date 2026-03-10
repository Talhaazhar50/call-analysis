import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { startRegistration } from '@simplewebauthn/browser'
import axios from 'axios'
import { useAuth } from '../../context/AuthContext'

import {
    Box, Flex, Text, Title, Button, Paper, Stack, Divider,
} from '@mantine/core'
import {
    IconShield, IconFingerprint, IconCheck, IconTrash,
} from '@tabler/icons-react'

const BRAND = '#16a34a'
const API = import.meta.env.VITE_API_URL || 'http://localhost:8000/api'

function SectionHeader({ icon: Icon, title, description, C }) {
    return (
        <Flex align="center" gap={12} mb={20}>
            <Box style={{
                width: 38, height: 38, borderRadius: 10, flexShrink: 0,
                background: '#f0fdf4', border: '1px solid #bbf7d0',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
                <Icon size={18} color={BRAND} />
            </Box>
            <Box>
                <Text style={{ fontWeight: 700, fontSize: 15, color: C.text }}>{title}</Text>
                <Text style={{ fontSize: 12, color: C.subtle, marginTop: 1 }}>{description}</Text>
            </Box>
        </Flex>
    )
}

function SettingRow({ label, description, children, C }) {
    return (
        <Flex justify="space-between" align="center" gap={16} style={{ flexWrap: 'wrap' }}>
            <Box style={{ flex: 1, minWidth: 200 }}>
                <Text style={{ fontSize: 14, fontWeight: 500, color: C.text }}>{label}</Text>
                {description && (
                    <Text style={{ fontSize: 12, color: C.subtle, marginTop: 2 }}>{description}</Text>
                )}
            </Box>
            <Box style={{ flexShrink: 0 }}>{children}</Box>
        </Flex>
    )
}

export default function UserSettings() {
    const { C } = useOutletContext()
    const { user } = useAuth()

    const [passkeys, setPasskeys] = useState([])
    const [passkeyLoading, setPasskeyLoading] = useState(false)
    const [passkeySuccess, setPasskeySuccess] = useState(false)
    const [passkeyError, setPasskeyError] = useState('')

    useEffect(() => {
        const fetchPasskeys = async () => {
            try {
                const token = localStorage.getItem('token')
                const { data } = await axios.get(`${API}/auth/passkeys`, {
                    headers: { Authorization: `Bearer ${token}` }
                })
                setPasskeys(data)
            } catch (err) {
                console.error('Failed to fetch passkeys', err)
            }
        }
        fetchPasskeys()
    }, [])

    const handleRegisterPasskey = async () => {
        if (!user?.email) return
        setPasskeyLoading(true)
        setPasskeyError('')
        setPasskeySuccess(false)
        try {
            const { data: options } = await axios.post(`${API}/auth/passkey/register-options`, { email: user.email })
            const registrationResponse = await startRegistration({ optionsJSON: options })
            await axios.post(`${API}/auth/passkey/register-verify`, { email: user.email, registrationResponse })
            setPasskeySuccess(true)
            const token = localStorage.getItem('token')
            const { data } = await axios.get(`${API}/auth/passkeys`, {
                headers: { Authorization: `Bearer ${token}` }
            })
            setPasskeys(data)
        } catch (err) {
            if (err.name === 'NotAllowedError') {
                setPasskeyError('Registration was cancelled')
            } else {
                setPasskeyError(err.message || err.response?.data?.message || 'Failed to register passkey')
            }
        } finally {
            setPasskeyLoading(false)
        }
    }

    const handleDeletePasskey = async (credentialID) => {
        try {
            const token = localStorage.getItem('token')
            await axios.delete(`${API}/auth/passkey/${credentialID}`, {
                headers: { Authorization: `Bearer ${token}` }
            })
            setPasskeys(prev => prev.filter(pk => pk.credentialID !== credentialID))
        } catch (err) {
            setPasskeyError(err.response?.data?.message || 'Failed to delete passkey')
        }
    }

    const cardStyle = {
        border: `1px solid ${C.border}`,
        background: C.surface,
        boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
    }

    return (
        <Box p="xl" maw={700}>

            <Box mb={24}>
                <Title order={2} style={{ color: C.text, fontWeight: 700, fontSize: 22, letterSpacing: '-0.3px' }}>
                    Settings
                </Title>
                <Text style={{ color: C.muted, fontSize: 14, marginTop: 4 }}>
                    Manage your account security and preferences
                </Text>
            </Box>

            <Stack gap={20}>

                <Paper p={24} radius={12} style={cardStyle}>
                    <SectionHeader
                        icon={IconShield}
                        title="Security"
                        description="Manage how you sign in to your account"
                        C={C}
                    />
                    <Stack gap={16}>

                        <SettingRow
                            label="Passkey (Biometric Login)"
                            description={
                                passkeys.length > 0
                                    ? `${passkeys.length} passkey${passkeys.length > 1 ? 's' : ''} registered on this account`
                                    : 'Register your fingerprint or Face ID to sign in without a code'
                            }
                            C={C}
                        >
                            <Flex align="center" gap={10}>
                                {passkeySuccess && (
                                    <Flex align="center" gap={4}>
                                        <IconCheck size={14} color={BRAND} />
                                        <Text size="xs" style={{ color: BRAND, fontWeight: 600 }}>Registered!</Text>
                                    </Flex>
                                )}
                                {passkeyError && (
                                    <Text size="xs" style={{ color: '#dc2626', maxWidth: 160 }}>{passkeyError}</Text>
                                )}
                                <Button
                                    radius={8}
                                    loading={passkeyLoading}
                                    onClick={handleRegisterPasskey}
                                    leftSection={!passkeyLoading ? <IconFingerprint size={15} /> : null}
                                    style={{
                                        background: '#f0fdf4', color: BRAND,
                                        border: '1px solid #bbf7d0',
                                        fontWeight: 600, fontSize: 13, height: 36,
                                    }}
                                >
                                    {passkeys.length > 0 ? '✓ Registered — Add Another' : 'Register Passkey'}
                                </Button>
                            </Flex>
                        </SettingRow>

                        {passkeys.length > 0 && (
                            <>
                                <Divider style={{ borderColor: C.border }} />
                                <Box style={{
                                    background: '#f9fafb', borderRadius: 10,
                                    border: `1px solid ${C.border}`, overflow: 'hidden'
                                }}>
                                    {passkeys.map((pk, i) => (
                                        <Flex
                                            key={pk.credentialID}
                                            justify="space-between" align="center"
                                            px={16} py={12}
                                            style={{ borderBottom: i < passkeys.length - 1 ? `1px solid ${C.border}` : 'none' }}
                                        >
                                            <Flex align="center" gap={10}>
                                                <Box style={{
                                                    width: 32, height: 32, borderRadius: 8,
                                                    background: '#f0fdf4', border: '1px solid #bbf7d0',
                                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                }}>
                                                    <IconFingerprint size={16} color={BRAND} />
                                                </Box>
                                                <Box>
                                                    <Text style={{ fontSize: 13, fontWeight: 500, color: C.text }}>{pk.label}</Text>
                                                    <Text style={{ fontSize: 11, color: C.subtle }}>
                                                        Added {new Date(pk.createdAt).toLocaleDateString()}
                                                    </Text>
                                                </Box>
                                            </Flex>
                                            <Button
                                                variant="default" radius={8} size="xs"
                                                onClick={() => handleDeletePasskey(pk.credentialID)}
                                                leftSection={<IconTrash size={12} />}
                                                style={{
                                                    border: '1px solid #fecaca', color: '#dc2626',
                                                    background: '#fff', fontWeight: 500
                                                }}
                                            >
                                                Remove
                                            </Button>
                                        </Flex>
                                    ))}
                                </Box>
                            </>
                        )}

                    </Stack>
                </Paper>

                <Paper p={20} radius={12} style={{ ...cardStyle, background: '#f0fdf4', border: '1px solid #bbf7d0' }}>
                    <Flex gap={12} align="flex-start">
                        <Text style={{ fontSize: 20 }}>🔑</Text>
                        <Box>
                            <Text style={{ fontSize: 13, fontWeight: 600, color: C.text, marginBottom: 4 }}>
                                How passkeys work
                            </Text>
                            <Text style={{ fontSize: 12, color: C.muted, lineHeight: 1.6 }}>
                                Once registered, you can sign in using your device's biometrics (Face ID, fingerprint, or Windows Hello) instead of waiting for an email code. Passkeys are stored securely on your device and cannot be stolen.
                            </Text>
                        </Box>
                    </Flex>
                </Paper>

            </Stack>
        </Box>
    )
}