'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'
import Navbar from '@/components/Navbar'

const supabase = createClient(
  'https://hwafhyotnviacdzsdzsv.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh3YWZoeW90bnZpYWNkenNkenN2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQwODg5NzIsImV4cCI6MjA5OTY2NDk3Mn0.1ibzOXApTZA_P9T6kiq7ayf85KmxNd91XeP6f7SdyGc'
)

const MONTHS = ['Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec','Jan','Feb','Mar']

// Row mapping: Excel row number -> { table, field }
const ROW_MAP: Record<number, { table: string; field: string }> = {
  5: { table: 'production', field: 'crude_tar_app' },
  6: { table: 'production', field: 'crude_tar_act' },
  7: { table: 'production', field: 'ehp_app' },
  8: { table: 'production', field: 'ehp_act' },
  9: { table: 'production', field: 'sulphuric_acid_app' },
  10: { table: 'production', field: 'sulphuric_acid_act' },
  11: { table: 'production', field: 'amm_sulphate_app' },
  12: { table: 'production', field: 'amm_sulphate_act' },
  13: { table: 'production', field: 'light_oil_act' },
  14: { table: 'production', field: 'carbolic_oil_act' },
  15: { table: 'production', field: 'lco_ii_act' },
  16: { table: 'production', field: 'anthracene_oil_act' },
  17: { table: 'production', field: 'naphthalene_oil_act' },
  18: { table: 'production', field: 'coal_tar_oil_total_act' },
  19: { table: 'production', field: 'crude_benzol_app' },
  20: { table: 'production', field: 'crude_benzol_act' },
  21: { table: 'production', field: 'ammonia_liquor_act' },
  22: { table: 'production', field: 'rt_iv_app' },
  23: { table: 'production', field: 'rt_iv_act' },
  24: { table: 'production', field: 'dehy_tar_act' },
  26: { table: 'receipt', field: 'o_phosphoric_acid_kg' },
  27: { table: 'receipt', field: 'caustic_lye' },
  28: { table: 'receipt', field: 'sulphuric_acid' },
  29: { table: 'receipt', field: 'sulphur' },
  31: { table: 'consumption', field: 'crude_tar_distilled' },
  32: { table: 'consumption', field: 'crude_tar_pbcc' },
  33: { table: 'consumption', field: 'crude_tar_bf' },
  34: { table: 'consumption', field: 'crude_tar_dehy_tar' },
  35: { table: 'consumption', field: 'crude_tar_stabilization' },
  36: { table: 'consumption', field: 'crude_tar_handling_loss' },
  37: { table: 'consumption', field: 'crude_tar_total' },
  38: { table: 'consumption', field: 'ehp_pbcc' },
  39: { table: 'consumption', field: 'ehp_bf' },
  40: { table: 'consumption', field: 'ehp_ldbp' },
  41: { table: 'consumption', field: 'ehp_total' },
  42: { table: 'consumption', field: 'sulphuric_acid_sulp' },
  43: { table: 'consumption', field: 'sulphuric_acid_n_ccd' },
  44: { table: 'consumption', field: 'sulphuric_acid_bod' },
  45: { table: 'consumption', field: 'sulphuric_acid_crm' },
  46: { table: 'consumption', field: 'sulphuric_acid_cpp1' },
  47: { table: 'consumption', field: 'sulphuric_acid_comm_stab' },
  48: { table: 'consumption', field: 'sulphuric_acid_total' },
  49: { table: 'consumption', field: 'road_tar_ces' },
  50: { table: 'consumption', field: 'road_tar_ts' },
  51: { table: 'consumption', field: 'road_tar_total' },
  52: { table: 'consumption', field: 'o_phosphoric_acid' },
  53: { table: 'consumption', field: 'caustic_lye' },
  54: { table: 'consumption', field: 'sulphur_consum' },
  55: { table: 'consumption', field: 'sulphur_muck_removal' },
  56: { table: 'consumption', field: 'sulphur_handling_loss' },
  57: { table: 'consumption', field: 'sulphur_pit_comm' },
  58: { table: 'consumption', field: 'sulphur_pit_stab' },
  59: { table: 'consumption', field: 'sulphur_total' },
  60: { table: 'consumption', field: 'light_oil_cr_tar' },
  61: { table: 'consumption', field: 'light_oil_handling_loss' },
  62: { table: 'consumption', field: 'light_oil_total' },
  63: { table: 'consumption', field: 'carbolic_oil_cr_tar' },
  66: { table: 'consumption', field: 'carbolic_oil_handling_loss' },
  67: { table: 'consumption', field: 'carbolic_oil_total' },
  68: { table: 'consumption', field: 'naphthalene_oil_cr_tar' },
  69: { table: 'consumption', field: 'naphthalene_oil_handling_loss' },
  70: { table: 'consumption', field: 'naphthalene_oil_naph_plant' },
  71: { table: 'consumption', field: 'naphthalene_oil_total' },
  72: { table: 'consumption', field: 'wash_oil_tar_plant' },
  73: { table: 'consumption', field: 'wash_oil_handling_loss' },
  74: { table: 'consumption', field: 'wash_oil_naph_plant' },
  75: { table: 'consumption', field: 'wash_oil_cr_tar' },
  76: { table: 'consumption', field: 'wash_oil_total' },
  77: { table: 'consumption', field: 'anthracene_oil_cr_tar' },
  78: { table: 'consumption', field: 'anthracene_oil_handling_loss' },
  79: { table: 'consumption', field: 'anthracene_oil_rt_iv' },
  80: { table: 'consumption', field: 'anthracene_oil_total' },
  82: { table: 'despatch', field: 'crude_tar_app' },
  83: { table: 'despatch', field: 'crude_tar_act' },
  84: { table: 'despatch', field: 'dehydrated_tar_act' },
  85: { table: 'despatch', field: 'lco_ii_act' },
  86: { table: 'despatch', field: 'anthracene_oil_act' },
  87: { table: 'despatch', field: 'amm_sulphate_app' },
  88: { table: 'despatch', field: 'amm_sulphate_act' },
  89: { table: 'despatch', field: 'sulphuric_acid_app' },
  90: { table: 'despatch', field: 'sulphuric_acid_act' },
  91: { table: 'despatch', field: 'other_product_app' },
  92: { table: 'despatch', field: 'other_product_act' },
  94: { table: 'stock', field: 'crude_tar' },
  95: { table: 'stock', field: 'dehydrated_tar' },
  96: { table: 'stock', field: 'ehp' },
  97: { table: 'stock', field: 'rt_iv' },
  98: { table: 'stock', field: 'hpn' },
  99: { table: 'stock', field: 'light_oil' },
  100: { table: 'stock', field: 'carbolic_oil' },
  101: { table: 'stock', field: 'lco_ii' },
  102: { table: 'stock', field: 'anthracene_oil' },
  103: { table: 'stock', field: 'sulphuric_acid' },
  104: { table: 'stock', field: 'amm_sulphate' },
  105: { table: 'stock', field: 'crude_benzol' },
  106: { table: 'stock', field: 'o_phosphoric_acid' },
  107: { table: 'stock', field: 'caustic_lye' },
  108: { table: 'stock', field: 'sulphur' },
  109: { table: 'stock', field: 'naphthalene_oil' },
  111: { table: 'techno_eco', field: 'oven_pushing_old_month' },
  112: { table: 'techno_eco', field: 'oven_pushing_old_day' },
  113: { table: 'techno_eco', field: 'oven_pushing_new_month' },
  114: { table: 'techno_eco', field: 'oven_pushing_new_day' },
  115: { table: 'techno_eco', field: 'coal_charged_per_oven_old' },
  116: { table: 'techno_eco', field: 'coal_charged_per_oven_new' },
  117: { table: 'techno_eco', field: 'vm_percent_coal_blend_old' },
  118: { table: 'techno_eco', field: 'vm_percent_coal_blend_new' },
  119: { table: 'techno_eco', field: 'raw_gas_ammonia_g_nm3' },
  120: { table: 'techno_eco', field: 'acid_per_t_sulphate' },
  121: { table: 'techno_eco', field: 'sulphur_per_t_acid' },
  123: { table: 'product_yield', field: 'crude_tar_kg_tdcc_old' },
  124: { table: 'product_yield', field: 'crude_tar_kg_tdcc_new' },
  125: { table: 'product_yield', field: 'ehp_pct_ctd' },
  126: { table: 'product_yield', field: 'light_oil_pct_ctd' },
  130: { table: 'product_yield', field: 'hpn_pct_nod' },
  131: { table: 'product_yield', field: 'amm_sulphate_kg_tdcc' },
  132: { table: 'product_yield', field: 'anthracene_oil_pct_ctd' },
  133: { table: 'product_yield', field: 'lco_ii_pct_ctd' },
  134: { table: 'product_yield', field: 'carbolic_oil_pct_ctd' },
  135: { table: 'product_yield', field: 'naphthalene_oil_pct_ctd' },
  136: { table: 'product_yield', field: 'total_tar_product_pct_ctd' },
  138: { table: 'revenue', field: 'nsr_lakh_rs' },
  140: { table: 'running_hours', field: 'exhauster_1' },
  141: { table: 'running_hours', field: 'exhauster_2' },
  142: { table: 'running_hours', field: 'exhauster_3' },
  143: { table: 'running_hours', field: 'exhauster_4' },
  144: { table: 'running_hours', field: 'exhauster_5' },
  145: { table: 'running_hours', field: 'exhauster_6' },
  146: { table: 'running_hours', field: 'booster_1' },
  147: { table: 'running_hours', field: 'booster_2' },
  148: { table: 'running_hours', field: 'booster_3' },
  149: { table: 'running_hours', field: 'booster_4' },
  150: { table: 'running_hours', field: 'booster_5' },
  151: { table: 'running_hours', field: 'tar_distillation' },
  152: { table: 'running_hours', field: 'vacuum' },
  153: { table: 'running_hours', field: 'acid_plant' },
  154: { table: 'running_hours', field: 'ammonium_sulphate' },
  157: { table: 'iso_objectives', field: 'end_gas_ammonia_g_nm3' },
  158: { table: 'iso_objectives', field: 'end_gas_naphthalene_g_nm3' },
  159: { table: 'iso_objectives', field: 'tar_fog_g_nm3' },
  162: { table: 'ohsas_objectives', field: 'reportable_accidents' },
  163: { table: 'ohsas_objectives', field: 'health_checkups_total' },
  164: { table: 'ohsas_objectives', field: 'earthing_pit_inspection_pct' },
  166: { table: 'environment_bod', field: 'ammonia_in' },
  167: { table: 'environment_bod', field: 'ammonia_out' },
  168: { table: 'environment_bod', field: 'phenol_in' },
  169: { table: 'environment_bod', field: 'phenol_out' },
  170: { table: 'environment_bod', field: 'cyanide_in' },
  171: { table: 'environment_bod', field: 'cyanide_out' },
  172: { table: 'environment_bod', field: 'ph_in' },
  173: { table: 'environment_bod', field: 'ph_out' },
  174: { table: 'environment_bod', field: 'phosphate_out' },
  175: { table: 'environment_bod', field: 'mlss_at_i' },
  176: { table: 'environment_bod', field: 'mlss_at_ii' },
  178: { table: 'product_quality', field: 'tar_quality_bi' },
  179: { table: 'product_quality', field: 'tar_quality_qi' },
  180: { table: 'product_quality', field: 'tar_sp_gr' },
  181: { table: 'product_quality', field: 'acid_concentration' },
  183: { table: 'lab_analysis_new', field: 'tar_fog_g_nm3' },
  184: { table: 'lab_analysis_new', field: 'naphthalene_g_nm3' },
  185: { table: 'lab_analysis_new', field: 'ammonia_g_nm3' },
  187: { table: 'product_quality_new', field: 'tar_quality_bi' },
  188: { table: 'product_quality_new', field: 'tar_quality_qi' },
  189: { table: 'product_quality_new', field: 'tar_sp_gr' },
  190: { table: 'product_quality_new', field: 'acid_concentration' },
}

