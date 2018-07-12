<template>
	<div class="payNow">
		<div class="oderdetial" id="oderdetial">
			<div class="back" @click="back">
				<i class="iconfont">&#xe615;</i>
				<span>Order Summary</span>
			</div>
			<div class="payfordetail">
				<div class="headcommon">
					<div class="serviceform">
						<h3>{{opctions.activityInfo?opctions.activityInfo.title:''}}</h3>
						<div class="service">
							<div class="serviceInfo">
								<b>Date: </b>
								<span>{{opctions.startDate}}<span v-if="opctions.startTime">{{opctions.startTime}}</span></span>
								<!--<p>{{opctions.startDate}}<span v-if="opctions.startTime">opctions.startTime</span></p>-->
							</div>
							<div class="serviceInfo">
								<b>Guests: </b>
								<span v-if="opctions.adultNum==1&&opctions.childrenNum==0">1 Person</span>
								<span v-else>{{opctions.adultNum+opctions.childrenNum}} People</span>
								<!--<p v-if="opctions.adultNum==1&&opctions.childrenNum==0">1 Person</p>
								<p v-else>{{opctions.adultNum+opctions.childrenNum}} People</p>-->
							</div>
							<div class="serviceInfo">
								<b>Total ({{opctions.currency}}): </b>
								<span class="blod">{{opctions.symbol}}{{returnFloat(opctions.amount)}}</span>
								<!--<p>You can get a 100% refund up to {{refundTimeLimit}} hours before your trip.</p>-->
								<!--<p v-if="opctions.adultNum==1&&opctions.childrenNum==0">1 Person</p>
								<p v-else>{{opctions.adultNum+opctions.childrenNum}} People</p>-->
							</div>
							<div class="hint">
								<p v-if="logInHide">You ordered as a guest. To view your order details, go to the homepage, click "My Bookings" at the top of the page, and type in the name and email address for your reservation.</p>
								<!-- <p v-else>To view your order details, go to the homepage, click "My Bookings" at the top of the page.</p> -->

								<p>You can get a 100% refund up to {{refundTimeLimit}} hours before your trip.</p>
							</div>
						</div>
					</div>
				</div>
				<div class="payment">
					<div class="striptcard" @click="selectCard(0)" v-if="opctions.currency == 'CNY'">
						<i>
							<svg class="icon" aria-hidden="true">
							    <use xlink:href="#icon-wechat"></use>
							</svg>
						</i>
						<span>Wechat</span>
						<div class="selectCarType" v-if="id==1"></div>
						<div class="selectCarTypeNull"  v-else></div>
					</div>
					<div class="striptcard" @click="selectCard(1)">
						<i class="iconfont">&#xe675;</i>
						<span>Credit/Debit Card </span>
						<div class="selectCarType" v-if="id==0"></div>
						<div class="selectCarTypeNull" v-else></div>
					</div>
					<div class="paymentCard"  v-show="id==0">
						<div class="cardNub">
							<label>CARD NUMBER</label>
							<div class="cardNub_ clearfix">
								<i class="iconfont">&#xe675;</i>
								<div id="card-number" class="field empty float"></div>
							</div>
							
						</div>
						<div class="row">
							<div class="row-item">
								<label>VALID TILL</label>
								<div id="card-expiry" class="field empty"></div>
							</div>
							<div class="row-item">
								<label>CVC</label>
								<div id="card-cvc" class="field empty"></div>
							</div>
						</div>
					<p style="margin-top: 0.2rem; font-size: 0.32rem;color:red" v-if="payStatus">{{payErrMsg}}</p>
					</div>
				</div>
				<!--<div class="pic">
					<div class="adult clearfix">
						<div class="formula" v-if="opctions.childrenNum==0&&opctions.adultNum==1">{{opctions.symbol}}{{returnFloat(opctions.averagePrice)}} x 1 Person</div>
						<div class="formula" v-else>{{opctions.symbol}} {{returnFloat(opctions.averagePrice)}} x {{opctions.adultNum+opctions.childrenNum}} People </div>

						<div class="adultPic">{{opctions.symbol}} {{returnFloat(opctions.amount + (opctions.childDiscount?opctions.childDiscount:0) + (opctions.couponDiscount?opctions.couponDiscount:0))}}</div>
					</div>
					<div class="child" v-if="opctions.childDiscount">
						<b>- {{opctions.symbol}}{{returnFloat(opctions.childDiscount)}}</b> for child(ren)
					</div>
					<div class="child" v-if="opctions.couponDiscount">
						<b>- {{opctions.symbol}}{{returnFloat(opctions.couponDiscount)}}</b> for discount
					</div>

				</div>-->
				<!--<div class="total clearfix">
					<div class="totle-title">Total ({{opctions.currency}})</div>
					
					<div class="totalPic">{{opctions.symbol}}{{returnFloat(opctions.amount)}}</div>
				</div>-->

			</div>
			<div class="btn_pay">
				<a v-if="(id==1 && openWxUrl)||!isWx && id==1" :href="openWxUrl" @click="wxOpenClick">Pay</a>
				<button @touchend="getToken()" v-else>Pay</button>

			</div>
		</div>

		<div class="confirm_all" v-show="showWxOpenBox" @touchstart="hideWxOpenBox"></div>
		<div class="confirm_box" v-show="showWxOpenBox">
			<h3>Please confirm whether the payment has been completed ?</h3>
			<div class="btn_list">
				<a class="btn_ok" @touchstart="confirmation">Completion</a>
				<a :href="tryAgainHref">Try again</a>
			</div>
		</div>

		<Loading :loadingStatus="loadingStatus"></Loading>
	</div>

