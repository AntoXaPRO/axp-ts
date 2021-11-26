import {
	TPagination,
	TPaginationArguments,
	TPaginationParseArg,
	IPagination,
	Pagination,
} from '../src';

describe('Pagination', () => {
	// Константы.
	const defaults = { page: 1, limit: 10, maxLimit: 100 };

	// Проверка парсера.
	const parseArgArr: {
		arg: TPaginationParseArg;
		equal: number;
	}[] = [
		{ arg: 1, equal: 1 },
		{ arg: -1, equal: 1 },
		{ arg: '-1', equal: 1 },
		{ arg: 0, equal: 100 },
		{ arg: '0', equal: 100 },
		{ arg: 'failed', equal: 100 },
		{ arg: 'undefined', equal: 100 },
		{ arg: undefined, equal: 100 },
	];

	// Максимальный лимит.
	const maxLimitArr: { maxLimit: number; equal: number; limit: number }[] = [
		{ maxLimit: undefined, equal: defaults.maxLimit, limit: 10 },
		{ maxLimit: 999, equal: 999, limit: 10 },
		{ maxLimit: 1, equal: 1, limit: 1 },
	];

	// Аргументы.
	const argsArr: {
		args: TPaginationArguments;
		equal: TPagination;
	}[] = [
		{
			args: {},
			equal: { page: 1, limit: 10, skip: 0, total: 0, pages: 0 },
		},
		{
			args: {},
			equal: { page: 1, limit: defaults.limit, skip: 0, total: 0, pages: 0 },
		},
		{
			args: { page: 3, limit: 40, total: 34 },
			equal: { page: 3, limit: 40, skip: 80, total: 34, pages: 1 },
		},
		{
			args: { limit: 11, total: 65 },
			equal: { page: 1, limit: 11, skip: 0, total: 65, pages: 6 },
		},
		{
			args: { page: 2, limit: 20, total: 98 },
			equal: { page: 2, limit: 20, skip: 20, total: 98, pages: 5 },
		},
		{
			args: { page: 3, limit: 20, total: 123 },
			equal: { page: 3, limit: 20, skip: 40, total: 123, pages: 7 },
		},
		{
			args: { page: '-3', limit: '-10', total: 65 },
			equal: { page: 3, limit: 10, skip: 20, total: 65, pages: 7 },
		},
		{
			args: { page: '', limit: 'failed param', total: 32 },
			equal: { page: 1, limit: 10, skip: 0, total: 32, pages: 4 },
		},
		{
			args: { page: '', limit: defaults.maxLimit + 1, total: 3435 },
			equal: {
				page: 1,
				limit: defaults.maxLimit,
				skip: 0,
				total: 3435,
				pages: Math.ceil(3435 / defaults.maxLimit),
			},
		},
	];

	test('Create instance (empty args)', () => {
		const pagination: IPagination = new Pagination();
		// Геттер максимальный лимит.
		expect(pagination.maxLimit).toBe(defaults.maxLimit);

		// Основные свойства.
		expect(pagination.page).toBe(1);
		expect(pagination.skip).toBe(0);
		expect(pagination.limit).toBe(10);
		expect(pagination.total).toBe(0);

		// Методы.
		expect(pagination.set).toBeInstanceOf(Function);
		expect(pagination.toObject).toBeInstanceOf(Function);
	});

	test('Parse args', () => {
		parseArgArr.forEach((e) => {
			expect(Pagination.parseArg(e.arg, 100)).toBe(e.equal);
		});
	});

	test('Max limit', () => {
		maxLimitArr.forEach((e) => {
			const pagination = new Pagination({}, e.maxLimit);
			expect(pagination.maxLimit).toBe(e.equal);
			expect(pagination.limit).toBe(e.limit);
		});
	});

	test('Create instance (custom and failed args)', () => {
		argsArr.forEach((e) => {
			const pagination = new Pagination(e.args);
			expect(pagination.toObject()).toEqual(e.equal);
		});
	});

	test('Set arguments', () => {
		argsArr.forEach((e) => {
			const pagination = new Pagination();
			pagination.set(e.args);
			expect(pagination.toObject()).toEqual(e.equal);
		});

		const pagination = new Pagination();

		pagination.set({ page: 2 });
		expect(pagination.page).toBe(2);
		expect(pagination.skip).toBe(10);

		pagination.set({ limit: 11 });
		expect(pagination.limit).toBe(11);
		expect(pagination.page).toBe(2);
		expect(pagination.skip).toBe(11);

		pagination.set({ page: 10 });
		expect(pagination.page).toBe(10);
		expect(pagination.limit).toBe(11);
		expect(pagination.skip).toBe(99);
	});
});
