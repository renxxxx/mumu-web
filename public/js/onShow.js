log.logon=config.debug
var pagePre={}
window.pagePre=pagePre

if(config.debug){
  document.write(`<script src="https://s2.pstatp.com/cdn/expire-1-M/vConsole/3.4.0/vconsole.min.js" type="application/javascript"><\/script>`);
  setTimeout(function(){
    new VConsole({
      onReady:function(){
          $('#__vconsole .vc-switch').text('v').addClass('unselectable')
      }
    });
  },2000)
}

if(config.debug==0)
    noDebuger()
function noDebuger() {
    function testDebuger() {
        var d = new Date();
        debugger;
        if (new Date() - d > 10) {
            debugger;
            //document.body.innerHTML = '<div style="width: 100%;height: 50px;font-size: 30px;text-align: center;font-weight: bold;color:#ffffff;"></div>';
            return true;
        }
       return false;
   }
   function start() {
       while (testDebuger()) {
           testDebuger();
       }
   }
   if (!testDebuger()) {
       window.onblur = function () {
           setTimeout(function () {
               start();
           }, 500)
       }
   }else {
       start();
   }
}


function is_weixn(){  
  var ua = navigator.userAgent.toLowerCase();  
  if(ua.match(/MicroMessenger/i)=="micromessenger") {  
      return true;  
  } else {  
      return false;  
  }  
}




// try{
//   pagePre.login = JSON.parse(localStorage.getItem(config.project+'-login'))
//   pagePre.loginTime = parseInt(localStorage.getItem(config.project+'-loginTime'))
// }catch(e){

// }


//   $.ajax({
//     url:'/mumu/login-refresh',
//     async:false,
//     success:function(res){
//       if(res.code==0){
//         pagePre.login=res.data
//         localStorage.setItem(config.project+'-login',JSON.stringify(pagePre.login))
//         localStorage.setItem(config.project+'-loginTime',new Date().getTime())
//         setTimeout(function(){
//           $.post('/mumu/restore-template-wordbooks')
//         },1000)
//       }else{
//         login()
//       }
//     }
//   })
// }

// function login(){
//   if(is_weixn()){
//     var redirectUri=encodeURIComponent(location.origin + "/mumu/wx-web-auth")
//     var appId="wx5a33a2ccb2d91764"
//     var state=encodeURIComponent(location.href)
//     var url = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${appId}&redirect_uri=${redirectUri}&response_type=code&scope=snsapi_userinfo&state=${state}#wechat_redirect`
//     location.replace(url)
//   }else{
//     $.ajax({
//       url:'/mumu/anon-login',
//       async:false,
//       success:function(res){
//         if(res.code==0){
//           $.ajax({
//             url:'/mumu/login-refresh',
//             async:false,
//             success:function(res){
//               if(res.code==0){
//                 localStorage.setItem(config.project+'-login',JSON.stringify(res.data))
//                 localStorage.setItem(config.project+'-loginTime',new Date().getTime())
//                 pagePre.login=res.data
//                 setTimeout(function(){
//                   $.post('/mumu/restore-template-wordbooks')
//                 },2000)
//               }
//             }
//           })
//         }
//       }
//     })
//   }
// }


function randomnum(n){ 
    var t=''; 
    for(var i=0;i<n;i++){ 
        t+=Math.floor(Math.random()*10); 
    }
    return t; 
}

function isMobile(){
  return !isPc()
}
function isPc() {
    var userAgentInfo = navigator.userAgent;
    var Agents = ["Android", "iPhone",
          "SymbianOS", "Windows Phone",
          "iPad", "iPod"];
    var flag = true;
    for (var v = 0; v < Agents.length;v++){
      if (userAgentInfo.indexOf(Agents[v]) > 0){
        flag = false;
        break;
      }
    }
    return flag;
}

function O(p_value){
  this.value=p_value;

  O.prototype.attr = function(keyChain){
    
    this.last=null;
    if(!this.value || !keyChain){
      return null;
    }
     var keys= keyChain.split('.')
     var value1 = this.value;
     for(var i in keys){
         if(keys[i].indexOf('[')>=0){
            var key=keys[i].substring(0,keys[i].indexOf('['));
            var index = keys[i].substring(keys[i].indexOf('[')+1,keys[i].indexOf(']'));
            value1=value1[key];
            if(value1==null || value1==undefined){
              value1=null;
              break;
            }
            if(value1.length<=index){
                value1=null;
                break;
            }
            value1=value1[index];
         }else {
            value1=value1[keys[i]];
            if(value1==null || value1==undefined){
              value1=null;
              break;
            }
              
         }
     }
     return value1;
  }
}

