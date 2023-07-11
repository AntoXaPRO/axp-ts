/**
 * Перечисление гендеров.
 */
export enum GenderEnum {
	man = 'man',
	woman = 'woman'
}

/**
 * Тип гендера.
 */
export type TGender = keyof typeof GenderEnum

/**
 * Список значений типов гендера.
 */
export const GENDERS = Object.keys(GenderEnum)

/**
 * Проверка гендера.
 */
export const isGender = (val?: any | null) => {
	try {
		return GENDERS.includes(String(val))
	} catch (e) {
		return false
	}
}