</template>

<script>
	if(process.browser) {
		require('~/assets/js/plugin/l10n.js')
	}
	import { GetQueryString } from '~/assets/js/utils.js'
	import Vue from 'vue'
	import Loading from '~/components/plugin/Loading'

	export default {
		name: 'payNow',
		head() {
			return {
				script: [
//					{
//						src: 'https://checkout.stripe.com/checkout.js',
//						type: 'text/javascript'
//					},
					{
						src:'https://js.stripe.com/v3/',
						type: 'text/javascript'
					}
				]
			}
		},
		async asyncData({
			apiBasePath
		}) {
			return {
				apiBasePath: apiBasePath
			}
		},

		data() {
			var query = this.$route.query;
			return {
				urlQuery: query,
				wxcode: query.code,
				opctions: {
					averagePrice: 0,
					childrenNum: 0,
					adultNum: 0,
					amount: 0,
					couponDiscount: 0,
					currency: ''
				},
				stripeHandler: "",
				orderId: '',
				logIn: '',
				email: '',
				token: '',
				tokenType: '',
				refundTimeLimit: "",
				logInHide: false,
				loadingStatus: false,

				rate: 6.3710,
				isWx: false,
				payData: '',
				showWxOpenBox: false,
				openWxUrl: '',
				tryAgainHref: '',
				cardNumber:'',
				stripe:"",
				id:0,//切换支付方式
				payStatus:false,
				payErrMsg:'',
				isPay:false
				
			}
		},
		components: {
			Loading
		},
		methods: {
			changeCurrency(e) {
				var value = e.target.value;
				this.opctions.currency = value;

				this.changePrice(value);

			},
			selectCard(id){
				console.log(id)
				if(id==0){
					this.id=1
					//document.getElementById("oderdetial").scrollIntoView()
				}else{
					this.id=0
					setTimeout(function(){
						document.body.scrollTop=
						document.getElementById("oderdetial").scrollHeight-document.documentElement.clientHeight;
						document.documentElement.scrollTop=
						document.getElementById("oderdetial").scrollHeight-document.documentElement.clientHeight;
					},0)
				}
				
				
			},
			changePrice(value) {
				var priceAll = this.opctions.priceAll;
				if(value == 'USD') {
					this.opctions.averagePrice = priceAll.averagePrice;
					this.opctions.amount = priceAll.amount;
				} else {
					this.opctions.averagePrice = priceAll.averagePrice * this.rate;
					this.opctions.amount = priceAll.amount * this.rate;
				}
			},
			back() {
				history.back()
			},
			cutXiaoNum(num, len) {
				var numStr = num.toString();
				if(len == null || len == undefined) {
					len = numStr.length;
				}
				var index = numStr.indexOf('.');
				if(index == -1) {
					index = numStr.length;
					numStr += ".0000000000000";
				} else {
					numStr += "0000000000000";
				}
				var newNum = numStr.substring(0, index + len + 1);
				return newNum;
			},
			round(val) {
				if(typeof val === 'number' && val % 1 === 0) {
					return val
				} else {
					return(parseFloat(this.cutXiaoNum(val, 1)) + 0.1).toFixed(1)

				}

			},
			returnFloat(value) {
				value *= 1;
				if(value) {
					var numberArr = ('' + value).split('.');
					if(numberArr.length > 1 && numberArr[1].length > 2) {
						return(value + 0.005).toFixed(2);
					}
					return value.toFixed(2);
				} else {
					return 0;
				}
			},
//			getToken() {
//				let that = this
//				that.stripeHandler = StripeCheckout.configure({
//					key: payCode,
//					image: 'https://resource.localpanda.cn/static/icon/logo.png', // 显示在支付对话框的图片，可自己指定
//					alipay: true, // 启用支付宝支付
//					token: function(token) { // 用户填写完资料并且 Stripe 校验成功后的回调函数
//						// 此时应该提交 token.id 到后台，比如 http://example.com/orders/1?stripeToken={token.id}
//						that.loadingStatus = true;
//						let obj = {
//							amount: that.opctions.amount * 100,
//							currency: that.opctions.currency,
//							objectId: that.orderId,
//							token: token.id,
//							email: token.email,
//							tokenType: token.type,
//							objectType: "ACTIVITY"
//						}
//
//						//console.log(that.opctions.currency);
//
//						Vue.axios.post(that.apiBasePath + "payment/pay/stripe", JSON.stringify(obj), {
//							headers: {
//								'Content-Type': 'application/json; charset=UTF-8'
//							}
//						}).then(function(response) {
//							var thisData = response.data;
//							var msg = '';
//							//成功
//							if(response.status == 200) {
//								var pageTracker = _gat._getTracker("UA-107010673-1");
//								pageTracker._addTrans(that.orderId, "", that.opctions.amount, "", "", "", "", "");
//								pageTracker._addItem(that.orderId, that.opctions.activityId, "", "", that.opctions.amount, "1");
//								pageTracker._trackTrans();
//
//								if(!thisData.succeed && thisData.errorMessage && !/Exception/.test(thisData.errorMessage)) {
//									msg = thisData.errorMessage;
//								}
//
//							}
//							//跳转
//							window.location.href = "/payment/success?email=" + that.email + "&orderId=" + that.orderId + '&amount=' + that.opctions.amount + '&succeed=' + thisData.succeed + '&symbol=' + that.opctions.symbol + '&currency=' + that.opctions.currency + '&msg=' + msg;
//							//
//						}, function(response) {
//							//请求失败跳转
//							window.location.href = "/payment/success?email=" + that.email + "&orderId=" + that.orderId + '&amount=' + that.opctions.amount + '&succeed=false&symbol=' + that.opctions.symbol + '&currency=' + that.opctions.currency;
//						})
//					}
//				})
//			},
			getInfo() {
				let that = this
				Vue.axios.get(this.apiBasePath + "activity/order/detail/" + that.orderId).then(function(res) {
					that.opctions = res.data;
					that.email = res.data.contactInfo.emailAddress;
					that.refundTimeLimit = res.data.activityInfo.refundTimeLimit * 24;

					//人民币支付
					if(that.opctions.currency == 'CNY') {
						that.id=1
						//微信外部H5
						if(!that.isWx) {
							that.openWxPay({
								tradeType: 'MWEB',
								objectId: that.orderId,
								amount: that.opctions.amount * 100, // 支付金额，单位是“分”
								objectType: 'ACTIVITY'
							});
						}else{
							//code用过或者没有code则从新获取
							var localWxCode = localStorage.getItem('localWxCode');
							if(that.wxcode == localWxCode && that.opctions.currency == 'CNY' || !that.wxcode && that.opctions.currency == 'CNY') {
								location.href = 'https://www.localpanda.com/relay/getWechatToken.html?url=' + encodeURIComponent(location.href);
								return;
							}
							//本地存储code
							localStorage.setItem('localWxCode', that.wxcode);
							
							that.wxInit();
						}
					};
					//默认用来显示支付按钮，微信里面用来公众号支付数据
					that.payData = 1;

				}, function(res) {})
			},
//			pay() {
//				let that = this;
//
//				
//
//				//人民币支付
//				if(this.opctions.currency == 'CNY') {
//					//微信内部
//					if(this.isWx) {
//						this.wxPay(this.payData);
//					}
//					return;
//				}
//
//				that.stripeHandler.open({
//					name: 'Local panda', // 收款方或商家名称，比如 Beansmile
//					description: "", // 待支付商品的描述
//					currency: that.opctions.currency,
//					amount: that.opctions.amount * 100, // 支付金额，单位是“分”
//					locale: 'en_US',
//					closed: function() {
//
//					}
//				})
//			},
			wxInit(){
				var self = this;
				self.axios.get("https://api.localpanda.com/api/payment/wxinfo/get?code=" + this.wxcode+'&orderId='+self.orderId, {
					headers: {
						'Content-Type': 'application/json'
					}
				}).then(function(response) {
					// console.log(response);
					
					var openData = response.data;
					
					self.payData = {
						tradeType: 'JSAPI',
						objectId: self.orderId,//1105955013
						amount: self.opctions.amount * 100,//self.opctions.amount * 100
						openId: openData.openid,
						objectType:'ACTIVITY'
					};
				}, function(response) {});
				
			},
			onBridgeReady(data) {
				var that = this;
				WeixinJSBridge.invoke(
					'getBrandWCPayRequest', {
						"appId": data.appId, //公众号名称，由商户传入     
						"timeStamp": data.timeStamp, //时间戳，自1970年以来的秒数     
						"nonceStr": data.nonceStr, //随机串     
						"package": "prepay_id=" + data.prepayId,
						"signType": data.signType, //微信签名方式：     
						"paySign": data.paySign //微信签名 
					},
					function(res) {
						var thisData = {
							succeed: false
						};

						var msg = '';
						if(/ok/.test(res.err_msg)) {

							//成功
							var pageTracker = _gat._getTracker("UA-107010673-1");
							pageTracker._addTrans(that.orderId, "", that.opctions.amount, "", "", "", "", "");
							pageTracker._addItem(that.orderId, that.opctions.activityId, "", "", that.opctions.amount, "1");
							pageTracker._trackTrans();

							msg = 'ok';
							thisData.succeed = true;
						} else {
							msg = 'fail';
						}
						that.loadingStatus = false;
						//跳转
						window.location.href = "/activity/payment/success?email=" + that.email + "&orderId=" + that.orderId + '&amount=' + that.opctions.amount + '&succeed=' + thisData.succeed + '&msg=' + msg + '&symbol=' + that.opctions.symbol + '&currency=' + that.opctions.currency;
					}
				);
			},

			//微信内部支付
			wxPay(postData){
				var self = this;
				this.loadingStatus = true;
				self.axios.post("https://api.localpanda.com/api/payment/pay/wechat", JSON.stringify(postData), {
					headers: {
						'Content-Type': 'application/json; charset=UTF-8'
					}
				}).then(function(response) {

					//检测超时
					if(response.returnMsg == 'Read timed out') {
						alert('Pay overtime,please try again!');
						return;
					}

					if(typeof WeixinJSBridge == "undefined") {
						if(document.addEventListener) {
							document.addEventListener('WeixinJSBridgeReady', onBridgeReady, false);
						} else if(document.attachEvent) {
							document.attachEvent('WeixinJSBridgeReady', onBridgeReady);
							document.attachEvent('onWeixinJSBridgeReady', onBridgeReady);
						}
					} else {
						self.onBridgeReady(response.data);
					}

				}, function(response) {
					
				})
			},

			//H5唤起微信支付
			openWxPay(postData) {
				var self = this;
				//this.loadingStatus = true;
				self.loadingStatus = true
				self.axios.post("https://api.localpanda.com/api/payment/pay/wechat", JSON.stringify(postData), {
					headers: {
						'Content-Type': 'application/json; charset=UTF-8'
					}
				}).then(function(response) {
					var data = response.data;
					if(data.returnCode == 'SUCCESS') {

						//self.showWxOpenBox = true;
						self.loadingStatus = false;

						var callUrl = 'https://www.localpanda.com/activity/payment/wxMobilePay?email=' + self.email + '&orderId=' + self.orderId + '&amount=' + self.opctions.amount + '&symbol=' + self.opctions.symbol + '&currency=' + self.opctions.currency + '&login=' + (self.logIn ? self.logIn : 0);
						var openWxUrl = data.mwebUrl + '&redirect_url=' + encodeURIComponent(callUrl);

						//唤起微信a标签的href
						self.openWxUrl = openWxUrl;
						self.tryAgainHref = openWxUrl;
						//window.location.href = openWxUrl;

					} else {
						alert(data.returnMsg + ', Try again!')
					}
					self.loadingStatus = false;

				}, function(response) {})
			},
			wxOpenClick() {
				if(/(Android)/i.test(this.ua)) {
					localStorage.setItem('AndroidOpenWx', 'true');
					//this.showWxOpenBox = true;
				}

			},
			//stript支付 token
			getToken(){
				let that=this
				
				that.loadingStatus = true;
				console.log(this.postData)
				if(that.isWx) {
					//微信内部
					if(that.id==1) {
						this.wxPay(this.payData);
					}else{
						this.pay()
					}
					
				}else{
					this.pay()
				}
			},
			pay(){
				let that=this
				that.stripe.createToken(that.cardNumber).then(function(result) {
				       if (result.error) {
				      // Inform the user if there was an error.
				      //console.log(that.loadingStatus)
				      ga('gtag_UA_107010673_2.send', {
						hitType: 'event',
						eventCategory: 'activity_payment',
						eventAction: 'click',
						eventLabel: 'activity_pay_fail'
	
					});
				      	that.loadingStatus = false
				      	//console.log(that.loadingStatus)
					     that.payStatus=true
					     that.payErrMsg=result.error.message
					    } else {
					      // Send the token to your server.
					      //stripeTokenHandler(result.token);
					      that.payStatus=false
					          ga('gtag_UA_107010673_2.send', {
								hitType: 'event',
								eventCategory: 'activity_payment',
								eventAction: 'click',
								eventLabel: 'activity_pay_succ'
			
							});
					      console.log(result.token)
					      if(!that.isPay){
					      	that.stripeTokenHandler(result.token,that.isPay)
						  }
					    }
				   })
			},
			//发起支付
			stripeTokenHandler(token,isPay){
				isPay=true
				let that=this
						let obj = {
							amount: that.opctions.amount * 100,
							currency: that.opctions.currency,
							objectId: that.orderId,
							token: token.id,
							tokenType: token.type,
							objectType: "ACTIVITY"
						}

						//console.log(that.opctions.currency);
						
						Vue.axios.post(that.apiBasePath + "payment/pay/stripe", JSON.stringify(obj), {
							headers: {
								'Content-Type': 'application/json; charset=UTF-8'
							}
						}).then(function(response) {
							 that.payStatus=false
							 
							var thisData = response.data;
							var msg = '';
							//成功
							if(response.status == 200) {
								isPay=false
								var pageTracker = _gat._getTracker("UA-107010673-1");
								pageTracker._addTrans(that.orderId, "", that.opctions.amount, "", "", "", "", "");
								pageTracker._addItem(that.orderId, that.opctions.activityId, "", "", that.opctions.amount, "1");
								pageTracker._trackTrans();

								if(!thisData.succeed && thisData.errorMessage && !/Exception/.test(thisData.errorMessage)) {
									msg = thisData.errorMessage;
								}

							}
							//跳转
							window.location.href = "/activity/payment/success?email=" + that.email + "&orderId=" + that.orderId + '&amount=' + that.opctions.amount + '&succeed=' + thisData.succeed + '&symbol=' + that.opctions.symbol + '&currency=' + that.opctions.currency + '&msg=' + msg;
							//
						}, function(response) {
							//请求失败跳转
							window.location.href = "/activity/payment/success?email=" + that.email + "&orderId=" + that.orderId + '&amount=' + that.opctions.amount + '&succeed=false&symbol=' + that.opctions.symbol + '&currency=' + that.opctions.currency;
						})
					
			},
			// 设置卡元素
			stripeFn() {
				this.stripe=Stripe(payCode)
				console.log(this.stripe)
				var elements = this.stripe.elements({
					fonts: [{
						cssSrc: 'https://fonts.googleapis.com/css?family=Quicksand',
					}, ],
					// Stripe's examples are localized to specific languages, but if
					// you wish to have Elements automatically detect your user's locale,
					// use `locale: 'auto'` instead.
					locale: window.__exampleLocale,
				});
				
				 var elementStyles = {
				    base: {
				      color: '#353a3f',
				      fontWeight: 500,
				      fontSize: '16px',
				      fontSmoothing: 'antialiased',
				      ':focus': {
				        color: '#353a3f',
				      },
				
				      '::placeholder': {
				        color: '#878e95',
				      },
				
				      ':focus::placeholder': {
				        color: '#878e95',
				      },
				    },
				    invalid: {
				      color: '#353a3f',
				      ':focus': {
				        color: '#FA755A',
				      },
				      '::placeholder': {
				        color: '#FFCCA5',
				      },
				    },
				  };

				var elementClasses = {
					focus: 'focus',
					empty: 'empty',
					invalid: 'invalid',
				};

				this.cardNumber = elements.create('cardNumber', {
					style: elementStyles,
					classes: elementClasses,
				});
				this.cardNumber.mount('#card-number');

				var cardExpiry = elements.create('cardExpiry', {
					style: elementStyles,
					classes: elementClasses,
				});
				cardExpiry.mount('#card-expiry');

				var cardCvc = elements.create('cardCvc', {
					style: elementStyles,
					classes: elementClasses,
				});
				cardCvc.mount('#card-cvc');
			},
			confirmation(e) {
				//var query = this.query;
				var self = this;
				self.loadingStatus = true;
				//查询订单
				this.axios.get("https://api.localpanda.com/api/payment/wechat/status?orderId=" + self.orderId + '&flag=1', {
					headers: {
						'Content-Type': 'application/json;'
					}
				}).then(function(response) {
					if(response.status == 200) {
						var succeed = false,
							msg = '';
						if(response.data.succeed) {
							succeed = true;
						} else {
							msg = 'fail';
						}
						window.location.href = "/activity/payment/success?email=" + self.email + "&orderId=" + self.orderId + '&amount=' + self.opctions.amount + "&succeed=" + succeed + '&symbol=' + self.opctions.symbol + '&currency=' + self.opctions.currency + '&msg=' + msg;
					} else {
						alert('Please try again!');
					}
					self.loadingStatus = false;
				}, function(response) {
					alert('Please try again!');
					self.loadingStatus = false;
				})

			},
			tryAgain() {
				//var self = this;
				//window.location.href = 'https://www.localpanda.com/activity/payment/?objectId='+self.orderId+'&login='+(self.logIn?self.logIn:0);
			},
			hideWxOpenBox() {
				this.showWxOpenBox = false;
			}
		},
		created: function() {

		},
		mounted: function() {
			this.orderId = GetQueryString("objectId")
			this.getInfo()
			//this.getToken()
			this.stripeFn();
			this.ua = window.navigator.userAgent.toLowerCase();
			this.isWx = (this.ua.match(/MicroMessenger/i) == 'micromessenger') ? true : false;
//			console.log(this.opctions.currency)
//			if(this.opctions.currency=="CNY"){
//				this.id=0
//			}
			
			
			this.logIn = this.urlQuery.login ? this.urlQuery.login : 0;
			if(!this.logIn) {
				this.logInHide = true;
			}
			
			//检测是否是安卓唤起微信，针对安卓无法跳转回调页面
			if(localStorage.getItem('AndroidOpenWx') == 'true') {
				this.showWxOpenBox = true;
				localStorage.removeItem('AndroidOpenWx');
			}

		}
	}
