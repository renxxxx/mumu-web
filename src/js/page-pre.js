var vConsole = new VConsole({
  onReady:function(){
      $('#__vconsole .vc-switch').text('v').addClass('unselectable')
      //vConsole.hideSwitch();
  }
});


var token = $.cookie('token')
if(!token){
  token = new Date().getTime()+randomnum(5);
    $.cookie('token',token,{path:"/"})
}

function randomnum(n){ 
    var t=''; 
    for(var i=0;i<n;i++){ 
        t+=Math.floor(Math.random()*10); 
    }
    return t; 
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
  log.info(message+"-"+source+"-"+lineno+"-"+colno+"-"+error)
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
  console.log('v宽', videoele.videoWidth, '高', videoele.videoHeight);
  console.log('c宽', canvas.width, '高', canvas.height);

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

