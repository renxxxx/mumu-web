initws()
setInterval(() => {
    if(ws && ws.readyState==3){
        initws()
    }
}, 5000);
setInterval(function(){
    if(ws && ws.readyState==1){
        ws.send("1")
    }
},30000)


var ws = null;
function initws(){
    ws = new WebSocket(`wss://${location.host}/mumu/websocket/${app.login.userNo}`); 
    //申请一个WebSocket对象，参数是服务端地址，同http协议使用http://开头一样，WebSocket协议的url使用ws://开头，另外安全的WebSocket协议使用wss://开头
    ws.onopen = function(){
        
    }
    ws.onmessage = function(e){
        //当客户端收到服务端发来的消息时，触发onmessage事件，参数e.data包含server传递过来的数据
        //log.log("ws onmessage: "+e.data);
        var data = JSON.parse(e.data)
        if(data.action == 1){
            // if(data.nickname!=null){
            //     data.nickname = data.nickname.substr(0, 1) + '...' +data.nickname.substr(3)
            // }
            var ele = $('#chatmsgtemple').clone(true)
            ele.attr('id','chatmsg'+data.msgNo)
            if(data.userNo==$.cookie('token'))
                ele.css('color','green')
            ele.find('.name').text(data.nickname||"网友")
            ele.find('.msg').text(data.text);
            ele.find('.looking').text(data.looking);
            ele.show();
            $('#chatmsgspad').prepend(ele)
            $('#lastmsg').text((data.nickname||"网友").substr(0,6) +" : "+data.text)
        }
    }
    ws.onclose = function(e){
        //当客户端收到服务端发送的关闭连接请求时，触发onclose事件
    }
    ws.onerror = function(e){
        //如果出现连接、处理、接收、发送数据失败的时候触发onerror事件
    }   
}

