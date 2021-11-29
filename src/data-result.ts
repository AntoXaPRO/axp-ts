import {
	IDataResult,
	TInfoDataResult,
	IInfoDataResult,
	IErrorItem,
	IPagination,
	TPagination,
	Pagination,
} from '.';

/**
 * Класс описывающий модель данных результата запроса (к примеру ответ от сервера).
 */
class DataResultEntity<T> implements IDataResult<T> {
	/**
	 * Код статуса ответа.
	 */
	status: number = 200;

	/**
	 * Сообщение
	 */
	message: string = 'Ok';

	/**
	 * Объект данных запроса.
	 */
	data: T;

	/**
	 * Информация о данных.
	 */
	info: IInfoDataResult = { type: 'undefined', length: 0 };

	/**
	 * Список ошибок.
	 */
	errors: IErrorItem[] = [];

	constructor(data: any = {}) {
		this.data = data;
		this.setData();
	}

	/**
	 * Присваивает значение в свойство data и заполняет поле "info".
	 * @param data - Объект данных.
	 * @param pagination - Модель пагинации используется если данные в виде массива.
	 */
	setData(data: T = null, pagination?: TPagination): void {
		// Присваиваем значение.
		if (data !== null) {
			this.data = data;
		}

		// Если данные есть.
		if (this.data) {
			// Если данные это массив.
			if (Array.isArray(this.data)) {
				this.info.type = 'array';
				this.info.length = [...this.data].length;

				if (pagination) {
					this.info.pagination = pagination;
				} else {
					const pagination = new Pagination(
						{ page: 1, limit: this.info.length, total: this.info.length },
						this.info.length
					);
					this.info.pagination = pagination.toObject();
				}

				// Если общее кол-во меньше чем размер массива.
				// Это обычно значение по умолчанию "0" при инициализации объекта пагинации.
				if (this.info.pagination.total < this.info.length) {
					this.info.pagination.total = this.info.length;
				}
			} else {
				// Данные это объект.
				this.info.type = 'object';
				this.info.length = 1;
			}
		}
	}
}

/* 
Экспорт модуля. */
export default DataResultEntity;
