import React, { useState } from 'react';
import { Settings, Database, Download, Upload, ShieldCheck, UserCheck, Save, CheckCircle2, Lock } from 'lucide-react';
import { translations } from '../utils/translations';
import { exportFullDatabaseBackup, importDatabaseBackup } from '../utils/storage';

export default function SettingsView({ clinicConfig, onSaveConfig, lang, userRole }) {
  const t = translations[lang];

  const [formData, setFormData] = useState(clinicConfig);
  const [successNotice, setSuccessNotice] = useState('');

  if (userRole !== 'admin') {
    return (
      <div className="py-16 px-6 text-center max-w-lg mx-auto space-y-5 animate-in fade-in zoom-in duration-300">
        <div className="w-20 h-20 rounded-3xl bg-rose-500/10 border border-rose-500/30 text-rose-400 mx-auto flex items-center justify-center shadow-xl shadow-rose-950/30">
          <Lock className="w-10 h-10 stroke-[2]" />
        </div>
        <h2 className="text-2xl font-black text-white tracking-tight">Accès Restreint & Verrouillé</h2>
        <p className="text-xs text-slate-400 leading-relaxed">
          Les <strong>Paramètres du Cabinet</strong> et la <strong>Sauvegarde des Données</strong> sont strictement réservés et verrouillés pour les comptes Médecin et Secrétaire.
        </p>
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 text-xs text-purple-300 font-semibold shadow-lg">
          Connectez-vous en tant qu'<strong>Administrateur</strong> (Mot de passe: <span className="font-mono">joulaine12!@</span>) pour configurer le cabinet ou exporter/restaurer la base de données.
        </div>
      </div>
    );
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    onSaveConfig(formData);
    setSuccessNotice('Informations enregistrées avec succès !');
    setTimeout(() => setSuccessNotice(''), 3000);
  };

  const handleFileImport = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const ok = importDatabaseBackup(event.target.result);
      if (ok) {
        setSuccessNotice(t.importSuccessMsg);
        setTimeout(() => window.location.reload(), 1200);
      } else {
        alert('Échec de la restauration : Fichier JSON invalide.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* View Header */}
      <div>
        <h2 className="text-xl font-extrabold text-white tracking-tight flex items-center gap-2">
          <Settings className="w-6 h-6 text-teal-400" />
          <span>{t.settingsTitle}</span>
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Informations conventionnées CNAM, clés API SMS/WhatsApp et gestion des sauvegardes locales.
        </p>
      </div>

      {successNotice && (
        <div className="p-4 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{successNotice}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Clinic & Doctor Details */}
        <form onSubmit={handleSubmit} className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
          <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
            <h3 className="font-bold text-base text-white flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-teal-400" />
              {t.clinicInfoTitle}
            </h3>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-teal-500/10 text-teal-300 border border-teal-500/30">
              Prescriptions & Factures
            </span>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">{t.labelDoctorName}</label>
              <input
                type="text"
                required
                value={formData.doctorName}
                onChange={(e) => setFormData({ ...formData, doctorName: e.target.value })}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">{t.labelSpecialty}</label>
              <input
                type="text"
                value={formData.specialty}
                onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">{t.labelCodeCNAM}</label>
                <input
                  type="text"
                  value={formData.codeCNAM}
                  onChange={(e) => setFormData({ ...formData, codeCNAM: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-teal-300 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">{t.labelMatriculeFiscal}</label>
                <input
                  type="text"
                  value={formData.matriculeFiscal}
                  onChange={(e) => setFormData({ ...formData, matriculeFiscal: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-teal-300 font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">{t.labelClinicAddress}</label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">{t.labelClinicPhone}</label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Clé API SMS (WinSMS / Twilio)</label>
                <input
                  type="password"
                  value={formData.smsApiKey}
                  onChange={(e) => setFormData({ ...formData, smsApiKey: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-slate-300"
                />
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800 flex justify-end">
            <button
              type="submit"
              className="px-5 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-teal-600/20 flex items-center gap-1.5"
            >
              <Save className="w-4 h-4" />
              <span>Enregistrer les paramètres</span>
            </button>
          </div>
        </form>

        {/* Database Backup & Export/Import Section */}
        <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
          <div className="border-b border-slate-800 pb-3">
            <h3 className="font-bold text-base text-white flex items-center gap-2">
              <Database className="w-4 h-4 text-cyan-400" />
              {t.backupTitle}
            </h3>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            {t.backupDesc}
          </p>

          <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/50 space-y-4">
            <div>
              <h4 className="font-bold text-xs text-teal-300 mb-1">Exporter une sauvegarde locale</h4>
              <p className="text-[11px] text-slate-400 mb-3">
                Génère un fichier JSON sécurisé contenant toutes vos fiches patients, ordonnances, rendez-vous et factures.
              </p>
              <button
                type="button"
                onClick={exportFullDatabaseBackup}
                className="w-full py-2.5 bg-teal-600/20 hover:bg-teal-600/30 text-teal-300 border border-teal-500/30 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all"
              >
                <Download className="w-4 h-4" />
                <span>{t.btnExportJSON}</span>
              </button>
            </div>

            <div className="pt-3 border-t border-slate-700/60">
              <h4 className="font-bold text-xs text-cyan-300 mb-1">Restaurer une sauvegarde</h4>
              <p className="text-[11px] text-slate-400 mb-3">
                Sélectionnez un fichier JSON de sauvegarde précédemment exporté pour restaurer vos données.
              </p>

              <label className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-all">
                <Upload className="w-4 h-4 text-cyan-400" />
                <span>{t.btnImportJSON}</span>
                <input
                  type="file"
                  accept=".json"
                  onChange={handleFileImport}
                  className="hidden"
                />
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
