import {
	DataResultEntity,
	TPagination,
	Pagination,
	TInfoDataResult,
} from '../src';

describe('Data Result', () => {
	let testObject: object = { field: 'Test', number: 10 };
	const testObjectResultInfo: TInfoDataResult = {
		type: 'object',
		length: 1,
	};

	const testPaginationObj = new Pagination({ page: 1, limit: 10 });
	testPaginationObj.total = 2;

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

	test('Set array data and pagination', () => {
		const dR = new DataResultEntity();
		dR.setData(testArray, new Pagination());
		expect(dR.info.pagination).toEqual(testPaginationObj);
	});
});
