import React, { useState } from 'react';
import { getStoredData, STORAGE_KEYS, exportFullDatabaseBackup, importDatabaseBackup, getLockInfo, setLockInfo } from '../utils/storage';
import { Shield, Users, Database, Download, Upload, KeyRound, CheckCircle2, AlertTriangle, RefreshCw } from 'lucide-react';

export default function AdminDashboard() {
  const users = getStoredData(STORAGE_KEYS.USERS, []);
  const patients = getStoredData(STORAGE_KEYS.PATIENTS, []);
  const appointments = getStoredData(STORAGE_KEYS.APPOINTMENTS, []);
  const [lockStatus, setLockStatus] = useState(getLockInfo());
  const [notice, setNotice] = useState('');

  const handleResetLock = () => {
    setLockInfo({ count: 0, lockedUntil: null });
    setLockStatus({ count: 0, lockedUntil: null });
    setNotice('Verrous de sécurité réinitialisés.');
    setTimeout(() => setNotice(''), 3000);
  };

  const handleFileImport = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const ok = importDatabaseBackup(event.target.result);
      if (ok) {
        setNotice('Sauvegarde restaurée avec succès !');
        setTimeout(() => window.location.reload(), 1200);
      } else {
        alert('Échec de la restauration : Fichier JSON invalide.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <Shield className="w-6 h-6 text-purple-400" />
            <span>Tableau de Bord Administration</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Gestion complète des utilisateurs, sécurité système et sauvegardes du cabinet.
          </p>
        </div>
        <span className="px-3 py-1 bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-bold rounded-xl flex items-center gap-1.5">
          <Shield className="w-3.5 h-3.5" />
          <span>Accès Administrateur Global</span>
        </span>
      </div>

      {notice && (
        <div className="p-4 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{notice}</span>
        </div>
      )}

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-400">Comptes Utilisateurs</p>
            <h3 className="text-2xl font-black text-white mt-1">{users.length}</h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
            <Users className="w-5 h-5" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-400">Fiches Patients</p>
            <h3 className="text-2xl font-black text-teal-400 mt-1">{patients.length}</h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400">
            <Database className="w-5 h-5" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-400">Rendez-vous Total</p>
            <h3 className="text-2xl font-black text-cyan-400 mt-1">{appointments.length}</h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
            <KeyRound className="w-5 h-5" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-400">Tentatives Échouées</p>
            <h3 className="text-2xl font-black text-rose-400 mt-1">{lockStatus.count || 0}</h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
            <AlertTriangle className="w-5 h-5" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* User Accounts Table */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="font-bold text-base text-white flex items-center gap-2">
              <Users className="w-4 h-4 text-purple-400" />
              <span>Utilisateurs du Système</span>
            </h3>
            <span className="text-[11px] text-slate-400">Comptes configurés</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400">
                  <th className="py-2.5 px-3 font-semibold">Identifiant / Email</th>
                  <th className="py-2.5 px-3 font-semibold">Rôle</th>
                  <th className="py-2.5 px-3 font-semibold">Statut</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {users.map((u, idx) => (
                  <tr key={idx} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-3 font-mono font-medium text-slate-200">{u.email}</td>
                    <td className="py-3 px-3">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        u.role === 'admin' 
                          ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                          : u.role === 'doctor'
                          ? 'bg-teal-500/20 text-teal-300 border border-teal-500/30'
                          : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                      }`}>
                        {u.role.toUpperCase()}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-emerald-400 font-semibold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      <span>Actif</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Administration Actions & Security */}
        <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-5">
          <div className="border-b border-slate-800 pb-3">
            <h3 className="font-bold text-base text-white flex items-center gap-2">
              <Database className="w-4 h-4 text-cyan-400" />
              <span>Actions Sauvegarde & Sécurité</span>
            </h3>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-300">Exporter Sauvegarde JSON</h4>
            <button
              type="button"
              onClick={exportFullDatabaseBackup}
              className="w-full py-2.5 bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/30 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all"
            >
              <Download className="w-4 h-4" />
              <span>Télécharger Sauvegarde</span>
            </button>
          </div>

          <div className="space-y-3 pt-3 border-t border-slate-800">
            <h4 className="text-xs font-bold text-slate-300">Restaurer Données</h4>
            <label className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-all">
              <Upload className="w-4 h-4 text-cyan-400" />
              <span>Choisir Fichier JSON</span>
              <input
                type="file"
                accept=".json"
                onChange={handleFileImport}
                className="hidden"
              />
            </label>
          </div>

          <div className="space-y-3 pt-3 border-t border-slate-800">
            <h4 className="text-xs font-bold text-slate-300">Réinitialiser Verrous Sécurité</h4>
            <button
              type="button"
              onClick={handleResetLock}
              className="w-full py-2.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/20 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Déverrouiller Tentatives</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
