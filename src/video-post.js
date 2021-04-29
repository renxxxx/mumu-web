$("#finger,gear").animate({left:'+=150px'},2000,function(){
    $("#finger").animate({left:'-=300px'},2000,()=>{$("#finger").fadeOut(500)});
});
$("#gear").animate({left:'+=150px'},2000,function(){
    $("#gear").animate({left:'-=300px'},2000);
});

var videoNo = window.location.search.substring(1).split("&")[0].split("=")[1];
var lastCurrentTime = localStorage.getItem("currentTime-"+videoNo);
var currentIndex =parseInt(localStorage.getItem("currentIndex-"+videoNo));
var currentCaption = JSON.parse(localStorage.getItem("currentCaption-"+videoNo));
var jumpedcaption = currentCaption;
var tt,runstep=0;
var playRestored=0,restored=0;
var video;
var zh = {
    subtitles : '',
    monitor : '',
    subtitlesList : [],
},
en = {
    subtitles : '',
    monitor : '',
    subtitlesList : [],
    current:currentCaption,
    currentIndex:currentIndex
},
chooseDomList = [],translationtext = '';
var _this=window;
var videoele=$('#video')[0];
if(currentCaption)
    _this.setline(currentCaption);
init();
function init(){
    getVideo();
}
function getVideo(){
    $.ajax({
        url: '/mumu/video?',
        type: 'get',
        data: 'videoNo='+videoNo,
        async: false,
        success: function(res) {
            video=res.data.video;
            if(video.height && video.width){
                $('#video').css('height',parseInt($('#video').css('width').replace('px',''))*(video.height/video.width))
                $('#summtrans').css('height',$('#video').css('height'))
                $('#wordsframe').css('height',$('#video').css('height'))
            }
            $.ajax({
                url: video.captionUrl,
                type: 'get',
                async: true,
                success: function(res) {
                    getEnSubtitles(res);
                }
            })
        }
    })
}
function restore(){
    if(!restored){
        console.log("1");
        if(lastCurrentTime == 0){
            restored=1;
            return;
        }
        if(lastCurrentTime){
            console.log("2");
            $('#video')[0].currentTime = lastCurrentTime;
            console.log("set lct: "+lastCurrentTime+" ct: "+$('#video')[0].currentTime);
            if($('#video')[0].currentTime >= lastCurrentTime){
                console.log("3");
                restored=1;
            }
        }
    }
}

function playRestore(){
    if(!playRestored){
        if(lastCurrentTime){
            $('#video')[0].currentTime = lastCurrentTime;
            console.log("set lct: "+lastCurrentTime+" ct: "+$('#video')[0].currentTime);
            if($('#video')[0].currentTime >= lastCurrentTime)
                playRestored=1;
        }
    }
}


function onCanPlay(){
    console.log("onCanPlay: "+ ++runstep)
    console.log(" ct: "+ $('#video')[0].currentTime +" st: " +(_this.en.current && _this.en.current.startTime)+" et: " +(_this.en.current && _this.en.current.endTime)+" "+(_this.en.current&&_this.en.current.enValue.substr(0,5)))
    playRestore()
}
function onDurationChange(){
    console.log("ondurationchange: "+ ++runstep)
    console.log(" ct: "+ $('#video')[0].currentTime +" st: " +(_this.en.current && _this.en.current.startTime)+" et: " +(_this.en.current && _this.en.current.endTime)+" "+(_this.en.current&&_this.en.current.enValue.substr(0,5)))
}
function onLoadedMetadata(){
    console.log("onloadedmetadata: "+ ++runstep)
    console.log(" ct: "+ $('#video')[0].currentTime +" st: " +(_this.en.current && _this.en.current.startTime)+" et: " +(_this.en.current && _this.en.current.endTime)+" "+(_this.en.current&&_this.en.current.enValue.substr(0,5)))
}
function onLoadedData(){
    console.log("onloadeddata: "+ ++runstep)
    console.log(" ct: "+ $('#video')[0].currentTime +" st: " +(_this.en.current && _this.en.current.startTime)+" et: " +(_this.en.current && _this.en.current.endTime)+" "+(_this.en.current&&_this.en.current.enValue.substr(0,5)))
}
function onLoadStart(){
    console.log("onloadstart: "+ ++runstep)
    console.log(" ct: "+ $('#video')[0].currentTime +" st: " +(_this.en.current && _this.en.current.startTime)+" et: " +(_this.en.current && _this.en.current.endTime)+" "+(_this.en.current&&_this.en.current.enValue.substr(0,5)))
}
function onPlaying(){
    console.log("onplaying: "+ ++runstep)
    console.log(" ct: "+ $('#video')[0].currentTime +" st: " +(_this.en.current && _this.en.current.startTime)+" et: " +(_this.en.current && _this.en.current.endTime)+" "+(_this.en.current&&_this.en.current.enValue.substr(0,5)))
}
function onProgress(){
    console.log("onprogress: "+ ++runstep)
    console.log(" ct: "+ $('#video')[0].currentTime +" st: " +(_this.en.current && _this.en.current.startTime)+" et: " +(_this.en.current && _this.en.current.endTime)+" "+(_this.en.current&&_this.en.current.enValue.substr(0,5)))
}
function onReadyStateChange(){
    console.log("onreadystatechange: "+ ++runstep)
    console.log(" ct: "+ $('#video')[0].currentTime +" st: " +(_this.en.current && _this.en.current.startTime)+" et: " +(_this.en.current && _this.en.current.endTime)+" "+(_this.en.current&&_this.en.current.enValue.substr(0,5)))
}
function onSuspend(){
    console.log("onsuspend: "+ ++runstep)
    console.log(" ct: "+ $('#video')[0].currentTime +" st: " +(_this.en.current && _this.en.current.startTime)+" et: " +(_this.en.current && _this.en.current.endTime)+" "+(_this.en.current&&_this.en.current.enValue.substr(0,5)))
}

