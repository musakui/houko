import { effect } from 'alien-signals'
import { signal } from '@musakui/ui'

/**
 * @template T
 * @param {string} key
 * @param {object} [opts]
 * @param {(s: string | null) => T} [opts.parse]
 * @param {(v: T) => string | null} [opts.serialize]
 */
export function useStorage(key, opts) {
	const parse = opts?.parse ?? ((s) => /** @type {T} */ (s ? JSON.parse(s) : {}))
	const serialize = opts?.serialize ?? ((s) => JSON.stringify(s))

	const sig = signal(parse(localStorage.getItem(key)))

	effect(() => {
		const val = serialize(sig.value)
		if (val === null) {
			localStorage.removeItem(key)
		} else {
			localStorage.setItem(key, val)
		}
	})

	return sig
}

/** @param {string} key */
export function useStorageBool(key) {
	return useStorage(key, {
		parse: (s) => !!s,
		serialize: (s) => (s ? 'true' : null),
	})
}

/** @param {string} key */
export function useStorageString(key, defaultValue = '') {
	return useStorage(key, {
		parse: (s) => s ?? defaultValue,
		serialize: (s) => (s === defaultValue ? null : s),
	})
}
