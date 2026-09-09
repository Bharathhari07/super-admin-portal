import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ShieldCheck, Lock, User, Eye, EyeOff, ArrowRight, Building2, KeyRound, FileCheck2, Gauge } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import Button from '../components/common/Button'

const platformBadges = [
  { icon: Building2, label: 'Multi-Tenant Governance' },
  { icon: KeyRound, label: 'Role-Based Access Control' },
  { icon: FileCheck2, label: 'Audit-Ready Compliance' },
  { icon: Gauge, label: 'Real-Time Monitoring' },
]

export default function LoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!username.trim()) {
      setError('Please enter your username.')
      return
    }

    if (!password) {
      setError('Please enter your password.')
      return
    }

    setIsLoading(true)

    setTimeout(() => {
      const validUsername = username.trim().toLowerCase() === 'admin'
      const validPassword = password === 'admin123' || password === 'admin'

      if (validUsername && validPassword) {
        login('admin', 'Super Administrator')
        navigate('/dashboard', { replace: true })
      } else {
        setError('Invalid username or password. Please try again.')
        setIsLoading(false)
      }
    }, 400)
  }

  return (
    <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-sap-bg px-4 py-8">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            'linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />
      <div className="pointer-events-none absolute -top-40 -left-40 h-96 w-96 rounded-full bg-sap-primary/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-sap-navy-light/40 blur-3xl" />

      <div className="relative z-10 w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-sap-primary text-sap-navy shadow-lg ring-4 ring-sap-primary/20">
            <ShieldCheck size={32} />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">Super Admin Portal</h1>
          <p className="text-xs sm:text-sm text-sap-text-muted">
            Enterprise Governance & Centralized Multi-Tenant Administration
          </p>
        </div>

        <div className="rounded-2xl border border-sap-border bg-sap-surface p-6 sm:p-8 shadow-2xl">
          <form onSubmit={handleLogin} className="space-y-4 sm:space-y-5">
            {error && (
              <div className="rounded-lg border border-sap-danger/30 bg-sap-danger-bg p-3 text-xs sm:text-sm text-sap-danger flex items-center gap-2">
                <Lock size={16} className="shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div>
              <label className="block text-xs sm:text-sm font-medium text-sap-text mb-1.5">
                Username
              </label>
              <div className="relative">
                <User size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sap-text-muted" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter username"
                  autoComplete="username"
                  className="w-full rounded-lg border border-sap-border bg-sap-bg py-2.5 pl-9 pr-3 text-xs sm:text-sm text-sap-text placeholder:text-sap-text-muted outline-none transition-colors focus:border-sap-primary focus:ring-2 focus:ring-sap-primary/20"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-sap-text mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sap-text-muted" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  autoComplete="current-password"
                  className="w-full rounded-lg border border-sap-border bg-sap-bg py-2.5 pl-9 pr-10 text-xs sm:text-sm text-sap-text placeholder:text-sap-text-muted outline-none transition-colors focus:border-sap-primary focus:ring-2 focus:ring-sap-primary/20"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-sap-text-muted hover:text-sap-text transition-colors"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              isLoading={isLoading}
              className="w-full justify-center py-2.5 text-sm font-semibold"
            >
              <span>Sign In to Dashboard</span>
              <ArrowRight size={16} />
            </Button>
          </form>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-2">
          {platformBadges.map(({ icon: Icon, label }) => (
            <span
              key={label}
              className="inline-flex items-center gap-1.5 rounded-full border border-sap-border bg-sap-surface/60 px-3 py-1.5 text-[11px] font-medium text-sap-text-muted"
            >
              <Icon size={12} className="text-sap-primary" />
              {label}
            </span>
          ))}
        </div>

        <div className="text-center text-[11px] text-sap-text-muted">
          Protected by SOC 2 Type II Compliance & Session Isolation
        </div>
      </div>
    </div>
  )
}
