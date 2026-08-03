import React from 'react';
import { Globe, Plus, Search, Calendar as CalendarIcon, ShieldCheck, UserCheck, Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { translations } from '../utils/translations';

export default function Header({ 
  lang, 
  setLang, 
  userRole,
  onOpenPatientModal, 
  onOpenApptModal, 
  onOpenPrescriptionModal, 
  onOpenInvoiceModal,
  searchQuery,
  setSearchQuery
}) {
  const { auth, logout } = useAuth();
  const t = translations[lang];

  const currentDate = new Date().toLocaleDateString(lang === 'ar' ? 'ar-TN' : 'fr-TN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <header className="h-16 border-b border-slate-800 bg-slate-900/80 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-30">
      {/* Search Input */}
      <div className="flex items-center gap-3 w-80">
        <div className="relative w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            id="patient-search-input"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={`${t.patientSearchPlaceholder} (Ctrl+K)`}
            className="w-full pl-9 pr-4 py-2 bg-slate-800/80 border border-slate-700/80 rounded-xl text-xs text-slate-200 placeholder-slate-400 focus:outline-none focus:border-teal-500 transition-colors"
          />
        </div>
      </div>

      {/* Quick Action Buttons, Role Switcher & Language Toggle */}
      <div className="flex items-center gap-3">
        {/* Date Display */}
        <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/60 border border-slate-700/50 text-xs text-slate-300">
          <CalendarIcon className="w-3.5 h-3.5 text-teal-400" />
          <span className="capitalize">{currentDate}</span>
        </div>

        {/* Current Role Badge (read-only, set by login) */}
        <div className="flex items-center bg-slate-800 p-1 rounded-xl border border-slate-700">
          <div className={`px-2.5 py-1 rounded-lg text-[11px] font-bold flex items-center gap-1 ${
            userRole === 'doctor' ? 'bg-teal-600 text-white shadow' : 'bg-cyan-600 text-white shadow'
          }`}>
            {userRole === 'doctor' 
              ? <><Shield className="w-3 h-3" /><span>Médecin</span></>
              : <><UserCheck className="w-3 h-3" /><span>Secrétaire</span></>
            }
          </div>
        </div>

        {/* Quick Launcher Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenPatientModal}
            className="px-3 py-1.5 bg-teal-600 hover:bg-teal-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-teal-600/20 transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{t.btnNewPatient}</span>
          </button>
          
          <button
            onClick={onOpenApptModal}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all"
          >
            <Plus className="w-3.5 h-3.5 text-teal-400" />
            <span>{t.btnNewAppt}</span>
          </button>

          {userRole === 'doctor' && (
            <button
              onClick={onOpenPrescriptionModal}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-teal-300 border border-teal-500/30 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
              <span>{t.btnNewPrescription}</span>
            </button>
          )}
        </div>

        {/* Language Switcher Toggle */}
        <button
          onClick={() => setLang(lang === 'fr' ? 'ar' : 'fr')}
          className="ml-1 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-teal-300 border border-slate-700 text-xs font-bold flex items-center gap-2 transition-all"
          title="Basculer entre Français et Arabe"
        >
          <Globe className="w-4 h-4 text-cyan-400" />
          <span>{lang === 'fr' ? 'العربية' : 'Français'}</span>
        </button>

        {/* Logout */}
        {auth?.user && (
          <button
            onClick={logout}
            className="ml-1 px-3 py-1.5 rounded-xl bg-red-600/80 hover:bg-red-500 text-white text-xs font-bold flex items-center gap-1.5 transition-all"
            title="Déconnexion"
          >
            Logout
          </button>
        )}
      </div>
    </header>
  );
}
