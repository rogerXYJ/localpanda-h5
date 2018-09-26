<template>
	<div class="inquiry">
		<div class="back"><i class="iconfont" @click="back">&#xe615;</i></div>

    <!-- <ul class="nav_list">
      <li class="active" @click="showInquiry">Advise Me</li>
      <li @click="showZendesk">Chat with Panda</li>
    </ul> -->

    <Loading :loadingStatus="loadingStatus"></Loading>


		<div class="head" v-show="isInquiry">
      <h3>Send My Inquiry</h3>
			<p>If you have questions or needs about any specific tour, we have professional consultants to answer your questions 
on a 1-1 basis.</p>
		</div>
    
    <div class="head" v-show="!isInquiry && !isWork()">
			<p>We respond within one hour during opening hours (Mon-Sun 9 am to 8 pm Beijing time). </p><br>
      <p>If it’s not our operating hours, please leave us your requests in the left “Advise Me” section. Our staff will reply ASAP.</p>
		</div>
    
    <div class="head" v-if="loadTime && !isInquiry && isWork()">
      <p>Due to internet connection problems, Online Chat is currently offline.<br><br>
You can contact us in the following ways:<br>
+86 (21) 8018-2090<br>
+1 (888) 930-8849 (US toll-free)<br>
service@localpanda.com</p>
    </div>


		<div class="fillin" v-show="isInquiry">

      <div class="inputItem">
				<p>Message<span>*</span></p>
				<textarea v-model="textInfo" @focus="textInfofocus" :class="{err:textInfoErr}"></textarea>
			</div>
			
			<div class="inputItem">
				<p>Date of Arrival</p>
				<input id="js_changetime" class="inputin" placeholder="Select Date" onfocus="this.blur()" v-model="dateTime" readonly type="text">
			</div>
			<div class="inputItem">
				<p>Number of People</p>
				<div class="peopleN">
					<div class="peopleshow" :class="peopleNub==0?'color8':''"  @click.stop="showchoose">
						<span v-if="peopleNub==0">Select People</span>
						<span v-if="peopleNub==1">1 Person</span>
						<span v-if="peopleNub>1">{{peopleNub}} People</span>
						<i class="iconfont icon-down" v-if="!isshowchoose">&#xe60f;</i>
						<i class="iconfont icon-down" v-else>&#xe63f;</i>
					</div>
					<div class="choosePeople" v-if="isshowchoose">
						<b>People</b>
						<div class="operation">
							<em class="iconfont" @click.stop="del(0)">&#xe64d;</em>
							<div>{{peopleNub}}</div>
							<em class="iconfont" @click.stop="add(0)">&#xe64b;</em>
						</div>
					</div>
				</div>
			</div>


      <div class="inputItem">
				<p>Name<span>*</span></p>
				<input v-model="name" :class="{err:nameError}" @focus="namefocus" class="inputin" />
			</div>
			<div class="inputItem">
				<p>Email Address<span>*</span></p>
				<input v-model="email" :class="{err:emailErr}" @focus="emailfocus" class="inputin"/>
			</div>
			

      <div class="btn" @click.stop="submit">Submit</div>
		</div>
		
		
		<Dialog @setIsShowAlert="setShowAlert" 
				:isShowAlert="isShowAlert"
				:alertTitle="alertTitle"
				:alertMessage="alertMessage"
				></Dialog>
		<transition name="fade">
			<div class="win_bg" id="win_bg" @click="showWinBg = false" v-show="showWinBg"></div>
		</transition>



    <!-- service弹窗 -->
		<dialogBox v-model="dialogStatus" confirmShow="true" confirmText="Confirm" @confirmCallback="confirmCallback" width="100%">
			
			<div class="service_box">
        <div class="tip_title"> Thank you. You have submitted <br> your Inquiry successfully! <br>We will get back to you within 1 day.</div>
				<p class="tip_detail">A confirmation email has been sent to “{{inqueryEmailOld}}”,<br>Please check. If you have not received it, please check your junk mail folder. If you still do not see it,<br>please <a @click="showEmailBox=true">click here</a> to enter your correct or alternative email address.</p>
				<div class="email_box" v-show="showEmailBox">
					<input type="text" v-model="inqueryEmail">
          <div class="email_tip red" v-show="emailTip">Please enter a valid email</div>
          <div class="email_tip green" v-show="emailSendTip"><i class="iconfont">&#xe654;</i> Email address has been updated ,and We have sent an email to your new mailbox</div>
					<span class="btn_sendemail" @click="sendEmail">Resend email address</span>

					
					
				</div>

				
			</div>

			<service></service>
			
		</dialogBox>


	</div>
