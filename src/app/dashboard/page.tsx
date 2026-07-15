'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase'
import { Profile, MONTHS, FISCAL_YEAR } from '@/lib/types'
import Navbar from '@/components/Navbar'
import { useRouter } from 'next/navigation'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, Legend
} from 'recharts'

const PRODUCT_OPTIONS = [
  { id: 'crude_tar', label: 'Crude Tar', appField: 'crude_tar_app', actField: 'crude_tar_act', unit: 'T' },
  { id: 'ehp', label: 'EHP', appField: 'ehp_app', actField: 'ehp_act', unit: 'T' },
  { id: 'sulphuric_acid', label: 'Sulphuric Acid', appField: 'sulphuric_acid_app', actField: 'sulphuric_acid_act', unit: 'T' },
  { id: 'amm_sulphate', label: 'Amm. Sulphate', appField: 'amm_sulphate_app', actField: 'amm_sulphate_act', unit: 'T' },
  { id: 'crude_benzol', label: 'Crude Benzol', appField: 'crude_benzol_app', actField: 'crude_benzol_act', unit: 'T' },
  { id: 'rt_iv', label: 'RT-IV', appField: 'rt_iv_app', actField: 'rt_iv_act', unit: 'T' },
  { id: 'light_oil', label: 'Light Oil', appField: null, actField: 'light_oil_act', unit: 'T' },
  { id: 'anthracene_oil', label: 'Anthracene Oil', appField: null, actField: 'anthracene_oil_act', unit: 'T' },
]

