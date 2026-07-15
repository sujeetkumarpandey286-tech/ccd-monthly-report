'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://hwafhyotnviacdzsdzsv.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh3YWZoeW90bnZpYWNkenNkenN2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQwODg5NzIsImV4cCI6MjA5OTY2NDk3Mn0.1ibzOXApTZA_P9T6kiq7ayf85KmxNd91XeP6f7SdyGc'
)

const MONTHS = ['Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec','Jan','Feb','Mar']

const sectionFields: Record<string, { key: string; label: string; unit?: string }[]> = {
  production: [
    { key: 'crude_tar_app', label: 'Crude Tar (APP)', unit: 'MT' },
    { key: 'crude_tar_act', label: 'Crude Tar (ACT)', unit: 'MT' },
    { key: 'ehp_app', label: 'EHP (APP)', unit: 'MT' },
    { key: 'ehp_act', label: 'EHP (ACT)', unit: 'MT' },
    { key: 'sulphuric_acid_app', label: 'Sulphuric Acid (APP)', unit: 'MT' },
    { key: 'sulphuric_acid_act', label: 'Sulphuric Acid (ACT)', unit: 'MT' },
    { key: 'amm_sulphate_app', label: 'Amm. Sulphate (APP)', unit: 'MT' },
    { key: 'amm_sulphate_act', label: 'Amm. Sulphate (ACT)', unit: 'MT' },
    { key: 'crude_benzol_app', label: 'Crude Benzol (APP)', unit: 'MT' },
    { key: 'crude_benzol_act', label: 'Crude Benzol (ACT)', unit: 'MT' },
    { key: 'light_oil_act', label: 'Light Oil (ACT)', unit: 'MT' },
    { key: 'carbolic_oil_act', label: 'Carbolic Oil (ACT)', unit: 'MT' },
    { key: 'anthracene_oil_act', label: 'Anthracene Oil (ACT)', unit: 'MT' },
    { key: 'naphthalene_oil_act', label: 'Naphthalene Oil (ACT)', unit: 'MT' },
    { key: 'coal_tar_oil_total_act', label: 'Coal Tar Oil Total (ACT)', unit: 'MT' },
    { key: 'ammonia_liquor_act', label: 'Ammonia Liquor (ACT)', unit: 'MT' },
    { key: 'rt_iv_app', label: 'RT-IV (APP)', unit: 'MT' },
    { key: 'rt_iv_act', label: 'RT-IV (ACT)', unit: 'MT' },
    { key: 'dehy_tar_act', label: 'Dehydrated Tar (ACT)', unit: 'MT' },
    { key: 'lco_ii_act', label: 'LCO-II (ACT)', unit: 'MT' },
  ],
  receipt: [
    { key: 'o_phosphoric_acid_kg', label: 'O-Phosphoric Acid', unit: 'Kg' },
    { key: 'caustic_lye', label: 'Caustic Lye', unit: 'MT' },
    { key: 'sulphuric_acid', label: 'Sulphuric Acid', unit: 'MT' },
    { key: 'sulphur', label: 'Sulphur', unit: 'MT' },
  ],
  stock: [
    { key: 'crude_tar', label: 'Crude Tar', unit: 'MT' },
    { key: 'dehydrated_tar', label: 'Dehydrated Tar', unit: 'MT' },
    { key: 'ehp', label: 'EHP', unit: 'MT' },
    { key: 'rt_iv', label: 'RT-IV', unit: 'MT' },
    { key: 'hpn', label: 'HPN', unit: 'MT' },
    { key: 'light_oil', label: 'Light Oil', unit: 'MT' },
    { key: 'carbolic_oil', label: 'Carbolic Oil', unit: 'MT' },
    { key: 'lco_ii', label: 'LCO-II', unit: 'MT' },
    { key: 'anthracene_oil', label: 'Anthracene Oil', unit: 'MT' },
    { key: 'sulphuric_acid', label: 'Sulphuric Acid', unit: 'MT' },
    { key: 'amm_sulphate', label: 'Amm. Sulphate', unit: 'MT' },
    { key: 'crude_benzol', label: 'Crude Benzol', unit: 'MT' },
    { key: 'o_phosphoric_acid', label: 'O-Phosphoric Acid', unit: 'MT' },
    { key: 'caustic_lye', label: 'Caustic Lye', unit: 'MT' },
    { key: 'sulphur', label: 'Sulphur', unit: 'MT' },
    { key: 'naphthalene_oil', label: 'Naphthalene Oil', unit: 'MT' },
  ],
  techno_eco: [
    { key: 'oven_pushing_old_month', label: 'Oven Pushing Old (Month)', unit: 'Nos' },
    { key: 'oven_pushing_old_day', label: 'Oven Pushing Old (Day)', unit: 'Nos' },
    { key: 'oven_pushing_new_month', label: 'Oven Pushing New (Month)', unit: 'Nos' },
    { key: 'oven_pushing_new_day', label: 'Oven Pushing New (Day)', unit: 'Nos' },
    { key: 'coal_charged_per_oven_old', label: 'Coal Charged/Oven Old', unit: 'T' },
    { key: 'coal_charged_per_oven_new', label: 'Coal Charged/Oven New', unit: 'T' },
    { key: 'vm_percent_coal_blend_old', label: 'VM% Coal Blend Old', unit: '%' },
    { key: 'vm_percent_coal_blend_new', label: 'VM% Coal Blend New', unit: '%' },
    { key: 'raw_gas_ammonia_g_nm3', label: 'Raw Gas Ammonia', unit: 'g/Nm³' },
    { key: 'acid_per_t_sulphate', label: 'Acid per T Sulphate', unit: 'T' },
    { key: 'sulphur_per_t_acid', label: 'Sulphur per T Acid', unit: 'T' },
  ],
  product_yield: [
    { key: 'crude_tar_kg_tdcc_old', label: 'Crude Tar Old', unit: 'Kg/TDCC' },
    { key: 'crude_tar_kg_tdcc_new', label: 'Crude Tar New', unit: 'Kg/TDCC' },
    { key: 'ehp_pct_ctd', label: 'EHP', unit: '% CTD' },
    { key: 'light_oil_pct_ctd', label: 'Light Oil', unit: '% CTD' },
    { key: 'hpn_pct_nod', label: 'HPN', unit: '% NOD' },
    { key: 'amm_sulphate_kg_tdcc', label: 'Amm. Sulphate', unit: 'Kg/TDCC' },
    { key: 'anthracene_oil_pct_ctd', label: 'Anthracene Oil', unit: '% CTD' },
    { key: 'lco_ii_pct_ctd', label: 'LCO-II', unit: '% CTD' },
    { key: 'carbolic_oil_pct_ctd', label: 'Carbolic Oil', unit: '% CTD' },
    { key: 'naphthalene_oil_pct_ctd', label: 'Naphthalene Oil', unit: '% CTD' },
    { key: 'total_tar_product_pct_ctd', label: 'Total Tar Product', unit: '% CTD' },
  ],
  product_quality: [
    { key: 'tar_quality_bi', label: 'Tar Quality BI', unit: '' },
    { key: 'tar_quality_qi', label: 'Tar Quality QI', unit: '%' },
    { key: 'tar_sp_gr', label: 'Tar Sp. Gr.', unit: '' },
    { key: 'acid_concentration', label: 'Acid Concentration', unit: '%' },
  ],
  product_quality_new: [
    { key: 'tar_quality_bi', label: 'Tar Quality BI', unit: '' },
    { key: 'tar_quality_qi', label: 'Tar Quality QI', unit: '%' },
    { key: 'tar_sp_gr', label: 'Tar Sp. Gr.', unit: '' },
    { key: 'acid_concentration', label: 'Acid Concentration', unit: '%' },
  ],
  lab_analysis_new: [
    { key: 'tar_fog_g_nm3', label: 'Tar Fog', unit: 'g/Nm³' },
    { key: 'naphthalene_g_nm3', label: 'Naphthalene', unit: 'g/Nm³' },
    { key: 'ammonia_g_nm3', label: 'Ammonia', unit: 'g/Nm³' },
  ],
  iso_objectives: [
    { key: 'end_gas_ammonia_g_nm3', label: 'End Gas Ammonia', unit: 'g/Nm³' },
    { key: 'end_gas_naphthalene_g_nm3', label: 'End Gas Naphthalene', unit: 'g/Nm³' },
    { key: 'tar_fog_g_nm3', label: 'Tar Fog', unit: 'g/Nm³' },
  ],
  ohsas_objectives: [
    { key: 'reportable_accidents', label: 'Reportable Accidents', unit: 'Nos' },
    { key: 'health_checkups_total', label: 'Health Checkups', unit: 'Nos' },
    { key: 'earthing_pit_inspection_pct', label: 'Earthing Pit Inspection', unit: '%' },
  ],
  environment_bod: [
    { key: 'ammonia_in', label: 'Ammonia In', unit: 'ppm' },
    { key: 'ammonia_out', label: 'Ammonia Out', unit: 'ppm' },
    { key: 'phenol_in', label: 'Phenol In', unit: 'ppm' },
    { key: 'phenol_out', label: 'Phenol Out', unit: 'ppm' },
    { key: 'cyanide_in', label: 'Cyanide In', unit: 'ppm' },
    { key: 'cyanide_out', label: 'Cyanide Out', unit: 'ppm' },
    { key: 'ph_in', label: 'pH In', unit: '' },
    { key: 'ph_out', label: 'pH Out', unit: '' },
    { key: 'phosphate_out', label: 'Phosphate Out', unit: 'ppm' },
    { key: 'mlss_at_i', label: 'MLSS at I', unit: 'ppm' },
    { key: 'mlss_at_ii', label: 'MLSS at II', unit: 'ppm' },
  ],
  revenue: [
    { key: 'nsr_lakh_rs', label: 'NSR', unit: 'Lakh Rs' },
  ],
  running_hours: [
    { key: 'exhauster_1', label: 'Exhauster 1', unit: 'Hrs' },
    { key: 'exhauster_2', label: 'Exhauster 2', unit: 'Hrs' },
    { key: 'exhauster_3', label: 'Exhauster 3', unit: 'Hrs' },
    { key: 'exhauster_4', label: 'Exhauster 4', unit: 'Hrs' },
    { key: 'exhauster_5', label: 'Exhauster 5', unit: 'Hrs' },
    { key: 'exhauster_6', label: 'Exhauster 6', unit: 'Hrs' },
    { key: 'booster_1', label: 'Booster 1', unit: 'Hrs' },
    { key: 'booster_2', label: 'Booster 2', unit: 'Hrs' },
    { key: 'booster_3', label: 'Booster 3', unit: 'Hrs' },
    { key: 'booster_4', label: 'Booster 4', unit: 'Hrs' },
    { key: 'booster_5', label: 'Booster 5', unit: 'Hrs' },
    { key: 'tar_distillation', label: 'Tar Distillation', unit: 'Hrs' },
    { key: 'vacuum', label: 'Vacuum', unit: 'Hrs' },
    { key: 'acid_plant', label: 'Acid Plant', unit: 'Hrs' },
    { key: 'ammonium_sulphate', label: 'Ammonium Sulphate', unit: 'Hrs' },
  ],
  despatch: [
    { key: 'crude_tar_app', label: 'Crude Tar (APP)', unit: 'MT' },
    { key: 'crude_tar_act', label: 'Crude Tar (ACT)', unit: 'MT' },
    { key: 'dehydrated_tar_act', label: 'Dehydrated Tar (ACT)', unit: 'MT' },
    { key: 'lco_ii_act', label: 'LCO-II (ACT)', unit: 'MT' },
    { key: 'anthracene_oil_act', label: 'Anthracene Oil (ACT)', unit: 'MT' },
    { key: 'amm_sulphate_app', label: 'Amm. Sulphate (APP)', unit: 'MT' },
    { key: 'amm_sulphate_act', label: 'Amm. Sulphate (ACT)', unit: 'MT' },
    { key: 'sulphuric_acid_app', label: 'Sulphuric Acid (APP)', unit: 'MT' },
    { key: 'sulphuric_acid_act', label: 'Sulphuric Acid (ACT)', unit: 'MT' },
  ],
  consumption: [
    { key: 'crude_tar_distilled', label: 'Crude Tar Distilled', unit: 'MT' },
    { key: 'crude_tar_total', label: 'Crude Tar Total', unit: 'MT' },
    { key: 'ehp_total', label: 'EHP Total', unit: 'MT' },
    { key: 'sulphuric_acid_total', label: 'Sulphuric Acid Total', unit: 'MT' },
    { key: 'road_tar_total', label: 'Road Tar Total', unit: 'MT' },
    { key: 'o_phosphoric_acid', label: 'O-Phosphoric Acid', unit: 'MT' },
    { key: 'caustic_lye', label: 'Caustic Lye', unit: 'MT' },
    { key: 'sulphur_total', label: 'Sulphur Total', unit: 'MT' },
    { key: 'light_oil_total', label: 'Light Oil Total', unit: 'MT' },
    { key: 'carbolic_oil_total', label: 'Carbolic Oil Total', unit: 'MT' },
    { key: 'naphthalene_oil_total', label: 'Naphthalene Oil Total', unit: 'MT' },
    { key: 'wash_oil_total', label: 'Wash Oil Total', unit: 'MT' },
    { key: 'anthracene_oil_total', label: 'Anthracene Oil Total', unit: 'MT' },
  ],
}

