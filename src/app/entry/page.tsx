'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'
import Navbar from '@/components/Navbar'
import Sidebar from '@/components/Sidebar'
import DataEntryTable from '@/components/DataEntryTable'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function EntryPage() {
  const [profile, setProfile] = useState<any>(null)
  const [activeSection, setActiveSection] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadProfile() {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single()
        setProfile(data)
        if (data?.role === 'production') setActiveSection('production')
        else if (data?.role === 'quality') setActiveSection('techno_eco')
        else if (data?.role === 'environment') setActiveSection('iso_objectives')
        else if (data?.role === 'safety') setActiveSection('ohsas_objectives')
        else setActiveSection('production')
      }
      setLoading(false)
    }
    loadProfile()
  }, [])

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-pulse text-gray-500">Loading...</div>
    </div>
  )

  return (
    <div className="min-h-screen">
      <Navbar profile={profile} activeTab="entry" />
      <div className="flex">
        <Sidebar
          role={profile?.role}
          activeSection={activeSection}
          onSectionChange={setActiveSection}
        />
        <main className="flex-1 p-6">
          <DataEntryTable
            section={activeSection}
            profile={profile}
          />
        </main>
      </div>
    </div>
  )
}
