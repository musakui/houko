import './styles.css'

import { effect } from 'alien-signals'
import { html } from '@musakui/ui'

import { theme } from './util/theme.js'
import { toasts } from './util/toast.js'
import { initRouter, page } from './router.js'

import { NavHeader, NavSidebar } from './components/nav.js'
import AdditionalContent from './components/additional.js'

const app = html`<div class="flex h-screen w-full overflow-hidden overscroll-none">
		<div class="flex h-full flex-1 flex-col overflow-hidden">
			${NavHeader()}
			<div class="oveflow-hidden relative flex h-full">
				${NavSidebar()}
				<main class="h-full flex-1 overflow-auto">${page}</main>
			</div>
		</div>
		${AdditionalContent()}
	</div>
	<div
		class="pointer-events-none absolute right-0 bottom-0 z-50 flex w-full max-w-sm flex-col gap-2 overflow-hidden p-3 sm:max-w-md"
	>
		${toasts}
	</div>`

export function init() {
	initRouter({
		routes: [
			{
				name: 'home',
				path: '/',
				component: () => import('./pages/home.js'),
			},
			{
				name: 'settings',
				path: '/settings',
				component: () => import('./pages/settings.js'),
			},
			{
				name: 'tasks',
				path: /^\/tasks(?:\/(?<id>[\w-]+))?$/,
				component: () => import('./pages/tasks.js'),
			},
		],
	})
	app.init()
	document.body.replaceChildren(app)
}

console.log(`loaded ${Date.now()}`)

effect(() => {
	document.body.dataset.theme = theme.value
})

init()

if (import.meta.hot) {
	import.meta.hot.accept((m) => m?.init())
}
