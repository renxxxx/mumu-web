<template>
  <div>
    <router-view></router-view>
    <login v-if="$store.dologin" />
  </div>
</template>

<script>
import login from './components/login.vue'
export default {
  name: 'App',
  components:{
    login
  },
  mounted(){
    let ts=this
    ts.$axios.post('/mumu/login-refresh')
          .then(function (res) {
            if(res.data.code==0){
              ts.$router.reload()
              ts.$store.login=res.data.data
            }
          })
  }
}
</script>

<style>
#app {

}
body {
  margin:0;
  padding:0;
}

.lin1ellipsis {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

* {
    -moz-user-select:none;/*火狐*/
    -webkit-user-select:none;/*webkit浏览器*/
    -ms-user-select:none;/*IE10*/
    -khtml-user-select:none;/*早期浏览器*/
    user-select:none;
}

.unselectable {
    -moz-user-select:none;/*火狐*/
    -webkit-user-select:none;/*webkit浏览器*/
    -ms-user-select:none;/*IE10*/
    -khtml-user-select:none;/*早期浏览器*/
    user-select:none;
}

.selectable {
    -moz-user-select:text;/*火狐*/
    -webkit-user-select:text;/*webkit浏览器*/
    -ms-user-select:text;/*IE10*/
    -khtml-user-select:text;/*早期浏览器*/
    user-select:text;
}
</style>
