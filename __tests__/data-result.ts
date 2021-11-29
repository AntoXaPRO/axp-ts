import {
	DataResultEntity,
	TPagination,
	TInfoDataResult,
	Pagination,
} from '../src';

describe('Data Result', () => {
	let testObject: object = { field: 'Test', number: 10 };
	const testObjectResultInfo: TInfoDataResult = {
		type: 'object',
		length: 1,
	};

	const testPaginationObj: TPagination = {
		page: 1,
		limit: 2,
		skip: 0,
		total: 2,
		pages: 1,
	};

	let testArray: string[] = ['test1', 'test2'];
	const testArrayResultInfo: TInfoDataResult = {
		type: 'array',
		length: 2,
		pagination: testPaginationObj,
	};

	test('Create instance', () => {
		const dR = new DataResultEntity(testObject);

		expect(dR.data).toBeInstanceOf(Object);
		expect(dR.data).toEqual(testObject);
		expect(dR.info).toEqual(testObjectResultInfo);
	});

	test('Set object data', () => {
		const dR = new DataResultEntity();
		dR.setData(testObject);
		expect(dR.data).toBeInstanceOf(Object);
		expect(dR.data).toEqual(testObject);
		expect(dR.info).toEqual(testObjectResultInfo);
	});

	test('Create array instance', () => {
		const dR = new DataResultEntity(testArray);
		expect(dR.data).toBeInstanceOf(Array);
		expect(dR.data).toEqual(testArray);
		expect(dR.info).toEqual(testArrayResultInfo);
	});

	test('Set array data', () => {
		const dR = new DataResultEntity<string[]>();
		dR.setData(testArray);
		expect(dR.data).toBeInstanceOf(Array);
		expect(dR.data).toEqual(testArray);
		expect(dR.info).toEqual(testArrayResultInfo);
	});

	test('Pagination', () => {
		const dR = new DataResultEntity();
		dR.setData(testArray);
		expect(dR.info.pagination).toEqual(testPaginationObj);
	});

	test('Pagination set data', () => {
		const dR = new DataResultEntity();
		const pagination = new Pagination(testPaginationObj, 2);
		dR.setData(testArray, pagination.toObject());
		expect(dR.info.pagination).toEqual(testPaginationObj);
	});
});
