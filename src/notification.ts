export type TNotificationItem = {
	code: string
	text: string
}

export class NotificationItem implements TNotificationItem {
	code: string
	text: string

	constructor(args: { code: string; text: string }) {
		this.code = args.code
		this.text = args.text
	}
}
