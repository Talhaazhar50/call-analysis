import axios from "axios";
import { Alert, Box, Loader, Text } from "@mantine/core";
import { IconAlertCircle } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";

const BRAND = '#16a34a'
const API = import.meta.env.VITE_API_URL || 'http://localhost:8000/api'

export default function CallResults() {
    const { dark, C } = useOutletContext()
    const navigate = useNavigate()
    const { id } = useParams()
    const [call, setCall] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [activeTab, setActiveTab] = useState('score')

    const token = localStorage.getItem('token')
    const headers = { Authorization: `Bearer ${token}` }

    useEffect(() => {
        axios.get(`${API}/calls/${id}`, { headers })
            .then(({ data }) => setCall(data))
            .catch(() => setError('Failed to load call results'))
            .finally(() => setLoading(false))
    }, [id])

    const toggleCoached = async () => {
        const { data } = await axios.patch(`${API}/calls/${id}/coached`, {}, { headers })
        setCall(p => ({ ...p, coached: data.coached }))
    }

    if (loading) return <Box p="xl" style={{ display: 'flex', justifyContent: 'center', paddingTop: 80 }}><Loader color="green" /></Box>
    if (error) return <Box p="xl"><Alert icon={<IconAlertCircle size={16} />} color="red">{error}</Alert></Box>
    if (!call) return null

    const scoreColor = call.percentage >= 80 ? BRAND : call.percentage >= 60 ? '#f59e0b' : '#ef4444'
    const total = call.totalScore
    const max = call.maxScore

    return (
        <div style={{ padding: '32px 36px', maxWidth: 1100 }}>
            {/* Header */}
            <div style={{ marginBottom: 24 }}>
                <button onClick={() => navigate('/dashboard/calls')} style={{ background: 'none', border: 'none', color: C.muted, fontSize: 13, cursor: 'pointer', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 4, fontFamily: 'DM Sans, sans-serif' }}>
                    ← Back to My Calls
                </button>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                            <div style={{ width: 36, height: 36, borderRadius: 9, background: '#f0fdf4', border: '1px solid #bbf7d0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>🎵</div>
                            <h1 style={{ fontSize: 22, fontWeight: 800, color: C.text, letterSpacing: '-0.3px', margin: 0 }}>{call.fileName}</h1>
                        </div>
                        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                            {[
                                new Date(call.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                                call.duration,
                                call.scorecardName,
                            ].filter(Boolean).map((item, i) => (
                                <span key={i} style={{ fontSize: 12, color: C.muted }}>{item}</span>
                            ))}
                        </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                       
                        <div style={{ textAlign: 'right' }}>
                            <div style={{ fontSize: 40, fontWeight: 800, color: scoreColor, lineHeight: 1 }}>{call.percentage}%</div>
                            <div style={{ fontSize: 12, color: C.muted }}>{total}/{max} pts</div>
                        </div>
                        <span style={{ padding: '6px 16px', borderRadius: 8, fontSize: 13, fontWeight: 700, background: call.pass ? '#f0fdf4' : '#fef2f2', color: call.pass ? BRAND : '#ef4444', border: `1px solid ${call.pass ? '#bbf7d0' : '#fecaca'}` }}>
                            {call.pass ? '✓ PASS' : '✗ FAIL'}
                        </span>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div style={{ display: 'flex', gap: 4, marginBottom: 24, background: C.tableTh, borderRadius: 10, padding: 4, width: 'fit-content' }}>
                {['score', 'transcript'].map(tab => (
                    <button key={tab} onClick={() => setActiveTab(tab)} style={{ padding: '8px 20px', borderRadius: 8, border: 'none', background: activeTab === tab ? C.surface : 'transparent', color: activeTab === tab ? C.text : C.muted, fontWeight: activeTab === tab ? 700 : 500, fontSize: 13, cursor: 'pointer', boxShadow: activeTab === tab ? '0 1px 4px rgba(0,0,0,0.08)' : undefined, transition: 'all 0.15s', fontFamily: 'DM Sans, sans-serif', textTransform: 'capitalize' }}>
                        {tab === 'score' ? 'Score Breakdown' : 'Transcript'}
                    </button>
                ))}
            </div>

            {/* Score tab */}
            {activeTab === 'score' && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))', gap: 20 }}>
                    <div>
                        <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 14, padding: 24, marginBottom: 16 }}>
                            <h3 style={{ fontSize: 15, fontWeight: 700, color: C.text, margin: '0 0 16px' }}>Criteria Scores</h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                                {call.criteriaResults.map((c, i) => (
                                    <div key={i}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                                            <div>
                                                <span style={{ fontSize: 13, fontWeight: 600, color: C.text }}>{c.label}</span>
                                                <span style={{ fontSize: 11, color: C.muted, marginLeft: 8 }}>{c.category}</span>
                                            </div>
                                            <span style={{ fontSize: 13, fontWeight: 700, color: scoreColor }}>{c.score}/{c.max}</span>
                                        </div>
                                        <div style={{ height: 6, borderRadius: 99, background: dark ? '#2a2d3a' : '#f3f4f6', overflow: 'hidden' }}>
                                            <div style={{ height: '100%', width: `${c.max > 0 ? (c.score / c.max) * 100 : 0}%`, borderRadius: 99, background: c.score / c.max >= 0.8 ? BRAND : c.score / c.max >= 0.6 ? '#f59e0b' : '#ef4444' }} />
                                        </div>
                                        {c.feedback && <p style={{ fontSize: 12, color: C.muted, margin: '6px 0 0', lineHeight: 1.5 }}>{c.feedback}</p>}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div>
                        {call.overallFeedback && (
                            <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 14, padding: 24 }}>
                                <h3 style={{ fontSize: 15, fontWeight: 700, color: C.text, margin: '0 0 12px' }}>Overall Feedback</h3>
                                <p style={{ fontSize: 14, color: C.text, lineHeight: 1.7, margin: 0 }}>{call.overallFeedback}</p>
                            </div>
                        )}
                        {call.notes && (
                            <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 14, padding: 24, marginTop: 16 }}>
                                <h3 style={{ fontSize: 15, fontWeight: 700, color: C.text, margin: '0 0 12px' }}>Notes</h3>
                                <p style={{ fontSize: 14, color: C.muted, lineHeight: 1.7, margin: 0 }}>{call.notes}</p>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Transcript tab */}
            {activeTab === 'transcript' && (
                <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 14, padding: 24 }}>
                    {call.transcript.length === 0 ? (
                        <Text c={C.muted} ta="center" py="xl">No transcript available</Text>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                            {call.transcript.map((line, i) => (
                                <div key={i} style={{ display: 'flex', gap: 14 }}>
                                    <div style={{ flexShrink: 0, paddingTop: 2 }}>
                                        <span style={{ display: 'inline-block', padding: '2px 8px', borderRadius: 6, fontSize: 11, fontWeight: 700, background: line.speaker.includes('A') || line.speaker.includes('Agent') ? '#f0fdf4' : dark ? '#1e293b' : '#f1f5f9', color: line.speaker.includes('A') || line.speaker.includes('Agent') ? BRAND : C.muted, border: `1px solid ${line.speaker.includes('A') || line.speaker.includes('Agent') ? '#bbf7d0' : C.border}`, whiteSpace: 'nowrap' }}>
                                            {line.speaker}
                                        </span>
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <span style={{ fontSize: 11, color: C.subtle, marginRight: 8 }}>{line.time}</span>
                                        <span style={{ fontSize: 14, color: C.text, lineHeight: 1.6 }}>{line.text}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    )
} ``