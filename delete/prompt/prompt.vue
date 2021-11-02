<template>
    <div style="width: 300px; border: 1px solid;position:absolute;top:50%;left:50%;transform: translate(-50%,-50%);background-color: #ffffff;">
        <div style="text-align: center; line-height: 40px">{{ title }}</div>
        <input type="text" v-model="input" style="width: 240px; margin: 0px 0 20px 30px; height: 30px" />
        <div style="overflow: hidden">
            <div style="float: left; text-align: center; width: 150px; line-height: 40px; border-top: 1px solid; border-right: 1px solid" @click="confirm(input)">确定</div>
            <div style="float: left; text-align: center; width: 149px; line-height: 40px; border-top: 1px solid" @click="cancel">取消</div>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        title: { type: String, default: '请输入' },
        confirm: { type: Function, default: () => () => {} },
        cancel: { type: Function, default: () => () => {} }
    },
    data() {
        return {
            input: null,
        };
    },
    methods: {
    }
};
</script>

<style scoped></style>
