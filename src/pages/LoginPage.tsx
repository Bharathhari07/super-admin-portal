import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ShieldCheck, Lock, User, Eye, EyeOff, ArrowRight, Building2, KeyRound, FileCheck2, Gauge } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import Button from '../components/common/Button'

const platformHighlights = [
  {
    icon: Building2,
    title: 'Multi-Tenant Governance',
    description: 'Provision, configure, and monitor every tenant workspace from a single console.',
  },
  {
    icon: KeyRound,
    title: 'Role-Based Access Control',
    description: 'Define granular roles and permissions scoped to companies, departments, and branches.',
  },
  {
    icon: FileCheck2,
    title: 'Compliance & Audit Trails',
    description: 'Immutable logs of every administrative action, ready for security review.',
  },
  {
    icon: Gauge,
    title: 'Platform-Wide Visibility',
    description: 'Real-time health, usage, and billing insight across your entire tenant base.',
  },
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
    <div className="flex min-h-screen w-full">
      <div className="relative hidden w-1/2 flex-col justify-center overflow-hidden bg-sap-navy p-12 lg:flex">
        <div className="pointer-events-none absolute -top-32 -left-32 h-96 w-96 rounded-full bg-sap-primary/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 -right-16 h-96 w-96 rounded-full bg-sap-navy-light/40 blur-3xl" />

        <div className="relative z-10 max-w-md">
          <div className="mb-8 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-sap-primary text-sap-navy shadow-lg">
              <ShieldCheck size={26} />
            </div>
            <span className="text-lg font-bold text-white">Super Admin Portal</span>
          </div>

          <h2 className="mb-3 text-3xl font-bold leading-tight text-white">
            Enterprise governance, in one console.
          </h2>
          <p className="mb-10 text-sm leading-relaxed text-sap-text-muted">
            Manage tenants, organizational structure, access control, and compliance across your entire platform from a single administrative workspace.
          </p>

          <div className="space-y-5">
            {platformHighlights.map(({ icon: Icon, title, description }) => (
              <div key={title} className="flex items-start gap-3">
                <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/10 text-sap-primary">
                  <Icon size={18} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">{title}</p>
                  <p className="text-xs leading-relaxed text-sap-text-muted">{description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex w-full items-center justify-center bg-sap-bg px-4 py-8 lg:w-1/2">
        <div className="w-full max-w-md space-y-6">
          <div className="text-center space-y-2 lg:hidden">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-sap-primary text-sap-navy shadow-lg ring-4 ring-sap-primary/20">
              <ShieldCheck size={32} />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">Super Admin Portal</h1>
            <p className="text-xs sm:text-sm text-sap-text-muted">
              Enterprise Governance & Centralized Multi-Tenant Administration
            </p>
          </div>

          <div className="rounded-2xl border border-sap-border bg-sap-surface p-6 sm:p-8 shadow-2xl">
            <div className="mb-6 hidden lg:block">
              <h2 className="text-xl font-bold text-sap-text">Welcome back</h2>
              <p className="mt-1 text-sm text-sap-text-muted">Sign in to continue to your workspace.</p>
            </div>

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

          <div className="text-center text-[11px] text-sap-text-muted">
            Protected by SOC 2 Type II Compliance & Session Isolation
          </div>
        </div>
      </div>
    </div>
  )
}
