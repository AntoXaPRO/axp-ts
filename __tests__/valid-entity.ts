import { object, string, number } from 'yup';
import { ErrorItem, ValidEntity } from '../src';

type TTestValid = {
	name: string;
	test: string;
	age?: number;
};

const schema = object({
	name: string().trim().required(),
	test: string().trim().required(),
	age: number().default(10),
});

const obj = { name: 'Field name ', test: 'Test ' };
const objTest = { name: 'Field name', age: 10, test: 'Test' };

describe('Valid entity', () => {
	test('Create instance', () => {
		const entity = new ValidEntity<TTestValid>(obj, schema);
		expect(entity.obj).toEqual(objTest);
		expect(entity.isValid()).toBe(true);
		expect(entity.errors.length).toBe(0);
	});

	test('Error messages', () => {
		const entity = new ValidEntity(null, schema);
		expect(entity.isValid()).toBe(false);
		expect(entity.errors[0]).toBeInstanceOf(ErrorItem);
		expect(entity.errors.length).toBe(2);
		expect(entity.errors[0].code).toBe('name');
	});
});
