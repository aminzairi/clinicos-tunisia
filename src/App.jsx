import React, { useState, useEffect, useCallback } from 'react';
import { 
  getStoredData, 
  setStoredData, 
  initializeDatabase, 
  STORAGE_KEYS,
  generate50PatientsDataset
} from './utils/storage';

import { 
  AUTOMATION_DEFAULTS, 
  runAutomatedReminderCheck 
} from './utils/reminderEngine';

import Sidebar from './components/Sidebar';
import Header from './components/Header';

import DashboardView from './views/DashboardView';
import PatientsView from './views/PatientsView';
import CalendarView from './views/CalendarView';
import RemindersView from './views/RemindersView';
import PrescriptionsView from './views/PrescriptionsView';
import BillingView from './views/BillingView';
import SettingsView from './views/SettingsView';

import PatientModal from './components/PatientModal';
import AppointmentModal from './components/AppointmentModal';
import PrescriptionModal from './components/PrescriptionModal';
import InvoiceModal from './components/InvoiceModal';
import MedicalRecordsView from './views/MedicalRecordsView';
import { useAuth } from './context/AuthContext';
import LoginModal from './components/LoginModal';

export default function App() {
  // Initialize Database with 50 Test Patients
  useEffect(() => {
    initializeDatabase(true);
  }, []);

  const default50 = generate50PatientsDataset();

  const [lang, setLangState] = useState(() => getStoredData(STORAGE_KEYS.LANGUAGE, 'fr'));
  // userRole is now driven by authenticated user
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchQuery, setSearchQuery] = useState('');

  // Domain Datasets State
  const [clinicConfig, setClinicConfig] = useState(() => getStoredData(STORAGE_KEYS.CLINIC_CONFIG, {}));
  const [patients, setPatients] = useState(() => getStoredData(STORAGE_KEYS.PATIENTS, default50.patients));
  const [appointments, setAppointments] = useState(() => getStoredData(STORAGE_KEYS.APPOINTMENTS, default50.appointments));
  const [reminders, setReminders] = useState(() => getStoredData(STORAGE_KEYS.REMINDERS, default50.reminders));
  const [prescriptions, setPrescriptions] = useState(() => getStoredData(STORAGE_KEYS.PRESCRIPTIONS, default50.prescriptions));
  const [invoices, setInvoices] = useState(() => getStoredData(STORAGE_KEYS.INVOICES, default50.invoices));

  // Sync state if initial seed was injected
  useEffect(() => {
    const fresh = generate50PatientsDataset();
    setPatients(getStoredData(STORAGE_KEYS.PATIENTS, fresh.patients));
    setAppointments(getStoredData(STORAGE_KEYS.APPOINTMENTS, fresh.appointments));
    setReminders(getStoredData(STORAGE_KEYS.REMINDERS, fresh.reminders));
    setPrescriptions(getStoredData(STORAGE_KEYS.PRESCRIPTIONS, fresh.prescriptions));
    setInvoices(getStoredData(STORAGE_KEYS.INVOICES, fresh.invoices));
  }, []);

  // Sync language with HTML document direction (LTR for FR, RTL for AR)
  const setLang = (newLang) => {
    setLangState(newLang);
    setStoredData(STORAGE_KEYS.LANGUAGE, newLang);
  };

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  }, [lang]);

  // Modals visibility state
  const [isPatientModalOpen, setIsPatientModalOpen] = useState(false);
  const [patientToEdit, setPatientToEdit] = useState(null);

  const [isApptModalOpen, setIsApptModalOpen] = useState(false);
  const [apptToEdit, setApptToEdit] = useState(null);

  const [isPrescriptionModalOpen, setIsPrescriptionModalOpen] = useState(false);
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);

  // KEYBOARD SHORTCUTS OPTIMIZATION (Ctrl+K, Escape, Ctrl+N)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setActiveTab('patients');
        setTimeout(() => {
          const input = document.getElementById('patient-search-input');
          if (input) input.focus();
        }, 100);
      } else if (e.key === 'Escape') {
        setIsPatientModalOpen(false);
        setIsApptModalOpen(false);
        setIsPrescriptionModalOpen(false);
        setIsInvoiceModalOpen(false);
      } else if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
        e.preventDefault();
        setPatientToEdit(null);
        setIsPatientModalOpen(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // AUTOMATION DISPATCHER RUNNER (Supports 50 Patients Simulation)
  const handleRunAutoDispatchNow = useCallback((overrideSettings) => {
    const storedAutoSettings = overrideSettings || JSON.parse(localStorage.getItem('clinicos_auto_reminder_settings') || JSON.stringify(AUTOMATION_DEFAULTS));
    
    const result = runAutomatedReminderCheck(appointments, reminders, clinicConfig, storedAutoSettings);
    if (result.dispatched.length > 0) {
      setReminders(result.updatedReminders);
      setStoredData(STORAGE_KEYS.REMINDERS, result.updatedReminders);
    }
    return result.dispatched;
  }, [appointments, reminders, clinicConfig]);

  // Full 50-Patient Reset & Auto-Dispatch Simulation Trigger
  const handleSimulate50PatientsFullAuto = () => {
    const dataset = generate50PatientsDataset();
    setPatients(dataset.patients);
    setAppointments(dataset.appointments);
    setReminders(dataset.reminders);
    setPrescriptions(dataset.prescriptions);
    setInvoices(dataset.invoices);

    setStoredData(STORAGE_KEYS.PATIENTS, dataset.patients);
    setStoredData(STORAGE_KEYS.APPOINTMENTS, dataset.appointments);
    setStoredData(STORAGE_KEYS.REMINDERS, dataset.reminders);
    setStoredData(STORAGE_KEYS.PRESCRIPTIONS, dataset.prescriptions);
    setStoredData(STORAGE_KEYS.INVOICES, dataset.invoices);

    return dataset;
  };

  // Background Automatic Timer Loop (scans every 30 seconds)
  useEffect(() => {
    const timer = setInterval(() => {
      handleRunAutoDispatchNow();
    }, 30000);

    return () => clearInterval(timer);
  }, [handleRunAutoDispatchNow]);

  // CRUD Handlers for Patients
  const handleSavePatient = (formData) => {
    let updated;
    if (patientToEdit) {
      updated = patients.map(p => p.id === patientToEdit.id ? { ...p, ...formData } : p);
    } else {
      const newPat = {
        id: `pat-${Date.now()}`,
        ...formData,
        createdAt: new Date().toISOString().split('T')[0]
      };
      updated = [newPat, ...patients];
    }
    setPatients(updated);
    setStoredData(STORAGE_KEYS.PATIENTS, updated);
  };

  const handleDeletePatient = (patientId) => {
    if (window.confirm('Voulez-vous vraiment supprimer ce patient ?')) {
      const updated = patients.filter(p => p.id !== patientId);
      setPatients(updated);
      setStoredData(STORAGE_KEYS.PATIENTS, updated);
    }
  };

  // CRUD Handlers for Appointments
  const handleSaveAppointment = (formData) => {
    let updated;
    if (apptToEdit) {
      updated = appointments.map(a => a.id === apptToEdit.id ? { ...a, ...formData } : a);
    } else {
      const newApt = {
        id: `apt-${Date.now()}`,
        ...formData
      };
      updated = [newApt, ...appointments];
    }
    setAppointments(updated);
    setStoredData(STORAGE_KEYS.APPOINTMENTS, updated);

    setTimeout(() => handleRunAutoDispatchNow(), 500);
  };

  const handleUpdateApptStatus = (apptId, newStatus) => {
    const updated = appointments.map(a => a.id === apptId ? { ...a, status: newStatus } : a);
    setAppointments(updated);
    setStoredData(STORAGE_KEYS.APPOINTMENTS, updated);
  };

  const handleDeleteAppointment = (apptId) => {
    const updated = appointments.filter(a => a.id !== apptId);
    setAppointments(updated);
    setStoredData(STORAGE_KEYS.APPOINTMENTS, updated);
  };

  // CRUD Handler for Prescriptions
  const handleSavePrescription = (formData) => {
    const newOrd = {
      id: `ord-${Date.now()}`,
      ...formData
    };
    const updated = [newOrd, ...prescriptions];
    setPrescriptions(updated);
    setStoredData(STORAGE_KEYS.PRESCRIPTIONS, updated);
  };

  // CRUD Handler for Invoices
  const handleSaveInvoice = (formData) => {
    const newInv = {
      ...formData
    };
    const updated = [newInv, ...invoices];
    setInvoices(updated);
    setStoredData(STORAGE_KEYS.INVOICES, updated);
  };

  // Handler for Instant Reminders via WhatsApp Web
  const handleSendInstantReminder = (apptOrPat) => {
    const patientName = apptOrPat.patientName || apptOrPat.fullName;
    const phone = apptOrPat.phone || apptOrPat.mobile || '+21698123456';
    const date = apptOrPat.date || new Date().toISOString().split('T')[0];
    const time = apptOrPat.time || '10:00';

    const textFR = `Bonjour ${patientName}, nous vous rappelons votre rendez-vous médical avec le Dr. ${clinicConfig.doctorName || 'Youssef Ben Ali'} le ${date} à ${time}. En cas d'empêchement, merci de nous alerter.`;
    const textAR = `مرحباً ${patientName}، نذكركم بموعدكم الطبي مع د. ${clinicConfig.doctorName || 'يوسف بن علي'} يوم ${date} على الساعة ${time}.`;

    const message = lang === 'ar' ? textAR : textFR;

    let cleanPhone = phone.replace(/\s+/g, '').replace('+', '');
    if (cleanPhone.startsWith('0')) cleanPhone = '216' + cleanPhone.substring(1);
    if (!cleanPhone.startsWith('216')) cleanPhone = '216' + cleanPhone;

    const waUrl = `https://web.whatsapp.com/send?phone=${cleanPhone}&text=${encodeURIComponent(message)}`;

    const newLog = {
      id: `rem-${Date.now()}`,
      patientName,
      phone,
      apptDate: date,
      apptTime: time,
      channel: 'WhatsApp Web Direct',
      sentAt: new Date().toLocaleString(),
      status: 'Delivered'
    };

    const updatedReminders = [newLog, ...reminders];
    setReminders(updatedReminders);
    setStoredData(STORAGE_KEYS.REMINDERS, updatedReminders);

    window.open(waUrl, '_blank');
  };

  // Save Settings Config
  const handleSaveConfig = (newConfig) => {
    setClinicConfig(newConfig);
    setStoredData(STORAGE_KEYS.CLINIC_CONFIG, newConfig);
  };
  const { auth, login } = useAuth();
  const userRole = auth?.user?.role || 'secretary';
  const handleLogin = async (role) => {
    const email = role === 'doctor' ? 'doc' : 'sec';
    const password = role === 'doctor' ? (clinicConfig.doctorPin || '1234') : (clinicConfig.secretaryPin || '0000');
    const result = await login(email, password);
    if (!result.success) {
      alert('Login failed');
    }
  };
  if (!auth?.user) {
    return (
      <LoginModal
        isOpen={true}
        onLogin={handleLogin}
        clinicConfig={clinicConfig}
        lang={lang}
      />
    );
  }

  return (
    <div className="flex h-screen bg-slate-950 text-slate-100 overflow-hidden font-sans">
      {/* Sidebar Navigation */}
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        lang={lang} 
        clinicConfig={clinicConfig}
        userRole={userRole}
      />

      {/* Main Workspace Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top Header */}
        <Header 
          lang={lang}
          setLang={setLang}
          userRole={userRole}
          onOpenPatientModal={() => { setPatientToEdit(null); setIsPatientModalOpen(true); }}
          onOpenApptModal={() => { setApptToEdit(null); setIsApptModalOpen(true); }}
          onOpenPrescriptionModal={() => setIsPrescriptionModalOpen(true)}
          onOpenInvoiceModal={() => setIsInvoiceModalOpen(true)}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />

        {/* Tab Views Container */}
        <main className="p-6 flex-1 max-w-7xl w-full mx-auto">
          {activeTab === 'dashboard' && (
            <DashboardView 
              patients={patients}
              appointments={appointments}
              reminders={reminders}
              invoices={invoices}
              lang={lang}
              onOpenPatientModal={() => { setPatientToEdit(null); setIsPatientModalOpen(true); }}
              onOpenApptModal={() => { setApptToEdit(null); setIsApptModalOpen(true); }}
              onOpenPrescriptionModal={() => setIsPrescriptionModalOpen(true)}
              onOpenInvoiceModal={() => setIsInvoiceModalOpen(true)}
              onSendInstantReminder={handleSendInstantReminder}
              onSelectTab={setActiveTab}
            />
          )}

          {activeTab === 'patients' && (
            <PatientsView 
              patients={patients}
              lang={lang}
              onOpenAddPatient={() => { setPatientToEdit(null); setIsPatientModalOpen(true); }}
              onEditPatient={(p) => { setPatientToEdit(p); setIsPatientModalOpen(true); }}
              onDeletePatient={handleDeletePatient}
              onOpenPrescriptionForPatient={(p) => setIsPrescriptionModalOpen(true)}
              onOpenInvoiceForPatient={(p) => setIsInvoiceModalOpen(true)}
              onSendInstantReminder={handleSendInstantReminder}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
            />
          )}

          {activeTab === 'calendar' && (
            <CalendarView 
              appointments={appointments}
              lang={lang}
              onOpenAddAppt={() => { setApptToEdit(null); setIsApptModalOpen(true); }}
              onEditAppt={(a) => { setApptToEdit(a); setIsApptModalOpen(true); }}
              onDeleteAppt={handleDeleteAppointment}
              onSendInstantReminder={handleSendInstantReminder}
              onUpdateStatus={handleUpdateApptStatus}
            />
          )}

          {activeTab === 'reminders' && (
            <RemindersView 
              reminders={reminders}
              appointments={appointments}
              patients={patients}
              lang={lang}
              clinicConfig={clinicConfig}
              onSendCustomReminder={(rem) => {
                const updated = [{ id: `rem-${Date.now()}`, sentAt: new Date().toLocaleString(), ...rem }, ...reminders];
                setReminders(updated);
                setStoredData(STORAGE_KEYS.REMINDERS, updated);
              }}
              onRunAutoDispatchNow={handleRunAutoDispatchNow}
              onSimulate50Patients={handleSimulate50PatientsFullAuto}
            />
          )}

          {activeTab === 'prescriptions' && (
            <PrescriptionsView 
              prescriptions={prescriptions}
              lang={lang}
              clinicConfig={clinicConfig}
              onOpenPrescriptionModal={() => setIsPrescriptionModalOpen(true)}
            />
          )}

          {activeTab === 'billing' && (
            <BillingView 
              invoices={invoices}
              lang={lang}
              clinicConfig={clinicConfig}
              onOpenInvoiceModal={() => setIsInvoiceModalOpen(true)}
            />
          )}

          {activeTab === 'medical-records' && (
            <MedicalRecordsView 
              patients={patients}
              lang={lang}
            />
          )}

          {activeTab === 'settings' && (
            <SettingsView 
              clinicConfig={clinicConfig}
              onSaveConfig={handleSaveConfig}
              lang={lang}
            />
          )}
        </main>
      </div>

      {/* Global Modals */}
      <PatientModal 
        isOpen={isPatientModalOpen}
        onClose={() => setIsPatientModalOpen(false)}
        onSave={handleSavePatient}
        patientToEdit={patientToEdit}
        lang={lang}
      />

      <AppointmentModal 
        isOpen={isApptModalOpen}
        onClose={() => setIsApptModalOpen(false)}
        onSave={handleSaveAppointment}
        patients={patients}
        apptToEdit={apptToEdit}
        lang={lang}
        onSendInstantReminder={handleSendInstantReminder}
      />

      <PrescriptionModal 
        isOpen={isPrescriptionModalOpen}
        onClose={() => setIsPrescriptionModalOpen(false)}
        onSave={handleSavePrescription}
        patients={patients}
        clinicConfig={clinicConfig}
        lang={lang}
      />

      <InvoiceModal 
        isOpen={isInvoiceModalOpen}
        onClose={() => setIsInvoiceModalOpen(false)}
        onSave={handleSaveInvoice}
        patients={patients}
        clinicConfig={clinicConfig}
        lang={lang}
      />
    </div>
  );
}
