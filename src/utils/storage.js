// src/utils/storage.js
import bcrypt from 'bcryptjs';

const STORAGE_KEYS = {
  CLINIC_CONFIG: 'clinicos_config',
  PATIENTS: 'clinicos_patients',
  APPOINTMENTS: 'clinicos_appointments',
  REMINDERS: 'clinicos_reminders',
  PRESCRIPTIONS: 'clinicos_prescriptions',
  INVOICES: 'clinicos_invoices',
  LANGUAGE: 'clinicos_language',
  AUTH: 'clinicos_auth',
  USERS: 'clinicos_users',
  LOCK: 'clinicos_lock',
};

const DEFAULT_CONFIG = {
  doctorName: 'NOBODY',
  specialty: 'Cardiologie & Médecine Générale',
  codeCNAM: '14-8859-01',
  matriculeFiscal: '1458923/A/M/000',
  address: '14, Avenue Habib Bourguiba, Appt 3B, El Menzah 6, Tunis',
  phone: '+216 71 234 567',
  mobile: '+216 98 112 233',
  email: 'contact@dr-benali.tn',
  smsApiKey: 'WINSMS_API_SECRET_KEY_PROD',
  whatsAppMode: 'web_direct',
  currency: 'TND',
  doctorPin: '1234',
  secretaryPin: '0000',
  configLocked: true
};

// Helper data for seed generation
const TUNISIAN_FIRST_NAMES = [
  'Amin', 'Mohamed', 'Sonia', 'Kamel', 'Amira', 'Anis', 'Fatma', 'Slim', 'Leila', 'Tarek',
  'Olfa', 'Youssef', 'Mehdi', 'Ines', 'Sami', 'Hela', 'Nabil', 'Meriam', 'Karim', 'Sarrah',
  'Walid', 'Rym', 'Marwen', 'Asma', 'Chafik', 'Dorra', 'Fares', 'Ghofrane', 'Hamza', 'Imen',
  'Jihed', 'Khaoula', 'Lotfi', 'Mona', 'Nizar', 'Oumaima', 'Ramzi', 'Sirine', 'Tahar', 'Wafa',
  'Yassin', 'Zeineb', 'Adel', 'Boutheina', 'Cyrine', 'Habib', 'Kalthoum', 'Mourad', 'Noura', 'Wissem'
];

const TUNISIAN_LAST_NAMES = [
  'Zairi', 'Trabelsi', 'Mansouri', 'Gharbi', 'Ben Romdhane', 'Dridi', 'Bouazizi', 'Hammami', 'Cherif', 'Rekik',
  'Chaabane', 'Ben Salem', 'Khelifi', 'Ayari', 'Jlassi', 'Mezhoud', 'Snoussi', 'Saidani', 'Ben Ammar', 'Louati',
  'Kouki', 'Slama', 'Jaziri', 'Ben Hassen', 'Masmoudi', 'Ghorbel', 'Ellouze', 'Karray', 'Triki', 'Abid',
  'Siala', 'Fakhfakh', 'Turki', 'Daoud', 'Bouhamed', 'Sellami', 'Fourati', 'Maatar', 'Kasraoui', 'Khemiri',
  'Nefzi', 'Garsallah', 'Mahfoudh', 'Rebai', 'Bedoui', 'Hamdi', 'Younes', 'Guirat', 'Baccouche', 'Koubaa'
];

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];
const MEDICAL_HISTORIES = [
  'Hypertension artérielle, Diabète Type 2',
  'Allergie à la Pénicilline',
  'Arythmie cardiaque, Traitement Sintrom',
  "Palpitations d'effort",
  'Hypercholestérolémie',
  'Insuffisance coronarienne, Carnet CNAM AP1',
  'Pontage aorto-coronarien (2022)',
  "Tachycardie sinusale d'origine anxieuse",
  'Porteur de Pacemaker (St Jude Medical)',
  'Souffle systolique, Échographie Doppler',
  'Asthme modéré, Allergie aux AINS',
  'Diabète de type 1 sous insuline'
];

