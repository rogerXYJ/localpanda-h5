<template>
    <div class="talk" v-show="zendeskStatus">
        <div class="box">
            <div class="back"><i class="iconfont" @click="back">&#xe615;</i></div> 
            <ul class="nav_list"> 
                <li>Chat with Panda</li>
                </ul>
            <div class="head" v-show="!isWork()">
                    <p>We respond within one hour during opening hours (Mon-Sun 9 am to 8 pm Beijing time). </p><br>
                    <p>If it’s not our operating hours, please leave us your requests in the left “Advise Me” section. Our staff will reply ASAP.</p>
                </div>
            
                <div class="head" v-if="loadTime && isWork()">
                <p>Due to internet connection problems, Online Chat is currently offline.<br><br>
            You can contact us in the following ways:<br>
            +86 (21) 8018-2090<br>
            +1 (888) 930-8849 (US toll-free)<br>
            service@localpanda.com</p>
                </div>
                <Loading :loadingStatus="loadingStatus"></Loading>
            </div>
    </div>	
</template>

<script>
if (process.browser) {
  require("~/assets/js/plugin/talk.js");
}
import Loading from '~/components/plugin/Loading'
import { clearInterval } from 'timers';
export default { 
  props:['zendeskStatus'],
  name: "talk",
  data() {
    return {
      webWidgetTimer:null,
      webWidgetDisplay:'none',


      loadingStatus:false,
      loadTime:false 
    };
  },
  components: {
      Loading
  },
  methods: {
   
    back() {
        this.$emit('getShowZendesk',false)
    },



    getIframe(dom,className){
      var iframe = document.getElementsByTagName('iframe');
      for(var i=0;i<iframe.length;i++){
        var thisData = iframe[i].getAttribute('data-test-id');
        if(thisData=='ChatWidgetMobileWindow'){
          return iframe[i];
        }
      }
      return false;
    },

    // showZendesk(){
    //   var webWidget = this.getIframe();
    //   if(this.zendeskStatus){
    //       console.log(111)
    //        this.loadingStatus=true
    //       if(webWidget){
    //         webWidget.style.display = 'block';
    //         this.loadingStatus = false;
    //     }else if(this.isWork()){
    //         this.loadingStatus = true;
    //     }
    //      this.webWidgetDisplay = 'block';
    //      this.loadDesk();
    //   }else{
    //      if(webWidget){
    //         this.loadingStatus = false;
    //         webWidget.style.display = 'none';
    //      } 
    //       this.webWidgetDisplay = 'none';
    //   }
      
      
     
      
    // },
    //得到标准时区的时间的函数
    getLocalTime(i) {
        //参数i为时区值数字，比如北京为东八区则输进8,西5输入-5
        if (typeof i !== 'number') return;
        var d = new Date();
        //得到1970年一月一日到现在的秒数
        var len = d.getTime();
        //本地时间与GMT时间的时间偏移差
        var offset = d.getTimezoneOffset() * 60000;
        //得到现在的格林尼治时间
        var utcTime = len + offset;
        return new Date(utcTime + 3600000 * i);
    },
    isWork(){
      //获取东八区时区
      var nowDate = this.getLocalTime(8),
        nowHour = nowDate.getHours();
      if(nowHour>=9 && nowHour<20){
        return true;
      };
      return false;
    },
    loadDesk(){
      var that = this;
      
      if(!this.isWork()){
        return;
      }

      var allTime = 0;
      that.loadTime = false;

      window.clearInterval(that.webWidgetTimer);

      that.webWidgetTimer = setInterval(function(){
        var webWidget = that.getIframe();
        if(webWidget && webWidget.contentWindow.document.querySelector('.jx_ui_Widget')){

          that.loadingStatus = false;
          window.clearInterval(that.webWidgetTimer);

          //设置位置
          var nav_list = document.querySelector('.talk .nav_list');
          
         
          var Top = nav_list.offsetTop + nav_list.clientHeight + 10;
          webWidget.style = ' position: fixed;left:0;top: '+Top+'px; bottom: none; opacity: 1; display: block;z-index:99999; width: 100%;height:calc(100vh - '+Top+'px); border: none;display:'+that.webWidgetDisplay+';';
          
          var iframeDocument = webWidget.contentWindow.document;
          var zenDeskHidden = iframeDocument.querySelector('.u-isHidden');
          
          //隐藏标题头
          var zenHeader = iframeDocument.querySelector('.jx_ui_Widget');
          if(zenHeader){
            zenHeader.style.marginTop = '-50px';
          }
          var ChatPanel = iframeDocument.querySelector(".meshim_widget_components_mobileChatWindow_ChatPanel");
          ChatPanel.style="height:calc(100% - 86px)";
          
          // zenDeskHidden.className = '';
          // zenDeskHidden.style.height = '100%';
          
        }

        allTime+=200;
        if(allTime>=15000){
          that.loadTime = true;
          that.loadingStatus = false;
          window.clearInterval(that.webWidgetTimer);
        }
      },200);
    }
  },
  mounted: function() {
      //设置语言
		zE(function() {
			zE.setLocale('en_US');
		});
    //在线交谈
    //this.showZendesk()
    document.body.className = document.body.className?document.body.className+' show_zendesk': 'show_zendesk'; 
  },
  watch: {
     zendeskStatus(val){
         
         var webWidget = this.getIframe();
         if(val){
             document.getElementsByTagName('body')[0].style="overflow-y:hidden"
           this.loadingStatus=true
          if(webWidget){
            webWidget.style.display = 'block';
            this.loadingStatus = false;
        }else if(this.isWork()){
            this.loadingStatus = true;
        }
         this.webWidgetDisplay = 'block';
         this.loadDesk();
      }else{
         if(webWidget){
             document.getElementsByTagName('body')[0].style="overflow-y:inherit"
            this.loadingStatus = false;
            webWidget.style.display = 'none';
         } 
          this.webWidgetDisplay = 'none';
      }  
     }
  }
};
</script>
<style lang="scss">
.show_zendesk{
  #launcher{
    width: 0% !important;
    height: 0% !important;
    left: -999px !important;
  }
}
</style>

<style lang="scss" scoped>

.talk {
    position:fixed;
    left:0;
    top:0;
    z-index:999;
    background:#fff;
    width:100%;
    min-height:100%;
.box{
    padding: 0.34rem 0 0 0.5rem;
  .back {
    
    i {
      font-size: 0.4rem;
    }
  }
  .nav_list{
       overflow: hidden;
        margin-bottom: 0.4rem;
         li{
             color: #1bbc9d;
            text-align: center;
            font-size: 0.36rem;
            padding-bottom: 0.24rem;
            
        }
  }
  .head {
    h3 {
      font-size: 0.6rem;
      font-weight: bold;
    }
    p {
      font-size: 0.28rem;
      line-height: 0.36rem;
    }
  }
  .loaders {
    width: 100%;
    height: 30%;
    position: relative;
    left: auto;
    top: auto;
    margin-top: 2rem;
  }
  }
}
</style>