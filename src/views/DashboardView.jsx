import React from 'react';
import { 
  Users, 
  Calendar, 
  Bell, 
  CreditCard, 
  Plus, 
  ArrowUpRight, 
  Clock, 
  Send, 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle 
} from 'lucide-react';
import { translations } from '../utils/translations';

export default function DashboardView({ 
  patients, 
  appointments, 
  reminders, 
  invoices, 
  lang,
  onOpenPatientModal,
  onOpenApptModal,
  onOpenPrescriptionModal,
  onOpenInvoiceModal,
  onSendInstantReminder,
  onSelectTab
}) {
  const t = translations[lang];

  // Calculate metrics
  const totalPatientsCount = patients.length;
  const todayStr = new Date().toISOString().split('T')[0];
  const todayAppts = appointments.filter(a => a.date === todayStr);
  const pendingRemindersCount = appointments.filter(a => a.status === 'confirmed' || a.status === 'pending').length;
  
  const totalRevenue = invoices.reduce((acc, curr) => curr.paymentStatus === 'paid' ? acc + curr.amount : acc, 0);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Banner / Welcome */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-teal-900/60 via-slate-900 to-slate-900 border border-teal-500/20 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <span>{t.appTitle}</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-300 font-bold border border-teal-500/30">
              Cabinet Actif
            </span>
          </h2>
          <p className="text-xs text-slate-300 mt-1">
            Système prêt pour le travail quotidien du médecin en Tunisie. CNAM, Rappels WhatsApp & Facturation TND.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenPatientModal}
            className="px-3.5 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-teal-600/20 transition-all flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>{t.btnNewPatient}</span>
          </button>
          <button
            onClick={onOpenPrescriptionModal}
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-teal-300 border border-teal-500/30 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5"
          >
            <ShieldCheck className="w-4 h-4 text-cyan-400" />
            <span>{t.btnNewPrescription}</span>
          </button>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Patients */}
        <div 
          onClick={() => onSelectTab('patients')}
          className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-teal-500/40 cursor-pointer transition-all hover:shadow-xl group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400">{t.metricTotalPatients}</span>
            <div className="w-9 h-9 rounded-xl bg-teal-500/10 text-teal-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-2xl font-black text-white">{totalPatientsCount}</span>
            <span className="text-[11px] font-semibold text-teal-400 flex items-center gap-0.5">
              Fiches enregistrées <ArrowUpRight className="w-3 h-3" />
            </span>
          </div>
        </div>

        {/* Card 2: Today's Appointments */}
        <div 
          onClick={() => onSelectTab('calendar')}
          className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-cyan-500/40 cursor-pointer transition-all hover:shadow-xl group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400">{t.metricTodayAppts}</span>
            <div className="w-9 h-9 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Calendar className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-2xl font-black text-white">{todayAppts.length}</span>
            <span className="text-[11px] font-semibold text-cyan-400 flex items-center gap-0.5">
              Agenda du jour <ArrowUpRight className="w-3 h-3" />
            </span>
          </div>
        </div>

        {/* Card 3: Pending Reminders */}
        <div 
          onClick={() => onSelectTab('reminders')}
          className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-amber-500/40 cursor-pointer transition-all hover:shadow-xl group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400">{t.metricPendingReminders}</span>
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Bell className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-2xl font-black text-white">{pendingRemindersCount}</span>
            <span className="text-[11px] font-semibold text-amber-400 flex items-center gap-0.5">
              WhatsApp / SMS <ArrowUpRight className="w-3 h-3" />
            </span>
          </div>
        </div>

        {/* Card 4: Revenue in TND */}
        <div 
          onClick={() => onSelectTab('billing')}
          className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-emerald-500/40 cursor-pointer transition-all hover:shadow-xl group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400">{t.metricMonthlyRevenue}</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <CreditCard className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-2xl font-black text-emerald-400">{totalRevenue} <span className="text-xs">DT</span></span>
            <span className="text-[11px] font-semibold text-emerald-400 flex items-center gap-0.5">
              Encaissé (TND) <ArrowUpRight className="w-3 h-3" />
            </span>
          </div>
        </div>
      </div>

      {/* Main Grid: Today's Schedule & Recent Patients */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Appointments List (2 columns) */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="font-bold text-base text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-teal-400" />
              {t.todayScheduleTitle}
            </h3>
            <button
              onClick={onOpenApptModal}
              className="text-xs font-bold text-teal-400 hover:text-teal-300 flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              {t.btnNewAppt}
            </button>
          </div>

          {todayAppts.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-xs">
              {t.noApptsToday}
            </div>
          ) : (
            <div className="space-y-3">
              {todayAppts.map(apt => (
                <div 
                  key={apt.id}
                  className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-slate-800 border border-slate-700 flex flex-col items-center justify-center text-center shrink-0">
                      <span className="text-xs font-bold text-teal-300">{apt.time}</span>
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-slate-100">{apt.patientName}</h4>
                      <p className="text-xs text-slate-400 mt-0.5">{apt.reason || 'Consultation'}</p>
                      <p className="text-[11px] text-teal-400 font-medium mt-0.5">{apt.phone}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                    <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold border ${
                      apt.status === 'confirmed'
                        ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                        : apt.status === 'pending'
                        ? 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                        : 'bg-slate-800 text-slate-400 border-slate-700'
                    }`}>
                      {apt.status === 'confirmed' ? t.statusConfirmed : apt.status === 'pending' ? t.statusPending : apt.status}
                    </span>

                    <button
                      onClick={() => onSendInstantReminder(apt)}
                      className="px-3 py-1.5 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all"
                      title="Envoyer un rappel immédiat via WhatsApp"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Rappel WA</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Patients Side Panel */}
        <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="font-bold text-base text-white flex items-center gap-2">
              <Users className="w-4 h-4 text-cyan-400" />
              {t.recentPatientsTitle}
            </h3>
          </div>

          <div className="space-y-3">
            {patients.slice(0, 4).map(pat => (
              <div key={pat.id} className="p-3 rounded-xl bg-slate-800/40 border border-slate-700/50 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-xs text-slate-200">{pat.fullName}</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">CIN: {pat.cin || 'Non renseigné'}</p>
                  <p className="text-[11px] text-teal-400 font-medium">{pat.phone}</p>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-teal-500/10 text-teal-300 border border-teal-500/20">
                  {pat.bloodGroup || 'A+'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
