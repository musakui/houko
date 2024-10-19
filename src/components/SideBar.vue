<script setup lang="ts">
import { RouterLink } from 'vue-router'
type LinkInfo = { path: string; name: string }
const props = defineProps<{ class?: string; links: LinkInfo[] }>()
</script>

<template>
	<aside class="flex-col gap-4 p-2" :class="props.class">
		<RouterLink v-for="r of props.links" :to="r.path" :key="r.path" class="hover:text-gray-600">
			{{ r.name }}
		</RouterLink>
		<hr class="border-gray/40" />
	</aside>
</template>