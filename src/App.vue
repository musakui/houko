<script setup>
import { ref } from 'vue'
import { RouterLink, RouterView } from 'vue-router'
import SideBar from './components/SideBar.vue'
const links = [{ name: 'home', path: '/' }]
const sb = ref(false)
</script>

<template>
	<div class="flex flex-col h-screen">
		<header class="px-2 py-1.5 flex gap-2 items-center md:justify-between border-b border-gray/40">
			<RouterLink to="/" class="hidden md:block">🏠</RouterLink>
			<button class="md:hidden w-9 h-7 rounded bg-gray-700" @click="sb = !sb">
				{{ sb ? '✕' : '☰' }}
			</button>
			<div class="grow"></div>
			<button class="px-2 h-7 rounded bg-gray-700">⚙️</button>
		</header>
		<div class="flex overflow-hidden">
			<SideBar :links="links" class="hidden md:flex min-w-32 border-r border-gray/40" />
			<Transition enter-from-class="-translate-x-full" leave-to-class="-translate-x-full">
				<SideBar v-if="sb" :links="links" class="absolute flex z-999 bg-gray-900 h-4/5 w-40 transition-all" />
			</Transition>
			<main class="flex flex-col gap-2 p-2 overflow-x-hidden">
				<RouterView />
			</main>
		</div>
	</div>
</template>

<style>
* {
	scrollbar-width: thin;
}
</style>