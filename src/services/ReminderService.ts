import type * as NotificationsType from 'expo-notifications';
import LocalStorageService from './LocalStorageService';

// Notifications.setNotificationHandler is moved to init() to avoid immediate crash in Expo Go if unsupported

const REMINDERS_KEY = '@reminders';

class ReminderService {
  private static isInitialized = false;
  private static Notifications: typeof NotificationsType | null = null;

  private static async getNotifications() {
    if (this.Notifications) return this.Notifications;
    try {
      // Dynamically import expo-notifications to avoid crash on load in Expo Go
      this.Notifications = await import('expo-notifications');
      return this.Notifications;
    } catch (error) {
      console.warn("expo-notifications is not available:", error);
      return null;
    }
  }

  static async init() {
    if (this.isInitialized) return;
    const Notifications = await this.getNotifications();
    if (!Notifications) return;

    try {
      Notifications.setNotificationHandler({
        handleNotification: async () => ({
          shouldShowAlert: true,
          shouldPlaySound: true,
          shouldSetBadge: false,
          shouldShowBanner: true,
          shouldShowList: true,
        }),
      });
      this.isInitialized = true;
    } catch (error) {
      console.warn("Failed to initialize notifications:", error);
    }
  }

  static async requestPermissions() {
    await this.init();
    const Notifications = await this.getNotifications();
    if (!Notifications) return false;

    try {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      return finalStatus === 'granted';
    } catch (error) {
      console.warn("Notification permissions error:", error);
      return false;
    }
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
    if (!hasPermission) return [];

    const Notifications = await this.getNotifications();
    if (!Notifications) return [];

    const notificationsToSchedule = [
      { offset: 10, sound: false, suffix: '(Em 10 min)' },
      { offset: 5, sound: false, suffix: '(Em 5 min)' },
      { offset: 0, sound: true, suffix: '' },
    ];

    const ids = [];

    for (const { offset, sound, suffix } of notificationsToSchedule) {
      const time = this.subtractMinutes(hour, minute, offset);
      
      const trigger: NotificationsType.NotificationTriggerInput = {
        type: Notifications.SchedulableTriggerInputTypes.CALENDAR,
        hour: time.hour,
        minute: time.minute,
        repeats: true,
      };

      try {
        const id = await Notifications.scheduleNotificationAsync({
          content: {
            title: suffix ? `${title} ${suffix}` : title,
            body,
            sound,
          },
          trigger,
        });
        ids.push(id);
      } catch (e) {
        console.warn("Failed to schedule notification", e);
      }
    }

    return ids;
  }

  static async getNotificationIds(medicationId: string): Promise<string[]> {
    const mapping = await LocalStorageService.getItem<Record<string, string[]>>('@notification_mapping') || {};
    return mapping[medicationId] || [];
  }

  static async saveNotificationIds(medicationId: string, ids: string[]) {
    const mapping = await LocalStorageService.getItem<Record<string, string[]>>('@notification_mapping') || {};
    mapping[medicationId] = ids;
    await LocalStorageService.setItem('@notification_mapping', mapping);
  }

  static async cancelRemindersForMedication(medicationId: string) {
    const Notifications = await this.getNotifications();
    if (!Notifications) return;

    const ids = await this.getNotificationIds(medicationId);
    for (const id of ids) {
      try {
        await Notifications.cancelScheduledNotificationAsync(id);
      } catch (e) {
        console.warn(`Failed to cancel notification ${id}`, e);
      }
    }
    await this.saveNotificationIds(medicationId, []);
  }

  static async scheduleMedicationReminders(medication: { id: string; name: string; times: string[] }) {
    // First, cancel any existing reminders for this medication
    await this.cancelRemindersForMedication(medication.id);
    
    const allIds: string[] = [];
    
    for (const time of medication.times) {
      const [hour, minute] = time.split(':').map(Number);
      const ids = await this.scheduleReminder(
        'Hora do Medicamento',
        `Está na hora de tomar ${medication.name}`,
        hour,
        minute
      );
      allIds.push(...ids);
    }

    // Save the new IDs
    await this.saveNotificationIds(medication.id, allIds);
  }

  static async cancelAllReminders() {
    const Notifications = await this.getNotifications();
    if (!Notifications) return;

    try {
      await Notifications.cancelAllScheduledNotificationsAsync();
      await LocalStorageService.setItem('@notification_mapping', {});
    } catch (error) {
      console.warn("Error canceling reminders:", error);
    }
  }
}

export default ReminderService;
