<template>
    <div id="m_Login" style="width:100%;background-color: rgba(0, 0, 0, 0.5);
        position:absolute;top:0;bottom:0;font-size:0;">
        <div style="max-width: 700px;background-color: #ffffff;margin:auto;margin-top:50px;border-radius: 2px;position: relative;">
            <div style="height:40px;line-height:40px;text-align: center;font-size: 16px;border-bottom: 1px solid #000000;">
                登录
            </div>
            <div style="line-height:50px;height:50px;border-bottom: 1px solid #000000;text-align: center;box-sizing: border-box;overflow: unset;">
                <span @click="way='account'" style="font-size: 16px;border-right:1px solid #000000;border-left:1px solid #000000;padding:0 20px;
                    background-color: #ffffff;cursor: pointer;display: inline-block;height:50px;box-sizing: border-box;" 
                    :style="{
                      'border-bottom':way=='account'?'none':'1px solid #000000',
                      'background-color':way=='account'?'#ffffff':'#cccccc'
                    }">
                    账号
                </span>
                <span @click="way='sms'" style="font-size: 16px;border-right:1px solid #000000;padding:0 20px;background-color: #ffffff;
                    cursor: pointer;display: inline-block;height:50px;box-sizing: border-box;" 
                    :style="{
                      'border-bottom':way=='sms'?'none':'1px solid #000000',
                      'background-color':way=='sms'?'#ffffff':'#cccccc'
                    }">
                    短信
                </span>
                <span @click="way='loginCode'" style="font-size: 16px;border-right:1px solid #000000;padding:0 20px;background-color: #ffffff;
                    cursor: pointer;display: inline-block;height:50px;box-sizing: border-box;" 
                    :style="{
                      'border-bottom':way=='loginCode'?'none':'1px solid #000000',
                      'background-color':way=='loginCode'?'#ffffff':'#cccccc'
                    }">
                    登录码
                  </span>
            </div>
            <div v-if="way=='account'" style="margin-top:50px;">
                <div style="line-height:35px;height:35px;">
                    <span style="display:inline-block;font-size: 16px;vertical-align: middle;text-align: left;width:30%;
                        box-sizing: border-box;text-align: center;">
                        账号
                    </span>
                    <input v-model="account"  style="width:70%;display: inline-block;vertical-align: middle;font-size: 16px;box-sizing: border-box;
                        border:1px solid #000000;border-right:none;padding:0 3px;height:35px;" placeholder="账号/手机"/>
                </div>
                <div style="line-height:35px;height:35px;margin-top:15px;">
                    <span style="display:inline-block;font-size: 16px;width:70px;vertical-align: middle;text-align: left;width:30%;text-align: center;">
                        密码
                    </span>
                    <input v-model="password" type="password" style="width:70%;display: inline-block;vertical-align: middle;font-size: 16px;box-sizing: border-box;
                        border:1px solid #000000;border-right:none;padding:0 3px;height:35px;"/>
                </div>
                <div style="line-height:45px;height:45px;text-align: center;margin-top:40px;border-style: solid;border-color: #c7c7c7;border-width: 1px 0;">
                    <button @click="loginByPassword" style="border: none;padding: 0;display:inline-block;font-size: 16px;cursor: pointer;width:70%;background-color: rgb(0,204,126);color:rgb(250,250,250);">
                        登录
                    </button>
                    <button @click="$store.doLogin=0" style="border: none;padding: 0;display:inline-block;font-size: 16px;cursor: pointer;width:30%;background-color: rgb(214,214,214);">
                        取消
                    </button>
                </div>
                <div style="font-size: 14px;height:30px;line-height: 30px;text-align: center;color: #9e9e9e;">
                    登录即注册
                </div>
            </div>
            
            <div v-if="way=='sms'" style="margin-top:50px;">
                <div style="line-height:35px;height:35px;">
                    <span style="display:inline-block;font-size: 16px;vertical-align: middle;width:30%;
                        box-sizing: border-box;text-align: center;">
                        手机号
                    </span>
                    <input v-model="phone"  style="width:70%;display: inline-block;vertical-align: middle;font-size: 16px;box-sizing: border-box;
                        border:1px solid #000000;border-right:none;padding: 0 3px;height:35px;"/>
                </div>
                <div style="line-height:35px;height:35px;margin-top:15px;">
                    <span style="display:inline-block;font-size: 16px;width:70px;vertical-align: middle;width:30%;text-align: center;">
                        验证码
                    </span>
                    <input v-model="smsVcode" style="width:50%;display: inline-block;vertical-align: middle;font-size: 16px;box-sizing: border-box;
                        border:1px solid #000000;border-right:none;padding: 0 3px;height:35px;"/>
                    <span @click="sendSmsVcode" style="display: inline-block;width:20%;font-size: 16px;text-align: center;vertical-align: middle;
                        border-style: solid;border-color: #000000;border-width: 1px 0 1px 1px;box-sizing: border-box;cursor: pointer;height:35px;">
                        {{ smsLimit==0? '发送' : smsLimit}}
                    </span>
                </div>
                <div style="line-height:45px;height:45px;text-align: center;margin-top:40px;border-style: solid;border-color: #c7c7c7;border-width: 1px 0;">
                    <span @click="loginBySms" style="display:inline-block;font-size: 16px;cursor: pointer;width:70%;background-color: rgb(0,204,126);color:rgb(250,250,250);">
                        登录
                    </span>
                    <span @click="$store.doLogin=0" style="display:inline-block;font-size: 16px;cursor: pointer;width:30%;background-color: rgb(214,214,214);">
                        取消
                    </span>
                </div>
                <div style="font-size: 14px;height:30px;line-height: 30px;text-align: center;color: #9e9e9e;">
                    登录即注册
                </div>
            </div>
            <div v-if="way=='loginCode'" style="margin-top:50px;">
                <div style="line-height:35px;height:35px;">
                    <span style="display:inline-block;font-size: 16px;vertical-align: middle;width:30%;
                        box-sizing: border-box;text-align: center;">
                        登录码
                    </span>
                    <input v-model="loginCode"  style="width:70%;display: inline-block;vertical-align: middle;font-size: 16px;box-sizing: border-box;
                        border:1px solid #000000;border-right:none;padding: 0 3px;height:35px;"/>
                </div>
                <div style="line-height:45px;height:45px;text-align: center;margin-top:40px;border-style: solid;border-color: #c7c7c7;border-width: 1px 0;">
                    <span @click="loginByLoginCode" style="display:inline-block;font-size: 16px;cursor: pointer;width:70%;background-color: rgb(0,204,126);color:rgb(250,250,250);">
                        登录
                    </span>
                    <span @click="$store.doLogin=0" style="display:inline-block;font-size: 16px;cursor: pointer;width:30%;background-color: rgb(214,214,214);">
                        取消
                    </span>
                </div>
            </div>
            <div style="height:40px;text-align: center;margin-top:20px;margin-bottom: 10px;">
                <img src="../../assets/img/wx.png" style="width:40px;cursor: pointer;"/>
                <img src="../../assets/img/qq.png" style="width:40px;margin-left:20px;cursor: pointer;"/>
            </div>
        </div>

        <div v-if='toNewAccountConfirm' style="width:100%;background-color: rgba(0, 0, 0, 0.7);position:absolute;top:0;bottom:0;font-size:0;">
            <div style="max-width: 700px;background-color: #ffffff;margin:auto;margin-top:50px;border-radius: 2px;position: relative;">
                <div style="height:40px;line-height:40px;text-align: center;font-size: 16px;border-bottom: 1px solid #000000;">
                    新账号确认
                </div>
                <div style="font-size: 15px;text-align: center;height:30px;line-height: 30px;color: #868686;margin-top: 10px;box-sizing: border-box;
                    padding:0 5px;">
                    你输入的是一个新账号, 将会自动注册, 请再次输入以确认.
                </div>
                <div v-if="way=='account'" style="margin-top:30px;">
                    <div style="line-height:35px;height:35px;">
                        <span style="display:inline-block;font-size: 16px;vertical-align: middle;text-align: left;width:30%;
                            box-sizing: border-box;text-align: center;">
                            账号确认
                        </span>
                        <input v-model="newAccountConfirm"  style="width:70%;display: inline-block;vertical-align: middle;font-size: 16px;box-sizing: border-box;
                            border:1px solid #000000;border-right:none;padding:0 3px;" />
                    </div>
                    <div style="line-height:35px;height:35px;margin-top:15px;">
                        <span style="display:inline-block;font-size: 16px;width:70px;vertical-align: middle;text-align: left;width:30%;text-align: center;">
                            密码确认
                        </span>
                        <input v-model="newPasswordConfirm" type="password" style="width:70%;display: inline-block;vertical-align: middle;font-size: 16px;box-sizing: border-box;
                            border:1px solid #000000;border-right:none;padding:0 3px;"/>
                    </div>
                    <div style="line-height:45px;height:45px;text-align: center;margin-top:40px;border-style: solid;border-color: #c7c7c7;border-width: 1px 0;">
                        <button @click="newAccountLoginByPassword" style="border: none;padding: 0;display:inline-block;font-size: 16px;cursor: pointer;width:70%;background-color: rgb(0,204,126);color:rgb(250,250,250);">
                            确认
                        </button>
                        <button @click="toNewAccountConfirm=0" style="border: none;padding: 0;display:inline-block;font-size: 16px;cursor: pointer;width:30%;background-color: rgb(214,214,214);">
                            取消
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>

    
</template>

