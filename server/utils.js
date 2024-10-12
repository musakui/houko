/**
 * @param {unknown} s message
 * @param {string | number} c ANSI code
 */
export const col = (s, c) => `\x1b[${c}m${s}\x1b[0m`

export const abort = (msg = 'something went wrong') => {
	throw new Error(msg)
}
