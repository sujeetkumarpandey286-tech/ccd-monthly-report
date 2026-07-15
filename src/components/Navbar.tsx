'use client'
import { useRouter } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://hwafhyotnviacdzsdzsv.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh3YWZoeW90bnZpYWNkenNkenN2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQwODg5NzIsImV4cCI6MjA5OTY2NDk3Mn0.1ibzOXApTZA_P9T6kiq7ayf85KmxNd91XeP6f7SdyGc'
)

interface NavbarProps {
  profile: any
  activeTab: string
}

export default function Navbar({ profile, activeTab }: NavbarProps) {
  const router = useRouter()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  const tabs = [
    { id: 'entry', label: 'Data Entry', href: '/entry' },
    { id: 'dashboard', label: 'Dashboard', href: '/dashboard' },
    { id: 'view', label: 'View Data', href: '/view' },
    ...(profile?.role === 'admin' ? [
      { id: 'import', label: 'Import/Export', href: '/import' },
      { id: 'admin', label: 'Admin', href: '/admin' },
    ] : []),
  ]

  const roleColors: Record<string, string> = {
    admin: 'bg-red-100 text-red-700',
    production: 'bg-blue-100 text-blue-700',
    quality: 'bg-emerald-100 text-emerald-700',
    environment: 'bg-green-100 text-green-700',
    safety: 'bg-amber-100 text-amber-700',
    viewer: 'bg-gray-100 text-gray-700',
  }

  return (
    <>
      {/* Animated ticker band */}
      <div className="sticky top-0 z-[60] bg-gradient-to-r from-blue-900 via-indigo-800 to-blue-900 overflow-hidden">
        <div className="animate-marquee whitespace-nowrap py-1.5 text-xs font-medium text-white/90 tracking-wide">
          <span className="mx-8">Developed by: SAIL Digital Transformation Division</span>
          <span className="mx-8">•</span>
          <span className="mx-8">Coal Chemicals Department — Monthly Performance Report System</span>
          <span className="mx-8">•</span>
          <span className="mx-8">Developed by: SAIL Digital Transformation Division</span>
          <span className="mx-8">•</span>
          <span className="mx-8">Coal Chemicals Department — Monthly Performance Report System</span>
          <span className="mx-8">•</span>
          <span className="mx-8">Developed by: SAIL Digital Transformation Division</span>
          <span className="mx-8">•</span>
          <span className="mx-8">Coal Chemicals Department — Monthly Performance Report System</span>
        </div>
      </div>
    <nav className="glass-nav sticky top-[28px] z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-xs font-bold text-white">CCD</span>
            </div>
            <span className="font-semibold text-gray-800">Monthly Report</span>
          </div>
          <div className="flex gap-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => router.push(tab.href)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeTab === tab.id
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/30'
                    : 'text-gray-600 hover:bg-white/80'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${roleColors[profile?.role] || ''}`}>
            {profile?.role}
          </span>
          <span className="text-sm text-gray-600">{profile?.full_name}</span>
          <button onClick={handleLogout} className="text-sm text-gray-500 hover:text-red-600 transition-colors">
            Logout
          </button>
        </div>
      </div>
    </nav>
    <style jsx>{`
      @keyframes marquee {
        0% { transform: translateX(0%); }
        100% { transform: translateX(-50%); }
      }
      .animate-marquee {
        display: inline-block;
        animation: marquee 20s linear infinite;
      }
    `}</style>
    </>
  )
}
