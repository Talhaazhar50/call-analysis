import { useRef, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";

import {
    Box, Stack, Group, Text, Card, Button, Badge,
    ThemeIcon, Paper, Textarea
} from '@mantine/core'
import {
    IconUpload, IconMusic, IconX, IconBrain, IconMicrophone,
    IconCircleCheck, IconArrowRight, IconFileMusic
} from '@tabler/icons-react'

const BRAND = '#16a34a'

const scorecards = [
    { id: 1, name: 'Sales QA', criteria: 5, passThreshold: 70, icon: '💼' },
    { id: 2, name: 'Support QA', criteria: 6, passThreshold: 75, icon: '🎧' },
    { id: 3, name: 'Onboarding QA', criteria: 4, passThreshold: 80, icon: '🚀' },
]

export default function UploadCall() {
    const { dark, C } = useOutletContext()
    const navigate = useNavigate()
    const fileRef = useRef()

    const [file, setFile] = useState(null)
    const [dragOver, setDragOver] = useState(false)
    const [selectedScorecard, setSelectedScorecard] = useState(null)
    const [notes, setNotes] = useState('')
    const [stage, setStage] = useState('idle')
    const [progress, setProgress] = useState(0)

    const stageConfig = {
        uploading: { icon: IconUpload, label: 'Uploading audio file...', sub: 'Sending your file securely', color: '#2563eb', step: 0 },
        transcribing: { icon: IconMicrophone, label: 'Transcribing with Whisper AI...', sub: 'Converting speech to text', color: '#7c3aed', step: 1 },
        scoring: { icon: IconBrain, label: 'Scoring with Claude AI...', sub: 'Analyzing against your scorecard', color: BRAND, step: 2 },
    }

    const handleFile = (f) => {
        if (!f) return
        if (!f.name.match(/\.(mp3|wav|m4a)$/i)) return
        setFile(f)
    }

    const handleDrop = (e) => {
        e.preventDefault()
        setDragOver(false)
        handleFile(e.dataTransfer.files[0])
    }

    const simulateUpload = () => {
        if (!file || !selectedScorecard) return
        const stages = [
            { stage: 'uploading', duration: 1800 },
            { stage: 'transcribing', duration: 2500 },
            { stage: 'scoring', duration: 2000 },
            { stage: 'done', duration: 0 },
        ]
        let delay = 0
        stages.forEach(({ stage: s, duration }) => {
            setTimeout(() => {
                setStage(s)
                setProgress(0)
            }, delay)
            if (duration > 0) {
                for (let t = 0; t <= duration; t += 50) {
                    setTimeout(() => setProgress(Math.round((t / duration) * 100)), delay + t)
                }
            }
            delay += duration
        })
    }

    const ANIMATIONS = `
    @keyframes fadeScaleIn {
      from { opacity: 0; transform: scale(0.88); }
      to   { opacity: 1; transform: scale(1); }
    }
    @keyframes slideUp {
      from { opacity: 0; transform: translateY(18px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    @keyframes spinRing {
      from { transform: rotate(0deg); }
      to   { transform: rotate(360deg); }
    }
    @keyframes pulseGlow {
      0%, 100% { opacity: 0.4; transform: scale(1); }
      50%      { opacity: 0.85; transform: scale(1.1); }
    }
    @keyframes iconBob {
      0%, 100% { transform: translateY(0px); }
      50%      { transform: translateY(-6px); }
    }
    @keyframes dotPulse {
      0%, 80%, 100% { transform: scale(0.5); opacity: 0.3; }
      40%           { transform: scale(1);   opacity: 1; }
    }
    @keyframes ringPop {
      0%   { transform: scale(0); opacity: 0; }
      60%  { transform: scale(1.2); opacity: 1; }
      100% { transform: scale(1); opacity: 1; }
    }
    @keyframes scorePop {
      0%   { transform: scale(0.5); opacity: 0; }
      70%  { transform: scale(1.08); opacity: 1; }
      100% { transform: scale(1); opacity: 1; }
    }
    @keyframes confettiFall {
      0%   { transform: translateY(-10px) rotate(0deg);   opacity: 1; }
      100% { transform: translateY(90px)  rotate(400deg); opacity: 0; }
    }
    @keyframes pulseRing {
      0%   { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(22,163,74,0.45); }
      70%  { transform: scale(1);    box-shadow: 0 0 0 18px rgba(22,163,74,0); }
      100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(22,163,74,0); }
    }
    .proc-card   { animation: fadeScaleIn 0.45s cubic-bezier(0.16,1,0.3,1) forwards; }
    .proc-icon   { animation: iconBob 2.2s ease-in-out infinite; }
    .proc-label  { animation: slideUp 0.4s ease 0.15s both; }
    .proc-sub    { animation: slideUp 0.4s ease 0.25s both; }
    .proc-bar    { animation: slideUp 0.4s ease 0.35s both; }
    .proc-steps  { animation: slideUp 0.4s ease 0.45s both; }
    .done-card   { animation: fadeScaleIn 0.5s cubic-bezier(0.16,1,0.3,1) forwards; }
    .done-ring   { animation: ringPop 0.6s cubic-bezier(0.16,1,0.3,1) 0.2s both; }
    .done-title  { animation: slideUp 0.5s ease 0.35s both; }
    .done-file   { animation: slideUp 0.5s ease 0.45s both; }
    .done-score  { animation: scorePop 0.6s cubic-bezier(0.16,1,0.3,1) 0.55s both; }
    .done-meta   { animation: slideUp 0.4s ease 0.65s both; }
    .done-divider{ animation: slideUp 0.4s ease 0.70s both; }
    .done-btn1   { animation: slideUp 0.4s ease 0.75s both; }
    .done-btn2   { animation: slideUp 0.4s ease 0.85s both; }
    .pulse-icon  { animation: pulseRing 2s ease-in-out 0.9s infinite; }
    .spin-ring {
      position: absolute; inset: -6px; border-radius: 50%;
      border: 3px solid transparent;
      border-top-color: var(--rc); border-right-color: var(--rc);
      animation: spinRing 1.2s linear infinite;
    }
    .spin-ring-slow {
      position: absolute; inset: -13px; border-radius: 50%;
      border: 2px solid transparent;
      border-bottom-color: var(--rc); border-left-color: var(--rc);
      opacity: 0.28;
      animation: spinRing 2.6s linear infinite reverse;
    }
    .glow-orb {
      position: absolute; inset: -18px; border-radius: 50%;
      animation: pulseGlow 2.2s ease-in-out infinite;
    }
    .dot { display: inline-block; width: 6px; height: 6px; border-radius: 50%; margin: 0 2px; }
    .dot:nth-child(1) { animation: dotPulse 1.4s ease-in-out 0.0s infinite; }
    .dot:nth-child(2) { animation: dotPulse 1.4s ease-in-out 0.2s infinite; }
    .dot:nth-child(3) { animation: dotPulse 1.4s ease-in-out 0.4s infinite; }
    .confetti-piece {
      position: absolute; border-radius: 2px;
      animation: confettiFall 1.4s ease-out forwards;
    }
  `

    // ── PROCESSING SCREEN ──
    if (stage !== 'idle' && stage !== 'done') {
        const info = stageConfig[stage]
        return (
            <Box style={{ minHeight: 'calc(100vh - 64px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
                <style>{ANIMATIONS}</style>
                <Card className="proc-card" padding="xl" radius="xl" style={{
                    background: dark ? '#1a1d27' : '#ffffff',
                    border: `1px solid ${dark ? '#2a2d3a' : '#e5e7eb'}`,
                    boxShadow: dark ? '0 32px 80px rgba(0,0,0,0.45)' : '0 32px 80px rgba(0,0,0,0.09)',
                    width: '100%', maxWidth: 460, textAlign: 'center', position: 'relative', overflow: 'hidden',
                }}>
                    {/* BG glow */}
                    <div style={{
                        position: 'absolute', top: -80, left: '50%', transform: 'translateX(-50%)',
                        width: 340, height: 340, borderRadius: '50%',
                        background: `radial-gradient(circle, ${info.color}14 0%, transparent 65%)`,
                        pointerEvents: 'none',
                    }} />

                    {/* Animated icon */}
                    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 28, position: 'relative', zIndex: 1 }}>
                        <div style={{ position: 'relative', width: 80, height: 80 }}>
                            <div className="glow-orb" style={{ background: `${info.color}16` }} />
                            <div className="spin-ring" style={{ '--rc': info.color }} />
                            <div className="spin-ring-slow" style={{ '--rc': info.color }} />
                            <div className="proc-icon" style={{
                                position: 'absolute', inset: 0, borderRadius: '50%',
                                background: `linear-gradient(135deg, ${info.color}22, ${info.color}10)`,
                                border: `1.5px solid ${info.color}35`,
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                            }}>
                                <info.icon size={32} color={info.color} strokeWidth={1.5} />
                            </div>
                        </div>
                    </div>

                    {/* Label */}
                    <Text className="proc-label" fw={800} style={{ fontSize: 22, color: C.text, letterSpacing: '-0.5px', marginBottom: 6, position: 'relative', zIndex: 1 }}>
                        {info.label}
                    </Text>

                    {/* Sub + dots */}
                    <div className="proc-sub" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, marginBottom: 32, position: 'relative', zIndex: 1 }}>
                        <Text size="sm" c={C.muted}>{info.sub}</Text>
                        <span>
                            <span className="dot" style={{ background: C.muted }} />
                            <span className="dot" style={{ background: C.muted }} />
                            <span className="dot" style={{ background: C.muted }} />
                        </span>
                    </div>

                    {/* Progress bar */}
                    <div className="proc-bar" style={{ position: 'relative', zIndex: 1, marginBottom: 8 }}>
                        <div style={{ height: 8, borderRadius: 99, background: dark ? '#2a2d3a' : '#f3f4f6', overflow: 'hidden' }}>
                            <div style={{
                                height: '100%', width: `${progress}%`, borderRadius: 99,
                                background: `linear-gradient(90deg, ${info.color}bb, ${info.color})`,
                                transition: 'width 0.12s linear', position: 'relative', overflow: 'hidden',
                            }}>
                                <div style={{
                                    position: 'absolute', inset: 0,
                                    background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.28), transparent)',
                                    animation: 'spinRing 1.6s linear infinite',
                                }} />
                            </div>
                        </div>
                        <Group justify="space-between" mt={6}>
                            <Text size="xs" c={C.subtle} style={{ maxWidth: 220, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{file?.name}</Text>
                            <Text size="xs" fw={700} c={info.color}>{progress}%</Text>
                        </Group>
                    </div>

                    {/* Step indicators */}
                    <div className="proc-steps" style={{ position: 'relative', zIndex: 1, marginTop: 28 }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            {[
                                { key: 'uploading', label: 'Upload', Icon: IconUpload, step: 0 },
                                { key: 'transcribing', label: 'Transcribe', Icon: IconMicrophone, step: 1 },
                                { key: 'scoring', label: 'AI Score', Icon: IconBrain, step: 2 },
                            ].map((s, i) => {
                                const isDone = info.step > s.step
                                const isActive = info.step === s.step
                                const col = isDone ? BRAND : isActive ? info.color : (dark ? '#3a3f52' : '#d1d5db')
                                return (
                                    <div key={s.key} style={{ display: 'flex', alignItems: 'center' }}>
                                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                                            <div style={{
                                                width: 42, height: 42, borderRadius: '50%',
                                                background: isDone ? '#f0fdf4' : isActive ? `${info.color}18` : (dark ? '#22263a' : '#f9fafb'),
                                                border: `2px solid ${col}`,
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                transition: 'all 0.4s ease',
                                            }}>
                                                {isDone
                                                    ? <IconCircleCheck size={18} color={BRAND} />
                                                    : <s.Icon size={16} color={isActive ? info.color : (dark ? '#4a5568' : '#9ca3af')} />
                                                }
                                            </div>
                                            <Text size="xs" fw={isActive ? 700 : 500} style={{ color: isDone ? BRAND : isActive ? info.color : C.muted, transition: 'color 0.4s' }}>
                                                {s.label}
                                            </Text>
                                        </div>
                                        {i < 2 && (
                                            <div style={{
                                                width: 56, height: 2, marginBottom: 22, marginLeft: 4, marginRight: 4,
                                                background: isDone ? BRAND : (dark ? '#2a2d3a' : '#e5e7eb'),
                                                borderRadius: 99, transition: 'background 0.4s ease',
                                            }} />
                                        )}
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </Card>
            </Box>
        )
    }

    // ── DONE SCREEN ──
    if (stage === 'done') {
        const confetti = [
            { left: '12%', color: '#16a34a', delay: '0.55s', size: 10 },
            { left: '27%', color: '#2563eb', delay: '0.65s', size: 7 },
            { left: '45%', color: '#f59e0b', delay: '0.60s', size: 9 },
            { left: '60%', color: '#7c3aed', delay: '0.72s', size: 8 },
            { left: '76%', color: '#ea580c', delay: '0.68s', size: 6 },
            { left: '20%', color: '#0891b2', delay: '0.78s', size: 7 },
            { left: '70%', color: '#16a34a', delay: '0.82s', size: 10 },
            { left: '40%', color: '#dc2626', delay: '0.88s', size: 6 },
            { left: '55%', color: '#f59e0b', delay: '0.92s', size: 8 },
        ]
        return (
            <Box style={{ minHeight: 'calc(100vh - 64px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
                <style>{ANIMATIONS}</style>
                <Card className="done-card" padding="xl" radius="xl" style={{
                    background: dark ? '#1a1d27' : '#ffffff',
                    border: `1px solid ${dark ? '#2a2d3a' : '#e5e7eb'}`,
                    boxShadow: dark
                        ? '0 32px 80px rgba(0,0,0,0.45), 0 0 0 1px rgba(22,163,74,0.08)'
                        : '0 32px 80px rgba(0,0,0,0.09), 0 0 0 1px rgba(22,163,74,0.05)',
                    width: '100%', maxWidth: 480, textAlign: 'center',
                    position: 'relative', overflow: 'hidden',
                }}>
                    {/* Confetti */}
                    {confetti.map((c, i) => (
                        <div key={i} className="confetti-piece" style={{
                            left: c.left, top: 0,
                            width: c.size, height: c.size,
                            background: c.color,
                            animationDelay: c.delay,
                            borderRadius: i % 2 === 0 ? '50%' : '2px',
                        }} />
                    ))}

                    {/* BG glow */}
                    <div style={{
                        position: 'absolute', top: -70, left: '50%', transform: 'translateX(-50%)',
                        width: 320, height: 320, borderRadius: '50%',
                        background: 'radial-gradient(circle, rgba(22,163,74,0.09) 0%, transparent 65%)',
                        pointerEvents: 'none',
                    }} />

                    {/* Icon ring */}
                    <div className="done-ring" style={{ display: 'flex', justifyContent: 'center', marginBottom: 20, position: 'relative', zIndex: 1 }}>
                        <div className="pulse-icon" style={{
                            width: 80, height: 80, borderRadius: '50%',
                            background: 'linear-gradient(135deg, #f0fdf4, #dcfce7)',
                            border: '2px solid #86efac',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>
                            <IconCircleCheck size={40} color={BRAND} strokeWidth={1.5} />
                        </div>
                    </div>

                    <Text className="done-title" fw={800} style={{ fontSize: 26, color: C.text, letterSpacing: '-0.5px', marginBottom: 6, position: 'relative', zIndex: 1 }}>
                        Call Scored! 🎉
                    </Text>
                    <Text className="done-file" size="sm" c={C.muted} mb="xl" style={{ position: 'relative', zIndex: 1 }}>
                        {file?.name}
                    </Text>

                    {/* Score ring */}
                    <div className="done-score" style={{ position: 'relative', zIndex: 1, marginBottom: 16 }}>
                        <div style={{
                            background: dark ? 'rgba(22,163,74,0.1)' : '#f0fdf4',
                            border: `1.5px solid ${dark ? 'rgba(22,163,74,0.25)' : '#86efac'}`,
                            borderRadius: 20, padding: '24px 32px',
                            display: 'inline-block', minWidth: 220,
                        }}>
                            <div style={{ position: 'relative', display: 'inline-block', marginBottom: 10 }}>
                                <svg width="110" height="110" viewBox="0 0 110 110">
                                    <circle cx="55" cy="55" r="46" fill="none" stroke={dark ? '#2a2d3a' : '#e5e7eb'} strokeWidth="8" />
                                    <circle cx="55" cy="55" r="46" fill="none" stroke={BRAND} strokeWidth="8"
                                        strokeDasharray={`${(84 / 100) * 289} 289`}
                                        strokeLinecap="round" transform="rotate(-90 55 55)"
                                        style={{ transition: 'stroke-dasharray 1.4s cubic-bezier(0.16,1,0.3,1) 0.7s' }}
                                    />
                                </svg>
                                <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                                    <Text fw={900} style={{ fontSize: 28, color: BRAND, lineHeight: 1, letterSpacing: '-1px' }}>84%</Text>
                                    <Text style={{ fontSize: 10, color: C.muted, fontWeight: 600, letterSpacing: '0.05em' }}>SCORE</Text>
                                </div>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'center' }}>
                                <Badge color="green" variant="filled" size="lg" radius="md"
                                    style={{ fontSize: 13, fontWeight: 800, letterSpacing: '0.05em', padding: '6px 20px' }}>
                                    ✓ PASS
                                </Badge>
                            </div>
                        </div>
                    </div>

                    <div className="done-meta" style={{ position: 'relative', zIndex: 1, marginBottom: 24 }}>
                        <Text size="xs" c={C.muted}>
                            Scored against <strong style={{ color: C.text }}>Sales QA</strong> · 70pts required to pass
                        </Text>
                    </div>

                    <div className="done-divider" style={{ height: 1, background: C.border, marginBottom: 20, position: 'relative', zIndex: 1 }} />

                    <Stack gap="sm" style={{ position: 'relative', zIndex: 1 }}>
                        <Button className="done-btn1" onClick={() => navigate('/dashboard/calls/1')}
                            fullWidth size="md" radius="md" rightSection={<IconArrowRight size={16} />}
                            style={{ background: BRAND, fontWeight: 700 }}>
                            View Full Results
                        </Button>
                        <Button className="done-btn2" variant="subtle" color="gray" fullWidth size="md" radius="md"
                            onClick={() => { setFile(null); setStage('idle'); setProgress(0); setNotes('') }}
                            style={{ color: C.muted }}>
                            Upload Another Call
                        </Button>
                    </Stack>
                </Card>
            </Box>
        )
    }

    // ── MAIN UPLOAD FORM ──
    return (
        <Box p="xl" maw={900}>
            <Stack gap={4} mb="xl">
                <Text fw={800} size="xl" c={C.text} style={{ letterSpacing: '-0.5px', fontSize: 24 }}>Upload a Call</Text>
                <Text size="sm" c={C.muted}>Upload a recording and get your AI score in under 60 seconds.</Text>
            </Stack>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 16, alignItems: 'start' }}>
                {/* Left column */}
                <Stack gap="md">
                    {/* Drop zone */}
                    <Card padding={0} radius="md" style={{ background: C.surface, border: `1px solid ${C.border}`, overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
                        <Box p="md" style={{ borderBottom: `1px solid ${C.border}` }}>
                            <Text fw={700} size="sm" c={C.text}>Audio File</Text>
                        </Box>
                        <Box p="md">
                            {!file ? (
                                <Box
                                    onDragOver={e => { e.preventDefault(); setDragOver(true) }}
                                    onDragLeave={() => setDragOver(false)}
                                    onDrop={handleDrop}
                                    onClick={() => fileRef.current?.click()}
                                    style={{
                                        border: `2px dashed ${dragOver ? BRAND : C.inputBorder}`,
                                        borderRadius: 12, padding: '36px 20px', textAlign: 'center',
                                        background: dragOver ? (dark ? 'rgba(22,163,74,0.06)' : '#f0fdf4') : C.inputBg,
                                        cursor: 'pointer', transition: 'all 0.2s',
                                    }}
                                >
                                    <ThemeIcon size={48} radius="xl" mb="md" style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', margin: '0 auto 16px' }}>
                                        <IconFileMusic size={24} color={BRAND} />
                                    </ThemeIcon>
                                    <Text fw={600} size="sm" c={C.text} mb={4}>
                                        {dragOver ? 'Drop to upload' : 'Drop your call here'}
                                    </Text>
                                    <Text size="xs" c={C.muted} mb="md">MP3, WAV, M4A · Max 500MB</Text>
                                    <Button size="sm" style={{ background: BRAND }}>Browse files</Button>
                                    <input ref={fileRef} type="file" accept=".mp3,.wav,.m4a,audio/*"
                                        style={{ display: 'none' }} onChange={e => handleFile(e.target.files[0])} />
                                </Box>
                            ) : (
                                <Paper p="md" radius="md" style={{ background: C.tableTh, border: `1px solid ${C.border}` }}>
                                    <Group justify="space-between" wrap="nowrap">
                                        <Group gap="sm">
                                            <ThemeIcon size={40} radius="md" style={{ background: '#f0fdf4', border: '1px solid #bbf7d0' }}>
                                                <IconMusic size={20} color={BRAND} />
                                            </ThemeIcon>
                                            <Stack gap={2} style={{ minWidth: 0 }}>
                                                <Text size="sm" fw={600} c={C.text} style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{file.name}</Text>
                                                <Text size="xs" c={C.muted}>{(file.size / 1024 / 1024).toFixed(1)} MB</Text>
                                            </Stack>
                                        </Group>
                                        <Button variant="subtle" color="red" size="xs" p={4} onClick={() => setFile(null)}>
                                            <IconX size={16} />
                                        </Button>
                                    </Group>
                                </Paper>
                            )}
                        </Box>
                    </Card>

                    {/* Scorecard selector */}
                    <Card padding={0} radius="md" style={{ background: C.surface, border: `1px solid ${C.border}`, overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
                        <Box p="md" style={{ borderBottom: `1px solid ${C.border}` }}>
                            <Text fw={700} size="sm" c={C.text}>Select Scorecard</Text>
                            <Text size="xs" c={C.muted} mt={2}>Which scorecard should we use?</Text>
                        </Box>
                        <Stack gap="sm" p="md">
                            {scorecards.map(sc => (
                                <Paper key={sc.id} p="sm" radius="md" onClick={() => setSelectedScorecard(sc.id)}
                                    style={{
                                        border: `1.5px solid ${selectedScorecard === sc.id ? BRAND : C.inputBorder}`,
                                        background: selectedScorecard === sc.id ? (dark ? 'rgba(22,163,74,0.08)' : '#f0fdf4') : C.inputBg,
                                        cursor: 'pointer', transition: 'all 0.15s',
                                    }}>
                                    <Group justify="space-between">
                                        <Group gap="sm">
                                            <Text size="xl">{sc.icon}</Text>
                                            <Stack gap={2}>
                                                <Text size="sm" fw={600} c={C.text}>{sc.name}</Text>
                                                <Text size="xs" c={C.muted}>{sc.criteria} criteria · Pass at {sc.passThreshold}%</Text>
                                            </Stack>
                                        </Group>
                                        <Box style={{
                                            width: 18, height: 18, borderRadius: '50%',
                                            border: `2px solid ${selectedScorecard === sc.id ? BRAND : C.inputBorder}`,
                                            background: selectedScorecard === sc.id ? BRAND : 'transparent',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                                        }}>
                                            {selectedScorecard === sc.id && <Box style={{ width: 6, height: 6, borderRadius: '50%', background: '#fff' }} />}
                                        </Box>
                                    </Group>
                                </Paper>
                            ))}
                        </Stack>
                    </Card>
                </Stack>

                {/* Right column */}
                <Stack gap="md">
                    {/* Notes */}
                    <Card padding={0} radius="md" style={{ background: C.surface, border: `1px solid ${C.border}`, overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
                        <Box p="md" style={{ borderBottom: `1px solid ${C.border}` }}>
                            <Group gap={6}>
                                <Text fw={700} size="sm" c={C.text}>Notes</Text>
                                <Badge variant="light" color="gray" size="sm">optional</Badge>
                            </Group>
                        </Box>
                        <Box p="md">
                            <Textarea value={notes} onChange={e => setNotes(e.target.value)}
                                placeholder="Add context about this call — prospect type, call goal, anything unusual..."
                                minRows={5}
                                styles={{ input: { background: C.inputBg, border: `1px solid ${C.inputBorder}`, color: C.text, fontSize: 14 } }}
                            />
                        </Box>
                    </Card>

                    {/* Summary + Submit */}
                    <Card padding={0} radius="md" style={{ background: C.surface, border: `1px solid ${C.border}`, overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
                        <Box p="md" style={{ borderBottom: `1px solid ${C.border}` }}>
                            <Text fw={700} size="sm" c={C.text}>Ready to Score</Text>
                        </Box>
                        <Stack gap="sm" p="md">
                            {[
                                { label: 'File', value: file?.name || '—', ok: !!file },
                                { label: 'Scorecard', value: scorecards.find(s => s.id === selectedScorecard)?.name || '—', ok: !!selectedScorecard },
                                { label: 'AI Model', value: 'Claude (Anthropic)', ok: true },
                            ].map(row => (
                                <Paper key={row.label} p="sm" radius="md" style={{ background: C.tableTh, border: `1px solid ${C.border}` }}>
                                    <Group justify="space-between">
                                        <Text size="xs" c={C.muted}>{row.label}</Text>
                                        <Group gap={6}>
                                            <Text size="xs" fw={500} c={row.ok ? C.text : C.muted}
                                                style={{ maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                {row.value}
                                            </Text>
                                            <Text size="xs" c={row.ok ? BRAND : C.muted}>{row.ok ? '✓' : '○'}</Text>
                                        </Group>
                                    </Group>
                                </Paper>
                            ))}

                            <Button onClick={simulateUpload} disabled={!file || !selectedScorecard}
                                size="md" fullWidth mt="xs"
                                style={{ background: file && selectedScorecard ? BRAND : undefined }}
                                leftSection={<IconBrain size={18} />}>
                                {file && selectedScorecard ? 'Score this call' : 'Select a file and scorecard'}
                            </Button>
                            <Text size="xs" c={C.muted} ta="center">Results ready in under 60 seconds</Text>
                        </Stack>
                    </Card>
                </Stack>
            </div>
        </Box>
    )
}