const editableBySection: Record<string, string[]> = {
  production: ['production', 'admin'],
  receipt: ['production', 'admin'],
  consumption: ['production', 'admin'],
  despatch: ['production', 'admin'],
  stock: ['production', 'admin'],
  running_hours: ['production', 'admin'],
  techno_eco: ['quality', 'admin'],
  product_yield: ['quality', 'admin'],
  product_quality: ['quality', 'admin'],
  product_quality_new: ['quality', 'admin'],
  lab_analysis_new: ['quality', 'admin'],
  revenue: ['admin'],
  iso_objectives: ['environment', 'admin'],
  ohsas_objectives: ['safety', 'admin'],
  environment_bod: ['environment', 'admin'],
}

interface DataEntryTableProps {
  section: string
  profile: any
}

export default function DataEntryTable({ section, profile }: DataEntryTableProps) {
  const [selectedMonth, setSelectedMonth] = useState(1)
  const [data, setData] = useState<Record<string, any>>({})
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  const fiscalYear = '2025-26'
  const canEdit = editableBySection[section]?.includes(profile?.role)
  const fields = sectionFields[section] || []

  useEffect(() => {
    loadData()
  }, [section, selectedMonth])

  async function loadData() {
    const { data: rows } = await supabase
      .from(section)
      .select('*')
      .eq('fiscal_year', fiscalYear)
      .eq('month_index', selectedMonth)
      .single()
    setData(rows || {})
  }

  async function handleSave() {
    setSaving(true)
    setMessage('')
    const payload: any = { fiscal_year: fiscalYear, month_index: selectedMonth, updated_by: profile.id }
    fields.forEach(f => { payload[f.key] = data[f.key] || null })

    const { data: existing } = await supabase
      .from(section)
      .select('id')
      .eq('fiscal_year', fiscalYear)
      .eq('month_index', selectedMonth)
      .single()

    let error
    if (existing) {
      const res = await supabase.from(section).update(payload).eq('id', existing.id)
      error = res.error
    } else {
      const res = await supabase.from(section).insert(payload)
      error = res.error
    }

    if (error) setMessage('Error: ' + error.message)
    else setMessage('Saved successfully!')
    setSaving(false)
  }

  return (
    <div>
      {/* Month selector */}
      <div className="flex flex-wrap gap-2 mb-6">
        {MONTHS.map((m, i) => (
          <button
            key={m}
            onClick={() => setSelectedMonth(i + 1)}
            className={`month-pill ${selectedMonth === i + 1 ? 'month-pill-active' : 'month-pill-inactive'}`}
          >
            {m}
          </button>
        ))}
      </div>

      {/* Data table */}
      <div className="card">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-800">
            {section.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())} — {MONTHS[selectedMonth - 1]} {fiscalYear}
          </h2>
          {!canEdit && (
            <span className="text-xs bg-gray-100 text-gray-500 px-3 py-1 rounded-full">View Only</span>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="table-header">
                <th className="px-4 py-3 text-left">Parameter</th>
                <th className="px-4 py-3 text-left">Unit</th>
                <th className="px-4 py-3 text-left">Value</th>
              </tr>
            </thead>
            <tbody>
              {fields.map((f) => (
                <tr key={f.key} className="border-b border-gray-100 hover:bg-blue-50/30">
                  <td className="px-4 py-3 font-medium text-gray-700">{f.label}</td>
                  <td className="px-4 py-3 text-gray-500">{f.unit}</td>
                  <td className="px-4 py-3">
                    {canEdit ? (
                      <input
                        type="number"
                        step="any"
                        className="input-field max-w-[150px]"
                        value={data[f.key] ?? ''}
                        onChange={(e) => setData({ ...data, [f.key]: e.target.value ? Number(e.target.value) : null })}
                      />
                    ) : (
                      <span className="text-gray-600">{data[f.key] ?? '-'}</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {canEdit && (
          <div className="mt-4 flex items-center gap-4">
            <button onClick={handleSave} className="btn-primary" disabled={saving}>
              {saving ? 'Saving...' : 'Save Data'}
            </button>
            {message && (
              <span className={`text-sm ${message.includes('Error') ? 'text-red-600' : 'text-green-600'}`}>
                {message}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
