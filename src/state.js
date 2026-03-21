import { isFunction } from './util/lodash.js'

/** @type {Record<string | symbol, unknown>} */
export const state = {}

/**
 * @template T
 * @param {string | symbol} key
 * @param {T | (() => T)} factory
 */
export const useState = (key, factory) => {
	state[key] ??= isFunction(factory) ? factory() : factory
	return /** @type {T} */ (state[key])
}
