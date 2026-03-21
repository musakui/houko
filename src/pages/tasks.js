import { effect } from 'alien-signals'
import { html, computed } from '@musakui/ui'

import { search } from '#/util/search.js'
import { cached } from '#/util/cached.js'
import { navigate, routeMatch } from '#/router.js'

import { tasks } from '#/data/tasks.js'
import * as Content from '#/components/additional.js'

let wasOpen = Content.isOpen.value

const taskId = computed(() => routeMatch.value?.groups?.id ?? null)

const taskRow = cached(TaskRow)

const showTasks = computed(() => {
	const st = search.value.trim()
	if (!st) return tasks.value.slice(0, 20)

	const m =
		st.toLowerCase() === st
			? /** @param {string} s */ (s) => s.toLowerCase().includes(st)
			: /** @param {string} s */ (s) => s.includes(st)

	return tasks.value.filter((t) => m(t.title) || m(t.id)).slice(0, 20)
})

export default function () {
	return html`<div class="grid auto-rows-min gap-1 p-2 font-mono">
		${computed(() => showTasks.value.map(taskRow))}
	</div>`
}

/** @param {import('../data/task').Task} task */
function TaskRow(task) {
	return html`<div class="col-span-4 grid grid-cols-subgrid gap-2 text-xs">
		<div>
			<label>${task.id}</label>
		</div>
		<div class="truncate font-sans" title=${task.title}>${task.title}</div>
		<div class="flex gap-2">
			<div>${task.priority}</div>
			<div>${task.added}</div>
			<div class="hidden md:block">${task.status}</div>
		</div>
		<a class="text-right" href=${`/tasks/${task.id}`}>✏️</a>
	</div>`
}

/** @param {string} id */
function TaskContent(id) {
	const task = tasks.value.find((t) => t.id === id)
	if (!task) return html`<div>task not found</div>`
	return html`<div class="flex flex-col gap-2 p-4 font-mono">
		<button class="absolute top-2 right-2" @click=${Content.close}>&times;</button>
		<div>${id}</div>
		<div class="font-sans text-sm">${task.title}</div>
		<div>${task.added}</div>
	</div>`
}

effect(() => {
	const t = taskId.value
	if (t) {
		Content.show(TaskContent(t))
		wasOpen = true
	} else {
		Content.close()
		wasOpen = false
	}
})

effect(() => {
	if (!Content.isOpen.value && wasOpen) navigate('/tasks')
})
