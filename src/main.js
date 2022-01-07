let project='mumu'
let version='22010718'

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
import m_authentication from './components/modules/authentication.vue'
import $$ from 'jquery'
import Vconsole from 'vconsole'

let store = vue.reactive({
    doLogin: 0,
    doAuthentication: 0,
    login : null,
    vconsole:null,
    components:{},
})

$$.ajaxSetup({
    type:'post',
})

async function loginRefresh(){
    if(uu.isWeixn()){
        $$.ajax({
            url:'/mumu/is-wx-authorized',
            async:false,
            success:function(res){
                if(res.code==0){
                    let isWxAuthorized =res.data.isWxAuthorized
                    if(!isWxAuthorized){
                        var redirectUri=encodeURIComponent(location.origin + "/mumu/wx-web-authorize")
                        var appId="wx5a33a2ccb2d91764"
                        var state=encodeURIComponent(location.href)
                        var url = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${appId}&redirect_uri=${redirectUri}&response_type=code&scope=snsapi_userinfo&state=${state}#wechat_redirect`
                        location.replace(url)
                    }
                }
            }
        })
    }

    $$.ajax({
        url:'/mumu/is-logined',
        async:false,
        success:function(res){
            if(res.code==0){
                let isLogined =res.data.isLogined
                if(!isLogined){
                    $$.ajax({
                        url:'/mumu/anon-login',
                        async:false,
                    })
                }
            }
        }
    })
    
    $$.ajax({
        url:'/mumu/login-refresh',
        async:false,
        success:function(res){
        if(res.code==0){
            store.login=res.data
            setTimeout(function(){
                $$.post('/mumu/restore-template-wordbooks')
            },2000)
        }
        }
    })
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
    app.component("authentication", m_authentication)
    
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

    
    app.config.globalProperties.$routerr={}
    app.config.globalProperties.$routerr.back=function(){
        debugger
        if(app.config.globalProperties.$routerr.isFirst()){
            router.replace('/')
        }else{
            router.back()
        }
    };
    app.config.globalProperties.$routerr.isFirst=function(){
        var prevRoute = sessionStorage.getItem(project+'-prevRoute')
        if(prevRoute && (prevRoute.indexOf("/"+project) >= 0 || prevRoute.indexOf("#") == 0)){
            return false
        }else{
            return true
        }
    };
    var root = app.mount('#app')
    window.app=app;
    window.root=root;
})








