$.ajaxSetup({
    type:'post',
})

let isStarted = sessionStorage.getItem(app.project+'-isStarted')
if(!isStarted){
    $.ajax({
        url:'/mumu/is-logined',
        async:false,
        success:function(res){
          if(res.code==0){
            let isLogined =res.data.isLogined
            if(!isLogined){
                $.ajax({
                    url:'/mumu/anon-login',
                    async:false,
                    success:function(res){
                        if(res.code==0){
                            if(isWechat()){
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
            }
        }
    })

    $.ajax({
        url:'/mumu/login-refresh',
        async:false,
        success:function(res){
        if(res.code==0){
            app.login=res.data
            localStorage.setItem(app.project+'-login',JSON.stringify(res.data))
            setTimeout(function(){
                $.post('/mumu/restore-template-wordbooks')
            },2000)
        }
        }
    })
    
    isStarted = 1;
    sessionStorage.setItem(app.project+'-isStarted',isStarted)
}