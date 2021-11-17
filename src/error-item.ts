/**
 * Интефейс модели елемента ошибки.
 */
interface IErrorItem {
	code: string
	text: string
}

export { IErrorItem }

/* 
Экспорт класса. */
export default class ErrorItem implements IErrorItem {
	constructor(public text: string, public code: string = 'error') {}
}
