import * as Notifications from 'expo-notifications';

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
    if (!hasPermission) return [];

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

    return ids;
  }

  static async scheduleMedicationReminders(medication: { id: string; name: string; times: string[] }) {
    // Cancel existing reminders for this medication (if we were tracking them, but for now we might just rely on the user managing them or simple overwrite if we had IDs)
    // In a real app, we'd store the notification IDs linked to the medication ID.
    // For this implementation, we will just schedule new ones.
    
    for (const time of medication.times) {
      const [hour, minute] = time.split(':').map(Number);
      await this.scheduleReminder(
        'Hora do Medicamento',
        `Está na hora de tomar ${medication.name}`,
        hour,
        minute
      );
    }
  }

  static async cancelAllReminders() {
    await Notifications.cancelAllScheduledNotificationsAsync();
  }
}

export default ReminderService;