export default function DashboardPage() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [productionData, setProductionData] = useState<any[]>([])
  const [monthStatuses, setMonthStatuses] = useState<any[]>([])
  const [yieldData, setYieldData] = useState<any>(null)
  const [envData, setEnvData] = useState<any>(null)
  const [safetyData, setSafetyData] = useState<any>(null)
  const [selectedProduct, setSelectedProduct] = useState('crude_tar')
  const router = useRouter()

  useEffect(() => { loadAll() }, [])

  async function loadAll() {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push('/'); return }

    const { data: prof } = await supabase.from('profiles').select('*').eq('id', user.id).single()
    if (prof) setProfile(prof)

    // Load production data for all months
    const { data: prod } = await supabase
      .from('production')
      .select('*')
      .eq('fiscal_year', FISCAL_YEAR)
      .order('month_index')
    setProductionData(prod || [])

    // Load month statuses for completion tracker
    const { data: statuses } = await supabase
      .from('month_status')
      .select('*')
      .eq('fiscal_year', FISCAL_YEAR)
    setMonthStatuses(statuses || [])

    // Load latest yield data
    const { data: yld } = await supabase
      .from('product_yield')
      .select('*')
      .eq('fiscal_year', FISCAL_YEAR)
      .order('month_index', { ascending: false })
      .limit(1)
      .single()
    setYieldData(yld)

    // Load latest environment data
    const { data: env } = await supabase
      .from('environment_bod')
      .select('*')
      .eq('fiscal_year', FISCAL_YEAR)
      .order('month_index', { ascending: false })
      .limit(1)
      .single()
    setEnvData(env)

    // Load latest safety data
    const { data: safety } = await supabase
      .from('ohsas_objectives')
      .select('*')
      .eq('fiscal_year', FISCAL_YEAR)
      .order('month_index', { ascending: false })
      .limit(1)
      .single()
    setSafetyData(safety)
  }

  if (!profile) return <div className="min-h-screen flex items-center justify-center text-sm text-slate-500">Loading...</div>

  // Compute KPIs from production data
  const totalCrudeTarApp = productionData.reduce((s, r) => s + (r.crude_tar_app || 0), 0)
  const totalCrudeTarAct = productionData.reduce((s, r) => s + (r.crude_tar_act || 0), 0)
  const totalAmmSulApp = productionData.reduce((s, r) => s + (r.amm_sulphate_app || 0), 0)
  const totalAmmSulAct = productionData.reduce((s, r) => s + (r.amm_sulphate_act || 0), 0)
  const totalH2SO4App = productionData.reduce((s, r) => s + (r.sulphuric_acid_app || 0), 0)
  const totalH2SO4Act = productionData.reduce((s, r) => s + (r.sulphuric_acid_act || 0), 0)

  const crudeTarVar = totalCrudeTarApp ? ((totalCrudeTarAct - totalCrudeTarApp) / totalCrudeTarApp * 100).toFixed(1) : '0'
  const ammSulVar = totalAmmSulApp ? ((totalAmmSulAct - totalAmmSulApp) / totalAmmSulApp * 100).toFixed(1) : '0'
  const h2so4Var = totalH2SO4App ? ((totalH2SO4Act - totalH2SO4App) / totalH2SO4App * 100).toFixed(1) : '0'

  // Get selected product config
  const selProd = PRODUCT_OPTIONS.find(p => p.id === selectedProduct) || PRODUCT_OPTIONS[0]

  // Bar chart data - individual product monthly breakdown
  const barData = productionData.map(r => ({
    name: MONTHS[r.month_index - 1],
    ...(selProd.appField ? { app: r[selProd.appField] || 0 } : {}),
    act: r[selProd.actField] || 0,
  }))

  // Line chart: monthly trend for selected product
  const trendData = productionData.map(r => ({
    month: MONTHS[r.month_index - 1],
    actual: r[selProd.actField] || 0,
    ...(selProd.appField ? { target: r[selProd.appField] || 0 } : {}),
  }))

  // Section completion for current month
  const currentMonth = productionData.length > 0 ? Math.max(...productionData.map(r => r.month_index)) : 1
  const sectionNames = ['production', 'receipt', 'consumption', 'despatch', 'stock', 'running_hours', 'techno_eco', 'product_yield', 'product_quality', 'iso_objectives', 'ohsas_objectives', 'environment_bod']

  // Variance table data
  const varianceData = [
    { product: 'Crude Tar', app: totalCrudeTarApp, act: totalCrudeTarAct },
    { product: 'EHP', app: productionData.reduce((s, r) => s + (r.ehp_app || 0), 0), act: productionData.reduce((s, r) => s + (r.ehp_act || 0), 0) },
    { product: 'Sulphuric Acid', app: totalH2SO4App, act: totalH2SO4Act },
    { product: 'Amm. Sulphate', app: totalAmmSulApp, act: totalAmmSulAct },
    { product: 'Crude Benzol', app: productionData.reduce((s, r) => s + (r.crude_benzol_app || 0), 0), act: productionData.reduce((s, r) => s + (r.crude_benzol_act || 0), 0) },
  ].map(r => ({
    ...r,
    variance: r.act - r.app,
    pctDev: r.app ? ((r.act - r.app) / r.app * 100).toFixed(1) : '—',
    status: !r.app ? 'Surplus' : (r.act - r.app) / r.app > -0.05 ? 'On Track' : (r.act - r.app) / r.app > -0.2 ? 'Monitor' : 'Critical'
  }))

  return (
    <>
      <Navbar profile={profile} activeTab="dashboard" />
      <div className="pt-[60px] px-10 pb-10 max-w-[1320px] mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mt-8 mb-6">
          <h2 className="text-[22px] font-extrabold tracking-tight">Dashboard & Analytics</h2>
          <span className="text-xs text-slate-500 bg-white px-4 py-1.5 rounded-full border border-slate-200 font-medium">
            FY {FISCAL_YEAR} · Cumulative
          </span>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="kpi-card" style={{ borderTop: '3px solid #4f46e5' }}>
            <div className="text-[10.5px] uppercase tracking-wide text-slate-500 font-semibold mb-2">Crude Tar</div>
            <div className="text-[26px] font-extrabold leading-none">{totalCrudeTarAct.toLocaleString()} T</div>
            <div className={`text-[11px] mt-2 font-semibold ${Number(crudeTarVar) >= 0 ? 'text-teal-600' : 'text-rose-600'}`}>
              {Number(crudeTarVar) >= 0 ? '▲' : '▼'} {crudeTarVar}% vs Target
            </div>
          </div>
          <div className="kpi-card" style={{ borderTop: '3px solid #e11d48' }}>
            <div className="text-[10.5px] uppercase tracking-wide text-slate-500 font-semibold mb-2">Amm. Sulphate</div>
            <div className="text-[26px] font-extrabold leading-none">{totalAmmSulAct.toLocaleString()} T</div>
            <div className={`text-[11px] mt-2 font-semibold ${Number(ammSulVar) >= 0 ? 'text-teal-600' : 'text-rose-600'}`}>
              {Number(ammSulVar) >= 0 ? '▲' : '▼'} {ammSulVar}% vs Target
            </div>
          </div>
          <div className="kpi-card" style={{ borderTop: '3px solid #d97706' }}>
            <div className="text-[10.5px] uppercase tracking-wide text-slate-500 font-semibold mb-2">Sulphuric Acid</div>
            <div className="text-[26px] font-extrabold leading-none">{totalH2SO4Act.toLocaleString()} T</div>
            <div className={`text-[11px] mt-2 font-semibold ${Number(h2so4Var) >= 0 ? 'text-teal-600' : 'text-rose-600'}`}>
              {Number(h2so4Var) >= 0 ? '▲' : '▼'} {h2so4Var}% vs Target
            </div>
          </div>
          <div className="kpi-card" style={{ borderTop: '3px solid #0d9488' }}>
            <div className="text-[10.5px] uppercase tracking-wide text-slate-500 font-semibold mb-2">Revenue (NSR)</div>
            <div className="text-[26px] font-extrabold leading-none">—</div>
            <div className="text-[11px] mt-2 font-semibold text-slate-400">Awaiting data</div>
          </div>
        </div>

        {/* Charts Row 1 */}
        <div className="grid grid-cols-5 gap-4 mb-4">
          <div className="col-span-3 card p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[13px] font-bold">{selProd.label}: Monthly Target vs Actual ({selProd.unit})</h3>
              <select className="text-xs border border-slate-200 rounded-lg px-2 py-1 bg-white" value={selectedProduct} onChange={e => setSelectedProduct(e.target.value)}>
                {PRODUCT_OPTIONS.map(p => (<option key={p.id} value={p.id}>{p.label}</option>))}
              </select>
            </div>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={barData} barGap={2}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip contentStyle={{ fontSize: 12 }} />
                {selProd.appField && <Bar dataKey="app" name="Target" fill="#eef2ff" stroke="#a5b4fc" strokeWidth={1.5} radius={[4,4,0,0]} />}
                <Bar dataKey="act" name="Actual" fill="#4f46e5" radius={[4,4,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="col-span-2 card p-5">
            <h3 className="text-[13px] font-bold mb-4">Section Completion — {MONTHS[currentMonth - 1] || 'APR'}</h3>
            <ul className="space-y-1">
              {sectionNames.slice(0, 8).map(code => {
                const st = monthStatuses.find(s => s.section_code === code && s.month_index === currentMonth)
                const label = code.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
                const badge = st?.status === 'submitted'
                  ? 'bg-teal-50 text-teal-700'
                  : st?.status === 'draft'
                  ? 'bg-amber-50 text-amber-700'
                  : 'bg-slate-50 text-slate-400'
                const badgeText = st?.status === 'submitted' ? 'Submitted' : st?.status === 'draft' ? 'In Progress' : 'Not Started'
                return (
                  <li key={code} className="flex items-center justify-between py-1.5 text-xs border-b border-slate-50">
                    <span className="font-medium text-slate-700">{label}</span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${badge}`}>{badgeText}</span>
                  </li>
                )
              })}
            </ul>
          </div>
        </div>

        {/* Charts Row 2 */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="card p-5">
            <h3 className="text-[13px] font-bold mb-4">{selProd.label} — Monthly Trend ({selProd.unit})</h3>
            <ResponsiveContainer width="100%" height={140}>
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip contentStyle={{ fontSize: 12 }} />
                <Line type="monotone" dataKey="actual" stroke="#4f46e5" strokeWidth={2.5} dot={{ r: 3 }} name="Actual" />
                {selProd.appField && <Line type="monotone" dataKey="target" stroke="#cbd5e1" strokeWidth={1.5} strokeDasharray="4 3" dot={false} name="Target" />}
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="card p-5">
            <h3 className="text-[13px] font-bold mb-4">Yield Performance</h3>
            <div className="grid grid-cols-3 gap-4 text-center">
              {[
                { label: 'Tar Yield', value: yieldData?.crude_tar_kg_tdcc_old, norm: 32, color: '#4f46e5' },
                { label: 'EHP %CTD', value: yieldData?.ehp_pct_ctd, norm: 53.5, color: '#0d9488' },
                { label: 'AS kg/TDCC', value: yieldData?.amm_sulphate_kg_tdcc, norm: 8.2, color: '#d97706' },
              ].map(g => {
                const pct = g.value && g.norm ? Math.min((g.value / g.norm) * 100, 100) : 0
                const circum = 2 * Math.PI * 30
                return (
                  <div key={g.label}>
                    <svg width="76" height="76" className="mx-auto mb-1.5">
                      <circle cx="38" cy="38" r="30" fill="none" stroke="#e2e8f0" strokeWidth="7" />
                      <circle cx="38" cy="38" r="30" fill="none" stroke={g.color} strokeWidth="7"
                              strokeDasharray={`${circum * pct / 100} ${circum}`}
                              strokeLinecap="round" transform="rotate(-90 38 38)" />
                      <text x="38" y="42" textAnchor="middle" fontSize="13" fontWeight="800" fill="#0f172a">
                        {pct ? `${Math.round(pct)}%` : '—'}
                      </text>
                    </svg>
                    <div className="text-[10px] text-slate-500 font-medium">{g.label}</div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Environment & Safety */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="card p-5">
            <h3 className="text-[13px] font-bold mb-3">Environment (BOD Analysis)</h3>
            <table className="w-full text-xs">
              <tbody>
                {[
                  { label: 'Ammonia Out', value: envData?.ammonia_out, norm: 50, unit: 'ppm' },
                  { label: 'Phenol Out', value: envData?.phenol_out, norm: 1.0, unit: 'ppm' },
                  { label: 'Cyanide Out', value: envData?.cyanide_out, norm: 0.2, unit: 'ppm' },
                  { label: 'pH Out', value: envData?.ph_out, norm: null, unit: '' },
                  { label: 'MLSS AT-I', value: envData?.mlss_at_i, norm: null, unit: 'ppm' },
                ].map(r => (
                  <tr key={r.label} className="border-b border-slate-50">
                    <td className="py-2 font-medium text-slate-600">{r.label}</td>
                    <td className="py-2 text-right font-bold">
                      {r.value != null ? (
                        <span className={r.norm && r.value <= r.norm ? 'text-teal-600' : r.norm ? 'text-amber-600' : 'text-slate-700'}>
                          {r.norm && r.value <= r.norm ? '✓ ' : r.norm ? '⚠ ' : ''}
                          {r.value} {r.unit}
                        </span>
                      ) : <span className="text-slate-300">—</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="card p-5">
            <h3 className="text-[13px] font-bold mb-3">Safety & ISO</h3>
            <table className="w-full text-xs">
              <tbody>
                <tr className="border-b border-slate-50">
                  <td className="py-2 font-medium text-slate-600">Reportable Accidents</td>
                  <td className="py-2 text-right font-bold text-teal-600">{safetyData?.reportable_accidents ?? '—'}</td>
                </tr>
                <tr className="border-b border-slate-50">
                  <td className="py-2 font-medium text-slate-600">Health Checkups</td>
                  <td className="py-2 text-right font-bold text-slate-700">{safetyData?.health_checkups_total ?? '—'} / 255</td>
                </tr>
                <tr className="border-b border-slate-50">
                  <td className="py-2 font-medium text-slate-600">Earthing Pit Inspection</td>
                  <td className="py-2 text-right font-bold text-teal-600">{safetyData?.earthing_pit_inspection_pct ?? '—'}%</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Variance Analysis */}
        <div className="card p-5">
          <h3 className="text-[13px] font-bold mb-4">Variance & Deviation Analysis (Cumulative)</h3>
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="px-3 py-2 text-left font-bold uppercase tracking-wide text-slate-400 text-[10px]">Product</th>
                <th className="px-3 py-2 text-right font-bold uppercase tracking-wide text-slate-400 text-[10px]">APP</th>
                <th className="px-3 py-2 text-right font-bold uppercase tracking-wide text-slate-400 text-[10px]">Actual</th>
                <th className="px-3 py-2 text-right font-bold uppercase tracking-wide text-slate-400 text-[10px]">Variance</th>
                <th className="px-3 py-2 text-right font-bold uppercase tracking-wide text-slate-400 text-[10px]">% Dev</th>
                <th className="px-3 py-2 text-right font-bold uppercase tracking-wide text-slate-400 text-[10px]">Status</th>
              </tr>
            </thead>
            <tbody>
              {varianceData.map(r => (
                <tr key={r.product} className="border-b border-slate-50">
                  <td className="px-3 py-2.5 font-semibold text-slate-800">{r.product}</td>
                  <td className="px-3 py-2.5 text-right text-slate-500">{r.app.toLocaleString()}</td>
                  <td className="px-3 py-2.5 text-right font-semibold">{r.act.toLocaleString()}</td>
                  <td className={`px-3 py-2.5 text-right font-bold ${r.variance >= 0 ? 'text-teal-600' : 'text-rose-600'}`}>
                    {r.variance >= 0 ? '+' : ''}{r.variance.toLocaleString()}
                  </td>
                  <td className={`px-3 py-2.5 text-right font-bold ${Number(r.pctDev) >= 0 ? 'text-teal-600' : 'text-rose-600'}`}>
                    {r.pctDev === '—' ? '—' : `${r.pctDev}%`}
                  </td>
                  <td className="px-3 py-2.5 text-right">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      r.status === 'On Track' || r.status === 'Surplus' ? 'bg-teal-50 text-teal-700' :
                      r.status === 'Monitor' ? 'bg-amber-50 text-amber-700' :
                      'bg-rose-50 text-rose-700'
                    }`}>{r.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}
