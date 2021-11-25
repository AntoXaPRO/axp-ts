import {
	TPagination,
	IPagination,
	TPaginationArguments,
	Pagination,
} from '../src';

describe('Pagination', () => {
	test('Create instance empty', () => {
		const pagination: IPagination = new Pagination();
		expect(pagination.page).toBe(1);
		expect(pagination.skip).toBe(0);
		expect(pagination.limit).toBe(10);
		expect(pagination.total).toBe(0);
	});

	test('Max limit', () => {
		const pagination1 = new Pagination({ limit: 1000 });
		expect(pagination1.limit).toBe(999);

		const pagination2 = new Pagination({ limit: 1000 }, -998);
		expect(pagination2.limit).toBe(998);
	});

	test('Check arguments and parsing', () => {
		const args: TPaginationArguments[] = [
			{ page: 3 },
			{ page: 3, limit: 10 },
			{ page: '3', limit: '10' },
			{ page: -3, limit: -10 },
			{ page: '-3', limit: '-10' },
			{ page: '-3', limit: 'failed param' },
		];

		const equalObj: TPagination = {
			page: 3,
			limit: 10,
			skip: 20,
			total: 0,
		};

		args.forEach((e) => {
			const pagination = new Pagination(e);
			expect(pagination.parseArg(e.page, 3)).toBe(3);
			expect(Pagination.parseArg(e.limit, 10)).toBe(10);
			expect(pagination).toEqual<TPagination>(equalObj);
		});
	});
});
