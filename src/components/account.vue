<template>
    <div id="_Account" style="width:100%;max-width:800px;position:absolute;top:0;bottom:0;background-color: #ffffff;font-size:0;
        left:50%;transform: translateX(-50%);box-sizing: border-box;">
        
        <div style="height:40px;line-height:40px;position: relative;border-bottom:1px solid #dddddd;">
            <span @click="$routerr.back()" style="font-size: 16px;font-weight: 500;display: inline-block;width:40px;text-align: center;cursor: pointer;">
                &lt;
            </span>
            <span style="font-size: 16px;display: inline-block;">
                账号
            </span>
        </div>
        <div style="height:40px;line-height:40px;border-bottom: 1px solid #dddddd;">
            <span class="line1" style="display: inline-block;width:80px;font-size: 15px;padding:0 5px;box-sizing: border-box;">
                昵称
            </span>
            <span class="line1" style="display:inline-block;width:calc(100% - 120px);font-size: 16px;padding:0 5px;box-sizing: border-box;">
                {{$store.login.nickname}}
            </span>
            <span @click="toNickname=1" style="display:inline-block;width:40px;font-size: 16px;text-align: center;cursor: pointer;">
                &gt;
            </span>
        </div>
        <div style="height:40px;line-height:40px;border-bottom: 1px solid #dddddd;">
            <span class="line1" style="display: inline-block;width:80px;font-size: 15px;padding:0 5px;box-sizing: border-box;">
                账号
            </span>
            <span class="line1" style="display:inline-block;width:calc(100% - 120px);font-size: 16px;padding:0 5px;box-sizing: border-box;">
                {{$store.login.account}}
            </span>
            <span @click="toAccount=1" style="display:inline-block;width:40px;font-size: 16px;text-align: center;cursor: pointer;">
                &gt;
            </span>
        </div>
        <div style="height:40px;line-height:40px;border-bottom: 1px solid #dddddd;">
            <span class="line1" style="display: inline-block;width:80px;font-size: 15px;padding:0 5px;box-sizing: border-box;">
                手机
            </span>
            <span class="line1" style="display:inline-block;width:calc(100% - 120px);font-size: 16px;padding:0 5px;box-sizing: border-box;">
                {{$store.login.phone}}
            </span>
            <span @click="toPhone=1" style="display:inline-block;width:40px;font-size: 16px;text-align: center;cursor: pointer;">
                &gt;
            </span>
        </div>
        <div style="height:40px;line-height:40px;border-bottom: 1px solid #dddddd;">
            <span class="line1" style="display: inline-block;width:80px;font-size: 15px;padding:0 5px;box-sizing: border-box;">
                密码
            </span>
            <span class="line1" style="display:inline-block;width:calc(100% - 120px);font-size: 16px;padding:0 5px;box-sizing: border-box;">
                {{$store.login.password}}
            </span>
            <span @click="toPassword=1" style="display:inline-block;width:40px;font-size: 16px;text-align: center;cursor: pointer;">
                &gt;
            </span>
        </div>
        <div style="margin-top:30px;padding:0 5px;">
            <div style="width:100px;height:35px;line-height:35px;text-align: center;font-size: 16px;border: 1px solid #b4b4b4;
                background-color: #c5c5c5;">
                注销
            </div>
        </div>

        
        <div v-if="toNickname" style="position:absolute;width:100%;bottom:0;top:0;background-color: rgba(0, 0, 0, 0.5);">
            <div style="margin-top:20%;background-color: #ffffff;">
                <div style="font-size: 16px;text-align: center;height:40px;line-height:40px;">
                    修改昵称
                </div>
                <div style="line-height:40px;height:40px;">
                    <span class="line1" style="display:inline-block;font-size: 16px;vertical-align: middle;text-align: left;width:30%;
                        box-sizing: border-box;text-align: center;">
                        昵称
                    </span>
                    <input v-model="nickname"  style="width:70%;display: inline-block;vertical-align: middle;font-size: 16px;box-sizing: border-box;
                        border:1px solid #000000;border-right:none;padding:0 3px;height:40px;"/>
                </div>
                <div style="line-height:45px;height:45px;text-align: center;margin-top:40px;border-style: solid;border-color: #c7c7c7;border-width: 1px 0;">
                    <span @click="alterNickname" style="display:inline-block;font-size: 16px;cursor: pointer;width:70%;background-color: rgb(0,204,126);color:rgb(250,250,250);">
                        确认
                    </span>
                    <span @click="toNickname=0" style="display:inline-block;font-size: 16px;cursor: pointer;width:30%;background-color: rgb(214,214,214);">
                        取消
                    </span>
                </div>
            </div>
        </div>

        <div v-if="toAccount" style="position:absolute;width:100%;bottom:0;top:0;background-color: rgba(0, 0, 0, 0.5);">
            <div style="margin-top:20%;background-color: #ffffff;">
                <div style="font-size: 16px;text-align: center;height:40px;line-height:40px;">
                    修改账号
                </div>
                <div style="line-height:40px;height:40px;">
                    <span class="line1" style="display:inline-block;font-size: 16px;vertical-align: middle;text-align: left;width:30%;
                        box-sizing: border-box;text-align: center;">
                        账号
                    </span>
                    <input v-model="account"  style="width:70%;display: inline-block;vertical-align: middle;font-size: 16px;box-sizing: border-box;
                        border:1px solid #000000;border-right:none;padding:0 3px;height:40px;"/>
                </div>
                <div style="line-height:40px;height:40px;margin-top:10px;">
                    <span class="line1" style="display:inline-block;font-size: 16px;vertical-align: middle;text-align: left;width:30%;
                        box-sizing: border-box;text-align: center;">
                        账号确认
                    </span>
                    <input v-model="accountConfirm"  style="width:70%;display: inline-block;vertical-align: middle;font-size: 16px;box-sizing: border-box;
                        border:1px solid #000000;border-right:none;padding:0 3px;height:40px;"/>
                </div>
                <div style="line-height:45px;height:45px;text-align: center;margin-top:40px;border-style: solid;border-color: #c7c7c7;border-width: 1px 0;">
                    <span @click="alterAccount" style="display:inline-block;font-size: 16px;cursor: pointer;width:70%;background-color: rgb(0,204,126);color:rgb(250,250,250);">
                        确认
                    </span>
                    <span @click="toAccount=0" style="display:inline-block;font-size: 16px;cursor: pointer;width:30%;background-color: rgb(214,214,214);">
                        取消
                    </span>
                </div>
            </div>
        </div>

        <div v-if="toPassword" style="position:absolute;width:100%;bottom:0;top:0;background-color: rgba(0, 0, 0, 0.5);">
            <div style="margin-top:20%;background-color: #ffffff;">
                <div style="font-size: 16px;text-align: center;height:40px;line-height:40px;">
                    修改密码
                </div>
                <div style="line-height:35px;height:35px;">
                    <span class="line1" style="display:inline-block;font-size: 16px;vertical-align: middle;text-align: left;width:30%;
                        box-sizing: border-box;text-align: center;">
                        密码
                    </span>
                    <input v-model="password"  style="width:70%;display: inline-block;vertical-align: middle;font-size: 16px;box-sizing: border-box;
                        border:1px solid #000000;border-right:none;padding:0 3px;height:35px;"/>
                </div>
                <div style="line-height:35px;height:35px;margin-top:10px;">
                    <span class="line1" style="display:inline-block;font-size: 16px;vertical-align: middle;text-align: left;width:30%;
                        box-sizing: border-box;text-align: center;">
                        密码确认
                    </span>
                    <input v-model="passwordConfirm"  style="width:70%;display: inline-block;vertical-align: middle;font-size: 16px;box-sizing: border-box;
                        border:1px solid #000000;border-right:none;padding:0 3px;height:35px;"/>
                </div>
                <div style="line-height:35px;height:35px;margin-top:10px;">
                    <span class="line1" style="display:inline-block;font-size: 16px;vertical-align: middle;width:30%;
                        box-sizing: border-box;text-align: center;">
                        手机号
                    </span>
                    <span class="line1" style="width:70%;display: inline-block;font-size: 16px;box-sizing: border-box;padding: 0 3px;height:35px;">
                        {{$store.login.phone}}
                    </span>
                </div>
                <div style="line-height:35px;height:35px;margin-top:10px;">
                    <span class="line1" style="display:inline-block;font-size: 16px;width:70px;vertical-align: middle;width:30%;text-align: center;">
                        验证码
                    </span>
                    <input v-model="smsVcode" style="width:50%;display: inline-block;vertical-align: middle;font-size: 16px;box-sizing: border-box;
                        border:1px solid #000000;border-right:none;padding: 0 3px;height:35px;"/>
                    <span @click="sendSmsVcodeToMe" class="line1" style="display: inline-block;width:20%;font-size: 16px;text-align: center;height:35px;
                        border-style: solid;border-color: #000000;border-width: 1px 0 1px 1px;box-sizing: border-box;cursor: pointer;vertical-align: middle;">
                        {{ smsLimit==0? '发送' : smsLimit}}
                    </span>
                </div>
                <div style="line-height:45px;height:45px;text-align: center;margin-top:40px;border-style: solid;border-color: #c7c7c7;border-width: 1px 0;">
                    <span @click="alterPassword" style="display:inline-block;font-size: 16px;cursor: pointer;width:70%;background-color: rgb(0,204,126);color:rgb(250,250,250);">
                        确认
                    </span>
                    <span @click="toPassword=0" style="display:inline-block;font-size: 16px;cursor: pointer;width:30%;background-color: rgb(214,214,214);">
                        取消
                    </span>
                </div>
            </div>
        </div>

        <div v-if="toPhone" style="position:absolute;width:100%;bottom:0;top:0;background-color: rgba(0, 0, 0, 0.5);">
            <div style="margin-top:20%;background-color: #ffffff;">
                <div style="font-size: 16px;text-align: center;height:40px;line-height:40px;">
                    修改手机号
                </div>
                <div style="line-height:35px;height:35px;">
                    <span class="line1" style="display:inline-block;font-size: 16px;vertical-align: middle;text-align: left;width:30%;
                        box-sizing: border-box;text-align: center;">
                        密码
                    </span>
                    <input v-model="password"  style="width:70%;display: inline-block;vertical-align: middle;font-size: 16px;box-sizing: border-box;
                        border:1px solid #000000;border-right:none;padding:0 3px;height:35px;"/>
                </div>
                <div style="line-height:35px;height:35px;margin-top:10px;">
                    <span class="line1" style="display:inline-block;font-size: 16px;vertical-align: middle;text-align: left;width:30%;
                        box-sizing: border-box;text-align: center;">
                        手机号
                    </span>
                    <input v-model="phone"  style="width:70%;display: inline-block;vertical-align: middle;font-size: 16px;box-sizing: border-box;
                        border:1px solid #000000;border-right:none;padding:0 3px;height:35px;"/>
                </div>
                <div style="line-height:35px;height:35px;margin-top:10px;">
                    <span class="line1" style="display:inline-block;font-size: 16px;width:70px;vertical-align: middle;width:30%;text-align: center;">
                        验证码
                    </span>
                    <input v-model="smsVcode" style="width:50%;display: inline-block;vertical-align: middle;font-size: 16px;box-sizing: border-box;
                        border:1px solid #000000;border-right:none;padding: 0 3px;height:35px;"/>
                    <span @click="sendSmsVcodeToMe" class="line1" style="display: inline-block;width:20%;font-size: 16px;text-align: center;height:35px;
                        border-style: solid;border-color: #000000;border-width: 1px 0 1px 1px;box-sizing: border-box;cursor: pointer;vertical-align: middle;">
                        {{ smsLimit==0? '发送' : smsLimit}}
                    </span>
                </div>
                <div style="line-height:45px;height:45px;text-align: center;margin-top:40px;border-style: solid;border-color: #c7c7c7;border-width: 1px 0;">
                    <span @click="alterPhone" style="display:inline-block;font-size: 16px;cursor: pointer;width:70%;background-color: rgb(0,204,126);color:rgb(250,250,250);">
                        确认
                    </span>
                    <span @click="toPhone=0" style="display:inline-block;font-size: 16px;cursor: pointer;width:30%;background-color: rgb(214,214,214);">
                        取消
                    </span>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'account',
    data() {
        return {
            toNickname:0,
            toAccount:0,
            toPassword:0,
            toPhone:0,
            nickname:this.$store.login.nickname,
            account:this.$store.login.account,
            accountConfirm:null,
            phone:this.$store.login.phone,
            password:null,
            passwordConfirm:null,
            smsLimit:0,
            smsVcode:null,
        }
    },
    props: {
    },
    methods: {
        alterNickname(){
            ts.$axios.post('/mumu/my-account/alter-nickname',ts.$qs.stringify({nickname:ts.nickname})).then(function (res) {
                if(res.data.code == 0){
                    ts.$store.login.nickname = ts.nickname
                    ts.toNickname=0
                }else{
                    ts.$notify({type:'warning', message:res.data.message})
                }
            })
        },
        alterAccount(){
            ts.$axios.post('/mumu/my-account/alter-account',ts.$qs.stringify({account:ts.account,accountConfirm:ts.accountConfirm})).then(function (res) {
                if(res.data.code == 0){
                    ts.$store.login.account = ts.account
                    ts.toAccount=0
                }else{
                    ts.$notify({type:'warning', message:res.data.message})
                }
            })
        },
        alterPassword(){
            if(!ts.$store.login.phone){
                ts.$notify({type:'warning', message:'请先设置手机号'})
                return
            }
            let passwordMd5=ts.password ? ts.$md5.hex_md5(ts.password) : null
            let passwordMd5Confirm=ts.passwordConfirm ? ts.$md5.hex_md5(ts.passwordConfirm) : null
            ts.$axios.post('/mumu/my-account/alter-password',ts.$qs.stringify({
                passwordMd5:passwordMd5,
                passwordMd5Confirm:passwordMd5Confirm,
                smsVcode:ts.smsVcode}))
            .then(function (res) {
                if(res.data.code == 0){
                    ts.$store.login.password = passwordMd5 ? "********" : null
                    ts.toPassword=0
                }else{
                    ts.$notify({type:'warning', message:res.data.message})
                }
            })
        },
        alterPhone(){
            let passwordMd5=ts.password ? ts.$md5.hex_md5(ts.password) : null
            ts.$axios.post('/mumu/my-account/alter-phone',ts.$qs.stringify({
                passwordMd5:passwordMd5,
                phone:ts.phone,
                smsVcode:ts.smsVcode}))
            .then(function (res) {
                if(res.data.code == 0){
                    ts.$store.login.phone = ts.phone
                    ts.toPhone=0
                }else{
                    ts.$notify({type:'warning', message:res.data.message})
                }
            })
        },
        sendSmsVcodeToMe(){
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
    },
    beforeCreate() {
        
        let ts = this
        clearInterval(ts.smsLimitInterval)
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>