</script>
<style lang="scss">
	.float{float: right;width: 85%;vertical-align:middle;}
</style>
<style lang="scss" scoped>
	 .icon {
       width: 1em; height: 1em;
       vertical-align: -0.15em;
       fill: currentColor;
       overflow: hidden;
    }
	.payNow {
		.oderdetial {
			padding: 0 0 1.8rem;
			.back {
				padding: 0 0.4rem;
				height: 1.1rem;
				line-height: 1.1rem;
				text-align: center;
				position: relative;
				font-size: 0.34rem;
				font-weight: bold;
				i {
					position: absolute;
					left: 0.4rem;
				}
			}
			.payfordetail {
				padding: 0 0.4rem;
				.headcommon {
					border-radius: 0.106666rem;
					padding: 0.4rem 0.3rem;
					box-shadow: 0px 8px 40px 0px rgba(0, 0, 0, 0.06);
					.serviceform {
						h3 {
							font-size: 0.36rem;
							font-weight: bold;
						}
						.service {
							font-size: 0.346666rem;
							.serviceInfo {
								margin-top: 0.2rem;
								b {
									font-size: 0.32rem;
								}
								span {
									font-size: 0.3rem;
									display: inline-block;
									margin-left: 0.053333rem;
								}
								.blod {
									font-size: 0.4rem;
									font-weight: bold;
								}
							}
							.hint {
								margin-top: 0.26rem;
								p {
									font-size: 0.24rem;
									color: #e14f3f;
									&:last-child {
										margin-top: 0.2rem;
									}
								}
							}
						}
					}
				}
				.payment {
					margin-top: 0.2rem;
					.striptcard {
						height: 1.4rem;
						line-height: 1.4rem;
						border-bottom: 0.026666rem solid #ebebeb;
						position: relative;
						i {
							font-size: 0.7rem;
							color: #f4b33f;
							vertical-align: middle;
							
						}
						span {
							font-size: 0.38rem;
							display: inline-block;
							margin-left: 0.4rem;
							vertical-align: middle;
						}
						.selectCarType{
							width: 0.34rem;
							height: 0.34rem;
							border-radius: 50%;
							border: 0.12rem solid #1bbc9d;
							position: absolute;
							right: 0;
							top: 50%;
							transform: translateY(-50%);
						}
						.selectCarTypeNull{
							width: 0.38rem;
							height: 0.38rem;
							border-radius: 50%;
							border:0.02rem solid #d0d0d0;
							position: absolute;
							right: 0;
							top: 50%;
							transform: translateY(-50%);
						}
					}
					.paymentCard {
						margin-top: 0.44rem;
						padding:0 0.266666rem;
						.cardNub{
							label{
								font-size: 0.32rem;
								font-weight: bold;
							}
							.cardNub_{
								padding: 0.32rem 0 0.1rem;
								border-bottom: 0.026666rem solid #ebebeb;
								i {
									font-size: 0.7rem;
									color: #f4b33f;
									margin-top: -0.266666rem;
									display: inline-block;
									
								}
								.StripeElement{
									margin-top: 0.06rem;
								}
							}
						}
						.row{
							margin-top: 0.44rem;
							display: -ms-flexbox;
  							display: flex;
  							.row-item{
  								flex: 1;
  								margin-right:0.8rem;
  								border-bottom: 0.026666rem solid #ebebeb;
  								padding-bottom:0.56rem; 
  								&:last-child{
  									margin-right: 0;
  								}
  								label{
  									
  									font-size: 0.32rem;
  									font-weight: bold;
  									display:block;
  									margin-bottom: 0.4rem;
									}
									
  							}
  							
						}
						
					}
				}
			}
			.btn_pay {
				position: fixed;
				bottom: 0;
				left: 0;
				width: 100%;
				padding: 0.26rem 0.4rem;
				background: #fff;
				button,
				a {
					display: block;
					width: 100%;
					height: 0.9rem;
					line-height: 0.9rem;
					background-image: linear-gradient(270deg, #009efd 0%, #1bbc9d 100%);
					text-align: center;
					color: #fff;
					border-radius: 0.6rem;
					font-size: 0.346666rem;
					font-weight: bold;
				}
			}
		}
	}
	
	.picRate {
		float: right;
		color: #fff;
		position: relative;
		opacity: 0.5;
		height: 0.82rem;
		margin-right: 0.3rem;
		span {
			font-size: 10px;
		}
		.iconfont {
			float: right;
			margin-top: 0.6rem;
			height: 0.8rem;
			line-height: 0.8rem;
			text-align: center;
			font-size: 22px;
			color: #666;
			margin-top: 0;
		}
		.currency_type {
			background: none;
			border: none;
			height: 0.8rem;
			padding: 0 0 0 0.2rem;
			font-size: 0.34rem;
			margin-top: 0;
			-webkit-appearance: none;
			-moz-appearance: none;
			appearance: none;
		}
	}
	
	.confirm_all {
		background-color: rgba(0, 0, 0, 0.5);
		height: 100vh;
		color: #fff;
		width: 100%;
		position: absolute;
		left: 0;
		top: 0;
		z-index: 9;
	}
	
	.confirm_box {
		z-index: 9;
		position: absolute;
		left: 10%;
		top: 50%;
		transform: translateY(-50%);
		width: 80%;
		background-color: #fff;
		h3 {
			color: #333;
			margin-top: 0.6rem;
			text-align: center;
			font-size: 0.34rem;
			line-height: 0.48rem;
		}
		.btn_list {
			padding: 0 0.4rem 1rem;
			a {
				display: block;
				height: 1rem;
				line-height: 1rem;
				color: #888;
				text-align: center;
				background-color: #eee;
				border-radius: 0.5rem;
				margin-top: 0.5rem;
				font-size: 0.3rem;
			}
			.btn_ok {
				color: #fff;
				background: -webkit-gradient(linear, left top, right top, from(#1bbc9d), to(#009efc));
				background: linear-gradient(to right, #1bbc9d, #009efc);
			}
		}
	}
</style>