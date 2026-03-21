import { html, signal, computed } from '@musakui/ui'
import { cached } from './cached.js'

/** @typedef {'success' | 'warning' | 'error'} ToastType */
/** @typedef {ReturnType<typeof createToast>} Toast */

/**
 * @param {string} msg
 * @param {ToastType} [type]
 */
const createToast = (msg, type) => ({ msg, type, exit: signal(false) })

//const test = ['error', 'warning', 'success'].map((t) => createToast(`test ${t}`, t))

const toastItem = cached(ToastItem)
const toastList = signal(/** @type {Toast[]} */ ([]))

export const toasts = computed(() => toastList.value.map(toastItem))

/**
 * @param {string} msg
 * @param {object} [opts]
 * @param {number} [opts.duration]
 * @param {ToastType} [opts.type]
 */
export function addToast(msg, opts) {
	const toast = createToast(msg, opts?.type)
	toastList.value = [...toastList.value, toast]

	const dur = opts?.duration ?? 3000
	if (dur > 0) setTimeout(() => remove(toast), dur)

	return toast
}

/** @param {Toast} toast */
function remove(toast) {
	toast.exit.value = true

	setTimeout(() => {
		toastList.value = toastList.value.filter((t) => t !== toast)
	}, 300)
}

/** @param {Toast} t */
function ToastItem(t) {
	return html`<div
		data-type=${t.type}
		?data-exit=${t.exit}
		class="bg-card pointer-events-auto flex items-center rounded-lg p-3 transition-all duration-300 data-exit:translate-x-full data-exit:opacity-0 data-[type='error']:bg-rose-800 data-[type='success']:bg-lime-800 data-[type='warning']:bg-amber-600"
	>
		<div class="min-w-0 flex-1 text-sm wrap-break-word">
			${t.msg}
		</div>
		<button
			class="text-muted-foreground hover:text-foreground px-1 text-xl"
			aria-label="Close"
			@click=${() => remove(t)}
		>
			&times;
		</button>
	</div>`
}
