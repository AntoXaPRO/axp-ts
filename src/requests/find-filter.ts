import type { TPaginationQuery } from './pagination'

import { z } from 'zod'
import { isEqual } from '../utils'
import { Pagination, paginationQuerySchema } from './pagination'
import { bFieldsSchema, cFieldsSchema, fieldSchema } from '../forms'

export const querySchema = cFieldsSchema
	.pick({ q: true })
	.extend(paginationQuerySchema.shape)
	.extend({
		sort: fieldSchema(bFieldsSchema.string.min(1).max(64), {
			label: 'Сортировка'
		})
	})
	.partial()
	.describe('Параметры базового запроса')

export type TQuery = z.infer<typeof querySchema>

/**
 * Класс для работы с запросами (для удобства).
 */
export type TFindFilter<T extends TQuery> = {
	obj?: Omit<T, 'page' | 'limit' | 'sort'>
	pagination?: TPaginationQuery
	sort?: string
}

/**
 * Класс для работы с запросами (для удобства).
 */
export class FindFilter<T extends TQuery> implements TFindFilter<T> {
	obj?: Omit<T, 'page' | 'limit' | 'sort'>
	pagination?: TPaginationQuery
	sort?: string

	static getQuery<T extends TQuery>(filter: TFindFilter<T>): T {
		return Object.assign(
			{ ...filter.obj, ...filter.pagination },
			{ sort: filter.sort }
		) as T
	}

	static parse<T extends TQuery>(filter: TFindFilter<T>): FindFilter<T> {
		return new FindFilter<T>(this.getQuery(filter))
	}

	constructor(query?: T) {
		// Copy fiends.
		let queryCopy: T = Object.assign({}, query)

		// Pagination.
		this.pagination = new Pagination(queryCopy).getQuery()
		// Delete pagination fields.
		if (this.pagination as TPaginationQuery) {
			const paginationKeys = Object.keys(this.pagination) as [keyof T]
			for (const key of paginationKeys) {
				if (queryCopy[key]) delete queryCopy[key]
			}
		}

		// Sort.
		if (queryCopy.sort) {
			this.sort = queryCopy.sort
			delete queryCopy.sort
		}

		// Obj.
		this.obj = queryCopy
	}

	/**
	 * @deprecated.
	 */
	setPagination(pagination?: TPaginationQuery) {
		this.pagination = new Pagination(pagination).getQuery()
	}

	toObject(): TFindFilter<T> {
		return {
			obj: this.obj,
			pagination: this.pagination,
			sort: this.sort
		}
	}

	toString(opt?: { base?: string }): string {
		let url = opt?.base?.replace(/[?]$/, '') || ''

		const query: string[] = []

		// Params and Pagination.
		for (const [key, val] of Object.entries({
			...this.obj,
			...this.pagination
		})) {
			if (val) {
				const keyEncode = encodeURIComponent(key)
				const valEncode = encodeURIComponent(val)
				query.push(keyEncode + '=' + valEncode)
			}
		}

		// Sort.
		if (this.sort) {
			try {
				query.push('sort=' + encodeURIComponent(this.sort))
			} catch (e) {}
		}

		if (query.length) {
			url += '?' + query.join('&')
		}

		return url
	}

	isEqual(filters: TFindFilter<T>[]) {
		return isEqual([this, ...filters])
	}
}
