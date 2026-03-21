import { signal } from '@musakui/ui'
import { getAll } from './api.js'

/** @typedef {import('./task').Task} Task */

export const tasks = signal(/** @type {Task[]} */ ([]))

getAll().then((r) => {
	tasks.value = r
})
