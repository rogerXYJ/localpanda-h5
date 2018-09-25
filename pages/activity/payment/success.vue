<template>
	<div class="result payment_result">
    <div class="pay_result">
      <h4>Confirmation</h4>
      <div class="pay_tip" v-show="success">
        <span class="iconfont icon_success">&#xe61e;</span>
        <span class="tip_text">Booking success!</span>
      </div>
      <div class="pay_tip" v-show="!success">
        <span class="iconfont icon_error">&#xe606;</span>
        <span class="tip_text">Oops! Something went wrong.</span>
      </div>

      <p class="order_info">{{orderInfo.activityInfo.title}}</p>
      <p class="order_info"><b>Order ID:</b> {{orderId}}</p>
      <!-- <p class="order_info" v-show="success">Time of transaction: 2017-12-20 09:32:51</p> -->
      <p class="order_info"><b>Payment amount:</b> <span>{{orderInfo.currency+' '+orderInfo.symbol}}{{orderInfo.amount}}</span></p>
      
      <p class="order_info"><b>Number of travelers:</b> {{orderInfo.adultNum+orderInfo.childrenNum}}</p>
      <p class="order_info"><b>Travel date:</b> {{orderInfo.startDate}}</p>
      


      <!-- <p class="order_contact" v-show="success">Our staff will confirm with you as soon as possible. We will reply you within one business day. You can know the details furthur by look at your order details.You can also email service@localpanda.com or call us at +86 (21) 8018-2090/ +1 (888) 930-8849 (US toll free).</p> -->

      <div class="service_box" v-show="success">
        <p class="tip_detail">A confirmation email has been sent to “{{orderInfo.contactInfo.emailAddress}}”,<br>Please check. If you have not received it, please check your junk mail folder. If you still do not see it,<br>please <a @click="showEmailBox=true">click here</a> to enter your correct or alternative email address.</p>
        <div class="email_box" v-show="showEmailBox">
          <input type="text" v-model="inqueryEmail">
          <div class="email_tip red" v-show="emailTip">Please enter a valid email</div>
          <span class="btn_sendemail" @click="sendEmail">Resend email address</span>
          <div class="email_tip green" v-show="emailSendTip"><i class="iconfont">&#xe654;</i> Email address has been updated ,and We have sent an email to your new mailbox</div>
        </div>

        
      </div>



      <p class="order_contact" v-show="!success"><span v-show="msg">Your payment did not go through. Here is the error that you can reference:{{msg}}</span><br><br>
        If you want to proceed with payment, click "Try again." If your payment problems continue, we suggest you try using another card or contact us via call, text, email or other messaging tools listed below.</p>

      <p class="order_contact c_666" v-if="showTipTxt && success">You ordered as a guest. You can click this button to view your order details.</p>
      <p class="order_contact c_666" v-else-if="success">Click this button and view your order details.</p>
      <div class="btn_success">
        <a class="btn_href" :href="getJumpUrl(logIn)" v-if="success">View My Order</a>
        <!-- <a class="btn_href" href="/" v-else-if="!email">Back to home</a> -->
        <a class="btn_href" :href="tryUrl" v-else>Try again</a>
      </div>
    
      
    </div>


    
    <service :status="success"></service>
    <foot></foot>
  </div>
</template>

