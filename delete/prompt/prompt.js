import { createApp } from 'vue'
import prompt from './prompt.vue'

class Prompt {
    install (app) {
        app.config.globalProperties.$prompt = (paramm={})=>{
            let div = document.createElement('div')
            div.id='a'+Math.floor(Math.random()*899999 + 100000)
            div.style['position']='absolute'
            div.style['top']='0'
            div.style['bottom']='0'
            div.style['right']='0'
            div.style['left']='0'
            document.querySelector('#app').appendChild(div)
    
            paramm = paramm ? paramm:{}
            let app = createApp(prompt, {
                title: paramm.title,
                confirm: function(input){
                    if(paramm.confirm)
                        paramm.confirm(input)
                        app.unmount()
                        div.parentNode.removeChild(div)
                },
                cancel: function(input){
                    if(paramm.cancel)
                        paramm.cancel(input)
                    app.unmount()
                    div.parentNode.removeChild(div)
                },
            })
            app.mount('#'+div.id)
        }
    }
}

export default new Prompt();

