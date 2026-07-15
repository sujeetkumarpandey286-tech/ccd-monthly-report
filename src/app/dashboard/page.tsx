'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'
import Navbar from '@/components/Navbar'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function DashboardPage() {
  const [profile, setProfile] = useState<any>(null)
  const [productionData, setProductionData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data: prof } = await supabase.from('profiles').select('*').eq('id', user.id).single()
        setProfile(prof)
        const { data: prod } = await supabase.from('production').select('*').order('month_index')
        setProductionData(prod || [])
      }
      setLoading(false)
    }
    load()
  }, [])

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-pulse text-gray-500">Loading dashboard...</div>
    </div>
  )

  const totalCrudeTar = productionData.reduce((sum, d) => sum + (d.crude_tar_act || 0), 0)
  const totalEHP = productionData.reduce((sum, d) => sum + (d.ehp_act || 0), 0)
  const totalAmmSulphate = productionData.reduce((sum, d) => sum + (d.amm_sulphate_act || 0), 0)
  const totalSulphuricAcid = productionData.reduce((sum, d) => sum + (d.sulphuric_acid_act || 0), 0)

  return (
    <div className="min-h-screen">
      <Navbar profile={profile} activeTab="dashboard" />
      <main className="p-6 max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Performance Dashboard</h1>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="kpi-card from-blue-500 to-blue-700">
            <p className="text-blue-100 text-sm">Crude Tar (YTD)</p>
            <p className="text-2xl font-bold mt-1">{totalCrudeTar.toFixed(1)} MT</p>
          </div>
          <div className="kpi-card from-emerald-500 to-emerald-700">
            <p className="text-emerald-100 text-sm">EHP (YTD)</p>
            <p className="text-2xl font-bold mt-1">{totalEHP.toFixed(1)} MT</p>
          </div>
          <div className="kpi-card from-purple-500 to-purple-700">
            <p className="text-purple-100 text-sm">Amm. Sulphate (YTD)</p>
            <p className="text-2xl font-bold mt-1">{totalAmmSulphate.toFixed(1)} MT</p>
          </div>
          <div className="kpi-card from-amber-500 to-amber-700">
            <p className="text-amber-100 text-sm">Sulphuric Acid (YTD)</p>
            <p className="text-2xl font-bold mt-1">{totalSulphuricAcid.toFixed(1)} MT</p>
          </div>
        </div>

        {/* Monthly Data Table */}
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Monthly Production Summary</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="table-header">
                  <th className="px-4 py-3 text-left">Month</th>
                  <th className="px-4 py-3 text-right">Crude Tar</th>
                  <th className="px-4 py-3 text-right">EHP</th>
                  <th className="px-4 py-3 text-right">Amm. Sulphate</th>
                  <th className="px-4 py-3 text-right">Sulphuric Acid</th>
                </tr>
              </thead>
              <tbody>
                {productionData.map((row, i) => {
                  const months = ['Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec','Jan','Feb','Mar']
                  return (
                    <tr key={i} className="border-b border-gray-100 hover:bg-blue-50/50">
                      <td className="px-4 py-3 font-medium">{months[row.month_index - 1]}</td>
                      <td className="px-4 py-3 text-right">{row.crude_tar_act || '-'}</td>
                      <td className="px-4 py-3 text-right">{row.ehp_act || '-'}</td>
                      <td className="px-4 py-3 text-right">{row.amm_sulphate_act || '-'}</td>
                      <td className="px-4 py-3 text-right">{row.sulphuric_acid_act || '-'}</td>
                    </tr>
                  )
                })}
                {productionData.length === 0 && (
                  <tr><td colSpan={5} className="px-4 py-8 text-center text-gray-400">No data entered yet</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  )
}