function onTimeUpdate(){
    console.log("ontimeupdate: "+ ++runstep)
    console.log(" ct: "+ $('#video')[0].currentTime +" st: " +(_this.en.current && _this.en.current.startTime)+" et: " +(_this.en.current && _this.en.current.endTime)+" "+(_this.en.current&&_this.en.current.enValue.substr(0,5)))
    restore()
    if(videoele.paused)
        monitor(videoele.currentTime*1000)
}

function monitor(_time){
    $('#loading').hide()
    localStorage.setItem("durationsec-"+videoNo,$('#video')[0].duration)
    localStorage.setItem("currentTime-"+videoNo,$('#video')[0].currentTime)

    if(jumpedcaption){
        if(jumpedcaption.startTime < _time){
            jumpedcaption=null;
        }else{
            return;
        }
    }

    if(_this.en.current && _this.en.current.startTime<=_time && _time<_this.en.current.endTime){
        return;
    }

    var next = _this.en.subtitlesList[_this.en.currentIndex+1]
    console.log("currentIndex: "+_this.en.currentIndex)
    console.log("next: "+JSON.stringify(next))
    if(next && next.startTime<=_time && _time<next.endTime){
        console.log("next ")
        _this.en.current = next
        _this.en.currentIndex++
        _this.setline(next)
        return;
    }

    if(next && _time < next.startTime &&  (!_this.en.current || _time > _this.en.current.endTime)){
        console.log("before next")
        console.log("next: st: "+next.startTime+" currinx: "+_this.en.currentIndex)
        return;
    }

    
    $(_this.en.subtitlesList).each(function(inx,item){
        if(item.startTime<=_time && _time<item.endTime){
            debugger
            console.log("search all ")
            _this.en.current = item
            _this.en.currentIndex = inx
            _this.setline(item)
            return;
        }
    })
}

function onWaiting(){
    console.log("onwaiting: "+ ++runstep)
    console.log(" ct: "+ $('#video')[0].currentTime +" st: " +(_this.en.current && _this.en.current.startTime)+" et: " +(_this.en.current && _this.en.current.endTime)+" "+(_this.en.current&&_this.en.current.enValue.substr(0,5)))
}
function onClick(){
    console.log("onclick: "+ ++runstep)
    console.log(" ct: "+ $('#video')[0].currentTime +" st: " +(_this.en.current && _this.en.current.startTime)+" et: " +(_this.en.current && _this.en.current.endTime)+" "+(_this.en.current&&_this.en.current.enValue.substr(0,5)))
    $('#video').attr('controls', true);
}



function showSearchFn(){
    $('.dialogSearch input').val($('.dialogTitle #kw').html());
    $('.dialogSearch').css({'display':'flex'})
    $('.dialogSearch input').focus()
    $('.dialogTitle').css({'display':'none'})
    pauseVideo()
}
function searchClearFn(){
    $('.dialogSearch input').val("")
}
function hideSearchFn(){
    $('.dialogTitle #kw').html($('.dialogSearch input').val());
    $('.dialogSearch').css({'display':'none'})
    $('.dialogTitle').css({'display':'block'})
    if(!$('.dialogSearch input').val()){
        $('#zh_subtitles span').css({"background": "transparent","color": "black"})
        $('.dialog').css({'display' : 'none'})
        pauseVideo()
        $('.yibiao').html('')
        $('.fanyi').html('')
    }
}
function searchFn(_value){
    console.log(_value)
    if(_value.keyCode == 13){
        let kw = $('.searchClass').val();
        translatee(kw);
        hideSearchFn()
    }
}