</template>

<script>
if (process.browser) {
  // require("~/assets/js/plugin/talk.js");
}

import Dialog from "~/components/info/inquiry/Dialog";
import service from '~/components/info/inquiry/service';
import dialogBox from '~/plugins/panda/dialogBox';
import Loading from '~/components/plugin/Loading'
import { regExp, GetDateStr, addmulMonth } from "~/assets/js/utils";
import Flatpickr from "flatpickr";
import { clearInterval } from 'timers';
export default {
  name: "inquiry",
  // head() {
  // 	return {
  // 		script: [
  // 			{
  // 				src:'https://assets.zendesk.com/embeddable_framework/main.js',
  // 				type: 'text/javascript'
  // 			}
  // 		]
  // 	}
  // },
  data() {
    let id = this.$route.query.objectId;

    return {
      name: "",
      nameError: false,
      email: "",
      emailErr: false,
      textInfo: "",
      textInfoErr: false,

      isInquiry:true,
      webWidgetTimer:null,
      webWidgetDisplay:'none',

      dateTime: "",
      options: {},
      showWinBg: false,
      isshowchoose: false,
      peopleNub: 0,
      flatPickr: null,
      objectType: "ACTIVITY",
      isclick: false,

      isShowAlert: false,
      alertTitle: "",
      alertMessage: "",
      objectId: id,
      loadingStatus:false,
      loadTime:false,


      dialogStatus:false,
      emailTip:false,
      emailSendTip:false,
      showEmailBox:false,
      inqueryEmail:'',
      inqueryEmailOld:'',
      feedbackId: ''

    };
  },
  components: {
    Dialog,
    Loading,
    dialogBox,
    service
  },
  methods: {
    setShowAlert(val) {
      this.isShowAlert = val;
    },
    back() {
      history.back();
    },
    namefocus() {
      this.nameError = false;
    },
    emailfocus() {
      this.emailErr = false;
    },
    textInfofocus() {
      this.textInfoErr = false;
    },
    GAfail() {
      ga("gtag_UA_107010673_2.send", {
        hitType: "event",
        eventCategory: "activity_detail",
        eventAction: "submit",
        eventLabel: "activity_inquiry_fail"
      });
    },
    submit() {
      let ok = false;
      let that = this;

      setTimeout(function() {
        var err = document.querySelectorAll(".err")[0];
        if (err) {
          err.scrollIntoViewIfNeeded();
          // var errT = err.offsetTop;
          // var doc = document.querySelectorAll('html,body');
          // doc[0].scrollTop = errT;
          // doc[1].scrollTop = errT;
        }
      }, 60);

      if (that.textInfo == "") {
        that.textInfoErr = true;
        ok = false;
      }else if (
        that.name == "" ||
        regExp.isNub(that.name) ||
        regExp.isCode(that.name)
      ) {
        ok = false;
        that.nameError = true;
      } else if (!regExp.isEmail(that.email)) {
        that.emailErr = true;
        ok = false;
      } else {
        ok = true;
        ga("gtag_UA_107010673_2.send", {
          hitType: "event",
          eventCategory: "activity_detail",
          eventAction: "submit",
          eventLabel: "activity_inquiry_succ"
        });
        var obj = {
          objectType: that.objectType,
          userName: that.name,
          emailAddress: that.email,
          message: that.textInfo,
          //phoneNumber:that.phone?that.phone:null,
          travelDate: that.dateTime ? that.dateTime : null,
          participants: that.peopleNub,
          objectId: that.objectId ? that.objectId : null,
          //					destinations: that.destination ? that.destination : null,
          utcOffset: new Date().getTimezoneOffset() / 60 * -1,
          owner: localStorage.getItem("owner")
        };

        if (that.isclick == false) {
          that.isclick = true;
          that.axios
            .put(
              "https://api.localpanda.com/api/user/feedback",
              JSON.stringify(obj),
              {
                headers: {
                  "Content-Type": "application/json; charset=UTF-8"
                }
              }
            )
            .then(
              function(response) {
                if (response.data.succeed) {

                  that.contactCallBack({'data':response.data,'email':that.email});
                  
                } else {
                  that.isShowAlert = true;
                  that.alertTitle = "Failed!";
                  that.alertMessage = "";
                }
              },
              function(response) {
                that.isShowAlert = true;
                that.alertTitle = "Failed!";
                that.alertMessage = "";
              }
            );
        }
      }
      if (ok == false) {
        that.GAfail();
      }
    },
    showchoose() {
      this.isshowchoose = true;
    },
    add() {
      this.peopleNub++;
    },
    del() {
      if (this.peopleNub == 0) {
        this.peopleNub = 0;
      } else {
        this.peopleNub--;
      }
		},
    addClass(num){
      var navLi = document.querySelectorAll('.nav_list li');
      for(var i=0;i<navLi.length;i++){
        var thisLi = navLi[i];
        if(num == i){
          thisLi.className = 'active';
        }else{
          thisLi.className = '';
        };
      };
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
    showInquiry(e){
      this.addClass(0);
      this.isInquiry = true;
      this.loadingStatus = false;
      var webWidget = this.getIframe();
      if(webWidget){
        webWidget.style.display = 'none';
      }
      
      this.webWidgetDisplay = 'none';
    },
    showZendesk(){
      this.addClass(1);
      this.isInquiry = false;

      var webWidget = this.getIframe();
      if(webWidget){
        webWidget.style.display = 'block';
        this.loadingStatus = false;
      }else if(this.isWork()){
        this.loadingStatus = true;
      }
      
      this.webWidgetDisplay = 'block';
      this.loadDesk();
      
    },
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
          var nav_list = document.querySelector('.inquiry .nav_list');
          var Top = nav_list.offsetTop + nav_list.clientHeight + 20;
          webWidget.style = ' position: absolute;left:0;top: '+Top+'px; bottom: none; opacity: 1; display: block; width: 100%;height:calc(100vh - '+Top+'px); border: none;display:'+that.webWidgetDisplay+';';

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
    },
    confirmCallback(){
      this.dialogStatus = false;
      location.href = '/activity/details/'+this.objectId;
    },
    sendEmail(){
      var that = this;
      if(/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test(this.inqueryEmail)){

        //默认是修改feedback的邮箱
        var postData = {
          emailAddress: this.inqueryEmail,
          id: this.feedbackId
        };
        var postUrl = "https://api.localpanda.com/api/user/feedback";

        //修改邮箱请求
        that.axios.post(postUrl, JSON.stringify(postData), {
          headers: {
            'Content-Type': 'application/json'
          }
        }).then(function(response) {
          if(response.data.succeed) {
            that.inqueryEmailOld = that.inqueryEmail;
            that.emailSendTip = true;
            that.inqueryEmail = '';
          };

        }, function(response) {

        })
        this.emailTip = false;
      }else{
        this.emailTip = true;
      }
    },
    contactCallBack(val){
      if(val){
        var data = val.data;
        this.feedbackId = data.response;
        this.inqueryEmailOld = val.email;
        this.dialogStatus = true;
      }
      
    }
  },
  created: function() {
    let that = this;
    if (process.browser) {
      this.options = {
        minDate: GetDateStr(1),
        maxDate: addmulMonth(GetDateStr(1), 12),
        disableMobile: true,
        onOpen: function(selectedDates, dateStr, instance) {
          that.showWinBg = true;
        },
        onChange() {
          that.showWinBg = false;
        }
      };
      
    }
  },
  mounted: function() {
    let that = this;
    that.flatPickr = new Flatpickr("#js_changetime", this.options);
    document
      .getElementsByTagName("body")[0]
      .addEventListener("click", function() {
        that.isshowchoose = false;
      });

    document.getElementById("win_bg").addEventListener("click", function() {
      that.showWinBg = false;
    });
      
    


    //设置语言
		// zE(function() {
		// 	zE.setLocale('en_US');
		// });
    // //在线交谈
    // this.loadDesk();
    document.body.className = document.body.className?document.body.className+' show_zendesk': 'show_zendesk';

  },
  watch: {
    "flatPickr.isOpen": function(val, oldVal) {
      if (val) {
        this.isshowchoose = false;
        document.getElementsByTagName("html")[0].style.overflow = "hidden";
      } else {
        document.getElementsByTagName("html")[0].style.overflow = "inherit";
      }
    }
  }
};
</script>
<style lang="scss">
@import "~/assets/scss/plugin/flatpickr.min.css";

