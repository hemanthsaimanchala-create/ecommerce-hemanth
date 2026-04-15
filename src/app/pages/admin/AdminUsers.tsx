import { useEffect, useState } from 'react';
import { Mail, Shield, User, Users as UsersIcon } from 'lucide-react';
import { api } from '../../lib/api';
import type { User as AppUser } from '../../types';

export const AdminUsers = () => {
  const [users, setUsers] = useState<AppUser[]>([]);

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const response = await api.admin.users();
        setUsers(response.users);
      } catch {
        setUsers([]);
      }
    };

    void loadUsers();
  }, []);

  const handleToggleRole = async (user: AppUser) => {
    const nextRole = user.role === 'admin' ? 'user' : 'admin';
    try {
      const response = await api.admin.updateUser(user.id, { role: nextRole });
      setUsers((current) => current.map((entry) => (entry.id === user.id ? response.user : entry)));
    } catch {
      // Keep the current UI state if the request fails.
    }
  };

  const handleToggleStatus = async (user: AppUser) => {
    const nextStatus = user.status === 'active' ? 'inactive' : 'active';
    try {
      const response = await api.admin.updateUser(user.id, { status: nextStatus });
      setUsers((current) => current.map((entry) => (entry.id === user.id ? response.user : entry)));
    } catch {
      // Keep the current UI state if the request fails.
    }
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-serif text-emerald-950 mb-2">Users</h1>
        <p className="text-neutral-600">View registered customers and manage access levels.</p>
      </div>

      <div className="grid sm:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
              <UsersIcon className="w-6 h-6 text-emerald-700" />
            </div>
            <div>
              <p className="text-2xl font-semibold text-neutral-900">{users.length}</p>
              <p className="text-sm text-neutral-600">Total Users</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <User className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-semibold text-neutral-900">
                {users.filter((entry) => entry.role === 'user').length}
              </p>
              <p className="text-sm text-neutral-600">Regular Users</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Shield className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-semibold text-neutral-900">
                {users.filter((entry) => entry.role === 'admin').length}
              </p>
              <p className="text-sm text-neutral-600">Administrators</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-neutral-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Registered</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-neutral-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-neutral-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                        <span className="font-medium text-emerald-700">{user.name.charAt(0)}</span>
                      </div>
                      <p className="font-medium text-neutral-900">{user.name}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-neutral-600">
                      <Mail className="w-4 h-4" />
                      <span>{user.email}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {user.role === 'admin' ? (
                      <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded flex items-center gap-1 w-fit">
                        <Shield className="w-3 h-3" />
                        Admin
                      </span>
                    ) : (
                      <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded flex items-center gap-1 w-fit">
                        <User className="w-3 h-3" />
                        User
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-neutral-900">{new Date(user.registeredDate).toLocaleDateString()}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 text-xs rounded ${
                        user.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => handleToggleRole(user)}
                        className="px-3 py-1 text-sm text-emerald-700 hover:bg-emerald-50 rounded transition"
                      >
                        Change Role
                      </button>
                      <button
                        onClick={() => handleToggleStatus(user)}
                        className="px-3 py-1 text-sm text-neutral-600 hover:bg-neutral-100 rounded transition"
                      >
                        {user.status === 'active' ? 'Deactivate' : 'Activate'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
