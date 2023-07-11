import type { z } from 'zod'

export type TFormSchemaCtrlArgs = {
	key?: string
	type?: string
	label?: string
	component?: string

	hidden?: boolean
	description?: string
	readonly?: boolean
	multiple?: boolean
	disabled?: boolean
	cssClass?: string
}

export class FormSchemaCtrl {
	key: string
	type: string
	label: string
	component: string

	hidden?: boolean
	description?: string
	readonly?: boolean
	multiple?: boolean
	disabled?: boolean
	cssClass?: string

	static toString(ctrl: TFormSchemaCtrlArgs, description?: string) {
		let result = ''
		try {
			if (description) {
				const descObj = JSON.parse(description)
				ctrl = Object.assign(descObj, ctrl)
			}
			result = JSON.stringify(ctrl)
		} catch (ex) {}

		return result
	}

	constructor(args: TFormSchemaCtrlArgs, shape: z.ZodTypeAny) {
		let desc: any = {}

		try {
			if (shape.description) {
				desc = JSON.parse(shape.description)
			} else {
				desc = JSON.parse(shape?._def?.innerType?._def?.description || '{}')
			}
		} catch (ex: any) {
			desc = { label: shape.description || 'Unknown' }
		}

		this.key = desc.key || args.key || 'unknown'
		this.label = desc.label || args.label || 'Label'

		// Тип.
		this.type = desc.type || args.type

		if (!this.type && shape) {
			if (
				shape?._def?.innerType?._def?.innerType?._def?.schema?._def?.typeName
			) {
				this.type =
					shape?._def?.innerType?._def?.innerType?._def?.schema?._def?.typeName
			}

			if (shape._def?.innerType?._def?.innerType?._def?.typeName) {
				this.type = shape?._def?.innerType?._def?.innerType._def.typeName
			}

			if (shape._def.innerType?._def?.schema?._def?.typeName) {
				this.type = shape._def.innerType?._def?.schema?._def?.typeName
			}

			if (shape._def.innerType?._def?.typeName) {
				this.type = shape._def.innerType._def.typeName
			}

			if (shape._def.schema?._def?.typeName) {
				this.type = shape._def.schema._def.typeName
			}

			if (!this.type) {
				this.type = shape._def.typeName
			}
		}

		// Переименовываем тип.
		switch (this.type) {
			case 'ZodString':
				this.type = 'string'
				break
			case 'ZodNumber':
				this.type = 'number'
				break
			case 'ZodBoolean':
				this.type = 'boolean'
				break
			case 'ZodArray':
				this.type = 'array'
				break
			case 'ZodDate':
				this.type = 'date'
				break
		}

		// Компонент.
		this.component = desc.component || args.component
		if (!this.component) {
			switch (this.type) {
				case 'string':
					this.component = 'ui-field-text'
					break
				case 'number':
					this.component = 'ui-field-number'
					break
				case 'boolean':
					this.component = 'ui-field-checkbox'
					break
				case 'date':
					this.component = 'ui-field-date'
					break
				default:
					this.component = 'ui-field'
			}
		}

		// Не обязательные.
		this.hidden = desc.hidden || args.hidden
		this.description = desc.description || args.description
		this.readonly = desc.readonly || args.readonly
		this.multiple = desc.multiple || args.multiple
		this.disabled = desc.disabled || args.disabled
		this.cssClass = desc.cssClass || args.cssClass
	}
}
