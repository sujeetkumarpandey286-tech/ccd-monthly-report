'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'
import Navbar from '@/components/Navbar'

const supabase = createClient(
  'https://hwafhyotnviacdzsdzsv.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh3YWZoeW90bnZpYWNkenNkenN2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQwODg5NzIsImV4cCI6MjA5OTY2NDk3Mn0.1ibzOXApTZA_P9T6kiq7ayf85KmxNd91XeP6f7SdyGc'
)

const MONTHS = ['Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec','Jan','Feb','Mar']

const SECTIONS: { id: string; label: string; table: string; fields: { key: string; label: string }[] }[] = [
  {
    id: 'production', label: 'Production', table: 'production',
    fields: [
      { key: 'crude_tar_app', label: 'Crude Tar (APP)' },
      { key: 'crude_tar_act', label: 'Crude Tar (ACT)' },
      { key: 'ehp_app', label: 'EHP (APP)' },
      { key: 'ehp_act', label: 'EHP (ACT)' },
      { key: 'sulphuric_acid_app', label: 'Sulphuric Acid (APP)' },
      { key: 'sulphuric_acid_act', label: 'Sulphuric Acid (ACT)' },
      { key: 'amm_sulphate_app', label: 'Amm. Sulphate (APP)' },
      { key: 'amm_sulphate_act', label: 'Amm. Sulphate (ACT)' },
      { key: 'light_oil_act', label: 'Light Oil (ACT)' },
      { key: 'carbolic_oil_act', label: 'Carbolic Oil (ACT)' },
      { key: 'lco_ii_act', label: 'LCO-II (ACT)' },
      { key: 'anthracene_oil_act', label: 'Anthracene Oil (ACT)' },
      { key: 'naphthalene_oil_act', label: 'Naphthalene Oil (ACT)' },
      { key: 'coal_tar_oil_total_act', label: 'Coal Tar Oil Total (ACT)' },
      { key: 'crude_benzol_app', label: 'Crude Benzol (APP)' },
      { key: 'crude_benzol_act', label: 'Crude Benzol (ACT)' },
      { key: 'ammonia_liquor_act', label: 'Ammonia Liquor (ACT)' },
      { key: 'rt_iv_app', label: 'RT-IV (APP)' },
      { key: 'rt_iv_act', label: 'RT-IV (ACT)' },
      { key: 'dehy_tar_act', label: 'Dehy. Tar (ACT)' },
    ]
  },
  {
    id: 'receipt', label: 'Receipt', table: 'receipt',
    fields: [
      { key: 'o_phosphoric_acid_kg', label: 'O-Phosphoric Acid (Kg)' },
      { key: 'caustic_lye', label: 'Caustic Lye' },
      { key: 'sulphuric_acid', label: 'Sulphuric Acid' },
      { key: 'sulphur', label: 'Sulphur' },
    ]
  },
  {
    id: 'consumption', label: 'Consumption / Transfer', table: 'consumption',
    fields: [
      { key: 'crude_tar_distilled', label: 'Crude Tar - Distilled' },
      { key: 'crude_tar_pbcc', label: 'Crude Tar - PBCC' },
      { key: 'crude_tar_bf', label: 'Crude Tar - BF' },
      { key: 'crude_tar_dehy_tar', label: 'Crude Tar - Dehy Tar' },
      { key: 'crude_tar_stabilization', label: 'Crude Tar - Stabilization' },
      { key: 'crude_tar_handling_loss', label: 'Crude Tar - Handling Loss' },
      { key: 'crude_tar_total', label: 'Crude Tar - Total' },
      { key: 'ehp_pbcc', label: 'EHP - PBCC' },
      { key: 'ehp_bf', label: 'EHP - BF' },
      { key: 'ehp_ldbp', label: 'EHP - LDBP' },
      { key: 'ehp_total', label: 'EHP - Total' },
      { key: 'sulphuric_acid_sulp', label: 'Sulphuric Acid - Sulp.' },
      { key: 'sulphuric_acid_n_ccd', label: 'Sulphuric Acid - N CCD' },
      { key: 'sulphuric_acid_bod', label: 'Sulphuric Acid - BOD' },
      { key: 'sulphuric_acid_crm', label: 'Sulphuric Acid - CRM' },
      { key: 'sulphuric_acid_cpp1', label: 'Sulphuric Acid - CPP-1' },
      { key: 'sulphuric_acid_comm_stab', label: 'Sulphuric Acid - Comm. & Stab.' },
      { key: 'sulphuric_acid_total', label: 'Sulphuric Acid - Total' },
      { key: 'road_tar_ces', label: 'Road Tar - CES' },
      { key: 'road_tar_ts', label: 'Road Tar - TS' },
      { key: 'road_tar_total', label: 'Road Tar - Total' },
      { key: 'o_phosphoric_acid', label: 'O-Phosphoric Acid' },
      { key: 'caustic_lye', label: 'Caustic Lye' },
      { key: 'sulphur_consum', label: 'Sulphur - Consumption' },
      { key: 'sulphur_muck_removal', label: 'Sulphur - Muck Removal' },
      { key: 'sulphur_handling_loss', label: 'Sulphur - Handling Loss' },
      { key: 'sulphur_pit_comm', label: 'Sulphur - Pit Comm.' },
      { key: 'sulphur_pit_stab', label: 'Sulphur - Pit Stab.' },
      { key: 'sulphur_total', label: 'Sulphur - Total' },
      { key: 'light_oil_cr_tar', label: 'Light Oil - Cr. Tar' },
      { key: 'light_oil_handling_loss', label: 'Light Oil - Handling Loss' },
      { key: 'light_oil_total', label: 'Light Oil - Total' },
      { key: 'carbolic_oil_cr_tar', label: 'Carbolic Oil - Cr. Tar' },
      { key: 'carbolic_oil_handling_loss', label: 'Carbolic Oil - Handling Loss' },
      { key: 'carbolic_oil_total', label: 'Carbolic Oil - Total' },
      { key: 'naphthalene_oil_cr_tar', label: 'Naphthalene Oil - Cr. Tar' },
      { key: 'naphthalene_oil_handling_loss', label: 'Naphthalene Oil - Handling Loss' },
      { key: 'naphthalene_oil_naph_plant', label: 'Naphthalene Oil - Naph. Plant' },
      { key: 'naphthalene_oil_total', label: 'Naphthalene Oil - Total' },
      { key: 'wash_oil_tar_plant', label: 'Wash Oil - Tar Plant' },
      { key: 'wash_oil_handling_loss', label: 'Wash Oil - Handling Loss' },
      { key: 'wash_oil_naph_plant', label: 'Wash Oil - Naph. Plant' },
      { key: 'wash_oil_cr_tar', label: 'Wash Oil - Cr. Tar' },
      { key: 'wash_oil_total', label: 'Wash Oil - Total' },
      { key: 'anthracene_oil_cr_tar', label: 'Anthracene Oil - Cr. Tar' },
      { key: 'anthracene_oil_handling_loss', label: 'Anthracene Oil - Handling Loss' },
      { key: 'anthracene_oil_rt_iv', label: 'Anthracene Oil - RT-IV' },
      { key: 'anthracene_oil_total', label: 'Anthracene Oil - Total' },
    ]
  },
  {
    id: 'despatch', label: 'Despatch', table: 'despatch',
    fields: [
      { key: 'crude_tar_app', label: 'Crude Tar (APP)' },
      { key: 'crude_tar_act', label: 'Crude Tar (ACT)' },
      { key: 'dehydrated_tar_act', label: 'Dehydrated Tar (ACT)' },
      { key: 'lco_ii_act', label: 'LCO-II (ACT)' },
      { key: 'anthracene_oil_act', label: 'Anthracene Oil (ACT)' },
      { key: 'amm_sulphate_app', label: 'Amm. Sulphate (APP)' },
      { key: 'amm_sulphate_act', label: 'Amm. Sulphate (ACT)' },
      { key: 'sulphuric_acid_app', label: 'Sulphuric Acid (APP)' },
      { key: 'sulphuric_acid_act', label: 'Sulphuric Acid (ACT)' },
    ]
  },
  {
    id: 'stock', label: 'Stock', table: 'stock',
    fields: [
      { key: 'crude_tar', label: 'Crude Tar' },
      { key: 'dehydrated_tar', label: 'Dehydrated Tar' },
      { key: 'ehp', label: 'EHP' },
      { key: 'rt_iv', label: 'RT-IV' },
      { key: 'hpn', label: 'HPN' },
      { key: 'light_oil', label: 'Light Oil' },
      { key: 'carbolic_oil', label: 'Carbolic Oil' },
      { key: 'lco_ii', label: 'LCO-II' },
      { key: 'anthracene_oil', label: 'Anthracene Oil' },
      { key: 'sulphuric_acid', label: 'Sulphuric Acid' },
      { key: 'amm_sulphate', label: 'Amm. Sulphate' },
      { key: 'crude_benzol', label: 'Crude Benzol' },
      { key: 'o_phosphoric_acid', label: 'O-Phosphoric Acid' },
      { key: 'caustic_lye', label: 'Caustic Lye' },
      { key: 'sulphur', label: 'Sulphur' },
      { key: 'naphthalene_oil', label: 'Naphthalene Oil' },
    ]
  },
  {
    id: 'techno_eco', label: 'Techno-Eco. Parameters', table: 'techno_eco',
    fields: [
      { key: 'oven_pushing_old_month', label: 'Oven Pushing (Old) - Month' },
      { key: 'oven_pushing_old_day', label: 'Oven Pushing (Old) - Day' },
      { key: 'oven_pushing_new_month', label: 'Oven Pushing (New) - Month' },
      { key: 'oven_pushing_new_day', label: 'Oven Pushing (New) - Day' },
      { key: 'coal_charged_per_oven_old', label: 'Coal Chgd. Per Oven (Old)' },
      { key: 'coal_charged_per_oven_new', label: 'Coal Chgd. Per Oven (New)' },
      { key: 'vm_percent_coal_blend_old', label: '%VM in Coal Blend (Old)' },
      { key: 'vm_percent_coal_blend_new', label: '%VM in Coal Blend (New)' },
      { key: 'raw_gas_ammonia_g_nm3', label: 'Raw Gas Ammonia [g/Nm3]' },
      { key: 'acid_per_t_sulphate', label: 'Acid / T Sulphate' },
      { key: 'sulphur_per_t_acid', label: 'Sulphur / T Acid' },
    ]
  },
  {
    id: 'product_yield', label: 'Product Yield', table: 'product_yield',
    fields: [
      { key: 'crude_tar_kg_tdcc_old', label: 'Crude Tar [kg/TDCC] (Old)' },
      { key: 'crude_tar_kg_tdcc_new', label: 'Crude Tar [kg/TDCC] (New)' },
      { key: 'ehp_pct_ctd', label: 'EHP [%CTD]' },
      { key: 'light_oil_pct_ctd', label: 'Light Oil [%CTD]' },
      { key: 'hpn_pct_nod', label: 'HPN [%NOD]' },
      { key: 'amm_sulphate_kg_tdcc', label: 'Amm. Sulphate [kg/TDCC]' },
      { key: 'anthracene_oil_pct_ctd', label: 'Anthracene Oil [%CTD]' },
      { key: 'lco_ii_pct_ctd', label: 'LCO-II [%CTD]' },
      { key: 'carbolic_oil_pct_ctd', label: 'Carbolic Oil [%CTD]' },
      { key: 'naphthalene_oil_pct_ctd', label: 'Naphthalene Oil [%CTD]' },
      { key: 'total_tar_product_pct_ctd', label: 'Total Tar Product [%CTD]' },
    ]
  },
  {
    id: 'revenue', label: 'Revenue Generation', table: 'revenue',
    fields: [
      { key: 'nsr_lakh_rs', label: 'NSR [Lakh Rs.]' },
    ]
  },
  {
    id: 'running_hours', label: 'Running Hours', table: 'running_hours',
    fields: [
      { key: 'exhauster_1', label: 'Exhauster #1' },
      { key: 'exhauster_2', label: 'Exhauster #2' },
      { key: 'exhauster_3', label: 'Exhauster #3' },
      { key: 'exhauster_4', label: 'Exhauster #4' },
      { key: 'exhauster_5', label: 'Exhauster #5' },
      { key: 'exhauster_6', label: 'Exhauster #6' },
      { key: 'booster_1', label: 'Booster #1' },
      { key: 'booster_2', label: 'Booster #2' },
      { key: 'booster_3', label: 'Booster #3' },
      { key: 'booster_4', label: 'Booster #4' },
      { key: 'booster_5', label: 'Booster #5' },
      { key: 'tar_distillation', label: 'Tar Distillation' },
      { key: 'vacuum', label: 'Vacuum' },
      { key: 'acid_plant', label: 'Acid Plant' },
      { key: 'ammonium_sulphate', label: 'Ammonium Sulphate' },
    ]
  },
  {
    id: 'iso_objectives', label: 'ISO Objectives', table: 'iso_objectives',
    fields: [
      { key: 'end_gas_ammonia_g_nm3', label: 'End Gas Ammonia [G/NM3]' },
      { key: 'end_gas_naphthalene_g_nm3', label: 'End Gas Naphthalene [G/NM3]' },
      { key: 'tar_fog_g_nm3', label: 'Tar Fog [G/NM3]' },
    ]
  },
  {
    id: 'ohsas_objectives', label: 'OHSAS Objectives', table: 'ohsas_objectives',
    fields: [
      { key: 'reportable_accidents', label: 'Reportable Accidents [Nos.]' },
      { key: 'health_checkups_total', label: 'Health Check-ups [Nos.]' },
      { key: 'earthing_pit_inspection_pct', label: 'Earthing Pit Inspection [%]' },
    ]
  },
  {
    id: 'environment_bod', label: 'Environment BOD Analysis', table: 'environment_bod',
    fields: [
      { key: 'ammonia_in', label: 'Ammonia: In' },
      { key: 'ammonia_out', label: 'Ammonia: Out' },
      { key: 'phenol_in', label: 'Phenol: In' },
      { key: 'phenol_out', label: 'Phenol: Out' },
      { key: 'cyanide_in', label: 'Cyanide: In' },
      { key: 'cyanide_out', label: 'Cyanide: Out' },
      { key: 'ph_in', label: 'pH: In' },
      { key: 'ph_out', label: 'pH: Out' },
      { key: 'phosphate_out', label: 'Phosphate: Out' },
      { key: 'mlss_at_i', label: 'MLSS: AT-I' },
      { key: 'mlss_at_ii', label: 'MLSS: AT-II' },
    ]
  },
  {
    id: 'product_quality', label: 'Product Quality (Old CCD)', table: 'product_quality',
    fields: [
      { key: 'tar_quality_bi', label: 'Tar Quality: BI' },
      { key: 'tar_quality_qi', label: 'Tar Quality: QI' },
      { key: 'tar_sp_gr', label: 'Tar Sp. Gr.' },
      { key: 'acid_concentration', label: 'Acid Concentration' },
    ]
  },
  {
    id: 'lab_analysis_new', label: 'Lab Analysis (New CCD)', table: 'lab_analysis_new',
    fields: [
      { key: 'tar_fog_g_nm3', label: 'Tar Fog [G/NM3]' },
      { key: 'naphthalene_g_nm3', label: 'Naphthalene [G/NM3]' },
      { key: 'ammonia_g_nm3', label: 'Ammonia [G/NM3]' },
    ]
  },
  {
    id: 'product_quality_new', label: 'Product Quality (New CCD)', table: 'product_quality_new',
    fields: [
      { key: 'tar_quality_bi', label: 'Tar Quality: BI' },
      { key: 'tar_quality_qi', label: 'Tar Quality: QI' },
      { key: 'tar_sp_gr', label: 'Tar Sp. Gr.' },
      { key: 'acid_concentration', label: 'Acid Concentration' },
    ]
  },
]

