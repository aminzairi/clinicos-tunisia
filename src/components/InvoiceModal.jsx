import React, { useState, useEffect } from 'react';
import { X, CreditCard, DollarSign, Printer, User } from 'lucide-react';
import { translations } from '../utils/translations';
import { printInvoice } from '../utils/printTemplates';

export default function InvoiceModal({ 
  isOpen, 
  onClose, 
  onSave, 
  patients, 
  clinicConfig, 
  lang 
}) {
  const t = translations[lang];

  const [formData, setFormData] = useState({
    id: `inv-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
    patientId: '',
    patientName: '',
    date: new Date().toISOString().split('T')[0],
    description: 'Consultation Cardiologie Spécialisée',
    amount: 60,
    paymentStatus: 'paid',
    paymentMethod: 'cash'
  });

  useEffect(() => {
    if (patients && patients.length > 0) {
      const first = patients[0];
      setFormData(prev => ({
        ...prev,
        patientId: first.id,
        patientName: first.fullName
      }));
    }
  }, [patients, isOpen]);

  if (!isOpen) return null;

  const handlePatientSelect = (patId) => {
    const p = patients.find(pat => pat.id === patId);
    if (p) {
      setFormData({
        ...formData,
        patientId: p.id,
        patientName: p.fullName
      });
    }
  };

  const handleConsultationPreset = (desc, price) => {
    setFormData({
      ...formData,
      description: desc,
      amount: price
    });
  };

  const handlePrint = () => {
    printInvoice(formData, clinicConfig);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.patientName) return;
    onSave(formData);
    handlePrint();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-800/40">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-300 flex items-center justify-center font-bold">
              <CreditCard className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-base text-slate-100">{t.invoiceModalTitle}</h3>
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
              onChange={(e) => handlePatientSelect(e.target.value)}
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-teal-500"
            >
              {patients.map(p => (
                <option key={p.id} value={p.id}>{p.fullName} ({p.phone})</option>
              ))}
            </select>
          </div>

          {/* Consultation Presets */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">{t.labelConsultationType}</label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleConsultationPreset('Consultation Spécialisée', 60)}
                className="px-2 py-1.5 bg-slate-800 hover:bg-slate-700 text-[11px] text-slate-200 border border-slate-700 rounded-lg text-center font-medium"
              >
                Simple (60 DT)
              </button>
              <button
                type="button"
                onClick={() => handleConsultationPreset('Échographie & ECG Spécialisé', 110)}
                className="px-2 py-1.5 bg-slate-800 hover:bg-slate-700 text-[11px] text-slate-200 border border-slate-700 rounded-lg text-center font-medium"
              >
                ECG / Echo (110 DT)
              </button>
              <button
                type="button"
                onClick={() => handleConsultationPreset('Visite de Contrôle', 30)}
                className="px-2 py-1.5 bg-slate-800 hover:bg-slate-700 text-[11px] text-slate-200 border border-slate-700 rounded-lg text-center font-medium"
              >
                Contrôle (30 DT)
              </button>
            </div>
          </div>

          {/* Description & Amount */}
          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-2">
              <label className="block text-xs font-semibold text-slate-300 mb-1">Désignation de l'acte</label>
              <input
                type="text"
                required
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-teal-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">{t.labelAmountTND}</label>
              <div className="relative">
                <input
                  type="number"
                  required
                  min="0"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) || 0 })}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white font-bold focus:outline-none focus:border-teal-500"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-slate-400 font-bold">DT</span>
              </div>
            </div>
          </div>

          {/* Payment Status & Payment Method */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">{t.labelPaymentStatus}</label>
              <select
                value={formData.paymentStatus}
                onChange={(e) => setFormData({ ...formData, paymentStatus: e.target.value })}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-teal-500"
              >
                <option value="paid">{t.totalPaid}</option>
                <option value="pending">{t.totalUnpaid}</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">{t.labelPaymentMethod}</label>
              <select
                value={formData.paymentMethod}
                onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-teal-500"
              >
                <option value="cash">{t.payCash}</option>
                <option value="check">{t.payCheck}</option>
                <option value="cnam">{t.payCNAM}</option>
              </select>
            </div>
          </div>

          {/* Actions */}
          <div className="pt-4 border-t border-slate-800 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold"
            >
              {t.btnCancel}
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-emerald-600/20 flex items-center gap-1.5"
            >
              <Printer className="w-4 h-4" />
              <span>{t.btnPrintInvoice}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
