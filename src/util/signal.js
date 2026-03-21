import { effect } from 'alien-signals'
import { signal } from '@musakui/ui'

import { debounce } from './filter.js'

/**
 * @param {import('@musakui/ui').Signal<boolean>} sig
 */
export function toggle(sig) {
	return () => {
		sig.value = !sig.value
	}
}

/**
 * @template Pending
 * @template Final
 * @param {Pending} init
 * @param {Promise<Final>} prom
 */
export function deferred(init, prom) {
	const sig = signal(/** @type {Pending | Final} */ (init))

	prom
		.then((v) => {
			sig.value = v
		})
		.catch(() => {
			//
		})

	return sig
}

/**
 * @template T
 * @param {import('@musakui/ui').Signal<T>} sig
 */
export function debounced(sig, delay = 200) {
	const db = signal(sig.value)

	const setValue = debounce(
		/** @param {T} v */ (v) => {
			db.value = v
		},
		delay
	)

	effect(() => setValue(sig.value))

	return db
}
