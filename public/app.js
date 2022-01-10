var app={};
var config=app;
window.app=window.config=app;
app.project="mumu";
app.version="123"
app.debug=1

$.ajaxSetup({
    type:'post',
})


$(window).one('beforeunload',function(){
    log.log('window.onbeforeunload')
    navigator.sendBeacon("/mumu/page-out");
    var prevRoute = sessionStorage.getItem(app.project+'-prevRoute')
    if(!prevRoute)
        sessionStorage.setItem(app.project+'-fromNullRoute',"1")
    else
        sessionStorage.removeItem(app.project+'-fromNullRoute')
    sessionStorage.setItem(app.project+'-prevRoute',location.href)
})

var prevRoute = sessionStorage.getItem(app.project+'-prevRoute')
var fromNullRoute = sessionStorage.getItem(app.project+'-fromNullRoute')
if(prevRoute && prevRoute==location.href && fromNullRoute){
    sessionStorage.removeItem(app.project+'-prevRoute')
}

var router = {}
app.router=router
router.back=function(){
    if(app.isFirst()){
        location.replace("/"+app.project+"/")
    }else{
        history.back()
    }
};
router.isFirst=function(){
    var prevRoute = sessionStorage.getItem(app.project+'-prevRoute')
    if(prevRoute && (prevRoute.indexOf("/"+app.project) >= 0 || prevRoute.indexOf("#") == 0)){
        return false
    }else{
        return true
    }
};
router.reload=function(forceGet){
    location.reload(forceGet)
};
router.push=function(url){
    location.href=url
};
router.replace=function(url){
    location.replace(url)
};
app.loginRefresh = function(){
    if(isWechat()){
        $.ajax({
            url:'/mumu/is-wx-authorized',
            async:false,
            success:function(res){
                if(res.code==0){
                    var isWxAuthorized =res.data.isWxAuthorized
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

    $.ajax({
        url:'/mumu/is-logined',
        async:false,
        success:function(res){
            if(res.code==0){
                let isLogined =res.data.isLogined
                if(!isLogined){
                    $.ajax({
                        url:'/mumu/anon-login',
                        async:false
                    })
                }
            }
        }
    })

    $.ajax({
        url:'/mumu/login-refresh',
        async: false,
        success:function(res){
            if(res.code==0){
                app.login=res.data
                sessionStorage.setItem(app.project+'-login',JSON.stringify(res.data))
                setTimeout(function(){
                    $.post('/mumu/restore-template-wordbooks')
                },2000)
            }
        }
    })
}
app.loginRefresh();