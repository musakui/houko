export const routes = [
	{ path: '/', name: 'home', component: () => import('./pages/HomePage.vue') },
	{
		name: 'notFound',
		path: '/:match(.*)',
		component: () => import('./pages/NotFoundPage.vue'),
	},
]