import { useStorage } from '@musakui/vueuse'

const initial = { links: [{ path: '/', name: 'home' }] }

export const useStore = () => {
	const store = useStorage({ initial })

	/** @param {unknown} val */
	const undefKeys = (val) => {
		const s = new Set(Object.keys(val))
		const ks = Object.keys(store).filter((k) => !s.has(k))
		return Object.fromEntries(ks.map((k) => [k, undefined]))
	}

	return {
		store,
		/** @param {string} str */
		setStore(str) {
			try {
				const val = JSON.parse(str.trim())
				Object.assign(store, val, undefKeys(val))
				return ''
			} catch (err) {
				return `${err}`
			}
		},
	}
}
