import NotificationItem from './error-item'
import DataResultEntity from './data-result'
import Pagination from './pagination'
import ValidEntity, { IValidEntity } from './valid-entity'

/** ==== Елемент уведобления. ========================== */
export type TNotificationItem = {
  code: string
  text: string
}

/**
 * Интефейс модели элемента ошибки.
 */
export interface IErrorItem extends TNotificationItem {}
export class ErrorItem extends NotificationItem {}

/** ==== Пагинация ===================== */
/**
 * Тип аргумента пагинации.
 */
type TPaginationParseArg = number | string | undefined

/**
 * Тип аргументов пагинации.
 */
type TPaginationArguments = {
  page?: TPaginationParseArg
  limit?: TPaginationParseArg
  total?: number
}

/**
 * Тип данных пагинации.
 */
type TPagination = {
  page: number
  limit: number
  total: number

  skip: number
  pages: number
}

/**
 * Интерфейс объекта пагинации.
 */
interface IPagination extends TPagination {
  /**
   * Максимальный лимит элементов.
   */
  get maxLimit(): number

  /**
   * Парсинг аргументов.
   * @param arg - Значение аргумента для парсинга.
   * @param defaultReturnValue - Возвращаемое значение по умолчанию.
   * @returns Возвращает абсолютное значение числа аргумента.
   */
  parseArg(
    arg: number | string | undefined,
    defaultReturnValue: number
  ): number

  /**
   * Присваивает значения для основных свойств класса и считает кол-во
   * пропускаемых элементов в зависимости от полученных аргументов.
   * @param args - Аргументы пагинации.
   * @returns Возвращает текущий экземпляр класса.
   */
  set(args: TPaginationArguments): this

  /**
   * Возвращает простой объект пагинации.
   * @returns Объект пагинации.
   */
  toObject(): TPagination
}

/* 
 Экспорт. */
export {
  TPaginationParseArg,
  TPaginationArguments,
  TPagination,
  IPagination,
  Pagination
}

/** ==== Модель данных результата запроса. ======== */
/**
 * Тип информации о данных.
 */
type TInfoDataResult = {
  type: 'object' | 'array' | 'undefined'
  length: number
  pagination?: TPagination
}

/**
 * Интерфейс информации о данных.
 */
interface IInfoDataResult extends TInfoDataResult {
  pagination?: TPagination
}

/**
 * Интерфейс модели данных ответа сервера.
 */
interface IDataResult<T> {
  /**
   * Код статуса ответа.
   */
  status: number

  /**
   * Сообщение
   */
  message: string

  /**
   * Объект данных запроса.
   */
  data: T

  /**
   * Информация о данных.
   */
  info: IInfoDataResult

  /**
   * Список ошибок.
   */
  errors: IErrorItem[]

  /**
   * Присваивает значение в свойство data и заполняет поле "info".
   * @param data - Объект данных.
   * @param pagination - Модель пагинации используется если данные в виде массива.
   */
  setData(data: T, pagination?: IPagination): void
}

/* 
Экспорт. */
export { TInfoDataResult, IInfoDataResult, IDataResult, DataResultEntity }

/* 
Экспорт. */
export { IValidEntity, ValidEntity }
