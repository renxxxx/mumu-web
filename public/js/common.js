var comm;
var common;
comm=common={}
window.common=window.comm=common

function getQueryParam(name)
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

function getQuery() {
    var querystring =decodeURIComponent(window.location.search.substring(1));
    var query = {}
    var vars = querystring.split("&");
    for (var i=0;i<vars.length;i++) {
        var pair = vars[i].split("=");
        query[pair[0]] = pair[1]
    }
    return query;
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
      if(value==null||value==undefined||isNaN(value)||value.toString().trim()=='')
          return true
      else
        return false
}

function isNull(value)
{
      if(value==null||value==undefined||isNaN(value))
          return true
      else
        return false
}
function isBlank(value)
{
      if(value==null||value==undefined||isNaN(value))
          return false
        if(value.toString().trim()=='')
          return true
        else
          return false
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

function o(target){
  return new O(target);
}


function is_weixn(){  
  var ua = navigator.userAgent.toLowerCase();  
  if(ua.match(/MicroMessenger/i)=="micromessenger") {  
      return true;  
  } else {  
      return false;  
  }  
}
function isWechat(){
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
  var keys = document.cookie.match(/[^ =;]+(?==)/g);  
  if(keys) {  
      for(var i = keys.length; i--;)  
          document.cookie = keys[i] + '=0;expires=' + new Date(0).toUTCString()  
  }  
}


function getEleTop(element,offsetTop) {
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
  var multiline = null
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
    multiline = params.multiline
  }
  parent = parent?parent:document.body;
  message=message==null||message==undefined?'请输入':message
  placeholder=placeholder==null||placeholder==undefined?'':placeholder
  value=value==null||value==undefined?'':value
  var id="ff"+randomnum(10);
  var ele = 
  $(`<div id="${id}" style="position:absolute;top:0;bottom:0;left:0;right:0;background-color: rgba(0,0,0,0.6);">
    <div style='font-size:0;width:80%;max-height:300px;background-color:#ffffff;border-radius:3px;
        position:absolute;top:15%;left:50%;transform:translateX(-50%);border:1px solid #d4d4d4;'>
      <div style='width:100%;min-height:35px;max-height:100px;line-height:23px;padding:6px 3px;font-size:15px;border-bottom:1px solid #d4d4d4;border-radius:3px 3px 0 0;box-sizing:border-box;
        border-bottom:1px solid #d4d4d4;' >
        ${message}
      </div>
      <textarea class="value" style='resize: none;display:block;border:none;height:164px;font-size:15px;width: 100%;box-sizing:border-box;' placeholder=${placeholder} >${value}</textarea>
      <div style="height:35px;width:100%;border-radius:0 0 3px 3px;">
        <span class="cancel" style="height:35px;line-height:35px;display:inline-block;font-size:15px;width:50%;text-align:center;
          border-top:1px solid #d4d4d4;border-radius:0 0 0 3px;cursor:pointer;">
          取消
        </span>
        <span class="confirm" style="height:35px;line-height:35px;display:inline-block;font-size:15px;width:50%;text-align:center;border-left:1px solid #d4d4d4;
          border-top:1px solid #d4d4d4;margin-left:-1px;border-radius:0 0 3px 0;cursor:pointer;background-color: #cecece;">
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


common.promptLine=function(params,_value,_placeholder,_confirm,_cancel,_parent){
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
  $(`<div id="${id}" style="position:absolute;top:0;bottom:0;left:0;right:0;background-color: rgba(0,0,0,0.6);">
    <div style='font-size:0;width:80%;max-height:300px;background-color:#ffffff;border-radius:3px;
        position:absolute;top:15%;left:50%;transform:translateX(-50%);border:1px solid #d4d4d4;'>
      <div style='width:100%;min-height:35px;max-height:100px;line-height:23px;padding:6px 3px;font-size:15px;border-bottom:1px solid #d4d4d4;border-radius:3px 3px 0 0;box-sizing:border-box;
        border-bottom:1px solid #d4d4d4;' >
        ${message}
      </div>
      <input class="value" style='display:block;border:none;height:40px;line-height:40px;font-size:15px;width: 100%;box-sizing:border-box;padding: 0 3px;' placeholder='${placeholder}' value='${value}'/>
      <div style="height:35px;width:100%;border-radius:0 0 3px 3px;">
        <span class="cancel" style="height:35px;line-height:35px;display:inline-block;font-size:15px;width:50%;text-align:center;
          border-top:1px solid #d4d4d4;border-radius:0 0 0 3px;cursor:pointer;">
          取消
        </span>
        <span class="confirm" style="height:35px;line-height:35px;display:inline-block;font-size:15px;width:50%;text-align:center;border-left:1px solid #d4d4d4;
          border-top:1px solid #d4d4d4;margin-left:-1px;border-radius:0 0 3px 0;cursor:pointer;background-color: #cecece;">
          确认
        </span>
      </div>
    </div>
  </div>`)
  ele.find('.confirm').click(function(){
    if(confirm)
      confirm(ele.find('.value').val(),ele)
    if(!params.manualClose)
      ele.remove()
  })
  ele.find('.cancel').click(function(){
    if(cancel)
      cancel(ele.find('.value').val(),ele)
    if(!params.manualClose)
      ele.remove()
  })
  $(parent).append(ele)
  
  ele.find('.value').focus()

  return ele;
}


common.alert=function(params,_confirm,_parent){
  params=params?params:{}
  var title = null
  var message = null
  var button = null
  var titlecss = null
  var messagecss = null
  var messageclass = null
  var confirm = null
  var parent = null
  var titleclass = null

  if(typeof params == 'string'){
    message = params
    confirm=_confirm
    parent=_parent
  } else{
      title = params.title
      message = params.message
      titlecss = params.titlecss
      messagecss = params.messagecss
      messageclass = params.messageclass
      titleclass = params.titleclass
      confirm = params.confirm
      parent = params.parent
      button = params.button
  }
  parent = parent?parent:document.body;
  message=message==null||message==undefined?'请确认':message
  button=button==null||button==undefined?'确认':button
  var id="ff"+randomnum(10);
  var ele = 
  $(`<div id="${id}" style="position:absolute;top:0;bottom:0;left:0;right:0;background-color: rgba(0,0,0,0.6);">
    <div style='font-size:0;width:80%;max-height:300px;background-color:#ffffff;border-radius:3px;
        position:absolute;top:15%;left:50%;transform:translateX(-50%);border:1px solid #d4d4d4;'>
      <div class="${titleclass}" style='width:100%;min-height:35px;line-height:35px;padding:0 3px;font-size:16px;
        border-radius:3px 3px 0 0;box-sizing:border-box;text-align:center;${title?"":"display:none;"}${titlecss}' >
        ${title}
      </div>
      <div class="${messageclass}" style='width:100%;max-height:265px;min-height:80px;line-height:23px;padding:6px 3px;font-size:16px;
      ${title?"":"border-radius:3px 3px 0 0;"}box-sizing:border-box;text-align:center;${messagecss}' >
        ${message}
      </div>
      <div style="height:35px;width:100%;border-radius:0 0 3px 3px;">
        <span class="confirm" style="height:35px;line-height:35px;display:inline-block;font-size:15px;width:100%;text-align:center;
          border-top:1px solid #d4d4d4;border-radius:0 0 3px 3px;cursor:pointer;background-color: #cecece;">
          ${button}
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
  $(`<div id="${id}" style="position:absolute;top:0;bottom:0;left:0;right:0;background-color: rgba(0,0,0,0.6);">
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
          border-top:1px solid #d4d4d4;margin-left:-1px;border-radius:0 0 3px 0;cursor:pointer;background-color: #cecece;">
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

comm.copy = function(param={text}){
  var textarea = document.createElement('textarea');
  textarea.style['position']='absolute'
  textarea.style['top']='-1000px'
  document.body.appendChild(textarea)
  textarea.value=param.text;
  textarea.select();
  document.execCommand("copy");
  document.body.removeChild(textarea)
}

comm.changearr  = function(arr,i1,i2){
  var o3=arr[i1];
  arr[i1]=arr[i2]
  arr[i2]=o3
}

comm.changedom = function(d1,d2){
  var d11 = $('<hr/>')
  var d22 = $('<hr/>')
  $(d1).before(d11)
  $(d2).before(d22)

  $(d22).after(d1)
  $(d11).after(d2)

  $(d11).remove()
  $(d22).remove()
}

//判断元素el是否在box可视区内
comm.inview = function(box,el) {
  if(el instanceof jQuery){
    el=el[0]
  }
  if(box instanceof jQuery){
    box=box[0]
  }
  //是否超过顶部
  var overtop = box.scrollTop > (el.offsetTop+el.clientHeight)
  //是否低于底部
  var overbottom = (box.scrollTop+box.clientHeight)<(el.offsetTop);
  //不超过顶部也不低于底部说明在可视区
  return !overtop && !overbottom;
}

//返回一组元素els中哪些在box可视区
comm.whichinview = function(box,els) {
  var inviewEles=[]
  for (var i=0;i<els.length;i++) {
      var el = els[i];
      if(comm.inview(box,el)){
        inviewEles.push(el)
      }
  }
  return inviewEles
}



function longPress(dom,callback,millisecond){
    debugger
    dom = $(dom)
    millisecond = (millisecond==null||millisecond==undefined||millisecond=='')? 2000 : millisecond;
    var handle = 'func'+randomnum(4)
    dom.bind('mousedown touchstart', function() { 
        window[handle] = setTimeout(function() { 
            callback(); 
        }, millisecond); 
    }); 
      
    dom.bind('mouseup touchend',function() { 
        clearTimeout(window[handle]); 
    }); 
     
}

function loadHtml(place,url){
    $.ajax({
        url:url,
        method:'get',
        async:false,
        success(res){
            var a = $('<hr/>')
            $(place).before(a)
            $(place).remove()
            a.after($(res))
            a.remove()
        }
    })
}