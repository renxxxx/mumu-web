<template>
	<div>

	</div>
</template>

<script>
export default {
	name: 'redirect',
	mounted(){
		debugger
		let query = {}
		this.$router.replace({path:this.$route.query.path,query:this.$qs.parse(this.$route.query.query)})
	},
	methods: {
		
	},
}
</script>
