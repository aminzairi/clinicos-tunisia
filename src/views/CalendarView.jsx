import React, { useState } from 'react';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  Plus, 
  CheckCircle2, 
  AlertCircle, 
  XCircle, 
  Send, 
  Edit3, 
  Trash2,
  Filter
} from 'lucide-react';
import { translations } from '../utils/translations';

export default function CalendarView({ 
  appointments, 
  lang, 
  onOpenAddAppt, 
  onEditAppt, 
  onDeleteAppt,
  onSendInstantReminder,
  onUpdateStatus
}) {
  const t = translations[lang];

  const [selectedStatusFilter, setSelectedStatusFilter] = useState('');
  const [selectedDateFilter, setSelectedDateFilter] = useState('');

  const filteredAppointments = appointments.filter(apt => {
    const matchesStatus = selectedStatusFilter ? apt.status === selectedStatusFilter : true;
    const matchesDate = selectedDateFilter ? apt.date === selectedDateFilter : true;
    return matchesStatus && matchesDate;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <CalendarIcon className="w-6 h-6 text-cyan-400" />
            <span>{t.navCalendar}</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Agenda interactif de la consultation, suivi des rendez-vous et relances automatiques.
          </p>
        </div>

        <button
          onClick={onOpenAddAppt}
          className="px-4 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-cyan-600/20 flex items-center gap-2 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>{t.btnAddAppt}</span>
        </button>
      </div>

      {/* Toolbar Filters */}
      <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400" />
            <select
              value={selectedStatusFilter}
              onChange={(e) => setSelectedStatusFilter(e.target.value)}
              className="px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
            >
              <option value="">{t.allStatuses}</option>
              <option value="confirmed">{t.statusConfirmed}</option>
              <option value="pending">{t.statusPending}</option>
              <option value="completed">{t.statusCompleted}</option>
              <option value="missed">{t.statusMissed}</option>
            </select>
          </div>

          <input
            type="date"
            value={selectedDateFilter}
            onChange={(e) => setSelectedDateFilter(e.target.value)}
            className="px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
          />

          {selectedDateFilter && (
            <button
              onClick={() => setSelectedDateFilter('')}
              className="text-xs text-cyan-400 hover:underline font-medium"
            >
              Effacer filtre date
            </button>
          )}
        </div>
      </div>

      {/* Appointments List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredAppointments.length === 0 ? (
          <div className="col-span-full p-12 text-center text-slate-400 bg-slate-900/90 rounded-2xl border border-slate-800 text-xs">
            Aucun rendez-vous ne correspond aux critères sélectionnés.
          </div>
        ) : (
          filteredAppointments.map(apt => (
            <div 
              key={apt.id}
              className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 transition-all space-y-4 shadow-lg flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold text-cyan-300 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-cyan-400" />
                    {apt.time} - {apt.date}
                  </span>

                  <select
                    value={apt.status}
                    onChange={(e) => onUpdateStatus(apt.id, e.target.value)}
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold border focus:outline-none bg-slate-900 ${
                      apt.status === 'confirmed'
                        ? 'text-emerald-400 border-emerald-500/30'
                        : apt.status === 'pending'
                        ? 'text-amber-400 border-amber-500/30'
                        : 'text-slate-400 border-slate-700'
                    }`}
                  >
                    <option value="confirmed">{t.statusConfirmed}</option>
                    <option value="pending">{t.statusPending}</option>
                    <option value="completed">{t.statusCompleted}</option>
                    <option value="missed">{t.statusMissed}</option>
                    <option value="cancelled">{t.statusCancelled}</option>
                  </select>
                </div>

                <h3 className="font-extrabold text-base text-white">{apt.patientName}</h3>
                <p className="text-xs text-teal-400 font-medium">{apt.phone}</p>
                <p className="text-xs text-slate-400 bg-slate-800/60 p-2.5 rounded-xl border border-slate-700/50">
                  {apt.reason || 'Consultation Spécialisée'}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                <button
                  onClick={() => onSendInstantReminder(apt)}
                  className="px-3 py-1.5 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Rappel WA</span>
                </button>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => onEditAppt(apt)}
                    className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDeleteAppt(apt.id)}
                    className="p-1.5 text-rose-400 hover:bg-rose-500/10 rounded-lg"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