<script>
	if (process.browser) {
	  require('~/assets/js/plugin/talk.js');
  }
  import service from '~/components/info/inquiry/service';
  import foot from "~/components/footer/index";
  import Vue from 'vue'

  export default {

    name: 'payResult',
    async asyncData({
			apiBasePath,
      route,
      error
		}) {

			let query = route.query;
			var orderInfo = '';

			try {
        
        orderInfo = await Vue.axios.get(apiBasePath + "order/activity/" + query.orderId);
        
			} catch(err) {
				return error({
					statusCode: 500,
					message: JSON.stringify(err)
				});
			};

			

			return {
				orderInfo: orderInfo ? orderInfo.data : ''
			}
		},
    head() {
			let title = 'Order Complete! - Localpanda.com';
			let description = 'Your Order is confirmed! You should received a confirmation email from us shortly. '
			let keywords =''
			return {
				title: title,
				meta: [{
						hid: "keywords",
						name: "keywords",
						content: keywords
					},
					{
						hid: "description",
						name: "description",
						content: description
					}
				]
			}
    },
    
		data() {
      var query = this.$route.query;
      
      
			return {
				orderId: query.orderId,
				// amount: '',
				logIn: '',
				date: "",
        userId: '',
        // email: '',
        success: query.succeed=='true'?true:false,
        msg: query.msg,
        showTipTxt: false,
        // symbol: '$',
        // currency: 'USD',
        tryUrl:'',

        //service
        emailTip:false,
				emailSendTip:false,
				showEmailBox:false,
				inqueryEmail:'',
			}
		},
		components: {
      foot,
      service
		},
		methods: {
			getJumpUrl(isLogin){
        if(isLogin){
          return '/user/myBookings';
        }
        return '/user/myBookings?email='+this.orderInfo.contactInfo.emailAddress+'&orderid='+this.orderId;
      },
      getTryUrl(){
        var ua = window.navigator.userAgent.toLowerCase();
        this.isWx = (ua.match(/MicroMessenger/i) == 'micromessenger') ? true : false;

        var tryHref = '/activity/payment/?objectId='+this.orderId+'&login='+(this.logIn?this.logIn:0);

        if(this.isWx && this.orderInfo.symbol=='¥'){
          tryHref = 'https://www.localpanda.com/relay/getWechatToken.html?url='+encodeURIComponent(tryHref);
        }
      
        return tryHref;
      },
      sendEmail(){
				var that = this;
				if(/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test(this.inqueryEmail)){

					//默认是修改feedback的邮箱
					var postData = {
						contactInfo:{
							emailAddress: this.inqueryEmail
						},
						orderId: this.orderId
					};
					var postUrl = 'https://api.localpanda.com/api/order/activity/email';

					//修改邮箱请求
					that.axios.post(postUrl, JSON.stringify(postData), {
						headers: {
							'Content-Type': 'application/json'
						}
					}).then(function(response) {
						if(response.data.succeed) {
							that.emailSendTip = true;
							that.orderInfo.contactInfo.emailAddress = that.inqueryEmail;
							that.inqueryEmail = '';
						};

					}, function(response) {

					})
					this.emailTip = false;
				}else{
					this.emailTip = true;
				}
			},
		},
		mounted: function() {
			this.logIn=window.localStorage.getItem("logstate")
      this.userId=window.localStorage.getItem("userid")
      if(!this.logIn){
				this.showTipTxt = true;
      }

      
      //订单信息
      console.log(this.orderInfo);
      
      //设置try again的url
      this.tryUrl = this.getTryUrl();
		}
	}

</script>

<style lang="scss" scoped>
.payment_result{
  .pay_result{
    padding: .4rem .44rem;
    h4{ 
      font-size:0.6rem;
      font-weight: bold;
      margin-bottom: 0.8rem;
    }
    .pay_tip{
      margin-bottom: 0.5rem;
      .iconfont{
        font-size: 0.2rem;
        color: #fff;
        display: inline-block;
        width:0.44rem;
        height: 0.44rem;
        line-height: 0.44rem;
        text-align: center;
        border-radius: 50%;
        vertical-align: top;
        margin-right:0.2rem;
      }
      .icon_success{
        background-color: #1bbc9d;
      }
      .icon_error{
        background-color: #e14f3f;
      }
      .tip_text{ 
        color: #353a3f;
        font-size: 0.34rem;
        line-height: 0.44rem;
        font-weight: bold;
      }
    }

    .order_info{
      font-size: 0.28rem;
      color: #353a3f;
      line-height: 0.46rem;
      b{ font-weight: bold; margin-right: 0.1rem;}
      span{
        color: #1bbc9d;
      }
    }
    .order_contact{
      color: #878e95;
      font-size:0.22rem;
      margin-top: 0.5rem;
      line-height:0.36rem;
    }
    .c_666{
      color: #666;
    }
	.btn_success{
		
		position: fixed; 
		left: 0;
		padding:0.4rem 6%;
		width: 100%;
		background: #FFF;
		bottom: 0;
		line-height: 2rem;
		z-index: 2;
	}
    .btn_href{
    	
      width: 100%;
      display: block;
      height: 1rem;
      line-height: 1rem;
      text-align: center;
      color: #fff;
      font-size: 0.32rem;
      border-radius:0.5rem;
      background: -webkit-linear-gradient(left, #1bbc9d , #009efc); /* Safari 5.1 - 6.0 */
      background: linear-gradient(to right, #1bbc9d , #009efc); /* 标准的语法 */
    }
    
  }
  
  #launcher{  bottom: 60px!important;}
  
  .service_box{
    font-size: 14px;
    color: #878e95;

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
  .service_info{
    padding: 0 0.4rem;
    margin-top: 0.2rem;
  }
}
</style>