import { IErrorItem, ErrorItem } from '../src'

describe('Error Item', () => {
	const text = 'Text test error item.'
	const obj = { code: 'info', text }

	test('Create instance', () => {
		const ErrorItemInstance: IErrorItem = new ErrorItem(text)
		expect(ErrorItemInstance).toEqual(obj)
	})
})
