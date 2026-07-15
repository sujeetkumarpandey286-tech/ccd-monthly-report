'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'
import Navbar from '@/components/Navbar'
import { useRouter } from 'next/navigation'

const supabase = createClient(
  'https://hwafhyotnviacdzsdzsv.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh3YWZoeW90bnZpYWNkenNkenN2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQwODg5NzIsImV4cCI6MjA5OTY2NDk3Mn0.1ibzOXApTZA_P9T6kiq7ayf85KmxNd91XeP6f7SdyGc'
)

const MONTHS = ['Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec','Jan','Feb','Mar']
const FISCAL_YEAR = '2025-26'

const ROLE_COLORS: Record<string, string> = {
  production: 'bg-indigo-50 text-indigo-700',
  quality: 'bg-amber-50 text-amber-700',
  environment: 'bg-teal-50 text-teal-700',
  safety: 'bg-rose-50 text-rose-700',
  viewer: 'bg-purple-50 text-purple-700',
  admin: 'bg-slate-800 text-white',
}

const ROLE_SECTIONS: Record<string, string> = {
  production: 'Production, Consumption, Despatch, Stock, Running Hours, Receipt',
  quality: 'Techno-Eco, Product Quality, Product Yield, Lab Analysis',
  environment: 'Environment BOD, ISO Objectives',
  safety: 'OHSAS Objectives',
  viewer: 'None (view all)',
  admin: 'All sections (incl. past months)',
}