$('.yibiao').on('click','span svg',function(){
    let _mp3 = new Audio($(this).attr('playsrc'));
    _mp3.play();
})
function getEnSubtitles(_result){
    console.log("getEnSubtitles: "+ ++runstep)
    ////let _this = this;
    let _fileString = [];
    _fileString = _result.split(/[(\r\n)\r\n]+/);
    _fileString.forEach((item,inx) => {
        let startValue = false
        if(!item){
        _fileString.splice(inx,1);
        }
        let reg = /^(20|21|22|23|[0-1]\d):[0-5]\d:[0-5]\d/;
        let regExp = new RegExp(reg);
        if(regExp.test(item)){
            var ss = _fileString[inx+2]
            var st = _fileString[inx+1]
            if(ss.indexOf('{\\pos')>=0 || st.indexOf('{\\pos')>=0){
                return;
            }
            _this.en.subtitlesList.push({
                startTime : _this.timeCycle(item.split(' --> ')[0].replace(',','.')),
                endTime : _this.timeCycle(item.split(' --> ')[1].replace(',','.')),
                chValue: st,
                enValue: ss,
            })
        }
    });
    var iii = null
    for (let inx = 0; inx < _this.en.subtitlesList.length; inx++) {
        iii=inx
        const curr = _this.en.subtitlesList[inx];
        const next = _this.en.subtitlesList[inx+1];
        if(inx<_this.en.subtitlesList.length-2){
            if((next.startTime - curr.endTime)>1000){
                _this.en.subtitlesList.splice(inx+1,0,{
                    startTime:parseInt(curr.endTime)+1000,
                    endTime:next.startTime,
                    chValue:'',
                    enValue:''
                })
            }
        }
    }
   
    var first = _this.en.subtitlesList[0]
    if(first && first.startTime>0){
        _this.en.subtitlesList.splice(0,0,{
                    startTime:0,
                    endTime:first.startTime,
                    chValue:'',
                    enValue:''
                })
    }
    var last = _this.en.subtitlesList[_this.en.subtitlesList.length-1]
    if(last){
        _this.en.subtitlesList.push({
                        startTime:parseInt(last.endTime)+1000,
                        endTime:video.duration*1000,
                        chValue:'',
                        enValue:''
                    })
    }
    if(_this.en.currentIndex>=0){
        _this.en.current=_this.en.subtitlesList[_this.en.currentIndex]
        _this.setline(_this.en.current)
    }
    $('#video').attr("src",video.url)
}
function setline(item){
    if(!item)
        return;
    console.log('setline: ct: '+$('#video')[0].currentTime+" st: "+item.startTime +" et: "+item.endTime +" "+item.enValue.substr(0,5))
    localStorage.setItem("currentCaption-"+videoNo,JSON.stringify(item))
    localStorage.setItem("currentIndex-"+videoNo,_this.en.currentIndex)
    ////let _this = this;
    let _v= item.enValue.split(' ');
    $("#zh_subtitles").html('')
    _this.en.currentwords=_v
    for(let i=0; i < _v.length; i++){
        var vv = _v[i].split('\\n');
        if(vv[0])
            $("#zh_subtitles").append(
                '<span onmousedown="pauseVideo()" ontouchstart="pauseVideo()" onclick="pauseVideo();locateWord('+(i+1)+')" onmouseout="$(this).css(\'border-bottom\',\'\')" onmouseover="$(this).css(\'border-bottom\',\'2px solid black\')" onmouseout="clearTimeout(this.ttt)" style="user-select: none;display: inline-block;cursor: pointer;font-weight: 900;font-size: 18px;padding-left:3px;padding-right:3px;" class="font span'+i+'">'+vv[0]+'</span>'
            )
        if(vv[1]){
            _v.splice(i+1,0,vv[1])
            $("#zh_subtitles").append('<br/>')
        }
    }
    $('.dialog').css({'display' : 'none'})
    $('.dialogTitle #kw').html('');
    currwordno=0
    $('.dialog').css({'display' : 'none'})
    $('.dialogTitle #kw').html('');
    $('#summtrans').hide()
    $('#wordsframe').hide()
    $('#word-in').val('')
    $('#video').css('top','0px')
}
function prevline(){
    ////let _this = this;
    if(_this.en.currentIndex>0){
        var inx = _this.en.currentIndex
        var prev = _this.en.subtitlesList[--inx]
        if(prev){
            if(!prev.enValue)
                prev = _this.en.subtitlesList[--inx];
        }
        if(prev){
            _this.en.currentIndex =inx   
            _this.en.current= prev
            jumpedcaption = prev
            lastCurrentTime = prev.startTime/1000
            $('#video')[0].currentTime = prev.startTime/1000
            console.log("set ct: "+prev.startTime/1000+" ct: "+$('#video')[0].currentTime)
            _this.setline(prev)
            currwordno=0
            chHideDialog()
            $('.dialog').css({'display' : 'none'})
            $('.dialogTitle #kw').html('');
        }
    }
}
function currline(){
    var inx = _this.en.currentIndex
    var curr = _this.en.current
    if(curr){
        if(!curr.enValue)
            curr = _this.en.subtitlesList[--inx];
        if(curr){
            _this.en.currentIndex =inx   
            _this.en.current= curr
            $('#video')[0].currentTime = curr.startTime/1000
            jumpedcaption = curr
            lastCurrentTime = curr.startTime/1000
            console.log("set ct: "+curr.startTime/1000+" ct: "+$('#video')[0].currentTime)
            _this.setline(curr)
            currwordno=0
        
            chHideDialog()
            $('.dialog').css({'display' : 'none'})
            $('.dialogTitle #kw').html('');
        }
    }
}
function nextline(){
    var inx = _this.en.currentIndex
    var next = _this.en.subtitlesList[++inx]
    if(next){
        if(!next.enValue)
            next = _this.en.subtitlesList[++inx];
        if(next){
            _this.en.currentIndex =inx   
            _this.en.current= next
            jumpedcaption = next
            lastCurrentTime = next.startTime/1000
            $('#video')[0].currentTime = next.startTime/1000
            console.log("set ct: "+next.startTime/1000+" ct: "+$('#video')[0].currentTime)
            _this.setline(next)
            currwordno=0
            chHideDialog()
            $('.dialog').css({'display' : 'none'})
            $('.dialogTitle #kw').html('');
        }
    }
}


