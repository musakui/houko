<script setup>
import { ref, shallowRef, watchEffect } from 'vue'
import { useSelection } from '@musakui/vueuse'
import { useStore } from '../utils/store.js'

const { store } = useStore()

const opt = /** @type {{ id?: number }} */ ({})
const ld = /** @type {string | import('../types').DataModule} */ ('loading...')
const api = shallowRef(ld)

const loading = ref(false)
const perPage = ref(20)
const pageIdx = ref(0)
const numPages = ref(1)
const isLastPage = ref(true)
const data = ref(/** @type {Record<string, unknown>} */ ([]))

const { selection, globalSelection, isSome, isAll, ...sel } = useSelection(data, opt)

const props = defineProps({ name: String })

/** @param {import('../types').DataConfig} config */
const loadModule = async (config) => {
	if (!config?.module) return `no config for ${props.name}`
	try {
		/** @type {import('../types').DataModule} */
		const m = await import(/* @vite-ignore */ config.module)
		await m.init?.(config)
		return { ...m }
	} catch (err) {
		return `${err}`
	}
}

watchEffect(() => {
	loadModule(store.configs?.[props.name]).then((r) => {
		api.value = r
	})
})
</script>

<template>
	<div v-if="typeof api === 'string'" class="p-4">{{ api }}</div>
	<template v-else>
		<div class="flex items-center justify-between">
			<div class="flex-1 text-xs text-gray-400">
				<span class="hidden sm:inline">
					{{ selection.length }} of {{ data.length }} selected ({{ globalSelection.length }} total)
				</span>
				<span class="sm:hidden">
					{{ selection.length }} / {{ data.length }} ({{ globalSelection.length }})
				</span>
			</div>
			<div class="flex items-center space-x-6 lg:space-x-8">
				<div class="flex items-center gap-2">
					<span class="hidden sm:inline-block text-xs">per page</span>
					<select v-model="perPage" class="w-auto sm:w-15 px-1 py-0.5 rounded-md text-xs bg-gray-800">
						<option v-for="v in [10, 15, 20, 25, 30, 40, 50]" :value="v">
							{{ v }}
						</option>
					</select>
				</div>
				<div class="text-xs">{{ pageIdx + 1 }} / {{ numPages }}</div>
				<div class="flex items-center gap-1 text-sm">
					<button class="disabled:opacity-70" :disabled="!pageIdx" @click="pageIdx = 0">⏮️</button>
					<button class="disabled:opacity-70" :disabled="!pageIdx" @click="--pageIdx">◀️</button>
					<button class="disabled:opacity-70" :disabled="isLastPage" @click="++pageIdx">️▶️</button>
					<button class="disabled:opacity-70" :disabled="isLastPage" @click="pageIdx = numPages - 1">️⏭</button>
				</div>
			</div>
		</div>
		<div class="overflow-y-auto">
			<div class="rounded-md border">
				<div class="relative w-full overflow-auto">
					<table class="w-full table-fixed caption-bottom text-sm font-mono"></table>
				</div>
			</div>
		</div>
	</template>
</template>
