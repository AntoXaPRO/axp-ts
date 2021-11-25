import ErrorItem from './error-item';
import DataResultEntity from './data-result';
import Pagination from './pagination';

/** ==== Елемент ошибки. ========================== */
/**
 * Интефейс модели элемента ошибки.
 */
interface IErrorItem {
	/**
	 * Код ошибки.
	 */
	code: string;
	/**
	 * Текстовое описание ошибки.
	 */
	text: string;
}

/* 
Экспорт. */
export { IErrorItem, ErrorItem };

/** ==== Модель данных результата запроса. ======== */
/**
 * Интерфейс информации о данных.
 */
interface IInfoDataResult {
	type: 'object' | 'array' | 'undefined';
	length: number;
	pagination?: IPagination;
}

/**
 * Интерфейс модели данных ответа сервера.
 */
interface IDataResult<T> {
	/**
	 * Код статуса ответа.
	 */
	status: number;

	/**
	 * Сообщение
	 */
	message: string;

	/**
	 * Объект данных запроса.
	 */
	data: T;

	/**
	 * Информация о данных.
	 */
	info: IInfoDataResult;

	/**
	 * Список ошибок.
	 */
	errors: IErrorItem[];

	/**
	 * Присваивает значение в свойство data и заполняет поле "info".
	 * @param data - Объект данных.
	 * @param pagination - Модель пагинации используется если данные в виде массива.
	 */
	setData(data: T, pagination?: IPagination): void;
}

/* 
Экспорт. */
export { IDataResult, IInfoDataResult, DataResultEntity };

/** ==== Пагинация ===================== */

/**
 * Тип данных пагинации.
 */
type TPagination = {
	page: number;
	limit: number;
	skip: number;
	total: number;
};

/**
 * Тип аргументов пагинации.
 */
type TPaginationArguments = {
	page?: number | string;
	limit?: number | string;
};

/**
 * Интерфейс объекта пагинации.
 */
interface IPagination extends TPagination {
	/**
	 * Парсинг аргументов.
	 * @param arg - Значение аргумента для парсинга.
	 * @param defaultReturnValue - Возвращаемое значение по умолчанию.
	 * @returns Возвращает абсолютное значение числа аргумента.
	 */
	parseArg(
		arg: number | string | undefined,
		defaultReturnValue: number
	): number;

	/**
	 * Расчитать и получить кол-во пропускаемых елементов.
	 * @param page - Номер запрашиваемой страницы.
	 * @returns Возвращает число пропускаемых элементов.
	 */
	getSkip(page: number): number;
}

/* 
Экспорт. */
export { TPagination, TPaginationArguments, IPagination, Pagination };
