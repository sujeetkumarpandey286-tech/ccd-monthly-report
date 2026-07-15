'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'
import Navbar from '@/components/Navbar'

const supabase = createClient(
  'https://hwafhyotnviacdzsdzsv.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh3YWZoeW90bnZpYWNkenNkenN2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQwODg5NzIsImV4cCI6MjA5OTY2NDk3Mn0.1ibzOXApTZA_P9T6kiq7ayf85KmxNd91XeP6f7SdyGc'
)

const MONTHS = ['Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec','Jan','Feb','Mar']

const SECTIONS: { id: string; label: string; table: string; fields: { key: string; label: string; unit: string }[] }[] = [
  {
    id: 'production', label: 'Production', table: 'production',
    fields: [
      { key: 'crude_tar_app', label: 'Crude Tar (APP)', unit: 'T' },
      { key: 'crude_tar_act', label: 'Crude Tar (ACT)', unit: 'T' },
      { key: 'ehp_app', label: 'EHP (APP)', unit: 'T' },
      { key: 'ehp_act', label: 'EHP (ACT)', unit: 'T' },
      { key: 'sulphuric_acid_app', label: 'Sulphuric Acid (APP)', unit: 'T' },
      { key: 'sulphuric_acid_act', label: 'Sulphuric Acid (ACT)', unit: 'T' },
      { key: 'amm_sulphate_app', label: 'Amm. Sulphate (APP)', unit: 'T' },
      { key: 'amm_sulphate_act', label: 'Amm. Sulphate (ACT)', unit: 'T' },
      { key: 'light_oil_act', label: 'Light Oil (ACT)', unit: 'T' },
      { key: 'carbolic_oil_act', label: 'Carbolic Oil (ACT)', unit: 'T' },
      { key: 'lco_ii_act', label: 'LCO-II (ACT)', unit: 'T' },
      { key: 'anthracene_oil_act', label: 'Anthracene Oil (ACT)', unit: 'T' },
      { key: 'naphthalene_oil_act', label: 'Naphthalene Oil (ACT)', unit: 'T' },
      { key: 'coal_tar_oil_total_act', label: 'Coal Tar Oil Total (ACT)', unit: 'T' },
      { key: 'crude_benzol_app', label: 'Crude Benzol (APP)', unit: 'T' },
      { key: 'crude_benzol_act', label: 'Crude Benzol (ACT)', unit: 'T' },
      { key: 'ammonia_liquor_act', label: 'Ammonia Liquor (ACT)', unit: 'T' },
      { key: 'rt_iv_app', label: 'RT-IV (APP)', unit: 'T' },
      { key: 'rt_iv_act', label: 'RT-IV (ACT)', unit: 'T' },
      { key: 'dehy_tar_act', label: 'Dehy. Tar (ACT)', unit: 'T' },
    ]
  },
  {
    id: 'receipt', label: 'Receipt', table: 'receipt',
    fields: [
      { key: 'o_phosphoric_acid_kg', label: 'O-Phosphoric Acid', unit: 'Kg' },
      { key: 'caustic_lye', label: 'Caustic Lye', unit: 'T' },
      { key: 'sulphuric_acid', label: 'Sulphuric Acid', unit: 'T' },
      { key: 'sulphur', label: 'Sulphur', unit: 'T' },
    ]
  },
  {
    id: 'consumption', label: 'Consumption / Transfer', table: 'consumption',
    fields: [
      { key: 'crude_tar_distilled', label: 'Crude Tar - Distilled', unit: 'T' },
      { key: 'crude_tar_pbcc', label: 'Crude Tar - PBCC', unit: 'T' },
      { key: 'crude_tar_bf', label: 'Crude Tar - BF', unit: 'T' },
      { key: 'crude_tar_dehy_tar', label: 'Crude Tar - Dehy Tar', unit: 'T' },
      { key: 'crude_tar_stabilization', label: 'Crude Tar - Stabilization', unit: 'T' },
      { key: 'crude_tar_handling_loss', label: 'Crude Tar - Handling Loss', unit: 'T' },
      { key: 'crude_tar_total', label: 'Crude Tar - Total', unit: 'T' },
      { key: 'ehp_pbcc', label: 'EHP - PBCC', unit: 'T' },
      { key: 'ehp_bf', label: 'EHP - BF', unit: 'T' },
      { key: 'ehp_ldbp', label: 'EHP - LDBP', unit: 'T' },
      { key: 'ehp_total', label: 'EHP - Total', unit: 'T' },
      { key: 'sulphuric_acid_sulp', label: 'Sulphuric Acid - Sulp.', unit: 'T' },
      { key: 'sulphuric_acid_n_ccd', label: 'Sulphuric Acid - N CCD', unit: 'T' },
      { key: 'sulphuric_acid_bod', label: 'Sulphuric Acid - BOD', unit: 'T' },
      { key: 'sulphuric_acid_crm', label: 'Sulphuric Acid - CRM', unit: 'T' },
      { key: 'sulphuric_acid_cpp1', label: 'Sulphuric Acid - CPP-1', unit: 'T' },
      { key: 'sulphuric_acid_comm_stab', label: 'Sulphuric Acid - Comm. & Stab.', unit: 'T' },
      { key: 'sulphuric_acid_total', label: 'Sulphuric Acid - Total', unit: 'T' },
      { key: 'road_tar_ces', label: 'Road Tar - CES', unit: 'T' },
      { key: 'road_tar_ts', label: 'Road Tar - TS', unit: 'T' },
      { key: 'road_tar_total', label: 'Road Tar - Total', unit: 'T' },
      { key: 'o_phosphoric_acid', label: 'O-Phosphoric Acid', unit: 'Kg' },
      { key: 'caustic_lye', label: 'Caustic Lye', unit: 'T' },
      { key: 'sulphur_consum', label: 'Sulphur - Consumption', unit: 'T' },
      { key: 'sulphur_muck_removal', label: 'Sulphur - Muck Removal', unit: 'T' },
      { key: 'sulphur_handling_loss', label: 'Sulphur - Handling Loss', unit: 'T' },
      { key: 'sulphur_pit_comm', label: 'Sulphur - Pit Comm.', unit: 'T' },
      { key: 'sulphur_pit_stab', label: 'Sulphur - Pit Stab.', unit: 'T' },
      { key: 'sulphur_total', label: 'Sulphur - Total', unit: 'T' },
      { key: 'light_oil_cr_tar', label: 'Light Oil - Cr. Tar', unit: 'T' },
      { key: 'light_oil_handling_loss', label: 'Light Oil - Handling Loss', unit: 'T' },
      { key: 'light_oil_total', label: 'Light Oil - Total', unit: 'T' },
      { key: 'carbolic_oil_cr_tar', label: 'Carbolic Oil - Cr. Tar', unit: 'T' },
      { key: 'carbolic_oil_handling_loss', label: 'Carbolic Oil - Handling Loss', unit: 'T' },
      { key: 'carbolic_oil_total', label: 'Carbolic Oil - Total', unit: 'T' },
      { key: 'naphthalene_oil_cr_tar', label: 'Naphthalene Oil - Cr. Tar', unit: 'T' },
      { key: 'naphthalene_oil_handling_loss', label: 'Naphthalene Oil - Handling Loss', unit: 'T' },
      { key: 'naphthalene_oil_naph_plant', label: 'Naphthalene Oil - Naph. Plant', unit: 'T' },
      { key: 'naphthalene_oil_total', label: 'Naphthalene Oil - Total', unit: 'T' },
      { key: 'wash_oil_tar_plant', label: 'Wash Oil - Tar Plant', unit: 'T' },
      { key: 'wash_oil_handling_loss', label: 'Wash Oil - Handling Loss', unit: 'T' },
      { key: 'wash_oil_naph_plant', label: 'Wash Oil - Naph. Plant', unit: 'T' },
      { key: 'wash_oil_cr_tar', label: 'Wash Oil - Cr. Tar', unit: 'T' },
      { key: 'wash_oil_total', label: 'Wash Oil - Total', unit: 'T' },
      { key: 'anthracene_oil_cr_tar', label: 'Anthracene Oil - Cr. Tar', unit: 'T' },
      { key: 'anthracene_oil_handling_loss', label: 'Anthracene Oil - Handling Loss', unit: 'T' },
      { key: 'anthracene_oil_rt_iv', label: 'Anthracene Oil - RT-IV', unit: 'T' },
      { key: 'anthracene_oil_total', label: 'Anthracene Oil - Total', unit: 'T' },
    ]
  },
  {
    id: 'despatch', label: 'Despatch', table: 'despatch',
    fields: [
      { key: 'crude_tar_app', label: 'Crude Tar (APP)', unit: 'T' },
      { key: 'crude_tar_act', label: 'Crude Tar (ACT)', unit: 'T' },
      { key: 'dehydrated_tar_act', label: 'Dehydrated Tar (ACT)', unit: 'T' },
      { key: 'lco_ii_act', label: 'LCO-II (ACT)', unit: 'T' },
      { key: 'anthracene_oil_act', label: 'Anthracene Oil (ACT)', unit: 'T' },
      { key: 'amm_sulphate_app', label: 'Amm. Sulphate (APP)', unit: 'T' },
      { key: 'amm_sulphate_act', label: 'Amm. Sulphate (ACT)', unit: 'T' },
      { key: 'sulphuric_acid_app', label: 'Sulphuric Acid (APP)', unit: 'T' },
      { key: 'sulphuric_acid_act', label: 'Sulphuric Acid (ACT)', unit: 'T' },
    ]
  },
  {
    id: 'stock', label: 'Stock', table: 'stock',
    fields: [
      { key: 'crude_tar', label: 'Crude Tar', unit: 'T' },
      { key: 'dehydrated_tar', label: 'Dehydrated Tar', unit: 'T' },
      { key: 'ehp', label: 'EHP', unit: 'T' },
      { key: 'rt_iv', label: 'RT-IV', unit: 'T' },
      { key: 'hpn', label: 'HPN', unit: 'T' },
      { key: 'light_oil', label: 'Light Oil', unit: 'T' },
      { key: 'carbolic_oil', label: 'Carbolic Oil', unit: 'T' },
      { key: 'lco_ii', label: 'LCO-II', unit: 'T' },
      { key: 'anthracene_oil', label: 'Anthracene Oil', unit: 'T' },
      { key: 'sulphuric_acid', label: 'Sulphuric Acid', unit: 'T' },
      { key: 'amm_sulphate', label: 'Amm. Sulphate', unit: 'T' },
      { key: 'crude_benzol', label: 'Crude Benzol', unit: 'T' },
      { key: 'o_phosphoric_acid', label: 'O-Phosphoric Acid', unit: 'Kg' },
      { key: 'caustic_lye', label: 'Caustic Lye', unit: 'T' },
      { key: 'sulphur', label: 'Sulphur', unit: 'T' },
      { key: 'naphthalene_oil', label: 'Naphthalene Oil', unit: 'T' },
    ]
  },
  {
    id: 'techno_eco', label: 'Techno-Eco. Parameters', table: 'techno_eco',
    fields: [
      { key: 'oven_pushing_old_month', label: 'Oven Pushing (Old) - Month', unit: 'Nos.' },
      { key: 'oven_pushing_old_day', label: 'Oven Pushing (Old) - Day', unit: 'Nos.' },
      { key: 'oven_pushing_new_month', label: 'Oven Pushing (New) - Month', unit: 'Nos.' },
      { key: 'oven_pushing_new_day', label: 'Oven Pushing (New) - Day', unit: 'Nos.' },
      { key: 'coal_charged_per_oven_old', label: 'Coal Chgd. Per Oven (Old)', unit: 'T' },
      { key: 'coal_charged_per_oven_new', label: 'Coal Chgd. Per Oven (New)', unit: 'T' },
      { key: 'vm_percent_coal_blend_old', label: '%VM in Coal Blend (Old)', unit: '%' },
      { key: 'vm_percent_coal_blend_new', label: '%VM in Coal Blend (New)', unit: '%' },
      { key: 'raw_gas_ammonia_g_nm3', label: 'Raw Gas Ammonia', unit: 'g/Nm³' },
      { key: 'acid_per_t_sulphate', label: 'Acid / T Sulphate', unit: 'T/T' },
      { key: 'sulphur_per_t_acid', label: 'Sulphur / T Acid', unit: 'T/T' },
    ]
  },
  {
    id: 'product_yield', label: 'Product Yield', table: 'product_yield',
    fields: [
      { key: 'crude_tar_kg_tdcc_old', label: 'Crude Tar (Old)', unit: 'kg/TDCC' },
      { key: 'crude_tar_kg_tdcc_new', label: 'Crude Tar (New)', unit: 'kg/TDCC' },
      { key: 'ehp_pct_ctd', label: 'EHP', unit: '%CTD' },
      { key: 'light_oil_pct_ctd', label: 'Light Oil', unit: '%CTD' },
      { key: 'hpn_pct_nod', label: 'HPN', unit: '%NOD' },
      { key: 'amm_sulphate_kg_tdcc', label: 'Amm. Sulphate', unit: 'kg/TDCC' },
      { key: 'anthracene_oil_pct_ctd', label: 'Anthracene Oil', unit: '%CTD' },
      { key: 'lco_ii_pct_ctd', label: 'LCO-II', unit: '%CTD' },
      { key: 'carbolic_oil_pct_ctd', label: 'Carbolic Oil', unit: '%CTD' },
      { key: 'naphthalene_oil_pct_ctd', label: 'Naphthalene Oil', unit: '%CTD' },
      { key: 'total_tar_product_pct_ctd', label: 'Total Tar Product', unit: '%CTD' },
    ]
  },
  {
    id: 'revenue', label: 'Revenue Generation', table: 'revenue',
    fields: [
      { key: 'nsr_lakh_rs', label: 'NSR', unit: 'Lakh Rs.' },
    ]
  },
  {
    id: 'running_hours', label: 'Running Hours', table: 'running_hours',
    fields: [
      { key: 'exhauster_1', label: 'Exhauster #1', unit: 'Hrs' },
      { key: 'exhauster_2', label: 'Exhauster #2', unit: 'Hrs' },
      { key: 'exhauster_3', label: 'Exhauster #3', unit: 'Hrs' },
      { key: 'exhauster_4', label: 'Exhauster #4', unit: 'Hrs' },
      { key: 'exhauster_5', label: 'Exhauster #5', unit: 'Hrs' },
      { key: 'exhauster_6', label: 'Exhauster #6', unit: 'Hrs' },
      { key: 'booster_1', label: 'Booster #1', unit: 'Hrs' },
      { key: 'booster_2', label: 'Booster #2', unit: 'Hrs' },
      { key: 'booster_3', label: 'Booster #3', unit: 'Hrs' },
      { key: 'booster_4', label: 'Booster #4', unit: 'Hrs' },
      { key: 'booster_5', label: 'Booster #5', unit: 'Hrs' },
      { key: 'tar_distillation', label: 'Tar Distillation', unit: 'Hrs' },
      { key: 'vacuum', label: 'Vacuum', unit: 'Hrs' },
      { key: 'acid_plant', label: 'Acid Plant', unit: 'Hrs' },
      { key: 'ammonium_sulphate', label: 'Ammonium Sulphate', unit: 'Hrs' },
    ]
  },
  {
    id: 'iso_objectives', label: 'ISO Objectives', table: 'iso_objectives',
    fields: [
      { key: 'end_gas_ammonia_g_nm3', label: 'End Gas Ammonia', unit: 'g/Nm³' },
      { key: 'end_gas_naphthalene_g_nm3', label: 'End Gas Naphthalene', unit: 'g/Nm³' },
      { key: 'tar_fog_g_nm3', label: 'Tar Fog', unit: 'g/Nm³' },
    ]
  },
  {
    id: 'ohsas_objectives', label: 'OHSAS Objectives', table: 'ohsas_objectives',
    fields: [
      { key: 'reportable_accidents', label: 'Reportable Accidents', unit: 'Nos.' },
      { key: 'health_checkups_total', label: 'Health Check-ups', unit: 'Nos.' },
      { key: 'earthing_pit_inspection_pct', label: 'Earthing Pit Inspection', unit: '%' },
    ]
  },
  {
    id: 'environment_bod', label: 'Environment BOD Analysis', table: 'environment_bod',
    fields: [
      { key: 'ammonia_in', label: 'Ammonia: In', unit: 'ppm' },
      { key: 'ammonia_out', label: 'Ammonia: Out', unit: 'ppm' },
      { key: 'phenol_in', label: 'Phenol: In', unit: 'ppm' },
      { key: 'phenol_out', label: 'Phenol: Out', unit: 'ppm' },
      { key: 'cyanide_in', label: 'Cyanide: In', unit: 'ppm' },
      { key: 'cyanide_out', label: 'Cyanide: Out', unit: 'ppm' },
      { key: 'ph_in', label: 'pH: In', unit: '' },
      { key: 'ph_out', label: 'pH: Out', unit: '' },
      { key: 'phosphate_out', label: 'Phosphate: Out', unit: 'ppm' },
      { key: 'mlss_at_i', label: 'MLSS: AT-I', unit: 'ppm' },
      { key: 'mlss_at_ii', label: 'MLSS: AT-II', unit: 'ppm' },
    ]
  },
  {
    id: 'product_quality', label: 'Product Quality (Old CCD)', table: 'product_quality',
    fields: [
      { key: 'tar_quality_bi', label: 'Tar Quality: BI', unit: '%' },
      { key: 'tar_quality_qi', label: 'Tar Quality: QI', unit: '%' },
      { key: 'tar_sp_gr', label: 'Tar Sp. Gr.', unit: '' },
      { key: 'acid_concentration', label: 'Acid Concentration', unit: '%' },
    ]
  },
  {
    id: 'lab_analysis_new', label: 'Lab Analysis (New CCD)', table: 'lab_analysis_new',
    fields: [
      { key: 'tar_fog_g_nm3', label: 'Tar Fog', unit: 'g/Nm³' },
      { key: 'naphthalene_g_nm3', label: 'Naphthalene', unit: 'g/Nm³' },
      { key: 'ammonia_g_nm3', label: 'Ammonia', unit: 'g/Nm³' },
    ]
  },
  {
    id: 'product_quality_new', label: 'Product Quality (New CCD)', table: 'product_quality_new',
    fields: [
      { key: 'tar_quality_bi', label: 'Tar Quality: BI', unit: '%' },
      { key: 'tar_quality_qi', label: 'Tar Quality: QI', unit: '%' },
      { key: 'tar_sp_gr', label: 'Tar Sp. Gr.', unit: '' },
      { key: 'acid_concentration', label: 'Acid Concentration', unit: '%' },
    ]
  },
]

