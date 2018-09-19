<template>
	<div class="fillYourInfo" id="fillYourInfo">
		<Head></Head>
		<div class="fillInfo" @touchmove="hideFiexd=false">
			<div class="back">
				<i class="iconfont" @click="back">&#xe615;</i>
				<h3>Fill in your information</h3>
			</div>
			<div class="safeguard">
				<ul>
					<li><i class="iconfont">&#xe654;</i>We protect your personal information</li>
					<li><i class="iconfont">&#xe654;</i>100% secure payment</li>
					<li><i class="iconfont">&#xe654;</i>No hidden booking or credit card fees</li>
					<li><i class="iconfont">&#xe654;</i>Instant confirmation after booking</li>
					<li  v-if="opctions.finalRefundPeriod"><i class="iconfont">&#xe654;</i>Free cancellation or rescheduling before {{formatDate(opctions.finalRefundPeriod)}}</li>
				</ul>
			</div>
			<div class="oderInfo">
				<div class="oderTitle">{{opctions.title}}</div>
				<div class="oderDetail">
					<!--<span>{{opctions.startDate}}</span>
					<span v-if="opctions.startTime">{{opctions.startTime}}</span>
					<span v-if="opctions.adultNum==1&&opctions.childrenNum==0">1 Person</span>
					<span v-else>{{opctions.adultNum+opctions.childrenNum}} People</span>-->
					<span v-if="opctions.adultNum">Number of adult(s):  {{opctions.adultNum}}</span>
					<span v-if="opctions.childrenNum">Number of child(ren): {{opctions.childrenNum}}</span>
					<p style="margin-top: 0.05rem;">
						<span>Travel Date:  {{opctions.startDate}}</span>
						<span v-if="opctions.startTime">{{opctions.startTime}}</span>
					</p>
				</div>
			</div>
			
			<div class="orderContact">
				<h4>Contact Information</h4>

				<div class="inputItem" :class="{err:oderFirstNameErr}">
					<p>First Name <b>*</b><span class="red" v-if="oderFirstNameErr">Field is required</span></p>
					<input :class="{err:oderFirstNameErr}" @blur="gaBlur(0,true)" @focus="fousOderfisrtname" v-model="oderFirstName" />
				</div>
				<div class="inputItem" :class="{err:oderlastNameErr}">
					<p>Last Name <b>*</b> <span  class="red" v-if="oderlastNameErr">Field is required</span></p>
					<input :class="{err:oderlastNameErr}" @focus="fousoderlastName" @blur="gaBlur(1)" v-model="oderlastName" />
				</div>

				<div class="inputItem" :class="{err:emailAddressErr}">
					<p>Email Address <b>*</b> <span  class="red" v-if="emailAddressErr">Field is required</span></p>
					<input :class="{err:emailAddressErr}" @focus="fousEmal" @blur="gaBlur(2)" v-model="emailAddress" placeholder="We'll send your confirmation here"/>
				</div>
				<div class="inputItem" :class="{err:codeErr}">
					<p>Country or Territory Code <b>*</b> <span  class="red" v-if="codeErr">Field is required</span></p>
					<div class="inputbox">
						<input :class="{err:codeErr}" readonly="readonly" onfocus="this.blur()" @click="showCodeFn(0)" v-model="mobileCode" />
						<i class="iconfont">&#xe60f;</i>
					</div>
				</div>
				<div class="inputItem" :class="{err:phoneErr}">
					<p>Mobile Phone <b>*</b> <span class="red" v-if="phoneErr">Field is required</span></p>
					<input :class="{err:phoneErr}"  @focus="fousPhone" @blur="gaBlur(3)" v-model="phone" placeholder="For our guide to contact you"/>
				</div>
			</div>

			<div class="Comments">
				<div class="information">
					<h4>Other Information</h4>
					<textarea  @blur="gaBlur(4)" v-if="opctions.pickup==1" v-model="comments" placeholder="You can fill out your travel preferences here for us to personalize your trip" @focus="commentFocus"></textarea>
					<textarea  @blur="gaBlur(4)" v-else v-model="comments" @focus="commentFocus"></textarea>
				</div>
			</div>
			<div class="coupon">
				<checkbox v-model="checkedAll" :change="changeFn">Have a Gift Card or Coupon Code? Proceed to checkout to redeem it.</checkbox>
				<div class="couponInput" v-if="checkedAll">
					<input placeholder="Enter a gift card or coupon code" id="coupon" @keyup.enter="validateCode" v-model="couponCode" />
					<button @click="validateCode">Enter</button>
					<p v-if="hasCode==0"><i class="iconfont">&#xe654;</i>- {{couponType=="RATE"?"":opctions.symbol}}{{couponType=="RATE"?couponRate*100:opctions.couponDiscount}}{{couponType=="RATE"?"%":""}} {{couponType=="RATE"?"off":""}}  (Coupon discount)</p>
					<p v-if="hasCode==1" style="color: red;">The promotional code you entered is invalid. Please try again.</p>
				</div>
			</div>
			<p class="booktip" v-if="!logIn">
				<i class="iconfont">&#xe617;</i>
				<span>As a guest user, you can access your order details through your name and email</span>
			</p>
			<!-- <div  class="hint"></div> -->
			<div class="price">Total ({{opctions.currency}}): <span @click="showPrice=!showPrice">{{opctions.symbol}}{{opctions.amount}}<i class="iconfont">&#xe659;</i></span></div>
			<div class="nextBtn clearfix" v-show="!hideFiexd" @touchmove="stopMove">
				<div class="next" @click="placeOrder">NEXT</div>
			</div>
			<!-- <div v-if="isWork()" class="chat">Having trouble booking ?&nbsp;&nbsp;&nbsp;&nbsp; <a @click="chat()">Chat with Us</a></div> -->
		</div>

		<transition name="fade">
			<booking v-show="isShowBook" :countryCode="countryCode" @getCode="setCode" @back="setback" class="view"></booking>
		</transition>

		<div class="winBg" @touchmove="stopMove" :class="{winBgHide:!showPrice}" @click="showPrice=false"></div>
		<div class="price_info" :class="{showPrice:showPrice}">
			<div class="price_info_tit">
				<span class="price_info_close iconfont" @click="showPrice=false">&#xe629;</span> Detail:
			</div>
			<p><span>{{opctions.symbol}}{{opctions.adultsPic}}</span>{{opctions.symbol}}{{opctions.averagePrice}} x {{opctions.adultNum+opctions.childrenNum}} People</p>
			<p v-if="opctions.childrenNum && opctions.childDiscountP">- {{opctions.symbol}}{{returnFloat(opctions.childrenNum*opctions.childDiscountP)}} (Children discount)</p>
			<p v-if="couponType">- {{opctions.symbol}}{{opctions.couponDiscount}} (Coupon discount)</p>
			<div class="boxline"></div>
			<p><span>{{opctions.symbol}}{{opctions.amount}}</span>Total ({{opctions.currency}})</p>
		</div>
		 <!-- <Talk :zendeskStatus="zendeskStatus" @getShowZendesk="setShowZendesk"></Talk> -->
		<!-- 优惠券校验失败 提示 -->
		<div class="dialog" v-if="orderHasCouponRate">
			<div class="dialogContent">
				<p>The promotional code you entered is invalid. You can continue to pay at the original price or enter your code again.</p>
				<div class="button">
					<button @click="continueFn">Continue</button>
					<button @click="enterAgain">Enter Again</button>
				</div>
			</div>
		</div>
		<Loading :loadingStatus="loadingStatus"></Loading>
	</div>
