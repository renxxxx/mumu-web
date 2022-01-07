<template>
    <div id="_Account" style="width:100%;max-width:800px;position:absolute;top:0;bottom:0;background-color: #ffffff;font-size:0;
        left:50%;transform: translateX(-50%);box-sizing: border-box;">
        
        <div style="width:100%;height:40px;line-height:40px;border-bottom: 1px solid #e8e8e8;box-sizing: border-box;position: relative;">
            <span style="font-size:16px;width:40px;height:40px;text-align: center;cursor: pointer;display: inline-block;" @click="$routerr.back()">
                <template v-if="!$routerr.isFirst()" >
                    &lt;
                </template>
                <template v-else >
                    <img src='../assets/img/home.png' style="vertical-align: text-bottom;width: 50%;"/>
                </template>
            </span>
            <span style="font-size:16px;">账号</span>
        </div>
        <div style="height:40px;line-height:40px;border-bottom: 1px solid #dddddd;">
            <span style="display: inline-block;width:80px;font-size: 15px;padding:0 5px;box-sizing: border-box;">
                昵称
            </span>
            <span style="display:inline-block;width:calc(100% - 120px);font-size: 16px;padding:0 5px;box-sizing: border-box;">
                {{$store.login ? $store.login.nickname : ''}}
            </span>
            <span @click="toNickname=1" style="display:inline-block;width:40px;font-size: 16px;text-align: center;cursor: pointer;">
                &gt;
            </span>
        </div>
        <div style="height:40px;line-height: 40px;border-bottom: 1px solid #dddddd;">
            <span style="width:80px;text-align: left;display: inline-block;box-sizing: border-box;padding:0 5px;font-size: 16px;">
                头像
            </span>
            <span style="width:calc(100% - 120px);display: inline-block;box-sizing: border-box;padding:0 5px;">
                <img v-if="$store.login && $store.login.headImage" :src="$store.login.headImage" style="width:35px;height:35px;"/>
            </span>
            <span @click="toHeadImg=1;" style="width:40px;text-align: center;display: inline-block;box-sizing: border-box;
                font-size: 16px;cursor: pointer;">
                >
            </span>
        </div>
        <div style="height:40px;line-height:40px;border-bottom: 1px solid #dddddd;">
            <span style="display: inline-block;width:80px;font-size: 15px;padding:0 5px;box-sizing: border-box;">
                账号
            </span>
            <span style="display:inline-block;width:calc(100% - 120px);font-size: 16px;padding:0 5px;box-sizing: border-box;">
                {{$store.login ? $store.login.account : ''}}
            </span>
            <span @click="toAccount=1" style="display:inline-block;width:40px;font-size: 16px;text-align: center;cursor: pointer;">
                &gt;
            </span>
        </div>
        <div style="height:40px;line-height:40px;border-bottom: 1px solid #dddddd;">
            <span style="display: inline-block;width:80px;font-size: 15px;padding:0 5px;box-sizing: border-box;">
                手机
            </span>
            <span style="display:inline-block;width:calc(100% - 120px);font-size: 16px;padding:0 5px;box-sizing: border-box;">
                {{$store.login ? $store.login.phone : ''}}
            </span>
            <span @click="toPhone=1" style="display:inline-block;width:40px;font-size: 16px;text-align: center;cursor: pointer;">
                &gt;
            </span>
        </div>
        <div style="height:40px;line-height:40px;border-bottom: 1px solid #dddddd;">
            <span style="display: inline-block;width:80px;font-size: 15px;padding:0 5px;box-sizing: border-box;">
                密码
            </span>
            <span style="display:inline-block;width:calc(100% - 120px);font-size: 16px;padding:0 5px;box-sizing: border-box;">
                {{$store.login ? $store.login.password : ''}}
            </span>
            <span @click="toPassword=1" style="display:inline-block;width:40px;font-size: 16px;text-align: center;cursor: pointer;">
                &gt;
            </span>
        </div>
        <div style="height:40px;line-height:40px;border-bottom: 1px solid #dddddd;">
            <span style="display: inline-block;width:80px;font-size: 15px;padding:0 5px;box-sizing: border-box;">
                微信
            </span>
            <span style="display:inline-block;width:calc(100% - 120px);padding:0 5px;box-sizing: border-box;">
                <img v-if="wxAuthorization" :src="wxAuthorization.headImgUrl" 
                    style="display:inline-block;width:30px;height: 30px;" />
                <span style="display:inline-block;width:calc(100% - 35px);font-size: 16px;margin-left:5px;">
                    {{wxAuthorization ? wxAuthorization.nickname : ''}}
                </span>
            </span>
            <span @click="toWxAuth=1" style="display:inline-block;width:40px;font-size: 16px;text-align: center;cursor: pointer;">
                &gt;
            </span>
        </div>
        <div style="margin-top:20px;justify-content:flex-start;display: flex;flex-wrap:wrap;">
            <button style="font-size:16px;width:100px;height:35px;background-color: #838383;
                border: none;margin-right:10px">
                注销
            </button>
        </div>

        
        <div v-if="toNickname" style="position:absolute;width:100%;bottom:0;top:0;background-color: rgba(0, 0, 0, 0.5);">
            <div style="margin-top:20%;background-color: #ffffff;">
                <div style="font-size: 16px;text-align: center;height:40px;line-height:40px;">
                    修改昵称
                </div>
                <div style="line-height:40px;height:40px;">
                    <input v-model="nickname"  style="width:100%;display: inline-block;vertical-align: middle;font-size: 16px;box-sizing: border-box;
                        border:1px solid #000000;border-width:1px 0 1px 0;padding:0 3px;height:40px;text-align: center;box-shadow: inset 0 0 1px 0px black;"/>
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

        <div v-if="toHeadImg" style="background-color: rgba(0, 0, 0, 0.7);position: absolute;top:0;bottom:0;left:0;right:0;">
            <div style="margin-top: 20%;background-color: #ffffff;">
                <div style="height:40px;line-height: 40px;text-align: center;font-size: 16px;border-bottom: 1px solid #cccccc;">
                    修改头像
                </div>
                <div style="height:40px;margin:10px 0;text-align: center;">
                    <span v-if="!headImage" @click="chooseNewHeadImg" style="font-size:16px;display:inline-block;width:40px;vertical-align: middle;height:40px;line-height: 40px;
                        cursor: pointer;border: 1px dashed #838383;text-align: center;box-sizing: border-box;">
                        +
                    </span>
                    <img v-if="headImage"  :src="headImage" style="width:40px;height:40px;display:inline-block;vertical-align: middle;cursor: pointer;"/>
                    <span v-if="headImage" @click="deleteHeadImg" style="font-size:16px;display:inline-block;padding:0 5px;vertical-align: middle;height:40px;line-height: 40px;
                        cursor: pointer;">
                        X
                    </span>
                </div>
                <div style="height:40px;width:100%;">
                    <button @click="modifyHeadImg" style="display: inline-block;height:40px;line-height: 40px;width:50%;font-size:16px;border:1px solid #838383;border-left:0;
                        cursor: pointer;">
                        确定
                    </button>
                    <button @click="toHeadImg=0" style="display: inline-block;height:40px;line-height: 40px;width:50%;font-size:16px;border:1px solid #838383;border-right:0;
                        cursor: pointer;">
                        取消
                    </button>
                </div>
            </div>
        </div>

        <div v-if="toAccount" style="position:absolute;width:100%;bottom:0;top:0;background-color: rgba(0, 0, 0, 0.5);">
            <div style="margin-top:20%;background-color: #ffffff;">
                <div style="font-size: 16px;text-align: center;height:40px;line-height:40px;">
                    修改账号
                </div>
                <div style="line-height:40px;height:40px;">
                    <span style="display:inline-block;font-size: 16px;vertical-align: middle;text-align: left;width:30%;
                        box-sizing: border-box;text-align: center;">
                        原账号
                    </span>
                    <span style="width:70%;display: inline-block;vertical-align: middle;font-size: 16px;box-sizing: border-box;padding:0 3px;height:40px;">
                        {{$store.login.account}}
                    </span>
                </div>
                <div style="line-height:40px;height:40px;margin-top: 10px;">
                    <span style="display:inline-block;font-size: 16px;vertical-align: middle;text-align: left;width:30%;
                        box-sizing: border-box;text-align: center;">
                        新账号
                    </span>
                    <input v-model="account"  style="width:70%;display: inline-block;vertical-align: middle;font-size: 16px;box-sizing: border-box;
                        border:1px solid #000000;border-right:none;padding:0 3px;height:40px;"/>
                </div>
                <div style="line-height:40px;height:40px;margin-top:10px;">
                    <span style="display:inline-block;font-size: 16px;vertical-align: middle;text-align: left;width:30%;
                        box-sizing: border-box;text-align: center;">
                        新账号确认
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
                    <span style="display:inline-block;font-size: 16px;vertical-align: middle;text-align: left;width:30%;
                        box-sizing: border-box;text-align: center;">
                        新密码
                    </span>
                    <input v-model="password"  style="width:70%;display: inline-block;vertical-align: middle;font-size: 16px;box-sizing: border-box;
                        border:1px solid #000000;border-right:none;padding:0 3px;height:35px;"/>
                </div>
                <div style="line-height:35px;height:35px;margin-top:10px;">
                    <span style="display:inline-block;font-size: 16px;vertical-align: middle;text-align: left;width:30%;
                        box-sizing: border-box;text-align: center;">
                        密码确认
                    </span>
                    <input v-model="passwordConfirm"  style="width:70%;display: inline-block;vertical-align: middle;font-size: 16px;box-sizing: border-box;
                        border:1px solid #000000;border-right:none;padding:0 3px;height:35px;"/>
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
                <div v-if='$store.login.phone' style="line-height:35px;height:35px;margin-top:10px;">
                    <span style="display:inline-block;font-size: 16px;vertical-align: middle;text-align: left;width:30%;
                        box-sizing: border-box;text-align: center;">
                        原手机号
                    </span>
                    <span style="width:70%;display: inline-block;vertical-align: middle;font-size: 16px;box-sizing: border-box;
                        padding:0 3px;height:35px;">
                        {{$store.login.phone}}
                    </span>
                </div>
                <div style="line-height:35px;height:35px;margin-top:10px;">
                    <span style="display:inline-block;font-size: 16px;vertical-align: middle;text-align: left;width:30%;
                        box-sizing: border-box;text-align: center;">
                        新手机号
                    </span>
                    <input v-model="phone"  style="width:70%;display: inline-block;vertical-align: middle;font-size: 16px;box-sizing: border-box;
                        border:1px solid #000000;border-right:none;padding:0 3px;height:35px;"/>
                </div>
                <div style="line-height:35px;height:35px;margin-top:10px;">
                    <span style="display:inline-block;font-size: 16px;width:70px;vertical-align: middle;width:30%;text-align: center;">
                        验证码
                    </span>
                    <input v-model="smsVcode" style="width:50%;display: inline-block;vertical-align: middle;font-size: 16px;box-sizing: border-box;
                        border:1px solid #000000;border-right:none;padding: 0 3px;height:35px;"/>
                    <span @click="sendSmsVcode" style="display: inline-block;width:20%;font-size: 16px;text-align: center;height:35px;
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
            toHeadImg:0,
            nickname:this.$store.login.nickname,
            account:null,
            accountConfirm:null,
            phone:null,
            headImage:this.$store.login.headImage,
            headImageFile:null,
            passwordMd5:null,
            passwordMd5Confirm:null,
            smsLimit:0,
            smsVcode:null,
            wxAuthorization:null,
        }
    },
    props: {
    },
    methods: {
        deleteHeadImg(){
            let ts = this
            ts.headImage=null;
            ts.headImageFile=null;
        },
        async modifyHeadImg(){
            let ts = this
            if(ts.$store.login.headImage==ts.headImage){
                ts.$notify({type:'success',message:'无修改'})
                ts.toHeadImg=0
                return;
            }
                
            if(ts.headImageFile){
                var formData = new FormData()
                formData.append('file',ts.headImageFile)
                await ts.$axios.post('/mumu/upload-file', formData, {
                    headers:{'Content-Type':'multipart/form-data'}
                }).then(res=>{
                    if(res.data.code==0){
                        ts.headImage = res.data.data.url
                    } else {
                        ts.$notify({message:res.data.message})
                    }
                })
            }
            await ts.$axios.post('/mumu/my-account/alter', ts.$qs.stringify({
                headImage: ts.headImage
            })).then(res=>{
                if(res.data.code==0){
                    ts.$notify({type:'success',message:'已修改'})
                    ts.$store.login.headImage=ts.headImage
                    ts.toHeadImg=0
                }else{
                    ts.$notify({message:res.data.message})
                }
            })
        },
        chooseNewHeadImg(){
            let ts = this
            ts.$$('<input type="file"/>').change(function(){
                let file=this.files[0]
                ts.headImageFile=file
                ts.headImage=URL.createObjectURL(file)
            }).click()
        },
        alterNickname(){
            ts.$axios.post('/mumu/my-account/alter',ts.$qs.stringify({nickname:ts.nickname})).then(function (res) {
                if(res.data.code == 0){
                    ts.$store.login.nickname = ts.nickname
                    ts.toNickname=0
                }else{
                    ts.$notify({type:'warning', message:res.data.message})
                }
            })
        },
        alterAccount(){
            if(ts.accountConfirm != ts.account){
                ts.$notify({message:'两次账号不一致'})
                return
            }
            ts.$axios.post('/mumu/my-account/alter-account',ts.$qs.stringify({account:ts.account})).then(function (res) {
                if(res.data.code == 0){
                    ts.$notify({ type: 'success', message: '修改成功', duration:1500});
                    ts.$store.login.account = ts.account
                    ts.toAccount=0
                }else if(res.data.code == 21){
                    ts.$store.doAuthentication=1
                }else{
                    ts.$notify({type:'warning', message:res.data.message})
                }
            })
        },
        alterPassword(){
            if(ts.password != ts.passwordConfirm){
                ts.$notify({type:'error', message:'两次密码不一致'})
                return
            }
            let passwordMd5=ts.password ? ts.$md5.hex_md5(ts.password) : null
            let passwordMd5Confirm=ts.passwordConfirm ? ts.$md5.hex_md5(ts.passwordConfirm) : null
            ts.$axios.post('/mumu/my-account/alter-password',ts.$qs.stringify({
                passwordMd5:passwordMd5,
                passwordMd5Confirm:passwordMd5Confirm
            }))
            .then(function (res) {
                if(res.data.code == 0){
                    ts.$notify({ type: 'success', message: '修改成功', duration:1500});
                    ts.$store.login.password = passwordMd5 ? "********" : null
                    ts.toPassword=0
                }else if(res.data.code == 21){
                    ts.$store.doAuthentication=1
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
                    ts.$notify({ type: 'success', message: '修改成功', duration:1500});
                    ts.$store.login.phone = ts.phone
                    ts.toPhone=0
                }else if(res.data.code == 21){
                    ts.$store.doAuthentication=1
                }else{
                    ts.$notify({type:'warning', message:res.data.message})
                }
            })
        },
        sendSmsVcode(){
            if(ts.smsLimit>0)
                return;
            ts.$axios.post("/mumu/send-sms-vcode").then(res=>{
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
    created() {
        let ts = this
        clearInterval(ts.smsLimitInterval)

        ts.$axios.post('/mumu/get-wx-authorization').then(function (res) {
            if(res.data.code == 0){
                ts.wxAuthorization = res.data.data.wxAuthorization
            }
        })
    },
    activated(){
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