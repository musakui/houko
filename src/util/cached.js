/**
 * @template {WeakKey} T
 * @param {(v: T) => import('./types').TemplateFrag} fn
 */
export function cached(fn) {
	/** @type {WeakMap<T, [el: Element, frag: import('./types').TemplateFrag]>} */
	const cache = new WeakMap()

	/** @param {T} val */
	return (val) => {
		const found = cache.get(val)
		if (found) {
			found[1].bind()
			return found[0]
		}
		const frag = fn(val)
		const el = frag.init()
		if (!el) throw new Error('invalid template')
		cache.set(val, [el, frag])
		return el
	}
}
