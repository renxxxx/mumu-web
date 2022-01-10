<template>
	<div>

	</div>
</template>

<script>
export default {
	name: 'redirect',
	activated(){
		this.$router.replace(decodeURIComponent(this.$route.query.path))
	},
	methods: {
		
	},
}
</script>
