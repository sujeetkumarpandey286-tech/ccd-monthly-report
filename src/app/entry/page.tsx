'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'
import Navbar from '@/components/Navbar'
import Sidebar from '@/components/Sidebar'
import DataEntryTable from '@/components/DataEntryTable'

const supabase = createClient(
  'https://hwafhyotnviacdzsdzsv.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh3YWZoeW90bnZpYWNkenNkenN2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQwODg5NzIsImV4cCI6MjA5OTY2NDk3Mn0.1ibzOXApTZA_P9T6kiq7ayf85KmxNd91XeP6f7SdyGc'
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
