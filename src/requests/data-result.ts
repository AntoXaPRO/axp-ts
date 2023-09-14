import type { TPagination } from './pagination'
import type { TNotificationItem } from '../notification'

import { Pagination } from './pagination'

export type TInfoDataResult = {
	type: 'object' | 'array' | 'undefined'
	length: number
	pagination?: TPagination
}

export interface IDataResult<T> {
	status: number
	message: string
	data: T
	info: TInfoDataResult
	errors: TNotificationItem[]
	setData(data: T, pagination?: TPagination): void
}

export class DataResultEntity<T> implements IDataResult<T> {
	status: number = 200
	message: string = 'Ok'
	data: T
	info: TInfoDataResult = { type: 'undefined', length: 0 }
	errors: TNotificationItem[] = []

	constructor(data: any = {}) {
		this.data = data
		this.setData()
	}

	setData(data: T = null, pagination?: TPagination): void {
		if (data !== null) {
			this.data = data
		}

		// Если данные есть.
		if (this.data) {
			// Если данные это массив.
			if (Array.isArray(this.data)) {
				this.info.type = 'array'
				this.info.length = [...this.data].length

				if (pagination) {
					this.info.pagination = pagination
				} else {
					const pagination = new Pagination(
						{ page: 1, limit: this.info.length, total: this.info.length },
						this.info.length
					)
					this.info.pagination = pagination.toObject()
				}

				// Если общее кол-во меньше чем размер массива.
				// Это обычно значение по умолчанию "0" при инициализации объекта пагинации.
				if (this.info.pagination.total < this.info.length) {
					this.info.pagination.total = this.info.length
				}
			} else {
				// Данные это объект.
				this.info.type = 'object'
				this.info.length = 1
			}
		}
	}
}
