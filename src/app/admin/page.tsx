'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'
import Navbar from '@/components/Navbar'

const supabase = createClient(
  'https://hwafhyotnviacdzsdzsv.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh3YWZoeW90bnZpYWNkenNkenN2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQwODg5NzIsImV4cCI6MjA5OTY2NDk3Mn0.1ibzOXApTZA_P9T6kiq7ayf85KmxNd91XeP6f7SdyGc'
)

const ROLES = ['production', 'quality', 'environment', 'safety', 'viewer', 'admin']

export default function AdminPage() {
  const [profile, setProfile] = useState<any>(null)
  const [users, setUsers] = useState<any[]>([])
  const [auditLog, setAuditLog] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddUser, setShowAddUser] = useState(false)
  const [newUser, setNewUser] = useState({ employeeId: '', fullName: '', role: 'viewer', password: '' })
  const [creating, setCreating] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
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

  async function handleCreateUser(e: React.FormEvent) {
    e.preventDefault()
    setCreating(true)
    setMessage('')

    try {
      // Create auth user via signup
      const email = `${newUser.employeeId.toLowerCase()}@ccd.internal`
      const signupRes = await fetch('https://hwafhyotnviacdzsdzsv.supabase.co/auth/v1/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh3YWZoeW90bnZpYWNkenNkenN2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQwODg5NzIsImV4cCI6MjA5OTY2NDk3Mn0.1ibzOXApTZA_P9T6kiq7ayf85KmxNd91XeP6f7SdyGc'
        },
        body: JSON.stringify({ email, password: newUser.password })
      })
      const signupData = await signupRes.json()

      if (signupData.error || !signupData.user) {
        setMessage('Error: ' + (signupData.error || signupData.msg || 'Failed to create auth user'))
        setCreating(false)
        return
      }

      // Create profile
      const { error: profileError } = await supabase.from('profiles').insert({
        id: signupData.user.id,
        employee_id: newUser.employeeId.toUpperCase(),
        full_name: newUser.fullName,
        role: newUser.role,
      })

      if (profileError) {
        setMessage('Error creating profile: ' + profileError.message)
      } else {
        setMessage(`User ${newUser.employeeId.toUpperCase()} created successfully!`)
        setNewUser({ employeeId: '', fullName: '', role: 'viewer', password: '' })
        setShowAddUser(false)
        loadData()
      }
    } catch (err: any) {
      setMessage('Error: ' + err.message)
    }
    setCreating(false)
  }

  async function handleChangeRole(userId: string, newRole: string) {
    const { error } = await supabase.from('profiles').update({ role: newRole }).eq('id', userId)
    if (!error) loadData()
  }

  async function handleToggleActive(userId: string, currentActive: boolean) {
    const { error } = await supabase.from('profiles').update({ is_active: !currentActive }).eq('id', userId)
    if (!error) loadData()
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
      <Navbar profile={profile} activeTab="admin" />
      <main className="p-6 max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Admin Panel</h1>

        {/* Add User Section */}
        <div className="card mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-800">User Management</h2>
            <button onClick={() => setShowAddUser(!showAddUser)} className="btn-primary text-sm">
              {showAddUser ? 'Cancel' : '+ Add User'}
            </button>
          </div>

          {showAddUser && (
            <form onSubmit={handleCreateUser} className="bg-blue-50/50 rounded-xl p-4 mb-4 space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Employee ID</label>
                  <input
                    type="text"
                    className="input-field text-sm"
                    placeholder="e.g. CCD-1042"
                    value={newUser.employeeId}
                    onChange={(e) => setNewUser({ ...newUser, employeeId: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Full Name</label>
                  <input
                    type="text"
                    className="input-field text-sm"
                    placeholder="e.g. R. Kumar"
                    value={newUser.fullName}
                    onChange={(e) => setNewUser({ ...newUser, fullName: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Role</label>
                  <select
                    className="input-field text-sm"
                    value={newUser.role}
                    onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                  >
                    {ROLES.map(r => (
                      <option key={r} value={r}>{r.charAt(0).toUpperCase() + r.slice(1)}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Password</label>
                  <input
                    type="text"
                    className="input-field text-sm"
                    placeholder="Min 6 characters"
                    value={newUser.password}
                    onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                    required
                    minLength={6}
                  />
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button type="submit" className="btn-primary text-sm" disabled={creating}>
                  {creating ? 'Creating...' : 'Create User'}
                </button>
                {message && (
                  <span className={`text-sm ${message.includes('Error') ? 'text-red-600' : 'text-green-600'}`}>
                    {message}
                  </span>
                )}
              </div>
            </form>
          )}

          {/* Users Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="table-header">
                  <th className="px-4 py-3 text-left">Employee ID</th>
                  <th className="px-4 py-3 text-left">Name</th>
                  <th className="px-4 py-3 text-left">Role</th>
                  <th className="px-4 py-3 text-left">Status</th>
                  <th className="px-4 py-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id} className="border-b border-gray-100 hover:bg-blue-50/50">
                    <td className="px-4 py-3 font-medium">{u.employee_id}</td>
                    <td className="px-4 py-3">{u.full_name}</td>
                    <td className="px-4 py-3">
                      <select
                        className="px-2 py-1 rounded-lg text-xs font-medium bg-blue-50 border border-blue-200 text-blue-700"
                        value={u.role}
                        onChange={(e) => handleChangeRole(u.id, e.target.value)}
                      >
                        {ROLES.map(r => (
                          <option key={r} value={r}>{r.charAt(0).toUpperCase() + r.slice(1)}</option>
                        ))}
                      </select>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${u.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {u.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => handleToggleActive(u.id, u.is_active)}
                        className={`text-xs px-2 py-1 rounded-lg ${u.is_active ? 'bg-red-50 text-red-600 hover:bg-red-100' : 'bg-green-50 text-green-600 hover:bg-green-100'}`}
                      >
                        {u.is_active ? 'Deactivate' : 'Activate'}
                      </button>
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
                  <tr><td colSpan={6} className="px-4 py-8
