<template>
    <div id="_Index" style="width:100%;max-width:800px;position:absolute;top:0;bottom:0;background-color: #272727;font-size:0;
        left:50%;transform: translateX(-50%);box-sizing: border-box;">
      <iframe v-if="src" v-show="src" ref='iframe' :src='src' style="width:100%;height:100%;border:none;"></iframe>
    </div>
</template>

<script>
export default {
  name: 'index',
  data() {
    return { 
        src:null
    }
  },
  methods:{
      start(){
            ts.$store.components[ts.$el.id]=ts
            ts.fullPath = ts.$route.fullPath;
            ts.src='/'+ts.$project+"/discover.html?"+ ts.$uu.getQueryString(location.href)
      }
  },
  activated(){
        let ts = this
        ts.prevTs = window.ts
        window.ts = ts
        if(!ts.fullPath || (ts.fullPath && ts.fullPath != ts.$route.fullPath))
            ts.start()

        var router = {}
        router.back=function(){
            debugger
            ts.$routerr.back()
        };
        router.isFirst=function(){
            return ts.$routerr.isFirst()
        };
        router.reload=function(forceGet){
            window.parent.location.reload(forceGet)
        };
        router.push=function(url){
            window.parent.location.href=url
        };
        router.replace=function(url){
            window.parent.location.replace(url)
        };
        setTimeout(adfadsf,100)
        function adfadsf(){
            var iframeWindow = ts.$refs.iframe.contentWindow
            if(iframeWindow.app){
                iframeWindow.app.router=router
            }else
                setTimeout(adfadsf,100)
        }
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
