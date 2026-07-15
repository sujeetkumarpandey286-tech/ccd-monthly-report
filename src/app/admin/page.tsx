'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'
import Navbar from '@/components/Navbar'

const supabase = createClient(
  'https://hwafhyotnviacdzsdzsv.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh3YWZoeW90bnZpYWNkenNkenN2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQwODg5NzIsImV4cCI6MjA5OTY2NDk3Mn0.1ibzOXApTZA_P9T6kiq7ayf85KmxNd91XeP6f7SdyGc'
)

export default function AdminPage() {
  const [profile, setProfile] = useState<any>(null)
  const [users, setUsers] = useState<any[]>([])
  const [auditLog, setAuditLog] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data: prof } = await supabase.from('profiles').select('*').eq('id', user.id).single()
        setProfile(prof)
        if (prof?.role === 'admin') {
          const { data: allUsers } = await supabase.from('profiles').select('*').order('employee_id')
          setUsers(allUsers || [])
          const { data: logs } = await supabase.from('audit_log').select('*').order('created_at', { ascending: false }).limit(50)
          setAuditLog(logs || [])
        }
      }
      setLoading(false)
    }
    load()
  }, [])

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
      <Navbar profile={profile} activeTab="admin" />
      <main className="p-6 max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Admin Panel</h1>

        {/* Users Table */}
        <div className="card mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">User Management</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="table-header">
                  <th className="px-4 py-3 text-left">Employee ID</th>
                  <th className="px-4 py-3 text-left">Name</th>
                  <th className="px-4 py-3 text-left">Role</th>
                  <th className="px-4 py-3 text-left">Status</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id} className="border-b border-gray-100 hover:bg-blue-50/50">
                    <td className="px-4 py-3 font-medium">{u.employee_id}</td>
                    <td className="px-4 py-3">{u.full_name}</td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                        {u.role}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${u.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {u.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Audit Log */}
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Audit Trail</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="table-header">
                  <th className="px-4 py-3 text-left">Time</th>
                  <th className="px-4 py-3 text-left">Action</th>
                  <th className="px-4 py-3 text-left">Table</th>
                  <th className="px-4 py-3 text-left">Field</th>
                  <th className="px-4 py-3 text-left">Old → New</th>
                  <th className="px-4 py-3 text-left">Reason</th>
                </tr>
              </thead>
              <tbody>
                {auditLog.map((log) => (
                  <tr key={log.id} className="border-b border-gray-100 hover:bg-blue-50/50">
                    <td className="px-4 py-3 text-gray-500">{new Date(log.created_at).toLocaleString()}</td>
                    <td className="px-4 py-3 font-medium">{log.action}</td>
                    <td className="px-4 py-3">{log.table_name}</td>
                    <td className="px-4 py-3">{log.field_name || '-'}</td>
                    <td className="px-4 py-3">{log.old_value || '-'} → {log.new_value || '-'}</td>
                    <td className="px-4 py-3 text-gray-500">{log.reason || '-'}</td>
                  </tr>
                ))}
                {auditLog.length === 0 && (
                  <tr><td colSpan={6} className="px-4 py-8 text-center text-gray-400">No audit entries yet</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  )
}
