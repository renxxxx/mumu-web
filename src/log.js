(function(){
    window.log={};
    var logsstr = localStorage.getItem('logs')
    log.logs=logsstr?JSON.parse(logsstr):[];
    log.debug=1

    log.info=function(content){
        log.log(content)
    }

    log.debug=function(content){
        if(log.debug)
            log.log(content)
    }

    log.log=function(content){
        console.log(content)
        log.logs.push(content)
        localStorage.setItem('logs',JSON.stringify(log.logs))
        if(log.logs.length>=20)
            log.flush()
    }

    log.flush=function(){
        var toflushlogs = log.logs.splice(0,log.logs.length)
        localStorage.setItem('logs',JSON.stringify(log.logs))
        $.ajax(
            {
                url:"/mumu/front-log-do",
                method:"post",
                data:{log:toflushlogs.join(',,,,')},
                success:function(res){
                    if(res.code == 0){
                    }
                }
            }
        )
    }

    log.getlogs=function(kw,rstart,rcount){
        var logss = null
        $.ajax(
            {
                url:"/mumu/front-logs",
                method:"get",
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