body{
  .flatpickr-months .flatpickr-prev-month svg,
  .flatpickr-months .flatpickr-next-month svg {
    width: 20px !important;
    height: 20px !important;
  }
  .flatpickr-calendar {
    padding: 10px 0;
    width: 90%;
    max-width: 500px;
    left: 50% !important;
    top: 50% !important;
    right: auto !important;
    transform: translate(-50%, -50%);
    opacity: 1;
    visibility: initial;
    position: fixed;
    &.animate.open {
      animation: all 0 cubic-bezier(0.23, 1, 0.32, 1);
      z-index: 999;
      opacity: 1;
    }
    .flatpickr-next-month,
    .flatpickr-prev-month {
      top: 5px;
    }
    .flatpickr-month {
      height: 40px;
    }
    
    .flatpickr-days,
    .flatpickr-weekdays,
    .flatpickr-rContainer,
    .dayContainer {
      width: 100%;
      max-width: none;
    }
    .flatpickr-day {
      max-width: none;
      height: 7vh;
      max-height: 45px;
    }
  }
  .flatpickr-calendar.open:before,
  .flatpickr-calendar.open:after {
    display: none;
  }
  .flatpickr-calendar .flatpickr-day.nextMonthDay,.flatpickr-calendar .flatpickr-day.prevMonthDay{
		color: #393939;
	}
	.flatpickr-calendar .flatpickr-day.disabled, .flatpickr-day.disabled:hover{
		color:rgba(57, 57, 57, .3);
	}
  .flatpickr-day {
    // color: #393939!important;
  }
  .flatpickr-day.disabled {
    // color: rgba(57, 57, 57, .3)!important;
  }
}