function o(data){
  return new O(data);
}

window.onerror=function(message, source, lineno, colno, error){
  log.log(message+"-"+source+"-"+lineno+"-"+colno+"-"+error)
}


function clearAllCookie() {  
  var keys = document.cookie.match(/[^ =;]+(?=\=)/g);  
  if(keys) {  
      for(var i = keys.length; i--;)  
          document.cookie = keys[i] + '=0;expires=' + new Date(0).toUTCString()  
  }  
}

function videocapture(videoele){
  var scale = 0.25;
  let canvas = document.createElement("canvas");
  canvas.width = videoele.clientWidth;
  canvas.height = videoele.clientHeight;

  var lw = null;
  var lh = null;
  //高碰边
  var ww = canvas.height / (videoele.videoHeight/videoele.videoWidth)
  var hh = canvas.width * (videoele.videoHeight/videoele.videoWidth)
  if(ww<=canvas.width){
    lw=ww
    lh=canvas.height 
  }else if(hh<=canvas.height) {
    lw=canvas.width
    lh=hh
  }
  
  canvas.getContext('2d').drawImage(videoele, (canvas.width-lw)/2, (canvas.height-lh)/2, lw, lh);
  let image = document.createElement('img');
  image.src = canvas.toDataURL();
  if(!image.src){
    image.style.backgroundColor='#000000'
  }
  return image;
}

function geteletop(element,offsetTop) {
	debugger
  if(!element)
    return null;
  offsetTop=offsetTop?offsetTop:0
	var actualTop = element.offsetTop;
  actualTop=actualTop?actualTop:0

	offsetTop=offsetTop+actualTop
	var current = element.offsetParent;
	if(current == null)
		return offsetTop;
	else
		return geteletop(current,offsetTop)
}




function statisticsexps(){
      var nowdate = moment().format('L')
      var lastAddDate = localStorage.getItem(config.project+'-lastAddDate')
      if(!lastAddDate)
        localStorage.setItem(config.project+'-lastAddDate',nowdate)
      if(lastAddDate != nowdate){
        var totalTranslates = localStorage.getItem(config.project+'-totaltranslates')
        var totalSeconds = localStorage.getItem(config.project+'-totalseconds')
        totalTranslates=parseInt(totalTranslates?totalTranslates:0)
        totalSeconds=parseInt(totalSeconds?totalSeconds:0)

        var totalTranslatesNo = localStorage.getItem(config.project+'-totaltranslatesno')
        var totalSecondsNo = localStorage.getItem(config.project+'-totalsecondsno')
        totalTranslatesNo=parseInt(totalTranslatesNo?totalTranslatesNo:0)
        totalSecondsNo=parseInt(totalSecondsNo?totalSecondsNo:0)
        totalTranslates+=totalTranslatesNo
        totalSeconds+=totalSecondsNo

        localStorage.setItem(config.project+'-totaltranslates',totalTranslates)
        localStorage.setItem(config.project+'-totalseconds',totalSeconds)

        localStorage.setItem(config.project+'-totaltranslatesno',0)
        localStorage.setItem(config.project+'-totalsecondsno',0)

        localStorage.setItem(config.project+'-lastAddDate',nowdate)
      }
}

if(!config.debug)
  $ajaxCache.config({ 
    timeout: 1 * 24 * 60 * 60,
    cacheValidate: function (res) {
      //选填，配置全局的验证是否需要进行缓存的方法,“全局配置” 和 ”自定义“，至少有一处实现cacheValidate方法 return res.state === 'ok';
      return res.code == 0;
  }})

function isPcWeChat(){
  var ua = window.navigator.userAgent.toLowerCase();
  if(ua.match(/MicroMessenger/i) == 'micromessenger'){
      var system = {
         win: false,
          mac: false
     };
      //检测平台
      var p = navigator.platform;
     system.win = p.indexOf("Win") == 0;
    system.mac = p.indexOf("Mac") == 0;
    if (system.win || system.mac) {
         return true;
    }

}
return false
}

function concats(){
  var result = ''
  for (const iterator of arguments) {
    var str= iterator==null||iterator==undefined ?'':iterator
    result+=str
  }
  return result
}

$(window).one('beforeunload',function(){
  log.log('window.onbeforeunload')
  navigator.sendBeacon("/mumu/page-out");
})
