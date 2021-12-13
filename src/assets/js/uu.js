let uu={}

uu.getCurrentQuery = function()
{
    
  var queryObj = uu.getQuery(window.location.href)
  return queryObj;
}

uu.getQuery = function(url)
{
    debugger
  let url2 = url
  let index = url2.indexOf('?')
  let index2 = url2.indexOf('#')
  if(index == -1)
    return null
    var querystr;
  if(index2 > index){
    querystr=url2.substring(index+1,index2)
  }else{
    querystr=url2.substring(index+1)
  }
  var queryObj = uu.toQuery(querystr)
  return queryObj;
}

uu.getPureNameInUrl = function(url){
    if(!url)
        return null;
    return url.substr(0, url.lastIndexOf('.'))
}

uu.toQuery = function(querystr)
{
  var o = {}
  var querystr2 =decodeURIComponent(querystr);
  var vars = querystr2.split("&");
  for (var i=0;i<vars.length;i++) {
    var pair = vars[i].split("=");
    o[pair[0]]=pair[1]
  }
  return o;
}


uu.trimToBlank=function(value)
{
      var v = null
      if(value==null||value==undefined)
          return ''
      v=value+''
      return v.toString().trim();
        
}
uu.ttb=uu.trimToBlank

uu.trimToNull=function (value)
{
      var v = null
      if(value==null||value==undefined)
          return null
          v = value+''
          return v.toString().trim();
}
uu.ttn=uu.trimToNull

uu.isEmpty=function (value)
{
      if(value==null||value==undefined||value.toString().trim()=='')
          return true
      else
        return false
}

uu.isNull=function (value)
{
      if(value==null||value==undefined)
          return true
      else
        return false
}

uu.isBlank=function (value)
{
      if(value==null||value==undefined)
          return false
        if(value.toString().trim()=='')
          return true
        else
          return false
}


uu.O = function(target){
  this.target=target;
  
  uu.O.prototype.attr = function(keyChain,newValue){
    var carrier=target;
    var parent=null;
    if(!this.target || !keyChain){
      return null;
    }
     var keys= keyChain.split('.')
     for(var i in keys){
          parent=target[keys[i-1]];
         if(keys[i].indexOf('[')>=0){
            var key=keys[i].substring(0,keys[i].indexOf('['));
            var index = keys[i].substring(keys[i].indexOf('[')+1,keys[i].indexOf(']'));
            carrier=carrier[key];
            if(carrier==null || carrier==undefined){
              carrier=null;
              break;
            }
            if(carrier.length<=index){
               carrier=null;
                break;
            }
            carrier=carrier[index];
         }else {
            carrier=carrier[keys[i]];
            if(carrier==null || carrier==undefined){
              carrier=null;
              break;
            }
         }
     }
     if(newValue !== undefined && parent){
       parent[keys[keys.length-1]]=newValue
     }
     return carrier;
  }
}

uu.o=function(data){
  return new uu.O(data);
}


uu.isWeixn=function (){  
  var ua = navigator.userAgent.toLowerCase();  
  if(ua.match(/MicroMessenger/i)=="micromessenger") {  
      return true;  
  } else {  
      return false;  
  }  
}


uu.randomnum=function (n){ 
  var t=''; 
  for(var i=0;i<n;i++){ 
      t+=Math.floor(Math.random()*10); 
  }
  t=t.replace(/^0/,'1')
  return t; 
}

uu.isPc=function () {
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

uu.clearAllCookie=function () {  
  var keys = document.cookie.match(/[^ =;]+(?==)/g);  
  if(keys) {  
      for(var i = keys.length; i--;)  
          document.cookie = keys[i] + '=0;expires=' + new Date(0).toUTCString()  
  }  
}


uu.copy=function(param){
  param.text;
  var textarea = document.createElement('textarea');
  textarea.style['position']='absolute'
  textarea.style['top']='-1000px'
  document.body.appendChild(textarea)
  textarea.value=param.text;
  textarea.select();
  document.execCommand("copy");
  document.body.removeChild(textarea)
  if(param.success)
    param.success(param.text)
}

uu.changearr=function (arr,i1,i2){
  var o3=arr[i1];
  arr[i1]=arr[i2]
  arr[i2]=o3
}

uu.isScrollBottom=function (dom){  
    const scrollTop = dom.scrollTop;
    // 获取可视区的高度
    const windowHeight = dom.clientHeight;
    // 获取滚动条的总高度
    const scrollHeight = dom.scrollHeight;
    if (scrollTop + windowHeight >= scrollHeight) {
        // 把距离顶部的距离加上可视区域的高度 等于或者大于滚动条的总高度就是到达底部
        return true;
    }else
        return false;
}
export default uu;