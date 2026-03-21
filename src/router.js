/// <reference types="@types/dom-navigation" />
import { html, signal } from '@musakui/ui'
import { close as closeAdditional } from './components/additional.js'

const initUrl = new URL(window.location.href)

export const pathname = signal(initUrl.pathname)
export const searchParams = signal(initUrl.searchParams)

export const routeName = signal('')
export const routeMatch = signal(/** @type {RegExpMatchArray | null} */ (null))

export const page = signal(loadingPage())

/**
 * @param {object} opts
 * @param {import('./util/types').RouteInfo[]} opts.routes
 */
export function initRouter(opts) {
	gotoRoute(matchRoute(pathname.value))

	window.navigation.addEventListener('navigate', (evt) => {
		if (!evt.canIntercept || evt.hashChange || evt.downloadRequest || evt.formData) return

		const newUrl = new URL(evt.destination.url)
		searchParams.value = newUrl.searchParams

		const nextPath = newUrl.pathname
		const nextRoute = matchRoute(nextPath)

		// console.log(evt)

		if (nextRoute?.name === routeName.value) {
			routeMatch.value = nextRoute.match
			evt.intercept()
			return
		}

		evt.intercept({
			async handler() {
				closeAdditional()
				page.value = loadingPage()
				await gotoRoute(nextRoute)
				pathname.value = nextPath
			},
		})
	})

	/** @param {ReturnType<typeof matchRoute>} routeInfo */
	async function gotoRoute(routeInfo) {
		if (!routeInfo) {
			routeName.value = 'not-found'
			routeMatch.value = null
			page.value = html`<div class="p-4">not found</div>`
			return
		}

		const r = (await routeInfo.component?.())?.default

		if (!r) {
			// invalid route
			return
		}

		routeName.value = routeInfo.name
		routeMatch.value = routeInfo.match
		page.value = r()
	}

	/** @param {string} pn */
	function matchRoute(pn) {
		for (const { path: p, ...r } of opts.routes) {
			if (typeof p === 'string') {
				if (p === pn) return { ...r, match: null }
				continue
			}
			const match = p.exec(pn)
			if (match) return { ...r, match }
		}
	}
}

/** @param {string} to */
export function navigate(to) {
	return window.navigation.navigate(to)
}

/** @param {Record<string, string>} params */
export function navigateQuery(params) {
	const cp = pathname.value
	const qs = `${new URLSearchParams(params)}`
	return window.navigation.navigate(qs ? `${cp}?${qs}` : cp)
}

function loadingPage() {
	return html`<div class="p-4">loading...</div>`
}