export function generate50PatientsDataset() {
  const patients = [];
  const appointments = [];
  const prescriptions = [];
  const invoices = [];
  const reminders = [];
  const todayStr = new Date().toISOString().split('T')[0];

  for (let i = 0; i < 50; i++) {
    const fn = TUNISIAN_FIRST_NAMES[i % TUNISIAN_FIRST_NAMES.length];
    const ln = TUNISIAN_LAST_NAMES[i % TUNISIAN_LAST_NAMES.length];
    const fullName = `${fn} ${ln}`;
    const id = i === 0 ? 'pat-zairi' : `pat-sim-${i + 1}`;
    const phone = i === 0
      ? '+216 99 476 106'
      : `+216 ${[98, 22, 55, 94, 97, 26, 93, 50, 29][i % 9]} ${Math.floor(100 + Math.random() * 899)} ${Math.floor(100 + Math.random() * 899)}`;
    const cin = i === 0 ? '09947610' : `0${Math.floor(1000000 + Math.random() * 8999999)}`;
    const blood = BLOOD_GROUPS[i % BLOOD_GROUPS.length];
    const history = MEDICAL_HISTORIES[i % MEDICAL_HISTORIES.length];

    patients.push({
      id,
      fullName: i === 0 ? 'Zairi Amin' : fullName,
      phone,
      cin,
      dob: `19${60 + (i % 38)}-0${(i % 9) + 1}-15`,
      gender: i % 2 === 0 ? 'male' : 'female',
      bloodGroup: blood,
      medicalHistory: history,
      notes: `Patient simulé #${i + 1}. Auto WhatsApp activé.`,
      createdAt: todayStr
    });

    const hour = 8 + (i % 9);
    const minute = (i % 2 === 0) ? '00' : '30';
    const apptTime = `${hour < 10 ? '0' + hour : hour}:${minute}`;
    const dayOffset = Math.floor(i / 15);
    const apptDate = new Date(Date.now() + dayOffset * 86400000).toISOString().split('T')[0];
    const apptId = `apt-sim-${i + 1}`;
    const status = i % 5 === 0 ? 'pending' : i % 8 === 0 ? 'completed' : 'confirmed';

    appointments.push({
      id: apptId,
      patientId: id,
      patientName: i === 0 ? 'Zairi Amin' : fullName,
      phone,
      date: apptDate,
      time: apptTime,
      reason: i % 3 === 0 ? 'Échographie Cardiaque & ECG' : 'Consultation Suivi & Carnet CNAM',
      status
    });

    reminders.push({
      id: `auto-wa-sim-${i + 1}`,
      apptId,
      patientName: i === 0 ? 'Zairi Amin' : fullName,
      phone,
      apptDate,
      apptTime,
      channel: 'Auto WhatsApp (Simulated)',
      sentAt: `${todayStr} ${apptTime}`,
      status: 'Auto-Dispatched'
    });

    if (i < 25) {
      prescriptions.push({
        id: `ord-sim-${i + 1}`,
        patientId: id,
        patientName: i === 0 ? 'Zairi Amin' : fullName,
        cin,
        cnamRegime: i % 2 === 0 ? 'regimeAP1' : 'regimeOrdinary',
        cnamIdent: `CNAM-${cin}`,
        date: apptDate,
        medications: [
          { name: 'Concor 5mg', dosage: '1/j le matin', duration: '3 mois', substitutable: false },
          { name: 'Aspegic 100mg', dosage: '1 sachet/j', duration: '3 mois', substitutable: true }
        ]
      });
    }

    invoices.push({
      id: `inv-sim-${202600 + i + 1}`,
      patientId: id,
      patientName: i === 0 ? 'Zairi Amin' : fullName,
      date: apptDate,
      description: i % 2 === 0 ? 'Consultation Spécialisée' : 'Échographie Doppler & ECG',
      amount: i % 2 === 0 ? 60 : 110,
      paymentStatus: i % 4 === 0 ? 'pending' : 'paid',
      paymentMethod: i % 3 === 0 ? 'cnam' : i % 2 === 0 ? 'cash' : 'check'
    });
  }

  return { patients, appointments, reminders, prescriptions, invoices };
}

let memoryCache = {};

export function getStoredData(key, fallback) {
  if (memoryCache[key]) return memoryCache[key];
  try {
    const item = localStorage.getItem(key);
    const parsed = item ? JSON.parse(item) : fallback;
    memoryCache[key] = parsed;
    return parsed;
  } catch (e) {
    console.error('Error reading localStorage for key:', key, e);
    return fallback;
  }
}

export function setStoredData(key, value) {
  try {
    memoryCache[key] = value;
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error('Error writing localStorage for key:', key, e);
  }
}

// ---- User management helpers ----
export function createUser(email, password, role = 'secretary') {
  const users = getStoredData(STORAGE_KEYS.USERS, []);
  if (users.find(u => u.email === email)) {
    return { success: false, message: 'User already exists' };
  }
  const passwordHash = bcrypt.hashSync(password, 10);
  const newUser = { email, passwordHash, role };
  users.push(newUser);
  setStoredData(STORAGE_KEYS.USERS, users);
  return { success: true, user: newUser };
}

export async function validateUser(email, password) {
  const users = getStoredData(STORAGE_KEYS.USERS, []);
  const user = users.find(u => u.email === email);
  if (!user) return null;
  const match = await bcrypt.compare(password, user.passwordHash);
  return match ? { email: user.email, role: user.role } : null;
}