function translatee(_data){
    _data=_data.replace(/^(,|\.|\?|!)+/,'').replace(/(,|\.|\?|!)+$/,'')  
    $('#summtrans').show()
    $('#summtrans-word').text(_data)
    $('#word-in').val(_data)
    clearTimeout(window.timeoutdo1)
    window.timeoutdo1=setTimeout(function(){
        window.aaa=setTimeout(function(){
            $('#summtrans-phonetic').hide();
            $('#summtrans-speak').hide();
            $('#summtrans-value').hide();
        },500)
        if(_data==null || _data==undefined || !_data.toString().trim()){
            $('#summtrans-phonetic').hide();
            $('#summtrans-speak').hide();
            $('#summtrans-value').hide();
            return;
        }
        $.ajax({
            url: '/mumu/translate?from='+video.language+'&to=2&q='+_data,
            type: 'get',
            async: true,
            success: function(res) {
                clearTimeout(window.aaa)
                // $('.dialog').css({'display' : 'block'})
                // $('.dialogTitle #kw').html(_data);
                // $('.searchClass').val(_data);
                // $('.yibiao').html('')
                // $('.fanyi').html('')
                // if(res.data.phoneticUs && res.data.phoneticUs!="undefined" && res.data.phoneticUs!="null"){
                //     $('.yibiao').append(
                //         '<span style="margin-right:15px;display: inline-block;">'+
                //             '<span class="us" style="margin:0 5px 0 0;">'+'美 '+'/'+(res.data.phoneticUs||'')+'/'+'</span>'+
                //             '<svg playSrc="'+res.data.pronounceUs+'" class="beauty" style="cursor:pointer;width: 15px;height: 15px;object-fit: cover;vertical-align: middle;margin-left: 3px;" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" t="1615275211468" class="icon" viewBox="0 0 1024 1024" version="1.1" p-id="2221" width="200" height="200"><defs><style type="text/css"/></defs><path d="M534.002 120.373c-9.072 0-18.606 3.172-26.314 9.534L280.869 325.875H121.643c-34.475 0-62.154 27.679-62.154 61.702l-0.452 268.551c0 34.023 28.131 62.145 62.606 62.145h161.494l223.648 176.016c8.159 6.805 17.241 9.517 26.313 9.517 21.761 0 41.73-16.782 41.73-41.271l0.904-700.873c0.462-24.508-19.951-41.289-41.73-41.289z m-20.873 699.968L321.244 669.276c-10.889-8.612-24.498-13.148-38.107-13.148H120.73l0.913-268.108 159.226-0.442c14.973 0 29.034-5.458 40.375-14.974L514.04 206.121l-0.911 614.22zM696.409 308.633c-14.07-9.516-33.58-5.44-42.652 8.63-9.517 14.052-5.44 33.562 8.629 42.635 48.075 32.215 77.119 85.288 77.119 141.992 0 54.879-27.219 106.605-72.582 138.803-14.07 9.994-17.242 29.044-7.266 43.096 5.901 8.63 15.417 13.166 25.41 13.166 6.344 0 12.688-1.824 17.686-5.9 61.702-44 98.436-114.775 98.436-189.625-0.001-77.118-39.002-149.241-104.78-192.797z" fill="#ff0000" p-id="2222"/><path d="M827.503 195.684c-12.705-11.341-32.215-10.438-43.557 2.268-11.34 12.705-10.419 32.198 2.269 43.539 74.407 66.699 117.043 161.502 117.043 260.399 0 96.629-39.003 186.435-109.777 253.134-12.244 11.784-13.148 31.294-1.364 43.539 5.9 6.361 14.07 9.533 22.682 9.533 7.708 0 15.435-2.729 21.318-8.63C919.135 720.541 964.96 614.839 964.96 501.43c0.442-115.678-49.458-227.263-137.457-305.746z" fill="#ff0000" p-id="2223"/></svg>'+
                //         // '<audio src="'+res.data.pronounceUs+'" class="beauty"></audio>'+
                //         '</span>'
                //     )
                // }
                // if(res.data.phoneticUk && res.data.phoneticUk!="undefined" && res.data.phoneticUk!="null"){
                //     $('.yibiao').append(
                //         '<span style="margin-right:15px;display: inline-block;">'+
                //             '<span class="uk" style="margin:0 5px 0 0;">'+'英 '+'/'+(res.data.phoneticUk||'')+'/'+'</span>'+
                //             '<svg playSrc="'+res.data.pronounceUk+'" style="cursor:pointer;width: 15px;height: 15px;object-fit: cover;vertical-align: middle;margin-left: 3px;" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" t="1615275211468" class="icon" viewBox="0 0 1024 1024" version="1.1" p-id="2221" width="200" height="200"><defs><style type="text/css"/></defs><path d="M534.002 120.373c-9.072 0-18.606 3.172-26.314 9.534L280.869 325.875H121.643c-34.475 0-62.154 27.679-62.154 61.702l-0.452 268.551c0 34.023 28.131 62.145 62.606 62.145h161.494l223.648 176.016c8.159 6.805 17.241 9.517 26.313 9.517 21.761 0 41.73-16.782 41.73-41.271l0.904-700.873c0.462-24.508-19.951-41.289-41.73-41.289z m-20.873 699.968L321.244 669.276c-10.889-8.612-24.498-13.148-38.107-13.148H120.73l0.913-268.108 159.226-0.442c14.973 0 29.034-5.458 40.375-14.974L514.04 206.121l-0.911 614.22zM696.409 308.633c-14.07-9.516-33.58-5.44-42.652 8.63-9.517 14.052-5.44 33.562 8.629 42.635 48.075 32.215 77.119 85.288 77.119 141.992 0 54.879-27.219 106.605-72.582 138.803-14.07 9.994-17.242 29.044-7.266 43.096 5.901 8.63 15.417 13.166 25.41 13.166 6.344 0 12.688-1.824 17.686-5.9 61.702-44 98.436-114.775 98.436-189.625-0.001-77.118-39.002-149.241-104.78-192.797z" fill="#ff0000" p-id="2222"/><path d="M827.503 195.684c-12.705-11.341-32.215-10.438-43.557 2.268-11.34 12.705-10.419 32.198 2.269 43.539 74.407 66.699 117.043 161.502 117.043 260.399 0 96.629-39.003 186.435-109.777 253.134-12.244 11.784-13.148 31.294-1.364 43.539 5.9 6.361 14.07 9.533 22.682 9.533 7.708 0 15.435-2.729 21.318-8.63C919.135 720.541 964.96 614.839 964.96 501.43c0.442-115.678-49.458-227.263-137.457-305.746z" fill="#ff0000" p-id="2223"/></svg>'+
                //         // '<audio src="'+res.data.pronounceUk+'" class="ritish"></audio>'+
                //         '</span>'
                //     )
                // }
                // if(res.data.from!=1){
                //     if(res.data.phonetic || res.data.speakUrl){
                //         $('.yibiao').append(
                //             '<span style="margin-right:15px;display: inline-block;">'+
                //                 (res.data.phonetic?('<span style="margin:0 5px 0 0;">'+'/'+res.data.phonetic+'/'+'</span>'):'') +
                //                 (res.data.speakUrl?('<svg playSrc="'+res.data.speakUrl+'" style="cursor:pointer;width: 15px;height: 15px;object-fit: cover;vertical-align: middle;" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" t="1615275211468" class="icon" viewBox="0 0 1024 1024" version="1.1" p-id="2221" width="200" height="200"><defs><style type="text/css"/></defs><path d="M534.002 120.373c-9.072 0-18.606 3.172-26.314 9.534L280.869 325.875H121.643c-34.475 0-62.154 27.679-62.154 61.702l-0.452 268.551c0 34.023 28.131 62.145 62.606 62.145h161.494l223.648 176.016c8.159 6.805 17.241 9.517 26.313 9.517 21.761 0 41.73-16.782 41.73-41.271l0.904-700.873c0.462-24.508-19.951-41.289-41.73-41.289z m-20.873 699.968L321.244 669.276c-10.889-8.612-24.498-13.148-38.107-13.148H120.73l0.913-268.108 159.226-0.442c14.973 0 29.034-5.458 40.375-14.974L514.04 206.121l-0.911 614.22zM696.409 308.633c-14.07-9.516-33.58-5.44-42.652 8.63-9.517 14.052-5.44 33.562 8.629 42.635 48.075 32.215 77.119 85.288 77.119 141.992 0 54.879-27.219 106.605-72.582 138.803-14.07 9.994-17.242 29.044-7.266 43.096 5.901 8.63 15.417 13.166 25.41 13.166 6.344 0 12.688-1.824 17.686-5.9 61.702-44 98.436-114.775 98.436-189.625-0.001-77.118-39.002-149.241-104.78-192.797z" fill="#ff0000" p-id="2222"/><path d="M827.503 195.684c-12.705-11.341-32.215-10.438-43.557 2.268-11.34 12.705-10.419 32.198 2.269 43.539 74.407 66.699 117.043 161.502 117.043 260.399 0 96.629-39.003 186.435-109.777 253.134-12.244 11.784-13.148 31.294-1.364 43.539 5.9 6.361 14.07 9.533 22.682 9.533 7.708 0 15.435-2.729 21.318-8.63C919.135 720.541 964.96 614.839 964.96 501.43c0.442-115.678-49.458-227.263-137.457-305.746z" fill="#ff0000" p-id="2223"/></svg>'):'') +
                //             '</span>'
                //         )
                //     }
                // }
                // if(res.data.translations){
                //     for(let i=0;res.data &&  i <= res.data.translations.length; i++){
                //         if(res.data.translations[i]){
                //             $('.fanyi').append( 
                //                 '<p style="margin-block-start: 0;margin-block-end: 3px;">'+res.data.translations[i]+'</p>'
                //             )
                //         }
                //     }
                // }
                
                // if(res.data.webTranslations){
                //     $('.fanyi').append( 
                //         '<p style="margin-block-start: 10px;margin-block-end: 3px;">'+"网络释义："+'</p>'
                //     )
                //     for(let i=0;res.data &&  i <= res.data.webTranslations.length; i++){
                //         if(res.data.webTranslations[i]){
                //             $('.fanyi').append(
                //                 '<p style="margin-block-start: 0;margin-block-end: 3px;">'+res.data.webTranslations[i]+'</p>'
                //             )
                //         }
                //     }
                // }
                if(res.data.phonetic){
                    $('#summtrans-phonetic').text('/'+res.data.phonetic+'/').show()
                }else{
                    $('#summtrans-phonetic').hide()
                }
                if(res.data.speakUrl){
                    $('#summtrans-speak').attr('play-url',res.data.speakUrl).show()
                }else{
                    $('#summtrans-speak').hide()
                }
                $('#summtrans-vv').html('').scrollTop(0)
                if(res.data.translations){
                    $(res.data.translations).each(function(index,item){
                        $('#summtrans-vv').append(`<div>${lightkeytrans(item)}</div>`)
                    })
                }
                if(res.data.webTranslations){
                    $('#summtrans-vv').append(`<div style="margin-top:10px;">网络释义: </div>`)
                    $(res.data.webTranslations).each(function(index,item){
                        $('#summtrans-vv').append(`<div>${lightkeytrans(item)}</div>`)
                    })
                }

                
                $('#summtrans-vv').show()
                $('#summtrans-value').show()
                $('#summtrans').show()
                $('#video').css('top','-1000px')
            },
        })
    },200)
    
}   
function pauseVideo(){
    $('#video')[0].pause();
}
function playVideo(){
    $('#video')[0].play();
}
function videoPlay(){
    console.log("onplay: "+ ++runstep)
    console.log(" ct: "+ $('#video')[0].currentTime +" st: " +(_this.en.current && _this.en.current.startTime)+" et: " +(_this.en.current && _this.en.current.endTime)+" "+(_this.en.current&&_this.en.current.enValue.substr(0,5)))
    $('.dialog').hide()
    $('#summtrans').hide()
    $('#summtrans-word').text('')
    $('#wordsframe').hide()
    $('#word-in').val('')
    $('#summtrans-value').hide()
    $('#summtrans-vv').text('')
    $('#summtrans-phonetic').text('').hide('')
    $('#summtrans-speak').attr('play-src','').hide('')
      
    $('#video').css('top','0px')
    clearInterval(_this.en.monitor)
    _this.en.monitor = setInterval(function(){
        monitor(videoele.currentTime*1000)
    },10)
    currwordno=0
    _this.translationtext = '';
    $('#zh_subtitles span').css({"background": "transparent","color": "black"})
    $('.startFn').css({'display':'none'})
    $('.stopFn').css({'display':'inline'})
    $('.dialog').css({'display' : 'none'})
    $('.dialogTitle #kw').html('');
    $('.searchClass').val('');
    $('.yibiao').html('')
    $('.fanyi').html('')
    
}
function videoPause(){
    console.log("onpause: "+ ++runstep)
    console.log(" ct: "+ $('#video')[0].currentTime +" st: " +(_this.en.current && _this.en.current.startTime)+" et: " +(_this.en.current && _this.en.current.endTime)+" "+(_this.en.current&&_this.en.current.enValue.substr(0,5)))
    clearInterval(_this.en.monitor)
    $('.stopFn').css({'display':'none'})
    $('.startFn').css({'display':'inline'})
}
function enSubtitlesShow(){
    var thisEle = this;
    console.log($("#zh_subtitles").css("opacity"))
    if($("#zh_subtitles").css("opacity") == 1){
        $("#zh_subtitles").css("opacity",0)
        $('#hideBtn').text("SHOW")
    }else{
        $("#zh_subtitles").css("opacity",1)
        $('#hideBtn').text("HIDE")
    }
}
function chShowDialog(){
    if(!_this.en.current)
        return;
    //let _this = this
    let _time = $('#video')[0].currentTime*1000
    $('.chDialog').css("display","block")
    $('.chDialog div').html(_this.en.current.chValue.replace('\\n','</br>'))
    pauseVideo()
}
function chHideDialog(){
    // $('#video')[0].play();
    $('.chDialog').css("display","none")
}

