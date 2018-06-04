<template>
	<div class="fillYourInfo" id="fillYourInfo">
		<div class="back"><i class="iconfont" @click="back">&#xe615;</i></div>
		<div class="fillInfo">
			<h3>Fill in your information</h3>
			<div class="oderInfo">
				<div class="oderTitle">{{opctions.title}}</div>
				<div class="oderDetail">
					<span>{{opctions.startDate}}</span>
					<span v-if="opctions.startTime">{{opctions.startTime}}</span>
					<span v-if="opctions.adultNum==1&&opctions.childrenNum==0">1 Person</span>
					<span v-else>{{opctions.adultNum+opctions.childrenNum}} People</span>
				</div>
			</div>
			<div class="orderContact">
				<h4>Reservation Information</h4>
				
				<div class="inputItem" :class="{err:oderFirstNameErr}">
					<p>First name <b>*</b></p>
					<input :class="{err:oderFirstNameErr}"  @blur="gaBlur(0)" @focus="fousOderfisrtname"  v-model="oderFirstName" />
				</div>
				<div class="inputItem" :class="{err:oderlastNameErr}">
					<p>Last name  <b>*</b></p>
					<input :class="{err:oderlastNameErr}"  @focus="fousoderlastName"  @blur="gaBlur(1)"  v-model="oderlastName" />
				</div>
			
			
				<div class="inputItem" :class="{err:emailAddressErr}">
					<p>Email Address  <b>*</b></p>
					<input :class="{err:emailAddressErr}"  @focus="fousEmal"  @blur="gaBlur(2)"  v-model="emailAddress" />
				</div>
				<div class="inputItem" :class="{err:codeErr}">
					<p>Country Code  <b>*</b></p>
					<div class="inputbox">
						<input :class="{err:codeErr}" readonly="readonly"   onfocus="this.blur()" @click="showCodeFn(0)"  v-model="mobileCode" />
						<i class="iconfont">&#xe60f;</i>
					</div>
				</div>
				<div class="inputItem" :class="{err:phoneErr}">
					<p>Mobile phone <b>*</b></p>
					<input :class="{err:phoneErr}"  @focus="fousPhone" v-model="phone" />
				</div>
			</div>
			<div class="check">
				<span>Check this box if the contact for the reservation does NOT match the Primary Traveler.</span>
				<em v-if="check==0" @click="checkFn(0)" class="checkbox"></em>
				<em v-if="check==1" @click="checkFn(1)" class="checkbox backgrond iconfont">&#xe61e;</em>
			</div>
			<div class="orderContact" v-if="check==1">
				
				<h4>Key Traveler</h4>
				<div class="inputItem" :class="{err:TravellerFirstNameErr}">
					<p>First name <b>*</b></p>
					<input :class="{err:TravellerFirstNameErr}"  @focus="fousFirst()" v-model="TravellerFirstName" />

				</div>
				<div class="inputItem" :class="{err:TravellerlastNameErr}">
					<p>Last name <b>*</b></p>
					<input :class="{err:TravellerlastNameErr}"  @focus="fousLastName()" v-model="TravellerlastName" />
				</div>
			
			
				<div class="inputItem" :class="{err:TravelleremailAddressErr}">
					<p>Email Address <b>*</b></p>
					<input :class="{err:TravelleremailAddressErr}"  @focus="fousidcard" v-model="TravelleremailAddress" />
				</div>
				<div class="inputItem" :class="{err:TravellerCodeErr}">
					<p>Country Code </p>
					<div class="inputbox">
						<input :class="{err:TravellerCodeErr}" readonly="readonly" onfocus="this.blur()"  @click="showCodeFn(1)"  v-model="mobileTravellCode" />
						<i class="iconfont">&#xe60f;</i>
					</div>
				</div>
				<div class="inputItem" :class="{err:TravellerphoneErr}">
					<p>Mobile phone(optional)</p>
					<input :class="{err:TravellerphoneErr}"  @focus="fousphonenumb()" v-model="Travellerphone" />
				</div>
			</div>
			<div class="Comments">
				<div class="information">
					<h4>Other required information</h4>
					<textarea v-if="opctions.category=='Private Tour'" @blur="gaBlur(3)" v-model="comments" placeholder="please provide your hotel address so the guide can pick you up." onfocus="this.placeholder=''" onblur="this.placeholder='please provide your hotel address so the guide can pick you up.'"></textarea>
					<textarea v-else v-model="comments" @blur="gaBlur(3)"></textarea>
				</div>

				<p>You can get a 100% refund up to {{opctions.refundTimeLimit}} hours before your trip.</p>
			</div>
		</div>
		<div class="nextBtn">
			<div class="next" @touchend="next">NEXT</div>
		</div>
		<transition name="fade">
            <booking v-show="isShowBook" :countryCode="countryCode" @getCode="setCode" @back="setback" class="view"></booking>
        </transition>
	</div>
