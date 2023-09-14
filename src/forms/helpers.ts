/**
 * Проверка ФИО.
 */
export const regexFIO = /^[А-яЁё]+$/

/**
 * Значения номера.
 */
export const regexPhone = /^[9]\d{9}$/

/**
 * Регулярка для поиска.
 */
export const regexSearch = /[\'\"\+\(\)]/g

/**
 * Регулярка ID.
 */
export const regexId = /^[a-f\d]{24}$/i

/**
 * Возвращает значение номера телефона.
 */
export const getPhoneNumberValue = (phone?: any): number | undefined => {
	if (phone) {
		if (typeof phone === 'number') {
			phone = phone.toString()
		}
		if (typeof phone === 'string') {
			try {
				phone = phone.replace(/\D/g, '').replace(/^[78]/, '').substring(0, 10)
				return Number(phone) || undefined
			} catch (e) {}
		}
	}
	return undefined
}

/**
 * Валидация мобильного номера телефона.
 */
export const validPhoneNumber = (value?: number | string) => {
	if (!value) return false
	const str: string = value.toString()
	if (str.length !== 10) return false
	if (str.match(regexPhone) === null) return false
	return true
}

/**
 * Формат номера телефона.
 */
export const getPhoneNumberFormat = (
	phone?: number | string,
	prefix: string = '+7 '
): string => {
	let result = prefix
	const strValue = getPhoneNumberValue(phone)?.toString().substring(0, 10)
	if (strValue) {
		for (let i = 0; i < strValue.length; i++) {
			switch (i) {
				case 0:
					result += '('
					break
				case 3:
					result += ') '
					break
				case 6:
					result += '-'
					break
				case 8:
					result += '-'
					break
			}
			result += strValue[i]
		}
	}
	return result
}

/**
 * Функция для проеобрадования загоавных букв в верхний регистр.
 */
export const capitalize = (str: string = '') => {
	return str[0] ? str[0].toUpperCase() + str.substring(1) : ''
}

/**
 * Проверка ID.
 */
export const isId = (val: any) =>
	typeof val === 'string' && val.match(/^[a-f\d]{24}$/i)

type TDate = Date | number | string

/**
 * Преобразование даты в общий формат (YYYY-MM-DD).
 */
export const getDateCommonFormat = (val?: TDate | null): string => {
	try {
		if (val) {
			const date = new Date(val)
			const day = date.toLocaleDateString('ru-RU', { day: '2-digit' })
			const month = date.toLocaleDateString('ru-RU', { month: '2-digit' })
			const year = date.toLocaleDateString('ru-RU', { year: 'numeric' })
			const format = `${year}-${month}-${day}`
			return format
		}
	} catch (ex) {}

	return ''
}
