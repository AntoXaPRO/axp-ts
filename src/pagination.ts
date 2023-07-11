import { z } from 'zod'
import { cFieldsSchema, fieldSchema } from './form'

export const paginationSchema = z.object({
	page: fieldSchema(cFieldsSchema.shape.number, {
		label: 'Номер страницы'
	}),
	limit: fieldSchema(cFieldsSchema.shape.number, {
		label: 'Лимит на странице'
	}),
	total: fieldSchema(cFieldsSchema.shape.number, {
		label: 'Общее кол-во'
	}),
	skip: fieldSchema(cFieldsSchema.shape.number, {
		label: 'Пропустить'
	}),
	pages: fieldSchema(cFieldsSchema.shape.number, {
		label: 'Кол-во всех страниц'
	})
})

export type TPagination = z.infer<typeof paginationSchema>

// Константы.
const DEFAULTS = { page: 1, limit: 10, maxLimit: 100 }

export type TPaginationParseArg = number | string | undefined

export type TPaginationArguments = {
	page?: TPaginationParseArg
	limit?: TPaginationParseArg
	total?: number
}

export interface IPagination extends TPagination {
	/**
	 * Максимальный лимит элементов.
	 */
	get maxLimit(): number

	/**
	 * Парсинг аргументов.
	 * @param arg - Значение аргумента для парсинга.
	 * @param defaultReturnValue - Возвращаемое значение по умолчанию.
	 * @returns Возвращает абсолютное значение числа аргумента.
	 */
	parseArg(
		arg: number | string | undefined,
		defaultReturnValue: number
	): number

	/**
	 * Присваивает значения для основных свойств класса и считает кол-во
	 * пропускаемых элементов в зависимости от полученных аргументов.
	 * @param args - Аргументы пагинации.
	 * @returns Возвращает текущий экземпляр класса.
	 */
	set(args: TPaginationArguments): this

	/**
	 * Возвращает простой объект пагинации.
	 * @returns Объект пагинации.
	 */
	toObject(): TPagination
}

export class Pagination implements IPagination {
	/**
	 * Максимальный лимит элементов.
	 */
	private _maxLimit: number

	page: number = DEFAULTS.page
	limit: number = DEFAULTS.limit

	skip: number = 0
	total: number = 0
	pages: number = 0

	static parseArg(
		arg: TPaginationParseArg,
		defaultReturnValue: number
	): number {
		return Math.abs(
			typeof arg === 'string'
				? Number.parseInt(arg) || defaultReturnValue
				: arg || defaultReturnValue
		)
	}

	constructor(args: TPaginationArguments = {}, maxLimit?: number) {
		this._maxLimit = this.parseArg(maxLimit, DEFAULTS.maxLimit)
		this.set(args)
	}

	get maxLimit() {
		return this._maxLimit
	}

	parseArg(arg: TPaginationParseArg, defaultReturnValue: number): number {
		return Pagination.parseArg(arg, defaultReturnValue)
	}

	set(args: TPaginationArguments = {}): this {
		let isCalcSkip: boolean = false

		// Страница.
		if (args.page && args.page !== this.page) {
			// Инициализипуем страницу.
			this.page = this.parseArg(args.page, DEFAULTS.page)
			isCalcSkip = true
		}

		// Лимит.
		if (args.limit && args.limit !== this.limit) {
			this.limit = this.parseArg(args.limit, this.limit)
			isCalcSkip = true
		}

		// Проверка лимита.
		if (this.limit > this.maxLimit) this.limit = this.maxLimit

		// Общее кол-во.
		if (args.total && args.total !== this.total) {
			this.total = Math.abs(args.total)
			this.pages = Math.ceil(this.total / this.limit)
		}

		// Перерасчёт пропускаемых элементов.
		if (isCalcSkip) {
			let skip = 0
			try {
				skip = (this.page - 1) * this.limit
			} catch (ex: any) {}
			this.skip = skip > 0 ? skip : 0
		}

		return this
	}

	toObject(): TPagination {
		return {
			page: this.page,
			limit: this.limit,
			total: this.total,

			skip: this.skip,
			pages: this.pages
		}
	}
}
