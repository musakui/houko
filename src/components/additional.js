import { html, signal } from '@musakui/ui'

import { useDragSize } from '#/util/dragSize.js'
import { useStorageBool } from '#/util/localStorage.js'

const side = useDragSize({
	key: 'drag:right',
	size: (evt) => window.innerWidth - evt.clientX,
})

const additionalContent = signal(
	/** @type {import('#/util/types').TemplateFrag | null} */ (null)
)

export const isOpen = useStorageBool('additional-open')

/**
 * Additional content.
 *
 * Appears as a right sidebar on md but becomes a dialog on smaller screens
 */
export default function () {
	return html`<div
		aria-expanded=${isOpen}
		class="fixed inset-0 z-50 hidden h-screen overflow-hidden bg-black/70 aria-expanded:grid md:relative"
		@click=${onClickBackdrop}
	>
		<aside
			style=${side.style}
			class="bg-card max-h-4/5 w-sm max-w-9/10 place-self-center overflow-auto rounded-lg border p-2 md:h-screen md:max-h-none md:w-(--drag-size) md:max-w-none"
		>
			${additionalContent}
		</aside>
		<div
			class="absolute inset-y-0 hidden w-2 cursor-col-resize border-l md:block"
			@pointerdown=${side.onDrag}
		></div>
	</div>`
}

/**
 * close additional content
 */
export function close() {
	isOpen.value = false
}

/**
 * show additional content
 *
 * @param {ReturnType<typeof html> | null} [content]
 */
export function show(content) {
	const c = content ?? null
	additionalContent.value = c
	isOpen.value = !!c
}

/**
 * @this HTMLDivElement
 * @param {MouseEvent} evt
 */
function onClickBackdrop(evt) {
	if (evt.target === this) close()
}
