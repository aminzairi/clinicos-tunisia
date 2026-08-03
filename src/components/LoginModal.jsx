import React, { useState } from 'react';
import { Lock, UserCheck, Shield, KeyRound, ArrowRight, Activity, AlertCircle } from 'lucide-react';
import { translations } from '../utils/translations';

export default function LoginModal({ isOpen, onLogin, clinicConfig, lang }) {
  const t = translations[lang];

  const [selectedRole, setSelectedRole] = useState('doctor'); // 'doctor', 'secretary', or 'admin'
  const [pinInput, setPinInput] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  const handlePinSubmit = (e) => {
    e.preventDefault();
    setErrorMessage('');

    const doctorPin = clinicConfig.doctorPin || '1234';
    const secretaryPin = clinicConfig.secretaryPin || '0000';

    if (selectedRole === 'doctor') {
      if (pinInput === doctorPin) {
        onLogin('doctor');
        setPinInput('');
      } else {
        setErrorMessage('Code PIN Médecin incorrect (Par défaut: 1234)');
      }
    } else if (selectedRole === 'secretary') {
      if (pinInput === secretaryPin) {
        onLogin('secretary');
        setPinInput('');
      } else {
        setErrorMessage('Code PIN Secrétaire incorrect (Par défaut: 0000)');
      }
    } else if (selectedRole === 'admin') {
      onLogin('admin', pinInput);
      setPinInput('');
    }
  };

  const handleKeypadPress = (num) => {
    if (pinInput.length < 12) {
      setPinInput(prev => prev + num);
    }
  };

  const handleKeypadClear = () => {
    setPinInput('');
    setErrorMessage('');
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-xl flex items-center justify-center p-4">
      <div className="bg-slate-900/90 border border-slate-800/80 rounded-3xl w-full max-w-md shadow-2xl shadow-purple-950/20 overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Brand Header */}
        <div className="p-6 border-b border-slate-800/80 text-center bg-slate-900/40">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-teal-500 via-cyan-400 to-purple-500 mx-auto flex items-center justify-center text-slate-950 font-black shadow-xl shadow-teal-500/20 mb-3">
            <Activity className="w-8 h-8 stroke-[2.5]" />
          </div>
          <h2 className="text-xl font-extrabold text-white tracking-tight flex items-center justify-center gap-1.5">
            Clinic<span className="text-teal-400">OS</span> Tunisia
          </h2>
          <p className="text-xs text-slate-400 mt-1 font-medium">Portail d'Accès Sécurisé au Cabinet Médical</p>
        </div>

        {/* Profile Selector Tabs (3 Separate Users) */}
        <div className="p-6 space-y-5">
          <div className="grid grid-cols-3 gap-2 p-1 bg-slate-800/60 rounded-2xl border border-slate-700/60">
            <button
              type="button"
              onClick={() => { setSelectedRole('doctor'); setPinInput(''); setErrorMessage(''); }}
              className={`py-2.5 px-2 rounded-xl text-[11px] font-bold flex flex-col items-center justify-center gap-1 transition-all ${
                selectedRole === 'doctor'
                  ? 'bg-teal-600 text-white shadow-lg shadow-teal-600/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Shield className="w-4 h-4" />
              <span>Médecin</span>
            </button>

            <button
              type="button"
              onClick={() => { setSelectedRole('secretary'); setPinInput(''); setErrorMessage(''); }}
              className={`py-2.5 px-2 rounded-xl text-[11px] font-bold flex flex-col items-center justify-center gap-1 transition-all ${
                selectedRole === 'secretary'
                  ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-600/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <UserCheck className="w-4 h-4" />
              <span>Secrétaire</span>
            </button>

            <button
              type="button"
              onClick={() => { setSelectedRole('admin'); setPinInput(''); setErrorMessage(''); }}
              className={`py-2.5 px-2 rounded-xl text-[11px] font-bold flex flex-col items-center justify-center gap-1 transition-all ${
                selectedRole === 'admin'
                  ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Activity className="w-4 h-4" />
              <span>Admin</span>
            </button>
          </div>

          {/* User Profile Badge */}
          <div className="text-center p-3 rounded-2xl bg-slate-800/40 border border-slate-700/40">
            <h3 className="font-bold text-sm text-slate-100">
              {selectedRole === 'doctor' 
                ? (clinicConfig.doctorName || 'Dr. Youssef Ben Ali') 
                : selectedRole === 'secretary' 
                ? 'Secrétariat & Accueil' 
                : 'Administrateur Système'}
            </h3>
            <p className={`text-[11px] font-medium mt-0.5 ${
              selectedRole === 'doctor' ? 'text-teal-400' : selectedRole === 'secretary' ? 'text-cyan-400' : 'text-purple-400'
            }`}>
              {selectedRole === 'doctor' 
                ? 'Accès Complet Ordonnances CNAM & Dossiers Médicaux' 
                : selectedRole === 'secretary' 
                ? 'Agenda, Inscription Patients & Rappels WhatsApp' 
                : 'Gestion Globale, Configuration & Sauvegardes'}
            </p>
          </div>

          {/* Form / PIN or Password Input */}
          <form onSubmit={handlePinSubmit} className="space-y-4">
            <div className="relative">
              {selectedRole === 'admin' ? (
                <Lock className="w-4 h-4 text-purple-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              ) : (
                <KeyRound className="w-4 h-4 text-teal-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              )}
              <input
                type="password"
                required
                maxLength={selectedRole !== 'admin' ? "6" : undefined}
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                placeholder={
                  selectedRole === 'doctor' 
                    ? 'Code PIN Médecin (ex: 1234)' 
                    : selectedRole === 'secretary' 
                    ? 'Code PIN Secrétaire (ex: 0000)' 
                    : 'Mot de passe Admin'
                }
                className={`w-full pl-10 pr-4 py-3 bg-slate-800/80 border rounded-xl text-center text-sm font-mono tracking-widest text-white focus:outline-none transition-all ${
                  selectedRole === 'admin' 
                    ? 'border-purple-500/50 focus:border-purple-400 focus:ring-1 focus:ring-purple-400/30' 
                    : 'border-slate-700 focus:border-teal-500'
                }`}
              />
            </div>

            {errorMessage && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-bold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Visual Numeric Keypad for Doctor & Secretary */}
            {selectedRole !== 'admin' && (
              <div className="grid grid-cols-3 gap-2 pt-1">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => handleKeypadPress(num.toString())}
                    className="py-2.5 bg-slate-800/60 hover:bg-slate-800 text-white font-bold text-sm rounded-xl border border-slate-700/50 active:scale-95 transition-all"
                  >
                    {num}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={handleKeypadClear}
                  className="py-2.5 bg-rose-500/10 text-rose-400 font-bold text-xs rounded-xl border border-rose-500/20 active:scale-95 transition-all"
                >
                  Effacer
                </button>
                <button
                  type="button"
                  onClick={() => handleKeypadPress('0')}
                  className="py-2.5 bg-slate-800/60 hover:bg-slate-800 text-white font-bold text-sm rounded-xl border border-slate-700/50 active:scale-95 transition-all"
                >
                  0
                </button>
                <button
                  type="submit"
                  className="py-2.5 bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-teal-600/20 active:scale-95 transition-all flex items-center justify-center gap-1"
                >
                  <span>OK</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* Submit Button for Admin */}
            {selectedRole === 'admin' && (
              <button
                type="submit"
                className="w-full py-3 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-purple-600/30 active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                <span>Connexion Admin</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </form>

          <p className="text-[10px] text-center text-slate-500 pt-2 border-t border-slate-800/80">
            PIN Médecin par défaut: <span className="text-teal-400 font-bold">1234</span> | PIN Secrétaire: <span className="text-cyan-400 font-bold">0000</span>
          </p>
        </div>
      </div>
    </div>
  );
}
