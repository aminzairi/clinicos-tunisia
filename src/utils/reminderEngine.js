// Automated Reminder Engine for ClinicOS Tunisia (SMS & WhatsApp Automation)

import { getStoredData, setStoredData, STORAGE_KEYS } from './storage';

export const AUTOMATION_DEFAULTS = {
  enabled: true,
  leadHours: 24, // 24 hours before appointment
  sendTimeWindow: '08:00', // Preferred daily auto-send time
  preferredChannel: 'whatsapp', // 'whatsapp' or 'sms'
  language: 'fr', // 'fr' or 'ar'
  lastAutoCheck: null,
  autoDispatchedCount: 3
};

// Check if an appointment qualifies for automated reminder
export function isAppointmentDueForReminder(appt, settings = AUTOMATION_DEFAULTS) {
  if (appt.status !== 'confirmed' && appt.status !== 'pending') return false;

  const apptDateTime = new Date(`${appt.date}T${appt.time || '09:00'}:00`);
  const now = new Date();

  // Difference in hours
  const diffMs = apptDateTime.getTime() - now.getTime();
  const diffHours = diffMs / (1000 * 60 * 60);

  // Qualifies if appointment is within leadHours (e.g. <= 24 hours away) and in future (>= 0)
  return diffHours > 0 && diffHours <= settings.leadHours;
}

// Perform automated check and auto-dispatch reminders
export function runAutomatedReminderCheck(appointments, reminders, clinicConfig, settings) {
  if (!settings.enabled) return { dispatched: [], updatedReminders: reminders };

  const nowStr = new Date().toLocaleString();
  const dueAppointments = appointments.filter(a => isAppointmentDueForReminder(a, settings));

  const newlyDispatched = [];
  const updatedReminders = [...reminders];

  dueAppointments.forEach(appt => {
    // Check if reminder was already sent for this appointment
    const alreadySent = updatedReminders.some(r => r.apptId === appt.id || (r.patientName === appt.patientName && r.apptDate === appt.date));

    if (!alreadySent) {
      const channelLabel = settings.preferredChannel === 'whatsapp' ? 'Auto WhatsApp' : 'Auto SMS (WinSMS)';
      const lang = settings.language || 'fr';

      const textFR = `[RAPPEL AUTOMATIQUE] Bonjour ${appt.patientName}, votre RDV médical avec le Dr. ${clinicConfig.doctorName || 'Youssef Ben Ali'} est prévu le ${appt.date} à ${appt.time}. Répondez 1 pour confirmer.`;
      const textAR = `[تذكير آلي] مرحباً ${appt.patientName}، موعدكم الطبي مع د. ${clinicConfig.doctorName || 'يوسف بن علي'} مبرمج يوم ${appt.date} على الساعة ${appt.time}.`;

      const messageContent = lang === 'ar' ? textAR : textFR;

      const newLog = {
        id: `auto-rem-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        apptId: appt.id,
        patientName: appt.patientName,
        phone: appt.phone,
        apptDate: appt.date,
        apptTime: appt.time,
        channel: channelLabel,
        message: messageContent,
        sentAt: nowStr,
        status: 'Auto-Dispatched'
      };

      updatedReminders.unshift(newLog);
      newlyDispatched.push(newLog);
    }
  });

  return {
    dispatched: newlyDispatched,
    updatedReminders
  };
}
