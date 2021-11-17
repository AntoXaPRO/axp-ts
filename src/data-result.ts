import { IErrorItem } from './error-item'

/**
 * Интерфейс информации о данных.
 */
interface IInfoDataResult {
	type: 'object' | 'array' | 'undefined'
	length: number
}

/**
 * Интерфейс модели данных для возврата.
 */
interface IDataResult<T> {
	status: number
	message: string
	data: T
	errors: IErrorItem[]
	info: IInfoDataResult
	setData(data: T): void
}

export { IDataResult }

/**
 * Класс описывающий модель данных ответа сервера.
 */
export default class DataResultEntity<T> implements IDataResult<T> {
	// Код статуса ответа.
	status: number = 200

	// Сообщение.
	message: string = 'Ok'

	// Основной объект которыей должен отдать контроллер.
	// Нужно переопределить в наследуемом классе.
	data: T

	// Информация о данных.
	info: IInfoDataResult = { type: 'undefined', length: 0 }

	// Список ошибок.
	errors: IErrorItem[] = []

	constructor(data: any = {}) {
		this.data = data
	}

	/**
	 * Присваивает значение в свойство data и заполняет поле "info".
	 */
	setData(data: T) {
		if (data) {
			if (Array.isArray(data)) {
				this.info.type = 'array'
				this.info.length = [...data].length
			} else {
				this.info.type = 'object'
				this.info.length = 1
			}
			this.data = data
		}
	}
}
