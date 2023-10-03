export type TNotificationItem = {
	code: string
	text: string
}

export class NotificationItem implements TNotificationItem {
	code: string
	text: string

	constructor(args: { text: string, code?: string  }) {
		this.text = args.text
		this.code = args.code || 'info'
	}
}
