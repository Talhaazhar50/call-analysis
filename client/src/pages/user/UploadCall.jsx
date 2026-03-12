import axios from "axios";
import { Alert, Badge, Box, Button, Card, Group, Paper, Stack, Text, Textarea } from "@mantine/core";
import { IconAlertCircle, IconArrowRight, IconBrain, IconCircleCheck, IconFileMusic, IconMicrophone, IconUpload, IconX } from "@tabler/icons-react";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";

const BRAND = '#16a34a'
const API = import.meta.env.VITE_API_URL || 'http://localhost:8000/api'
const ANIMATIONS = `
@keyframes fadeScaleIn{from{opacity:0;transform:scale(0.88)}to{opacity:1;transform:scale(1)}}
@keyframes spinRing{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
@keyframes pulseGlow{0%,100%{opacity:0.4;transform:scale(1)}50%{opacity:0.85;transform:scale(1.1)}}
@keyframes iconBob{0%,100%{transform:translateY(0px)}50%{transform:translateY(-6px)}}
`

export default function UploadCall() {
    const { dark, C } = useOutletContext()
    const navigate = useNavigate()
    const fileRef = useRef()
    const pollRef = useRef(null)

    const [file, setFile] = useState(null)
    const [dragOver, setDragOver] = useState(false)
    const [scorecards, setScorecards] = useState([])
    const [selectedScorecard, setSelectedScorecard] = useState(null)
    const [notes, setNotes] = useState('')
    const [stage, setStage] = useState('idle')
    const [progress, setProgress] = useState(0)
    const [callId, setCallId] = useState(null)
    const [error, setError] = useState('')
    const [resultScore, setResultScore] = useState(null)

    const token = localStorage.getItem('token')
    const headers = { Authorization: `Bearer ${token}` }

    useEffect(() => {
        axios.get(`${API}/scorecards`, { headers }).then(({ data }) => setScorecards(data.filter(s => s.active))).catch(() => { })
    }, [])

    useEffect(() => () => { if (pollRef.current) clearInterval(pollRef.current) }, [])

const handleFile = (f) => {
    if (!f) return
    const validExt = /\.(mp3|wav|m4a|ogg|flac|webm)$/i.test(f.name)
    const validMime = f.type.startsWith('audio/') || 
                      f.type === 'video/webm' || 
                      f.type === 'video/mpeg' ||
                      f.type === 'audio/mpeg' ||
                      f.type === ''  // some files report no MIME type
    if (!validExt && !validMime) { 
        setError('Please upload an audio file (mp3, wav, m4a, ogg, flac, webm, mpeg)') 
        return 
    }
    setError(''); setFile(f)
}
    const startPolling = (id) => {
        let ticks = 0
        pollRef.current = setInterval(async () => {
            try {
                const { data } = await axios.get(`${API}/calls/${id}/status`, { headers })
                ticks++
                setProgress(Math.min(88, 20 + ticks * 3))
                if (data.status === 'scoring') setStage('scoring')
                else if (data.status === 'done') {
                    clearInterval(pollRef.current); setProgress(100); setResultScore(data.percentage); setStage('done'); setCallId(id)
                } else if (data.status === 'failed') {
                    clearInterval(pollRef.current); setStage('failed'); setError(data.errorMessage || 'Processing failed')
                }
            } catch { clearInterval(pollRef.current); setStage('failed'); setError('Lost connection to server') }
        }, 2500)
    }

    const handleSubmit = async () => {
        if (!file || !selectedScorecard) return
        setError(''); setStage('uploading'); setProgress(10)
        const formData = new FormData()
        formData.append('audio', file)
        formData.append('scorecardId', selectedScorecard._id)
        formData.append('notes', notes)
        formData.append('passThreshold', selectedScorecard.passThreshold || 70)
        try {
            const { data } = await axios.post(`${API}/calls/upload`, formData, { headers: { ...headers, 'Content-Type': 'multipart/form-data' } })
            setStage('transcribing'); setProgress(20); startPolling(data.callId)
        } catch (err) { setStage('failed'); setError(err.response?.data?.message || 'Upload failed') }
    }

    const stageConfig = {
        uploading: { icon: IconUpload, label: 'Uploading audio file...', sub: 'Sending your file securely', color: '#2563eb', step: 0 },
        transcribing: { icon: IconMicrophone, label: 'Transcribing with AssemblyAI...', sub: 'Converting speech to text', color: '#7c3aed', step: 1 },
        scoring: { icon: IconBrain, label: 'Scoring with Claude AI...', sub: 'Analyzing against your scorecard', color: BRAND, step: 2 },
    }

    if (['uploading', 'transcribing', 'scoring'].includes(stage)) {
        const info = stageConfig[stage]; const Icon = info.icon
        return (
            <Box p="xl" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
                <style>{ANIMATIONS}</style>
                <Card p={40} radius={20} style={{ background: C.surface, border: `1px solid ${C.border}`, maxWidth: 480, width: '100%', textAlign: 'center', animation: 'fadeScaleIn 0.4s ease', boxShadow: '0 8px 32px rgba(0,0,0,0.08)' }}>
                    <div style={{ position: 'relative', width: 88, height: 88, margin: '0 auto 24px' }}>
                        <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: `${info.color}18`, animation: 'pulseGlow 2s ease-in-out infinite' }} />
                        <div style={{ width: 88, height: 88, borderRadius: '50%', background: `${info.color}14`, border: `2px solid ${info.color}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                            <Icon size={36} color={info.color} style={{ animation: 'iconBob 2s ease-in-out infinite' }} />
                        </div>
                        <div style={{ position: 'absolute', inset: -4, borderRadius: '50%', border: '2px solid transparent', borderTopColor: info.color, animation: 'spinRing 1.2s linear infinite' }} />
                    </div>
                    <Text fw={700} size="lg" c={C.text} mb={4}>{info.label}</Text>
                    <Text size="sm" c={C.muted} mb={24}>{info.sub}</Text>
                    <div style={{ height: 8, borderRadius: 99, background: dark ? '#2a2d3a' : '#f3f4f6', overflow: 'hidden', marginBottom: 8 }}>
                        <div style={{ height: '100%', width: `${progress}%`, borderRadius: 99, background: `linear-gradient(90deg,${info.color}bb,${info.color})`, transition: 'width 0.3s ease' }} />
                    </div>
                    <Group justify="space-between">
                        <Text size="xs" c={C.subtle} style={{ maxWidth: 220, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{file?.name}</Text>
                        <Text size="xs" fw={700} c={info.color}>{progress}%</Text>
                    </Group>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: 28, gap: 0 }}>
                        {[{ key: 'uploading', label: 'Upload', Icon: IconUpload, step: 0 }, { key: 'transcribing', label: 'Transcribe', Icon: IconMicrophone, step: 1 }, { key: 'scoring', label: 'AI Score', Icon: IconBrain, step: 2 }].map((s, i) => {
                            const isDone = info.step > s.step; const isActive = info.step === s.step
                            const col = isDone ? BRAND : isActive ? info.color : (dark ? '#3a3f52' : '#d1d5db')
                            return (<div key={s.key} style={{ display: 'flex', alignItems: 'center' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                                    <div style={{ width: 36, height: 36, borderRadius: '50%', background: isDone ? '#f0fdf4' : isActive ? `${info.color}18` : (dark ? '#2a2d3a' : '#f3f4f6'), border: `2px solid ${col}`, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.3s' }}>
                                        {isDone ? <IconCircleCheck size={18} color={BRAND} /> : <s.Icon size={16} color={col} />}
                                    </div>
                                    <Text size="xs" fw={isActive ? 700 : 400} c={isActive ? info.color : isDone ? BRAND : C.subtle}>{s.label}</Text>
                                </div>
                                {i < 2 && <div style={{ width: 32, height: 2, background: isDone ? BRAND : (dark ? '#2a2d3a' : '#e5e7eb'), margin: '0 4px', marginBottom: 20, transition: 'background 0.3s' }} />}
                            </div>)
                        })}
                    </div>
                </Card>
            </Box>
        )
    }

    if (stage === 'done') {
        const pass = resultScore >= (selectedScorecard?.passThreshold || 70)
        return (
            <Box p="xl" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
                <style>{ANIMATIONS}</style>
                <Card p={40} radius={20} style={{ background: C.surface, border: `1px solid ${C.border}`, maxWidth: 440, width: '100%', textAlign: 'center', animation: 'fadeScaleIn 0.4s ease', boxShadow: '0 8px 32px rgba(0,0,0,0.08)' }}>
                    <div style={{ width: 72, height: 72, borderRadius: '50%', background: pass ? '#f0fdf4' : '#fef2f2', border: `2px solid ${pass ? '#bbf7d0' : '#fecaca'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                        <IconCircleCheck size={36} color={pass ? BRAND : '#ef4444'} />
                    </div>
                    <Text fw={800} size="xl" c={C.text} mb={4}>Analysis Complete!</Text>
                    <Text size="sm" c={C.muted} mb={24}>Scored against <strong>{selectedScorecard?.name}</strong></Text>
                    <div style={{ fontSize: 52, fontWeight: 800, color: pass ? BRAND : '#ef4444', lineHeight: 1, marginBottom: 8 }}>{resultScore}%</div>
                    <Badge radius={6} style={{ background: pass ? '#f0fdf4' : '#fef2f2', color: pass ? BRAND : '#ef4444', border: `1px solid ${pass ? '#bbf7d0' : '#fecaca'}`, fontSize: 13, padding: '6px 20px', marginBottom: 24 }}>
                        {pass ? '✓ PASS' : '✗ FAIL'}
                    </Badge>
                    <Stack gap="sm">
                        <Button onClick={() => navigate(`/dashboard/calls/${callId}`)} fullWidth size="md" radius="md" rightSection={<IconArrowRight size={16} />} style={{ background: BRAND, fontWeight: 700, border: 'none' }}>View Full Results</Button>
                        <Button variant="subtle" color="gray" fullWidth size="md" radius="md" onClick={() => { setFile(null); setStage('idle'); setProgress(0); setNotes(''); setSelectedScorecard(null) }} style={{ color: C.muted }}>Upload Another Call</Button>
                    </Stack>
                </Card>
            </Box>
        )
    }

    return (
        <Box p="xl" maw={900}>
            <style>{ANIMATIONS}</style>
            {error && <Alert icon={<IconAlertCircle size={16} />} color="red" mb={16} withCloseButton onClose={() => setError('')}>{error}</Alert>}
            <Stack gap={4} mb="xl">
                <Text fw={800} size="xl" c={C.text} style={{ letterSpacing: '-0.5px', fontSize: 24 }}>Upload a Call</Text>
                <Text size="sm" c={C.muted}>Upload a recording and get your AI score in under 60 seconds.</Text>
            </Stack>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(320px,1fr))', gap: 16, alignItems: 'start' }}>
                <Stack gap="md">
                    <Card padding={0} radius="md" style={{ background: C.surface, border: `1px solid ${C.border}`, overflow: 'hidden' }}>
                        <Box p="md" style={{ borderBottom: `1px solid ${C.border}` }}><Text fw={700} size="sm" c={C.text}>Audio File</Text></Box>
                        <Box p="md">
                            {!file ? (
                                <Box onDragOver={(e) => { e.preventDefault(); setDragOver(true) }} onDragLeave={() => setDragOver(false)} onDrop={(e) => { e.preventDefault(); setDragOver(false); handleFile(e.dataTransfer.files[0]) }} onClick={() => fileRef.current?.click()}
                                    style={{ border: `2px dashed ${dragOver ? BRAND : C.border}`, borderRadius: 10, padding: '32px 20px', textAlign: 'center', cursor: 'pointer', background: dragOver ? '#f0fdf4' : 'transparent', transition: 'all 0.2s' }}>
                                    <input ref={fileRef} type="file" accept=".mp3,.wav,.m4a,.ogg,.flac,.webm" style={{ display: 'none' }} onChange={(e) => handleFile(e.target.files[0])} />
                                    <IconUpload size={28} color={dragOver ? BRAND : C.subtle} style={{ marginBottom: 8 }} />
                                    <Text size="sm" c={C.text} fw={600} mb={2}>Drop audio file here</Text>
                                    <Text size="xs" c={C.muted}>mp3, wav, m4a, ogg · max 100MB</Text>
                                </Box>
                            ) : (
                                <Group justify="space-between" style={{ padding: '12px 14px', borderRadius: 10, background: dark ? '#1a1d2e' : '#f9fafb', border: `1px solid ${C.border}` }}>
                                    <Group gap={10}>
                                        <div style={{ width: 36, height: 36, borderRadius: 8, background: '#f0fdf4', border: '1px solid #bbf7d0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <IconFileMusic size={18} color={BRAND} />
                                        </div>
                                        <div>
                                            <Text size="sm" fw={600} c={C.text} style={{ maxWidth: 180, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{file.name}</Text>
                                            <Text size="xs" c={C.muted}>{(file.size / 1024 / 1024).toFixed(1)} MB</Text>
                                        </div>
                                    </Group>
                                    <IconX size={16} color={C.muted} style={{ cursor: 'pointer' }} onClick={() => setFile(null)} />
                                </Group>
                            )}
                        </Box>
                    </Card>
                    <Card padding={0} radius="md" style={{ background: C.surface, border: `1px solid ${C.border}`, overflow: 'hidden' }}>
                        <Box p="md" style={{ borderBottom: `1px solid ${C.border}` }}><Text fw={700} size="sm" c={C.text}>Notes <span style={{ color: C.muted, fontWeight: 400 }}>(optional)</span></Text></Box>
                        <Box p="md">
                            <Textarea placeholder="Add context about this call..." value={notes} onChange={(e) => setNotes(e.target.value)} minRows={3} styles={{ input: { background: C.inputBg, border: `1px solid ${C.inputBorder}`, color: C.text, borderRadius: 8, fontSize: 13 } }} />
                        </Box>
                    </Card>
                </Stack>
                <Stack gap="md">
                    <Card padding={0} radius="md" style={{ background: C.surface, border: `1px solid ${C.border}`, overflow: 'hidden' }}>
                        <Box p="md" style={{ borderBottom: `1px solid ${C.border}` }}><Text fw={700} size="sm" c={C.text}>Select Scorecard</Text></Box>
                        <Box p="md">
                            {scorecards.length === 0 ? (
                                <Text size="sm" c={C.muted} ta="center" py="md">No active scorecards. Create one in Admin → Scorecards.</Text>
                            ) : (
                                <Stack gap={8}>
                                    {scorecards.map(sc => {
                                        const selected = selectedScorecard?._id === sc._id
                                        return (
                                            <Paper key={sc._id} p={14} radius={10} onClick={() => setSelectedScorecard(sc)} style={{ border: `2px solid ${selected ? BRAND : C.border}`, background: selected ? '#f0fdf4' : C.surface, cursor: 'pointer', transition: 'all 0.15s' }}>
                                                <Group justify="space-between">
                                                    <div>
                                                        <Text size="sm" fw={700} c={selected ? BRAND : C.text}>{sc.name}</Text>
                                                        <Text size="xs" c={C.muted}>{sc.criteria.length} criteria · {sc.team || 'No team'}</Text>
                                                    </div>
                                                    {selected && <IconCircleCheck size={20} color={BRAND} />}
                                                </Group>
                                            </Paper>
                                        )
                                    })}
                                </Stack>
                            )}
                        </Box>
                    </Card>
                    <Button fullWidth size="lg" radius="md" disabled={!file || !selectedScorecard} onClick={handleSubmit}
                        style={{ background: file && selectedScorecard ? BRAND : undefined, border: 'none', fontWeight: 700, height: 50 }}>
                        Analyze Call
                    </Button>
                </Stack>
            </div>
        </Box>
    )
}