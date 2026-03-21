import { html, signal } from '@musakui/ui'

import { addToast } from '#/util/toast.js'
import { bindText } from '#/util/input.js'
import { isString } from '#/util/lodash.js'
import { useStorageString } from '#/util/localStorage.js'

export const hostUrl = useStorageString('host-url')

export default function () {
	const hostStr = signal(hostUrl.value)

	/**
	 * @this {HTMLFormElement}
	 * @param {SubmitEvent} evt
	 */
	function onSubmit(evt) {
		evt.preventDefault()
		const data = new FormData(this)
		const host_url = data.get('host_url')
		if (isString(host_url)) {
			hostUrl.value = host_url
		}
		addToast('settings saved', { type: 'success' })
	}

	return html`<div class="p-4">
		<form class="grid gap-2" @submit=${onSubmit}>
			<div class="grid gap-2">
				<label for="host_url" class="flex items-center text-sm font-medium">host</label>
				<input
					type="url"
					id="host_url"
					name="host_url"
					autocomplete="off"
					class="bg-input w-full rounded-md border px-3 py-2 text-sm"
					${bindText(hostStr)}
				/>
			</div>
			<div class="flex">
				<div class="grow"></div>
				<button
					type="submit"
					class="bg-primary text-primary-foreground rounded-md px-3 py-1"
				>
					save
				</button>
			</div>
		</form>
	</div>`
}
