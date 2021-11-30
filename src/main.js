let project='mumu'
let version='21110219'

import * as vue from 'vue'
import router from './router.js'
import App from './App.vue'
import uu from './assets/js/uu.js'
import v from './assets/js/v.js'
import md5 from './assets/js/md5.js'
import axios from 'axios'
import qs from 'querystring'
import { Dialog, Notify, Loading, Popup, Overlay } from 'vant'
import 'vant/lib/dialog/style';
import 'vant/lib/notify/style';
import 'vant/lib/loading/style';
import m_login from './components/modules/login.vue'
import $$ from 'jquery'
import Vconsole from 'vconsole'

let store = vue.reactive({
    doLogin: null,
    login: {},
    vconsole:null,
    history:[],
    components:{},
})

let ddd = localStorage.getItem("ddd")
if(!ddd && uu.isWeixn()){
    var redirectUri=encodeURIComponent(location.origin + "/mumu/wx-web-auth")
    var appId="wx5a33a2ccb2d91764"
    var state=encodeURIComponent(location.href)
    var url = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${appId}&redirect_uri=${redirectUri}&response_type=code&scope=snsapi_userinfo&state=${state}#wechat_redirect`
    location.replace(url)
}
localStorage.removeItem('ddd')

async function loginRefresh(){
    
    await axios.post('/mumu/login-refresh').then(function (res) {
        
        if(res.data.code==0){
            store.login=res.data.data
        }
    })
    if(!store.login){
        await axios.post('/mumu/anon-login').then(function (res) {
            
            if(res.data.code==0){
                axios.post('/mumu/login-refresh').then(function (res) {
                    
                    if(res.data.code==0){
                        store.login=res.data.data
                    }
                })
            }
        })
    }
}

loginRefresh().then(res=>{
    var app = vue.createApp(App)
    app.use(router)
    app.use(Dialog)
    app.use(Notify)
    app.use(Loading)
    app.use(Popup)
    app.use(Overlay)
     
    app.component("login", m_login)
    app.config.globalProperties.window=window
    app.config.globalProperties.$project=project
    app.config.globalProperties.$version=version
    app.config.globalProperties.$store=store
    app.config.globalProperties.$uu=uu
    app.config.globalProperties.$v=v
    app.config.globalProperties.$md5=md5
    app.config.globalProperties.o=uu.o
    app.config.globalProperties.$axios=axios
    app.config.globalProperties.$qs=qs
    app.config.globalProperties.$loginRefresh=loginRefresh
    app.config.globalProperties.$$=$$
    // app.config.globalProperties.$vconsole=new Vconsole()
    // app.config.globalProperties.$vconsole.hideSwitch();
    app.config.globalProperties.$push=function(to){
        router.push(to)
        store.history.push(to.path?to.path:to)
    };
    app.config.globalProperties.$replace=function(to){
        router.replace(to)
        store.history.pop()
        store.history.push(to.path?to.path:to)
    };
    app.config.globalProperties.$back=function(){
        if(store.history.length==0){
            router.replace('/')
        }else{
            router.back()
        }
        store.history.pop()
    };
    var root = app.mount('#app')
    window.app=app;
    window.root=root;
})