export function initializeDatabase(forceReset = false) {
  const dataset = generate50PatientsDataset();

  if (forceReset || !localStorage.getItem(STORAGE_KEYS.CLINIC_CONFIG)) {
    setStoredData(STORAGE_KEYS.CLINIC_CONFIG, DEFAULT_CONFIG);
  }
  if (forceReset || !localStorage.getItem(STORAGE_KEYS.PATIENTS) || JSON.parse(localStorage.getItem(STORAGE_KEYS.PATIENTS)).length < 50) {
    setStoredData(STORAGE_KEYS.PATIENTS, dataset.patients);
    setStoredData(STORAGE_KEYS.APPOINTMENTS, dataset.appointments);
    setStoredData(STORAGE_KEYS.REMINDERS, dataset.reminders);
    setStoredData(STORAGE_KEYS.PRESCRIPTIONS, dataset.prescriptions);
    setStoredData(STORAGE_KEYS.INVOICES, dataset.invoices);
  }
  if (forceReset || !localStorage.getItem(STORAGE_KEYS.LANGUAGE)) {
    setStoredData(STORAGE_KEYS.LANGUAGE, 'fr');
  }
  // Seed default users if missing
  if (forceReset || !localStorage.getItem(STORAGE_KEYS.USERS)) {
    const defaultUsers = [
      { email: 'doc', passwordHash: bcrypt.hashSync('1234', 10), role: 'doctor' },
      { email: 'sec', passwordHash: bcrypt.hashSync('0000', 10), role: 'secretary' },
      { email: 'admin', passwordHash: bcrypt.hashSync('joulaine12!@', 10), role: 'admin' },
      { email: 'admin2', passwordHash: bcrypt.hashSync('joulaine12!@', 10), role: 'admin' },
      { email: 'admin3', passwordHash: bcrypt.hashSync('joulaine12!@', 10), role: 'admin' }
    ];
    setStoredData(STORAGE_KEYS.USERS, defaultUsers);
  }
}

export function exportFullDatabaseBackup() {
  const dataset = generate50PatientsDataset();
  const dbExport = {
    app: 'ClinicOS Tunisia',
    version: '1.0.0',
    exportDate: new Date().toISOString(),
    config: getStoredData(STORAGE_KEYS.CLINIC_CONFIG, DEFAULT_CONFIG),
    patients: getStoredData(STORAGE_KEYS.PATIENTS, dataset.patients),
    appointments: getStoredData(STORAGE_KEYS.APPOINTMENTS, dataset.appointments),
    reminders: getStoredData(STORAGE_KEYS.REMINDERS, dataset.reminders),
    prescriptions: getStoredData(STORAGE_KEYS.PRESCRIPTIONS, dataset.prescriptions),
    invoices: getStoredData(STORAGE_KEYS.INVOICES, dataset.invoices)
  };
  const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(dbExport, null, 2));
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute('href', dataStr);
  downloadAnchor.setAttribute('download', `ClinicOS_Tunisia_Backup_50Patients_${new Date().toISOString().split('T')[0]}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
}

export function importDatabaseBackup(jsonData) {
  try {
    const parsed = typeof jsonData === 'string' ? JSON.parse(jsonData) : jsonData;
    memoryCache = {};
    if (parsed.config) setStoredData(STORAGE_KEYS.CLINIC_CONFIG, parsed.config);
    if (parsed.patients) setStoredData(STORAGE_KEYS.PATIENTS, parsed.patients);
    if (parsed.appointments) setStoredData(STORAGE_KEYS.APPOINTMENTS, parsed.appointments);
    if (parsed.reminders) setStoredData(STORAGE_KEYS.REMINDERS, parsed.reminders);
    if (parsed.prescriptions) setStoredData(STORAGE_KEYS.PRESCRIPTIONS, parsed.prescriptions);
    if (parsed.invoices) setStoredData(STORAGE_KEYS.INVOICES, parsed.invoices);
    return true;
  } catch (err) {
    console.error('Failed to parse backup JSON file', err);
    return false;
  }
}

export { STORAGE_KEYS };

// ---- Security helper functions ----
/**
 * Get lock information (failed attempts count and lock expiry).
 * Returns an object { count: number, lockedUntil: number | null }.
 */
export function getLockInfo() {
  const defaultInfo = { count: 0, lockedUntil: null };
  return getStoredData(STORAGE_KEYS.LOCK, defaultInfo);
}

/**
 * Update lock information in storage.
 * @param {Object} info - { count: number, lockedUntil: number | null }
 */
export function setLockInfo(info) {
  setStoredData(STORAGE_KEYS.LOCK, info);
}

