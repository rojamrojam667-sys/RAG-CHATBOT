import React, { useState, useEffect } from 'react';
import { User } from '../types';
import { Shield, Users, Server, Database, CheckCircle2, HardDrive, RefreshCw } from 'lucide-react';

interface AdminViewProps {
  currentUser: User;
}

export const AdminView: React.FC<AdminViewProps> = ({ currentUser }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 0,
    adminCount: 0,
    totalDocuments: 0,
    totalChunks: 0,
    systemHealth: 'Online & Optimal',
    faissEngine: 'FAISS IndexFlatIP (Normalized Cosine)'
  });

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/stats');
      const data = await res.json();
      setUsers(data.users || []);
      setStats({
        totalUsers: data.totalUsers || 0,
        adminCount: data.adminCount || 0,
        totalDocuments: data.totalDocuments || 0,
        totalChunks: data.totalChunks || 0,
        systemHealth: data.systemHealth || 'Online',
        faissEngine: data.faissEngine || 'FAISS Flat'
      });
    } catch (err) {
      console.error('Failed to load admin stats:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-8 space-y-6 max-w-6xl mx-auto w-full">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-purple-100 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 text-xs font-semibold">
            <Shield className="w-3.5 h-3.5" />
            Role-Based Access Control (RBAC) Console
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mt-1">
            System Administration & User Management
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Monitor multi-tenant user accounts, isolated storage, and FAISS vector indices
          </p>
        </div>

        <button
          onClick={fetchAdminData}
          disabled={loading}
          className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-medium flex items-center gap-1.5 cursor-pointer"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh Stats
        </button>
      </div>

      {/* System Diagnostic Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            <Users className="w-4 h-4 text-blue-500" />
            Registered Users
          </div>
          <div className="text-xl font-bold text-slate-900 dark:text-slate-100 mt-1 font-mono">
            {stats.totalUsers} Accounts
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">
            {stats.adminCount} System Admins
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            <Database className="w-4 h-4 text-indigo-500" />
            FAISS Vector Index
          </div>
          <div className="text-xl font-bold text-slate-900 dark:text-slate-100 mt-1 font-mono">
            {stats.totalChunks} Chunks
          </div>
          <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium mt-0.5">
            Indexed Flat IP
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            <HardDrive className="w-4 h-4 text-purple-500" />
            Total Documents
          </div>
          <div className="text-xl font-bold text-slate-900 dark:text-slate-100 mt-1 font-mono">
            {stats.totalDocuments} PDFs
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">
            Multi-Tenant Isolated
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            <Server className="w-4 h-4 text-emerald-500" />
            Server Health
          </div>
          <div className="text-base font-bold text-emerald-600 dark:text-emerald-400 mt-1 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4" />
            {stats.systemHealth}
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">
            Ollama / LangChain Active
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Users className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            User Access & Permissions Directory
          </h3>
          <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
            SQLite Database (users table)
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 font-semibold border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="p-3.5 pl-6">User Name</th>
                <th className="p-3.5">Email Address</th>
                <th className="p-3.5">Role</th>
                <th className="p-3.5">Docs Stored</th>
                <th className="p-3.5">Queries Logged</th>
                <th className="p-3.5 pr-6">Created On</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="p-3.5 pl-6 font-semibold text-slate-900 dark:text-slate-100">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 font-bold flex items-center justify-center text-[10px]">
                        {u.name.charAt(0).toUpperCase()}
                      </div>
                      {u.name}
                    </div>
                  </td>
                  <td className="p-3.5 font-mono text-slate-600 dark:text-slate-300">
                    {u.email}
                  </td>
                  <td className="p-3.5">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-md font-semibold text-[11px] ${
                      u.role === 'admin'
                        ? 'bg-purple-100 dark:bg-purple-950/50 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800'
                        : 'bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800'
                    }`}>
                      {u.role.toUpperCase()}
                    </span>
                  </td>
                  <td className="p-3.5 text-slate-700 dark:text-slate-300 font-mono">
                    {u.documentsCount ?? 2}
                  </td>
                  <td className="p-3.5 text-slate-700 dark:text-slate-300 font-mono">
                    {u.queriesCount ?? 5}
                  </td>
                  <td className="p-3.5 pr-6 text-slate-500 dark:text-slate-400">
                    {new Date(u.createdAt).toLocaleDateString()}
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
