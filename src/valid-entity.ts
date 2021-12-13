import { ValidationError, ObjectSchema } from 'yup';
import { ObjectShape } from 'yup/lib/object';

import { ErrorItem } from '.';

interface IValidEntity<T> {
	obj: T;
	get errors(): ErrorItem[];
	isValid(): boolean;
	convertByFields(): T;
	convertPreSave(): T;
}

class ValidEntity<T> implements IValidEntity<T> {
	_errors: any = {};
	_schema: ObjectSchema<ObjectShape>;

	obj: T;

	constructor(obj: any, schema: ObjectSchema<ObjectShape>) {
		this._schema = schema;
		this.obj = this.convertByFields(obj || {});
	}

	/**
	 * Возвращает массив ошибок.
	 */
	get errors(): ErrorItem[] {
		let arr: ErrorItem[] = [];
		for (let key in this._errors) {
			if (this._errors[key]) {
				arr.push(new ErrorItem(this._errors[key], key));
			}
		}
		return arr;
	}

	private _setErrors(ex: ValidationError) {
		if (ex.inner) {
			ex.inner.forEach((e) => (this._errors[e.path] = e.message));
		}
	}

	/**
	 * Валидация по схеме.
	 */
	isValid(): boolean {
		this._errors = {};
		try {
			this.obj = <T>this._schema.validateSync(this.obj, {
				abortEarly: false,
				stripUnknown: true,
			});
			return true;
		} catch (ex) {
			this._setErrors(ex);
			return false;
		}
	}

	/**
	 * Возвращает объект сформированный из полей схемы.
	 * @param obj - Объект для конвертации.
	 */
	convertByFields(obj: any = this.obj): T {
		let result: T = <T>{};
		Object.keys(this._schema.fields).forEach((key) => {
			try {
				const value = obj[key];
				if (value) {
					result[key] = this._schema.fields[key].cast(value, {
						stripUnknown: true,
						assert: true,
					});
				}
			} catch (ex) {
				this._setErrors(ex);
			}
		});
		return result;
	}

	/**
	 * Метод вызываемый перед сохранением в БД и возврощает объект который в итоге должен попасть в БД.
	 * Предназначен в основном для переопределения, чтобы изменить объект перед сохранением.
	 */
	convertPreSave(): T {
		return this.obj;
	}
}

/* 
Экспорт модуля. */
export default ValidEntity;
export { IValidEntity };
