import * as Notifications from 'expo-notifications';
import { v4 as uuidv4 } from 'uuid';
import { Reminder } from '../types';
import LocalStorageService from './LocalStorageService';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

const REMINDERS_KEY = '@reminders';

class ReminderService {
  static async requestPermissions() {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    return finalStatus === 'granted';
  }

  private static subtractMinutes(hour: number, minute: number, minutesToSubtract: number): { hour: number, minute: number } {
    let newMinute = minute - minutesToSubtract;
    let newHour = hour;

    while (newMinute < 0) {
      newMinute += 60;
      newHour -= 1;
    }

    if (newHour < 0) {
      newHour += 24;
    }

    return { hour: newHour, minute: newMinute };
  }

  static async scheduleReminder(title: string, body: string, hour: number, minute: number, weekdays: number[] = []) {
    const hasPermission = await this.requestPermissions();
    if (!hasPermission) return null;

    const notificationsToSchedule = [
      { offset: 10, sound: false, suffix: '(Em 10 min)' },
      { offset: 5, sound: false, suffix: '(Em 5 min)' },
      { offset: 0, sound: true, suffix: '' },
    ];

    const ids = [];

    for (const { offset, sound, suffix } of notificationsToSchedule) {
      const time = this.subtractMinutes(hour, minute, offset);
      
      const trigger: Notifications.NotificationTriggerInput = {
        type: Notifications.SchedulableTriggerInputTypes.CALENDAR,
        hour: time.hour,
        minute: time.minute,
        repeats: true,
      };

      const id = await Notifications.scheduleNotificationAsync({
        content: {
          title: suffix ? `${title} ${suffix}` : title,
          body,
          sound,
        },
        trigger,
      });
      ids.push(id);
    }

    return ids[ids.length - 1]; // Return the ID of the main notification
  }

  static async addReminder(reminder: Omit<Reminder, 'id' | 'takenDates'>): Promise<Reminder> {
    const reminders = await this.getReminders();
    
    // Parse time string "HH:mm"
    const [hour, minute] = reminder.time.split(':').map(Number);
    
    // Schedule notification
    const notificationId = await this.scheduleReminder(
      'Hora do Medicamento',
      `Está na hora de tomar ${reminder.medicationName}`,
      hour,
      minute
    );

    const newReminder: Reminder = {
      ...reminder,
      id: uuidv4(),
      takenDates: [],
    };

    const updatedReminders = [...reminders, newReminder];
    await LocalStorageService.setItem(REMINDERS_KEY, updatedReminders);
    
    return newReminder;
  }

  static async getReminders(): Promise<Reminder[]> {
    const stored = await LocalStorageService.getItem<Reminder[]>(REMINDERS_KEY);
    return stored || [];
  }

  static async deleteReminder(id: string): Promise<void> {
    const reminders = await this.getReminders();
    const updatedReminders = reminders.filter(r => r.id !== id);
    await LocalStorageService.setItem(REMINDERS_KEY, updatedReminders);
    // Note: In a real app we should also cancel the scheduled notification using its ID
  }
}

export default ReminderService;
