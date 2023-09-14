import type { TPagination } from './pagination'

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

export type TQuery = z.infer<typeof querySchema>

/**
 * Объект для преобразования фильтра в URL.
 */
export type TFindFilter<T extends TQuery> = {
	obj?: Omit<T, 'page' | 'limit' | 'sort'>
	pagination?: TPagination
	sort?: string
}

export class FindFilter<T extends TQuery> implements TFindFilter<T> {
	obj?: Omit<T, 'page' | 'limit' | 'sort'>
	pagination?: TPagination
	sort?: string

	constructor(query?: T) {
		let queryCopy = Object.assign({}, query)

		// Pagination.
		this.setPagination(queryCopy)
		for (const key of Object.keys(this.pagination)) {
			if (queryCopy[key]) delete queryCopy[key]
		}

		// Sort.
		if (queryCopy.sort) {
			this.sort = queryCopy.sort
			delete queryCopy.sort
		}

		// Obj.
		this.obj = queryCopy
	}

	setPagination(pagination?: TPagination) {
		this.pagination = new Pagination(pagination).toObject()
	}

	static getQuery <T extends TQuery = {}>(filter: TFindFilter<T>): T {
		let query: any = {}
		for(const key of Object.keys(filter.obj)) {
			query[key] = filter.obj[key]
		}
		if (filter.pagination?.page) query.page = filter.pagination.page
		if (filter.pagination?.limit) query.limit = filter.pagination.limit
		if (filter.sort) query.sort = filter.sort
		return query
	}

	toObject(): TFindFilter<T> {
		return {
			obj: this.obj,
			pagination: this.pagination,
			sort: this.sort
		}
	}

	isEqual(filters: TFindFilter<T>[]) {
		return isEqual([this, ...filters])
	}
}
