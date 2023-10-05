export const isEqual = <T extends object>(objects: T[]) => {
	for (let i = 0; i < objects.length; i++) {

		const obj1: T = objects[i]
		const obj2: T = objects[i + 1]

		if (obj2) {
			const keys1  = Object.keys(obj1) as [keyof T]
			const keys2 = Object.keys(obj2) as [keyof T]

			if (keys1.length !== keys2.length) {
				return false
			}

			for(const key of keys1) {
				if (typeof obj1[key] !== 'object') {
					if (obj1[key] !== obj2[key]) {
						return false
					}
				} else {
					if (!isEqual([obj1[key], obj2[key]] as T[])) {
						return false
					}
				}
			}
		}
	}

	return true
}
