<style lang="scss" scoped>
//样式类型，pc.scss 和 mobile.scss
@import "./mobile.scss";
</style>


<template>
  <div class="dialog_box">
    <!-- 半透明背景 -->
    <div class="dialog_bg" v-show="showDialog" @click="bgClick"></div>
    <!-- 弹窗模块 -->
    <div class="dialog" :class="{'dialogMaxH':maxHeight}" v-show="showDialog" :style="{width:width}">
      <!-- 头部信息 -->
      <div class="dialog_header" v-if="title">{{title}}</div>
      <!-- 弹窗内容 -->
      <div class="dialog_content" ref="dialogContent">
        <slot></slot>
      </div>
      <!-- 弹窗底部 -->
      <div class="dialog_footer" v-if="confirmShow || cancelShow">
        <span class="dialog_confirm" v-if="confirmShow" @click="confirm">{{confirmText?confirmText:'Confirm'}}</span>
        <span class="dialog_cancel" v-if="cancelShow" @click="cancel">{{cancelText?cancelText:'Cancel'}}</span>
      </div>
      <!-- 关闭按钮 -->
      <div class="dialog_close iconfont" @click="close">&#xe606;</div>
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
      width: String
    },
		data() {
			return {
        showDialog:this.value?this.value:false,
        maxHeight:false
			}
    },
    computed:{
      
    },
		methods: {
      confirm(){
        var self = this;
        this.$emit('confirmCallback');
      },
      cancel(){
        var self = this;
        this.$emit('cancelCallback');
      },
      close(){
        this.$emit('closeCallback');
        this.showDialog = false;
      },
      bgClick(){
        //this.close();
      },
      setTop(){
        var self = this;
        // var top = document.documentElement.scrollTop || document.body.scrollTop;
        // var $body = document.querySelector('body');
        // $body.style.position = 'absolute';
        // $body.style.top = top+'px';
        // this.$nextTick(function(){
        //   var $dialog = self.$el.childNodes[1];
        //   var dialogH = $dialog.clientHeight,
        //     winH = window.innerHeight,
        //     top = document.documentElement.scrollTop || document.body.scrollTop;
        //   if(dialogH>winH){
        //     self.maxHeight = true;
        //     $dialog.style.top = top+10+'px';
        //   }
        // });
      }
		},
		mounted(){
      var self = this;
    },
    watch:{
      showDialog:function(val){
        
        this.$emit('input',val);

        
      },
      value:function(val){
        this.showDialog = val;
        var $body = document.querySelector('body');
        
        if(val){
          this.bodyScrollTop = (document.documentElement.scrollTop || document.body.scrollTop);
          $body.style.position = 'fixed';
          $body.style.top = '-'+this.bodyScrollTop+'px';
          this.$nextTick(() => {
            this.$refs.dialogContent.scrollTop = 0;
          });
        }else{
          $body.style.position = 'inherit';
          $body.style.top = 'auto';
          if(this.bodyScrollTop){
            document.documentElement.scrollTop = document.body.scrollTop = this.bodyScrollTop;
          }
          this.bodyScrollTop = 0;
          
        }
      }
    }
	}
</script>
