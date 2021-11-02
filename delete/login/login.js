import { createApp } from 'vue'

import Login from './login.vue'

const login=function(options = {
  container:null
}) {
  let containerEle;
  if(options.container){
    containerEle = document.querySelector(options.container)
  }else{
    containerEle = document.body
  }

  const mountNode = document.createElement('div')
  document.body.appendChild(mountNode)

  let app = createApp(Login, {
    ...options
  })
  return app.mount(mountNode)
}

login.close = function(options={}){
  let m_login = document.querySelector('#m_login')
  m_login.parentNode.removeChild(m_login)
}

login.install = app => {
  app.component('login', Login)
  app.config.globalProperties.$login = login
  app.provide('login', login)
}

export default login