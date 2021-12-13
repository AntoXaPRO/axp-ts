import { ValidationError, SchemaOf } from 'yup';

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
	_schema: SchemaOf<T>;

	obj: T;

	constructor(obj: T, schema: SchemaOf<T>) {
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

	/**
	 * Валидация по схеме.
	 */
	isValid(): boolean {
		this._errors = {};
		try {
			this._schema.validateSync(this.obj, { abortEarly: false });
			return true;
		} catch (ex) {
			const error = <ValidationError>ex;
			error.inner.forEach((e) => (this._errors[e.path] = e.message));
			return false;
		}
	}

	/**
	 * Возвращает объект сформированный из полей схемы.
	 * @param obj - Объект для конвертации.
	 */
	convertByFields(obj: any = this.obj): T {
		return <T>this._schema.cast(obj, { stripUnknown: true });
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
