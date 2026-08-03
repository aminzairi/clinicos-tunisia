import React, { useState, useEffect } from 'react';
import { X, Calendar, Clock, User, FileText, Send } from 'lucide-react';
import { translations } from '../utils/translations';

export default function AppointmentModal({ 
  isOpen, 
  onClose, 
  onSave, 
  patients, 
  apptToEdit, 
  lang,
  onSendInstantReminder 
}) {
  const t = translations[lang];

  const [formData, setFormData] = useState({
    patientId: '',
    patientName: '',
    phone: '',
    date: new Date().toISOString().split('T')[0],
    time: '09:00',
    reason: '',
    status: 'confirmed'
  });

  useEffect(() => {
    if (apptToEdit) {
      setFormData(apptToEdit);
    } else {
      const firstPat = patients[0] || {};
      setFormData({
        patientId: firstPat.id || '',
        patientName: firstPat.fullName || '',
        phone: firstPat.phone || '',
        date: new Date().toISOString().split('T')[0],
        time: '10:00',
        reason: 'Consultation Générale / Suivi',
        status: 'confirmed'
      });
    }
  }, [apptToEdit, isOpen, patients]);

  if (!isOpen) return null;

  const handlePatientChange = (patId) => {
    const selected = patients.find(p => p.id === patId);
    if (selected) {
      setFormData({
        ...formData,
        patientId: selected.id,
        patientName: selected.fullName,
        phone: selected.phone
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.patientName) return;
    onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-800/40">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-300 flex items-center justify-center font-bold">
              <Calendar className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-base text-slate-100">{t.apptModalTitle}</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Patient Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-teal-400" />
              {t.labelSelectPatient} *
            </label>
            <select
              value={formData.patientId}
              onChange={(e) => handlePatientChange(e.target.value)}
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-teal-500"
            >
              {patients.map(p => (
                <option key={p.id} value={p.id}>{p.fullName} ({p.phone})</option>
              ))}
            </select>
          </div>

          {/* Date & Time */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-teal-400" />
                {t.labelApptDate} *
              </label>
              <input
                type="date"
                required
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-teal-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-teal-400" />
                {t.labelApptTime} *
              </label>
              <input
                type="time"
                required
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-teal-500"
              />
            </div>
          </div>

          {/* Reason */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-teal-400" />
              {t.labelApptReason}
            </label>
            <input
              type="text"
              value={formData.reason}
              onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
              placeholder="ex: Consultation Suivi, Échographie, Contrôle..."
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-teal-500"
            />
          </div>

          {/* Status */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">{t.labelApptStatus}</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-teal-500"
            >
              <option value="confirmed">{t.statusConfirmed}</option>
              <option value="pending">{t.statusPending}</option>
              <option value="completed">{t.statusCompleted}</option>
              <option value="missed">{t.statusMissed}</option>
              <option value="cancelled">{t.statusCancelled}</option>
            </select>
          </div>

          {/* Actions & Instant Reminder button */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
            {onSendInstantReminder ? (
              <button
                type="button"
                onClick={() => onSendInstantReminder(formData)}
                className="px-3 py-2 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 rounded-xl text-xs font-semibold flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{t.sendReminderNow}</span>
              </button>
            ) : <div />}

            <div className="flex gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold"
              >
                {t.btnCancel}
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-cyan-600/20"
              >
                {t.btnSave}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