</template>

<script>
	import Vue from 'vue'
	import booking from '~/components/booking'
	// import Talk from '~/components/booking/talk'
	import { regExp,formatDate } from '~/assets/js/utils.js'
	import countryCode from '~/assets/js/countryCode.js'
	import Head from '~/components/header/index'
	import { checkboxGroup, checkbox } from "~/plugins/panda/checkbox/";
	import Loading from "~/components/plugin/Loading"
	export default {
		name: 'fillYourInfo',
		async asyncData({
			apiBasePath
		}) {
			return {
				apiBasePath: apiBasePath
			}
		},
		head() {
			let title = 'Fill in your Booking details informaiton ';
			let description = 'Fill out your info so we can confirm your booking!'
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
			};
		},
		data() {
			return {
				opctions: {},
				//订单联系人
				oderFirstName: '',
				oderFirstNameErr: false,
				oderlastName: '',
				oderlastNameErr: false,
				emailAddress: '',
				emailAddressErr: false,
				phone: '',
				phoneErr: false,
				//出游联系人
//				TravellerFirstName: '',
//				TravellerFirstNameErr: false,
//				TravellerlastName: '',
//				TravellerlastNameErr: false,
//				TravelleremailAddress: '',
//				TravelleremailAddressErr: false,
//				Travellerphone: '',
//				TravellerphoneErr: false,

				comments: '', //提交意见咨询

				isShowAlertTitle: false, //弹框返回状态
				alertMessage: "", //弹框内容
				alertTitle: "", //弹框标题
				logIn: '', //是否登陆
				isShowAlert: false, //错误弹框
				check: 0, //checked
				addOder: false,

				//国家
				mobileCode: '',
				codeErr: '',
				countryCode: countryCode.phone_countries,
				country:'',

				//显示code列表
				showCode: false,
				code: '',

				TravellerCodeErr: false,
				mobileTravellCode: "", //选中国家区号
				TravellerCode: '', //区号
				showTravellCode: false,

				index: "", //区分联系人
				isShowBook: false,

				showPrice: false,
				hideFiexd: false,

				checkedAll: false, //选择优惠券
				couponCode: '', //优惠券
				hasCode: 100, //0 查到优惠券显示提示   1 没有查到优惠券提示  100默认没有提示
				couponRate: '', //优惠率
				orderHasCouponRate: false, //下单 判断是否含有优惠券
				couponType:'',//优惠券类型
				standard:0,
				loadingStatus:false,
				 zendeskStatus:false

			}

		},
		components: {
			Head,
			booking,
			checkboxGroup,
			checkbox,
			Loading,
			// Talk
		},
		methods: {
			chat(){
				
				this.zendeskStatus=true;
				document.documentElement.scrollTop=0;
				history.pushState({
					'type': 'showChat'
				}, '');
			},
			setShowZendesk(val){
				this.zendeskStatus=val
				history.back()
			},
			changeFn(e) {
				let self=this
				if(!e.target.checked) {
					self.hasCode=100
					self.opctions.amount=self.returnFloat(self.opctions.adultsPic - self.returnFloat(self.opctions.childrenNum * self.opctions.childDiscountP))
					self.couponRate=''
					self.couponCode='';
					self.couponType=""
				}
			},
			//验证couponCode
			validateCode() {
				let self=this
				var opctions = self.opctions,
					details = opctions.details;
				var people = opctions.adultNum + opctions.childrenNum;
				var price=opctions.adultsPic
				
				if(self.couponCode){
					self.loadingStatus=true
					self.axios.get("https://api.localpanda.com/api/order/coupon/"+self.couponCode).then(res=>{
						
						if(res.status==200&&res.data){
							self.loadingStatus=false
							self.hasCode=0
							self.nodeCode=res.data.code
							if(res.data.type){
								self.couponType=res.data.type
								if(res.data.type=="RATE"){
									self.couponRate=res.data.discount
									self.opctions.couponDiscount=self.returnFloat(self.returnFloat(self.opctions.adultsPic - self.returnFloat(self.opctions.childrenNum * self.opctions.childDiscountP)) * self.couponRate)
									
									
								}else{
									self.standard=res.data.discount
									self.opctions.couponDiscount=self.standard
									
								}
								self.opctions.amount=self.returnFloat(self.opctions.adultsPic - self.returnFloat(self.opctions.childrenNum * self.opctions.childDiscountP)-self.opctions.couponDiscount)
							}
						}else{
							self.loadingStatus=false
							self.hasCode=1
							self.opctions.amount=self.returnFloat(self.opctions.adultsPic - self.returnFloat(self.opctions.childrenNum * self.opctions.childDiscountP))
						}
					},res=>{})
				
				}
				
				
			},

			//关闭国家
			setback(val) {
				this.isShowBook = val;
				//关闭后退浏览器
				history.back()
			},
			//获取code
			setCode(val) {
				
				if(this.index == 0) {
					this.country = val.country;
					this.mobileCode = val.mobileCode;
					this.code = val.code;
				} else {
					this.mobileTravellCode = val.mobileCode
					this.TravellerCode = val.code
				}
				this.isShowBook = val.status;

				//关闭后退浏览器
				//history.back()
			},
			back() {
				history.back()
			},
			//显示国家
			showCodeFn(index) {
				ga('gtag_UA_107010673_2.send', {
					hitType: 'event',
					eventCategory: 'activity_booking',
					eventAction: 'click',
					eventLabel: 'country_code_open',
				});
				if(index == 0) {
					this.codeErr = false
					this.index = 0

				} else {
					this.TravellerCodeErr = false
					this.index = 1
				}
				this.isShowBook = true;

				//浏览器弹窗后，添加一个新页面记录。
				history.pushState({
					'type': 'showDialog'
				}, '');
			},
			checkFn(id) {
				if(id == 0) {
					this.check = 1

				} else {

					this.check = 0
					this.TravellerFirstName = ''
					this.TravellerlastName = ''
					this.TravelleremailAddress = ''
					this.Travellerphone = ''

				}
			},
			getIsShowAlert(val) {
				this.isShowAlert = val;
			},
			getIsShowAlertFn(val) {
				this.isShowAlertTitle = val;
			},

			fousOderfisrtname(e) {
				this.oderFirstNameErr = false;

			},
			fousoderlastName(e) {
				this.oderlastNameErr = false;

			},
			fousEmal(e) {
				this.emailAddressErr = false;

			},
			fousPhone(e) {
				this.phoneErr = false;

			},
			fousFirst(e) {
				this.TravellerFirstNameErr = false

			},

			fousLastName(e) {
				this.TravellerlastNameErr = false;

			},
			fousidcard(e) {
				this.TravelleremailAddressErr = false;

			},
			fousphonenumb(e) {
				this.TravellerphoneErr = false;

			},
			gaBlur(id, hideBtn) {

				if(id == 0) {
					if(this.oderFirstName) {
						ga('gtag_UA_107010673_2.send', {
							hitType: 'event',
							eventCategory: 'activity_booking',
							eventAction: 'input',
							eventLabel: 'first_name',
						});
						ga('gtag_UA_107010673_2.send', {
							hitType: 'event',
							eventCategory: 'activity_booking',
							eventAction: 'input',
							eventLabel: 'booking_input',
						});
					}

				} else if(id == 1) {
					if(this.oderlastName) {
						ga('gtag_UA_107010673_2.send', {
							hitType: 'event',
							eventCategory: 'activity_booking',
							eventAction: 'input',
							eventLabel: 'last_name',
						});
						ga('gtag_UA_107010673_2.send', {
							hitType: 'event',
							eventCategory: 'activity_booking',
							eventAction: 'input',
							eventLabel: 'booking_input',
						});
					}

				} else if(id == 2) {
					if(this.emailAddress) {
						ga('gtag_UA_107010673_2.send', {
							hitType: 'event',
							eventCategory: 'activity_booking',
							eventAction: 'input',
							eventLabel: 'email_address',
						});
						ga('gtag_UA_107010673_2.send', {
							hitType: 'event',
							eventCategory: 'activity_booking',
							eventAction: 'input',
							eventLabel: 'booking_input',
						});
					}

				} else if(id == 3) {
					if(this.phone) {
						ga('gtag_UA_107010673_2.send', {
							hitType: 'event',
							eventCategory: 'activity_booking',
							eventAction: 'input',
							eventLabel: 'phone_number',
						});
						ga('gtag_UA_107010673_2.send', {
							hitType: 'event',
							eventCategory: 'activity_booking',
							eventAction: 'input',
							eventLabel: 'booking_input',
						});
					}
				} else {
					if(this.comments) {
						ga('gtag_UA_107010673_2.send', {
							hitType: 'event',
							eventCategory: 'activity_booking',
							eventAction: 'input',
							eventLabel: 'comment',
						});
						ga('gtag_UA_107010673_2.send', {
							hitType: 'event',
							eventCategory: 'activity_booking',
							eventAction: 'input',
							eventLabel: 'booking_input',
						});
					}

				}

			},
			
			//国际时间转成美国时间
			formatDate:formatDate,
			gaFail() {
				ga('gtag_UA_107010673_2.send', {
					hitType: 'event',
					eventCategory: 'activity_booking',
					eventAction: 'submit',
					eventLabel: 'activity_order_fail',
				});
			},
			//判断是否使用优惠券下单
			placeOrder(){
				let next = false
				let that=this
				//that.addOder = true
				if(that.oderFirstName == "" || regExp.isNub(that.oderFirstName) || regExp.isCode(that.oderFirstName)) {
					that.oderFirstNameErr = true
					next = false;

				} else if(that.oderlastName == "" || regExp.isNub(that.oderlastName) || regExp.isCode(that.oderlastName)) {
					that.oderlastNameErr = true
					next = false

				} else if(!regExp.isEmail(that.emailAddress)) {
					that.emailAddressErr = true
					next = false

				} else if(!that.mobileCode) {
					that.codeErr = true
					next = false
					
				} else if(that.phone == "" || !regExp.isMobil(that.phone)) {
					that.phoneErr = true
					next = false

				}else {
					next = true
					if(that.checkedAll){
						if(that.couponType){
							that.next()
						}else{
							that.orderHasCouponRate=true
						}
					}else{
						that.next()
					}
				
				}
				if(next==false){
					that.gaFail()
				}

				//跳转到输入框的位置
				setTimeout(function() {
					var error = document.querySelectorAll('.err')[0];
					if(error) {
						error.scrollIntoViewIfNeeded();
					}
				}, 80);
			},
			continueFn(){
				let self=this
				self.orderHasCouponRate=false
				self.next()
			},
			enterAgain(){
				let self=this
				self.orderHasCouponRate=false
				document.querySelector("#coupon").focus();
				self.hasCode=100
				
			},
			
			next() {
				var obj;
				var deviceType = /(iPad)/i.test(navigator.userAgent) ? 'IPAD' : 'MOBILE';
				const that = this
				//that.addOder = true
					ga('gtag_UA_107010673_2.send', {
						hitType: 'event',
						eventCategory: 'activity_booking',
						eventAction: 'submit',
						eventLabel: 'activity_order_succ',
					});
						obj = {
							 "userId": localStorage.getItem("userid")
		            ? localStorage.getItem("userid"): null,
							"activityId": that.opctions.activityId,
							"amount": that.opctions.amount,
							"currency": that.opctions.currency,
							"adultNum": that.opctions.adultNum,
							"childrenNum": that.opctions.childrenNum,
							"infantNum": that.opctions.infantNum,
							"startDate": that.opctions.startDate,
							"startTime": that.opctions.startTime,
							"averagePrice": that.opctions.averagePrice,
							"couponDiscount":that.couponType?that.opctions.couponDiscount:null,
							"couponCode":that.couponType?that.couponCode:null,
							"childDiscount": that.opctions.childDiscount,
							"comments": that.comments ? that.comments : null,
							"finalRefundPeriod":that.opctions.finalRefundPeriod,
							"contactInfo": {
								"firstName": that.oderFirstName,
								"lastName": that.oderlastName,
								"phoneNumber": that.code + that.phone,
								"emailAddress": that.emailAddress,
								"nationality":that.country
							},
							"utcOffset": new Date().getTimezoneOffset() / 60 * -1,
							"deviceType": deviceType,
							"guideId": that.opctions.guideId
						}

						if(that.addOder == false) {
							that.addOder = true
							Vue.axios.put(that.apiBasePath +"order/activity", JSON.stringify(obj), {
								headers: {
									'Content-Type': 'application/json; charset=UTF-8'
								}
							}).then(function(response) {
								var loginState = (that.logIn ? that.logIn : 0);
								var thisUrl = "/activity/payment/?objectId=" + response.data.response + '&login=' + loginState;
								if(obj.currency == 'CNY') {
									var ua = window.navigator.userAgent.toLowerCase();
									var isWx = (ua.match(/MicroMessenger/i) == 'micromessenger') ? true : false;
									if(isWx) {
										window.location.href = 'https://www.localpanda.com/relay/getWechatToken.html?url=' + encodeURIComponent('https://www.localpanda.com' + thisUrl);
									} else {
										window.location.href = thisUrl;
									}

								} else {
									window.location.href = "/activity/payment/?objectId=" + response.data.response + '&login=' + loginState;
								}

							}, function(response) {})
						}
					//}	
				
				

			},
			commentFocus(e) {
				// var fillYourInfo = document.getElementById('fillYourInfo');
				// fillYourInfo.style = 'height:'+document.documentElement.clientHeight+'px;overflow-y:scroll;';

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
			stopMove(e) {
				e.preventDefault();
			},
			 isWork(){
				//获取东八区时区
				var nowDate = this.getLocalTime(8),
					nowHour = nowDate.getHours();
					console.log(nowHour)
					console.log(this.getLocalTime(8))
				if(nowHour>=9 && nowHour<20){
					return true;
				};
				return false;
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
		},
		created: function() {

		},
		mounted: function() {
			var self = this;

			this.opctions = JSON.parse(localStorage.getItem("orderInfo"))
			this.logIn = window.localStorage.getItem("logstate")
			/*this.goBackFn()*/
			console.log(this.opctions);

			//浏览器事件处理
			window.onpopstate = function(event) {
				if(self.isShowBook) {
					self.isShowBook = false;
				}
				if(self.zendeskStatus){
					self.zendeskStatus=false
				}
			};

		},
		watch: {
			
			couponCode(val, oldVal) {
				this.couponType = ""
				this.hasCode = 100
				this.opctions.amount = this.returnFloat(this.opctions.adultsPic - this.returnFloat(this.opctions.childrenNum * this.opctions.childDiscountP))
			},
		}
	}
</script>

<style lang="scss" scope>
.chat{
	padding: 0.4rem;
	color: red;
	a{
		text-decoration: underline;
		color: #353a3f;
		font-weight: bold;
	}
}
/** 保障 **/
.safeguard{
	background: #faf9f8;
	padding: 0.2rem 0 0.2rem 0.2rem;
	padding-left:0.3rem;
	ul{
		li{
			font-size: 0.26rem;
			i{
				font-size: 0.2rem;
				display: inline-block;
				margin-right: 0.2rem;
			}
		}
	}
}
/** 优惠券  **/
	.checkbox_label .checkbox_content {
			white-space: normal!important;
			padding-left: 0.046rem;
		}
		
		.checkbox_box {
			float: left;
			margin-left: -0.4rem;
		}
		
		.checkbox_label {
			padding-left: 0.4rem;
		}
	

	
	.coupon {
		background: #faf9f8;
		margin-top:0.2rem;
		font-size: 0.24rem;
		box-shadow: 0px 2px 6px 0px rgba(0, 0, 0, 0.1);
		padding: 0.2rem;
		a {
			color: #1bbc9d;
		}
		.couponInput {
			margin-top: 0.4rem;
			input {
				width: 78%;
				height: 0.8rem;
				border-radius: 0.1rem;
				border: solid 1px #dde0e0;
			}
			button {
				display: inline-block;
				height: 0.6rem;
				line-height: 0.6rem;
				width: 20%;
				margin-left: 2%;
				border-radius: 0.4rem;
				color: #fff;
				font-weight: bold;
				background-image: linear-gradient(-90deg, #009efd 0%, #1bbc9d 100%);
			}
			p {
				font-size: 0.28rem;
				margin-top: 0.3rem;
				font-weight: bold;
				i {
					font-size: 0.24rem;
					color: #1bbc9d;
					margin-right: 0.2rem;
				}
			}
		}
	}
	/** 优惠券校验失败 提示  **/
	.dialog{
		position: fixed;
		width: 100%;
		height: 100%;
		left: 0;
		top: 0;
		background: rgba(0,0,0,0.6);
		.dialogContent{
			position: absolute;
			width:92%;
			height:4.5rem;
			left:50%;
			top:50%;
			transform: translate(-50%,-50%);
			background:#fff;
			padding:0.4rem 10px 0.2rem;
			border-radius: 0.3rem;
			box-shadow: 0px 2px 6px 0px rgba(0, 0, 0, 0.1);
			p{
				font-size: 0.32rem;
				font-weight: bold;
				text-align: center;
				margin-top: 0.6rem;
			}
		}
		.button{
			margin:0.6rem auto 0;
			text-align: center;
			button{
				width: 2.5rem;
				height:0.8rem;
				&:first-child{
					margin-right: 0.4rem;
				}
				color:#fff;
				font-weight:bold;
				font-size: 0.28rem;
				background-image: linear-gradient(-90deg, #009efd 0%, #1bbc9d 100%);
				border-radius: 0.4rem;
				cursor: pointer;
			}
		}
	}
	
	
	
	.fillYourInfo {
		.fillInfo {
			padding: 0 0.4rem 0.5rem;
			.back {
				line-height: 1.013333rem;
				i {
					font-size: 0.32rem;
					font-weight: bold;
					color: #666;
					
				}
				h3 {
					text-align: center;
					width: 95%;
					font-size: 0.44rem;
					font-weight: bold;
					display: inline-block;
				}
			}
			
			.oderInfo {
				margin-top: 0.2rem;
				.oderTitle {
					font-size: 0.34rem;
					font-weight: bold;
					line-height: 1.3;
				}
				.oderDetail {
					padding: 0.15rem 0 0.4rem;
					border-bottom: 2px solid #ebebeb;
					span {
						font-size: 0.26rem;
						margin-right: 0.4rem;
						&:last-child {
							margin-right: 0;
						}
					}
				}
			}
			.hint{
				padding: 0.2rem;
				color: #878e95;
				
			}
			.orderContact {
				h4 {
					padding: 0.3rem 0 0.2rem;
					font-size: 0.32rem;
				}
				.inputItem {
					margin-top: 0.2rem;
					//padding-bottom: 0.28rem;
					/*border-bottom: 2px solid #ebebeb;*/
					b {
						color: red;
					}
					p {
						font-size: 0.24rem;
						color: #878e95;
					}
					.inputbox {
						position: relative;
						i {
							position: absolute;
							right: 0.1rem;
							top: 0.4rem;
							color: #878e95;
							font-size: 0.18rem;
						}
					}
					input {
						width: 100%;
						height: 0.9rem;
						line-height: 0.9rem;
						border: 1px solid #dde0e0;
						border-radius: 0.06rem;
						padding: 0 0.24rem 0 0.24rem;
						font-size: 0.36rem;
						margin-top: 0.133333rem;
						overflow: hidden;
						/*超出部分隐藏*/
						white-space: nowrap;
						/*不换行*/
						text-overflow: ellipsis;
						/*超出部分文字以...显示*/
						&:-webkit-placeholder {
							/* Mozilla Firefox 4 to 18 */
							font-size: 0.28rem;
							color: #878e95;
						}
					}
				}
			}
			.check {
				margin-top: 0.2rem;
				position: relative;
				span {
					font-size: 0.24rem;
					margin-left: 0.7rem;
					display: block;
				}
				.checkbox {
					position: absolute;
					left: 0;
					width: 0.44rem;
					height: 0.44rem;
					text-align: center;
					border: 1px solid #ccc;
					border-radius: 50%;
					top: 50%;
					margin-top: -0.24rem;
					cursor: pointer;
					line-height: 0.44rem;
					color: #fff;
					font-size: 0.24rem;
				}
				.backgrond {
					background-image: linear-gradient(270deg, #009efd 0%, #1bbc9d 100%);
				}
			}
			.Comments {
				margin-top: 0.2rem;
				.information {
					h4 {
						font-size: 0.24rem;
						span {
							color: #878E95;
						}
					}
					;
					textarea {
						height: 1.893333rem;
						border: 1px solid #dde0e0;
						border-radius: 0.08rem;
						width: 100%;
						padding-left: 0.25rem;
						padding-top: 0.2rem;
						margin-top: 0.2rem;
						font-size: 0.28rem;
						font-family: Arial;
						&:-webkit-placeholder {
							/* Mozilla Firefox 4 to 18 */
							font-size: 0.28rem;
							color: #dde0e0;
						}
					}
				}
				p {
					margin-top: 0.22rem;
					color: red;
				}
			}
			.booktip {
				margin-top: 0.4rem;
				i{
					display: inline-block;
					margin-top: -0.02rem;
					font-size: 0.28rem;
				}
				span{
					float: right;
					width: 95%
				}
			}
		}
		.nextBtn {
			margin-top: 0.4rem;
			width: 100%;
			background: #fff;
			// position: fixed;
			// bottom: 0;
			// left: 0;
			// z-index: 101;
			.fiexd_content {
				width: 100%;
				height: 100%;
				overflow: hidden;
				padding: 0.1rem 0.4rem;
				background-color: #fff;
				position: relative;
				z-index: 3;
			}
			.next {
				padding: 0 1rem;
				height: 1rem;
				background-image: linear-gradient(270deg, #009efd 0%, #1bbc9d 100%);
				font-size: 0.3rem;
				color: #FFF;
				text-align: center;
				line-height: 1rem;
				border-radius: 0.5rem;
			}
		}
		.err {
			border-color: red!important;
			color: red!important;
		}
		.view {

			transition: all ease-in .2s;
		}
		.fade-enter-active, .fade-leave-active {
		transition: opacity .2s;
		}
		.fade-enter,
		.fade-leave-to/* .fade-leave-active below version 2.1.8 */
		{
			opacity: 0;
		}
		.price_info {
			-webkit-transition: all 0.2s linear 0s;
			transition: all 0.2s linear 0s;
			transform: translateY(-50%);
			-webkit-transform: translateY(-50%);
			padding: 0.3rem 0.4rem 0.4rem;
			width: 94%;
			position: fixed;
			left: 3%;
			top: 50%;
			z-index: -1;
			opacity: 0;
			background-color: #fff;
			.price_info_tit {
				font-size: 0.4rem;
				padding-bottom: 0.25rem;
				.price_info_close {
					font-size: 0.5rem;
					position: absolute;
					right: 0.1rem;
					top: 0;
					width: 1rem;
					height: 0.9rem;
					line-height: 0.9rem;
					text-align: center;
				}
			}
			p {
				font-size: 0.36rem;
				padding: 0.06rem 0;
				span {
					float: right;
				}
			}
			.boxline {
				border-top: 1px solid #ebebeb;
				margin: 0.3rem 0;
			}
		}
		.price {
			text-align: center;
			font-size: 0.36rem;
			line-height: 0.5rem;
			margin-top: 0.4rem;
			span {
				font-size: 0.4rem;
				display: inline-block;
				margin-left: 0.4rem;
				vertical-align: top;
				padding-right: 0.2rem;
			}
			i {
				font-size: 0.42rem;
				color: #878E95;
				margin-left: 0.15rem;
			}
		}
		.showPrice {
			z-index: 100;
			opacity: 1;
		}
		.red{
			color: red!important;
			display: inline-block;
			margin-left: 0.2rem;
		}
	}
</style>

<style lang="scss">
	.fillYourInfo{
		.header_search_icon{
			display: none;
		}
		.selectCurrey_box{
			display: none;
		}
		#launcher {
			bottom: 2.133333rem!important;
		}
		
		::-webkit-input-placeholder,::-webkit-textarea-placeholder {
			/* WebKit browsers */
			font-size: 0.28rem;
			color: #878e95;
		}
	}
	
</style>