export default function AdminPage() {
  const [profile, setProfile] = useState<any>(null)
  const [users, setUsers] = useState<any[]>([])
  const [auditLog, setAuditLog] = useState<any[]>([])
  const [showAddUser, setShowAddUser] = useState(false)
  const [newUser, setNewUser] = useState({ email: '', full_name: '', role: 'viewer', password: '' })
  const [creating, setCreating] = useState(false)
  const [passwordModal, setPasswordModal] = useState<{ userId: string; name: string } | null>(null)
  const [newPassword, setNewPassword] = useState('')
  const [changingPwd, setChangingPwd] = useState(false)
  const [message, setMessage] = useState('')
  const router = useRouter()

  useEffect(() => { loadAll() }, [])

  async function loadAll() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push('/'); return }

    const { data: prof } = await supabase.from('profiles').select('*').eq('id', user.id).single()
    if (prof?.role !== 'admin') { router.push('/entry'); return }
    setProfile(prof)

    const { data: allUsers } = await supabase.from('profiles').select('*').order('full_name')
    setUsers(allUsers || [])

    const { data: log } = await supabase
      .from('audit_log')
      .select('*, profiles(full_name)')
      .order('created_at', { ascending: false })
      .limit(50)
    setAuditLog(log || [])
  }

  async function handleAddUser(e: React.FormEvent) {
    e.preventDefault()
    setCreating(true)
    setMessage('')

    try {
      // Sign up via Supabase auth
      const res = await fetch('https://hwafhyotnviacdzsdzsv.supabase.co/auth/v1/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh3YWZoeW90bnZpYWNkenNkenN2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQwODg5NzIsImV4cCI6MjA5OTY2NDk3Mn0.1ibzOXApTZA_P9T6kiq7ayf85KmxNd91XeP6f7SdyGc',
        },
        body: JSON.stringify({ email: newUser.email, password: newUser.password }),
      })
      const authData = await res.json()

      if (!res.ok || (!authData.id && !authData.user?.id)) {
        setMessage('Error creating auth user: ' + (authData.msg || authData.error_description || JSON.stringify(authData)))
        setCreating(false)
        return
      }

      const userId = authData.user?.id || authData.id

      // Create profile
      const { error: profErr } = await supabase.from('profiles').insert({
        id: userId,
        employee_id: newUser.email,
        full_name: newUser.full_name,
        role: newUser.role,
        is_active: true,
      })

      if (profErr) {
        setMessage('Error creating profile: ' + profErr.message)
        setCreating(false)
        return
      }

      setMessage('User "' + newUser.full_name + '" created successfully!')
      setShowAddUser(false)
      setNewUser({ email: '', full_name: '', role: 'viewer', password: '' })
      loadAll()
    } catch (err: any) {
      setMessage('Error: ' + err.message)
    }
    setCreating(false)
  }

  async function toggleUserActive(userId: string, currentState: boolean) {
    await supabase.from('profiles').update({ is_active: !currentState }).eq('id', userId)
    setMessage(currentState ? 'User deactivated' : 'User activated')
    loadAll()
  }

  async function changeRole(userId: string, newRole: string) {
    await supabase.from('profiles').update({ role: newRole }).eq('id', userId)
    await supabase.from('audit_log').insert({
      user_id: profile!.id,
      action: 'role_change',
      table_name: 'profiles',
      fiscal_year: FISCAL_YEAR,
      month_index: 0,
      field_name: 'role',
      new_value: newRole,
      reason: 'Role changed for user ' + userId,
    })
    setMessage('Role updated')
    loadAll()
  }

  async function handleChangePassword(e: React.FormEvent) {
    e.preventDefault()
    if (!passwordModal) return
    setChangingPwd(true)

    try {
      // Use Supabase admin API to update password
      const res = await fetch('https://hwafhyotnviacdzsdzsv.supabase.co/auth/v1/admin/users/' + passwordModal.userId, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh3YWZoeW90bnZpYWNkenNkenN2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQwODg5NzIsImV4cCI6MjA5OTY2NDk3Mn0.1ibzOXApTZA_P9T6kiq7ayf85KmxNd91XeP6f7SdyGc',
          'Authorization': 'Bearer ' + (await supabase.auth.getSession()).data.session?.access_token,
        },
        body: JSON.stringify({ password: newPassword }),
      })

      if (res.ok) {
        setMessage('Password changed for ' + passwordModal.name)
        setPasswordModal(null)
        setNewPassword('')
      } else {
        const err = await res.json()
        setMessage('Error: ' + (err.msg || err.message || 'Failed to change password'))
      }
    } catch (err: any) {
      setMessage('Error: ' + err.message)
    }
    setChangingPwd(false)
  }

  if (!profile) return <div className="min-h-screen flex items-center justify-center text-sm text-slate-500">Loading...</div>

  return (
    <div className="min-h-screen">
      <Navbar profile={profile} activeTab="admin" />
      <main className="p-6 max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Admin Panel</h1>
        <p className="text-sm text-gray-500 mb-6">Manage users, roles, passwords, and view audit trail.</p>

        {message && (
          <div className={`mb-4 px-4 py-2 rounded-lg text-sm font-medium ${message.startsWith('Error') ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>
            {message}
            <button onClick={() => setMessage('')} className="ml-3 text-xs opacity-70 hover:opacity-100">dismiss</button>
          </div>
        )}

        {/* Add User */}
        <div className="card mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Users ({users.length})</h2>
            <button onClick={() => setShowAddUser(!showAddUser)} className="btn-primary text-sm px-4 py-2">
              {showAddUser ? 'Cancel' : '+ Add User'}
            </button>
          </div>

          {showAddUser && (
            <form onSubmit={handleAddUser} className="bg-gray-50 rounded-xl p-4 mb-4 grid grid-cols-1 md:grid-cols-5 gap-3 items-end">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Email (Login ID)</label>
                <input value={newUser.email} onChange={e => setNewUser({...newUser, email: e.target.value})}
                       className="input-field" placeholder="user@email.com" required type="email" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Full Name</label>
                <input value={newUser.full_name} onChange={e => setNewUser({...newUser, full_name: e.target.value})}
                       className="input-field" placeholder="Full Name" required />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Role</label>
                <select value={newUser.role} onChange={e => setNewUser({...newUser, role: e.target.value})}
                        className="input-field">
                  <option value="production">Production</option>
                  <option value="quality">Quality</option>
                  <option value="environment">Environment</option>
                  <option value="safety">Safety</option>
                  <option value="viewer">Viewer</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Password</label>
                <input type="password" value={newUser.password} onChange={e => setNewUser({...newUser, password: e.target.value})}
                       className="input-field" placeholder="Min 6 chars" required minLength={6} />
              </div>
              <button type="submit" disabled={creating} className="btn-primary text-sm">
                {creating ? 'Creating...' : 'Create'}
              </button>
            </form>
          )}

          {/* Users Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="px-3 py-2 text-left text-xs font-semibold text-gray-500">Name</th>
                  <th className="px-3 py-2 text-left text-xs font-semibold text-gray-500">Email / ID</th>
                  <th className="px-3 py-2 text-left text-xs font-semibold text-gray-500">Role</th>
                  <th className="px-3 py-2 text-left text-xs font-semibold text-gray-500">Can Edit</th>
                  <th className="px-3 py-2 text-center text-xs font-semibold text-gray-500">Status</th>
                  <th className="px-3 py-2 text-center text-xs font-semibold text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="px-3 py-2.5 font-medium text-gray-800">{u.full_name}</td>
                    <td className="px-3 py-2.5 text-gray-500 text-xs">{u.employee_id}</td>
                    <td className="px-3 py-2.5">
                      <select
                        value={u.role}
                        onChange={(e) => changeRole(u.id, e.target.value)}
                        className={`text-xs font-bold px-2 py-1 rounded-md border-0 cursor-pointer ${ROLE_COLORS[u.role] || ''}`}
                      >
                        <option value="production">Production</option>
                        <option value="quality">Quality</option>
                        <option value="environment">Environment</option>
                        <option value="safety">Safety</option>
                        <option value="viewer">Viewer</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>
                    <td className="px-3 py-2.5 text-xs text-gray-500">{ROLE_SECTIONS[u.role] || ''}</td>
                    <td className="px-3 py-2.5 text-center">
                      <button onClick={() => toggleUserActive(u.id, u.is_active)}
                              className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                                u.is_active ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'
                              }`}>
                        {u.is_active ? 'Active' : 'Disabled'}
                      </button>
                    </td>
                    <td className="px-3 py-2.5 text-center">
                      <button
                        onClick={() => { setPasswordModal({ userId: u.id, name: u.full_name }); setNewPassword('') }}
                        className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                      >
                        Reset Pwd
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Password Change Modal */}
        {passwordModal && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-sm shadow-xl">
              <h3 className="text-lg font-bold text-gray-800 mb-2">Reset Password</h3>
              <p className="text-sm text-gray-500 mb-4">Set new password for <strong>{passwordModal.name}</strong></p>
              <form onSubmit={handleChangePassword}>
                <input
                  type="password"
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  className="input-field mb-4"
                  placeholder="New password (min 6 chars)"
                  required
                  minLength={6}
                />
                <div className="flex gap-3">
                  <button type="submit" disabled={changingPwd} className="btn-primary flex-1">
                    {changingPwd ? 'Changing...' : 'Change Password'}
                  </button>
                  <button type="button" onClick={() => setPasswordModal(null)} className="btn-secondary flex-1">
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Audit Trail */}
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Audit Trail (Latest 50)</h2>
          {auditLog.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-6">No audit entries yet</p>
          ) : (
            <div className="space-y-0 max-h-96 overflow-y-auto">
              {auditLog.map(entry => (
                <div key={entry.id} className="flex items-start gap-4 py-3 border-b border-gray-100 last:border-0">
                  <span className="text-xs text-gray-400 font-medium min-w-[100px]">
                    {new Date(entry.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                    {' '}
                    {new Date(entry.created_at).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                  <div className="flex-1 text-xs">
                    <strong className="text-gray-800">{entry.profiles?.full_name || 'Admin'}</strong>
                    {' '}
                    <span className="text-gray-600">
                      {entry.action === 'override' && <>overrode <em>{entry.field_name}</em> in {entry.table_name} ({MONTHS[entry.month_index - 1]})</>}
                      {entry.action === 'unlock' && <>unlocked {MONTHS[entry.month_index - 1]} for re-editing</>}
                      {entry.action === 'lock' && <>locked {MONTHS[entry.month_index - 1]}</>}
                      {entry.action === 'role_change' && <>changed role to <strong>{entry.new_value}</strong></>}
                    </span>
                    {entry.old_value && (
                      <span className="ml-2">
                        <span className="line-through text-red-500">{entry.old_value}</span>
                        {' → '}
                        <span className="text-green-600 font-bold">{entry.new_value}</span>
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
