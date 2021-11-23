interface IPagination {
	page: number
	limit: number
	skip: number
	total: number
}

export { IPagination }
export default class Pagination implements IPagination {
	page: number
	limit: number
	skip: number
	total: number

	constructor(args: { page?: number; limit?: number } = { page: 1, limit: 10 }, maxLimit: number = 100) {
		// Присваиваем значения и приводим к правильному типу.
		this.page = Math.abs(args.page) || 1
		this.limit = Math.abs(args.limit) || 10

		// Блокируем лимит.
		if (this.limit > maxLimit) this.limit = maxLimit

		// Рассчитываем сколько скипнуть.
		this.skip = this.getSkip()
		this.total = 0
	}

	getSkip(): number {
		let skip = 0
		try {
			skip = (this.page - 1) * this.limit
		} catch (ex: any) {}
		this.skip = skip > 0 ? skip : 0
		return this.skip
	}
}
