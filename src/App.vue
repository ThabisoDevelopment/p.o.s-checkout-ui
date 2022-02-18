<template>
	<Navigation v-if="auth.token" />
	<router-view/>
	<notifications position="top right" />
</template>
<script>
import Navigation from "@/components/Navigation.vue"
import { reactive } from '@vue/reactivity'
export default {
	components: { Navigation },
	setup() {
		const auth = reactive({
			token: localStorage.getItem("token")
		})
		return { auth }
	}
}
</script>