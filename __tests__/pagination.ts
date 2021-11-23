import { Pagination } from '../src'

describe('Pagination', () => {
	test('Create instance empty', () => {
		const pagination = new Pagination()
		expect(pagination.page).toBe(1)
		expect(pagination.limit).toBe(10)
		expect(pagination.skip).toBe(0)
		expect(pagination.total).toBe(0)
	})

	test('Create instance failed arguments', () => {
		const pagination = new Pagination({ page: -3, limit: -11 })
		expect(pagination.page).toBe(3)
		expect(pagination.limit).toBe(11)
		expect(pagination.skip).toBe(22)
		expect(pagination.total).toBe(0)
	})
})