function timeCycle(_value){
    let _time = _value.split(':')
    let ms = 0;
    _time.forEach((item,inx) =>{
        switch(inx){
        case 0:
            ms += parseFloat(item) * 60*60*1000
            break;
        case 1:
            ms += parseFloat(item) * 60*1000
            break;
        case 2:
            ms += parseFloat(item) * 1000
            break;
        }
    })
    return ms
}
$('#zh_subtitles').mousedown(_ev => {
    //let _this = this
    _this.moveStata = true;
    _coordinates = {
        clientX : _ev.clientX,
        clientY : _ev.clientY,
        pageX : _ev.pageX,
        pageY : _ev.pageY
    };
    //console.log(_ev)
    choooseStart(_this._coordinates); 
    $("#zh_subtitles").mousemove(_e => {
        if(_this.moveStata){
            _coordinates = {
                clientX : _e.clientX,
                clientY : _e.clientY,
                pageX : _e.pageX,   
                pageY : _e.pageY
            };
            // console.log(_e)
            _this.choooseMove(_this._coordinates); 
        }
    }).mouseup(function(_up){
        _this.moveStata = false;
        _coordinates = {
            clientX : _up.clientX,
            clientY : _up.clientY,
            pageX : _up.pageX,
            pageY : _up.pageY
        };
        _this.choooseEnd(_this._coordinates);
        $("#zh_subtitles").unbind('mousemove').unbind('mouseup')
    })
    
})
function touchstartFn(_value){
    //let _this = this,
    _coordinates = {
        clientX : _value.changedTouches[0].clientX,
        clientY : _value.changedTouches[0].clientY,
        pageX : _value.changedTouches[0].pageX,
        pageY : _value.changedTouches[0].pageY
    };
    choooseStart(_coordinates);
}
function touchmoveFn(_value){
    //let _this = this,
    _coordinates = {
        clientX : _value.changedTouches[0].clientX,
        clientY : _value.changedTouches[0].clientY,
        pageX : _value.changedTouches[0].pageX,
        pageY : _value.changedTouches[0].pageY
    };
    choooseMove(_coordinates);
}
function touchendFn(_value){
    //let _this = this,
    _coordinates = {
        clientX : _value.changedTouches[0].clientX,
        clientY : _value.changedTouches[0].clientY,
        pageX : _value.changedTouches[0].pageX,
        pageY : _value.changedTouches[0].pageY
    };
    choooseEnd(_coordinates);
}
function choooseStart(_value){
    console.log(_value)
    console.dir($("#zh_subtitles").height())
    let width = $("#zh_subtitles").width() + $("#zh_subtitles").offset().left - 5,
    height = $("#zh_subtitles").height() + $("#zh_subtitles").offset().top - 5;

    ////let _this = this;
    chooseDomList = [];
    $('#zh_subtitles span').css({"background": "transparent","color": "black"})
    
    ele = document.elementFromPoint(_value.pageX, _value.pageY);
    if(!$(ele).hasClass('font'))
        return;
    let mx = _value.clientX || _value.pageX
    let my = _value.clientY || _value.pageY
    if((width - 5)>mx && mx>($("#zh_subtitles").offset().left+ 5) && ($("#zh_subtitles").offset().top +5)<my && my<(height - 5)){
        if(ele.className.lastIndexOf('font span ')<0){
            // 匹配是否是上次点击的字段
            // && ele.innerHTML!= translationtext && !_this.chooseDomList.length && translationtext.indexOf(ele.innerHTML)<0
            if(ele.innerHTML!=" "){
                _this.chooseDomList.push({
                    class:ele.className,
                    value:ele.innerHTML,
                })
                $('.'+ele.className.split(' ')[1]).css({
                    'background' : '#d2cbcb',
                    'color' : 'black'
                })
            }
        }
    }
}
function choooseMove(_value){
    //let _this = this,
    ele = document.elementFromPoint(_value.pageX, _value.pageY);
    if(!$(ele).hasClass('font'))
        return;
    let mx = _value.clientX || _value.pageX
    let my = _value.clientY || _value.pageY
    let width = $("#zh_subtitles").width() + $("#zh_subtitles").offset().left,
    height = $("#zh_subtitles").height() + $("#zh_subtitles").offset().top;
    if((width - 5)>mx && mx>($("#zh_subtitles").offset().left + 5) && ($("#zh_subtitles").offset().top + 5)<my && my<(height - 5)){
        if(ele.className.lastIndexOf('font span ')<0){
            let status = true;
            _this.chooseDomList.findIndex(function(_value, inx){
                if(_value.class == ele.className){
                    status=false
                }
            })
            if(status && ele.innerHTML!=" "){
                if(_this.chooseDomList.length){
                    let _last = parseInt(_this.chooseDomList[_this.chooseDomList.length-1].class.replace('font span',''));
                    let _now = parseInt(ele.className.replace('font span',''));
                    console.log(_now-_last)
                    if( _now == (_last+1)){
                        _this.chooseDomList.push({
                            class:ele.className,
                            value:ele.innerHTML,
                        })
                        $('.'+ele.className.split(' ')[1]).css({
                            'background' : '#d2cbcb',
                            'color' : 'black'
                        })
                    }else if(_now > (_last+1)){
                        
                        for(let i = _last; i < _now; i++){
                            $('.span'+i)
                            _this.chooseDomList.push({
                                class:$('.span'+i).attr('class'),
                                value:$('.span'+i).html(),
                            })
                            $('.span'+i).css({  
                                'background' : '#d2cbcb',
                                'color' : 'black'
                            })
                        }
                    }else{
                        for(let i = _now; i < _last; i++){
                            $('.span'+i)
                            _this.chooseDomList.push({
                                class:$('.span'+i).attr('class'),
                                value:$('.span'+i).html(),
                            })
                            $('.span'+i).css({
                                'background' : '#d2cbcb',
                                'color' : 'black'
                            })
                        }
                    }
                }else{
                    _this.chooseDomList.push({
                        class:ele.className,
                        value:ele.innerHTML,
                    })
                    $('.'+ele.className.split(' ')[1]).css({
                        'background' : '#d2cbcb',
                        'color' : 'black'
                    })
                }
            }
        }
    }
}
function choooseEnd(_value){
    ////let _this = this;
    ele = document.elementFromPoint(_value.pageX, _value.pageY);
    for(let i=0;i<_this.chooseDomList.length-1;i++){
        for(let j=0;j<_this.chooseDomList.length-i-1;j++){
            if(parseInt(_this.chooseDomList[j].class.replace('font span',''))>parseInt(_this.chooseDomList[j+1].class.replace('font span',''))){
                let _swap = _this.chooseDomList[j];
                _this.chooseDomList[j] = _this.chooseDomList[j+1];
                _this.chooseDomList[j+1] = _swap;
            }
        }
    }
    let _data = ''
    $(_this.chooseDomList).each(function(inx,item){
        if(inx>0){
            _data+=' '+item.value.replace(/^(,|\.|\?|!)+/,'').replace(/(,|\.|\?|!)+$/,'')  
        }else{
            _data=item.value.replace(/^(,|\.|\?|!)+/,'').replace(/(,|\.|\?|!)+$/,'')  
        }
    })
    // 匹配是否是上次点击的字段
    // && _this.translationtext != _data && translationtext.indexOf(_data)<0
    if(_data){
        _this.translationtext = _data;
        translatee(_data)
    }else{
        _this.translationtext = ""
    }
    $('.searchClass').blur();
}


