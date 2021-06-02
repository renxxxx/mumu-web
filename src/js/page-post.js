// feedback()
// function feedback(){ 
//     $(document.body).append(`
//         <div class="unselectable" style="position:absolute;right:0;bottom:0;cursor:pointer;border:1px solid #827e7e;border-bottom:0;border-right:0;border-radius: 2px 0 0 0;padding:0 15px;
//                 z-index:999999999999999;background-color:#ffffff;color: #827e7e;font-size:14px;" 
//             onclick="
//                 var r= prompt('感谢您的反馈\\n建议留下联系方式')
//                 if(r){
//                     $.post('/mumu/feedback',{content:r})
//                     alert('已发送')
//                 }
//             "
//         >反 馈</div>`)
// }



$('#index').bind('touchstart mousedown',function(e){
    this.touchstartTime = new Date().getTime();
    if(e.type=='touchstart'){
        var touch = e.targetTouches[0];
        this.touchstartX = touch.pageX;
        this.touchstartY = touch.pageY;
    }else if(e.type=='mousedown'){
        this.touchstartX = e.pageX;
        this.touchstartY = e.pageY;
    }
  }).bind('touchmove mousemove',function(e){
    if(e.type=='touchmove'){
        var touch = e.targetTouches[0];
        this.touchendX = touch.pageX;
        this.touchendY = touch.pageY;
    }else if(e.type=='mousemove'){
        this.touchendX = e.pageX;
        this.touchendY = e.pageY;
    }

    var parentEle=null;
    while(true){
        if(!parentEle)
            parentEle=$(e.target);
        else
            parentEle = $(parentEle).parent()

        if(parentEle.scrollTop()>0){
            break;
        }
        if(parentEle.length==0)
            break
    }
    if(parentEle.length==0 && this.touchstartY<this.touchendY){
        log.debug('e.preventDefault()')
        e.preventDefault()
    }

    
  }).bind('touchend mouseup',function(e){
    this.touchendtime = new Date().getTime();

    this.touchstartTime=null
    this.touchendtime=null
    this.touchstartX=null
    this.touchstartY=null
    this.touchendX=null
    this.touchendY=null
  })