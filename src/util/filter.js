/**
 * @template {(...args: any[]) => void} T
 * @param {T} fn
 */
export function debounce(fn, delay = 100) {
	/** @type {ReturnType<typeof setTimeout> | null} */
	let timer = null
	/** @param {Parameters<T>} args */
	return (...args) => {
		if (timer) clearTimeout(timer)
		timer = setTimeout(() => {
			fn(...args)
			timer = null
		}, delay)
	}
}

/**
 * @template S
 * @template {(...args: any[]) => Promise<S>} T
 * @param {T} fn
 * @param {object} [opts]
 * @param {number} [opts.max] maximum number of running instances
 * @param {number} [opts.delay] minimum milliseconds between calls
 */
export function throttle(fn, opts) {
	let last = 0
	let running = 0
	const max = opts?.max ?? 2
	const delay = opts?.delay ?? 10
	/** @type {((v?: unknown) => void)[]} */
	const queue = []
	/** @param {Parameters<T>} args */
	return async (...args) => {
		const wait = delay + last - Date.now()
		if (wait > 0) await new Promise((r) => setTimeout(r, wait))
		if (running >= max) await new Promise((r) => queue.push(r))
		++running
		last = Date.now()
		try {
			return await fn(...args)
		} catch (err) {
			throw err
		} finally {
			--running
			queue.shift()?.()
		}
	}
}
