var app={};
var config=app;
window.app=window.config=app;
app.project="mumu";
app.version="123"
app.debug=1


app.routeBack=function(){
    var history = sessionStorage.getItem(app.project+'-history')
    if(!history){
        location.href="/"+app.project+"/"
    }else {
        history--;
        sessionStorage.getItem(app.project+'-history', history)
        location.back()
    }
}
app.routePush=function(url){
    var history = sessionStorage.getItem(app.project+'-history')
    history = history ? history : 0;
    history++
    sessionStorage.getItem(app.project+'-history', history)
    location.href=url
}
app.routeReplace=function(url){
    location.replace(url)
}

app.loginRefresh = function(){
    if(isWechat()){
        $.ajax({
            url:'/mumu/is-wx-authed',
            async:false,
            success:function(res){
                if(res.code==0){
                    var isWxAuthed =res.data.isWxAuthed
                    if(!isWxAuthed){
                        var redirectUri=encodeURIComponent(location.origin + "/mumu/wx-web-auth")
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
        async:false,
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