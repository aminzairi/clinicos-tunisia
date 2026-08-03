import React from 'react';
import { CreditCard, Plus, Printer, DollarSign, CheckCircle2, Clock } from 'lucide-react';
import { translations } from '../utils/translations';
import { printInvoice } from '../utils/printTemplates';

export default function BillingView({ 
  invoices, 
  lang, 
  clinicConfig, 
  onOpenInvoiceModal 
}) {
  const t = translations[lang];

  const totalPaid = invoices.reduce((acc, inv) => inv.paymentStatus === 'paid' ? acc + inv.amount : acc, 0);
  const totalPending = invoices.reduce((acc, inv) => inv.paymentStatus === 'pending' ? acc + inv.amount : acc, 0);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* View Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <CreditCard className="w-6 h-6 text-emerald-400" />
            <span>{t.billingTitle}</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Suivi des recettes du cabinet, encaissements en dinars tunisiens (TND) et émission des reçus.
          </p>
        </div>

        <button
          onClick={onOpenInvoiceModal}
          className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-emerald-600/20 flex items-center gap-2 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>{t.btnNewInvoiceModal}</span>
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400">{t.totalPaid}</span>
            <h3 className="text-2xl font-black text-emerald-400 mt-1">{totalPaid} <span className="text-xs">DT</span></h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400">{t.totalUnpaid}</span>
            <h3 className="text-2xl font-black text-amber-400 mt-1">{totalPending} <span className="text-xs">DT</span></h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center font-bold">
            <Clock className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Invoices Table */}
      <div className="rounded-2xl bg-slate-900/90 border border-slate-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-800/60 border-b border-slate-800 text-slate-300 font-bold uppercase text-[11px] tracking-wider">
              <tr>
                <th className="p-4">N° Facture</th>
                <th className="p-4">Patient</th>
                <th className="p-4">Date</th>
                <th className="p-4">Acte Médical</th>
                <th className="p-4">Mode</th>
                <th className="p-4">Montant (TND)</th>
                <th className="p-4">Statut</th>
                <th className="p-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {invoices.map(inv => (
                <tr key={inv.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="p-4 font-mono font-bold text-slate-200">{inv.id}</td>
                  <td className="p-4 font-bold text-white">{inv.patientName}</td>
                  <td className="p-4 text-slate-400">{inv.date}</td>
                  <td className="p-4 text-slate-300">{inv.description}</td>
                  <td className="p-4">
                    <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700 text-[11px]">
                      {inv.paymentMethod === 'cash' ? 'Espèces' : inv.paymentMethod === 'check' ? 'Chèque' : 'CNAM'}
                    </span>
                  </td>
                  <td className="p-4 font-black text-emerald-400 text-sm">{inv.amount} DT</td>
                  <td className="p-4">
                    <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${
                      inv.paymentStatus === 'paid'
                        ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                        : 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                    }`}>
                      {inv.paymentStatus === 'paid' ? 'Payée' : 'En attente'}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => printInvoice(inv, clinicConfig)}
                      className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg"
                      title={t.btnPrintInvoice}
                    >
                      <Printer className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
