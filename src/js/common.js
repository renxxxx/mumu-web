var common={}
window.common=common

function getUrlParam(name)
{
       var query =decodeURIComponent(window.location.search.substring(1));
       var vars = query.split("&");
       for (var i=0;i<vars.length;i++) {
               var pair = vars[i].split("=");
               if(pair[0] == name){
                 return pair[1]
                }
       }
       return null;
}


function trimToBlank(value)
{
      var v = null
      if(value==null||value==undefined)
          return ''
          v =value+''
          return v.toString().trim();
        
}
var ttb=trimToBlank


function trimToNull(value)
{
      var v = null
      if(value==null||value==undefined)
          return null
          v = value+''
          return v.toString().trim();
}
var ttn=trimToNull


function isEmpty(value)
{
      if(value==null||value==undefined||value.toString().trim()=='')
          return true
      else
        return false
}

function isNull(value)
{
      if(value==null||value==undefined)
          return true
      else
        return false
}
function isBlank(value)
{
      if(value==null||value==undefined)
          return false
        if(value.toString().trim()=='')
          return true
        else
          return false
}

if(moment){
  moment.prototype.format1=function(pattern){
    if(this.isValid())
      return this.format(pattern)
    else
      return null
  }
}



function O(target){
  this.target=target;
  
  O.prototype.attr = function(keyChain,newValue){
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

function o(data){
  return new O(data);
}


function is_weixn(){  
  var ua = navigator.userAgent.toLowerCase();  
  if(ua.match(/MicroMessenger/i)=="micromessenger") {  
      return true;  
  } else {  
      return false;  
  }  
}


function randomnum(n){ 
  var t=''; 
  for(var i=0;i<n;i++){ 
      t+=Math.floor(Math.random()*10); 
  }
  t=t.replace(/^0/,'1')
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


function clearAllCookie() {  
  var keys = document.cookie.match(/[^ =;]+(?=\=)/g);  
  if(keys) {  
      for(var i = keys.length; i--;)  
          document.cookie = keys[i] + '=0;expires=' + new Date(0).toUTCString()  
  }  
}


function getEleTop(element,offsetTop) {
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
//overflow: hidden;text-overflow: ellipsis;white-space: nowrap;
common.prompt=function(params,_value,_placeholder,_confirm,_cancel,_parent){
  params=params?params:{}
  var message = null
  var placeholder = null
  var confirm = null
  var cancel = null
  var value = null
  var parent = null
  if(typeof params == 'string'){
    message = params
    value = _value
    placeholder = _placeholder
    confirm=_confirm
    cancel=_cancel
    cancel=_cancel
    parent=_parent
  } else{
    message = params.message
    value = params.value
    placeholder = params.placeholder
    confirm = params.confirm
    cancel = params.cancel
    parent = params.parent
  }
  parent = parent?parent:document.body;
  message=message==null||message==undefined?'请输入':message
  placeholder=placeholder==null||placeholder==undefined?'':placeholder
  value=value==null||value==undefined?'':value
  var id="ff"+randomnum(10);
  var ele = 
  $(`<div id="${id}" style="position:absolute;top:0;bottom:0;left:0;right:0;background-color: rgb(0 0 0 / 61%);">
    <div style='font-size:0;width:80%;max-height:300px;background-color:#ffffff;border-radius:3px;
        position:absolute;top:15%;left:50%;transform:translateX(-50%);border:1px solid #d4d4d4;'>
      <div style='width:100%;min-height:35px;max-height:100px;line-height:23px;padding:6px 3px;font-size:15px;border-bottom:1px solid #d4d4d4;border-radius:3px 3px 0 0;box-sizing:border-box;
        border-bottom:1px solid #d4d4d4;' >
        ${message}
      </div>
      <textarea class="value" style='resize: none;display:block;border:none;height:164px;font-size:15px;width: 100%;box-sizing:border-box;' placeholder=${placeholder}>${value}</textarea>
      <div style="height:35px;width:100%;border-radius:0 0 3px 3px;">
        <span class="cancel" style="height:35px;line-height:35px;display:inline-block;font-size:15px;width:50%;text-align:center;
          border-top:1px solid #d4d4d4;border-radius:0 0 0 3px;cursor:pointer;">
          取消
        </span>
        <span class="confirm" style="height:35px;line-height:35px;display:inline-block;font-size:15px;width:50%;text-align:center;border-left:1px solid #d4d4d4;
          border-top:1px solid #d4d4d4;margin-left:-1px;border-radius:0 0 3px 0;cursor:pointer;">
          确认
        </span>
      </div>
    </div>
  </div>`)
  ele.find('.confirm').click(function(){
    if(confirm)
      confirm(ele.find('.value').val())
    ele.remove()
  })
  ele.find('.cancel').click(function(){
    if(cancel)
      cancel(ele.find('.value').val())
    ele.remove()
  })
  $(parent).append(ele)
  
  ele.find('.value').focus()

  return ele;
}


common.alert=function(params,_confirm,_parent){
  params=params?params:{}
  var message = null
  var confirm = null
  var parent = null
  if(typeof params == 'string'){
    message = params
    confirm=_confirm
    parent=_parent
  } else{
     message = params.message
     confirm = params.confirm
     parent = params.parent
  }
  parent = parent?parent:document.body;
  message=message==null||message==undefined?'请确认':message
  var id="ff"+randomnum(10);
  var ele = 
  $(`<div id="${id}" style="position:absolute;top:0;bottom:0;left:0;right:0;background-color: rgb(0 0 0 / 61%);">
    <div style='font-size:0;width:80%;max-height:300px;background-color:#ffffff;border-radius:3px;
        position:absolute;top:15%;left:50%;transform:translateX(-50%);border:1px solid #d4d4d4;'>
      <div style='width:100%;max-height:265px;min-height:80px;line-height:23px;padding:6px 3px;font-size:16px;
        border-radius:3px 3px 0 0;box-sizing:border-box;text-align:center;' >
        ${message}
      </div>
      <div style="height:35px;width:100%;border-radius:0 0 3px 3px;">
        <span class="confirm" style="height:35px;line-height:35px;display:inline-block;font-size:15px;width:100%;text-align:center;
          border-top:1px solid #d4d4d4;border-radius:0 0 3px 3px;cursor:pointer;">
          确认
        </span>
      </div>
    </div>
  </div>`)
  ele.find('.confirm').click(function(){
    if(confirm)
      confirm()
    ele.remove()
  })
  $(parent).append(ele)
  return ele;
}

common.confirm=function(params,_confirm,_cancel,_parent){
  params=params?params:{}
  var message = null
  var confirm = null
  var cancel = null
  var parent = null
  if(typeof params == 'string'){
    message = params
    confirm = _confirm
    cancel = _cancel
    parent = _parent
  } else{
     message = params.message
     confirm = params.confirm
     cancel = params.cancel
     parent = params.parent
  }
  parent = parent?parent:document.body;
  message=message==null||message==undefined?'请确认':message
  var id="ff"+randomnum(10);
  var ele = 
  $(`<div id="${id}" style="position:absolute;top:0;bottom:0;left:0;right:0;background-color: rgb(0 0 0 / 61%);">
    <div style='font-size:0;width:80%;max-height:300px;background-color:#ffffff;border-radius:3px;
        position:absolute;top:15%;left:50%;transform:translateX(-50%);border:1px solid #d4d4d4;'>
      <div style='width:100%;max-height:265px;min-height:80px;line-height:23px;padding:6px 3px;font-size:15px;
        border-radius:3px 3px 0 0;box-sizing:border-box;text-align:center;' >
        ${message}
      </div>
      <div style="height:35px;width:100%;border-radius:0 0 3px 3px;">
        <span class="cancel" style="height:35px;line-height:35px;display:inline-block;font-size:15px;width:50%;text-align:center;
          border-top:1px solid #d4d4d4;border-radius:0 0 0 3px;cursor:pointer;">
          取消
        </span>
        <span class="confirm" style="height:35px;line-height:35px;display:inline-block;font-size:15px;width:50%;text-align:center;border-left:1px solid #d4d4d4;
          border-top:1px solid #d4d4d4;margin-left:-1px;border-radius:0 0 3px 0;cursor:pointer;">
          确认
        </span>
      </div>
    </div>
  </div>`)
  ele.find('.confirm').click(function(){
    if(confirm)
      confirm()
    ele.remove()
  })
  ele.find('.cancel').click(function(){
    if(cancel)
      cancel()
    ele.remove()
  })
  $(parent).append(ele)
  return ele;
}