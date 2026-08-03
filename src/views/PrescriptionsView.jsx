import React from 'react';
import { FileText, Plus, Printer, ShieldCheck, User } from 'lucide-react';
import { translations } from '../utils/translations';
import { printCNAMPrescription } from '../utils/printTemplates';

export default function PrescriptionsView({ 
  prescriptions, 
  lang, 
  clinicConfig, 
  onOpenPrescriptionModal 
}) {
  const t = translations[lang];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* View Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-teal-400" />
            <span>{t.navPrescriptions}</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Générateur et historique des ordonnances médicales conformes aux exigences CNAM Tunisie.
          </p>
        </div>

        <button
          onClick={onOpenPrescriptionModal}
          className="px-4 py-2.5 bg-teal-600 hover:bg-teal-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-teal-600/20 flex items-center gap-2 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>{t.btnNewPrescription}</span>
        </button>
      </div>

      {/* Prescription History Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {prescriptions.length === 0 ? (
          <div className="col-span-full p-12 text-center text-slate-400 bg-slate-900/90 rounded-2xl border border-slate-800 text-xs">
            Aucune ordonnance émise pour le moment. Cliquez sur "+ Ordonnance CNAM" pour créer la première.
          </div>
        ) : (
          prescriptions.map(ord => (
            <div 
              key={ord.id}
              className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-teal-500/40 transition-all space-y-4 shadow-lg flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-teal-500/10 text-teal-300 border border-teal-500/30">
                    CNAM - {ord.cnamRegime === 'regimeAP1' ? 'AP1 / Maladie Chronique' : 'Maladie Ordinaire'}
                  </span>
                  <span className="text-xs text-slate-400">{ord.date}</span>
                </div>

                <div>
                  <h3 className="font-extrabold text-base text-white flex items-center gap-2">
                    <User className="w-4 h-4 text-teal-400" />
                    {ord.patientName}
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">CIN: {ord.cin || 'N/A'}</p>
                </div>

                <div className="p-3 bg-slate-800/50 rounded-xl border border-slate-700/50 space-y-1">
                  <h4 className="text-[11px] font-bold text-teal-300 uppercase">Médicaments Prescrits (R/):</h4>
                  <ul className="text-xs text-slate-300 space-y-1">
                    {ord.medications.map((m, i) => (
                      <li key={i} className="flex justify-between text-[11px]">
                        <span className="font-semibold">{m.name}</span>
                        <span className="text-slate-400">{m.dosage}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end">
                <button
                  onClick={() => printCNAMPrescription(ord, clinicConfig)}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-teal-300 border border-teal-500/30 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Réimprimer CNAM</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
