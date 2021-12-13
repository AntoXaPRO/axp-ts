import { object, string, number, date, SchemaOf } from 'yup';
import { ErrorItem, ValidEntity } from '../src';

type TTestValid = {
	name: string;
	birthday?: Date;
	age?: number;
};

const schema: SchemaOf<TTestValid> = object({
	name: string().trim().required(),
	age: number().default(10),
	birthday: date(),
});

const obj = { name: ' Field name ', birthday: '' };
const objTest = { name: 'Field name', age: 10 };

describe('Valid entity', () => {
	test('Create instance', () => {
		const entity = new ValidEntity<TTestValid>(obj, schema);

		expect(entity.obj.name).toBe(objTest.name);
		expect(entity.obj.age).toBe(undefined);
		expect(entity.obj.birthday).toBe(undefined);
		expect(entity.isValid()).toBe(true);
		expect(entity.obj.age).toBe(10);
	});

	test('Error messages', () => {
		const entity = new ValidEntity(null, schema);
		expect(entity.isValid()).toBe(false);
		expect(entity.errors[0]).toBeInstanceOf(ErrorItem);
		expect(entity.errors.length).toBe(1);
		expect(entity.errors[0].code).toBe('name');
	});
});
