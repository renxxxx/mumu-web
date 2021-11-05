<template>
      <router-view></router-view>
      <login v-if="$store.doLogin"></login>
</template>

<script>
export default {
  name: 'App',
  async beforeCreate(){
    let ts = this;
  },
  methods:{
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

.line1 {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    vertical-align: top;
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
