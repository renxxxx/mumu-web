let project='mumu'
let version='0'

import * as vue from 'vue'
import router from './router.js'
import App from './App.vue'
import uu from './assets/js/uu.js'
import md5 from './assets/js/md5.js'
import axios from 'axios'
import qs from 'querystring'
import { Dialog,Notify } from 'vant'
import 'vant/lib/dialog/style';
import 'vant/lib/notify/style';
import login from './components/modules/login.vue'
import $$ from 'jquery'


let store = vue.reactive({
    doLogin: null,
    login: null,
    vconsole:null,
})

async function loginRefresh(){
    await axios.post('/mumu/login-refresh')
          .then(function (res) {
            if(res.data.code==0){
              store.login=res.data.data
            }
          })
    if(!store.login){
      await axios.post('/mumu/anon-login')
            .then(function (res) {
              if(res.data.code==0){
                axios.post('/mumu/login-refresh')
                .then(function (res) {
                    if(res.data.code==0){
                        store.login=res.data.data
                    }
                })
              }
            })
    }
  }


var app = vue.createApp(App)
window.app=app;
window.root=root;
app.use(router)
app.use(Dialog)
app.use(Notify)
app.component("login", login)
app.config.globalProperties.window=window
app.config.globalProperties.$project=project
app.config.globalProperties.$version=version
app.config.globalProperties.$store=store
app.config.globalProperties.$uu=uu
app.config.globalProperties.$md5=md5
app.config.globalProperties.o=uu.o
app.config.globalProperties.$axios=axios
app.config.globalProperties.$qs=qs
app.config.globalProperties.$tologin=0
app.config.globalProperties.$loginRefresh=loginRefresh
app.config.globalProperties.$$=$$
app.config.globalProperties.$vconsole=null
var root = app.mount('#app')