<script>
export default {
    name: 'login',
    data() {
        return {
            account:null,
            password:null,
            newAccountConfirm:null,
            newPasswordConfirm:null,
            loginCode:null,
            phone:null,
            smsVcode:null,
            way:'account',
            smsLimit:0,
            smsLimitInterval:null,
            toNewAccountConfirm:0,
        }
    },
    props: {
    },
    methods:{
        async loginByPassword(){
            let ts = this
            if(!ts.account){
                ts.$notify({ message: '请输入账号', duration:1500});
                return
            }
            if(!ts.password){
                ts.$notify({ message: '请输入密码', duration:1500});
                return
            }

            let exist = 0;
            await ts.$axios.post('/mumu/account-is-exist',ts.$qs.stringify({account:ts.account})).then(function (res) {
                if(res.data.code == 0){
                    exist=res.data.data.exist
                }
            })
            if(exist == 0){
                ts.toNewAccountConfirm=1
            }else{
                ts.$axios.post('/mumu/login-by-password',ts.$qs.stringify({account:ts.account,passwordMd5:ts.$md5.hex_md5(ts.password)})).then(function (res) {
                    if(res.data.code==0){
                        ts.$axios.post('/mumu/login-refresh').then(function (res) {
                            if(res.data.code==0){
                                ts.$notify({ type: 'success', message: '登录成功', duration:1500, onClose(){
                                    ts.$store.doLogin=0
                                    ts.$store.login=res.data.data
                                    ts.$router.reload()
                                }});
                            }else{
                                ts.$notify({ message: res.data.message, duration:1500});
                            }
                        })
                    }else{
                        ts.$notify({ message: res.data.message, duration:1500});
                    }
                })
            }
        },
        async newAccountLoginByPassword(){
            let ts = this
            if(ts.account != ts.newAccountConfirm){
                ts.$notify({ message: '两次账号输入不一致', duration:1500});
                return
            }
            if(ts.password != ts.newPasswordConfirm){
                ts.$notify({ message: '两次密码输入不一致', duration:1500});
                return
            }
            ts.$axios.post('/mumu/login-by-password',ts.$qs.stringify({account:ts.account,passwordMd5:ts.$md5.hex_md5(ts.password)})).then(function (res) {
                if(res.data.code==0){
                    ts.$axios.post('/mumu/login-refresh').then(function (res) {
                        if(res.data.code==0){
                            ts.$notify({ type: 'success', message: '登录成功', duration:1500, onClose(){
                                ts.$store.doLogin=0
                                ts.$store.toNewAccountConfirm=0
                                ts.$store.login=res.data.data
                                ts.$router.reload()
                            }});
                        }else{
                            ts.$notify({ message: res.data.message, duration:1500});
                        }
                    })
                }else{
                    ts.$notify({ message: res.data.message, duration:1500});
                }
            })
        },
        loginByLoginCode(){
            let ts = this
            ts.$axios.post("/mumu/login-by-login-code",ts.$qs.stringify({loginCode:ts.loginCode})).then(res=>{
                if(res.data.code==0){
                ts.$axios.post('/mumu/login-refresh').then(function (res) {
                    if(res.data.code==0){
                        ts.$notify({ type: 'success', message: '登录成功', duration:1500, onClose(){
                            ts.$store.doLogin=0
                            ts.$store.login=res.data.data
                            ts.$router.reload()
                        }});
                    }else{
                        ts.$notify({ message: res.data.message, duration:1500});
                    }
                })
                }else{
                    ts.$notify({ message: res.data.message, duration:1500});
                }
            })
        },
        sendSmsVcode(){
            let ts = this
            if(ts.smsLimit>0)
                return;
            ts.$axios.post("/mumu/send-sms-vcode",ts.$qs.stringify({phone:ts.phone})).then(res=>{
                if(res.data.code==0){
                    ts.$notify({ type: 'success', message: '发送成功', duration:1500});
                    ts.smsLimit=60
                    ts.smsLimitInterval = setInterval(()=>{
                        ts.smsLimit--;
                        if(ts.smsLimit==0)
                        clearInterval(ts.smsLimitInterval)
                    },1000)
                }else{
                    ts.$notify({ message: res.data.message, duration:1500});
                }
            })
        },
        loginBySms(){
            let ts = this
            ts.$axios.post("/mumu/login-by-sms",ts.$qs.stringify({phone:ts.phone,smsVcode:ts.smsVcode})).then(res=>{
                if(res.data.code==0){
                ts.$axios.post('/mumu/login-refresh').then(function (res) {
                    if(res.data.code==0){
                        ts.$notify({ type: 'success', message: '登录成功', duration:1500, onClose(){
                            ts.$store.doLogin=0
                            ts.$store.login=res.data.data
                            ts.$router.reload()
                        }});
                    }else{
                        ts.$notify({ message: res.data.message, duration:1500});
                    }
                })
                }else{
                ts.$notify({ message: res.data.message, duration:1500});
                }
            })
        },
    },
    beforeCreate() {
        
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
