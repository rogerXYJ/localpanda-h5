<template>
	<div class="fillYourInfo" id="fillYourInfo">
		
		<div class="fillInfo" @touchmove="hideFiexd=false">
			<div class="back"><i class="iconfont" @click="back">&#xe615;</i></div>
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
					<p>First Name <b>*</b></p>
					<input :class="{err:oderFirstNameErr}"  @blur="gaBlur(0,true)" @focus="fousOderfisrtname"  v-model="oderFirstName" />
				</div>
				<div class="inputItem" :class="{err:oderlastNameErr}">
					<p>Last Name  <b>*</b></p>
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
					<p>Mobile Phone <b>*</b></p>
<<<<<<< HEAD
					<input :class="{err:phoneErr}" @blur="gaBlur(3)"  @focus="fousPhone" v-model="phone" />
=======
					<input :class="{err:phoneErr}"  @focus="fousPhone" @blur="gaBlur(3)" v-model="phone" />
>>>>>>> dev_xuyongjie
				</div>
			</div>

			<div class="Comments">
				<div class="information">
					<h4>Other Required Information</h4>
					<textarea v-if="opctions.category=='Private Tour'" @blur="gaBlur(4)" v-model="comments" placeholder="please provide your hotel address so the guide can pick you up." @focus="commentFocus"></textarea>
					<textarea v-else v-model="comments" @focus="commentFocus" @blur="gaBlur(4)"></textarea>
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
					<p>First Name <b>*</b></p>
					<input :class="{err:TravellerFirstNameErr}" @blur="hideFiexd=false" @focus="fousFirst" v-model="TravellerFirstName" />

				</div>
				<div class="inputItem" :class="{err:TravellerlastNameErr}">
					<p>Last Name <b>*</b></p>
					<input :class="{err:TravellerlastNameErr}" @blur="hideFiexd=false"  @focus="fousLastName" v-model="TravellerlastName" />
				</div>
			
			
				<div class="inputItem" :class="{err:TravelleremailAddressErr}">
					<p>Email Address <b>*</b></p>
					<input :class="{err:TravelleremailAddressErr}" @blur="hideFiexd=false"  @focus="fousidcard" v-model="TravelleremailAddress" />
				</div>
				<div class="inputItem" :class="{err:TravellerCodeErr}">
					<p>Country Code </p>
					<div class="inputbox">
						<input :class="{err:TravellerCodeErr}" readonly="readonly" @blur="hideFiexd=false" onfocus="this.blur()"  @click="showCodeFn(1)"  v-model="mobileTravellCode" />
						<i class="iconfont">&#xe60f;</i>
					</div>
				</div>
				<div class="inputItem" :class="{err:TravellerphoneErr}">
					<p>Mobile Phone(optional)</p>
					<input :class="{err:TravellerphoneErr}" @blur="gaBlur(3)"  @focus="fousphonenumb" v-model="Travellerphone" />
				</div>
			</div>

			<p class="booktip">You can get a 100% refund up to {{opctions.refundTimeLimit}} hours before your trip.</p>
			

			<div class="price">Total ({{opctions.currency}}): <span @click="showPrice=!showPrice">{{opctions.symbol}}{{opctions.amount}}<i class="iconfont">&#xe659;</i></span></div>
			<div class="nextBtn clearfix" v-show="!hideFiexd" @touchmove="stopMove">
				<div class="next" @touchend="next">NEXT</div>
			</div>
		</div>
		
		<transition name="fade">
			<booking v-show="isShowBook" :countryCode="countryCode" @getCode="setCode" @back="setback" class="view"></booking>
		</transition>
		

		<div class="winBg" @touchmove="stopMove" :class="{winBgHide:!showPrice}" @click="showPrice=false"></div>
		<div class="price_info" :class="{showPrice:showPrice}">
			<div class="price_info_tit">
				<span class="price_info_close iconfont" @click="showPrice=false">&#xe629;</span>
				Detail:
			</div>
			<p><span>{{opctions.symbol}}{{opctions.adultsPic}}</span>{{opctions.symbol}}{{returnFloat(opctions.adultsPic/(opctions.adultNum+opctions.childrenNum))}} x {{opctions.adultNum+opctions.childrenNum}} People</p>
			<p v-if="opctions.childrenNum && opctions.childDiscountP">- {{opctions.symbol}}{{returnFloat(opctions.childrenNum*opctions.childDiscountP)}} for child(ren)</p>
			<div class="boxline"></div>
			<p><span>{{opctions.symbol}}{{opctions.amount}}</span>Total ({{opctions.currency}})</p>
		</div>
		
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
				isShowBook:false,

				showPrice: false,
				hideFiexd: false
			}

		},
		components: {
			booking

		},
		methods: {
			//关闭国家
			setback(val){
				this.isShowBook=val;
				//关闭后退浏览器
				history.back()
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
				this.isShowBook=val.status;

				//关闭后退浏览器
				//history.back()
			},
			back(){
				 history.back()
			},
			//显示国家
			showCodeFn(index){
				ga('gtag_UA_107010673_2.send', {
					hitType: 'event',
					eventCategory: 'activity_booking',
					eventAction: 'click',
					eventLabel: 'country_code_open',
				});
				if(index==0){
					this.codeErr=false
					this.index=0
<<<<<<< HEAD
					
=======
					ga('gtag_UA_107010673_2.send', {
						hitType: 'event',
						eventCategory: 'activity_booking',
						eventAction: 'click',
						eventLabel: 'country_code_open',
					});
>>>>>>> dev_xuyongjie
				}else{
					this.TravellerCodeErr=false
					this.index=1
				}
				this.isShowBook=true;

				//浏览器弹窗后，添加一个新页面记录。
				history.pushState({
					'type':'showDialog'
				},'');
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
			gaBlur(id,hideBtn){

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

				}else if(id == 3){
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
				}else {
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
			gaFail(){
				ga('gtag_UA_107010673_2.send', {
					hitType: 'event',
					eventCategory: 'activity_booking',
					eventAction: 'submit',
					eventLabel: 'activity_order_fail',
				});
			},
			next() {
				const that = this
				var obj;
				let next=false
				var deviceType  = /(iPad)/i.test(navigator.userAgent)?'IPAD':'MOBILE';

				//that.addOder = true
				if(that.oderFirstName == "" || regExp.isNub(that.oderFirstName) || regExp.isCode(that.oderFirstName)) {
					that.oderFirstNameErr = true
					next=false;
					
				} else if(that.oderlastName == "" || regExp.isNub(that.oderlastName) || regExp.isCode(that.oderlastName)) {
					that.oderlastNameErr = true
					next=false
					
				} else if(!regExp.isEmail(that.emailAddress)) {
					that.emailAddressErr = true
					next=false
					
				}else if(!that.mobileCode){
					that.codeErr=true
					next=false
				}else if(that.phone=="" || !regExp.isMobil(that.phone)) {
					that.phoneErr = true
					next=false
					
				} else {
					if(that.check == 1) {
						if(that.TravellerFirstName == "" || regExp.isNub(that.TravellerFirstName) || regExp.isCode(that.TravellerFirstName)) {
							that.TravellerFirstNameErr = true
							next=false
							
						} else if(that.TravellerlastName == "" || regExp.isNub(that.TravellerlastName) || regExp.isCode(that.TravellerlastName)) {
							that.TravellerlastNameErr = true
							next=false
							
						} else if(!regExp.isEmail(that.TravelleremailAddress)) {
							that.TravelleremailAddressErr = true
							next=false
							
						} else if(!regExp.isMobil(that.Travellerphone)) {
							that.TravellerphoneErr = true
							next=false
							
						} else {
								next=true
								ga('gtag_UA_107010673_2.send', {
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
						if(next==false){
							that.gaFail()
						}
					} else {
						next=true
						ga('gtag_UA_107010673_2.send', {
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
				if(next==false){
					that.gaFail()
				}


				//跳转到输入框的位置
				setTimeout(function(){
					var error = document.querySelectorAll('.err')[0];
					if(error){
						error.scrollIntoViewIfNeeded();
					}
				},80);


			},
			commentFocus(e){
				// var fillYourInfo = document.getElementById('fillYourInfo');
				// fillYourInfo.style = 'height:'+document.documentElement.clientHeight+'px;overflow-y:scroll;';
				
				
				
			},
			returnFloat(value) {
				value*=1;
				if(value) {
					var numberArr = (''+value).split('.');
					if(numberArr.length>1 && numberArr[1].length>2){
						return (value+0.005).toFixed(2);
					}
					return value.toFixed(2);
				}else{
					return 0;
				}
				
			},
			stopMove(e){
				e.preventDefault();
			}

		},
		created: function() {
			
			
			
		},
		mounted: function() {
			var self= this;

			this.opctions = JSON.parse(localStorage.getItem("orderInfo"))
			this.logIn = window.localStorage.getItem("logstate")
			/*this.goBackFn()*/
			console.log(this.opctions);

			//浏览器事件处理
			window.onpopstate = function(event) {
				if(self.isShowBook){
					self.isShowBook = false;
				}
			};

		},
		watch: {
			isShowBook:function(val,oldVal){
				// if(val){
				// 	console.log(val)
				// 	document.getElementsByTagName("body")[0].style.overflowY="hidden"
					
				// }else{
				// 	document.getElementsByTagName("body")[0].style.overflowY="inherit"
				// }
			}
		}
	}
</script>

<style lang="scss">
	.fillYourInfo {
		
		
		.fillInfo{
			padding: 0 0.4rem 0.5rem;
			.back {
				line-height: 1.013333rem;
				color: #666;
				i {
					font-size: 0.32rem;
					font-weight: bold;
				}
			}
			
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
			.Comments{
				margin-top: 0.4rem;
				.information{
					padding-bottom: 0.22rem;
					
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
					margin-top: 0.22rem;
					color: red;
				}
			}
			.booktip{
				margin-top: 0.4rem;
				color:red;
			}
		}
		.nextBtn{
			margin-top: 0.4rem;
			width: 100%;
			background: #fff;
			// position: fixed;
			// bottom: 0;
			// left: 0;
			// z-index: 101;
			.fiexd_content{
				
				width: 100%;
				height: 100%;
				overflow: hidden;
				padding:0.1rem 0.4rem;
				background-color: #fff;
				position: relative;
				z-index: 3;
			}
			.next{
				
				padding: 0 1rem;
				height:1rem;
				background-image: linear-gradient(270deg,#009efd 0%, #1bbc9d 100%);
				font-size: 0.3rem;
				color: #FFF;
				text-align: center;
				line-height: 1rem;
				border-radius: 0.5rem;

			}
			
			
		}
		.err{
			border-color: red!important;
			color: red!important;
		}
		.view {
			transition: all ease-in .2s;
		}
		.fade-enter-active, .fade-leave-active {
		transition: opacity .2s;
		}
		.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
		opacity: 0;
		}

		.price_info{
			-webkit-transition:all 0.2s linear 0s;
			transition:all 0.2s linear 0s;
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
			.price_info_tit{
				font-size: 0.4rem;
				padding-bottom: 0.25rem;
				.price_info_close{
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
			p{
				font-size: 0.36rem;
				padding:0.06rem 0;
				span{
					float: right;
				}
			}
			.boxline{
				border-top: 1px solid #ebebeb;
				margin: 0.3rem 0;
			}
		}
		.price{
			text-align: center;
			font-size: 0.36rem;
			line-height: 0.5rem;
			margin-top: 0.5rem;
			span{
				
				font-size:0.4rem;
				display: inline-block;
				margin-left: 0.4rem;
				vertical-align: top;
				padding-right: 0.2rem;
			}
			i{
				font-size:0.42rem;
				color: #878E95;
				margin-left: 0.15rem;
			}
		}
		.showPrice{
			z-index: 100;
			opacity: 1;
		}
	}
	
	
</style>

<style lang="scss">
	#launcher{
		bottom: 2.133333rem!important;
	}
	::-webkit-input-placeholder { /* WebKit browsers */
	    color:    #878e95; 
	    
	}
	
</style>