export default function ViewDataPage() {
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [fiscalYear, setFiscalYear] = useState('2025-26')
  const [selectedMonth, setSelectedMonth] = useState(1)
  const [selectedSection, setSelectedSection] = useState('production')
  const [viewMode, setViewMode] = useState<'single' | 'yearly'>('single')
  const [data, setData] = useState<any>(null)
  const [yearlyData, setYearlyData] = useState<any[]>([])
  const [fetching, setFetching] = useState(false)

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
    if (!profile) return
    fetchData()
  }, [profile, fiscalYear, selectedMonth, selectedSection, viewMode])

  async function fetchData() {
    setFetching(true)
    const section = SECTIONS.find(s => s.id === selectedSection)
    if (!section) return

    if (viewMode === 'single') {
      const { data: result } = await supabase
        .from(section.table)
        .select('*')
        .eq('fiscal_year', fiscalYear)
        .eq('month_index', selectedMonth)
        .single()
      setData(result)
    } else {
      const { data: result } = await supabase
        .from(section.table)
        .select('*')
        .eq('fiscal_year', fiscalYear)
        .order('month_index')
      setYearlyData(result || [])
    }
    setFetching(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-gray-500">Loading...</div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="card text-center">
          <p className="text-red-600 font-medium">Not logged in</p>
        </div>
      </div>
    )
  }

  const currentSection = SECTIONS.find(s => s.id === selectedSection)

  return (
    <div className="min-h-screen">
      <Navbar profile={profile} activeTab="view" />
      <main className="p-6 max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">View Data (Read Only)</h1>

        {/* Controls */}
        <div className="card mb-6">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Fiscal Year</label>
              <select className="input-field" value={fiscalYear} onChange={e => setFiscalYear(e.target.value)}>
                <option value="2022-23">2022-23</option>
                <option value="2023-24">2023-24</option>
                <option value="2024-25">2024-25</option>
                <option value="2025-26">2025-26</option>
                <option value="2026-27">2026-27</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">View Mode</label>
              <select className="input-field" value={viewMode} onChange={e => setViewMode(e.target.value as any)}>
                <option value="single">Single Month</option>
                <option value="yearly">Full Year Table</option>
              </select>
            </div>
            {viewMode === 'single' && (
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Month</label>
                <select className="input-field" value={selectedMonth} onChange={e => setSelectedMonth(Number(e.target.value))}>
                  {MONTHS.map((m, i) => (<option key={i} value={i + 1}>{m}</option>))}
                </select>
              </div>
            )}
            <div className="md:col-span-2">
              <label className="block text-xs font-medium text-gray-600 mb-1">Section</label>
              <select className="input-field" value={selectedSection} onChange={e => setSelectedSection(e.target.value)}>
                {SECTIONS.map(s => (<option key={s.id} value={s.id}>{s.label}</option>))}
              </select>
            </div>
          </div>
        </div>

        {/* Data Display */}
        {fetching ? (
          <div className="card text-center py-8">
            <div className="animate-pulse text-gray-500">Loading data...</div>
          </div>
        ) : viewMode === 'single' ? (
          <div className="card">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              {currentSection?.label} — {MONTHS[selectedMonth - 1]} {fiscalYear}
            </h2>
            {!data ? (
              <p className="text-gray-500 text-sm">No data recorded for this month.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-2 px-3 font-medium text-gray-600">Parameter</th>
                      <th className="text-right py-2 px-3 font-medium text-gray-600">Value</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentSection?.fields.map(f => (
                      <tr key={f.key} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-2 px-3 text-gray-700">{f.label}</td>
                        <td className="py-2 px-3 text-right font-mono text-gray-900">
                          {data[f.key] !== null && data[f.key] !== undefined ? data[f.key] : <span className="text-gray-300">—</span>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        ) : (
          <div className="card">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              {currentSection?.label} — Full Year {fiscalYear}
            </h2>
            {yearlyData.length === 0 ? (
              <p className="text-gray-500 text-sm">No data recorded for this FY.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-2 px-2 font-medium text-gray-600 sticky left-0 bg-white">Parameter</th>
                      {MONTHS.map(m => (
                        <th key={m} className="text-center py-2 px-2 font-medium text-gray-600 min-w-[60px]">{m}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {currentSection?.fields.map(f => (
                      <tr key={f.key} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-2 px-2 text-gray-700 sticky left-0 bg-white text-xs whitespace-nowrap">{f.label}</td>
                        {MONTHS.map((_, mi) => {
                          const monthRow = yearlyData.find(r => r.month_index === mi + 1)
                          const val = monthRow?.[f.key]
                          return (
                            <td key={mi} className="py-2 px-2 text-center font-mono text-gray-900">
                              {val !== null && val !== undefined ? val : <span className="text-gray-300">—</span>}
                            </td>
                          )
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  )
}
