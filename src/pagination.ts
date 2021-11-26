import {
	IPagination,
	TPaginationParseArg,
	TPaginationArguments,
	TPagination,
} from '.';

// Константы.
const defaults = { page: 1, limit: 10, maxLimit: 100 };

/**
 * Класс объекта пагинации.
 */
class Pagination implements IPagination {
	/**
	 * Максимальный лимит элементов.
	 */
	private _maxLimit: number;

	page: number = defaults.page;
	limit: number = defaults.limit;

	skip: number = 0;
	total: number = 0;
	pages: number = 0;

	/**
	 * Парсинг аргументов (Статический метод).
	 * @param arg - Значение аргумента для парсинга.
	 * @param defaultReturnValue - Возвращаемое значение по умолчанию.
	 * @returns Возвращает абсолютное значение числа аргумента.
	 */
	static parseArg(
		arg: TPaginationParseArg,
		defaultReturnValue: number
	): number {
		return Math.abs(
			typeof arg === 'string'
				? Number.parseInt(arg) || defaultReturnValue
				: arg || defaultReturnValue
		);
	}

	constructor(args: TPaginationArguments = {}, maxLimit?: number) {
		// Максимальный лимит.
		this._maxLimit = this.parseArg(maxLimit, defaults.maxLimit);
		this.set(args);
	}

	/**
	 * Максимальный лимит элементов.
	 */
	get maxLimit() {
		return this._maxLimit;
	}

	/**
	 * Парсинг аргументов.
	 * @param arg - Значение аргумента для парсинга.
	 * @param defaultReturnValue - Возвращаемое значение по умолчанию.
	 * @returns Возвращает абсолютное значение числа аргумента.
	 */
	parseArg(arg: TPaginationParseArg, defaultReturnValue: number): number {
		return Pagination.parseArg(arg, defaultReturnValue);
	}

	/**
	 * Присваивает значения для основных свойств класса и считает кол-во
	 * пропускаемых элементов в зависимости от полученных аргументов.
	 * @param args - Аргументы пагинации.
	 * @returns Возвращает текущий экземпляр класса.
	 */
	set(args: TPaginationArguments = {}): this {
		let isCalcSkip: boolean = false;

		// Страница.
		if (args.page && args.page !== this.page) {
			// Инициализипуем страницу.
			this.page = this.parseArg(args.page, defaults.page);
			isCalcSkip = true;
		}

		// Лимит.
		if (args.limit && args.limit !== this.limit) {
			this.limit = this.parseArg(args.limit, this.limit);
			isCalcSkip = true;
		}

		// Проверка лимита.
		if (this.limit > this.maxLimit) this.limit = this.maxLimit;

		// Общее кол-во.
		if (args.total && args.total !== this.total) {
			this.total = Math.abs(args.total);
			this.pages = Math.ceil(this.total / this.limit);
		}

		// Перерасчёт пропускаемых элементов.
		if (isCalcSkip) {
			let skip = 0;
			try {
				skip = (this.page - 1) * this.limit;
			} catch (ex: any) {}
			this.skip = skip > 0 ? skip : 0;
		}

		return this;
	}

	/**
	 * Возвращает простой объект пагинации.
	 * @returns Объект пагинации.
	 */
	toObject(): TPagination {
		return {
			page: this.page,
			limit: this.limit,
			total: this.total,

			skip: this.skip,
			pages: this.pages,
		};
	}
}

/* 
Экспорт модуля. */
export default Pagination;
