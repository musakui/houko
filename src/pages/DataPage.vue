<script setup>
import { useStore } from '../utils/store.js'
const props = defineProps({ name: String })
const { store } = useStore()
const config = store.configs?.[props.name]
</script>

<template>
	<div v-if="config">
		{{ config }}
	</div>
	<div v-else>
		no config for {{ props.name }}
	</div>
</template>