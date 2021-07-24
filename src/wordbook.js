
(function(){
    var page = {}
    window.page=page
    page.wordbookNo=ttb(getUrlParam('wordbookNo'))
    page.templateNo=ttb(getUrlParam('templateNo'))
    page.wordbook=null
    page.extendword=null
    page.rollword=null
    page.rollstop=null
    page.words={
        rcount:200,
        rows:[],
        inx:0,
        map:{},
        select:null,
    }
    loadMoreWordbookWords()

    setTimeout(function(){
        $('#logo').hide()
        $('#index').show()
        $('#play').show()
        $('#title').show()
        $('#goindexbtn').show()
    },1000)



    function loadMoreWordbookWords(){
        var rstart = page.words.rows.length+1
        var rcount = page.words.rcount
        $.ajax({
            url: '/mumu/template-wordbook-words?',
            data: {
                wordbookNo:page.wordbookNo,
                templateNo:page.templateNo,
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
                            element.speakUrl=element.ukSpeech?element.ukSpeech:element.usSpeech?element.usSpeech:element.speakUrl;
                            element.phonetic=element.ukPhonetic?element.ukPhonetic:element.usPhonetic?element.usPhonetic:element.phonetic;
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
        log.info(`$('#rollShowWordsPad .word').click`)
        page.extendword=page.rollword
        $('#extendSearchPad').show()
        $('#extendSearchFrame').attr('src','https://m.youdao.com/dict?q='+page.extendword.word).show()
        $('#extendSearchFrame1').attr('src',null).hide()
        $('#extendSearchFrame2').attr('src',null).hide()
        $('#extendSearchFrame3').attr('src',null).hide()
        $('#extendSearchFrame4').attr('src',null).hide()

        $('#extendSearchPad .g').css('background-color','#ffffff')
        $('#extendSearchPad .g1').css('background-color','#cacaca')
        $('#extendSearchPad .g2').css('background-color','#cacaca')
        $('#extendSearchPad .g3').css('background-color','#cacaca')
        $('#extendSearchPad .g4').css('background-color','#cacaca')

    })
    $(`.rowspad .row0`).click(function(){
        log.info(`$('.rowspad .row0').click`)
        $('.rowspad .row').css('background-color','unset')
        $(this).css('background-color','#444')

        page.words.select=this.data;
        page.rollInx=page.words.rows.indexOf(page.words.select)+1
        page.extendword=page.words.select
        $('#extendSearchPad').show()
        $('#extendSearchFrame').attr('src','https://m.youdao.com/dict?q='+page.extendword.word).show()
        $('#extendSearchFrame1').attr('src',null).hide()
        $('#extendSearchFrame2').attr('src',null).hide()
        $('#extendSearchFrame3').attr('src',null).hide()
        $('#extendSearchFrame4').attr('src',null).hide()

        $('#extendSearchPad .g').css('background-color','#ffffff')
        $('#extendSearchPad .g1').css('background-color','#cacaca')
        $('#extendSearchPad .g2').css('background-color','#cacaca')
        $('#extendSearchPad .g3').css('background-color','#cacaca')
        $('#extendSearchPad .g4').css('background-color','#cacaca')

    })

    $('#extendSearchPad').click(function(e){
        log.info(`$('#extendSearchPad').click`)
        if(this==e.target){
            $('#extendSearchPad').hide()
            $('#extendSearchFrame').attr('src',null).hide()
            $('#extendSearchFrame1').attr('src',null).hide()
            $('#extendSearchFrame2').attr('src',null).hide()
            $('#extendSearchFrame3').attr('src',null).hide()
            $('#extendSearchFrame4').attr('src',null).hide()

            $('#extendSearchPad .g').css('background-color','unset')
            $('#extendSearchPad .g1').css('background-color','unset')
            $('#extendSearchPad .g2').css('background-color','unset')
            $('#extendSearchPad .g3').css('background-color','unset')
            $('#extendSearchPad .g4').css('background-color','unset')
        }
    })

    $('#extendSearchPad .g').click(function(e){
        log.info(`$('#extendSearchPad .g').click`)
        $('#extendSearchFrame').show()
        $('#extendSearchFrame1').hide()
        $('#extendSearchFrame2').hide()
        $('#extendSearchFrame3').hide()
        $('#extendSearchFrame4').hide()
        $('#extendSearchPad .g').css('background-color','#ffffff')
        $('#extendSearchPad .g1').css('background-color','#cacaca')
        $('#extendSearchPad .g2').css('background-color','#cacaca')
        $('#extendSearchPad .g3').css('background-color','#cacaca')
        $('#extendSearchPad .g4').css('background-color','#cacaca')
    })
    $('#extendSearchPad .g1').click(function(e){
        log.info(`$('#extendSearchPad .g1').click`)
        $('#extendSearchFrame').hide()
        $('#extendSearchFrame1').show()
        $('#extendSearchFrame2').hide()
        $('#extendSearchFrame3').hide()
        $('#extendSearchFrame4').hide()
        $('#extendSearchPad .g').css('background-color','#cacaca')
        $('#extendSearchPad .g1').css('background-color','#ffffff')
        $('#extendSearchPad .g2').css('background-color','#cacaca')
        $('#extendSearchPad .g3').css('background-color','#cacaca')
        $('#extendSearchPad .g4').css('background-color','#cacaca')
        if(!$('#extendSearchFrame1').attr('src')){
            $('#extendSearchFrame1').attr('src','https://cn.bing.com/images/search?ensearch=1&q='+page.extendword.word)
        }
    })
    $('#extendSearchPad .g2').click(function(e){
        log.info(`$('#extendSearchPad .g2').click`)
        $('#extendSearchFrame').hide()
        $('#extendSearchFrame1').hide()
        $('#extendSearchFrame2').show()
        $('#extendSearchFrame3').hide()
        $('#extendSearchFrame4').hide()
        $('#extendSearchPad .g').css('background-color','#cacaca')
        $('#extendSearchPad .g1').css('background-color','#cacaca')
        $('#extendSearchPad .g2').css('background-color','#ffffff')
        $('#extendSearchPad .g3').css('background-color','#cacaca')
        $('#extendSearchPad .g4').css('background-color','#cacaca')
        if(!$('#extendSearchFrame2').attr('src')){
            $('#extendSearchFrame2').attr('src','https://m.baidu.com/sf/vsearch?pd=video&atn=index&word=英文'+page.extendword.word)
        }
    })
    $('#extendSearchPad .g3').click(function(e){
        log.info(`$('#extendSearchPad .g3').click`)
        $('#extendSearchFrame').hide()
        $('#extendSearchFrame1').hide()
        $('#extendSearchFrame2').hide()
        $('#extendSearchFrame3').show()
        $('#extendSearchFrame4').hide()
        $('#extendSearchPad .g').css('background-color','#cacaca')
        $('#extendSearchPad .g1').css('background-color','#cacaca')
        $('#extendSearchPad .g2').css('background-color','#cacaca')
        $('#extendSearchPad .g3').css('background-color','#ffffff')
        $('#extendSearchPad .g4').css('background-color','#cacaca')
        if(!$('#extendSearchFrame3').attr('src')){
            $('#extendSearchFrame3').attr('src','https://m.aliexpress.com/wholesale/'+page.extendword.word+'.html?osf=direct')
        }
    })

    $('#extendSearchPad .g4').click(function(e){
        log.info(`$('#extendSearchPad .g4').click`)
        $('#extendSearchFrame').hide()
        $('#extendSearchFrame1').hide()
        $('#extendSearchFrame2').hide()
        $('#extendSearchFrame3').hide()
        $('#extendSearchFrame4').show()
        $('#extendSearchPad .g').css('background-color','#cacaca')
        $('#extendSearchPad .g1').css('background-color','#cacaca')
        $('#extendSearchPad .g2').css('background-color','#cacaca')
        $('#extendSearchPad .g3').css('background-color','#cacaca')
        $('#extendSearchPad .g4').css('background-color','#ffffff')
        if(!$('#extendSearchFrame4').attr('src')){
            $('#extendSearchFrame4').attr('src','https://m.sogou.com/web/searchList.jsp?keyword='+page.extendword.translation)
        }
    })
    $('.coverTargetTextBtn').click(function(){
        log.info(`$('.coverTargetTextBtn').click`)
        if($('.word').css('visibility')=='hidden')
            $('.word').css('visibility','visible')
        else
            $('.word').css('visibility','hidden')
    })
    $('.coverPhoneticTextBtn').click(function(){
        log.info(`$('.coverPhoneticTextBtn').click`)
        if($('.phonetic').css('visibility')=='hidden')
            $('.phonetic').css('visibility','visible')
        else
            $('.phonetic').css('visibility','hidden')
    })
    $('.coverMainTextBtn').click(function(){
        log.info(`$('.coverMainTextBtn').click`)
        if($('.translation').css('visibility')=='hidden')
            $('.translation').css('visibility','visible')
        else
            $('.translation').css('visibility','hidden')
    })

    $('#goindexbtn').click(function(){
        log.info(`$('#goindexbtn').click`)
        location.replace('./')
    })



    $('#play').click(function(){
        log.info(`$('#play').click`)
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
        log.info(`$('#rollShowWordsPad').click`)
        if(this==e.target){
            closeRollShowWordsPad()
        }
    })

    $('#rollShowWordsPad .prev').click(function(e){
        log.info(`$('#rollShowWordsPad .prev').click`)
        wordsRoll(page.rollInx-1)
    })
    $('#rollShowWordsPad .next').click(function(e){
        log.info(`$('#rollShowWordsPad .next').click`)
        wordsRoll(page.rollInx+1)
    })
    $('#rollShowWordsPad .restart').click(function(e){
        log.info(`$('#rollShowWordsPad .restart').click`)
        wordsRoll(1)
    })

    $('#rollShowWordsPad .stop').click(function(e){
        log.info(`$('#rollShowWordsPad .stop').click`)
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
        log.info(`$('#rollShowWordsPad .start').click`)
        page.rollIsSound=1
        page.auto=1
        startWordsRoll(page.rollInx)
    })

    $('#startRollBtn').click(function(){
        log.info(`$('#startRollBtn').click`)
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
        log.info(`$('#rollShowWordsPad .word').click`)
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
    page._mp3 = $(`<video x5-playsinline playsinline controls360=no webkit-playsinline ></video>`)[0]
    page.lettersound = $(`<video x5-playsinline playsinline controls360=no webkit-playsinline ></video>`)[0]
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
            loadMoreWordbookWords()
        }
        word = page.words.rows[rollInx-1]
        if(!word){
            page.rollInx=1
            wordsRoll(page.rollInx)
            return;
        }
        page.rollword=word
        word.speakUrl=word.ukSpeech?word.ukSpeech:word.usSpeech?word.usSpeech:word.speakUrl;
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
        word.speakUrl=word.ukSpeech?word.ukSpeech:word.usSpeech?word.usSpeech:word.speakUrl;
        word.phonetic=word.ukPhonetic?word.ukPhonetic:word.usPhonetic?word.usPhonetic:word.phonetic;

        page.rollInx=rollInx
        localStorage.setItem(config.project+'-rollInx',page.rollInx)
        $('#rollShowWordsPad .word').text(word.word)
        $('#rollShowWordsPad .inx').text(rollInx)
        $('#rollShowWordsPad .phonetic').text(word.phonetic?('/'+word.phonetic+'/'):' ')
        $('#rollShowWordsPad .translation').text(word.translation||' ')

        if(page.auto){
            if(page.rollIsSound){
                readWord(word)
            }
        }
    }

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
                                fff(word)
                            }
                        })
                    }else{
                        fff(word)
                    }
                }
            }
        }
        page._mp3.play()
    }

    function fff(word){
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
                title: page.wordbook.name+'的英文', // 分享标题
                desc: '单词本', // 分享描述
                link: page.shareLink, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
                imgUrl: location.origin+'/mumu/favicon.ico', // 分享图标
                success: function () {
                    // 设置成功
                }
            })

            wx.updateTimelineShareData({
                title: page.wordbook.name+'的英文' + '\n单词本', // 分享标题
                link: page.shareLink, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
                imgUrl: location.origin+'/mumu/favicon.ico', // 分享图标
                success: function () {
                // 设置成功
                }
            })
        });
    }


    window.onbeforeunload=function(){
        log.flush()
    }
})()
