import React, { useState } from 'react';
import { FileText, Search, User, Calendar, ShieldCheck, ChevronDown, ChevronUp } from 'lucide-react';

export default function MedicalRecordsView({ patients, lang }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedId, setExpandedId] = useState(null);

  const filtered = patients.filter(p =>
    p.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.cin?.includes(searchQuery)
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
            <FileText className="w-6 h-6 text-teal-400" />
            {lang === 'ar' ? 'السجلات الطبية' : 'Dossiers Médicaux'}
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            {lang === 'ar' ? 'تاريخ المرضى والملاحظات السريرية' : 'Historique patients et notes cliniques'}
          </p>
        </div>
        <div className="text-xs text-slate-500">
          {filtered.length} {lang === 'ar' ? 'مريض' : 'patient(s)'}
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={lang === 'ar' ? 'بحث بالاسم أو رقم البطاقة...' : 'Rechercher par nom ou CIN...'}
          className="w-full pl-9 pr-4 py-2.5 bg-slate-800/80 border border-slate-700/80 rounded-xl text-xs text-slate-200 placeholder-slate-400 focus:outline-none focus:border-teal-500 transition-colors"
        />
      </div>

      {/* Records List */}
      <div className="space-y-3">
        {filtered.length === 0 && (
          <div className="text-center py-16 text-slate-500 text-sm">
            {lang === 'ar' ? 'لا توجد سجلات' : 'Aucun dossier trouvé'}
          </div>
        )}

        {filtered.map(patient => (
          <div
            key={patient.id}
            className="bg-slate-900/60 border border-slate-800 rounded-2xl overflow-hidden transition-all"
          >
            {/* Row Header */}
            <button
              onClick={() => setExpandedId(expandedId === patient.id ? null : patient.id)}
              className="w-full flex items-center justify-between p-4 hover:bg-slate-800/40 transition-colors text-left"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-teal-600/20 flex items-center justify-center text-teal-400">
                  <User className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-sm font-bold text-white">{patient.fullName}</p>
                  <p className="text-[11px] text-slate-400">
                    CIN: {patient.cin} &bull; {patient.bloodGroup || '—'}
                  </p>
                </div>
              </div>
              {expandedId === patient.id
                ? <ChevronUp className="w-4 h-4 text-slate-500" />
                : <ChevronDown className="w-4 h-4 text-slate-500" />
              }
            </button>

            {/* Expanded Detail */}
            {expandedId === patient.id && (
              <div className="px-5 pb-5 pt-1 border-t border-slate-800 space-y-3">
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-slate-500">{lang === 'ar' ? 'الهاتف' : 'Téléphone'}</span>
                    <p className="text-slate-200 font-semibold mt-0.5">{patient.phone || '—'}</p>
                  </div>
                  <div>
                    <span className="text-slate-500">{lang === 'ar' ? 'تاريخ الميلاد' : 'Date de naissance'}</span>
                    <p className="text-slate-200 font-semibold mt-0.5">{patient.dob || '—'}</p>
                  </div>
                  <div>
                    <span className="text-slate-500">{lang === 'ar' ? 'الجنس' : 'Genre'}</span>
                    <p className="text-slate-200 font-semibold mt-0.5">
                      {patient.gender === 'male' ? (lang === 'ar' ? 'ذكر' : 'Homme') : (lang === 'ar' ? 'أنثى' : 'Femme')}
                    </p>
                  </div>
                  <div>
                    <span className="text-slate-500">{lang === 'ar' ? 'فصيلة الدم' : 'Groupe sanguin'}</span>
                    <p className="text-slate-200 font-semibold mt-0.5">{patient.bloodGroup || '—'}</p>
                  </div>
                </div>

                <div>
                  <span className="text-slate-500 text-xs">{lang === 'ar' ? 'التاريخ الطبي' : 'Antécédents médicaux'}</span>
                  <p className="text-slate-300 text-xs mt-1 leading-relaxed bg-slate-800/50 rounded-xl p-3 border border-slate-700/50">
                    {patient.medicalHistory || (lang === 'ar' ? 'لا توجد بيانات' : 'Aucun antécédent renseigné')}
                  </p>
                </div>

                {patient.notes && (
                  <div>
                    <span className="text-slate-500 text-xs">{lang === 'ar' ? 'ملاحظات' : 'Notes'}</span>
                    <p className="text-slate-400 text-xs mt-1">{patient.notes}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
