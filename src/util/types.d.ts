import type { html } from '@musakui/ui'

export type TemplateFrag = ReturnType<typeof html>

export type RouteInfo = {
	path: string | RegExp
	name: string
	component?: () => Promise<{ default: () => TemplateFrag }>
}
