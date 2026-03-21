import { signal, computed } from '@musakui/ui'
import { clamp } from './lodash.js'
import { useStorage } from './localStorage.js'

/**
 * @param {object} opts
 * @param {string} [opts.key] key for `localStorage`
 * @param {string} [opts.prop] CSS variable
 * @param {number} [opts.minSize] minimum size
 * @param {number} [opts.maxSize] maximum size
 * @param {number} [opts.initSize] default starting size
 * @param {(evt: MouseEvent) => number} opts.size
 */
export function useDragSize(opts) {
	const key = opts?.key ?? 'drag-size'
	const prop = opts?.prop ?? '--drag-size'

	const init = opts?.initSize ?? 200
	const minSize = opts?.minSize ?? 200
	const maxSize = opts?.maxSize ?? 500

	const dragSize = opts.size

	const size = useStorage(key, {
		parse: (s) => parseFloat(s || '') || init,
	})

	const moving = signal(0)

	/** @param {MouseEvent} evt */
	function onDrag(evt) {
		evt.preventDefault()
		moving.value = size.value
		window.addEventListener('pointermove', onPointerMove)
		window.addEventListener('pointerup', onPointerUp, { once: true })
	}

	/** @param {MouseEvent} evt */
	function onPointerMove(evt) {
		moving.value = clamp(dragSize(evt), minSize, maxSize)
	}

	function onPointerUp() {
		size.value = moving.value
		moving.value = 0
		window.removeEventListener('pointermove', onPointerMove)
	}

	return {
		size,
		onDrag,
		style: computed(() => `${prop}: ${(moving.value || size.value).toFixed()}px`),
	}
}
