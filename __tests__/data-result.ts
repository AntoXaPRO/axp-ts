import { DataResultEntity } from '../src'

describe('Data Result', () => {
	let testObject: object = {}
	const testObjectResultInfo = { type: 'object', length: 1, pagination: undefined }

	let testArray: string[] = []
	const testArrayResultInfo = { type: 'array', length: 2, pagination: { page: 1, limit: 10, skip: 0, total: 2 } }

	beforeEach(() => {
		testObject = { field: 'Test', number: 10 }
		testArray = ['test1', 'test2']
	})

	test('Create object instance', () => {
		const dR = new DataResultEntity(testObject)
		expect(dR.data).toBeInstanceOf(Object)
		expect(dR.info).toEqual(testObjectResultInfo)
		expect(dR.data).toEqual(testObject)
	})

	test('Set object data', () => {
		const dR = new DataResultEntity()
		dR.setData(testObject)
		expect(dR.data).toBeInstanceOf(Object)
		expect(dR.info).toEqual(testObjectResultInfo)
		expect(dR.data).toEqual(testObject)
	})

	test('Create array instance', () => {
		const dR = new DataResultEntity(testArray)
		expect(dR.data).toBeInstanceOf(Array)
		expect(dR.info).toEqual(testArrayResultInfo)
	})

	test('Set array data', () => {
		const dR = new DataResultEntity<string[]>()
		dR.setData(testArray)
		expect(dR.data).toBeInstanceOf(Array)
		expect(dR.info).toEqual(testArrayResultInfo)
	})
})
