import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2, Printer, ShieldCheck, Pill, Mic, Sparkles } from 'lucide-react';
import { translations } from '../utils/translations';
import { printCNAMPrescription } from '../utils/printTemplates';
import { TUNISIAN_PHARMA_CATALOG } from '../utils/pharmaTunisie';

export default function PrescriptionModal({ 
  isOpen, 
  onClose, 
  onSave, 
  patients, 
  clinicConfig, 
  lang 
}) {
  const t = translations[lang];

  const [formData, setFormData] = useState({
    patientId: '',
    patientName: '',
    cin: '',
    cnamRegime: 'regimeAP1',
    cnamIdent: '',
    date: new Date().toISOString().split('T')[0],
    medications: [
      { name: 'Concor 5mg (Comprimés)', dosage: '1 comprimé au petit déjeuner', duration: '3 mois', substitutable: false }
    ]
  });

  const [activeSearchIdx, setActiveSearchIdx] = useState(null);
  const [isListening, setIsListening] = useState(false);

  useEffect(() => {
    if (patients && patients.length > 0) {
      const first = patients[0];
      setFormData(prev => ({
        ...prev,
        patientId: first.id,
        patientName: first.fullName,
        cin: first.cin || '',
        cnamIdent: `CNAM-${first.cin || '12345'}`
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
        patientName: p.fullName,
        cin: p.cin || '',
        cnamIdent: `CNAM-${p.cin || '12345'}`
      });
    }
  };

  const handleAddMed = () => {
    setFormData({
      ...formData,
      medications: [
        ...formData.medications,
        { name: '', dosage: '1 comprimé par jour', duration: '1 mois', substitutable: true }
      ]
    });
  };

  const handleSelectPresetMed = (idx, drug) => {
    const updated = [...formData.medications];
    updated[idx] = {
      name: drug.name,
      dosage: drug.defaultDosage,
      duration: drug.duration,
      substitutable: drug.substitutable
    };
    setFormData({ ...formData, medications: updated });
    setActiveSearchIdx(null);
  };

  const handleRemoveMed = (index) => {
    const updated = [...formData.medications];
    updated.splice(index, 1);
    setFormData({ ...formData, medications: updated });
  };

  const handleMedChange = (index, field, value) => {
    const updated = [...formData.medications];
    updated[index][field] = value;
    setFormData({ ...formData, medications: updated });
  };

  // Web Speech API Voice Dictation
  const handleStartVoiceDictation = (idx) => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('La dictée vocale nécessite Google Chrome ou Microsoft Edge.');
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = lang === 'ar' ? 'ar-TN' : 'fr-FR';
    recognition.interimResults = false;

    setIsListening(true);
    recognition.start();

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      handleMedChange(idx, 'dosage', transcript);
      setIsListening(false);
    };

    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);
  };

  const handlePrint = () => {
    printCNAMPrescription(formData, clinicConfig);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.patientName || formData.medications.length === 0) return;
    onSave(formData);
    handlePrint();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-800/40">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-teal-500/20 text-teal-300 flex items-center justify-center font-bold">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-100">{t.prescriptionTitle}</h3>
              <p className="text-[11px] text-teal-400 font-semibold">{t.cnamBadge} - Pharmacopée Tunisie</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          {/* Patient Selection & CNAM Regime */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">{t.selectPatientPrescription} *</label>
              <select
                value={formData.patientId}
                onChange={(e) => handlePatientSelect(e.target.value)}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-teal-500"
              >
                {patients.map(p => (
                  <option key={p.id} value={p.id}>{p.fullName} (CIN: {p.cin || 'N/A'})</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">{t.cnamRegime}</label>
              <select
                value={formData.cnamRegime}
                onChange={(e) => setFormData({ ...formData, cnamRegime: e.target.value })}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-teal-500"
              >
                <option value="regimeOrdinary">{t.regimeOrdinary}</option>
                <option value="regimeAP1">{t.regimeAP1}</option>
                <option value="regimeAccident">{t.regimeAccident}</option>
              </select>
            </div>
          </div>

          {/* Quick Tunisian Drug Presets Bar */}
          <div>
            <label className="block text-[11px] font-bold text-slate-400 mb-1 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-teal-400" />
              Prescriptions Rapides Tunisie (Pharmacie CNAM)
            </label>
            <div className="flex flex-wrap gap-1.5">
              {TUNISIAN_PHARMA_CATALOG.slice(0, 6).map((drug, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleSelectPresetMed(formData.medications.length - 1, drug)}
                  className="px-2 py-1 bg-slate-800 hover:bg-teal-600/30 text-teal-300 border border-slate-700 rounded-lg text-[10px] font-semibold transition-all"
                >
                  + {drug.name.split(' ')[0]} {drug.name.split(' ')[1]}
                </button>
              ))}
            </div>
          </div>

          {/* Medications Section (R/) */}
          <div className="pt-2">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-teal-400 flex items-center gap-1.5">
                <Pill className="w-4 h-4" />
                {t.medicationListTitle}
              </label>
              <button
                type="button"
                onClick={handleAddMed}
                className="px-2.5 py-1 bg-teal-600/20 hover:bg-teal-600/30 text-teal-300 rounded-lg text-xs font-semibold flex items-center gap-1 border border-teal-500/30"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{t.btnAddMedication}</span>
              </button>
            </div>

            <div className="space-y-3">
              {formData.medications.map((med, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 space-y-2 relative">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-bold text-teal-300">#{idx + 1}</span>
                    <div className="flex-1 relative">
                      <input
                        type="text"
                        required
                        placeholder="Rechercher médicament (ex: Concor, Plavix, Amlor...)"
                        value={med.name}
                        onFocus={() => setActiveSearchIdx(idx)}
                        onChange={(e) => handleMedChange(idx, 'name', e.target.value)}
                        className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-teal-500"
                      />

                      {activeSearchIdx === idx && med.name.length >= 2 && (
                        <div className="absolute left-0 right-0 top-full mt-1 z-30 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl max-h-40 overflow-y-auto">
                          {TUNISIAN_PHARMA_CATALOG.filter(d => d.name.toLowerCase().includes(med.name.toLowerCase())).map((drug, di) => (
                            <div
                              key={di}
                              onClick={() => handleSelectPresetMed(idx, drug)}
                              className="p-2 hover:bg-teal-600/20 text-xs text-slate-200 cursor-pointer border-b border-slate-800 flex justify-between"
                            >
                              <span className="font-bold">{drug.name}</span>
                              <span className="text-teal-400 text-[10px]">{drug.defaultDosage}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => handleRemoveMed(idx)}
                      disabled={formData.medications.length === 1}
                      className="p-1.5 text-rose-400 hover:bg-rose-500/10 rounded-lg disabled:opacity-30"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-3 gap-2 items-center">
                    <div className="relative col-span-1">
                      <input
                        type="text"
                        placeholder="Posologie (ex: 1/j le matin)"
                        value={med.dosage}
                        onChange={(e) => handleMedChange(idx, 'dosage', e.target.value)}
                        className="w-full pr-7 px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-slate-200"
                      />
                      <button
                        type="button"
                        onClick={() => handleStartVoiceDictation(idx)}
                        className={`absolute right-1 top-1/2 -translate-y-1/2 p-1 rounded ${
                          isListening ? 'bg-rose-500 text-white animate-pulse' : 'text-slate-400 hover:text-teal-400'
                        }`}
                        title="Dictée Vocale Posologie"
                      >
                        <Mic className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <input
                      type="text"
                      placeholder="Durée (ex: 3 mois)"
                      value={med.duration}
                      onChange={(e) => handleMedChange(idx, 'duration', e.target.value)}
                      className="px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-slate-200"
                    />

                    <label className="flex items-center gap-2 px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-slate-300 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={med.substitutable}
                        onChange={(e) => handleMedChange(idx, 'substitutable', e.target.checked)}
                        className="rounded border-slate-700 text-teal-500 focus:ring-0"
                      />
                      <span>Subst.</span>
                    </label>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action Footer */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
            <button
              type="button"
              onClick={handlePrint}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-teal-300 rounded-xl text-xs font-semibold flex items-center gap-2 border border-teal-500/30"
            >
              <Printer className="w-4 h-4" />
              <span>{t.prescriptionPreview}</span>
            </button>

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
                className="px-5 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-teal-600/20 flex items-center gap-1.5"
              >
                <Printer className="w-4 h-4" />
                <span>{t.btnPrintCNAM}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