.show_zendesk{
  #launcher{
    width: 0% !important;
    height: 0% !important;
    left: -999px !important;
  }
  #webWidget{
    // left: 0 !important;
    // top: 200px !important;
    // bottom: none !important;
    // opacity: 1 !important;
    // display: block !important;
    // width: 100% !important;
    // border: none !important;
  }
}



.inquiry{

  .nav_list{
    overflow: hidden;
    margin-bottom: 0.4rem;
    li{
      float: left;
      width: 50%;
      text-align: center;
      font-size: 0.36rem;
      padding-bottom: 0.24rem;
      border-bottom: #ddd solid 2px;
    }
    .active{
      color: #1bbc9d;
      
      border-bottom: #1bbc9d solid 2px;
    }
  }
  

  input::-webkit-input-placeholder,
  textarea::-webkit-input-placeholder {
    /* WebKit browsers */
    color: #878e95;
  }
  input:-moz-placeholder,
  textarea:-moz-placeholder {
    /* Mozilla Firefox 4 to 18 */
    color: #878e95;
  }
  input::-moz-placeholder,
  textarea::-moz-placeholder {
    /* Mozilla Firefox 19+ */
    color: #878e95;
  }
  input:-ms-input-placeholder,
  textarea:-ms-input-placeholder {
    /* Internet Explorer 10+ */
    color: #878e95;
  }

  .inputItem {
    .flatpickr-input {
      height: 1rem !important;
      border: 1px solid #dde0e0;
      border-radius: 0.08rem;
      padding-left: 0.24rem !important;
      font-size: 0.34rem !important;
    }
  }

  .alertTitle {
    .box {
      margin-left: 0 !important;
    }
  }

}
</style> 
<style lang="scss" scoped>
.inquiry {
  padding: 0 0.5rem 1rem;
  .back {
    padding: 0.34rem 0 0.3rem;
    i {
      font-size: 0.4rem;
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
  .loaders{
    width: 100%;
    height: 30%;
    position: relative;
    left: auto;
    top:auto;
    margin-top: 2rem;
  }
  .fillin {
    margin-top: 0.3rem;

    .inputItem {
      margin-top: 0.44rem;
      /*border-bottom: 2px solid #ebebeb;*/
      p {
        font-size: 0.36rem;
        span {
          color: red;
        }
      }
      .peopleN {
        position: relative;
        .peopleshow {
          width: 100%;
          height: 1rem;
          border: 1px solid #dde0e0;
          border-radius: 0.08rem;
          padding-left: 0.24rem;
          line-height: 1rem;
          font-size: 0.34rem;
          margin-top: 0.133333rem;
          i {
            position: absolute;
            right: 0.36rem;

            font-size: 0.22rem;
            color: #878e95;
          }
        }
        .choosePeople {
          position: absolute;
          width: 100%;
          top: 1rem;
          left: 0;
          line-height: 1.44rem;
          padding: 0 0.306666rem;
          background: #fff;
          box-shadow: 0px 0px 30px 0px rgba(0, 0, 0, 0.15);
          z-index: 2;

          b {
            font-size: 0.42rem;
            float: left;
          }
          .operation {
            float: right;
            em {
              font-weight: bold;
              display: inline-block;
              width: 0.6rem;
              height: 0.6rem;
              border: 1px solid #1bbc9d;
              border-radius: 50%;
              font-size: 0.186666rem;
              text-align: center;
              line-height: 0.6rem;
              color: #1bbc9d;
            }
            div {
              display: inline-block;
              font-size: 0.38rem;
              margin: 0 0.5rem;
              vertical-align: middle;
              border: none;
            }
          }
        }
      }
      .inputin {
        width: 100%;
        height: 0.9rem;
        border: 1px solid #dde0e0;
        border-radius: 0.08rem;
        padding-left: 0.24rem;
        font-size: 0.34rem;
        margin-top: 0.1rem;
        &:-webkit-placeholder {
          /* Mozilla Firefox 4 to 18 */
          color: #878e95;
        }
      }
      textarea {
        height: 1.893333rem;
        border: 1px solid #dde0e0;
        border-radius: 0.08rem;
        width: 100%;
        padding-left: 0.24rem;
        padding-top: 0.22rem;
        margin-top: 0.3rem;
        font-size: 0.28rem;
        &:-webkit-placeholder {
          /* Mozilla Firefox 4 to 18 */
          color: #dde0e0;
        }
      }
    }
  }
  .btn {
    margin-top: 0.6rem;
  }
  .win_bg {
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    position: fixed;
    left: 0;
    top: 0;
  }
  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.5s;
  }
  .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
    opacity: 0;
  }
  .err {
    border-color: red !important;
    color: red !important;
  }
  .color8 {
    color: #878e95;
  }


  

  .service_box{
    font-size: 14px;

    .tip_title{
      margin-top: 0.2rem;
      padding: 0.3rem 0;
      text-align: center;
      font-size: 0.34rem;
      // background-color: #fafafa;
    }

    .tip_detail{ 
      margin-top: 20px; font-size: 14px; line-height: 22px;
      a{ color:#00B886; cursor: pointer;
        &:hover{ text-decoration: underline;}
      }
    }
    .email_box{
      margin-top: 10px;
      input{
        width: 100%;
        border: 1px solid #ddd;
        height: 32px;
        line-height: 32px;
      }
      .btn_sendemail{
        display: inline-block;
        margin-top: 0.2rem;
        height: 32px;
        border-radius: 16px;
        line-height: 30px;
        padding: 0 20px;
        font-size: 14px;
        cursor: pointer;
        background-image: -webkit-gradient(linear, right top, left top, from(#009efd), to(#1bbc9d));
        background-image: linear-gradient(270deg, #009efd 0%, #1bbc9d 100%);
        color: #fff;
      }
    }
    .email_tip{
      margin-top: 9px;
      i{
        font-size: 14px;
      }
    }
    
    
  }
}
</style> 