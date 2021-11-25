import { IErrorItem } from '.'

/**
 * Класс модели элемента ошибки.
 */
class ErrorItem implements IErrorItem {
	constructor(public text: string, public code: string = 'error') {}
}

/* 
Экспорт модуля. */
export default ErrorItem
