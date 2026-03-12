import axios from 'axios'
import {
    ActionIcon, Alert, Badge, Box, Button, Code, Divider, Flex,
    Loader, Modal, Paper, Select, Slider, Stack, Switch,
    Text, TextInput, Title, Tooltip
} from '@mantine/core'
import {
    IconAlertCircle, IconAlertTriangle, IconBell, IconBrain, IconBuilding,
    IconCheck, IconChevronRight, IconCircleCheck, IconCopy, IconExternalLink,
    IconPlugConnected, IconRefresh, IconShield, IconTrash, IconUpload, IconWebhook
} from '@tabler/icons-react'
import { useEffect, useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const BRAND = '#16a34a'
const API = import.meta.env.VITE_API_URL || 'http://localhost:8000/api'

function SectionHeader({ icon: Icon, title, description, C }) {
    return (
        <Flex gap={12} align="flex-start" mb={20}>
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

function DangerHeader({ icon: Icon, title, description, C, danger }) {
    return (
        <Flex gap={12} align="flex-start" mb={20}>
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

// Power BI field definitions
const POWERBI_FIELDS = [
    { name: 'callId', type: 'Text' },
    { name: 'date', type: 'DateTime' },
    { name: 'agentName', type: 'Text' },
    { name: 'agentEmail', type: 'Text' },
    { name: 'scorecard', type: 'Text' },
    { name: 'score', type: 'Number' },
    { name: 'totalScore', type: 'Number' },
    { name: 'maxScore', type: 'Number' },
    { name: 'pass', type: 'Text' },
    { name: 'passBoolean', type: 'True/False' },
    { name: 'duration', type: 'Text' },
    { name: 'overallFeedback', type: 'Text' },
    { name: 'criteria_[Name]', type: 'Number (one per criterion)' },
]

export default function Settings() {
    const { C } = useOutletContext()
    const { user } = useAuth()

    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [saved, setSaved] = useState(false)
    const [saveError, setSaveError] = useState('')
    const [dangerModal, setDangerModal] = useState(null)
    const [webhookTesting, setWebhookTesting] = useState(false)
    const [webhookTestResult, setWebhookTestResult] = useState(null) // { ok, message }
    const [showPbiGuide, setShowPbiGuide] = useState(false)
    const [copied, setCopied] = useState(false)

    // Settings state
    const [platformName, setPlatformName] = useState('CallAnalytics')
    const [companyName, setCompanyName] = useState('')
    const [timezone, setTimezone] = useState('UTC')
    const [dateFormat, setDateFormat] = useState('MM/DD/YYYY')
    const [passThreshold, setPassThreshold] = useState(70)
    const [autoAnalyze, setAutoAnalyze] = useState(true)
    const [scoreRounding, setScoreRounding] = useState('whole')
    const [aiModel, setAiModel] = useState('groq')
    const [adminEmail, setAdminEmail] = useState('')
    const [emailOnScore, setEmailOnScore] = useState(true)
    const [emailOnFail, setEmailOnFail] = useState(true)
    const [emailOnUpload, setEmailOnUpload] = useState(false)
    const [weeklyDigest, setWeeklyDigest] = useState(false)
    const [agentNotify, setAgentNotify] = useState(false)
    const [webhookEnabled, setWebhookEnabled] = useState(false)
    const [webhookUrl, setWebhookUrl] = useState('')

    const token = localStorage.getItem('token')
    const headers = { Authorization: `Bearer ${token}` }
    const inputStyles = {
        label: { fontSize: 13, fontWeight: 500, color: C.text, marginBottom: 6 },
        input: { background: C.inputBg, border: `1px solid ${C.inputBorder}`, color: C.text, borderRadius: 8, height: 42, fontSize: 14 },
    }
    const cardStyle = { border: `1px solid ${C.border}`, background: C.surface, boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }

    // Load settings from API
    useEffect(() => {
        axios.get(`${API}/settings`, { headers })
            .then(({ data }) => {
                setPlatformName(data.platformName || 'CallAnalytics')
                setCompanyName(data.companyName || '')
                setTimezone(data.timezone || 'UTC')
                setDateFormat(data.dateFormat || 'MM/DD/YYYY')
                setPassThreshold(data.passThreshold ?? 70)
                setAutoAnalyze(data.autoAnalyze ?? true)
                setScoreRounding(data.scoreRounding || 'whole')
                setAiModel(data.aiModel || 'groq')
                setAdminEmail(data.adminEmail || '')
                setEmailOnScore(data.emailOnScore ?? true)
                setEmailOnFail(data.emailOnFail ?? true)
                setEmailOnUpload(data.emailOnUpload ?? false)
                setWeeklyDigest(data.weeklyDigest ?? false)
                setAgentNotify(data.agentNotify ?? false)
                setWebhookEnabled(data.webhookEnabled ?? false)
                setWebhookUrl(data.webhookUrl || '')
            })
            .catch(() => { })
            .finally(() => setLoading(false))
    }, [])

    const handleSave = async () => {
        setSaving(true)
        setSaveError('')
        try {
            await axios.patch(`${API}/settings`, {
                platformName, companyName, timezone, dateFormat,
                passThreshold, autoAnalyze, scoreRounding, aiModel,
                adminEmail, emailOnScore, emailOnFail, emailOnUpload,
                weeklyDigest, agentNotify,
                webhookEnabled, webhookUrl,
            }, { headers })
            setSaved(true)
            setTimeout(() => setSaved(false), 2500)
        } catch (err) {
            setSaveError(err.response?.data?.message || 'Failed to save settings')
        } finally {
            setSaving(false)
        }
    }

    const handleTestWebhook = async () => {
        if (!webhookUrl) return
        setWebhookTesting(true)
        setWebhookTestResult(null)
        try {
            await axios.post(`${API}/settings/test-webhook`, { webhookUrl }, { headers })
            setWebhookTestResult({ ok: true, message: 'Test payload sent successfully! Check your Power BI dashboard.' })
        } catch (err) {
            setWebhookTestResult({ ok: false, message: err.response?.data?.message || 'Failed to reach the webhook URL.' })
        } finally {
            setWebhookTesting(false)
        }
    }

    const copyFields = () => {
        const text = POWERBI_FIELDS.map(f => `${f.name} (${f.type})`).join('\n')
        navigator.clipboard.writeText(text)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    if (loading) return (
        <Box style={{ display: 'flex', justifyContent: 'center', paddingTop: 80 }}>
            <Loader color="green" />
        </Box>
    )

    return (
        <Box>
            {saveError && (
                <Alert icon={<IconAlertCircle size={16} />} color="red" mb={16} onClose={() => setSaveError('')} withCloseButton>
                    {saveError}
                </Alert>
            )}

            <Flex justify="space-between" align="flex-start" mb={24} style={{ flexWrap: 'wrap', gap: 12 }}>
                <Box>
                    <Title order={2} style={{ color: C.text, fontWeight: 700, fontSize: 22, letterSpacing: '-0.3px' }}>Settings</Title>
                    <Text style={{ color: C.muted, fontSize: 14, marginTop: 4 }}>Manage your platform preferences and configuration</Text>
                </Box>
                <Button
                    leftSection={saved ? <IconCheck size={15} /> : null}
                    loading={saving}
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
                            <TextInput label="Platform Name" value={platformName} onChange={e => setPlatformName(e.target.value)}
                                style={{ flex: 1, minWidth: 200 }} styles={inputStyles} />
                            <TextInput label="Company Name" value={companyName} onChange={e => setCompanyName(e.target.value)}
                                style={{ flex: 1, minWidth: 200 }} styles={inputStyles} />
                        </Flex>
                        <Flex gap={16} style={{ flexWrap: 'wrap' }}>
                            <Select label="Timezone" value={timezone} onChange={v => setTimezone(v || 'UTC')}
                                style={{ flex: 1, minWidth: 200 }} styles={inputStyles}
                                data={['UTC', 'America/New_York', 'America/Chicago', 'America/Los_Angeles', 'Europe/London', 'Europe/Paris', 'Asia/Dubai', 'Asia/Karachi', 'Asia/Tokyo']} />
                            <Select label="Date Format" value={dateFormat} onChange={v => setDateFormat(v || 'MM/DD/YYYY')}
                                style={{ flex: 1, minWidth: 200 }} styles={inputStyles}
                                data={[{ value: 'MM/DD/YYYY', label: 'MM/DD/YYYY' }, { value: 'DD/MM/YYYY', label: 'DD/MM/YYYY' }, { value: 'YYYY-MM-DD', label: 'YYYY-MM-DD' }]} />
                        </Flex>
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
                                <Badge radius={8} style={{ background: '#f0fdf4', color: BRAND, border: '1px solid #bbf7d0', fontWeight: 800, fontSize: 16, padding: '4px 14px' }}>
                                    {passThreshold}%
                                </Badge>
                            </Flex>
                            <Slider value={passThreshold} onChange={setPassThreshold} min={50} max={95} step={5} color="green"
                                marks={[{ value: 50, label: '50%' }, { value: 70, label: '70%' }, { value: 95, label: '95%' }]}
                                styles={{ mark: { fontSize: 11, color: C.subtle }, markLabel: { fontSize: 11, color: C.subtle } }} mb={8} />
                        </Box>
                        <Divider style={{ borderColor: C.border }} />
                        <SettingRow label="Auto-Analyze on Upload" description="Automatically score calls when uploaded by agents" C={C}>
                            <Switch checked={autoAnalyze} onChange={() => setAutoAnalyze(p => !p)} color="green" size="md" />
                        </SettingRow>
                        <Divider style={{ borderColor: C.border }} />
                        <Flex gap={16} style={{ flexWrap: 'wrap' }}>
                            <Select label="AI Model" value={aiModel} onChange={v => setAiModel(v || 'groq')}
                                style={{ flex: 1, minWidth: 200 }} styles={inputStyles}
                                data={[{ value: 'groq', label: 'Llama 3.3 70B (Groq)' }, { value: 'claude', label: 'Claude (Anthropic)' }, { value: 'gpt4', label: 'GPT-4 (OpenAI)' }]} />
                            <Select label="Score Rounding" value={scoreRounding} onChange={v => setScoreRounding(v || 'whole')}
                                style={{ flex: 1, minWidth: 200 }} styles={inputStyles}
                                data={[{ value: 'whole', label: 'Whole numbers (78%)' }, { value: 'decimal1', label: 'One decimal (78.4%)' }, { value: 'decimal2', label: 'Two decimals (78.42%)' }]} />
                        </Flex>
                    </Stack>
                </Paper>

                {/* ── Notifications ── */}
                <Paper p={24} radius={12} style={cardStyle}>
                    <SectionHeader icon={IconBell} title="Notifications" description="Control what email alerts are sent and to whom" C={C} />
                    <Stack gap={16}>
                        <TextInput
                            label="Admin Email Address"
                            description="All admin notifications will be sent to this address"
                            placeholder="admin@yourcompany.com"
                            value={adminEmail}
                            onChange={e => setAdminEmail(e.target.value)}
                            styles={inputStyles}
                        />
                        <Divider style={{ borderColor: C.border }} />
                        {[
                            { label: 'Email Admin When Call is Scored', desc: 'Admin receives a copy of the score report after each call', state: emailOnScore, set: setEmailOnScore },
                            { label: 'Alert Admin on Failed Call', desc: 'Notify admin immediately when a call fails to process', state: emailOnFail, set: setEmailOnFail },
                            { label: 'Notify Admin on Upload', desc: 'Admin gets an email as soon as an agent uploads a call', state: emailOnUpload, set: setEmailOnUpload },
                            { label: 'Notify Agents of Their Scores', desc: 'Agents receive an email with their full score report after each call', state: agentNotify, set: setAgentNotify },
                            { label: 'Weekly Performance Digest', desc: 'Send a weekly summary of team performance every Monday', state: weeklyDigest, set: setWeeklyDigest },
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

                {/* ── Integrations (Webhook / Power BI) ── */}
                <Paper p={24} radius={12} style={cardStyle}>
                    <SectionHeader icon={IconPlugConnected} title="Integrations" description="Send call data to external tools like Power BI, Slack, or your CRM" C={C} />
                    <Stack gap={20}>

                        {/* Enable toggle */}
                        <SettingRow label="Enable Webhook" description="Fire a POST request to your URL every time a call is scored" C={C}>
                            <Switch checked={webhookEnabled} onChange={() => setWebhookEnabled(p => !p)} color="green" size="md" />
                        </SettingRow>

                        {webhookEnabled && (
                            <>
                                <Divider style={{ borderColor: C.border }} />

                                {/* URL input + test */}
                                <Box>
                                    <Text style={{ fontSize: 13, fontWeight: 500, color: C.text, marginBottom: 6 }}>Webhook URL</Text>
                                    <Flex gap={10} align="flex-end">
                                        <TextInput
                                            placeholder="https://api.powerbi.com/beta/.../datasets/.../rows?..."
                                            value={webhookUrl}
                                            onChange={e => setWebhookUrl(e.target.value)}
                                            style={{ flex: 1 }}
                                            styles={inputStyles}
                                        />
                                        <Button
                                            variant="default"
                                            radius={8}
                                            loading={webhookTesting}
                                            onClick={handleTestWebhook}
                                            disabled={!webhookUrl}
                                            leftSection={<IconRefresh size={14} />}
                                            style={{ border: `1px solid ${C.inputBorder}`, color: C.text, height: 42, fontWeight: 600, fontSize: 13, background: C.inputBg, flexShrink: 0 }}
                                        >
                                            Test
                                        </Button>
                                    </Flex>

                                    {webhookTestResult && (
                                        <Flex gap={8} align="center" mt={10}
                                            style={{ padding: '10px 14px', borderRadius: 8, background: webhookTestResult.ok ? '#f0fdf4' : '#fef2f2', border: `1px solid ${webhookTestResult.ok ? '#bbf7d0' : '#fecaca'}` }}>
                                            {webhookTestResult.ok
                                                ? <IconCircleCheck size={16} color={BRAND} />
                                                : <IconAlertCircle size={16} color="#dc2626" />}
                                            <Text style={{ fontSize: 13, color: webhookTestResult.ok ? '#166534' : '#991b1b' }}>
                                                {webhookTestResult.message}
                                            </Text>
                                        </Flex>
                                    )}
                                </Box>

                                <Divider style={{ borderColor: C.border }} />

                                {/* Power BI Setup Guide */}
                                <Box>
                                    <Flex justify="space-between" align="center" mb={10}>
                                        <Box>
                                            <Text style={{ fontSize: 14, fontWeight: 600, color: C.text }}>🟡 Power BI Setup Guide</Text>
                                            <Text style={{ fontSize: 12, color: C.subtle, marginTop: 2 }}>Free — no Power BI Pro required for streaming datasets</Text>
                                        </Box>
                                        <Button variant="subtle" size="xs" color="green" rightSection={<IconChevronRight size={13} />}
                                            onClick={() => setShowPbiGuide(p => !p)}>
                                            {showPbiGuide ? 'Hide' : 'Show steps'}
                                        </Button>
                                    </Flex>

                                    {showPbiGuide && (
                                        <Stack gap={12}>
                                            <Box style={{ background: C.inputBg, border: `1px solid ${C.border}`, borderRadius: 10, padding: '16px 20px' }}>
                                                {[
                                                    { step: '1', text: 'Go to app.powerbi.com → a Dashboard → Add tile → Real-time data' },
                                                    { step: '2', text: 'Select "Custom Streaming Data" → Add new dataset → Choose API' },
                                                    { step: '3', text: 'Add the fields listed below (use exact names and types)' },
                                                    { step: '4', text: 'Copy the "Push URL" that Power BI gives you' },
                                                    { step: '5', text: 'Paste the URL above, click Test, then Save Changes' },
                                                ].map(({ step, text }) => (
                                                    <Flex key={step} gap={12} mb={step === '5' ? 0 : 10}>
                                                        <Box style={{ width: 22, height: 22, borderRadius: 6, background: '#f0fdf4', border: '1px solid #bbf7d0', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                                            <Text style={{ fontSize: 11, fontWeight: 800, color: BRAND }}>{step}</Text>
                                                        </Box>
                                                        <Text style={{ fontSize: 13, color: C.text, lineHeight: 1.5 }}>{text}</Text>
                                                    </Flex>
                                                ))}
                                            </Box>

                                            {/* Field definitions */}
                                            <Box>
                                                <Flex justify="space-between" align="center" mb={8}>
                                                    <Text style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: C.muted }}>
                                                        Required Fields
                                                    </Text>
                                                    <Button variant="subtle" size="xs" color="green"
                                                        leftSection={copied ? <IconCheck size={12} /> : <IconCopy size={12} />}
                                                        onClick={copyFields}>
                                                        {copied ? 'Copied!' : 'Copy all'}
                                                    </Button>
                                                </Flex>
                                                <Box style={{ background: C.inputBg, border: `1px solid ${C.border}`, borderRadius: 8, overflow: 'hidden' }}>
                                                    {POWERBI_FIELDS.map((f, i) => (
                                                        <Flex key={f.name} justify="space-between" align="center"
                                                            style={{ padding: '8px 14px', borderBottom: i < POWERBI_FIELDS.length - 1 ? `1px solid ${C.border}` : 'none' }}>
                                                            <Text style={{ fontSize: 12, fontFamily: 'monospace', color: C.text, fontWeight: 600 }}>{f.name}</Text>
                                                            <Badge size="xs" radius={4} style={{ background: '#f0fdf4', color: BRAND, border: '1px solid #bbf7d0' }}>{f.type}</Badge>
                                                        </Flex>
                                                    ))}
                                                </Box>
                                                <Text style={{ fontSize: 12, color: C.subtle, marginTop: 8 }}>
                                                    💡 After setup, build line charts using <strong>score</strong> over <strong>date</strong>, and slice by <strong>agentName</strong> or <strong>scorecard</strong>.
                                                </Text>
                                            </Box>

                                            <Button
                                                component="a"
                                                href="https://app.powerbi.com"
                                                target="_blank"
                                                variant="default"
                                                radius={8}
                                                rightSection={<IconExternalLink size={14} />}
                                                style={{ border: `1px solid ${C.inputBorder}`, color: C.text, fontWeight: 500, fontSize: 13, alignSelf: 'flex-start', background: C.inputBg }}
                                            >
                                                Open Power BI
                                            </Button>
                                        </Stack>
                                    )}
                                </Box>
                            </>
                        )}
                    </Stack>
                </Paper>

                {/* ── Security ── */}
                <Paper p={24} radius={12} style={cardStyle}>
                    <SectionHeader icon={IconShield} title="Security" description="Authentication and session settings" C={C} />
                    <Stack gap={16}>
                        <SettingRow label="Require 2FA for All Users" description="All users must verify via OTP on every login" C={C}>
                            <Switch color="green" size="md" defaultChecked={false} />
                        </SettingRow>
                        <Divider style={{ borderColor: C.border }} />
                        <SettingRow label="Allow Social Login" description="Users can sign in with Google in addition to email OTP" C={C}>
                            <Switch color="green" size="md" defaultChecked={true} />
                        </SettingRow>
                        <Divider style={{ borderColor: C.border }} />
                        <Select
                            label="Session Timeout"
                            defaultValue="8h"
                            styles={inputStyles}
                            style={{ maxWidth: 300 }}
                            data={[{ value: '1h', label: '1 hour' }, { value: '8h', label: '8 hours' }, { value: '24h', label: '24 hours' }, { value: '7d', label: '7 days' }]}
                        />
                    </Stack>
                </Paper>

                {/* ── Danger Zone ── */}
                <Paper p={24} radius={12} style={{ border: '1px solid #fecaca', background: C.surface }}>
                    <DangerHeader icon={IconAlertTriangle} title="Danger Zone" description="Irreversible actions — proceed with caution" C={C} danger />
                    <Stack gap={12}>
                        {[
                            { label: 'Delete All Call Data', desc: 'Permanently delete all call recordings, transcripts, and scores', action: 'delete-calls' },
                            { label: 'Reset All Settings', desc: 'Restore all settings to their factory defaults', action: 'reset-settings' },
                        ].map(item => (
                            <Flex key={item.action} justify="space-between" align="center" gap={16}
                                style={{ padding: '16px', borderRadius: 10, border: '1px solid #fee2e2', background: '#fef2f2', flexWrap: 'wrap' }}>
                                <Box>
                                    <Text style={{ fontSize: 14, fontWeight: 600, color: '#dc2626' }}>{item.label}</Text>
                                    <Text style={{ fontSize: 12, color: '#9ca3af', marginTop: 2 }}>{item.desc}</Text>
                                </Box>
                                <Button variant="outline" color="red" radius={8} size="sm"
                                    leftSection={<IconTrash size={14} />}
                                    onClick={() => setDangerModal(item.action)}
                                    style={{ fontWeight: 600, fontSize: 13 }}>
                                    {item.label.split(' ').slice(0, 2).join(' ')}
                                </Button>
                            </Flex>
                        ))}
                    </Stack>
                </Paper>

            </Stack>

            {/* Danger confirmation modal */}
            <Modal opened={!!dangerModal} onClose={() => setDangerModal(null)} title="Are you sure?" centered radius={12}
                styles={{ content: { background: C.surface, border: `1px solid ${C.border}` }, header: { background: C.surface, borderBottom: `1px solid ${C.border}` } }}>
                <Text style={{ fontSize: 14, color: C.text, marginBottom: 20 }}>
                    This action is <strong>permanent and cannot be undone</strong>. All affected data will be deleted.
                </Text>
                <Flex gap={12}>
                    <Button variant="default" radius={8} onClick={() => setDangerModal(null)} style={{ flex: 1, border: `1px solid ${C.border}`, color: C.text, background: C.inputBg }}>
                        Cancel
                    </Button>
                    <Button color="red" radius={8} onClick={() => setDangerModal(null)} style={{ flex: 1 }}>
                        Yes, proceed
                    </Button>
                </Flex>
            </Modal>
        </Box>
    )
}