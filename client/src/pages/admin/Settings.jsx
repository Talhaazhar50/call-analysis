import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { startRegistration } from '@simplewebauthn/browser'
import axios from 'axios'
import { useAuth } from '../../context/AuthContext'

import {
    Box, Flex, Text, Title, Button, Paper, Stack,
    TextInput, Select, Switch, Divider, Modal, Slider, Badge,
} from '@mantine/core'
import {
    IconBuilding, IconBell, IconShield, IconAlertTriangle,
    IconCheck, IconUpload, IconBrain, IconTrash, IconRefresh, IconFingerprint,
} from '@tabler/icons-react'

const BRAND = '#16a34a'
const API = import.meta.env.VITE_API_URL || 'http://localhost:8000/api'

function SectionHeader({ icon: Icon, title, description, C, danger }) {
    return (
        <Flex align="center" gap={12} mb={20}>
            <Box style={{
                width: 38, height: 38, borderRadius: 10, flexShrink: 0,
                background: danger ? '#fef2f2' : '#f0fdf4',
                border: `1px solid ${danger ? '#fecaca' : '#bbf7d0'}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
                <Icon size={18} color={danger ? '#dc2626' : BRAND} />
            </Box>
            <Box>
                <Text style={{ fontWeight: 700, fontSize: 15, color: danger ? '#dc2626' : C.text }}>{title}</Text>
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
                {description && <Text style={{ fontSize: 12, color: C.subtle, marginTop: 2 }}>{description}</Text>}
            </Box>
            <Box style={{ flexShrink: 0 }}>{children}</Box>
        </Flex>
    )
}

export default function Settings() {
    const { C } = useOutletContext()
    const { user } = useAuth()

    const [saved, setSaved] = useState(false)
    const [dangerModal, setDangerModal] = useState(null)

    const [platformName, setPlatformName] = useState('CallAnalytics')
    const [companyName, setCompanyName] = useState('Acme Corp')
    const [timezone, setTimezone] = useState('UTC')
    const [dateFormat, setDateFormat] = useState('MM/DD/YYYY')
    const [passThreshold, setPassThreshold] = useState(70)
    const [autoAnalyze, setAutoAnalyze] = useState(true)
    const [scoreRounding, setScoreRounding] = useState('whole')
    const [aiModel, setAiModel] = useState('claude')
    const [emailOnScore, setEmailOnScore] = useState(true)
    const [emailOnFail, setEmailOnFail] = useState(true)
    const [weeklyDigest, setWeeklyDigest] = useState(false)
    const [agentNotify, setAgentNotify] = useState(false)
    const [sessionTimeout, setSessionTimeout] = useState('8h')
    const [require2FA, setRequire2FA] = useState(false)
    const [allowSocial, setAllowSocial] = useState(true)

    // Passkey states
    const [passkeyLoading, setPasskeyLoading] = useState(false)
    const [passkeySuccess, setPasskeySuccess] = useState(false)
    const [passkeyError, setPasskeyError] = useState('')
    const [passkeys, setPasskeys] = useState([])

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

    const handleSave = () => {
        setSaved(true)
        setTimeout(() => setSaved(false), 2500)
    }

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
            // Refresh passkeys list
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

    const inputStyles = {
        label: { fontSize: 13, fontWeight: 500, color: C.text, marginBottom: 6 },
        input: {
            background: C.inputBg,
            border: `1px solid ${C.inputBorder}`,
            color: C.text,
            borderRadius: 8,
            height: 42,
            fontSize: 14,
        },
        placeholder: { color: C.subtle },
    }

    const cardStyle = {
        border: `1px solid ${C.border}`,
        background: C.surface,
        boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
    }

    const modalStyles = {
        content: { background: C.surface, border: `1px solid ${C.border}` },
        header: { background: C.surface, borderBottom: `1px solid ${C.border}` },
    }

    return (
        <Box>
            {/* Header */}
            <Flex justify="space-between" align="flex-start" mb={24} style={{ flexWrap: 'wrap', gap: 12 }}>
                <Box>
                    <Title order={2} style={{ color: C.text, fontWeight: 700, fontSize: 22, letterSpacing: '-0.3px' }}>
                        Settings
                    </Title>
                    <Text style={{ color: C.muted, fontSize: 14, marginTop: 4 }}>
                        Manage your platform preferences and configuration
                    </Text>
                </Box>
                <Button
                    leftSection={saved ? <IconCheck size={15} /> : null}
                    radius={8} onClick={handleSave}
                    style={{
                        background: saved ? C.hover : BRAND,
                        color: saved ? BRAND : '#fff',
                        border: saved ? '1px solid #bbf7d0' : 'none',
                        fontWeight: 600, fontSize: 14, height: 40, transition: 'all 0.2s',
                    }}
                >
                    {saved ? 'Saved!' : 'Save Changes'}
                </Button>
            </Flex>

            <Stack gap={20}>

                {/* ── General ── */}
                <Paper p={24} radius={12} style={cardStyle}>
                    <SectionHeader icon={IconBuilding} title="General" description="Basic platform and company information" C={C} />
                    <Stack gap={16}>
                        <Flex gap={16} style={{ flexWrap: 'wrap' }}>
                            <TextInput
                                label="Platform Name" placeholder="e.g. CallAnalytics"
                                value={platformName} onChange={(e) => setPlatformName(e.target.value)}
                                style={{ flex: 1, minWidth: 200 }} styles={inputStyles}
                            />
                            <TextInput
                                label="Company Name" placeholder="e.g. Acme Corp"
                                value={companyName} onChange={(e) => setCompanyName(e.target.value)}
                                style={{ flex: 1, minWidth: 200 }} styles={inputStyles}
                            />
                        </Flex>
                        <Flex gap={16} style={{ flexWrap: 'wrap' }}>
                            <Select
                                label="Timezone" placeholder="Select timezone"
                                value={timezone} onChange={(v) => setTimezone(v || 'UTC')}
                                style={{ flex: 1, minWidth: 200 }} styles={inputStyles}
                                data={[
                                    { value: 'UTC', label: 'UTC' },
                                    { value: 'America/New_York', label: 'Eastern Time (ET)' },
                                    { value: 'America/Chicago', label: 'Central Time (CT)' },
                                    { value: 'America/Denver', label: 'Mountain Time (MT)' },
                                    { value: 'America/Los_Angeles', label: 'Pacific Time (PT)' },
                                    { value: 'Europe/London', label: 'London (GMT)' },
                                    { value: 'Europe/Paris', label: 'Paris (CET)' },
                                    { value: 'Asia/Karachi', label: 'Karachi (PKT)' },
                                    { value: 'Asia/Dubai', label: 'Dubai (GST)' },
                                ]}
                            />
                            <Select
                                label="Date Format" placeholder="Select format"
                                value={dateFormat} onChange={(v) => setDateFormat(v || 'MM/DD/YYYY')}
                                style={{ flex: 1, minWidth: 200 }} styles={inputStyles}
                                data={[
                                    { value: 'MM/DD/YYYY', label: 'MM/DD/YYYY' },
                                    { value: 'DD/MM/YYYY', label: 'DD/MM/YYYY' },
                                    { value: 'YYYY-MM-DD', label: 'YYYY-MM-DD' },
                                ]}
                            />
                        </Flex>
                        <Box>
                            <Text style={{ fontSize: 13, fontWeight: 500, color: C.text, marginBottom: 8 }}>Company Logo</Text>
                            <Flex align="center" gap={14}>
                                <Box style={{
                                    width: 52, height: 52, borderRadius: 12,
                                    background: '#f0fdf4', border: '1px solid #bbf7d0',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                }}>
                                    <Text style={{ fontWeight: 800, fontSize: 18, color: BRAND }}>A</Text>
                                </Box>
                                <Button variant="default" radius={8} leftSection={<IconUpload size={14} />}
                                    style={{ border: `1px solid ${C.inputBorder}`, color: C.text, fontWeight: 500, fontSize: 13, height: 38, background: C.inputBg }}>
                                    Upload Logo
                                </Button>
                                <Text style={{ fontSize: 12, color: C.subtle }}>PNG or SVG, max 2MB</Text>
                            </Flex>
                        </Box>
                    </Stack>
                </Paper>

                {/* ── Scoring & AI ── */}
                <Paper p={24} radius={12} style={cardStyle}>
                    <SectionHeader icon={IconBrain} title="Scoring & AI" description="Configure how calls are scored and analyzed" C={C} />
                    <Stack gap={20}>
                        <Box>
                            <Flex justify="space-between" align="center" mb={12}>
                                <Box>
                                    <Text style={{ fontSize: 14, fontWeight: 500, color: C.text }}>Pass Threshold</Text>
                                    <Text style={{ fontSize: 12, color: C.subtle, marginTop: 2 }}>Minimum score required to pass a call</Text>
                                </Box>
                                <Badge radius={8} style={{
                                    background: '#f0fdf4', color: BRAND,
                                    border: '1px solid #bbf7d0',
                                    fontWeight: 800, fontSize: 16, padding: '4px 14px',
                                }}>
                                    {passThreshold}%
                                </Badge>
                            </Flex>
                            <Slider
                                value={passThreshold} onChange={setPassThreshold}
                                min={50} max={95} step={5} color="green"
                                marks={[
                                    { value: 50, label: '50%' },
                                    { value: 70, label: '70%' },
                                    { value: 95, label: '95%' },
                                ]}
                                styles={{
                                    mark: { fontSize: 11, color: C.subtle },
                                    markLabel: { fontSize: 11, color: C.subtle },
                                }}
                                mb={8}
                            />
                        </Box>
                        <Divider style={{ borderColor: C.border }} />
                        <SettingRow label="Auto-Analyze on Upload" description="Automatically score calls when uploaded by agents" C={C}>
                            <Switch checked={autoAnalyze} onChange={() => setAutoAnalyze(p => !p)} color="green" size="md" />
                        </SettingRow>
                        <Divider style={{ borderColor: C.border }} />
                        <Flex gap={16} style={{ flexWrap: 'wrap' }}>
                            <Select
                                label="AI Model" placeholder="Select model"
                                value={aiModel} onChange={(v) => setAiModel(v || 'claude')}
                                style={{ flex: 1, minWidth: 200 }} styles={inputStyles}
                                data={[
                                    { value: 'claude', label: 'Claude (Anthropic)' },
                                    { value: 'gpt4', label: 'GPT-4 (OpenAI)' },
                                    { value: 'gpt35', label: 'GPT-3.5 Turbo' },
                                ]}
                            />
                            <Select
                                label="Score Rounding" placeholder="Select rounding"
                                value={scoreRounding} onChange={(v) => setScoreRounding(v || 'whole')}
                                style={{ flex: 1, minWidth: 200 }} styles={inputStyles}
                                data={[
                                    { value: 'whole', label: 'Whole numbers (78%)' },
                                    { value: 'decimal1', label: 'One decimal (78.4%)' },
                                    { value: 'decimal2', label: 'Two decimals (78.42%)' },
                                ]}
                            />
                        </Flex>
                    </Stack>
                </Paper>

                {/* ── Notifications ── */}
                <Paper p={24} radius={12} style={cardStyle}>
                    <SectionHeader icon={IconBell} title="Notifications" description="Control what email alerts are sent and to whom" C={C} />
                    <Stack gap={16}>
                        {[
                            { label: 'Email on Call Scored', desc: 'Send admin an email when a call is analyzed', state: emailOnScore, set: setEmailOnScore },
                            { label: 'Alert on Failed Call', desc: 'Notify admin immediately when a call fails', state: emailOnFail, set: setEmailOnFail },
                            { label: 'Weekly Performance Digest', desc: 'Send a weekly summary of team performance every Monday', state: weeklyDigest, set: setWeeklyDigest },
                            { label: 'Notify Agents of Their Scores', desc: 'Agents receive an email with their score after each call', state: agentNotify, set: setAgentNotify },
                        ].map((item, i, arr) => (
                            <Box key={item.label}>
                                <SettingRow label={item.label} description={item.desc} C={C}>
                                    <Switch checked={item.state} onChange={() => item.set(p => !p)} color="green" size="md" />
                                </SettingRow>
                                {i < arr.length - 1 && <Divider style={{ borderColor: C.border, marginTop: 16 }} />}
                            </Box>
                        ))}
                    </Stack>
                </Paper>

                {/* ── Security ── */}
                <Paper p={24} radius={12} style={cardStyle}>
                    <SectionHeader icon={IconShield} title="Security" description="Authentication and session management" C={C} />
                    <Stack gap={16}>
                        <Select
                            label="Session Timeout" placeholder="Select timeout"
                            value={sessionTimeout} onChange={(v) => setSessionTimeout(v || '8h')}
                            style={{ maxWidth: 240 }} styles={inputStyles}
                            data={[
                                { value: '1h', label: '1 hour' },
                                { value: '4h', label: '4 hours' },
                                { value: '8h', label: '8 hours' },
                                { value: '24h', label: '24 hours' },
                                { value: 'never', label: 'Never' },
                            ]}
                        />
                        <Divider style={{ borderColor: C.border }} />
                        <SettingRow label="Require 2FA for Admins" description="Admins must verify with a code on every login" C={C}>
                            <Switch checked={require2FA} onChange={() => setRequire2FA(p => !p)} color="green" size="md" />
                        </SettingRow>
                        <Divider style={{ borderColor: C.border }} />
                        <SettingRow label="Allow Social Login" description="Users can sign in with Google, Apple, or Microsoft" C={C}>
                            <Switch checked={allowSocial} onChange={() => setAllowSocial(p => !p)} color="green" size="md" />
                        </SettingRow>
                        <Divider style={{ borderColor: C.border }} />

                        {/* ── Passkey ── */}
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

                        {/* Registered passkeys list */}
                        {passkeys.length > 0 && (
                            <Box style={{
                                background: '#f9fafb', borderRadius: 10,
                                border: `1px solid ${C.border}`, overflow: 'hidden'
                            }}>
                                {passkeys.map((pk, i) => (
                                    <Flex key={pk.credentialID} justify="space-between" align="center"
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
                        )}

                    </Stack>
                </Paper>

                {/* ── Danger Zone ── */}
                <Paper p={24} radius={12} style={{ border: '1px solid #fecaca', background: C.surface, boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
                    <SectionHeader icon={IconAlertTriangle} title="Danger Zone" description="Irreversible actions — proceed with caution" C={C} danger />
                    <Stack gap={0}>
                        {[
                            { id: 'calls', label: 'Delete All Calls', description: 'Permanently delete all call recordings, transcripts and scores', icon: IconTrash },
                            { id: 'scores', label: 'Reset All Scores', description: 'Wipe all AI-generated scores. Calls remain but scores are cleared', icon: IconRefresh },
                            { id: 'org', label: 'Delete Organization', description: 'Permanently delete this workspace and all data. Cannot be undone', icon: IconTrash },
                        ].map((action, i, arr) => (
                            <Box key={action.id}>
                                <Flex justify="space-between" align="center" py={16} style={{ flexWrap: 'wrap', gap: 12 }}>
                                    <Box>
                                        <Text style={{ fontSize: 14, fontWeight: 600, color: C.text }}>{action.label}</Text>
                                        <Text style={{ fontSize: 12, color: C.subtle, marginTop: 2 }}>{action.description}</Text>
                                    </Box>
                                    <Button variant="default" radius={8} leftSection={<action.icon size={14} />}
                                        onClick={() => setDangerModal(action)}
                                        style={{
                                            border: '1px solid #fecaca', color: '#dc2626',
                                            fontWeight: 600, fontSize: 13, height: 36, background: C.surface,
                                        }}>
                                        {action.label}
                                    </Button>
                                </Flex>
                                {i < arr.length - 1 && <Divider style={{ borderColor: C.border }} />}
                            </Box>
                        ))}
                    </Stack>
                </Paper>

            </Stack>

            {/* Danger Confirm Modal */}
            <Modal
                opened={!!dangerModal} onClose={() => setDangerModal(null)}
                centered radius={12} size="sm" overlayProps={{ blur: 2 }}
                styles={modalStyles}
                title={
                    <Flex align="center" gap={8}>
                        <IconAlertTriangle size={18} color="#dc2626" />
                        <Text style={{ fontWeight: 700, fontSize: 16, color: '#dc2626' }}>
                            Confirm: {dangerModal?.label}
                        </Text>
                    </Flex>
                }
            >
                <Stack gap={16}>
                    <Text style={{ fontSize: 14, color: C.text, lineHeight: 1.6 }}>
                        Are you sure you want to <strong>{dangerModal?.label.toLowerCase()}</strong>?
                        This action <strong>cannot be undone</strong>.
                    </Text>
                    <Paper p={12} radius={8} style={{ background: '#fef2f2', border: '1px solid #fecaca' }}>
                        <Text style={{ fontSize: 13, color: '#dc2626' }}>{dangerModal?.description}</Text>
                    </Paper>
                    <Flex gap={10} justify="flex-end">
                        <Button variant="default" radius={8} onClick={() => setDangerModal(null)}
                            style={{ border: `1px solid ${C.inputBorder}`, color: C.text, fontWeight: 500, background: C.inputBg }}>
                            Cancel
                        </Button>
                        <Button radius={8} onClick={() => setDangerModal(null)}
                            style={{ background: '#dc2626', color: '#fff', fontWeight: 600, border: 'none' }}>
                            Yes, {dangerModal?.label}
                        </Button>
                    </Flex>
                </Stack>
            </Modal>
        </Box>
    )
}