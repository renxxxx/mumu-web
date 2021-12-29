<template>
	<div>

	</div>
</template>

<script>
export default {
	name: 'redirect',
	activated(){
		debugger
		this.$router.replace(decodeURIComponent(this.$route.query.path))
	},
	methods: {
		
	},
}
</script>