var currwordno=0;
var keyCodes=[]
document.onkeydown = function(event){        //在全局中绑定按下事件
　　　　 var e  = event  ||  window.e;
　　　　 var keyCode = e.keyCode || e.which;

    keyCodes=[]
    var last = keyCodes.pop()
    if(last != null && last != undefined)
        keyCodes.push(last)
    if(keyCode!=last)
        keyCodes.push(keyCode)
    console.log(keyCodes+" down")
    var keyy = keyCodes.join()
    switch(keyy){
　　　　 case '27'://esc
            $('#summtrans').hide()
            $('#summtrans-word').text('')
            $('#summtrans-phonetic').text('').hide()
            $('#summtrans-speak').attr('play-url','').hide()
            $('#summtrans-value').hide()
            $('#summtrans-vv').text('')

            $('#wordsframe').hide()
            $('#word-in').val('')
            $('#words .word').remove()
            $('#video').css('top',0)
            break;
　　　　 case '32'://space
            if(document.activeElement == $('#word-in')[0])
                return;
            if($('#video')[0].paused){
                chHideDialog()
                playVideo()
            }
            else
                pauseVideo();
    　　　　 break;
        case '13'://enter
            search();
    　　　　 break;
        case '113'://Q
        case '81'://q
            if(document.activeElement == $('#word-in')[0])
                return;
            prevline()
    　　　　 break;
        case '119'://W
        case '87'://w
            if(document.activeElement == $('#word-in')[0])
                return;
            currline()
    　　　　 break; 
        case '115'://S
        case '83'://s
            if(document.activeElement == $('#word-in')[0])
                return;
            if($('.chDialog').is(":hidden"))
                chShowDialog()
            else
                chHideDialog()
    　　　　 break;
        case '101'://E
        case '69'://e
            if(document.activeElement == $('#word-in')[0])
                return;
            nextline()
    　　　　 break;
        case '97'://A
        case '65'://a
            if(document.activeElement == $('#word-in')[0])
                return;
            if(currwordno<=1)
                currwordno=_this.en.currentwords.length
            else
                currwordno--;
            locateWord(currwordno)
    　　　　 break;
        case '100'://D
        case '68'://d
            if(document.activeElement == $('#word-in')[0])
                return;
            currwordno++;
            if(currwordno>_this.en.currentwords.length)
                currwordno=1
            locateWord(currwordno)
    　　　　 break;
    }
    
}


