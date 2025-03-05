/** @satisfies {import('vue-router').RouteRecordRaw[]} */
export const routes = [
	{ path: '/', name: 'home', component: () => import('./pages/HomePage.vue') },
	{
		name: 'data',
		path: '/d/:name',
		props: true,
		component: () => import('./pages/DataPage.vue'),
	},
	{
		name: 'notFound',
		path: '/:match(.*)',
		component: () => import('./pages/NotFoundPage.vue'),
	},
]
