<template>
    <div id="m_login" v-if="show" style="width:100%;background-color: rgba(0, 0, 0, 0.815);position:absolute;top:0;bottom:0;font-size:0;"
      @click.self="$store.doLogin=0">
      <div style="width:95%;height:500px;background-color: #ffffff;margin:auto;margin-top:50px;border-radius: 2px;">
          <div style="width:100%;text-align: center;font-size: 16px;line-height:40px;">
            登录
          </div>
          <div style="width:100%;line-height:40px;text-align: center;">
            <span class="line1" style="display:inline-block;font-size: 16px;width:70px;vertical-align: middle;text-align: left;">
              账号
            </span>
            <input v-model="account"  style="width:200px;display: inline-block;vertical-align: middle;"/>
          </div>
          <div style="width:100%;line-height:40px;text-align: center;">
            <span class="line1" style="display:inline-block;font-size: 16px;width:70px;vertical-align: middle;text-align: left;">
              密码
            </span>
            <input v-model="password" type="password"  style="width:200px;display: inline-block;vertical-align: middle;"/>
          </div>
          <div style="width:100%;line-height:40px;text-align: center;margin-top:20px;">
            <span style="display:inline-block;font-size: 16px;width:200px;cursor: pointer;" @click="login">
              登录
            </span>
            <span style="display:inline-block;font-size: 16px;width:200px;cursor: pointer;" @click="show=0">
              取消
            </span>
          </div>
      </div>
    </div>
</template>

<script>
export default {
  name: 'login',
  data() {
    return {
        show:1,
        account:null,
        password:null,
    }
  },
  props: {
  },
  methods:{
    login(){
      ts.$axios.post('/mumu/login-by-password',ts.$qs.stringify({account:ts.account,password:ts.password}))
      .then(function (res) {
        if(res.data.code==0){
          ts.$axios.post('/mumu/login-refresh')
          .then(function (res) {
            if(res.data.code==0){
              ts.$store.doLogin=0
              ts.$store.login=res.data.data
              ts.$router.reload()
            }else{
              alert(res.data.message)
            }
          })
        }else{
          alert(res.data.message)
        }
      })
    }
  },
  beforeCreate() {
    debugger
    let ts = window.ts = this
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
