<template>
	<div>

	</div>
</template>

<script>
export default {
	name: 'redirect',
	activated(){
		debugger
		this.$routerr.replace(decodeURIComponent(this.$route.query.path))
	},
	methods: {
		
	},
}
</script>
