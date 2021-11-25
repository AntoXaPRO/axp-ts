import { IPagination, TPaginationArguments } from '.';

// Константы.
const defaults = { page: 1, limit: 10, maxLimit: 999 };

/**
 * Класс объекта пагинации.
 */
class Pagination implements IPagination {
	page: number;
	limit: number;
	skip: number;
	total: number = 0;

	/**
	 * Парсинг аргументов (Статический метод).
	 * @param arg - Значение аргумента для парсинга.
	 * @param defaultReturnValue - Возвращаемое значение по умолчанию.
	 * @returns Возвращает абсолютное значение числа аргумента.
	 */
	static parseArg(
		arg: number | string | undefined,
		defaultReturnValue: number
	): number {
		return Math.abs(
			typeof arg === 'string'
				? Number.parseInt(arg) || defaultReturnValue
				: arg || defaultReturnValue
		);
	}

	constructor(args: TPaginationArguments = {}, maxLimit?: number) {
		// Присваиваем значения и приводим к правильному типу.
		this.page = Pagination.parseArg(args.page, defaults.page);
		this.limit = Pagination.parseArg(args.limit, defaults.limit);

		// Блокируем лимит если больше максимального.
		maxLimit = Pagination.parseArg(maxLimit, defaults.maxLimit);
		if (this.limit > maxLimit) this.limit = maxLimit;

		// Рассчитываем сколько скипнуть.
		this.skip = this.getSkip();
	}

	/**
	 * Парсинг аргументов.
	 * @param arg - Значение аргумента для парсинга.
	 * @param defaultReturnValue - Возвращаемое значение по умолчанию.
	 * @returns Возвращает абсолютное значение числа аргумента.
	 */
	parseArg(
		arg: number | string | undefined,
		defaultReturnValue: number
	): number {
		return Pagination.parseArg(arg, defaultReturnValue);
	}

	/**
	 * Расчитать и получить кол-во пропускаемых елементов.
	 * @param page - Номер запрашиваемой страницы.
	 * @returns Возвращает число пропускаемых элементов.
	 */
	getSkip(page: number = this.page): number {
		let skip = 0;
		try {
			page = Pagination.parseArg(page, defaults.page);
			skip = (page - 1) * this.limit;
		} catch (ex: any) {}
		this.skip = skip > 0 ? skip : 0;
		return this.skip;
	}
}

/* 
Экспорт модуля. */
export default Pagination;
