import React from 'react';
import { getStoredData, STORAGE_KEYS } from '../utils/storage';

export default function AdminDashboard() {
  const users = getStoredData(STORAGE_KEYS.USERS, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4 text-teal-300">Admin Dashboard</h1>
      <table className="w-full table-auto border-collapse">
        <thead>
          <tr className="bg-slate-800/70 text-slate-200">
            <th className="border border-slate-700 p-2 text-left">Email</th>
            <th className="border border-slate-700 p-2 text-left">Role</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u, idx) => (
            <tr key={idx} className="odd:bg-slate-900/50 even:bg-slate-800/50">
              <td className="border border-slate-700 p-2 text-slate-300">{u.email}</td>
              <td className="border border-slate-700 p-2 text-slate-300">{u.role}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
