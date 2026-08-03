import React from 'react';
import { Globe, Plus, Search, Calendar as CalendarIcon, ShieldCheck, UserCheck, Shield, Activity, Menu, X, LogOut } from 'lucide-react';
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
  setSearchQuery,
  isMobileMenuOpen,
  toggleMobileMenu
}) {
  const { auth, logout } = useAuth();
  const t = translations[lang];

  const currentDate = new Date().toLocaleDateString(lang === 'ar' ? 'ar-TN' : 'fr-TN', {
    weekday: 'short',
    month: 'short',
    day: 'numeric'
  });

  return (
    <header className="h-16 border-b border-slate-800 bg-slate-900/90 backdrop-blur-xl px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30">
      {/* Mobile Menu Hamburger Button & Search */}
      <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0 mr-2">
        <button
          onClick={toggleMobileMenu}
          className="md:hidden p-2 rounded-xl bg-slate-800/80 text-slate-200 border border-slate-700/80 hover:bg-slate-700 focus:outline-none"
          aria-label="Toggle navigation menu"
        >
          {isMobileMenuOpen ? <X className="w-5 h-5 text-teal-400" /> : <Menu className="w-5 h-5 text-teal-400" />}
        </button>

        {/* Search Input */}
        <div className="relative w-full max-w-xs md:max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            id="patient-search-input"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={`${t.patientSearchPlaceholder} (Ctrl+K)`}
            className="w-full pl-9 pr-3 py-1.5 sm:py-2 bg-slate-800/80 border border-slate-700/80 rounded-xl text-xs text-slate-200 placeholder-slate-400 focus:outline-none focus:border-teal-500 transition-all"
          />
        </div>
      </div>

      {/* Quick Action Buttons, Role Switcher & Language Toggle */}
      <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
        {/* Date Display */}
        <div className="hidden xl:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/60 border border-slate-700/50 text-xs text-slate-300">
          <CalendarIcon className="w-3.5 h-3.5 text-teal-400" />
          <span className="capitalize">{currentDate}</span>
        </div>

        {/* Current Role Badge */}
        <div className="flex items-center bg-slate-800 p-0.5 sm:p-1 rounded-xl border border-slate-700">
          <div className={`px-2 py-1 rounded-lg text-[10px] sm:text-[11px] font-bold flex items-center gap-1 ${
            userRole === 'doctor' ? 'bg-teal-600 text-white shadow' : userRole === 'admin' ? 'bg-purple-600 text-white shadow' : 'bg-cyan-600 text-white shadow'
          }`}>
            {userRole === 'doctor' 
              ? <><Shield className="w-3 h-3" /><span className="hidden sm:inline">Médecin</span></>
              : userRole === 'admin'
              ? <><Activity className="w-3 h-3" /><span className="hidden sm:inline">Admin</span></>
              : <><UserCheck className="w-3 h-3" /><span className="hidden sm:inline">Secrétaire</span></>
            }
          </div>
        </div>

        {/* Quick Launcher Buttons */}
        <div className="flex items-center gap-1 sm:gap-2">
          <button
            onClick={onOpenPatientModal}
            className="p-2 sm:px-3 sm:py-1.5 bg-teal-600 hover:bg-teal-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-teal-600/20 transition-all"
            title={t.btnNewPatient}
          >
            <Plus className="w-4 h-4 sm:w-3.5 sm:h-3.5" />
            <span className="hidden sm:inline">{t.btnNewPatient}</span>
          </button>
          
          <button
            onClick={onOpenApptModal}
            className="p-2 sm:px-3 sm:py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all"
            title={t.btnNewAppt}
          >
            <Plus className="w-4 h-4 sm:w-3.5 sm:h-3.5 text-teal-400" />
            <span className="hidden sm:inline">{t.btnNewAppt}</span>
          </button>

          {(userRole === 'doctor' || userRole === 'admin') && (
            <button
              onClick={onOpenPrescriptionModal}
              className="hidden lg:flex px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-teal-300 border border-teal-500/30 rounded-xl text-xs font-semibold items-center gap-1.5 transition-all"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
              <span>{t.btnNewPrescription}</span>
            </button>
          )}
        </div>

        {/* Language Switcher Toggle */}
        <button
          onClick={() => setLang(lang === 'fr' ? 'ar' : 'fr')}
          className="px-2 py-1.5 sm:px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-teal-300 border border-slate-700 text-xs font-bold flex items-center gap-1.5 transition-all"
          title="Basculer la langue"
        >
          <Globe className="w-3.5 h-3.5 text-cyan-400" />
          <span className="text-[11px]">{lang === 'fr' ? 'AR' : 'FR'}</span>
        </button>

        {/* Logout */}
        {auth?.user && (
          <button
            onClick={logout}
            className="p-2 sm:px-3 sm:py-1.5 rounded-xl bg-rose-600/80 hover:bg-rose-500 text-white text-xs font-bold flex items-center gap-1 transition-all"
            title="Déconnexion"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        )}
      </div>
    </header>
  );
}
