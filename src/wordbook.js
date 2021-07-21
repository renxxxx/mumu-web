
(function(){
    var page = {}
    window.page=page
    page.wordbookNo=getUrlParam('wordbookNo')
    page.templateNo=getUrlParam('templateNo')
    page.wordbook=null
    page.extendword=null
    page.rollword=null
    page.words={
        rcount:200,
        rows:[],
        inx:0,
        map:{},
        select:null,
    }
    loadMoreWordbookWords(page.templateNo)

    setTimeout(function(){
        $('#logo').hide()
        $('#index').show()
        $('#play').show()
        $('#title').show()
        $('#goindexbtn').show()
    },1000)



    function loadMoreWordbookWords(wordbookNo){
        var rstart = page.words.rows.length+1
        var rcount = page.words.rcount
        $.ajax({
            url: '/mumu/template-wordbook-words?',
            data: {
                wordbookNo:wordbookNo,
                templateNo:wordbookNo,
                rstart:rstart,
                rcount:rcount,
                getWordbook:1,
            },
            success:function(res){
                if(res.code==0){
                    page.wordbook=res.data.wordbook;
                    $('#title').text(page.wordbook.name)
                    if(res.data.rows.length>0){
                        res.data.rows.forEach(element => {
                            page.words.rows.push(element)
                            var ele = $(`.rowspad .row0`).clone(true);
                            ele.removeClass('row0')
                            ele.addClass('no'+element.no)
                            ele.find('.word').text(element.word)
                            element.speakUrl=element.usSpeech?element.usSpeech:element.ukSpeech?element.ukSpeech:element.speakUrl;
                            element.phonetic=element.usPhonetic?element.usPhonetic:element.ukPhonetic?element.ukPhonetic:element.phonetic;
                            if(element.phonetic){
                                ele.find('.phonetic').text('/'+element.phonetic+'/');
                            }else{
                                ele.find('.word').css('width','70%')
                                ele.find('.phonetic').hide();
                            }
                            ele.find('.translation').text(element.translation)
                            $(`.rowspad .row0`).before(ele)
                            ele.show()
                            page.words.map['no'+element.no]=element
                            ele[0].data=element
                        });
                    }
                }
            }
        })
    }

    $('#rollShowWordsPad .word').click(function(){
        page.extendword=page.rollword.word
        $('#extendSearchPad').show()
        $('#extendSearchFrame').attr('src','https://cn.bing.com/images/search?ensearch=1&q='+page.extendword).show()
        $('#extendSearchFrame1').attr('src',null).hide()
        $('#extendSearchFrame2').attr('src',null).hide()

        $('#extendSearchPad .bing').css('background-color','#ffffff')
        $('#extendSearchPad .baidu').css('background-color','#cacaca')
        $('#extendSearchPad .aliexpress').css('background-color','#cacaca')
    })
    $(`.rowspad .row0`).click(function(){
        $('.rowspad .row').css('background-color','unset')
        $(this).css('background-color','#444')

        page.words.select=this.data;
        page.rollInx=page.words.rows.indexOf(page.words.select)+1
        page.extendword=page.words.select.word
        $('#extendSearchPad').show()
        $('#extendSearchFrame').attr('src','https://cn.bing.com/images/search?ensearch=1&q='+page.extendword).show()
        $('#extendSearchFrame1').attr('src',null).hide()
        $('#extendSearchFrame2').attr('src',null).hide()

        $('#extendSearchPad .bing').css('background-color','#ffffff')
        $('#extendSearchPad .baidu').css('background-color','#cacaca')
        $('#extendSearchPad .aliexpress').css('background-color','#cacaca')
    })

    $('#extendSearchPad').click(function(e){
        if(this==e.target){
            $('#extendSearchPad').hide()
            $('#extendSearchFrame').attr('src',null).hide()
            $('#extendSearchFrame1').attr('src',null).hide()
            $('#extendSearchFrame2').attr('src',null).hide()

            $('#extendSearchPad .bing').css('background-color','unset')
            $('#extendSearchPad .baidu').css('background-color','unset')
            $('#extendSearchPad .ebay').css('background-color','unset')
        }
    })

    $('#extendSearchPad .bing').click(function(e){
        $('#extendSearchFrame').show()
        $('#extendSearchFrame1').hide()
        $('#extendSearchFrame2').hide()
        $('#extendSearchPad .bing').css('background-color','#ffffff')
        $('#extendSearchPad .baidu').css('background-color','#cacaca')
        $('#extendSearchPad .aliexpress').css('background-color','#cacaca')
    })
    $('#extendSearchPad .baidu').click(function(e){
        $('#extendSearchFrame').hide()
        $('#extendSearchFrame1').show()
        $('#extendSearchFrame2').hide()
        $('#extendSearchPad .bing').css('background-color','#cacaca')
        $('#extendSearchPad .baidu').css('background-color','#ffffff')
        $('#extendSearchPad .aliexpress').css('background-color','#cacaca')
        if(!$('#extendSearchFrame1').attr('src')){
            $('#extendSearchFrame1').attr('src','https://m.baidu.com/s?word=英文'+page.extendword)
        }
    })
    $('#extendSearchPad .aliexpress').click(function(e){
        $('#extendSearchFrame').hide()
        $('#extendSearchFrame1').hide()
        $('#extendSearchFrame2').show()
        $('#extendSearchPad .bing').css('background-color','#cacaca')
        $('#extendSearchPad .baidu').css('background-color','#cacaca')
        $('#extendSearchPad .aliexpress').css('background-color','#ffffff')
        if(!$('#extendSearchFrame2').attr('src')){
            $('#extendSearchFrame2').attr('src','https://m.aliexpress.com/wholesale/'+page.extendword+'.html?osf=direct')
        }
    })

    $('.coverTargetTextBtn').click(function(){
        if($('.word').css('visibility')=='hidden')
            $('.word').css('visibility','visible')
        else
            $('.word').css('visibility','hidden')
    })
    $('.coverPhoneticTextBtn').click(function(){
        if($('.phonetic').css('visibility')=='hidden')
            $('.phonetic').css('visibility','visible')
        else
            $('.phonetic').css('visibility','hidden')
    })
    $('.coverMainTextBtn').click(function(){
        if($('.translation').css('visibility')=='hidden')
            $('.translation').css('visibility','visible')
        else
            $('.translation').css('visibility','hidden')
    })

    $('#goindexbtn').click(function(){
        location.replace('./')
    })



    $('#play').click(function(){
        page.rollOpen=1
        $('#rollShowWordsPad').show()
        $('#rollShowWordsPad .stop').hide()
        $('#rollShowWordsPad .start').show()
        page.rollIsSound=0
        page.auto=0
        page.rollInx=!page.rollInx?1:page.rollInx
        wordsRoll(page.rollInx)
    })




    function closeRollShowWordsPad(){
        $('#rollShowWordsPad').hide()
        page._mp3.pause()
        page.lettersound.pause()
        clearTimeout(page.rollWordsInterval)
        clearTimeout(page.readRollWordTimeout)
        page.rollOpen=0
    }

    $('#rollShowWordsPad').click(function(e){
        if(this==e.target){
            closeRollShowWordsPad()
        }
    })

    $('#rollShowWordsPad .prev').click(function(e){
        wordsRoll(page.rollInx-1)
    })
    $('#rollShowWordsPad .next').click(function(e){
        wordsRoll(page.rollInx+1)
    })
    $('#rollShowWordsPad .restart').click(function(e){
        wordsRoll(1)
    })

    $('#rollShowWordsPad .stop').click(function(e){
        page._mp3.pause()
        page.lettersound.pause()
        clearTimeout(page.rollWordsInterval)
        clearTimeout(page.readRollWordTimeout)
        $('#rollShowWordsPad .stop').hide()
        $('#rollShowWordsPad .start').show()
        page.rollIsSound=0
        page.auto=0
    })

    $('#rollShowWordsPad .start').click(function(e){
        page.rollIsSound=1
        page.auto=1
        startWordsRoll(page.rollInx)
    })

    $('#startRollBtn').click(function(){
        page.rollOpen=1
        $('#rollShowWordsPad').show()
        $('#rollShowWordsPad .stop').hide()
        $('#rollShowWordsPad .start').show()
        page.rollIsSound=0
        page.auto=0
        page.rollInx=!page.rollInx?1:page.rollInx
        wordsRoll(page.rollInx)
    })

    $('#rollShowWordsPad .word').click(function(){
        var word = page.words.rows[page.rollInx-1]
        translatee(word.word)
        loadRelatedWords(word.word)
        closeRollShowWordsPad()
    })

    function startWordsRoll(rollInx){
        $('#rollShowWordsPad .stop').show()
        $('#rollShowWordsPad .start').hide()
        page.rollIsSound=1
        page.auto=1
        rollInx=!rollInx?1:rollInx
        wordsRoll(rollInx);
    }
    page._mp3 = document.createElement('video')
    page.lettersound = document.createElement('video')
    function wordsRoll(rollInx){
        if(!page.rollOpen){
            closeRollShowWordsPad()
            return;
        }

        page._mp3.pause()
        page.lettersound.pause()
        clearTimeout(page.rollWordsInterval)
        clearTimeout(page.readRollWordTimeout)
        if(page.words.rows.length==0)
            return;
        var word = page.words.rows[rollInx-1]

        if(!word){
            loadMoreWordbookWords(page.wordbooks.selected.no)
        }
        word = page.words.rows[rollInx-1]
        if(!word){
            page.rollInx=1
            wordsRoll(page.rollInx)
            return;
        }
        page.rollword=word
        word.speakUrl=word.usSpeech?word.usSpeech:word.ukSpeech?word.ukSpeech:word.speakUrl;
        if(!word.speakUrl)
            $.ajax({
                url: '/mumu/translate?from='+1+'&to=2&q='+word.word,
                ajaxCache:true,
                async: false,
                success: function(res) {
                    if(res.code==0){
                        word.speakUrl=res.data.speakUrl
                        word.usSpeech=res.data.usSpeech
                        word.ukSpeech=res.data.ukSpeech
                        word.usPhonetic=res.data.usPhonetic
                        word.ukPhonetic=res.data.ukPhonetic
                    }
                }
            })
        word.speakUrl=word.usSpeech?word.usSpeech:word.ukSpeech?word.ukSpeech:word.speakUrl;
        word.phonetic=word.usPhonetic?word.usPhonetic:word.ukPhonetic?word.ukPhonetic:word.phonetic;

        page.rollInx=rollInx
        localStorage.setItem(config.project+'-rollInx',page.rollInx)
        $('#rollShowWordsPad .word').text(word.word)
        $('#rollShowWordsPad .inx').text(rollInx)
        $('#rollShowWordsPad .phonetic').text(word.phonetic?('/'+word.phonetic+'/'):' ')
        $('#rollShowWordsPad .translation').text(word.translation||' ')

        if(page.auto){
            if(page.rollIsSound){
                readWord(word)
                function readWord(word){
                    var count = 0;

                    if(word.speakUrl){
                        page._mp3.muted=false
                        page._mp3.src=word.speakUrl;
                    }else {
                        page._mp3.muted=true
                        page._mp3.src="/file/mumu/lettersounds/a.mp3"
                    }
                    page._mp3.onpause=function(){
                        if(page._mp3.currentTime==page._mp3.duration){
                            if(count > 0){
                                page.readRollWordTimeout=setTimeout(function(){
                                    page._mp3.play()
                                },100)
                                count--;
                            }else{
                                clearTimeout(page.readRollWordTimeout)
                                clearTimeout(page.rollWordsInterval)
                                if(!word.translationVoice){
                                    $.ajax({
                                        url:'/mumu/get-read',
                                        data:{
                                            text:word.translation,
                                            lang:'zh'
                                        },
                                        success:function(res){
                                            word.translationVoice=res.data.voice
                                            fff()
                                        }
                                    })
                                }else{
                                    fff()
                                }

                                function fff(){
                                    page.rollWordsInterval = setTimeout(function(){
                                        page._mp3.onpause=function(){
                                            page.rollWordsInterval = setTimeout(function(){
                                                wordsRoll(page.rollInx+1)
                                            },1000)
                                        }
                                        page._mp3.src=word.translationVoice
                                        page._mp3.play()
                                    },100)
                                }
                            }
                        }
                    }
                    page._mp3.play()
                }

            }
        }
    }


    if(is_weixn()){
        $.post('/mumu/wxjsapiticket',(res)=>{
            $.post('/mumu/wxsign',{ticket:res.data.ticket,url:location.href},(res)=>{
                //log.debug(JSON.stringify(res));
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
        page.shareLink = location.origin+'/mumu/wordbook.html?wordbookNo='+page.wordbookNo+'&templateNo='+page.templateNo;
        wx.ready(function () {   //需在用户可能点击分享按钮前就先调用
            wx.updateAppMessageShareData({
                title: page.wordbook.name, // 分享标题
                desc: '单词本', // 分享描述
                link: page.shareLink, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
                imgUrl: location.origin+'/mumu/favicon.ico', // 分享图标
                success: function () {
                    // 设置成功
                }
            })

            wx.updateTimelineShareData({
                title: page.wordbook.name + '\n单词本', // 分享标题
                link: page.shareLink, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
                imgUrl: location.origin+'/mumu/favicon.ico', // 分享图标
                success: function () {
                // 设置成功
                }
            })
        });
    }
})()
