<script setup>
import { ref, useTemplateRef } from 'vue'
import { RouterLink, RouterView } from 'vue-router'
import { useStore } from './utils/store.js'
import SideBar from './components/SideBar.vue'

const sb = ref(false)
const txt = ref('')
const err = ref('')
const mode = ref('')
const { store, setStore } = useStore()
const dialog = useTemplateRef('dialog')

const showSettings = () => {
	mode.value = 'st'
	txt.value = JSON.stringify(store, null, 2)
	dialog.value?.showModal()
}

const processText = () => {
	switch (mode.value) {
		case 'st':
			err.value = setStore(txt.value)
			break
		default:
		//
	}
	if (!err.value) dialog.value?.close()
}

const handleFile = async (evt) => {
	/** @type {File} */
	const file = evt.target?.files?.[0]
	if (!file) return
	txt.value = await file.text()
}
</script>

<template>
	<div class="flex flex-col h-screen">
		<header class="px-2 py-1.5 flex gap-2 items-center md:justify-between border-b border-gray/40">
			<RouterLink to="/" class="hidden md:block">🏠</RouterLink>
			<button class="md:hidden w-9 h-7 rounded bg-gray-700" @click="sb = !sb">
				{{ sb ? '✕' : '☰' }}
			</button>
			<div class="grow"></div>
			<button class="px-2 h-7 rounded bg-gray-700" @click="showSettings">⚙️</button>
		</header>
		<div class="flex overflow-hidden">
			<SideBar :links="store.links" class="hidden md:flex min-w-32 border-r border-gray/40" />
			<Transition enter-from-class="-translate-x-full" leave-to-class="-translate-x-full">
				<SideBar v-if="sb" :links="store.links" class="absolute flex z-999 bg-gray-900 h-4/5 w-40 transition-all" />
			</Transition>
			<main class="flex flex-col gap-2 p-2 overflow-x-hidden">
				<RouterView />
			</main>
		</div>
	</div>
	<dialog ref="dialog" class="w-full lg:w-1/2 bg-transparent backdrop:bg-gray-950/90" @click.self="dialog.close()">
		<div class="flex flex-col gap-2 p-2 rounded rounded-lg bg-gray-900 text-gray-100">
			<textarea v-model="txt"
				class="p-2 h-50 bg-gray-800 font-mono rounded focus:outline focus:outline-gray-500"></textarea>
			<div class="flex gap-2 items-center justify-between">
				<div v-if="err" class="text-red-400 truncate" :title="err">{{ err }}</div>
				<input v-else type="file" @change="handleFile"
					class="hover:cursor-pointer file:border-0 file:bg-gray-700 file:text-gray-100 file:rounded file:px-2 file:py-1" />
				<button class="w-12 py-1 rounded bg-gray-700" @click="processText">ok</button>
			</div>
		</div>
	</dialog>
</template>

<style>
* {
	scrollbar-width: thin;
}
</style>