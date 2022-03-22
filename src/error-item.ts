import { TNotificationItem } from '.'

/**
 * Класс модели элемента ошибки.
 */
export default class NotificationItem implements TNotificationItem {
  constructor(public text: string, public code: string = 'info') {}
}