const MONTH_COL_START = 2

const ALL_TABLES = ['production','receipt','consumption','despatch','stock','running_hours','techno_eco','product_yield','product_quality','product_quality_new','lab_analysis_new','revenue','iso_objectives','ohsas_objectives','environment_bod']

export default function ImportPage() {
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [fiscalYear, setFiscalYear] = useState('2025-26')
  const [file, setFile] = useState<File | null>(null)
  const [importing, setImporting] = useState(false)
  const [downloading, setDownloading] = useState(false)
  const [progress, setProgress] = useState('')
  const [results, setResults] = useState<string[]>([])
  const [downloadFY, setDownloadFY] = useState('2025-26')

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

  async function handleImport() {
    if (!file) return
    setImporting(true)
    setResults([])
    setProgress('Reading Excel file...')

    const XLSX = (await import('xlsx'))
    const arrayBuffer = await file.arrayBuffer()
    const workbook = XLSX.read(arrayBuffer, { type: 'array' })
    const sheet = workbook.Sheets[workbook.SheetNames[0]]
    const data = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: null }) as any[][]

    setProgress('Parsing data...')

    const tableData: Record<string, Record<number, Record<string, number | null>>> = {}

    for (const [rowNum, mapping] of Object.entries(ROW_MAP)) {
      const excelRow = Number(rowNum) - 1
      const row = data[excelRow]
      if (!row) continue

      for (let monthIdx = 0; monthIdx < 12; monthIdx++) {
        const colIdx = MONTH_COL_START + monthIdx
        const value = row[colIdx]
        if (value === null || value === undefined || value === '') continue

        const numValue = typeof value === 'number' ? value : parseFloat(String(value))
        if (isNaN(numValue)) continue

        const { table, field } = mapping
        if (!tableData[table]) tableData[table] = {}
        if (!tableData[table][monthIdx + 1]) tableData[table][monthIdx + 1] = {}
        tableData[table][monthIdx + 1][field] = numValue
      }
    }

    const logs: string[] = []
    let totalInserted = 0

    for (const [table, months] of Object.entries(tableData)) {
      for (const [monthStr, fields] of Object.entries(months)) {
        const monthIndex = Number(monthStr)
        setProgress(`Saving ${table} - ${MONTHS[monthIndex - 1]}...`)

        const payload: any = { fiscal_year: fiscalYear, month_index: monthIndex, ...fields }

        const { data: existing } = await supabase
          .from(table).select('id')
          .eq('fiscal_year', fiscalYear).eq('month_index', monthIndex).single()

        let error
        if (existing) {
          const res = await supabase.from(table).update(payload).eq('id', existing.id)
          error = res.error
        } else {
          const res = await supabase.from(table).insert(payload)
          error = res.error
        }

        if (error) {
          logs.push(`❌ ${table} ${MONTHS[monthIndex-1]}: ${error.message}`)
        } else {
          totalInserted++
          logs.push(`✓ ${table} ${MONTHS[monthIndex-1]}: ${Object.keys(fields).length} fields`)
        }
      }
    }

    logs.unshift(`✅ Import complete: ${totalInserted} records saved for FY ${fiscalYear}`)
    setResults(logs)
    setProgress('')
    setImporting(false)
  }

  async function handleDownloadExcel() {
    setDownloading(true)
    setProgress('Fetching data...')

    const XLSX = (await import('xlsx'))
    const allData: Record<string, any[]> = {}

    for (const table of ALL_TABLES) {
      const { data } = await supabase.from(table).select('*')
        .eq('fiscal_year', downloadFY).order('month_index')
      allData[table] = data || []
    }

    setProgress('Building Excel...')

    // Build rows matching the original report format
    const rows: any[][] = []
    rows.push(['COAL CHEMICALS DEPARTMENT'])
    rows.push([`MONTHLY REPORT ${downloadFY}`])
    rows.push(['PARAMETER', 'TYPE', ...MONTHS])

    // Helper to get value for a table/field/month
    const getVal = (table: string, field: string, month: number) => {
      const row = allData[table]?.find((r: any) => r.month_index === month)
      return row?.[field] ?? ''
    }

    // Production
    rows.push(['PRODUCTION', '', ...Array(12).fill('')])
    rows.push(['CRUDE TAR', 'APP', ...MONTHS.map((_, i) => getVal('production', 'crude_tar_app', i+1))])
    rows.push(['', 'ACT', ...MONTHS.map((_, i) => getVal('production', 'crude_tar_act', i+1))])
    rows.push(['EHP', 'APP', ...MONTHS.map((_, i) => getVal('production', 'ehp_app', i+1))])
    rows.push(['', 'ACT', ...MONTHS.map((_, i) => getVal('production', 'ehp_act', i+1))])
    rows.push(['SULPHURIC ACID', 'APP', ...MONTHS.map((_, i) => getVal('production', 'sulphuric_acid_app', i+1))])
    rows.push(['', 'ACT', ...MONTHS.map((_, i) => getVal('production', 'sulphuric_acid_act', i+1))])
    rows.push(['AMM. SULPHATE', 'APP', ...MONTHS.map((_, i) => getVal('production', 'amm_sulphate_app', i+1))])
    rows.push(['', 'ACT', ...MONTHS.map((_, i) => getVal('production', 'amm_sulphate_act', i+1))])
    rows.push(['LIGHT OIL', 'ACT', ...MONTHS.map((_, i) => getVal('production', 'light_oil_act', i+1))])
    rows.push(['CARBOLIC OIL', 'ACT', ...MONTHS.map((_, i) => getVal('production', 'carbolic_oil_act', i+1))])
    rows.push(['LCO-II', 'ACT', ...MONTHS.map((_, i) => getVal('production', 'lco_ii_act', i+1))])
    rows.push(['ANTHRACENE OIL', 'ACT', ...MONTHS.map((_, i) => getVal('production', 'anthracene_oil_act', i+1))])
    rows.push(['NAPHTHALENE OIL', 'ACT', ...MONTHS.map((_, i) => getVal('production', 'naphthalene_oil_act', i+1))])
    rows.push(['COAL TAR OIL (TOTAL)', 'ACT', ...MONTHS.map((_, i) => getVal('production', 'coal_tar_oil_total_act', i+1))])
    rows.push(['CRUDE BENZOL', 'APP', ...MONTHS.map((_, i) => getVal('production', 'crude_benzol_app', i+1))])
    rows.push(['', 'ACT', ...MONTHS.map((_, i) => getVal('production', 'crude_benzol_act', i+1))])
    rows.push(['AMMONIA LIQUOR', 'ACT', ...MONTHS.map((_, i) => getVal('production', 'ammonia_liquor_act', i+1))])
    rows.push(['RT-IV', 'APP', ...MONTHS.map((_, i) => getVal('production', 'rt_iv_app', i+1))])
    rows.push(['', 'ACT', ...MONTHS.map((_, i) => getVal('production', 'rt_iv_act', i+1))])
    rows.push(['DEHY. TAR', 'ACT', ...MONTHS.map((_, i) => getVal('production', 'dehy_tar_act', i+1))])

    // Receipt
    rows.push(['RECEIPT', '', ...Array(12).fill('')])
    rows.push(['O-PHOSPHORIC ACID (Kg)', '', ...MONTHS.map((_, i) => getVal('receipt', 'o_phosphoric_acid_kg', i+1))])
    rows.push(['CAUSTIC LYE', '', ...MONTHS.map((_, i) => getVal('receipt', 'caustic_lye', i+1))])
    rows.push(['SULPHURIC ACID', '', ...MONTHS.map((_, i) => getVal('receipt', 'sulphuric_acid', i+1))])
    rows.push(['SULPHUR', '', ...MONTHS.map((_, i) => getVal('receipt', 'sulphur', i+1))])

    // Stock
    rows.push(['STOCK', '', ...Array(12).fill('')])
    rows.push(['CRUDE TAR', '', ...MONTHS.map((_, i) => getVal('stock', 'crude_tar', i+1))])
    rows.push(['DEHYDRATED TAR', '', ...MONTHS.map((_, i) => getVal('stock', 'dehydrated_tar', i+1))])
    rows.push(['EHP', '', ...MONTHS.map((_, i) => getVal('stock', 'ehp', i+1))])
    rows.push(['RT-IV', '', ...MONTHS.map((_, i) => getVal('stock', 'rt_iv', i+1))])
    rows.push(['SULPHURIC ACID', '', ...MONTHS.map((_, i) => getVal('stock', 'sulphuric_acid', i+1))])
    rows.push(['AMM. SULPHATE', '', ...MONTHS.map((_, i) => getVal('stock', 'amm_sulphate', i+1))])

    // Techno-Eco
    rows.push(['TECHNO-ECO. PARAMETERS', '', ...Array(12).fill('')])
    rows.push(['OVEN PUSHING (OLD) MONTH', '', ...MONTHS.map((_, i) => getVal('techno_eco', 'oven_pushing_old_month', i+1))])
    rows.push(['OVEN PUSHING (OLD) DAY', '', ...MONTHS.map((_, i) => getVal('techno_eco', 'oven_pushing_old_day', i+1))])
    rows.push(['OVEN PUSHING (NEW) MONTH', '', ...MONTHS.map((_, i) => getVal('techno_eco', 'oven_pushing_new_month', i+1))])
    rows.push(['OVEN PUSHING (NEW) DAY', '', ...MONTHS.map((_, i) => getVal('techno_eco', 'oven_pushing_new_day', i+1))])
    rows.push(['RAW GAS AMMONIA [g/Nm3]', '', ...MONTHS.map((_, i) => getVal('techno_eco', 'raw_gas_ammonia_g_nm3', i+1))])

    // ISO Objectives
    rows.push(['ISO OBJECTIVES', '', ...Array(12).fill('')])
    rows.push(['END GAS AMMONIA [G/NM3]', '', ...MONTHS.map((_, i) => getVal('iso_objectives', 'end_gas_ammonia_g_nm3', i+1))])
    rows.push(['END GAS NAPHTHALENE [G/NM3]', '', ...MONTHS.map((_, i) => getVal('iso_objectives', 'end_gas_naphthalene_g_nm3', i+1))])
    rows.push(['TAR FOG [G/NM3]', '', ...MONTHS.map((_, i) => getVal('iso_objectives', 'tar_fog_g_nm3', i+1))])

    // Lab Analysis New
    rows.push(['LAB ANALYSIS, NEW CCD', '', ...Array(12).fill('')])
    rows.push(['TAR FOG [G/NM3]', '', ...MONTHS.map((_, i) => getVal('lab_analysis_new', 'tar_fog_g_nm3', i+1))])
    rows.push(['NAPHTHALENE [G/NM3]', '', ...MONTHS.map((_, i) => getVal('lab_analysis_new', 'naphthalene_g_nm3', i+1))])
    rows.push(['AMMONIA [G/NM3]', '', ...MONTHS.map((_, i) => getVal('lab_analysis_new', 'ammonia_g_nm3', i+1))])

    // Running Hours
    rows.push(['RUNNING HOURS', '', ...Array(12).fill('')])
    rows.push(['EXHAUSTER #1', '', ...MONTHS.map((_, i) => getVal('running_hours', 'exhauster_1', i+1))])
    rows.push(['EXHAUSTER #2', '', ...MONTHS.map((_, i) => getVal('running_hours', 'exhauster_2', i+1))])
    rows.push(['EXHAUSTER #3', '', ...MONTHS.map((_, i) => getVal('running_hours', 'exhauster_3', i+1))])
    rows.push(['EXHAUSTER #4', '', ...MONTHS.map((_, i) => getVal('running_hours', 'exhauster_4', i+1))])
    rows.push(['EXHAUSTER #5', '', ...MONTHS.map((_, i) => getVal('running_hours', 'exhauster_5', i+1))])
    rows.push(['EXHAUSTER #6', '', ...MONTHS.map((_, i) => getVal('running_hours', 'exhauster_6', i+1))])

    const ws = XLSX.utils.aoa_to_sheet(rows)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Monthly Report')
    XLSX.writeFile(wb, `CCD_Monthly_Report_${downloadFY}.xlsx`)

    setProgress('')
    setDownloading(false)
  }

  async function handleDownloadPDF() {
    setDownloading(true)
    setProgress('Generating PDF...')

    const jsPDF = (await import('jspdf')).default
    await import('jspdf-autotable')

    const allData: Record<string, any[]> = {}
    for (const table of ALL_TABLES) {
      const { data } = await supabase.from(table).select('*')
        .eq('fiscal_year', downloadFY).order('month_index')
      allData[table] = data || []
    }

    const doc = new jsPDF({ orientation: 'landscape' })
    doc.setFontSize(16)
    doc.text('COAL CHEMICALS DEPARTMENT', 148, 15, { align: 'center' })
    doc.setFontSize(12)
    doc.text(`MONTHLY REPORT ${downloadFY}`, 148, 23, { align: 'center' })

    const getVal = (table: string, field: string, month: number) => {
      const row = allData[table]?.find((r: any) => r.month_index === month)
      return row?.[field] ?? '-'
    }

    const headers = [['Parameter', 'Type', ...MONTHS]]
    const body = [
      ['CRUDE TAR', 'APP', ...MONTHS.map((_, i) => getVal('production', 'crude_tar_app', i+1))],
      ['', 'ACT', ...MONTHS.map((_, i) => getVal('production', 'crude_tar_act', i+1))],
      ['EHP', 'APP', ...MONTHS.map((_, i) => getVal('production', 'ehp_app', i+1))],
      ['', 'ACT', ...MONTHS.map((_, i) => getVal('production', 'ehp_act', i+1))],
      ['SULPHURIC ACID', 'APP', ...MONTHS.map((_, i) => getVal('production', 'sulphuric_acid_app', i+1))],
      ['', 'ACT', ...MONTHS.map((_, i) => getVal('production', 'sulphuric_acid_act', i+1))],
      ['AMM. SULPHATE', 'APP', ...MONTHS.map((_, i) => getVal('production', 'amm_sulphate_app', i+1))],
      ['', 'ACT', ...MONTHS.map((_, i) => getVal('production', 'amm_sulphate_act', i+1))],
      ['CRUDE BENZOL', 'ACT', ...MONTHS.map((_, i) => getVal('production', 'crude_benzol_act', i+1))],
      ['RT-IV', 'ACT', ...MONTHS.map((_, i) => getVal('production', 'rt_iv_act', i+1))],
    ]

    ;(doc as any).autoTable({
      head: headers,
      body: body,
      startY: 30,
      styles: { fontSize: 7 },
      headStyles: { fillColor: [59, 130, 246] },
      theme: 'grid',
    })

    doc.save(`CCD_Monthly_Report_${downloadFY}.pdf`)
    setProgress('')
    setDownloading(false)
  }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-pulse text-gray-500">Loading...</div>
    </div>
  )

  if (profile?.role !== 'admin') return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="card text-center">
        <p className="text-red-600 font-medium">Access Denied</p>
        <p className="text-gray-500 mt-2">Admin access required</p>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen">
      <Navbar profile={profile} activeTab="import" />
      <main className="p-6 max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Import & Download Reports</h1>

        {/* Upload Section */}
        <div className="card mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-2">Upload Excel (Import Past Data)</h2>
          <p className="text-sm text-gray-500 mb-4">
            Upload the standard CCD Monthly Report Excel. All 12 months will be read and saved for the selected FY.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
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
            <div className="md:col-span-2">
              <label className="block text-xs font-medium text-gray-600 mb-1">Excel File (.xlsx)</label>
              <input type="file" accept=".xlsx,.xls" className="input-field" onChange={e => setFile(e.target.files?.[0] || null)} />
            </div>
          </div>

          <button onClick={handleImport} className="btn-primary" disabled={!file || importing}>
            {importing ? 'Importing...' : 'Import Data'}
          </button>

          {progress && (
            <div className="flex items-center gap-2 mt-3 text-sm text-blue-600">
              <div className="animate-spin w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full"></div>
              {progress}
            </div>
          )}
        </div>

        {/* Download Section */}
        <div className="card mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-2">Download Report</h2>
          <p className="text-sm text-gray-500 mb-4">
            Download the full monthly report for any fiscal year as Excel or PDF.
          </p>

          <div className="flex flex-wrap items-end gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Fiscal Year</label>
              <select className="input-field" value={downloadFY} onChange={e => setDownloadFY(e.target.value)}>
                <option value="2022-23">2022-23</option>
                <option value="2023-24">2023-24</option>
                <option value="2024-25">2024-25</option>
                <option value="2025-26">2025-26</option>
                <option value="2026-27">2026-27</option>
              </select>
            </div>
            <button onClick={handleDownloadExcel} className="btn-primary" disabled={downloading}>
              Download Excel
            </button>
            <button onClick={handleDownloadPDF} className="btn-secondary" disabled={downloading}>
              Download PDF
            </button>
          </div>
        </div>

        {/* Results */}
        {results.length > 0 && (
          <div className="card">
            <h2 className="text-lg font-semibold text-gray-800 mb-3">Import Results</h2>
            <div className="bg-gray-900 rounded-xl p-4 max-h-96 overflow-y-auto">
              {results.map((line, i) => (
                <div key={i} className={`text-sm font-mono ${line.startsWith('❌') ? 'text-red-400' : line.startsWith('✅') ? 'text-green-400 font-bold' : 'text-gray-300'}`}>
                  {line}
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