function roundVal(val: any): string {
  if (val === null || val === undefined) return ''
  const num = Number(val)
  if (isNaN(num)) return String(val)
  return Number(num.toFixed(3)).toString()
}

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
                      <th className="text-center py-2 px-3 font-medium text-gray-600">Unit</th>
                      <th className="text-right py-2 px-3 font-medium text-gray-600">Value</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentSection?.fields.map(f => (
                      <tr key={f.key} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-2 px-3 text-gray-700">{f.label}</td>
                        <td className="py-2 px-3 text-center text-gray-500 text-xs">{f.unit}</td>
                        <td className="py-2 px-3 text-right font-mono text-gray-900">
                          {data[f.key] !== null && data[f.key] !== undefined ? roundVal(data[f.key]) : <span className="text-gray-300">—</span>}
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
                      <th className="text-center py-2 px-2 font-medium text-gray-600">Unit</th>
                      {MONTHS.map(m => (
                        <th key={m} className="text-center py-2 px-2 font-medium text-gray-600 min-w-[60px]">{m}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {currentSection?.fields.map(f => (
                      <tr key={f.key} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-2 px-2 text-gray-700 sticky left-0 bg-white text-xs whitespace-nowrap">{f.label}</td>
                        <td className="py-2 px-2 text-center text-gray-500">{f.unit}</td>
                        {MONTHS.map((_, mi) => {
                          const monthRow = yearlyData.find(r => r.month_index === mi + 1)
                          const val = monthRow?.[f.key]
                          return (
                            <td key={mi} className="py-2 px-2 text-center font-mono text-gray-900">
                              {val !== null && val !== undefined ? roundVal(val) : <span className="text-gray-300">—</span>}
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
