import type { z } from 'zod'
import type { TNotificationItem } from '../notification'

import { FormSchemaCtrl } from './ctrl'


/**
 * Интерфейс базовой формы для сущностей в БД.
 */
export interface IFormModel<T> {
	_id: string

	dateCreate?: Date
	dateUpdate?: Date
	title?: string

	obj: T
	ctrls: FormSchemaCtrl[]

	_errors: {[PropKey in keyof T]?: string}
	errors: TNotificationItem[]

	isValid(): boolean
	setValidError(code: string, text: string): void
}

/**
 * Базовая модель для валидирования форм.
 */
export class BaseFormModel<T extends object = {}> implements IFormModel<T> {
	_id: string

	dateCreate?: Date
	dateUpdate?: Date
	title?: string

	obj: T
	schema: z.ZodObject<z.ZodRawShape>
	ctrls: FormSchemaCtrl[] = []

	_errors: {[PropKey in keyof T]?: string} = {}

	constructor(obj: any = {}, schema: z.ZodObject<z.ZodRawShape>) {
		this._id = obj._id || 'create'
		delete obj._id

		if (obj.dateCreate) {
			try {
				this.dateCreate = new Date(obj.dateCreate)
				delete obj.dateCreate
			} catch (_) {}
		}

		if (obj.dateUpdate) {
			try {
				this.dateUpdate = new Date(obj.dateUpdate)
				delete obj.dateUpdate
			} catch (_) {}
		}

		this.obj = obj
		this.schema = schema

		// Создаём контролы.
		for (const key in this.schema.shape) {
			this.ctrls.push(new FormSchemaCtrl({ key }, this.schema.shape[key]))
		}

		// Заголовок.
		if (this.schema.description) this.title = this.schema.description
	}

	get errors() {
		let items: TNotificationItem[] = []
		for (const code in this._errors) {
			const text = this._errors[code]
			items.push({ code, text })
		}
		return items
	}

	isValid() {
		this._errors = {}

		try {
			this.obj = this.schema.parse(this.obj) as T
			return true
		} catch (ex) {
			const error = ex as z.ZodError
			for (const issues of error.issues) {
				this.setValidError(issues.path.toString(), issues.message)
			}
			return false
		}
	}

	setValidError(code: string, text: string) {
		this._errors[code] = code + ' - ' + text
	}
}
