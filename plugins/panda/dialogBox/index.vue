<style lang="scss" scoped>
//样式类型，pc.scss 和 mobile.scss
@import "./mobile.scss";
</style>


<template>
  <div class="dialog_box">
    <!-- 半透明背景 -->
    <div class="dialog_bg" v-show="showDialog" @click="bgClick"></div>
    <!-- 弹窗模块 -->
    <div class="dialog" :class="{'dialogMaxH':maxHeight}" v-show="showDialog" :style="{width:(/px|\%/.test(width)?width:width+'px'),height:height}" ref="dialog">
      <!-- ,left:'calc(100vw - '+dialogW+')' -->
      <!-- 头部信息 -->
      <div class="dialog_header" v-if="title">{{title}}</div>
      <!-- 弹窗内容 -->
      <div class="dialog_content" :class="{'dialog_content_max':(!confirmShow && !cancelShow)}" ref="dialogContent">
        <slot></slot>
      </div>
      <!-- 弹窗底部 -->
      <div class="dialog_footer" v-if="confirmShow || cancelShow">
        <span class="dialog_confirm" v-if="confirmShow" @click="confirm">{{confirmText?confirmText:'Confirm'}}</span>
        <span class="dialog_cancel" v-if="cancelShow" @click="cancel">{{cancelText?cancelText:'Cancel'}}</span>
      </div>
      <!-- 关闭按钮 -->
      <div class="dialog_close iconfont" v-if="!hideClose" @click="close">&#xe606;</div>
    </div>
  </div>
</template>

<script>
	export default {
    name: "dialogBox",
    props:{
      title: String,
      confirmShow: String,
      confirmText: String,
      cancelShow: String,
      cancelText: String,
      value: Boolean,
      width: String,
      height:String,
      bgNoClick:Boolean,
      hideClose:Boolean
    },
		data() {
			return {
        showDialog:this.value?this.value:false,
        maxHeight:false,
        bodyScrollTop:0,
        dialogW:this.width
			}
    },
    computed:{
      
    },
		methods: {
      confirm(){
        var self = this;
        this.$emit('confirmCallback');
        //关闭弹窗自动，后退页面
        history.back();
      },
      cancel(){
        var self = this;
        this.$emit('cancelCallback');
        //关闭弹窗自动，后退页面
        history.back();
      },
      close(){
        this.$emit('closeCallback');
        this.showDialog = false;
        //关闭弹窗自动，后退页面
        history.back();
      },
      bgClick(){
        if(!this.bgNoClick){
          this.close();
        }
      },
      getW(str){
        if(/\%/.test(str)){
          return ((100-str.split('%')[0])/2*1 +str.split('%')[0]*1) + '%';
        }else if(/px/.test(str)){
          var winW = document.documentElement.clientWidth;
          return ((winW-str.split('px')[0])/2*1 + str.split('px')[0]*1) + 'px';
        }else{
          var winW = document.documentElement.clientWidth;
          return (winW-str)/2+str*1+'px';
        }
      }
		},
		mounted(){
      var self = this;

      // this.$refs.dialog.style.left = this.width;
			
      // this.dialogW = this.getW(this.width);

    },
    created() {
      
    },
    watch:{
      showDialog:function(val){
        this.$emit('input',val);
        if(val){
          //显示弹窗后，添加一个新页面记录。用于后退关闭弹窗
          history.pushState({
            'type':'showDialog'
          },'');
        }
      },
      value:function(val){
        this.showDialog = val;
        var $body = document.querySelector('body');
        //显示弹窗
        if(val){
          var scrollTop = (document.documentElement.scrollTop || document.body.scrollTop);
          $body.style.position = 'fixed';
          $body.style.width = '100vw';

          //是否有滑动高度，有就记录下来
          if(scrollTop){
            this.bodyScrollTop = scrollTop;
            $body.style.top = '-'+this.bodyScrollTop+'px';
          }
          this.$nextTick(() => {
            this.$refs.dialogContent.scrollTop = 0;
          });
        }else{//关闭弹窗
          $body.style.position = 'inherit';
          $body.style.width = 'auto';
          $body.style.top = 'auto';
          //显示弹窗的时候有记录滑动高度，关闭后移动到对应位置
          if(this.bodyScrollTop){
            this.$nextTick(() => {
              window.scrollTo(0,this.bodyScrollTop);
            });
          }
          
        }
      }
    }
	}
</script>
