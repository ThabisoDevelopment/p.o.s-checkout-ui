<template>
	<Navigation />
	<router-view/>
	<notifications position="top right" />
</template>
<script>
import Navigation from "@/components/Navigation.vue"
export default {
	components: { Navigation },
	setup() {

	}
}
</script>