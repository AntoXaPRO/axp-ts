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
	.partial()
	.describe('Параметры базового запроса')

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
		let queryCopy: T = Object.assign({}, query)

		// Pagination.
		this.setPagination(queryCopy)
		if (this.pagination) {
			// Delete pagination props.
			const paginationKeys = Object.keys(this.pagination) as [keyof T]
			for (const key of paginationKeys) {
				if (queryCopy[key]) delete queryCopy[key]
			}
		}

		// Sort.
		if (queryCopy.sort) {
			this.sort = queryCopy.sort
			queryCopy.sort = undefined
		}

		// Obj.
		this.obj = queryCopy
	}

	setPagination(pagination?: Partial<TPagination>) {
		this.pagination = new Pagination(pagination).toObject()
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
