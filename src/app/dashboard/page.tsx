'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'
import Navbar from '@/components/Navbar'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

const supabase = createClient(
  'https://hwafhyotnviacdzsdzsv.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh3YWZoeW90bnZpYWNkenNkenN2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQwODg5NzIsImV4cCI6MjA5OTY2NDk3Mn0.1ibzOXApTZA_P9T6kiq7ayf85KmxNd91XeP6f7SdyGc'
)

const MONTHS = ['Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec','Jan','Feb','Mar']

const CHART_OPTIONS = [
  { value: 'production', label: 'Production (Crude Tar, Amm Sulphate, Benzol)' },
  { value: 'iso_old', label: 'End Gas Analysis - Old CCD (ISO Objectives)' },
  { value: 'lab_new', label: 'End Gas Analysis - New CCD (Lab Analysis)' },
]

export default function DashboardPage() {
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [fiscalYear, setFiscalYear] = useState('2025-26')
  const [chartType, setChartType] = useState('production')
  const [fromMonth, setFromMonth] = useState(1)
  const [toMonth, setToMonth] = useState(12)
  const [productionData, setProductionData] = useState<any[]>([])
  const [isoData, setIsoData] = useState<any[]>([])
  const [labData, setLabData] = useState<any[]>([])

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data: prof } = await supabase.from('profiles').select('*').eq('id', user.id).single()
        setProfile(prof)
      }
      setLoading(false)
    }
    load()
  }, [])

  useEffect(() => {
    loadChartData()
  }, [fiscalYear, fromMonth, toMonth])

  async function loadChartData() {
    const { data: prod } = await supabase
      .from('production').select('*')
      .eq('fiscal_year', fiscalYear)
      .gte('month_index', fromMonth).lte('month_index', toMonth)
      .order('month_index')
    setProductionData(prod || [])

    const { data: iso } = await supabase
      .from('iso_objectives').select('*')
      .eq('fiscal_year', fiscalYear)
      .gte('month_index', fromMonth).lte('month_index', toMonth)
      .order('month_index')
    setIsoData(iso || [])

    const { data: lab } = await supabase
      .from('lab_analysis_new').select('*')
      .eq('fiscal_year', fiscalYear)
      .gte('month_index', fromMonth).lte('month_index', toMonth)
      .order('month_index')
    setLabData(lab || [])
  }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-pulse text-gray-500">Loading dashboard...</div>
    </div>
  )

  // Prepare chart data
  const prodChartData = productionData.map(d => ({
    month: MONTHS[d.month_index - 1],
    'Crude Tar': d.crude_tar_act,
    'Amm Sulphate': d.amm_sulphate_act,
    'Crude Benzol': d.crude_benzol_act,
  }))

  const isoChartData = isoData.map(d => ({
    month: MONTHS[d.month_index - 1],
    'Ammonia': d.end_gas_ammonia_g_nm3,
    'Naphthalene': d.end_gas_naphthalene_g_nm3,
    'Tar Fog': d.tar_fog_g_nm3,
  }))

  const labChartData = labData.map(d => ({
    month: MONTHS[d.month_index - 1],
    'Ammonia': d.ammonia_g_nm3,
    'Naphthalene': d.naphthalene_g_nm3,
    'Tar Fog': d.tar_fog_g_nm3,
  }))

  // KPIs
  const totalCrudeTar = productionData.reduce((s, d) => s + (d.crude_tar_act || 0), 0)
  const totalEHP = productionData.reduce((s, d) => s + (d.ehp_act || 0), 0)
  const totalAmmSulphate = productionData.reduce((s, d) => s + (d.amm_sulphate_act || 0), 0)
  const totalSulphuricAcid = productionData.reduce((s, d) => s + (d.sulphuric_acid_act || 0), 0)

  return (
    <div className="min-h-screen">
      <Navbar profile={profile} activeTab="dashboard" />
      <main className="p-6 max-w-7xl mx-auto">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Performance Dashboard</h1>
          <div className="flex flex-wrap items-center gap-3">
            <div>
              <label className="text-xs text-gray-500 block">Fiscal Year</label>
              <select className="input-field text-sm py-1.5" value={fiscalYear} onChange={e => setFiscalYear(e.target.value)}>
                <option value="2024-25">2024-25</option>
                <option value="2025-26">2025-26</option>
                <option value="2026-27">2026-27</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-500 block">From</label>
              <select className="input-field text-sm py-1.5" value={fromMonth} onChange={e => setFromMonth(Number(e.target.value))}>
                {MONTHS.map((m, i) => <option key={i} value={i+1}>{m}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-500 block">To</label>
              <select className="input-field text-sm py-1.5" value={toMonth} onChange={e => setToMonth(Number(e.target.value))}>
                {MONTHS.map((m, i) => <option key={i} value={i+1}>{m}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
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

        {/* Chart Selection */}
        <div className="card mb-6">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Trend Analysis</h2>
            <select
              className="input-field text-sm py-1.5 max-w-xs"
              value={chartType}
              onChange={e => setChartType(e.target.value)}
            >
              {CHART_OPTIONS.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>

          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              {chartType === 'production' ? (
                <BarChart data={prodChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="Crude Tar" fill="#3b82f6" radius={[4,4,0,0]} />
                  <Bar dataKey="Amm Sulphate" fill="#8b5cf6" radius={[4,4,0,0]} />
                  <Bar dataKey="Crude Benzol" fill="#10b981" radius={[4,4,0,0]} />
                </BarChart>
              ) : chartType === 'iso_old' ? (
                <LineChart data={isoChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="Ammonia" stroke="#ef4444" strokeWidth={2} dot={{ r: 4 }} />
                  <Line type="monotone" dataKey="Naphthalene" stroke="#f59e0b" strokeWidth={2} dot={{ r: 4 }} />
                  <Line type="monotone" dataKey="Tar Fog" stroke="#6366f1" strokeWidth={2} dot={{ r: 4 }} />
                </LineChart>
              ) : (
                <LineChart data={labChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="Ammonia" stroke="#ef4444" strokeWidth={2} dot={{ r: 4 }} />
                  <Line type="monotone" dataKey="Naphthalene" stroke="#f59e0b" strokeWidth={2} dot={{ r: 4 }} />
                  <Line type="monotone" dataKey="Tar Fog" stroke="#6366f1" strokeWidth={2} dot={{ r: 4 }} />
                </LineChart>
              )}
            </ResponsiveContainer>
          </div>
        </div>

        {/* Data Table */}
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
                  <th className="px-4 py-3 text-right">Crude Benzol</th>
                </tr>
              </thead>
              <tbody>
                {productionData.map((row, i) => (
                  <tr key={i} className="border-b border-gray-100 hover:bg-blue-50/50">
                    <td className="px-4 py-3 font-medium">{MONTHS[row.month_index - 1]}</td>
                    <td className="px-4 py-3 text-right">{row.crude_tar_act || '-'}</td>
                    <td className="px-4 py-3 text-right">{row.ehp_act || '-'}</td>
                    <td className="px-4 py-3 text-right">{row.amm_sulphate_act || '-'}</td>
                    <td className="px-4 py-3 text-right">{row.sulphuric_acid_act || '-'}</td>
                    <td className="px-4 py-3 text-right">{row.crude_benzol_act || '-'}</td>
                  </tr>
                ))}
                {productionData.length === 0 && (
                  <tr><td colSpan={6} className="px-4 py-8 text-center text-gray-400">No data for selected period</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  )
}
