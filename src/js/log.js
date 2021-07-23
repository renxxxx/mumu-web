(function(){
    window.log={};
    var logsstr = localStorage.getItem(config.project+'-logs')
    log.logs=logsstr?JSON.parse(logsstr):[];
    log.debugon=0

    log.info=function(content){
        content="IN: " + content
        log.log(content)
    }

    log.debug=function(content){
        content="DE: " + content
        if(log.debugon)
            log.log(content)
    }

    log.log=function(content){
        console.log(content)
        log.logs.push(content)
        localStorage.setItem(config.project+'-logs',JSON.stringify(log.logs))
        if(log.logs.length>=10)
            log.flush()
    }

    log.flush=function(){
        console.log('log.flush')
        var toflushlogs = log.logs.splice(0,log.logs.length)
        localStorage.setItem(config.project+'-logs',JSON.stringify(log.logs))
        if(toflushlogs.length <= 0)
            return;
        var data = {
            log:toflushlogs.join(',,,,'),
            page:location.href
        };
        var blob = new Blob([$.param(data)], {type : 'application/x-www-form-urlencoded'})
        navigator.sendBeacon('/mumu/front-log-do',blob)
        // $.ajax(
        //     {
        //         url:"/mumu/front-log-do",
        //         data:{log:toflushlogs.join(',,,,')},
        //         success:function(res){
        //             if(res.code == 0){
        //             }
        //         }
        //     }
        // )
    }

    log.getlogs=function(kw,rstart,rcount){
        var logss = null
        $.ajax(
            {
                url:"/mumu/front-logs",
                async:false,
                data:{kw:kw,rstart:rstart,rcount:rcount},
                success:function(res){
                    logss = res.data.rows
                }
            }
        )
        return logss;
    }

})()