</template>

<script>
	import Vue from 'vue'
	import booking from '~/components/booking'

	
	import { regExp } from '~/assets/js/utils.js'
	import countryCode from '~/assets/js/countryCode.js'
	export default {
		name: 'fillYourInfo',
		async asyncData({ apiBasePath }) {
		    return {
		      apiBasePath: apiBasePath
		    }
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
				TravellerFirstName: '',
				TravellerFirstNameErr: false,
				TravellerlastName: '',
				TravellerlastNameErr: false,
				TravelleremailAddress: '',
				TravelleremailAddressErr: false,
				Travellerphone: '',
				TravellerphoneErr: false,

				comments: '', //提交意见咨询

				isShowAlertTitle: false, //弹框返回状态
				alertMessage: "", //弹框内容
				alertTitle: "", //弹框标题
				logIn: '', //是否登陆
				isShowAlert: false, //错误弹框
				check: 0, //checked
				addOder: false,
				
				
				//国家
				mobileCode:'',
				codeErr:'',
				countryCode: countryCode.phone_countries,
				
				//显示code列表
				showCode: false,
				code: '',
				
				TravellerCodeErr: false,
				mobileTravellCode: "", //选中国家区号
				TravellerCode: '', //区号
				showTravellCode: false,
				
				index:"",//区分联系人
				isShowBook:false
			}

		},
		components: {
			booking

		},
		methods: {
			//关闭国家
			setback(val){
				this.isShowBook=val	
			},
			//获取code
			setCode(val){
				console.log(this.index)
				if(this.index==0){
					this.mobileCode=val.mobileCode
					this.code=val.code
				}else{
					this.mobileTravellCode=val.mobileCode
					this.TravellerCode=val.code
				}
				this.isShowBook=val.status
			},
			back(){
				 history.back()
			},
			//显示国家
			showCodeFn(index){
				if(index==0){
					this.codeErr=false
					this.index=0
				}else{
					this.TravellerCodeErr=false
					this.index=1
				}
				this.isShowBook=true
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

			fousOderfisrtname() {
				this.oderFirstNameErr = false
			},
			fousoderlastName() {
				this.oderlastNameErr = false
			},
			fousEmal() {
				this.emailAddressErr = false
			},
			fousPhone() {
				this.phoneErr = false
			},
			fousFirst() {
				this.TravellerFirstNameErr = false

			},
			fousLastName(i) {
				this.TravellerlastNameErr = false
			},
			fousidcard(i) {
				this.TravelleremailAddressErr = false
			},
			fousphonenumb(i) {
				this.TravellerphoneErr = false
			},
			gaBlur(id){
				
				if(id == 0) {
					if(this.oderFirstName) {
						ga('gtag_UA_107010673_1.send', {
							hitType: 'event',
							eventCategory: 'activity_booking',
							eventAction: 'input',
							eventLabel: 'first_name',
						});
						ga('gtag_UA_107010673_1.send', {
							hitType: 'event',
							eventCategory: 'activity_booking',
							eventAction: 'input',
							eventLabel: 'booking_input',
						});
					}

				} else if(id == 1) {
					if(this.oderlastName) {
						ga('gtag_UA_107010673_1.send', {
							hitType: 'event',
							eventCategory: 'activity_booking',
							eventAction: 'input',
							eventLabel: 'last_name',
						});
						ga('gtag_UA_107010673_1.send', {
							hitType: 'event',
							eventCategory: 'activity_booking',
							eventAction: 'input',
							eventLabel: 'booking_input',
						});
					}

				} else if(id == 2) {
					if(this.emailAddress) {
						ga('gtag_UA_107010673_1.send', {
							hitType: 'event',
							eventCategory: 'activity_booking',
							eventAction: 'input',
							eventLabel: 'email_address',
						});
						ga('gtag_UA_107010673_1.send', {
							hitType: 'event',
							eventCategory: 'activity_booking',
							eventAction: 'input',
							eventLabel: 'booking_input',
						});
					}

				} else {
					if(this.comments) {
						ga('gtag_UA_107010673_1.send', {
							hitType: 'event',
							eventCategory: 'activity_booking',
							eventAction: 'input',
							eventLabel: 'comment',
						});
						ga('gtag_UA_107010673_1.send', {
							hitType: 'event',
							eventCategory: 'activity_booking',
							eventAction: 'input',
							eventLabel: 'booking_input',
						});
					}

				}

			
			},
			gaFail(){
				ga('gtag_UA_107010673_1.send', {
							hitType: 'event',
							eventCategory: 'activity_booking',
							eventAction: 'submit',
							eventLabel: 'activity_order_fail',
						});
			},
			next() {
				const that = this
				var obj;

				var deviceType  = /(iPad)/i.test(navigator.userAgent)?'IPAD':'MOBILE';

				//that.addOder = true
				if(that.oderFirstName == "" || regExp.isNub(that.oderFirstName) || regExp.isCode(that.oderFirstName)) {
					that.oderFirstNameErr = true
					that.gaFail()
					
				} else if(that.oderlastName == "" || regExp.isNub(that.oderlastName) || regExp.isCode(that.oderlastName)) {
					that.oderlastNameErr = true
					that.gaFail()
					
				} else if(!regExp.isEmail(that.emailAddress)) {
					that.emailAddressErr = true
					that.gaFail()
					
				}else if(!that.mobileCode){
					that.codeErr=true
					that.gaFail()
				}else if(that.phone=="" || !regExp.isMobil(that.phone)) {
					that.phoneErr = true
					that.gaFail()
					
				} else {
					if(that.check == 1) {
						if(that.TravellerFirstName == "" || regExp.isNub(that.TravellerFirstName) || regExp.isCode(that.TravellerFirstName)) {
							that.TravellerFirstNameErr = true
							that.gaFail()
							
						} else if(that.TravellerlastName == "" || regExp.isNub(that.TravellerlastName) || regExp.isCode(that.TravellerlastName)) {
							that.TravellerlastNameErr = true
							that.gaFail()
							
						} else if(!regExp.isEmail(that.TravelleremailAddress)) {
							that.TravelleremailAddressErr = true
							that.gaFail()
							
						} else if(!regExp.isMobil(that.Travellerphone)) {
							that.TravellerphoneErr = true
							
							
						} else {
								ga('gtag_UA_107010673_1.send', {
								hitType: 'event',
								eventCategory: 'activity_booking',
								eventAction: 'submit',
								eventLabel: 'activity_order_succ',
							});
							obj = {
								"userId": that.opctions.userId,
								"activityId": that.opctions.activityId,
								"amount": that.opctions.amount,
								"currency": that.opctions.currency,
								"adultNum": that.opctions.adultNum,
								"childrenNum": that.opctions.childrenNum,
								"infantNum": that.opctions.infantNum,
								"startDate": that.opctions.startDate,
								"startTime": that.opctions.startTime,
								"averagePrice": that.opctions.averagePrice,
								"childDiscount": that.opctions.childDiscount,
								"comments": that.comments ? that.comments : null,
								"contactInfo": {
									"firstName": that.oderFirstName,
									"lastName": that.oderlastName,
									"phoneNumber":that.code+that.phone,
									"emailAddress": that.emailAddress
								},
								"travelerInfo": {
									"firstName": that.TravellerFirstName,
									"lastName": that.TravellerlastName,
									"phoneNumber": that.travellCode+that.Travellerphone,
									"emailAddress": that.TravelleremailAddress
								},
								"utcOffset": new Date().getTimezoneOffset() / 60 * -1,
								"deviceType":deviceType
							}
							if(that.addOder == false) {
								Vue.axios.put(that.apiBasePath+"activity/order/create", JSON.stringify(obj), {
									headers: {
										'Content-Type': 'application/json; charset=UTF-8'
									}
								}).then(function(response) {
									var loginState = (that.logIn?that.logIn:0);
									var thisUrl = "/activity/payment/?objectId=" + response.data.response + '&login='+loginState;
									if(obj.currency=='CNY'){
										var ua = window.navigator.userAgent.toLowerCase();
										var isWx = (ua.match(/MicroMessenger/i) == 'micromessenger') ? true : false;
										if(isWx){
											window.location.href = 'https://www.localpanda.com/relay/getWechatToken.html?url='+encodeURIComponent('https://www.localpanda.com'+thisUrl);
										}else{
											window.location.href = thisUrl;
										}
									}else{
										window.location.href = "/activity/payment/?objectId=" + response.data.response + '&login='+loginState;
									}
									
								}, function(response) {})
							}
						}
					} else {
						ga('gtag_UA_107010673_1.send', {
								hitType: 'event',
								eventCategory: 'activity_booking',
								eventAction: 'submit',
								eventLabel: 'activity_order_succ',
							});
						obj = {
							"userId": that.opctions.userId,
							"activityId": that.opctions.activityId,
							"amount": that.opctions.amount,
							"currency": that.opctions.currency,
							"adultNum": that.opctions.adultNum,
							"childrenNum": that.opctions.childrenNum,
							"infantNum": that.opctions.infantNum,
							"startDate": that.opctions.startDate,
							"startTime": that.opctions.startTime,
							"averagePrice": that.opctions.averagePrice,
							"childDiscount": that.opctions.childDiscount,
							"comments": that.comments ? that.comments : null,
							"contactInfo": {
								"firstName": that.oderFirstName,
								"lastName": that.oderlastName,
								"phoneNumber": that.code+that.phone,
								"emailAddress": that.emailAddress
							},
							"utcOffset": new Date().getTimezoneOffset() / 60 * -1,
							"deviceType":deviceType
						}
						
						if(that.addOder == false) {
							that.addOder = true
							Vue.axios.put(that.apiBasePath+"activity/order/create", JSON.stringify(obj), {
								headers: {
									'Content-Type': 'application/json; charset=UTF-8'
								}
							}).then(function(response) {
								var loginState = (that.logIn?that.logIn:0);
								var thisUrl = "/activity/payment/?objectId=" + response.data.response + '&login='+loginState;
								
								if(obj.currency=='CNY'){
									var ua = window.navigator.userAgent.toLowerCase();
									var isWx = (ua.match(/MicroMessenger/i) == 'micromessenger') ? true : false;
									if(isWx){
										window.location.href = 'https://www.localpanda.com/relay/getWechatToken.html?url='+encodeURIComponent('https://www.localpanda.com'+thisUrl);
									}else{
										window.location.href = thisUrl;
									}
									
								}else{
									window.location.href = "/activity/payment/?objectId=" + response.data.response + '&login='+loginState;
								}

							}, function(response) {})
						}
					}
					//console.log(that.addOder)

				}
			}

		},
		created: function() {
			
			
			
		},
		mounted: function() {
			this.opctions = JSON.parse(localStorage.getItem("orderInfo"))
			this.logIn = window.localStorage.getItem("logstate")
			/*this.goBackFn()*/

		},
		watch: {
			isShowBook:function(val,oldVal){
				if(val){
					console.log(val)
					document.getElementsByTagName("body")[0].style.overflowY="hidden"
					
				}else{
					document.getElementsByTagName("body")[0].style.overflowY="inherit"
				}
			}
		}
	}