function locateWord(no){
    currwordno = no;
    $('.font').css({
        'background' : 'transparent'
    })
    $('.font.span'+(currwordno-1)).css({
        'background' : '#d2cbcb'
    })
    pauseVideo()
    $('#summtrans-word').show()
    if(currwordno>0){
        $('#wordsframe').hide()
        translatee(_this.en.currentwords[currwordno-1])
    }
}

document.onkeyup = function(event){      
    console.log(keyCodes+" up")
    keyCodes.pop()　
}
document.onfocus = function(){
    console.log('document.blur()')
    keyCodes=[]
}

window.onbeforeunload=function(){
    console.log('onbeforeunload')
    navigator.sendBeacon("/mumu/page-out");
    localStorage.removeItem('havindex')
}
var lastTouchEnd;
document.addEventListener('touchend', function(event) {
    var now = new Date().getTime();
    if (now - lastTouchEnd <= 300) {
        event.preventDefault();
    }
    lastTouchEnd = now;
}, false);


onresize()
function onresize(){
    if(isPc()){
        $('#gearframe1').hide()
        $('#pcrecommand').text('翻译快捷键(a,s,d,enter) 控制快捷键(q,w,e,space)')
    }else{
        $('#gearframe1').show()
        $('#pcrecommand').text('PC端操作更方便')
    }
    if(video.height && video.width)
        $('#video').css('height',parseInt($('#video').css('width').replace('px',''))*(video.height/video.width))
}


