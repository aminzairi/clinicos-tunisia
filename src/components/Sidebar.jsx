import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  Calendar, 
  Bell, 
  FileText, 
  CreditCard, 
  Settings, 
  Activity,
  Heart,
  X
} from 'lucide-react';
import { translations } from '../utils/translations';

export default function Sidebar({ 
  activeTab, 
  setActiveTab, 
  lang, 
  clinicConfig, 
  userRole,
  isMobileMenuOpen,
  closeMobileMenu
}) {
  const t = translations[lang];

  const allMenuItems = [
    { id: 'dashboard', label: t.navDashboard, icon: LayoutDashboard, roles: ['doctor', 'secretary', 'admin'] },
    { id: 'patients', label: t.navPatients, icon: Users, roles: ['doctor', 'secretary', 'admin'] },
    { id: 'calendar', label: t.navCalendar, icon: Calendar, roles: ['doctor', 'secretary', 'admin'] },
    { id: 'reminders', label: t.navReminders, icon: Bell, badge: 'WhatsApp', roles: ['doctor', 'secretary', 'admin'] },
    { id: 'prescriptions', label: t.navPrescriptions, icon: FileText, badge: 'CNAM', roles: ['doctor', 'admin'] },
    { id: 'medical-records', label: lang === 'ar' ? 'السجلات الطبية' : 'Dossiers Médicaux', icon: Heart, roles: ['doctor', 'admin'] },
    { id: 'billing', label: t.navBilling, icon: CreditCard, roles: ['doctor', 'secretary', 'admin'] },
    { id: 'settings', label: t.navSettings, icon: Settings, roles: ['admin'] },
    { id: 'admin', label: 'Admin', icon: Activity, roles: ['admin'] },
  ];

  const menuItems = allMenuItems.filter(item => item.roles.includes(userRole));

  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
    if (closeMobileMenu) closeMobileMenu();
  };

  const navContent = (
    <div className="flex flex-col justify-between h-full">
      <div>
        {/* Brand Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-500 to-cyan-400 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-teal-500/20">
              <Activity className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <h1 className="font-extrabold text-lg text-white tracking-tight leading-none flex items-center gap-1.5">
                Clinic<span className="text-teal-400">OS</span>
                <span className="text-xs px-1.5 py-0.5 rounded bg-teal-500/10 text-teal-300 font-semibold border border-teal-500/20">TN</span>
              </h1>
              <p className="text-[11px] text-slate-400 mt-1 font-medium">{t.appSubtitle}</p>
            </div>
          </div>

          {/* Close button for mobile drawer */}
          <button
            onClick={closeMobileMenu}
            className="md:hidden p-1.5 rounded-lg text-slate-400 hover:text-white bg-slate-800/60"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Menu */}
        <nav className="p-4 space-y-1 overflow-y-auto max-h-[calc(100vh-180px)]">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleTabClick(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl font-medium text-sm transition-all duration-150 ${
                  isActive
                    ? 'bg-teal-500/15 text-teal-300 border border-teal-500/30 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-5 h-5 ${isActive ? 'text-teal-400' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Doctor Info Footer Card */}
      <div className="p-4 border-t border-slate-800/80 bg-slate-900/50">
        <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-700/50 flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30 flex items-center justify-center font-bold text-sm shrink-0">
            {clinicConfig.doctorName ? clinicConfig.doctorName.charAt(4) : 'D'}
          </div>
          <div className="overflow-hidden">
            <h4 className="text-xs font-bold text-slate-200 truncate">{clinicConfig.doctorName || t.doctorTitle}</h4>
            <p className="text-[11px] text-teal-400 font-medium truncate">CNAM: {clinicConfig.codeCNAM}</p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 bg-slate-900 border-r border-slate-800 flex-col justify-between shrink-0 h-screen sticky top-0 z-20">
        {navContent}
      </aside>

      {/* Mobile Drawer Slide-Over */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity"
            onClick={closeMobileMenu}
          />

          {/* Sliding Panel */}
          <div className="relative w-4/5 max-w-xs bg-slate-900 border-r border-slate-800 h-full shadow-2xl z-10 flex flex-col animate-in slide-in-from-left duration-200">
            {navContent}
          </div>
        </div>
      )}

      {/* Mobile Bottom Quick Navigation Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-900/95 backdrop-blur-xl border-t border-slate-800 px-2 py-1.5 flex justify-around items-center">
        {menuItems.slice(0, 5).map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleTabClick(item.id)}
              className={`flex flex-col items-center py-1 px-2 rounded-xl transition-all ${
                isActive ? 'text-teal-400' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px] font-semibold mt-0.5 truncate max-w-[60px]">{item.label}</span>
            </button>
          );
        })}
      </div>
    </>
  );
}
