'use client'

interface SidebarProps {
  role: string
  activeSection: string
  onSectionChange: (section: string) => void
}

const allSections = [
  { code: 'production', name: 'Production', editableBy: ['production', 'admin'] },
  { code: 'receipt', name: 'Receipt / Raw Materials', editableBy: ['production', 'admin'] },
  { code: 'consumption', name: 'Consumption / Transfer', editableBy: ['production', 'admin'] },
  { code: 'despatch', name: 'Despatch', editableBy: ['production', 'admin'] },
  { code: 'stock', name: 'Stock Position', editableBy: ['production', 'admin'] },
  { code: 'running_hours', name: 'Running Hours', editableBy: ['production', 'admin'] },
  { code: 'techno_eco', name: 'Techno-Economic', editableBy: ['quality', 'admin'] },
  { code: 'product_yield', name: 'Product Yield', editableBy: ['quality', 'admin'] },
  { code: 'product_quality', name: 'Product Quality (Old)', editableBy: ['quality', 'admin'] },
  { code: 'product_quality_new', name: 'Product Quality (New)', editableBy: ['quality', 'admin'] },
  { code: 'lab_analysis_new', name: 'Lab Analysis (New)', editableBy: ['quality', 'admin'] },
  { code: 'revenue', name: 'Revenue Generation', editableBy: ['admin'] },
  { code: 'iso_objectives', name: 'ISO Objectives', editableBy: ['environment', 'admin'] },
  { code: 'ohsas_objectives', name: 'OHSAS Objectives', editableBy: ['safety', 'admin'] },
  { code: 'environment_bod', name: 'Environment BOD', editableBy: ['environment', 'admin'] },
]

export default function Sidebar({ role, activeSection, onSectionChange }: SidebarProps) {
  const editable = allSections.filter(s => s.editableBy.includes(role))
  const viewOnly = allSections.filter(s => !s.editableBy.includes(role))

  return (
    <aside className="w-64 min-h-[calc(100vh-64px)] bg-white/50 backdrop-blur-sm border-r border-white/30 p-4">
      {editable.length > 0 && (
        <>
          <h3 className="text-xs font-semibold uppercase text-gray-500 mb-2 tracking-wider">Your Sections</h3>
          <div className="space-y-1 mb-6">
            {editable.map((s) => (
              <button
                key={s.code}
                onClick={() => onSectionChange(s.code)}
                className={`w-full text-left px-3 py-2 rounded-xl text-sm transition-all ${
                  activeSection === s.code
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/30'
                    : 'text-gray-700 hover:bg-white/80'
                }`}
              >
                {s.name}
              </button>
            ))}
          </div>
        </>
      )}

      <h3 className="text-xs font-semibold uppercase text-gray-500 mb-2 tracking-wider">
        {role === 'viewer' ? 'All Sections' : 'View Only'}
      </h3>
      <div className="space-y-1">
        {(role === 'viewer' ? allSections : viewOnly).map((s) => (
          <button
            key={s.code}
            onClick={() => onSectionChange(s.code)}
            className={`w-full text-left px-3 py-2 rounded-xl text-sm transition-all ${
              activeSection === s.code
                ? 'bg-gray-200 text-gray-800'
                : 'text-gray-500 hover:bg-white/60'
            }`}
          >
            {s.name}
          </button>
        ))}
      </div>
    </aside>
  )
}
