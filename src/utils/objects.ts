export const isEqual = <T extends object>(objects: T[]) => {
	for (let i = 0; i < objects.length; i++) {
		const obj1 = objects[i]
		const obj2 = objects[i + 1]
		if (obj2) {
			const keys1 = Object.keys(obj1)
			const keys2 = Object.keys(obj2)

			if (keys1.length !== keys2.length) {
				return false
			}

			for(const key of keys1) {
				if (typeof obj1[key] !== 'object') {
					if (obj1[key] !== obj2[key]) {
						return false
					}
				} else {
					if (!isEqual([obj1[key], obj2[key]])) {
						return false
					}
				}
			}
		}
	}

	return true
}
