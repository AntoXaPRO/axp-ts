import { z } from 'zod'
import { cFieldsSchema, fieldSchema } from '../forms'

export const paginationSchema = cFieldsSchema
	.pick({
		page: true,
		limit: true
	})
	.extend({
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
	.describe('Пагинация')

export type TPagination = z.infer<typeof paginationSchema>

export const paginationQuerySchema = paginationSchema.pick({
	page: true, limit: true
})

export type TPaginationQuery = z.infer<typeof paginationQuerySchema>

// Константы.
const DEFAULTS = { page: 1, limit: 10, maxLimit: 100 }

export type TPaginationParseArg = number | string | undefined

export type TPaginationArguments = {
	page?: TPaginationParseArg
	limit?: TPaginationParseArg
	total?: number
}

export class Pagination implements TPagination {
	/**
	 * Максимальный лимит элементов.
	 */
	#maxLimit: number

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
		this.#maxLimit = this.parseArg(maxLimit, DEFAULTS.maxLimit)
		this.set(args)
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
		if (this.limit > this.#maxLimit) this.limit = this.#maxLimit

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
