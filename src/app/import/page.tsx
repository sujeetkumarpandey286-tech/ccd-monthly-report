'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'
import Navbar from '@/components/Navbar'

const supabase = createClient(
  'https://hwafhyotnviacdzsdzsv.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh3YWZoeW90bnZpYWNkenNkenN2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQwODg5NzIsImV4cCI6MjA5OTY2NDk3Mn0.1ibzOXApTZA_P9T6kiq7ayf85KmxNd91XeP6f7SdyGc'
)

const MONTHS = ['Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec','Jan','Feb','Mar']

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

// Full report structure for download - ALL parameters
const REPORT_ROWS: { label: string; subLabel: string; table: string; field: string; unit: string }[] = [
  // PRODUCTION
  { label: 'PRODUCTION', subLabel: '', table: '', field: '', unit: '' },
  { label: 'CRUDE TAR', subLabel: 'APP', table: 'production', field: 'crude_tar_app', unit: 'T' },
  { label: '', subLabel: 'ACT', table: 'production', field: 'crude_tar_act', unit: 'T' },
  { label: 'EHP', subLabel: 'APP', table: 'production', field: 'ehp_app', unit: 'T' },
  { label: '', subLabel: 'ACT', table: 'production', field: 'ehp_act', unit: 'T' },
  { label: 'SULPHURIC ACID', subLabel: 'APP', table: 'production', field: 'sulphuric_acid_app', unit: 'T' },
  { label: '', subLabel: 'ACT', table: 'production', field: 'sulphuric_acid_act', unit: 'T' },
  { label: 'AMM. SULPHATE', subLabel: 'APP', table: 'production', field: 'amm_sulphate_app', unit: 'T' },
  { label: '', subLabel: 'ACT', table: 'production', field: 'amm_sulphate_act', unit: 'T' },
  { label: 'LIGHT OIL', subLabel: 'ACT', table: 'production', field: 'light_oil_act', unit: 'T' },
  { label: 'CARBOLIC OIL', subLabel: 'ACT', table: 'production', field: 'carbolic_oil_act', unit: 'T' },
  { label: 'LCO-II', subLabel: 'ACT', table: 'production', field: 'lco_ii_act', unit: 'T' },
  { label: 'ANTHRACENE OIL', subLabel: 'ACT', table: 'production', field: 'anthracene_oil_act', unit: 'T' },
  { label: 'NAPHTHALENE OIL', subLabel: 'ACT', table: 'production', field: 'naphthalene_oil_act', unit: 'T' },
  { label: 'COAL TAR OIL (TOTAL)', subLabel: 'ACT', table: 'production', field: 'coal_tar_oil_total_act', unit: 'T' },
  { label: 'CRUDE BENZOL', subLabel: 'APP', table: 'production', field: 'crude_benzol_app', unit: 'T' },
  { label: '', subLabel: 'ACT', table: 'production', field: 'crude_benzol_act', unit: 'T' },
  { label: 'AMMONIA LIQUOR', subLabel: 'ACT', table: 'production', field: 'ammonia_liquor_act', unit: 'T' },
  { label: 'RT-IV', subLabel: 'APP', table: 'production', field: 'rt_iv_app', unit: 'T' },
  { label: '', subLabel: 'ACT', table: 'production', field: 'rt_iv_act', unit: 'T' },
  { label: 'DEHY. TAR', subLabel: 'ACT', table: 'production', field: 'dehy_tar_act', unit: 'T' },
  // RECEIPT
  { label: 'RECEIPT', subLabel: '', table: '', field: '', unit: '' },
  { label: 'O-PHOSPHORIC ACID', subLabel: '', table: 'receipt', field: 'o_phosphoric_acid_kg', unit: 'Kg' },
  { label: 'CAUSTIC LYE', subLabel: '', table: 'receipt', field: 'caustic_lye', unit: 'T' },
  { label: 'SULPHURIC ACID', subLabel: '', table: 'receipt', field: 'sulphuric_acid', unit: 'T' },
  { label: 'SULPHUR', subLabel: '', table: 'receipt', field: 'sulphur', unit: 'T' },
  // CONSUMPTION
  { label: 'CONSUMPTION/TRANSFER', subLabel: '', table: '', field: '', unit: '' },
  { label: 'CRUDE TAR', subLabel: 'DISTILLED', table: 'consumption', field: 'crude_tar_distilled', unit: 'T' },
  { label: '', subLabel: 'PBCC', table: 'consumption', field: 'crude_tar_pbcc', unit: 'T' },
  { label: '', subLabel: 'BF', table: 'consumption', field: 'crude_tar_bf', unit: 'T' },
  { label: '', subLabel: 'DEHY. TAR', table: 'consumption', field: 'crude_tar_dehy_tar', unit: 'T' },
  { label: '', subLabel: 'STABILIZATION', table: 'consumption', field: 'crude_tar_stabilization', unit: 'T' },
  { label: '', subLabel: 'HANDL. LOSS', table: 'consumption', field: 'crude_tar_handling_loss', unit: 'T' },
  { label: '', subLabel: 'TOTAL', table: 'consumption', field: 'crude_tar_total', unit: 'T' },
  { label: 'EHP', subLabel: 'PBCC', table: 'consumption', field: 'ehp_pbcc', unit: 'T' },
  { label: '', subLabel: 'BF', table: 'consumption', field: 'ehp_bf', unit: 'T' },
  { label: '', subLabel: 'LDBP', table: 'consumption', field: 'ehp_ldbp', unit: 'T' },
  { label: '', subLabel: 'TOTAL', table: 'consumption', field: 'ehp_total', unit: 'T' },
  { label: 'SULPHURIC ACID', subLabel: 'SULP.', table: 'consumption', field: 'sulphuric_acid_sulp', unit: 'T' },
  { label: '', subLabel: 'N CCD', table: 'consumption', field: 'sulphuric_acid_n_ccd', unit: 'T' },
  { label: '', subLabel: 'BOD', table: 'consumption', field: 'sulphuric_acid_bod', unit: 'T' },
  { label: '', subLabel: 'CRM', table: 'consumption', field: 'sulphuric_acid_crm', unit: 'T' },
  { label: '', subLabel: 'CPP-1', table: 'consumption', field: 'sulphuric_acid_cpp1', unit: 'T' },
  { label: '', subLabel: 'COMM. & STAB.', table: 'consumption', field: 'sulphuric_acid_comm_stab', unit: 'T' },
  { label: '', subLabel: 'TOTAL', table: 'consumption', field: 'sulphuric_acid_total', unit: 'T' },
  { label: 'ROAD TAR', subLabel: 'CES', table: 'consumption', field: 'road_tar_ces', unit: 'T' },
  { label: '', subLabel: 'TS', table: 'consumption', field: 'road_tar_ts', unit: 'T' },
  { label: '', subLabel: 'TOTAL', table: 'consumption', field: 'road_tar_total', unit: 'T' },
  { label: 'O-PHOSPHORIC ACID', subLabel: '', table: 'consumption', field: 'o_phosphoric_acid', unit: 'Kg' },
  { label: 'CAUSTIC LYE', subLabel: '', table: 'consumption', field: 'caustic_lye', unit: 'T' },
  { label: 'SULPHUR', subLabel: 'CONSUM.', table: 'consumption', field: 'sulphur_consum', unit: 'T' },
  { label: '', subLabel: 'MUCK REMVL.', table: 'consumption', field: 'sulphur_muck_removal', unit: 'T' },
  { label: '', subLabel: 'HANDL. LOSS', table: 'consumption', field: 'sulphur_handling_loss', unit: 'T' },
  { label: '', subLabel: 'PIT COMM.', table: 'consumption', field: 'sulphur_pit_comm', unit: 'T' },
  { label: '', subLabel: 'PIT STAB.', table: 'consumption', field: 'sulphur_pit_stab', unit: 'T' },
  { label: '', subLabel: 'TOTAL', table: 'consumption', field: 'sulphur_total', unit: 'T' },
  { label: 'LIGHT OIL', subLabel: 'CR. TAR', table: 'consumption', field: 'light_oil_cr_tar', unit: 'T' },
  { label: '', subLabel: 'HANDL. LOSS', table: 'consumption', field: 'light_oil_handling_loss', unit: 'T' },
  { label: '', subLabel: 'TOTAL', table: 'consumption', field: 'light_oil_total', unit: 'T' },
  { label: 'CARBOLIC OIL', subLabel: 'CR. TAR', table: 'consumption', field: 'carbolic_oil_cr_tar', unit: 'T' },
  { label: '', subLabel: 'HANDL. LOSS', table: 'consumption', field: 'carbolic_oil_handling_loss', unit: 'T' },
  { label: '', subLabel: 'TOTAL', table: 'consumption', field: 'carbolic_oil_total', unit: 'T' },
  { label: 'NAPHTHALENE OIL', subLabel: 'CR. TAR', table: 'consumption', field: 'naphthalene_oil_cr_tar', unit: 'T' },
  { label: '', subLabel: 'HANDL. LOSS', table: 'consumption', field: 'naphthalene_oil_handling_loss', unit: 'T' },
  { label: '', subLabel: 'NAPH. PLANT', table: 'consumption', field: 'naphthalene_oil_naph_plant', unit: 'T' },
  { label: '', subLabel: 'TOTAL', table: 'consumption', field: 'naphthalene_oil_total', unit: 'T' },
  { label: 'WASH OIL', subLabel: 'TAR PLANT', table: 'consumption', field: 'wash_oil_tar_plant', unit: 'T' },
  { label: '', subLabel: 'HANDL. LOSS', table: 'consumption', field: 'wash_oil_handling_loss', unit: 'T' },
  { label: '', subLabel: 'NAPH. PLANT', table: 'consumption', field: 'wash_oil_naph_plant', unit: 'T' },
  { label: '', subLabel: 'CR. TAR', table: 'consumption', field: 'wash_oil_cr_tar', unit: 'T' },
  { label: '', subLabel: 'TOTAL', table: 'consumption', field: 'wash_oil_total', unit: 'T' },
  { label: 'ANTHRACENE OIL', subLabel: 'CR. TAR', table: 'consumption', field: 'anthracene_oil_cr_tar', unit: 'T' },
  { label: '', subLabel: 'HANDL. LOSS', table: 'consumption', field: 'anthracene_oil_handling_loss', unit: 'T' },
  { label: '', subLabel: 'RT-IV', table: 'consumption', field: 'anthracene_oil_rt_iv', unit: 'T' },
  { label: '', subLabel: 'TOTAL', table: 'consumption', field: 'anthracene_oil_total', unit: 'T' },
  // DESPATCH
  { label: 'DESPATCH', subLabel: '', table: '', field: '', unit: '' },
  { label: 'CRUDE TAR', subLabel: 'APP', table: 'despatch', field: 'crude_tar_app', unit: 'T' },
  { label: '', subLabel: 'ACT', table: 'despatch', field: 'crude_tar_act', unit: 'T' },
  { label: 'DEHYDRATED TAR', subLabel: 'ACT', table: 'despatch', field: 'dehydrated_tar_act', unit: 'T' },
  { label: 'LCO-II', subLabel: 'ACT', table: 'despatch', field: 'lco_ii_act', unit: 'T' },
  { label: 'ANTHRACENE OIL', subLabel: 'ACT', table: 'despatch', field: 'anthracene_oil_act', unit: 'T' },
  { label: 'AMM. SULPHATE', subLabel: 'APP', table: 'despatch', field: 'amm_sulphate_app', unit: 'T' },
  { label: '', subLabel: 'ACT', table: 'despatch', field: 'amm_sulphate_act', unit: 'T' },
  { label: 'SULPHURIC ACID', subLabel: 'APP', table: 'despatch', field: 'sulphuric_acid_app', unit: 'T' },
  { label: '', subLabel: 'ACT', table: 'despatch', field: 'sulphuric_acid_act', unit: 'T' },
  // STOCK
  { label: 'STOCK', subLabel: '', table: '', field: '', unit: '' },
  { label: 'CRUDE TAR', subLabel: '', table: 'stock', field: 'crude_tar', unit: 'T' },
  { label: 'DEHYDRATED TAR', subLabel: '', table: 'stock', field: 'dehydrated_tar', unit: 'T' },
  { label: 'EHP', subLabel: '', table: 'stock', field: 'ehp', unit: 'T' },
  { label: 'RT-IV', subLabel: '', table: 'stock', field: 'rt_iv', unit: 'T' },
  { label: 'HPN', subLabel: '', table: 'stock', field: 'hpn', unit: 'T' },
  { label: 'LIGHT OIL', subLabel: '', table: 'stock', field: 'light_oil', unit: 'T' },
  { label: 'CARBOLIC OIL', subLabel: '', table: 'stock', field: 'carbolic_oil', unit: 'T' },
  { label: 'LCO-II', subLabel: '', table: 'stock', field: 'lco_ii', unit: 'T' },
  { label: 'ANTHRACENE OIL', subLabel: '', table: 'stock', field: 'anthracene_oil', unit: 'T' },
  { label: 'SULPHURIC ACID', subLabel: '', table: 'stock', field: 'sulphuric_acid', unit: 'T' },
  { label: 'AMM. SULPHATE', subLabel: '', table: 'stock', field: 'amm_sulphate', unit: 'T' },
  { label: 'CRUDE BENZOL', subLabel: '', table: 'stock', field: 'crude_benzol', unit: 'T' },
  { label: 'O-PHOSPHORIC ACID', subLabel: '', table: 'stock', field: 'o_phosphoric_acid', unit: 'Kg' },
  { label: 'CAUSTIC LYE', subLabel: '', table: 'stock', field: 'caustic_lye', unit: 'T' },
  { label: 'SULPHUR', subLabel: '', table: 'stock', field: 'sulphur', unit: 'T' },
  { label: 'NAPHTHALENE OIL', subLabel: '', table: 'stock', field: 'naphthalene_oil', unit: 'T' },
  // TECHNO-ECO
  { label: 'TECHNO-ECO. PARAMETERS', subLabel: '', table: '', field: '', unit: '' },
  { label: 'OVEN PUSHING (OLD)', subLabel: 'MONTH', table: 'techno_eco', field: 'oven_pushing_old_month', unit: 'Nos.' },
  { label: 'OVEN PUSHING (OLD)', subLabel: 'DAY', table: 'techno_eco', field: 'oven_pushing_old_day', unit: 'Nos.' },
  { label: 'OVEN PUSHING (NEW)', subLabel: 'MONTH', table: 'techno_eco', field: 'oven_pushing_new_month', unit: 'Nos.' },
  { label: 'OVEN PUSHING (NEW)', subLabel: 'DAY', table: 'techno_eco', field: 'oven_pushing_new_day', unit: 'Nos.' },
  { label: 'COAL CHGD. PER OVEN (OLD)', subLabel: '', table: 'techno_eco', field: 'coal_charged_per_oven_old', unit: 'T' },
  { label: 'COAL CHGD. PER OVEN (NEW)', subLabel: '', table: 'techno_eco', field: 'coal_charged_per_oven_new', unit: 'T' },
  { label: '%VM IN COAL BLEND (OLD)', subLabel: '', table: 'techno_eco', field: 'vm_percent_coal_blend_old', unit: '%' },
  { label: '%VM IN COAL BLEND (NEW)', subLabel: '', table: 'techno_eco', field: 'vm_percent_coal_blend_new', unit: '%' },
  { label: 'RAW GAS AMMONIA', subLabel: '', table: 'techno_eco', field: 'raw_gas_ammonia_g_nm3', unit: 'g/Nm³' },
  { label: 'ACID / T SULPHATE', subLabel: '', table: 'techno_eco', field: 'acid_per_t_sulphate', unit: 'T/T' },
  { label: 'SULPHUR / T ACID', subLabel: '', table: 'techno_eco', field: 'sulphur_per_t_acid', unit: 'T/T' },
  // PRODUCT YIELD
  { label: 'PRODUCT YIELD', subLabel: '', table: '', field: '', unit: '' },
  { label: 'CRUDE TAR (OLD)', subLabel: '', table: 'product_yield', field: 'crude_tar_kg_tdcc_old', unit: 'kg/TDCC' },
  { label: 'CRUDE TAR (NEW)', subLabel: '', table: 'product_yield', field: 'crude_tar_kg_tdcc_new', unit: 'kg/TDCC' },
  { label: 'EHP', subLabel: '', table: 'product_yield', field: 'ehp_pct_ctd', unit: '%CTD' },
  { label: 'LIGHT OIL', subLabel: '', table: 'product_yield', field: 'light_oil_pct_ctd', unit: '%CTD' },
  { label: 'HPN', subLabel: '', table: 'product_yield', field: 'hpn_pct_nod', unit: '%NOD' },
  { label: 'AMM. SULPHATE', subLabel: '', table: 'product_yield', field: 'amm_sulphate_kg_tdcc', unit: 'kg/TDCC' },
  { label: 'ANTHRACENE OIL', subLabel: '', table: 'product_yield', field: 'anthracene_oil_pct_ctd', unit: '%CTD' },
  { label: 'LCO-II', subLabel: '', table: 'product_yield', field: 'lco_ii_pct_ctd', unit: '%CTD' },
  { label: 'CARBOLIC OIL', subLabel: '', table: 'product_yield', field: 'carbolic_oil_pct_ctd', unit: '%CTD' },
  { label: 'NAPHTHALENE OIL', subLabel: '', table: 'product_yield', field: 'naphthalene_oil_pct_ctd', unit: '%CTD' },
  { label: 'TOTAL TAR PRODUCT', subLabel: '', table: 'product_yield', field: 'total_tar_product_pct_ctd', unit: '%CTD' },
  // REVENUE
  { label: 'REVENUE GENERATION', subLabel: '', table: '', field: '', unit: '' },
  { label: 'NSR', subLabel: '', table: 'revenue', field: 'nsr_lakh_rs', unit: 'Lakh Rs.' },
  // RUNNING HOURS
  { label: 'RUNNING HOURS', subLabel: '', table: '', field: '', unit: '' },
  { label: 'EXHAUSTER #1', subLabel: '', table: 'running_hours', field: 'exhauster_1', unit: 'Hrs' },
  { label: 'EXHAUSTER #2', subLabel: '', table: 'running_hours', field: 'exhauster_2', unit: 'Hrs' },
  { label: 'EXHAUSTER #3', subLabel: '', table: 'running_hours', field: 'exhauster_3', unit: 'Hrs' },
  { label: 'EXHAUSTER #4', subLabel: '', table: 'running_hours', field: 'exhauster_4', unit: 'Hrs' },
  { label: 'EXHAUSTER #5', subLabel: '', table: 'running_hours', field: 'exhauster_5', unit: 'Hrs' },
  { label: 'EXHAUSTER #6', subLabel: '', table: 'running_hours', field: 'exhauster_6', unit: 'Hrs' },
  { label: 'BOOSTER #1', subLabel: '', table: 'running_hours', field: 'booster_1', unit: 'Hrs' },
  { label: 'BOOSTER #2', subLabel: '', table: 'running_hours', field: 'booster_2', unit: 'Hrs' },
  { label: 'BOOSTER #3', subLabel: '', table: 'running_hours', field: 'booster_3', unit: 'Hrs' },
  { label: 'BOOSTER #4', subLabel: '', table: 'running_hours', field: 'booster_4', unit: 'Hrs' },
  { label: 'BOOSTER #5', subLabel: '', table: 'running_hours', field: 'booster_5', unit: 'Hrs' },
  { label: 'TAR DISTILLATION', subLabel: '', table: 'running_hours', field: 'tar_distillation', unit: 'Hrs' },
  { label: 'VACUUM', subLabel: '', table: 'running_hours', field: 'vacuum', unit: 'Hrs' },
  { label: 'ACID PLANT', subLabel: '', table: 'running_hours', field: 'acid_plant', unit: 'Hrs' },
  { label: 'AMMONIUM SULPHATE', subLabel: '', table: 'running_hours', field: 'ammonium_sulphate', unit: 'Hrs' },
  // ISO OBJECTIVES
  { label: 'ISO OBJECTIVES', subLabel: '', table: '', field: '', unit: '' },
  { label: 'END GAS AMMONIA', subLabel: '', table: 'iso_objectives', field: 'end_gas_ammonia_g_nm3', unit: 'g/Nm³' },
  { label: 'END GAS NAPHTHALENE', subLabel: '', table: 'iso_objectives', field: 'end_gas_naphthalene_g_nm3', unit: 'g/Nm³' },
  { label: 'TAR FOG', subLabel: '', table: 'iso_objectives', field: 'tar_fog_g_nm3', unit: 'g/Nm³' },
  // OHSAS
  { label: 'OHSAS OBJECTIVES', subLabel: '', table: '', field: '', unit: '' },
  { label: 'REP. ACCIDENT', subLabel: '', table: 'ohsas_objectives', field: 'reportable_accidents', unit: 'Nos.' },
  { label: 'HEALTH CHK UP', subLabel: '', table: 'ohsas_objectives', field: 'health_checkups_total', unit: 'Nos.' },
  { label: 'EARTHING PIT INSPN', subLabel: '', table: 'ohsas_objectives', field: 'earthing_pit_inspection_pct', unit: '%' },
  // ENVIRONMENT BOD
  { label: 'ENVIRONMENT BOD ANALYSIS', subLabel: '', table: '', field: '', unit: '' },
  { label: 'AMMONIA: IN', subLabel: '', table: 'environment_bod', field: 'ammonia_in', unit: 'ppm' },
  { label: 'AMMONIA: OUT', subLabel: '', table: 'environment_bod', field: 'ammonia_out', unit: 'ppm' },
  { label: 'PHENOL: IN', subLabel: '', table: 'environment_bod', field: 'phenol_in', unit: 'ppm' },
  { label: 'PHENOL: OUT', subLabel: '', table: 'environment_bod', field: 'phenol_out', unit: 'ppm' },
  { label: 'CYANIDE: IN', subLabel: '', table: 'environment_bod', field: 'cyanide_in', unit: 'ppm' },
  { label: 'CYANIDE: OUT', subLabel: '', table: 'environment_bod', field: 'cyanide_out', unit: 'ppm' },
  { label: 'PH: IN', subLabel: '', table: 'environment_bod', field: 'ph_in', unit: '' },
  { label: 'PH: OUT', subLabel: '', table: 'environment_bod', field: 'ph_out', unit: '' },
  { label: 'PHOSPHATE: OUT', subLabel: '', table: 'environment_bod', field: 'phosphate_out', unit: 'ppm' },
  { label: 'MLSS: AT-I', subLabel: '', table: 'environment_bod', field: 'mlss_at_i', unit: 'ppm' },
  { label: 'MLSS: AT-II', subLabel: '', table: 'environment_bod', field: 'mlss_at_ii', unit: 'ppm' },
  // PRODUCT QUALITY OLD
  { label: 'PRODUCT QUALITY (OLD CCD)', subLabel: '', table: '', field: '', unit: '' },
  { label: 'TAR QUALITY: BI', subLabel: '', table: 'product_quality', field: 'tar_quality_bi', unit: '%' },
  { label: 'TAR QUALITY: QI', subLabel: '', table: 'product_quality', field: 'tar_quality_qi', unit: '%' },
  { label: 'TAR SP. GR.', subLabel: '', table: 'product_quality', field: 'tar_sp_gr', unit: '' },
  { label: 'ACID CONCENTRATION', subLabel: '', table: 'product_quality', field: 'acid_concentration', unit: '%' },
  // LAB ANALYSIS NEW
  { label: 'LAB ANALYSIS (NEW CCD)', subLabel: '', table: '', field: '', unit: '' },
  { label: 'TAR FOG', subLabel: '', table: 'lab_analysis_new', field: 'tar_fog_g_nm3', unit: 'g/Nm³' },
  { label: 'NAPHTHALENE', subLabel: '', table: 'lab_analysis_new', field: 'naphthalene_g_nm3', unit: 'g/Nm³' },
  { label: 'AMMONIA', subLabel: '', table: 'lab_analysis_new', field: 'ammonia_g_nm3', unit: 'g/Nm³' },
  // PRODUCT QUALITY NEW
  { label: 'PRODUCT QUALITY (NEW CCD)', subLabel: '', table: '', field: '', unit: '' },
  { label: 'TAR QUALITY: BI', subLabel: '', table: 'product_quality_new', field: 'tar_quality_bi', unit: '%' },
  { label: 'TAR QUALITY: QI', subLabel: '', table: 'product_quality_new', field: 'tar_quality_qi', unit: '%' },
  { label: 'TAR SP. GR.', subLabel: '', table: 'product_quality_new', field: 'tar_sp_gr', unit: '' },
  { label: 'ACID CONCENTRATION', subLabel: '', table: 'product_quality_new', field: 'acid_concentration', unit: '%' },
]

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
  const [downloadFrom, setDownloadFrom] = useState(1)
  const [downloadTo, setDownloadTo] = useState(12)
  const [downloadType, setDownloadType] = useState('full')

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
        setProgress('Saving ' + table + ' - ' + MONTHS[monthIndex - 1] + '...')
        const payload: any = { fiscal_year: fiscalYear, month_index: monthIndex, ...fields }
        const { data: existing } = await supabase.from(table).select('id').eq('fiscal_year', fiscalYear).eq('month_index', monthIndex).single()
        let error
        if (existing) {
          const res = await supabase.from(table).update(payload).eq('id', existing.id)
          error = res.error
        } else {
          const res = await supabase.from(table).insert(payload)
          error = res.error
        }
        if (error) {
          logs.push('X ' + table + ' ' + MONTHS[monthIndex-1] + ': ' + error.message)
        } else {
          totalInserted++
          logs.push('OK ' + table + ' ' + MONTHS[monthIndex-1] + ': ' + Object.keys(fields).length + ' fields')
        }
      }
    }

    logs.unshift('DONE - Import complete: ' + totalInserted + ' records saved for FY ' + fiscalYear)
    setResults(logs)
    setProgress('')
    setImporting(false)
  }

  async function handleDownloadExcel() {
    setDownloading(true)
    setProgress('Fetching all data...')

    const XLSX = (await import('xlsx'))
    const allData: Record<string, any[]> = {}
    const fromM = downloadType === 'full' ? 1 : downloadFrom
    const toM = downloadType === 'full' ? 12 : downloadTo

    for (const table of ALL_TABLES) {
      const { data } = await supabase.from(table).select('*').eq('fiscal_year', downloadFY).gte('month_index', fromM).lte('month_index', toM).order('month_index')
      allData[table] = data || []
    }

    setProgress('Building Excel...')
    const monthHeaders = MONTHS.slice(fromM - 1, toM)
    const numMonths = toM - fromM + 1
    const getVal = (table: string, field: string, month: number) => {
      const row = allData[table]?.find((r: any) => r.month_index === month)
      const val = row?.[field]
      if (val === null || val === undefined) return ''
      const num = Number(val)
      return isNaN(num) ? val : Number(num.toFixed(3))
    }

    const rows: any[][] = []
    // Title rows
    rows.push(['', '', '', ...Array(numMonths).fill('')])  // row 1: title
    rows.push(['', '', '', ...Array(numMonths).fill('')])  // row 2: subtitle
    rows.push(['', '', '', ...Array(numMonths).fill('')])  // row 3: spacer
    // Header row
    rows.push(['PARAMETER', 'TYPE', 'UNIT', ...monthHeaders])

    for (const r of REPORT_ROWS) {
      if (!r.table) {
        rows.push([r.label, '', '', ...Array(numMonths).fill('')])
      } else {
        const vals = []
        for (let m = fromM; m <= toM; m++) {
          vals.push(getVal(r.table, r.field, m))
        }
        rows.push([r.label, r.subLabel, r.unit, ...vals])
      }
    }

    // Footer
    rows.push(['', '', '', ...Array(numMonths).fill('')])
    rows.push(['Developed by: SAIL Digital Transformation Division  |  Rourkela Steel Plant  |  Confidential', '', '', ...Array(numMonths).fill('')])

    const ws = XLSX.utils.aoa_to_sheet(rows)

    // Set title cells
    ws['A1'] = { v: 'COAL CHEMICALS DEPARTMENT — MONTHLY PERFORMANCE REPORT', t: 's' }
    ws['A2'] = { v: 'SAIL, Rourkela Steel Plant  |  FY ' + downloadFY, t: 's' }

    // Column widths
    const colWidths = [{ wch: 26 }, { wch: 7 }, { wch: 10 }]
    for (let i = 0; i < numMonths; i++) colWidths.push({ wch: 11 })
    ws['!cols'] = colWidths

    // Row heights
    ws['!rows'] = [{ hpt: 30 }, { hpt: 18 }, { hpt: 6 }, { hpt: 20 }]

    // Merge title rows across all columns
    const lastCol = XLSX.utils.encode_col(2 + numMonths)
    ws['!merges'] = [
      { s: { r: 0, c: 0 }, e: { r: 0, c: 2 + numMonths } },  // title
      { s: { r: 1, c: 0 }, e: { r: 1, c: 2 + numMonths } },  // subtitle
      { s: { r: rows.length - 1, c: 0 }, e: { r: rows.length - 1, c: 2 + numMonths } },  // footer
    ]

    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'CCD Monthly Report')
    const filename = downloadType === 'full'
      ? 'CCD_Report_' + downloadFY + '_Full.xlsx'
      : 'CCD_Report_' + downloadFY + '_' + MONTHS[fromM-1] + '-' + MONTHS[toM-1] + '.xlsx'
    XLSX.writeFile(wb, filename)
    setProgress('')
    setDownloading(false)
  }

  async function handleDownloadPDF() {
    setDownloading(true)
    setProgress('Generating PDF...')

    const jsPDF = (await import('jspdf')).default
    await import('jspdf-autotable')

    const allData: Record<string, any[]> = {}
    const fromM = downloadType === 'full' ? 1 : downloadFrom
    const toM = downloadType === 'full' ? 12 : downloadTo

    for (const table of ALL_TABLES) {
      const { data } = await supabase.from(table).select('*').eq('fiscal_year', downloadFY).gte('month_index', fromM).lte('month_index', toM).order('month_index')
      allData[table] = data || []
    }

    const monthHeaders = MONTHS.slice(fromM - 1, toM)
    const numMonths = toM - fromM + 1
    const getValPdf = (table: string, field: string, month: number) => {
      const row = allData[table]?.find((r: any) => r.month_index === month)
      const val = row?.[field]
      if (val === null || val === undefined) return ''
      const num = Number(val)
      return isNaN(num) ? val : Number(num.toFixed(3))
    }

    const doc = new jsPDF({ orientation: 'landscape' })
    const pageW = doc.internal.pageSize.getWidth()

    // Title banner
    doc.setFillColor(27, 58, 92)  // dark blue
    doc.rect(0, 0, pageW, 22, 'F')
    doc.setTextColor(255, 255, 255)
    doc.setFontSize(14)
    doc.setFont('helvetica', 'bold')
    doc.text('COAL CHEMICALS DEPARTMENT — MONTHLY PERFORMANCE REPORT', pageW / 2, 10, { align: 'center' })
    doc.setFontSize(9)
    doc.setFont('helvetica', 'normal')
    doc.text('SAIL, Rourkela Steel Plant  |  FY ' + downloadFY + '  |  Generated: ' + new Date().toLocaleDateString('en-IN'), pageW / 2, 18, { align: 'center' })

    // Reset text color
    doc.setTextColor(0, 0, 0)

    const headers = [['Parameter', 'Type', 'Unit', ...monthHeaders]]
    const body: any[][] = []
    let rowIndex = 0

    for (const r of REPORT_ROWS) {
      if (!r.table) {
        // Section header row
        body.push([{ content: '  ' + r.label, colSpan: 3 + numMonths, styles: { fontStyle: 'bold', fillColor: [214, 232, 245], textColor: [27, 58, 92], fontSize: 7 } }])
      } else {
        const vals = []
        for (let m = fromM; m <= toM; m++) {
          vals.push(getValPdf(r.table, r.field, m))
        }
        body.push([r.label, r.subLabel, r.unit, ...vals])
      }
      rowIndex++
    }

    ;(doc as any).autoTable({
      head: headers,
      body: body,
      startY: 26,
      styles: { fontSize: 6, cellPadding: 1.5, lineColor: [200, 200, 200], lineWidth: 0.1 },
      headStyles: { fillColor: [46, 91, 138], fontSize: 6.5, textColor: [255, 255, 255], fontStyle: 'bold', halign: 'center' },
      columnStyles: {
        0: { cellWidth: 38, fontStyle: 'normal' },
        1: { cellWidth: 10, halign: 'center' },
        2: { cellWidth: 14, halign: 'center', fontStyle: 'italic', textColor: [100, 100, 100] },
      },
      alternateRowStyles: { fillColor: [245, 245, 245] },
      theme: 'grid',
      margin: { left: 5, right: 5 },
      didDrawPage: (data: any) => {
        // Footer on each page
        const pageH = doc.internal.pageSize.getHeight()
        doc.setFillColor(240, 240, 240)
        doc.rect(0, pageH - 10, pageW, 10, 'F')
        doc.setFontSize(7)
        doc.setTextColor(120, 120, 120)
        doc.setFont('helvetica', 'italic')
        doc.text('Developed by: SAIL Digital Transformation Division  |  Rourkela Steel Plant  |  Confidential', pageW / 2, pageH - 4, { align: 'center' })
        doc.setTextColor(0, 0, 0)
        doc.setFont('helvetica', 'normal')
      },
    })

    const filename = downloadType === 'full'
      ? 'CCD_Report_' + downloadFY + '_Full.pdf'
      : 'CCD_Report_' + downloadFY + '_' + MONTHS[fromM-1] + '-' + MONTHS[toM-1] + '.pdf'
    doc.save(filename)
    setProgress('')
    setDownloading(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-gray-500">Loading...</div>
      </div>
    )
  }

  if (profile?.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="card text-center">
          <p className="text-red-600 font-medium">Access Denied</p>
          <p className="text-gray-500 mt-2">Admin access required</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <Navbar profile={profile} activeTab="import" />
      <main className="p-6 max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Import and Download Reports</h1>

        <div className="card mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-2">Upload Excel (Import Past Data)</h2>
          <p className="text-sm text-gray-500 mb-4">Upload the standard CCD Monthly Report Excel. All 12 months will be read and saved for the selected FY.</p>
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

        <div className="card mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-2">Download Report (All Parameters)</h2>
          <p className="text-sm text-gray-500 mb-4">Download the complete monthly report with all 130+ parameters for any fiscal year or selected months.</p>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
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
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Range</label>
              <select className="input-field" value={downloadType} onChange={e => setDownloadType(e.target.value)}>
                <option value="full">Full Year (Apr-Mar)</option>
                <option value="custom">Custom Range</option>
              </select>
            </div>
            {downloadType === 'custom' && (
              <>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">From</label>
                  <select className="input-field" value={downloadFrom} onChange={e => setDownloadFrom(Number(e.target.value))}>
                    {MONTHS.map((m, i) => (<option key={i} value={i+1}>{m}</option>))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">To</label>
                  <select className="input-field" value={downloadTo} onChange={e => setDownloadTo(Number(e.target.value))}>
                    {MONTHS.map((m, i) => (<option key={i} value={i+1}>{m}</option>))}
                  </select>
                </div>
              </>
            )}
          </div>
          <div className="flex flex-wrap gap-3">
            <button onClick={handleDownloadExcel} className="btn-primary" disabled={downloading}>
              Download Excel (.xlsx)
            </button>
            <button onClick={handleDownloadPDF} className="btn-secondary" disabled={downloading}>
              Download PDF
            </button>
          </div>
        </div>

        {results.length > 0 && (
          <div className="card">
            <h2 className="text-lg font-semibold text-gray-800 mb-3">Import Results</h2>
            <div className="bg-gray-900 rounded-xl p-4 max-h-96 overflow-y-auto">
              {results.map((line, i) => (
                <div key={i} className={'text-sm font-mono ' + (line.startsWith('X ') ? 'text-red-400' : line.startsWith('DONE') ? 'text-green-400 font-bold' : 'text-gray-300')}>
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