function search(){
    if(document.activeElement == $('#word-in')[0]){
        $('#wordsframe').hide()
        translatee($('#word-in').val())
        if(!$('#word-in').val()){
            $('#summtrans').hide()
            $('#wordsframe').hide()
            $('#video').css('top',0)
        }
    } else {
        $('#summtrans').hide()
        $('#wordsframe').show()
        $('#word-in').focus()
        $('#word-in').trigger("input")
        $('#video').css('top','-1000px')
        pauseVideo();
    }
}


$.get('/mumu/wxjsapiticket',(res)=>{
    $.get('/mumu/wxsign',{ticket:res.data.ticket,url:location.href},(res)=>{
        console.log(JSON.stringify(res));
        wx.config({
            debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
            appId: res.data.appid, // 必填，公众号的唯一标识
            timestamp: res.data.timestamp, // 必填，生成签名的时间戳
            nonceStr:  res.data.nonceStr, // 必填，生成签名的随机串
            signature:  res.data.signature,// 必填，签名
            jsApiList: ['updateAppMessageShareData'] // 必填，需要使用的JS接口列表
        });
    })
})

wx.ready(function () {   //需在用户可能点击分享按钮前就先调用
    wx.updateAppMessageShareData({ 
        title: video.name, // 分享标题
        desc: 'renx.cc', // 分享描述
        link: location.href, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
        imgUrl: location.origin+'/mumu/favicon.ico', // 分享图标
        success: function () {
            // 设置成功
        }
    })

    wx.updateTimelineShareData({ 
        title: video.name, // 分享标题
        desc: 'renx.cc', // 分享描述
        link: location.href, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
        imgUrl: location.origin+'/mumu/favicon.ico', // 分享图标
        success: function () {
        // 设置成功
        }
    })
});

function lightkeytrans(ss){
    if(!ss)
        return ss
    var sss= ss.match(/(\w*)\s*?(的过去|的现在|的复数|的第三|的ing)/)
    if(!sss)
        return ss
    sss[1]
    ss = ss.replace(sss[1],`<span style="text-decoration: underline;cursor:pointer;" onclick="translatee('${sss[1]}')">${sss[1]}</span>`)
    return ss;
}