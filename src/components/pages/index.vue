<template>
  <div id="index" >
      
  </div>
</template>

<script>
export default {
  name: 'index',
  data() {
    return { 
    }
  },
  props: {
    msg: String
  },
  mounted() {
      location.href="./discover.html"+location.search
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
