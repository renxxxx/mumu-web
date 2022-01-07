<template>
  <div id="_Index" >
      
  </div>
</template>

<script>
export default {
  name: 'index',
  data() {
    return { 
    }
  },
  methods:{
      start(){
            ts.$store.components[ts.$el.id]=ts
            ts.fullPath = ts.$route.fullPath;
            location.href='/'+ts.$project+"/discover.html"+location.search
      }
  },
  activated(){
        debugger
        let ts = this
        ts.prevTs = window.ts
        window.ts = ts
        if(!ts.fullPath || (ts.fullPath && ts.fullPath != ts.$route.fullPath))
            ts.start()
    },
    deactivated(){
        let ts = this
        window.ts = ts.prevTs
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
