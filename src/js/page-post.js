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
noDebuger()
function noDebuger() {
    function testDebuger() {
        var d = new Date();
        debugger;
        if (new Date() - d > 10) {
            document.body.innerHTML = '<div style="width: 100%;height: 50px;font-size: 30px;text-align: center;font-weight: bold;color:#ffffff;"></div>';
            return true;
        }
       return false;
   }
   function start() {
       while (testDebuger()) {
           testDebuger();
       }
   }
   if (!testDebuger()) {
       window.onblur = function () {
           setTimeout(function () {
               start();
           }, 500)
       }
   }else {
       start();
   }
}