</script>
<style lang="scss">
	#launcher{
		bottom: 2.133333rem!important;
	}
	::-webkit-input-placeholder { /* WebKit browsers */
	    color:    #878e95; 
	    
	}
	
</style>
<style lang="scss">
	.fillYourInfo {
		padding: 0 0.4rem 1.4rem;
		.back {
			line-height: 1.013333rem;
			color: #666;
			i {
				font-size: 0.32rem;
				font-weight: bold;
			}
		}
		.fillInfo{
			h3{
				font-size:0.6rem;
				font-weight: bold;
			}
			.oderInfo{
				margin-top: 0.4rem;
				.oderTitle{
					font-size: 0.34rem;
					font-weight: bold;
					line-height: 1.3;
				}
				.oderDetail{
					padding: 0.15rem 0 0.4rem;
					border-bottom:2px solid #ebebeb;
					span{
						font-size: 0.26rem;
						margin-right: 0.4rem;
						&:last-child{
							margin-right: 0;
						}
					}
				}
			}
			.orderContact{
				h4{
					padding:0.3rem 0 0.2rem;
					font-size: 0.32rem;
				}
				.inputItem{
					margin-top:0.2rem;
					padding-bottom: 0.28rem;
					/*border-bottom: 2px solid #ebebeb;*/
					b{
						color: red;
					}
					p{
						font-size:0.24rem;
						color:#878e95;
					}
					.inputbox{
						position: relative;
						i{
							position: absolute;
							right: 0.1rem;
							top: 0.4rem;
							color:#878e95;
							font-size: 0.18rem;
						}
					}
					input{
						width:100%;
						height: 0.9rem;
						line-height: 0.9rem;
						border:1px solid #dde0e0;
						border-radius: 0.06rem;
						padding:0 0.24rem 0 0.24rem;
						font-size: 0.36rem;
						margin-top: 0.133333rem;
						overflow: hidden;/*超出部分隐藏*/
			            white-space: nowrap;/*不换行*/
			            text-overflow:ellipsis;/*超出部分文字以...显示*/
						&:-webkit-placeholder { /* Mozilla Firefox 4 to 18 */
    						color: #878e95; 
						}
						
					}
				}
			}
			.check{
				
				margin-top: 0.5rem;
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
					border: 1px solid #dde0e0;
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
			.Comments{
				margin-top: 0.4rem;
				padding-bottom: 0.8rem;
				.information{
					padding-bottom: 0.266666rem;
					
					h4{
						font-size: 0.24rem;
						span{
							color: #878E95;
						}
					};
					textarea{
						height:1.893333rem;
						border:1px solid #dde0e0;
						border-radius: 0.08rem;
						width: 100%;
						padding-left: 0.25rem;
						padding-top: 0.2rem;
						margin-top: 0.2rem;
						font-size: 0.28rem;
						font-family: Arial;
						&:-webkit-placeholder { /* Mozilla Firefox 4 to 18 */
    						color: #dde0e0; 
						}
					}
				}
				p{
					margin-top: 0.266666rem;
					color: red;
					width: 90%;
				}
			}
			
		}
		.nextBtn{
				border-top:2px solid #ebebeb;
				width: 100%;
				background: #fff;
				padding:0.28rem 0;
				position: fixed;
				bottom: 0;
				left: 0;
				.next{
					width: 90%;
					height:0.9rem;
					background-image: linear-gradient(270deg,#009efd 0%, #1bbc9d 100%);
					font-size: 0.3rem;
					color: #FFF;
					text-align: center;
					line-height: 0.9rem;
					margin: 0 auto;
					border-radius: 0.45rem;

				}
			}
			.err{
				border-color: red!important;
				color: red!important;
			}
		.view {
			
		
			transition: all .3s;
		}
		.fade-enter-active, .fade-leave-active {
		transition: opacity .5s;
		}
		.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
		opacity: 0;
		}
	}
	
	
</style>