import { registerEffect } from '@musakui/ui'

/** @typedef {HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement} HTMLInputs */

/**
 * @param {HTMLElement} el
 * @param {string} eventName
 * @param {() => void} handler
 * @param {() => void} effectFn
 */
export function rawModel(el, eventName, handler, effectFn) {
	el.addEventListener(eventName, handler)
	registerEffect(el, effectFn)
}

/**
 * @template {string} T
 * @template {HTMLInputs} InputEl
 * @param {import('@musakui/ui').Signal<T>} sig
 * @param {(el: InputEl) => T} [getValue]
 */
export function bindText(sig, getValue) {
	const g = getValue ?? ((el) => /** @type {T} */ (el.value))

	/** @this {InputEl} */
	function handler() {
		sig.value = g(this)
	}

	/** @param {InputEl} el */
	return (el) => {
		rawModel(el, 'input', handler, () => {
			el.value = sig._
		})
	}
}
