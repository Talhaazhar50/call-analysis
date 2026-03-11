import axios from "axios";
import { Alert, Box, Loader, Text } from "@mantine/core";
import { IconAlertCircle } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";

const BRAND = '#16a34a'
const API = import.meta.env.VITE_API_URL || 'http://localhost:8000/api'

export default function MyCalls() {
    const { dark, C } = useOutletContext()
    const navigate = useNavigate()
    const [calls, setCalls] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [search, setSearch] = useState('')
    const [filter, setFilter] = useState('all')
    const [sort, setSort] = useState('date')

    const token = localStorage.getItem('token')
    const headers = { Authorization: `Bearer ${token}` }

    useEffect(() => {
        axios.get(`${API}/calls`, { headers })
            .then(({ data }) => setCalls(data))
            .catch(() => setError('Failed to load calls'))
            .finally(() => setLoading(false))
    }, [])

    const filtered = calls
        .filter(c => {
            if (search && !c.fileName.toLowerCase().includes(search.toLowerCase()) && !c.scorecardName.toLowerCase().includes(search.toLowerCase())) return false
            if (filter === 'pass' && !c.pass) return false
            if (filter === 'fail' && (c.pass || c.status !== 'done')) return false
            if (filter === 'coached' && !c.coached) return false
            return true
        })
        .sort((a, b) => {
            if (sort === 'score') return (b.percentage || 0) - (a.percentage || 0)
            if (sort === 'name') return a.fileName.localeCompare(b.fileName)
            return new Date(b.createdAt) - new Date(a.createdAt)
        })

    const scoreColor = (s) => s >= 80 ? BRAND : s >= 60 ? '#f59e0b' : '#ef4444'

    const inputStyle = { background: C.inputBg, border: `1px solid ${C.inputBorder}`, color: C.text, borderRadius: 8, padding: '8px 12px', fontSize: 13, outline: 'none', fontFamily: 'DM Sans, sans-serif' }
    const selectStyle = { ...inputStyle, cursor: 'pointer' }

    if (loading) return <Box p="xl" style={{ display: 'flex', justifyContent: 'center', paddingTop: 80 }}><Loader color="green" /></Box>

    return (
        <div style={{ padding: '32px 36px', maxWidth: 1100 }}>
            {error && <Alert icon={<IconAlertCircle size={16} />} color="red" mb={16}>{error}</Alert>}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12, marginBottom: 24 }}>
                <div>
                    <h2 style={{ fontSize: 22, fontWeight: 800, color: C.text, letterSpacing: '-0.3px', margin: 0 }}>My Calls</h2>
                    <p style={{ fontSize: 14, color: C.muted, margin: '4px 0 0' }}>{calls.length} call{calls.length !== 1 ? 's' : ''} total</p>
                </div>
                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                    <input style={{ ...inputStyle, minWidth: 200 }} placeholder="Search calls..." value={search} onChange={e => setSearch(e.target.value)} />
                    <select style={selectStyle} value={filter} onChange={e => setFilter(e.target.value)}>
                        <option value="all">All</option>
                        <option value="pass">Pass</option>
                        <option value="fail">Fail</option>
                        <option value="coached">Coached</option>
                    </select>
                    <select style={selectStyle} value={sort} onChange={e => setSort(e.target.value)}>
                        <option value="date">Sort: Date</option>
                        <option value="score">Sort: Score</option>
                        <option value="name">Sort: Name</option>
                    </select>
                </div>
            </div>

            {filtered.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '60px 20px', color: C.muted }}>
                    <div style={{ fontSize: 40, marginBottom: 12 }}>🎙️</div>
                    <Text fw={600} c={C.text} mb={4}>{calls.length === 0 ? 'No calls yet' : 'No calls match your filters'}</Text>
                    <Text size="sm" c={C.muted}>{calls.length === 0 ? 'Upload your first call to get started' : 'Try adjusting your search or filters'}</Text>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {filtered.map(call => (
                        <div key={call._id}
                            onClick={() => call.status === 'done' && navigate(`/dashboard/calls/${call._id}`)}
                            style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, cursor: call.status === 'done' ? 'pointer' : 'default', transition: 'all 0.15s', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}
                            onMouseEnter={e => { if (call.status === 'done') e.currentTarget.style.borderColor = BRAND }}
                            onMouseLeave={e => { e.currentTarget.style.borderColor = C.border }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 14, flex: 1, minWidth: 0 }}>
                                <div style={{ width: 40, height: 40, borderRadius: 10, background: '#f0fdf4', border: '1px solid #bbf7d0', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                    🎵
                                </div>
                                <div style={{ minWidth: 0 }}>
                                    <div style={{ fontWeight: 700, fontSize: 14, color: C.text, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 260 }}>{call.fileName}</div>
                                    <div style={{ fontSize: 12, color: C.muted, marginTop: 2 }}>
                                        {new Date(call.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                        {call.duration && ` · ${call.duration}`}
                                        {` · ${call.scorecardName}`}
                                    </div>
                                </div>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
                                {call.status === 'done' ? (
                                    <>
                                        <div style={{ textAlign: 'right' }}>
                                            <div style={{ fontSize: 22, fontWeight: 800, color: scoreColor(call.percentage), lineHeight: 1 }}>{call.percentage}%</div>
                                        </div>
                                        <span style={{ padding: '4px 10px', borderRadius: 6, fontSize: 12, fontWeight: 700, background: call.pass ? '#f0fdf4' : '#fef2f2', color: call.pass ? BRAND : '#ef4444', border: `1px solid ${call.pass ? '#bbf7d0' : '#fecaca'}` }}>
                                            {call.pass ? 'PASS' : 'FAIL'}
                                        </span>
                                        {call.coached && <span style={{ padding: '4px 10px', borderRadius: 6, fontSize: 12, fontWeight: 600, background: dark ? '#1e293b' : '#f1f5f9', color: C.muted, border: `1px solid ${C.border}` }}>Coached</span>}
                                    </>
                                ) : call.status === 'failed' ? (
                                    <span style={{ padding: '4px 10px', borderRadius: 6, fontSize: 12, fontWeight: 700, background: '#fef2f2', color: '#ef4444', border: '1px solid #fecaca' }}>Failed</span>
                                ) : (
                                    <span style={{ padding: '4px 10px', borderRadius: 6, fontSize: 12, fontWeight: 600, background: dark ? '#1e293b' : '#f1f5f9', color: C.muted, border: `1px solid ${C.border}` }}>Processing...</span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}