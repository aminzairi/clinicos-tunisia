import React, { useState, useMemo } from 'react';
import { 
  Users, 
  Search, 
  Plus, 
  Edit3, 
  Trash2, 
  FileText, 
  CreditCard, 
  Send, 
  HeartPulse 
} from 'lucide-react';
import { translations } from '../utils/translations';

export default function PatientsView({ 
  patients, 
  lang, 
  onOpenAddPatient, 
  onEditPatient, 
  onDeletePatient,
  onOpenPrescriptionForPatient,
  onOpenInvoiceForPatient,
  onSendInstantReminder,
  searchQuery,
  setSearchQuery
}) {
  const t = translations[lang];
  const [selectedBloodGroup, setSelectedBloodGroup] = useState('');
  const [selectedPatientDetail, setSelectedPatientDetail] = useState(null);

  // Memoized Patient List Filter to avoid re-computations
  const filteredPatients = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    return patients.filter(p => {
      const matchesSearch = 
        !query ||
        p.fullName.toLowerCase().includes(query) ||
        p.phone.includes(query) ||
        (p.cin && p.cin.includes(query));

      const matchesBlood = !selectedBloodGroup || p.bloodGroup === selectedBloodGroup;

      return matchesSearch && matchesBlood;
    });
  }, [patients, searchQuery, selectedBloodGroup]);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* View Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <Users className="w-6 h-6 text-teal-400" />
            <span>{t.navPatients}</span>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30">
              {filteredPatients.length} / {patients.length}
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Gestion complète du répertoire des patients, CIN, antécédents médicaux et historiques de consultations.
          </p>
        </div>

        <button
          onClick={onOpenAddPatient}
          className="px-4 py-2.5 bg-teal-600 hover:bg-teal-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-teal-600/20 flex items-center gap-2 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>{t.btnAddPatient}</span>
        </button>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            id="patient-search-input"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={`${t.patientSearchPlaceholder} (Ctrl+K)`}
            className="w-full pl-9 pr-4 py-2 bg-slate-800 border border-slate-700/80 rounded-xl text-xs text-slate-100 placeholder-slate-400 focus:outline-none focus:border-teal-500"
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto justify-end">
          <select
            value={selectedBloodGroup}
            onChange={(e) => setSelectedBloodGroup(e.target.value)}
            className="px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-teal-500"
          >
            <option value="">{t.allBloodGroups}</option>
            {['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map(bg => (
              <option key={bg} value={bg}>{bg}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Patients Table */}
      <div className="rounded-2xl bg-slate-900/90 border border-slate-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-800/60 border-b border-slate-800 text-slate-300 font-bold uppercase text-[11px] tracking-wider">
              <tr>
                <th className="p-4">{t.thName}</th>
                <th className="p-4">{t.thPhone}</th>
                <th className="p-4">{t.thCIN}</th>
                <th className="p-4">{t.thBlood}</th>
                <th className="p-4">Antécédents</th>
                <th className="p-4 text-right">{t.thActions}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {filteredPatients.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-slate-400">
                    Aucun patient trouvé correspondant aux critères de recherche.
                  </td>
                </tr>
              ) : (
                filteredPatients.map(patient => (
                  <tr 
                    key={patient.id} 
                    className="hover:bg-slate-800/40 transition-colors cursor-pointer group"
                    onClick={() => setSelectedPatientDetail(patient)}
                  >
                    <td className="p-4 font-bold text-white flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-teal-500/10 text-teal-400 border border-teal-500/20 flex items-center justify-center font-bold">
                        {patient.fullName.charAt(0)}
                      </div>
                      <div>
                        <div>{patient.fullName}</div>
                        <span className="text-[10px] text-slate-500 font-normal">Né(e) le: {patient.dob || 'N/A'}</span>
                      </div>
                    </td>

                    <td className="p-4 font-medium text-teal-300">{patient.phone}</td>

                    <td className="p-4">
                      <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700 font-mono text-[11px]">
                        {patient.cin || 'N/A'}
                      </span>
                    </td>

                    <td className="p-4">
                      <span className="px-2 py-0.5 rounded font-bold bg-rose-500/10 text-rose-300 border border-rose-500/20 text-[11px]">
                        {patient.bloodGroup || 'A+'}
                      </span>
                    </td>

                    <td className="p-4 max-w-xs truncate text-slate-400">
                      {patient.medicalHistory || 'Aucun antécédent signalé'}
                    </td>

                    <td className="p-4 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => onOpenPrescriptionForPatient(patient)}
                          className="p-1.5 text-teal-400 hover:bg-teal-500/10 rounded-lg"
                          title={t.btnNewPrescription}
                        >
                          <FileText className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => onOpenInvoiceForPatient(patient)}
                          className="p-1.5 text-emerald-400 hover:bg-emerald-500/10 rounded-lg"
                          title={t.btnNewInvoice}
                        >
                          <CreditCard className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => onEditPatient(patient)}
                          className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg"
                          title={t.editPatient}
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => onDeletePatient(patient.id)}
                          className="p-1.5 text-rose-400 hover:bg-rose-500/10 rounded-lg"
                          title={t.deletePatient}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Patient Detailed Dossier Modal */}
      {selectedPatientDetail && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-xl shadow-2xl p-6 space-y-4 animate-in fade-in zoom-in duration-150">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-teal-500/20 text-teal-300 flex items-center justify-center font-bold text-lg">
                  {selectedPatientDetail.fullName.charAt(0)}
                </div>
                <div>
                  <h3 className="font-bold text-base text-white">{selectedPatientDetail.fullName}</h3>
                  <p className="text-xs text-teal-400">{selectedPatientDetail.phone}</p>
                </div>
              </div>
              <button onClick={() => setSelectedPatientDetail(null)} className="text-slate-400 hover:text-white">
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-slate-800/50 rounded-xl border border-slate-700/50">
                <span className="text-slate-400 block text-[10px]">CIN:</span>
                <span className="font-bold text-white">{selectedPatientDetail.cin || 'N/A'}</span>
              </div>
              <div className="p-3 bg-slate-800/50 rounded-xl border border-slate-700/50">
                <span className="text-slate-400 block text-[10px]">Groupe Sanguin:</span>
                <span className="font-bold text-rose-400">{selectedPatientDetail.bloodGroup || 'A+'}</span>
              </div>
            </div>

            <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-700/50 text-xs space-y-1">
              <h4 className="font-bold text-slate-300 flex items-center gap-1.5">
                <HeartPulse className="w-3.5 h-3.5 text-rose-400" />
                Antécédents Médicaux & Allergies:
              </h4>
              <p className="text-slate-400">{selectedPatientDetail.medicalHistory || 'Aucun antécédent répertorié.'}</p>
            </div>

            <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-700/50 text-xs space-y-1">
              <h4 className="font-bold text-slate-300 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-cyan-400" />
                Notes de Consultations Utiles:
              </h4>
              <p className="text-slate-400">{selectedPatientDetail.notes || 'Aucune note spécifique.'}</p>
            </div>

            <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
              <button
                onClick={() => {
                  onSendInstantReminder({ patientName: selectedPatientDetail.fullName, phone: selectedPatientDetail.phone, date: 'demain', time: '10:00' });
                  setSelectedPatientDetail(null);
                }}
                className="px-4 py-2 bg-emerald-600/20 text-emerald-300 border border-emerald-500/30 rounded-xl text-xs font-bold flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Envoyer WhatsApp</span>
              </button>
              <button
                onClick={() => setSelectedPatientDetail(null)}
                className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl text-xs font-bold"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
