<template>
    <router-view v-slot="{ Component }">
        <transition>
          <keep-alive>
            <component :is="Component" />
          </keep-alive>
        </transition>
    </router-view>
    <login v-if="$store.doLogin"></login>
    <authentication v-if="$store.doAuthentication"></authentication>
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
    position: absolute;
    top:0;
    bottom:0;
    left:0;
    right:0;
}
body {
  margin:0;
  padding:0;
  position: initial;
}
html {
    position: initial;
}
.line1 {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    vertical-align: top;
}
.line2 {
    text-overflow: -o-ellipsis-lastline;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
    vertical-align: top;
    word-break: break-word;
    white-space:initial;
}
* {
    -moz-user-select:none;/*火狐*/
    -webkit-user-select:none;/*webkit浏览器*/
    -ms-user-select:none;/*IE10*/
    -khtml-user-select:none;/*早期浏览器*/
    user-select:none;
    box-sizing: border-box;
    position: relative;
}

span,img,a,input {
    display:inline-block;
    vertical-align: middle;
}

span,a {
    vertical-align: middle;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
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

img {
    object-fit: cover;
}
</style>
