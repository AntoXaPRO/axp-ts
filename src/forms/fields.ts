import type { ZodTypeAny } from 'zod'
import type { TFormSchemaCtrlArgs } from './ctrl'

import { z } from 'zod'
import { GenderEnum } from '../entities'
import {
	getPhoneNumberValue,
	regexFIO,
	validPhoneNumber,
	regexSearch,
	regexId
} from './helpers'
import { FormSchemaCtrl } from './ctrl'

/**
 * Create field schema.
 */
export const fieldSchema = <T extends ZodTypeAny>(
	base: T,
	args?: TFormSchemaCtrlArgs
) => base.describe(FormSchemaCtrl.toString(args, base.description))

/**
 * Base fields schema.
 */
export const bFieldsSchema = {
	number: z
		.preprocess(value => Number(value), z.number())
		.describe(
			FormSchemaCtrl.toString({
				label: 'Номер',
				type: 'number',
				component: 'ui-field-number'
			})
		),
	string: z
		.string()
		.trim()
		.describe(
			FormSchemaCtrl.toString({
				label: 'Строка',
				type: 'string',
				component: 'ui-field-text'
			})
		),
	date: z
		.preprocess(value => new Date(String(value)), z.date())
		.describe(
			FormSchemaCtrl.toString({
				label: 'Дата',
				type: 'date',
				component: 'ui-field-date'
			})
		),
	boolean: z
		.preprocess(value => String(value) === 'true', z.boolean())
		.describe(
			FormSchemaCtrl.toString({
				label: 'Логическое значение',
				type: 'boolean',
				component: 'ui-field-checkbox'
			})
		)
}

/**
 * Common fields schema.
 */
export const cFieldsSchema = z.object({
	...bFieldsSchema,
	_id: fieldSchema(bFieldsSchema.string.regex(regexId, 'Не валидный ID'), {
		label: 'ID'
	}),
	dateCreate: fieldSchema(bFieldsSchema.date, {
		label: 'Дата создания'
	}),
	dateUpdate: fieldSchema(bFieldsSchema.date, {
		label: 'Дата изменения'
	}),
	name: fieldSchema(bFieldsSchema.string, {
		label: 'Название'
	}),
	title: fieldSchema(bFieldsSchema.string, {
		label: 'Заголовок'
	}),
	comment: fieldSchema(z.string().trim().min(2).max(1000), {
		label: 'Комментарий',
		component: 'ui-field-text-area'
	}),
	description: fieldSchema(z.string().trim().min(2).max(1000), {
		label: 'Описание',
		component: 'ui-field-text-area'
	}),
	text: fieldSchema(z.string().trim().min(2).max(3000), {
		label: 'Текст',
		component: 'ui-field-text-area'
	}),
	login: fieldSchema(bFieldsSchema.string, {
		label: 'Логин'
	}),
	email: fieldSchema(bFieldsSchema.string.email(), {
		label: 'Email'
	}),
	password: fieldSchema(bFieldsSchema.string.min(6), {
		label: 'Пароль',
		component: 'ui-field-password'
	}),
	price: fieldSchema(
		z.preprocess(val => Number(val), z.number().nonnegative()),
		{ label: 'Стоимость' }
	),
	alias: fieldSchema(
		bFieldsSchema.string
			.toLowerCase()
			.regex(/^[a-z-]+$/, 'Только латиница и тире "-"'),
		{ label: 'Псевдоним' }
	),
	published: fieldSchema(bFieldsSchema.boolean, {
		label: 'Опубликован(а)'
	}),
	active: fieldSchema(bFieldsSchema.boolean, {
		label: 'Активный(ная)'
	}),
	enabled: fieldSchema(bFieldsSchema.boolean, {
		label: 'Включен(а)'
	}),
	disabled: fieldSchema(bFieldsSchema.boolean, {
		label: 'Отключен(а)'
	}),
	open: fieldSchema(bFieldsSchema.boolean, {
		label: 'Открыт(а)'
	}),
	close: fieldSchema(bFieldsSchema.boolean, {
		label: 'Закрыто'
	}),
	closed: fieldSchema(bFieldsSchema.boolean, {
		label: 'Закрыт(а)'
	}),
	online: fieldSchema(bFieldsSchema.boolean, {
		label: 'Онлайн'
	}),
	firstName: fieldSchema(
		bFieldsSchema.string.regex(regexFIO, 'Только кириллица'),
		{ label: 'Имя' }
	),
	middleName: fieldSchema(
		bFieldsSchema.string.regex(regexFIO, 'Только кириллица'),
		{ label: 'Отчество' }
	),
	lastName: fieldSchema(
		bFieldsSchema.string.regex(regexFIO, 'Только кириллица'),
		{ label: 'Фамилия' }
	),
	birthday: fieldSchema(bFieldsSchema.date, {
		label: 'Дата рождения'
	}),
	phone: fieldSchema(
		z
			.preprocess(val => getPhoneNumberValue(val) || 0, bFieldsSchema.number)
			.refine(val => validPhoneNumber(val), {
				message: 'Не вервый формат номера телефона'
			}),
		{
			label: 'Телефон',
			component: 'ui-field-phone'
		}
	),
	gender: fieldSchema(z.enum([GenderEnum.man, GenderEnum.woman]), {
		label: 'Пол',
		component: 'ui-field-select-gender'
	}),
	year: fieldSchema(bFieldsSchema.number, {
		label: 'Год'
	}),
	days: fieldSchema(bFieldsSchema.number.array(), {
		label: 'Дни недели',
		component: 'ui-picker-days'
	}),
	q: fieldSchema(
		z.preprocess(
			val => String(val).replace(regexSearch, ''),
			bFieldsSchema.string
		),
		{
			label: 'Поиск',
			component: 'ui-field-search'
		}
	),
	page: fieldSchema(
		z.preprocess(val => Math.abs(Number(val)), bFieldsSchema.number),
		{ label: 'Страница' }
	),
	limit: fieldSchema(
		z.preprocess(val => Math.abs(Number(val)), bFieldsSchema.number),
		{ label: 'Лимит' }
	)
})
