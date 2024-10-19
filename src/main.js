import './reset.css'
import 'uno.css'
import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import { routes } from './routes.js'
import App from './App.vue'

const history = createWebHistory()
const router = createRouter({
	history,
	routes,
})

const app = createApp(App)
app.use(router)
app.mount('#app')
