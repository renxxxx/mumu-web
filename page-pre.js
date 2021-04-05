var anontoken = $.cookie('anontoken')
if(!anontoken){
    anontoken = new Date().getTime()+randomnum(5);
    $.cookie('anontoken',anontoken,{path:"/"})
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