import { startAuthentication } from '@simplewebauthn/browser'
import {
  IconBrandApple, IconBrandGoogle, IconBrandWindows,
  IconBuilding, IconFingerprint, IconHeadphones
} from "@tabler/icons-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import axios from 'axios'

import {
  TextInput, Button, Title, Text, Stack, Box,
  Anchor, Flex, Divider, PinInput,
} from '@mantine/core'

const BRAND = '#16a34a'
const API = import.meta.env.VITE_API_URL || 'http://localhost:8000/api'

const socialButtons = [
  { icon: IconBrandGoogle, label: 'Google' },
  { icon: IconBrandApple, label: 'Apple' },
  { icon: IconBrandWindows, label: 'Microsoft' },
  { icon: IconBuilding, label: 'SSO' },
  { icon: IconFingerprint, label: 'Passkey' },
]

export default function Login() {
  const navigate = useNavigate()
  const { sendCode, verifyCode, login } = useAuth()

  const [step, setStep] = useState('email')
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [passkeyLoading, setPasskeyLoading] = useState(false)
  const [error, setError] = useState('')
  const [resendTimer, setResendTimer] = useState(0)

  const startResendTimer = () => {
    setResendTimer(18)
    const interval = setInterval(() => {
      setResendTimer((t) => {
        if (t <= 1) { clearInterval(interval); return 0 }
        return t - 1
      })
    }, 1000)
  }

  const handleEmailSubmit = async (e) => {
    e.preventDefault()
    if (!email) return setError('Please enter your email')
    setLoading(true)
    setError('')
    try {
      await sendCode(email)
      setStep('code')
      startResendTimer()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send code')
    } finally {
      setLoading(false)
    }
  }

  const handleCodeSubmit = async (e) => {
    e.preventDefault()
    if (!code || code.length < 6) return setError('Please enter the 6-digit code')
    setLoading(true)
    setError('')
    try {
      const user = await verifyCode(email, code)
      navigate(user.role === 'admin' ? '/admin' : '/dashboard', { replace: true })
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid code')
    } finally {
      setLoading(false)
    }
  }

  const handleResend = async () => {
    if (resendTimer > 0) return
    try {
      await sendCode(email)
      startResendTimer()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to resend code')
    }
  }

const handlePasskey = async () => {
  setPasskeyLoading(true)
  setError('')
  try {
    // No email needed
const { data: options } = await axios.post(
  `${API}/auth/passkey/login-options`, 
  {},
  { withCredentials: true }  // <-- add this
)
    // Browser shows passkey picker automatically
const authResponse = await startAuthentication({ optionsJSON: options })

    // No email in body
const { data } = await axios.post(
  `${API}/auth/passkey/login-verify`, 
  { authResponse },
  { withCredentials: true }  // <-- add this
)
    login(data.token, data.user)
    navigate(data.user.role === 'admin' ? '/admin' : '/dashboard', { replace: true })
  } catch (err) {
    if (err.name === 'NotAllowedError') {
      setError('Passkey authentication was cancelled')
    } else {
      setError(err.response?.data?.message || 'No passkey found on this device.')
    }
  } finally {
    setPasskeyLoading(false)
  }
}
  const handleSocialClick = (label) => {
    if (label === 'Passkey') return handlePasskey()
    // Google, Apple, Microsoft, SSO — coming soon
  }

  const inputStyles = {
    label: { color: '#374151', fontSize: 13, fontWeight: 500, marginBottom: 6 },
    input: {
      background: '#fff', border: '1px solid #e5e7eb',
      color: '#111827', borderRadius: 8, height: 42, fontSize: 14,
      '&:focus': { borderColor: BRAND, boxShadow: '0 0 0 3px rgba(22,163,74,0.08)' },
      '&::placeholder': { color: '#9ca3af' },
    },
  }

  return (
    <Box style={{ minHeight: '100vh', background: '#ffffff', display: 'flex', flexDirection: 'column' }}>

      <Flex align="center" justify="center" style={{ flex: 1 }} py={48}>
        <Box style={{ width: '100%', maxWidth: 420, padding: '0 24px' }}>

          {/* Logo + Title */}
          <Box mb={28} style={{ textAlign: 'center' }}>
            <Box style={{
              width: 48, height: 48, borderRadius: 12,
              background: '#f0fdf4', border: '1px solid #bbf7d0',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 16px',
            }}>
              <IconHeadphones size={24} color={BRAND} />
            </Box>
            <Title order={2} style={{ color: '#111827', fontSize: 26, fontWeight: 700, letterSpacing: '-0.5px', marginBottom: 6 }}>
              {step === 'email' ? 'Log in to CallAnalytics' : 'Check your inbox'}
            </Title>
            <Text style={{ color: '#6b7280', fontSize: 14 }}>
              {step === 'email'
                ? 'Welcome back! Choose how you want to sign in.'
                : `We sent a verification code to ${email}`}
            </Text>
          </Box>

          {step === 'email' && (
            <>
              <Text size="xs" ta="center" style={{ color: '#9ca3af', marginBottom: 12 }}>Log in with</Text>

              {/* Google, Apple, Microsoft */}
              <Flex gap={10} mb={10}>
                {socialButtons.slice(0, 3).map((s) => (
                  <Button
                    key={s.label} fullWidth variant="default" radius={8}
                    onClick={() => handleSocialClick(s.label)}
                    style={{
                      border: '1px solid #e5e7eb', background: '#fff',
                      color: '#374151', fontWeight: 500, fontSize: 13,
                      height: 52, display: 'flex', flexDirection: 'column', gap: 4
                    }}>
                    <s.icon size={20} /><span>{s.label}</span>
                  </Button>
                ))}
              </Flex>

{/* SSO, Passkey */}
<Flex gap={10} mb={8}>
  {socialButtons.slice(3).map((s) => (
    <Button
      key={s.label} fullWidth variant="default" radius={8}
      onClick={() => handleSocialClick(s.label)}
      loading={s.label === 'Passkey' && passkeyLoading}
      style={{
        border: s.label === 'Passkey' ? '1px solid #bbf7d0' : '1px solid #e5e7eb',
        background: s.label === 'Passkey' ? '#f0fdf4' : '#fff',
        color: s.label === 'Passkey' ? BRAND : '#374151',
        fontWeight: 500, fontSize: 13,
        height: 52, display: 'flex', flexDirection: 'column', gap: 4
      }}>
      <s.icon size={20} /><span>{s.label}</span>
    </Button>
  ))}
</Flex>

{/* Passkey hint */}
<Flex align="center" gap={6} mb={16} px={4}>
  <Text size="xs" style={{ color: '#9ca3af', lineHeight: 1.5 }}>
    🔑 First time? Log in with email OTP, then go to{' '}
    <span style={{ color: BRAND, fontWeight: 600 }}>Settings → Security</span>
    {' '}to register your passkey.
  </Text>
</Flex>

              {/* Error shown above divider for passkey errors */}
              {error && (
                <Text size="sm" ta="center" style={{ color: '#dc2626', marginBottom: 12 }}>
                  {error}
                </Text>
              )}

              <Divider
                label={<Text size="xs" style={{ color: '#9ca3af' }}>or continue with</Text>}
                labelPosition="center" mb={20} style={{ borderColor: '#f3f4f6' }}
              />

              <form onSubmit={handleEmailSubmit}>
                <Stack gap={14}>
                  <TextInput
                    label="Email" placeholder="Enter your email"
                    value={email} onChange={(e) => { setEmail(e.target.value); setError('') }}
                    required type="email" styles={inputStyles}
                  />
                  <Text size="xs" style={{ color: '#9ca3af', marginTop: -8 }}>
                    Use an organization email to easily collaborate with teammates
                  </Text>
                  <Button
                    type="submit" fullWidth loading={loading} radius={8}
                    style={{
                      background: BRAND, color: '#fff', fontWeight: 600,
                      fontSize: 14, height: 42, border: 'none',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                    }}>
                    Continue
                  </Button>
                </Stack>
              </form>
            </>
          )}

          {step === 'code' && (
            <form onSubmit={handleCodeSubmit}>
              <Stack gap={20} align="center">
                <PinInput
                  length={6} value={code} onChange={setCode}
                  size="lg" radius={8}
                  styles={{
                    input: {
                      border: '1px solid #e5e7eb', borderRadius: 8,
                      fontSize: 20, fontWeight: 700, color: '#111827',
                      '&:focus': { borderColor: BRAND, boxShadow: '0 0 0 3px rgba(22,163,74,0.08)' },
                    },
                  }}
                />

                {error && <Text size="sm" style={{ color: '#dc2626' }}>{error}</Text>}

                <Button
                  type="submit" fullWidth loading={loading} radius={8}
                  style={{
                    background: BRAND, color: '#fff', fontWeight: 600,
                    fontSize: 14, height: 42, border: 'none',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                  }}>
                  Continue
                </Button>

                <Flex align="center" gap={6}>
                  <Text size="sm" style={{ color: '#6b7280' }}>Didn't receive a code?</Text>
                  {resendTimer > 0 ? (
                    <Text size="sm" style={{ color: '#9ca3af' }}>Resend in {resendTimer}s</Text>
                  ) : (
                    <Anchor size="sm" style={{ color: BRAND, fontWeight: 600 }} onClick={handleResend}>
                      Resend
                    </Anchor>
                  )}
                </Flex>

                <Anchor
                  size="sm" style={{ color: '#6b7280' }}
                  onClick={() => { setStep('email'); setCode(''); setError('') }}>
                  ← Use a different email
                </Anchor>
              </Stack>
            </form>
          )}

          <Text ta="center" size="xs" mt={32} style={{ color: '#9ca3af', lineHeight: 1.6 }}>
            By continuing, you acknowledge that you understand and agree to our{' '}
            <Anchor size="xs" style={{ color: '#6b7280' }}>Terms & Conditions</Anchor>{' '}and{' '}
            <Anchor size="xs" style={{ color: '#6b7280' }}>Privacy Policy</Anchor>
          </Text>

        </Box>
      </Flex>

      <Flex justify="center" gap={24} py={20} style={{ borderTop: '1px solid #f3f4f6' }}>
        {['Privacy Policy', 'Terms of Service', 'Help Center'].map((item) => (
          <Anchor key={item} size="xs" style={{ color: '#9ca3af' }}>{item}</Anchor>
        ))}
      </Flex>

    </Box>
  )
}