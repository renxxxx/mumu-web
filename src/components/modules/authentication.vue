<template>
    <div id="m_Login" style="width:100%;background-color: rgba(0, 0, 0, 0.5);
        position:absolute;top:0;bottom:0;font-size:0;">
        <div style="max-width: 700px;background-color: #ffffff;margin:auto;margin-top:50px;border-radius: 2px;position: relative;">
            <div style="height:40px;line-height:40px;text-align: center;font-size: 16px;border-bottom: 1px solid #000000;">
                账号验证
            </div>
            <div style="line-height:50px;height:50px;border-bottom: 1px solid #000000;text-align: center;box-sizing: border-box;overflow: unset;">
                <span @click="way='account'" style="font-size: 16px;border-right:1px solid #000000;border-left:1px solid #000000;padding:0 20px;
                    background-color: #ffffff;cursor: pointer;display: inline-block;height:50px;box-sizing: border-box;" 
                    :style="{
                      'border-bottom':way=='account'?'none':'1px solid #000000',
                      'background-color':way=='account'?'#ffffff':'#cccccc'
                    }">
                    密码
                </span>
                <span @click="way='sms'" style="font-size: 16px;border-right:1px solid #000000;padding:0 20px;background-color: #ffffff;
                    cursor: pointer;display: inline-block;height:50px;box-sizing: border-box;" 
                    :style="{
                      'border-bottom':way=='sms'?'none':'1px solid #000000',
                      'background-color':way=='sms'?'#ffffff':'#cccccc'
                    }">
                    短信
                </span>
            </div>
            <div v-if="way=='account'" style="margin-top:50px;">
                <div style="line-height:35px;height:35px;">
                    <span style="display:inline-block;font-size: 16px;vertical-align: middle;text-align: left;width:30%;
                        box-sizing: border-box;text-align: center;">
                        账号
                    </span>
                    <span style="width:70%;display: inline-block;vertical-align: middle;font-size: 16px;box-sizing: border-box;padding:0 3px;height:35px;">
                        {{$store.login.account}}
                    </span>
                </div>
                <div style="line-height:35px;height:35px;margin-top:15px;">
                    <span style="display:inline-block;font-size: 16px;width:70px;vertical-align: middle;text-align: left;width:30%;text-align: center;">
                        密码
                    </span>
                    <input v-model="password" type="password" style="width:70%;display: inline-block;vertical-align: middle;font-size: 16px;box-sizing: border-box;
                        border:1px solid #000000;border-right:none;padding:0 3px;height:35px;"/>
                </div>
                <div style="line-height:45px;height:45px;text-align: center;margin-top:40px;border-style: solid;border-color: #c7c7c7;border-width: 1px 0;">
                    <button @click="authenticationByPassword" style="border: none;padding: 0;display:inline-block;font-size: 16px;cursor: pointer;width:70%;background-color: rgb(0,204,126);color:rgb(250,250,250);">
                        确定
                    </button>
                    <button @click="$store.doAuthentication=0" style="border: none;padding: 0;display:inline-block;font-size: 16px;cursor: pointer;width:30%;background-color: rgb(214,214,214);">
                        取消
                    </button>
                </div>
            </div>
            
            <div v-if="way=='sms'" style="margin-top:50px;">
                <div style="line-height:35px;height:35px;">
                    <span style="display:inline-block;font-size: 16px;vertical-align: middle;width:30%;
                        box-sizing: border-box;text-align: center;">
                        手机号
                    </span>
                    <span style="width:70%;display: inline-block;vertical-align: middle;font-size: 16px;box-sizing: border-box;padding:0 3px;height:35px;">
                        {{$store.login.phone}}
                    </span>
                </div>
                <div style="line-height:35px;height:35px;margin-top:15px;">
                    <span style="display:inline-block;font-size: 16px;width:70px;vertical-align: middle;width:30%;text-align: center;">
                        验证码
                    </span>
                    <input v-model="smsVcode" style="width:50%;display: inline-block;vertical-align: middle;font-size: 16px;box-sizing: border-box;
                        border:1px solid #000000;border-right:none;padding: 0 3px;height:35px;"/>
                    <span @click="sendSmsVcodeToMe" style="display: inline-block;width:20%;font-size: 16px;text-align: center;vertical-align: middle;
                        border-style: solid;border-color: #000000;border-width: 1px 0 1px 1px;box-sizing: border-box;cursor: pointer;height:35px;">
                        {{ smsLimit==0? '发送' : smsLimit}}
                    </span>
                </div>
                <div style="line-height:45px;height:45px;text-align: center;margin-top:40px;border-style: solid;border-color: #c7c7c7;border-width: 1px 0;">
                    <span @click="authenticationBySms" style="display:inline-block;font-size: 16px;cursor: pointer;width:70%;background-color: rgb(0,204,126);color:rgb(250,250,250);">
                        确定
                    </span>
                    <span @click="$store.doAuthentication=0" style="display:inline-block;font-size: 16px;cursor: pointer;width:30%;background-color: rgb(214,214,214);">
                        取消
                    </span>
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
            password:null,
            smsVcode:null,
            way:'account',
            smsLimit:0,
            smsLimitInterval:null,
        }
    },
    props: {
    },
    methods:{
        async authenticationByPassword(){
            let ts = this
            if(!ts.password){
                ts.$notify({ message: '请输入密码', duration:1500});
                return
            }
            ts.$axios.post('/mumu/my-account/authentication-by-password',ts.$qs.stringify({passwordMd5:ts.$md5.hex_md5(ts.password)}))
            .then(function (res) {
                if(res.data.code==0){
                    ts.$notify({ type: 'success', message: '验证成功', duration:1500});
                    ts.$store.doAuthentication=0
                }else{
                    ts.$notify({ message: res.data.message, duration:1500});
                }
            })
        },
        sendSmsVcodeToMe(){
            let ts = this
            if(ts.smsLimit>0)
                return;
            ts.$axios.post("/mumu/send-sms-vcode-to-me").then(res=>{
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
        authenticationBySms(){
            let ts = this
            ts.$axios.post("/mumu/my-account/authentication-by-sms",ts.$qs.stringify({vcode:ts.smsVcode})).then(res=>{
                if(res.data.code==0){
                    ts.$axios.post('/mumu/login-refresh').then(function (res) {
                        if(res.data.code==0){
                            ts.$notify({ type: 'success', message: '验证成功', duration:1500});
                            ts.$store.doAuthentication=0
                        }else{
                            ts.$notify({ message: res.data.message, duration:1500});
                        }
                    })
                }
            })
        }
    },
    activated() {
        let ts = this
        ts.prevTs = window.ts
        window.ts = ts
    },
    deactivated(){
        let ts = this
        window.ts = ts.prevTs
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
