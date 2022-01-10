videoDom=$('#video')[0]

if(query.isFavorite){
    $('#titleBar').show()
    $('#tabBar').hide()
}else{
    $('#titleBar').hide()
    $('#tabBar').show()
}

$('#titleBar .title').text(query.title||'')

setTimeout(function(){
    $('#logo').hide()
    $('#index').show()
},1000)

$('#video')[0].crossOrigin = 'anonymous';

document.addEventListener('WeixinJSBridgeReady',function(){
    $('#video')[0].play();
},false);

if(query.videoNo){
    $.ajax({
        url: '/mumu/video?',
        ajaxCache:true,
        data: 'videoNo='+query.videoNo,
        async: false,
        success: function(res) {
            if(res.code==0){
                queryVideo = res.data.video
            }
        }
    })
}


if(currentCaption)
    setline(currentCaption);

setTimeout(recordView(),5000)

goNextVideo()

onresize()

doSubtitlesStatus()

if(is_weixn()){
    $.post('/mumu/wxjsapiticket',(res)=>{
        $.post('/mumu/wxsign',{ticket:res.data.ticket,url:location.href},(res)=>{
            //log.log(JSON.stringify(res));
            wx.config({
                debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                appId: res.data.appid, // 必填，公众号的唯一标识
                timestamp: res.data.timestamp, // 必填，生成签名的时间戳
                nonceStr:  res.data.nonceStr, // 必填，生成签名的随机串
                signature:  res.data.signature,// 必填，签名
                jsApiList: ['updateAppMessageShareData','updateTimelineShareData'] // 必填，需要使用的JS接口列表
            });
        })
    })

    var shareLink = location.origin+'/mumu?videoNo='+videoNo;
    wx.ready(function () {   //需在用户可能点击分享按钮前就先调用
        wx.updateAppMessageShareData({ 
            title: ttb(video.name), // 分享标题
            desc: ttb(video.nickname), // 分享描述
            link: shareLink, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
            imgUrl: location.origin+'/mumu/favicon.ico', // 分享图标
            success: function () {
                // 设置成功
            }
        })

        wx.updateTimelineShareData({ 
            title: ttb(video.name) + '\n'+ttb(video.nickname), // 分享标题
            link: shareLink, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
            imgUrl: location.origin+'/mumu/favicon.ico', // 分享图标
            success: function () {
            // 设置成功
            }
        })
    });
}







