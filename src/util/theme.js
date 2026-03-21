import { useStorage } from './localStorage.js'

const DARK = 'dark'
const LIGHT = 'light'
const SYSTEM = 'system'

export const theme = useStorage('theme', {
	parse: (s) => /** @type {'light' | 'dark' | 'system'} */ (s ?? SYSTEM),
	serialize: (v) => (v === SYSTEM ? null : v),
})

export function toggleTheme() {
	const t = theme.value
	const v = t === LIGHT ? SYSTEM : t === DARK ? LIGHT : DARK
	theme.value = v
	return v
}
