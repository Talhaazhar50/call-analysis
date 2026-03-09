import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import {
  TextInput,
  PasswordInput,
  Button,
  Paper,
  Title,
  Text,
  Stack,
  Box,
  Center,
  Anchor,
  Flex,
  Badge,
} from '@mantine/core'
import { IconHeadphones, IconMail, IconLock, IconShieldCheck } from '@tabler/icons-react'

export default function Login() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      navigate('/dashboard')
    }, 1500)
  }

  const inputStyles = {
    label: {
      color: '#a0aec0',
      fontSize: 12,
      fontWeight: 600,
      letterSpacing: '0.08em',
      textTransform: 'uppercase',
      marginBottom: 6,
    },
    input: {
      background: '#1a1f2e',
      border: '1px solid #2d3548',
      color: 'white',
      borderRadius: 8,
      height: 46,
      fontSize: 14,
      '&:focus': { borderColor: '#00c853' },
      '&::placeholder': { color: '#4a5568' },
    },
  }

  return (
    <Flex style={{ minHeight: '100vh', background: '#0d1117' }}>

      {/* Left Panel */}
      <Box
        style={{
          flex: 1,
          background: 'linear-gradient(160deg, #0d1117 0%, #0d2818 100%)',
          borderRight: '1px solid #1a2a1a',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '48px',
        }}
        visibleFrom="md"
      >
        {/* Top logo */}
        <Flex align="center" gap={10}>
          <Box
            style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              background: 'linear-gradient(135deg, #00c853, #00e676)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <IconHeadphones size={20} color="#0d1117" />
          </Box>
          <Text style={{ color: 'white', fontWeight: 700, fontSize: 18, letterSpacing: '-0.3px' }}>
            CallAnalytics
          </Text>
        </Flex>

        {/* Middle content */}
        <Box>
          <Badge
            style={{
              background: 'rgba(0,200,83,0.1)',
              color: '#00c853',
              border: '1px solid rgba(0,200,83,0.2)',
              marginBottom: 20,
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              fontSize: 11,
            }}
          >
            Enterprise Platform
          </Badge>
          <Title
            style={{
              color: 'white',
              fontSize: 36,
              fontWeight: 800,
              lineHeight: 1.2,
              letterSpacing: '-0.5px',
              marginBottom: 16,
            }}
          >
            Analyze every call.<br />
            <Text
              component="span"
              style={{
                background: 'linear-gradient(90deg, #00c853, #69f0ae)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Score every agent.
            </Text>
          </Title>
          <Text style={{ color: '#4a5568', fontSize: 15, lineHeight: 1.7, maxWidth: 380 }}>
            AI-powered call analysis and quality scoring platform built for enterprise sales and support teams.
          </Text>

          {/* Stats */}
          <Flex gap={32} mt={40}>
            {[
              { value: '98%', label: 'Accuracy Rate' },
              { value: '10x', label: 'Faster Reviews' },
              { value: '500+', label: 'Teams Onboarded' },
            ].map((stat) => (
              <Box key={stat.label}>
                <Text style={{ color: '#00c853', fontSize: 24, fontWeight: 800 }}>{stat.value}</Text>
                <Text style={{ color: '#4a5568', fontSize: 12, marginTop: 2 }}>{stat.label}</Text>
              </Box>
            ))}
          </Flex>
        </Box>

        {/* Bottom */}
        <Text style={{ color: '#2d3548', fontSize: 12 }}>
          © 2025 CallAnalytics Inc. All rights reserved.
        </Text>
      </Box>

      {/* Right Panel - Login Form */}
      <Flex
        align="center"
        justify="center"
        style={{
          width: '100%',
          maxWidth: 480,
          padding: '48px 40px',
          background: '#0d1117',
        }}
      >
        <Box style={{ width: '100%' }}>

          {/* Mobile logo */}
          <Center mb={32} hiddenFrom="md">
            <Flex align="center" gap={10}>
              <Box
                style={{
                  width: 36, height: 36, borderRadius: 10,
                  background: 'linear-gradient(135deg, #00c853, #00e676)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
              >
                <IconHeadphones size={20} color="#0d1117" />
              </Box>
              <Text style={{ color: 'white', fontWeight: 700, fontSize: 18 }}>CallAnalytics</Text>
            </Flex>
          </Center>

          <Box mb={36}>
            <Title order={2} style={{ color: 'white', fontWeight: 700, marginBottom: 8 }}>
              Sign in to your account
            </Title>
            <Text style={{ color: '#4a5568', fontSize: 14 }}>
              Enter your credentials to access the platform
            </Text>
          </Box>

          <Paper
            p={28}
            radius={12}
            style={{
              background: '#13181f',
              border: '1px solid #1e2533',
            }}
          >
            <form onSubmit={handleSubmit}>
              <Stack gap={20}>
                <TextInput
                  label="Email Address"
                  placeholder="you@company.com"
                  leftSection={<IconMail size={16} color="#4a5568" />}
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                  styles={inputStyles}
                />

                <PasswordInput
                  label="Password"
                  placeholder="Enter your password"
                  leftSection={<IconLock size={16} color="#4a5568" />}
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  required
                  styles={inputStyles}
                />

                <Flex justify="flex-end" mt={-8}>
                  <Anchor size="xs" style={{ color: '#00c853' }}>
                    Forgot password?
                  </Anchor>
                </Flex>

                <Button
                  type="submit"
                  fullWidth
                  loading={loading}
                  size="md"
                  radius={8}
                  style={{
                    background: 'linear-gradient(135deg, #00c853, #00a844)',
                    border: 'none',
                    color: '#0d1117',
                    fontWeight: 700,
                    fontSize: 14,
                    letterSpacing: '0.02em',
                    height: 46,
                    boxShadow: '0 4px 24px rgba(0,200,83,0.25)',
                  }}
                >
                  Sign In
                </Button>
              </Stack>
            </form>
          </Paper>

          {/* Security note */}
          <Flex align="center" gap={8} mt={20} justify="center">
            <IconShieldCheck size={14} color="#2d3548" />
            <Text size="xs" style={{ color: '#2d3548' }}>
              256-bit SSL encrypted. Your data is secure.
            </Text>
          </Flex>

          <Text ta="center" size="sm" mt={24} style={{ color: '#4a5568' }}>
            Don't have an account?{' '}
            <Anchor component={Link} to="/register" style={{ color: '#00c853', fontWeight: 600 }}>
              Request access
            </Anchor>
          </Text>
        </Box>
      </Flex>
    </Flex>
  )
}