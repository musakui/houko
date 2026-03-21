import { html, signal, computed } from '@musakui/ui'

import { theme, toggleTheme } from '#/util/theme.js'

import { toggle } from '#/util/signal.js'
import { search } from '#/util/search.js'
import { bindText } from '#/util/input.js'
import { routeName } from '#/router.js'
import { useStorageBool } from '#/util/localStorage.js'

const navSearch = signal('')
const isOpen = useStorageBool('nav-open')

const themeIcons = { light: '🔆', dark: '🌙', system: null }

export function NavHeader() {
	return html`<nav class="sticky top-0 flex items-center gap-2 border-b p-2">
		<button
			class="hover:text-accent-foreground/60 md:hidden"
			title="toggle left sidebar"
			@click=${toggle(isOpen)}
		>
			☰
		</button>
		<h1 class="hover:text-accent-foreground/60 px-1"><a href="/">houko</a></h1>
		<div class="flex-1">
			<input
				type="search"
				class="bg-input w-full max-w-sm rounded-md px-2 py-1"
				${bindText(navSearch)}
				@change=${updateSearch}
			/>
		</div>
	</nav>`
}

export function NavSidebar() {
	return html`<nav
		aria-expanded=${isOpen}
		class="bg-background absolute hidden h-full flex-col overflow-hidden border-r aria-expanded:flex md:relative md:flex"
	>
		<div class="flex min-w-30 flex-col overflow-auto p-1">
			<a
				class="hover:bg-accent/80 aria-current:bg-accent/50 rounded-sm px-2 py-1"
				aria-current=${currentPage('tasks')}
				href="/tasks"
			>
				Tasks
			</a>
			<a
				class="hover:bg-accent/80 aria-current:bg-accent/50 rounded-sm px-2 py-1"
				aria-current=${currentPage('settings')}
				href="/settings"
			>
				Settings
			</a>
		</div>
		<button class="fixed bottom-2 left-2" title="theme toggle" @click=${toggleTheme}>
			${computed(() => themeIcons[theme.value] ?? '🖥️')}
		</button>
	</nav>`
}

/** @param {string} name */
function currentPage(name) {
	return computed(() => routeName.value === name)
}

/** @this HTMLInputElement */
function updateSearch() {
	search.value = this.value
}
