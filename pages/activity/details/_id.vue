<template>
	<div id="activitiesDetail">
		<Head :nowCurrency="currency" @headCurrency="headCurrencyFn"></Head>
		<!-- 面包屑 -->
		<div class="crumbs">
			<a href="#">Home</a> <i class="iconfont">&#xe64a;</i>
			<a href="#">Beijing Activities</a>
		</div>

		<!-- banner -->
		<div class="banner">
			<div class="swiper-container" id="swiper_bannerbox">
				<div class="swiper-wrapper">
					<div class="swiper-slide" :key="index" v-for="(slide, index) in detail.bannerPhotos">
						<img v-lazy="slide.url" lazy="error"  />
					</div>
				</div>
				<div class="swiper-pagination" id="swiper_banner_pagination"></div>
			</div>
		</div>

		<!-- 产品标题信息 -->
		<div class="detail_box activity_top">
			<h2><span>GROUP</span>Small Group Forbidden City Walking Tour</h2>
			<!-- 币种信息 -->
			<div class="price_info clearfix">
				<div class="price_select_box">
					<select v-model="selectCurrency" @change="changeCurrency">
						<option :value="item.code" :key="index" v-for="(item,index) in exchange">{{item.code}}</option>
					</select>
					<i class="iconfont">&#xe666;</i>
				</div>
				<p>$34.90 <span>pp for party of 2</span></p>
			</div>
			<!-- 预定和点评次数 -->
			<div class="booking_info">
				<span>(160)</span>
				<div class="remark_star" v-html="remarkStarHtml(6)"></div>
				Booked 19 times (last 30 days)
			</div>

			<!-- 产品基本信息 -->
			<ul class="activity_info">
				<li><i class="iconfont">&#xe624;</i>4 Hours <span class="iconfont">&#xe689;</span></li>
				<li><i class="iconfont">&#xe68a;</i>Guest Pickup offered <span class="iconfont">&#xe689;</span></li>
				<li><i class="iconfont">&#xe627;</i>Offered in English <span class="iconfont">&#xe689;</span></li>
				<li><i class="iconfont">&#xe610;</i>Shanghai, Hangzhou, Beijing</li>
				<li><i class="iconfont">&#xe688;</i>100% refund up to xx hours before your trip</li>
				<li><i class="iconfont">&#xe68b;</i>This activity is for adults over 18 years old only</li>
			</ul>

		</div>
		
		<!-- Why you’ll love this trip -->
		<div class="detail_box why">
			<h3><i></i>Why you’ll love this trip</h3>
			<p class="detail_p">Get your fill of Beijing's two greatest marvels on this faced paced all-encompassing day trip. The perfect tour for those who need to see the best of Beijing in a single day.</p>
			
			<ul class="detail_txt_list">
				<li><i class="dian"></i>Carefully-planned route to get the most out of your 4 hours</li>
				<li><i class="dian"></i>Special group lane through Tiananmen security; skip long entrance lines</li>
				<li><i class="dian"></i>Our guides are hand-picked for their experience and knowledge</li>
				<li><i class="dian"></i>Incredible details about the history, architecture and culture of the palace</li>
				<li><i class="dian"></i>Small Groups: no larger than 11 people</li>
				<li><i class="dian"></i>Great value for budget travelers</li>
			</ul>
		</div>

		<!-- 导游 -->
		<div class="detail_box guide">
			<h3><i></i>Travel with our experts</h3>
			<p class="gray">You can  select your best fit or let us assign one for you</p>

			<div class="guide_list">
				<div class="swiper-container js_guide">
					<div class="swiper-wrapper">
						<div class="swiper-slide" :class="{'active':checkGuideIndex===index}" v-for="(item,index) in detail.guide" :key="index" @click="showGuideFn(index,'ga')">
							<!-- <img :src="item.guidePhoto.headPortraitUrl" width="100%" alt=""> -->
							<div class="guide_list_head" v-lazy:background-image="item.guidePhoto.headPortraitUrl"></div>
							<span><i class="iconfont">&#xe654;</i></span>
						</div>
					</div>
				</div>
			</div>
		</div>


		<!-- 预定板块 -->
		<div class="detail_box check">
			<h3><i></i>Check availability</h3>
			<p class="gray">You can  select your best fit or let us assign one for you</p>

			<ul class="check_info clearfix">
				<li>
					<i class="iconfont input_icon">&#xe60d;</i>
					<input id="js_changetime" v-model="startDate" readonly type="text" placeholder="Select Date">
					<input class="time_box" :value="formatDate(startDate)" readonly type="text" placeholder="Date">
					<i class="iconfont arrow">&#xe60f;</i>
				</li>
				<li class="check_people">
					<i class="iconfont input_icon">&#xe63d;</i>
					<i class="iconfont arrow">&#xe60f;</i>
					<div class="check_people_text" :style="bookAdults>0?'color:#333;font-size:0.28rem;':'color:#888;font-size:0.28rem;'">{{adultsText}}</div>
					<select id="" v-model="bookAdults">
						<option :value="item" v-for="item in picInfo.maxParticipants" :key="item">{{(item>1?'Adults':'Adult')+' x '+item}}</option>
					</select>
				</li>
				<li class="check_people">
					<i class="iconfont input_icon">&#xe63d;</i>
					<i class="iconfont arrow">&#xe60f;</i>
					<div class="check_child_text" :style="bookChildren>0?'color:#333;font-size:0.28rem;':'color:#888;font-size:0.22rem;'">{{childrenText}}</div>
					<select id="" v-model="bookChildren">
						<option :value="0">Child x 0</option>
						<option :value="item" v-for="item in picInfo.maxParticipants-1" :key="item">{{(item>1?'Children':'Child')+' x '+item}}</option>
					</select>
				</li>
				<li>
					<div class="check_tip" v-show="checkTipText"><span>{{checkTipText}}</span></div>
					<div class="check_tip">Participants : {{picInfo.minParticipants}}-{{picInfo.maxParticipants}}. Free for infants under 3 years old.</div>
				</li>
				<li v-show="!showPriceInfo">
					<span class="btn" @click="availability">Check availability</span>
					<span class="btn_inquire" @click="gaInquire">Inquire</span>
				</li>
			</ul>

			<!-- 绿色预定板块 -->
			<div class="book_all" v-show="showPriceInfo">
				<!-- 导游信息 -->
				<div v-if="detail.guide.length">
					<div class="book_guide_check" :class="{'active':checkGuideIndex===''}" @click="checkGuideIndex=''">
						<i></i>Let us assign one expert for you
					</div>
					<div class="book_guide_check" :class="{'active':checkGuideIndex!==''}" @click="showGuideFn(checkGuideIndex?checkGuideIndex:0,'ga')">
						<i></i>Select your best expert (free of charge)
					</div>
				</div>
				<div class="book_guide_info" v-if="checkGuideIndex!==''">
					<div class="book_guide_select" @click="showGuideFn(checkGuideIndex)">Reselect</div>
					<div class="book_guide_photo" :style="'background-image:url('+detail.guide[checkGuideIndex].guidePhoto.headPortraitUrl+')'"></div>
					{{detail.guide[checkGuideIndex].enName}} has been selected !
				</div>

				<!-- 价格明细 -->
				<div class="book_price_box">
					<dl class="book_price_info">
						<dt>
							<span>{{nowExchange.symbol}}{{returnFloat(perPersonPrice)}}×{{bookPeople}} {{bookPeople>1?'Travelers':'Traveler'}}</span>
							<span v-if="picInfo.childDiscount && bookChildren">-{{nowExchange.symbol}}{{returnFloat(picInfo.childDiscount*bookChildren)}} for {{bookChildren>1?'Children':'Child'}}</span>
						</dt>
						<dd>{{nowExchange.symbol}}{{returnFloat(price)}}</dd>
					</dl>
					<dl class="book_price_info">
						<dt>Total Amount</dt>
						<dd>
							<div class="price_select_box">
								<select v-model="selectCurrency" @change="changeCurrency">
									<option :value="item.code" :key="index" v-for="(item,index) in exchange">{{item.code}}</option>
								</select>
								<i class="iconfont">&#xe666;</i>
							</div>
							{{nowExchange.symbol}}{{amount}}</dd>
					</dl>
					<div class="hr"></div>
					<p class="book_tip" v-if="picInfo.refundTimeLimit">You can get a 100% refund up to {{(picInfo.refundTimeLimit>2?picInfo.refundTimeLimit:24*picInfo.refundTimeLimit)}} {{picInfo.refundTimeLimit>2?'days':'hours'}} before your trip</p>
					<!-- {{picInfo.refundInstructions}} -->
					<span class="btn" @click="bookFn">Book</span>
					<span class="btn_inquire" @click="gaInquire">Inquire</span>
				</div>
			</div>
		</div>

		<!-- 行程板块 -->
		<div class="detail_box itinerary">
			<h3><span class="btn_viewall" @click="itineraryViewall">View all</span><i></i>Experience Details</h3>
			<dl class="itinerary_list" :class="{'active':index==0}" v-for="(items,index) in detail.itinerary" :key="index">
				<dt @click="itineraryFn"><i class="iconfont i_down">&#xe667;</i><i class="iconfont i_up">&#xe666;</i><span></span>{{items.title}}</dt>
				<dd>
					<p>{{items.description}}</p>
					<img v-if="items.photo" v-lazy="items.photo.url" alt="">
				</dd>
			</dl>
		</div>

		<!-- 相似产品推荐1 -->
		<div class="detail_box similar">
			<h3><i></i>Similar Experiences</h3>
			<ul class="similar_list">
				<li><i class="iconfont">&#xe620;</i>Forbidden City + Lunch</li>
				<li><i class="iconfont">&#xe620;</i>Forbidden City + Lunch</li>
				<li><i class="iconfont">&#xe620;</i>Forbidden City + Lunch</li>
			</ul>
		</div>
		

		<!-- 公底部 -->
		<foot></foot>

		<!-- 导游弹窗 -->
		<div class="guide_dialog" v-show="showGuideDetail">
			<div class="guide_dialog_header">
				<span class="iconfont" @click="showGuideDetail=false">&#xe606;</span>
				{{guideSwiperIndex+1}}/{{detail.guide.length}} Experts
			</div>

			<div class="swiper-container js_guide_detail">
				<div class="swiper-wrapper">
					<div class="swiper-slide" v-for="(item,index) in detail.guide" :key="index">
						<div class="guide_detail">
							<div class="guide_img" v-lazy:background-image="item.guidePhoto.headPortraitUrl"></div>
							<div class="guide_content">
								<h3>{{item.enName}}</h3>
								<p>Old Beijing history consultant</p>
								<p><b>Trips Given: </b>{{item.serviceTimes}}</p>
								<p><b>Birthplace: </b>{{item.birthplace}}</p>
								<p><b>Language(s): </b><span v-for="(Language,num) in item.guideLanguages">{{(num>0?' , ':'')+Language.language+'('+Language.level+')'}}</span></p>
								<p>{{item.selfIntro}}</p>
								<br>
							</div>
						</div>
						<div class="guide_dialog_footer">
							<div class="btn" @click="checkGuideFn(index)" v-if="checkGuideIndex===index"><i class="iconfont">&#xe654;</i> Successfully selected</div>
							<div class="btn" @click="checkGuideFn(index)" v-else>Select this expert</div>
						</div>
						
					</div>
				</div>
				<div class="swiper-button-prev iconfont">&#xe615;</div><!--左箭头-->
    		<div class="swiper-button-next iconfont">&#xe620;</div><!--右箭头-->
			</div>
		</div>

		<!-- 日历遮罩 -->
		<transition name="fade">
			<div class="win_bg" id="win_bg" @click="showWinBg = false" v-show="showWinBg"></div>
		</transition>


		<!-- inquiry弹层 -->
		<dialogBox v-model="dialogInquiryStatus" @confirmCallback="confirmCallback" width="100%">
			<inquiry :objectId="id" @inquiryCallback="inquiryCallback"></inquiry>
		</dialogBox>


		<!-- service弹窗 -->
		<dialogBox v-model="dialogStatus" confirmShow="true" confirmText="Confirm" @confirmCallback="serviceConfirmCallback" @closeCallback="serviceConfirmCallback" width="100%">
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

	import Vue from 'vue';
	import Head from '~/components/header/index';
	import foot from "~/components/footer/index";
	import dialogBox from '~/plugins/panda/dialogBox';
	import inquiry from '~/components/info/inquiry/inquiry'
	import service from '~/components/info/inquiry/service';
	import {addmulMonth,formatDate} from "~/assets/js/utils";
	import Flatpickr from 'flatpickr';

	export default {
		name: "activitiesDetail",
		async asyncData({
			route,
			store,
			error,
			apiBasePath,
			redirect,
			req
		},callback) {
			
			//获取页面cookie
			var userCookie = {};
			if(req){
				var cookie = req.headers.cookie;
				if(cookie){
					var cookieArr = cookie.split(';');
					for(var i=0;i<cookieArr.length;i++){
						var thisCookie = cookieArr[i].split('=');
						userCookie[thisCookie[0].trim()] = (thisCookie[1]||'').trim();
					}
				}
			};

			//console.log(userCookie.currency);

			//node请求时间
			var consoleTimeS = new Date().getTime();
			console.log('node start time:'+consoleTimeS);

			let id = route.params.id;
			// 服务端渲染部分 这部分操作还没有页面实例，只是初始化页面数据
			let data = {
				id: id,
				detail: {}, //详情数据
				logIn: "",
				toast: "This activity was booked by another guest an hour ago",
				toastShow: false,
				currency:{code: "USD", symbol: "$", exchangeRate: 1},
				participants:0,
				exchange:[],
				calendar:[],
				people:0,

				
			};

			//设置币种
			if(userCookie.currency){
				data.currency = JSON.parse(decodeURIComponent(userCookie.currency));
				
			}
			//设置人数
			if(userCookie.participants){
				data.participants=JSON.parse(decodeURIComponent(userCookie.participants))
			}

			
			try {
				//基本信息
				var Promise1 = new Promise(function(resolve, reject){
					Vue.axios.get(apiBasePath + "product/activity/" + id).then(function(res) {
						
						//获取可售日期
						if(!res.data.allAvailable){
							Vue.axios.get(apiBasePath + "product/activity/"+id+"/sale/calendar").then(function(response) {
								data.calendar = response.data?response.data:[];
								resolve(res);
							}, function() {
								resolve(res);
							});
						}else{
							resolve(res);
						}
					}, function(res) {
						resolve(res);
					});
				});

				
				//推荐信息
				var Promise2 = new Promise(function(resolve, reject){
					Vue.axios.get(apiBasePath + "product/activity/"+id+"/recommend?currency="+data.currency.code).then(function(res) {
						resolve(res);
					}, function(res) {
						resolve(res);
					});
				});

				//价格信息
				var Promise3 = new Promise(function(resolve, reject){
					Vue.axios.get(apiBasePath + "product/activity/"+id+"/price?currency="+data.currency.code).then(function(res) {
						resolve(res);
					}, function(res) {
						resolve(res);
					});
				});

				//价格明细
				var Promise4 = new Promise(function(resolve, reject){
					Vue.axios.get(apiBasePath + "product/activity/"+id+"/price/detail?currency="+data.currency.code).then(function(res) {
						resolve(res);
					}, function(res) {
						resolve(res);
					});
				});

				//点评
				var Promise5 = new Promise(function(resolve, reject){
					Vue.axios.post(apiBasePath+"user/comment/list",JSON.stringify({"activityId": id,'pageNum':1,'pageSize':3}),{
							headers: {
							'Content-Type': 'application/json'
							}
						}).then(function(res) {
						resolve(res);
					}, function(res) {
						resolve(res);
					});
				});

				//banner
				var Promise6 = new Promise(function(resolve, reject){
					Vue.axios.get(apiBasePath+"public/photo/"+id+"/ACTIVITY_BANNER/list").then(function(res) {
						resolve(res);
					}, function(res) {
						resolve(res);
					});
				});

				//行程
				var Promise7 = new Promise(function(resolve, reject){
					Vue.axios.get(apiBasePath+"product/activity/"+id+"/itinerary/list").then(function(res) {
						resolve(res);
					}, function(res) {
						resolve(res);
					});
				});

				//包含
				var Promise8 = new Promise(function(resolve, reject){
					Vue.axios.get(apiBasePath+"product/activity/"+id+"/content/ITEMS_INCLUDED/list").then(function(res) {
						resolve(res);
					}, function(res) {
						resolve(res);
					});
				});

				//不包含
				var Promise9 = new Promise(function(resolve, reject){
					Vue.axios.get(apiBasePath+"product/activity/"+id+"/content/ITEMS_EXCLUDED/list").then(function(res) {
						resolve(res);
					}, function(res) {
						resolve(res);
					});
				});

				//注意事项
				var Promise10 = new Promise(function(resolve, reject){
					Vue.axios.get(apiBasePath+"product/activity/"+id+"/content/NOTICE/list").then(function(res) {
						resolve(res);
					}, function(res) {
						resolve(res);
					});
				});

				//导游信息
				var Promise11 = new Promise(function(resolve, reject){
					Vue.axios.get(apiBasePath+"product/ACTIVITY/"+id+"/guide/info/list").then(function(res) {
						resolve(res);
					}, function(res) {
						resolve(res);
					});
				});

				
				Promise.all([Promise1,Promise2,Promise3,Promise4,Promise5,Promise6,Promise7,Promise8,Promise9,Promise10,Promise11]).then(function(results){

					//基本信息
					var detailData = results[0].data;
					
					if(detailData.valid || route.query.valid==1) {//.valid == 1

						//基本信息
						data.detail = detailData;
						

						//价格信息
						data.picInfo = results[2].data;
						data.picInfo.departureTime ? (data.time = data.picInfo.departureTime[0]) : (data.time = "");
						data.picInfo.details = results[3].data;

						

						//点评信息
						var remarkData = results[4];
						if(remarkData.data){
							data.remarkData = remarkData.data;
						}

						//banner图
						data.detail.bannerPhotos = results[5].data || [];
						//行程信息
						data.detail.itinerary = results[6].data || [];

						//包含
						data.inclusions = results[7].data || [];
						//不包含
						data.exclusions = results[8].data || [];
						//注意事项
						data.notice = results[9].data || [];
						//导游信息
						data.detail.guide = results[10].data;

						//推荐信息
						data.detail.recommed = results[1].data;


						if(detailData.latestBooking < 1) {
							data.toast = "This activity was booked by another guest in the past hour.";
						} else if(detailData.latestBooking == 1) {
							data.toast = "This activity was booked by another guest an hour ago.";
						} else {
							data.toast = "This activity was booked by another guest " + detailData.latestBooking + " hours ago.";
						}


					} else {
						//同步回调
						callback(null,error({
							statusCode: 404,
							message: "404"
						}));
					};


					var consoleTimeS2 = new Date().getTime();
					console.log('node end time:'+consoleTimeS2);
					console.log('在node端渲染，请求所有接口花费时间：'+(consoleTimeS2-consoleTimeS)+' ms');

					//同步回调
					// console.log(data);
					callback(null,data);
					

				});


			} catch(err) {
				console.log(err);
				return error({
					statusCode: 500,
					message: JSON.stringify(err)
				});
			}

			
			
			//return data;
		},
		head() {
			let title = this.detail.title;
			let description = this.detail.category + " " + this.detail.duration + " " + this.detail.durationUnit + " " + this.detail.title;
			let keywords = this.detail.tourTypes ? this.detail.tourTypes.join(",") : '';
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
		components: {
			Head,
			foot,
			dialogBox,
			inquiry,
			service
		},
		data(){
			
			return {
				//导游
				showGuideDetail:false,
				guideSwiper:null,
				hasGuide:false,
				checkGuideIndex:'',
				guideSwiperIndex:0,

				//选择日期和人数板块
				showFixedBtn:true,
				showWinBg:false,
				showChangePeople:false,
				showPriceInfo:false,
				startDate:'',
				adultsText:'Adults',
				childrenText:'Chlidren (age 3-'+12+')',//this.picInfo.childStandard
				checkTipText:'',
				changeAdults:0,
				changeChildren:0,
				bookAdults:0,
				bookChildren:0,
				bookPeople:0,
				price:0,
				perPersonPrice:0,
				amount:0,

				// 币种
				nowExchange:{},
				selectCurrency:'USD',

				//inquiry
				dialogInquiryStatus:false,
				dialogStatus:false,
				emailTip:false,
				emailSendTip:false,
				showEmailBox:false,
				inqueryEmail:'',
				inqueryEmailOld:'',
				feedbackId: ''
			}
		},
		methods: {
			formatDate:formatDate,
			changePeople(){

			},
			headCurrencyFn(){
				
			},
			changeCurrency(){
				
			},
			itineraryFn(e){
				var thisList = getParents(e.target,'itinerary_list');
				if(/active/.test(thisList.className)){
					thisList.className = 'itinerary_list';
				}else{
					thisList.className = 'itinerary_list active';
				}
				
			},
			itineraryViewall(){

			},
			remarkStarHtml(score){
				var thisHtml = '';
				for(var i=0;i<5;i++){
					if(/\./.test(score/2+'') && i == parseInt(score/2)){
						thisHtml += '<span class="star_list star_h"><i></i><div class="star_half"><span class="star_list"><i></i></span></div></span>';
					}else if(i>score/2-1){
						thisHtml += '<span class="star_list star_no"><i></i><div class="star_half"><span class="star_list"><i></i></span></div></span>';
					}else{
						thisHtml += '<span class="star_list"><i></i><div class="star_half"><span class="star_list"><i></i></span></div></span>';
					}
				}
				return thisHtml;
			},
			returnFloat(value) {
				value*=1;
				if(value) {
					var numberArr = (''+value).split('.');
					if(numberArr.length>1 && numberArr[1].length>2){
						if(this.zeroLength(numberArr[1])>5){
							return value.toFixed(2);
						}else{
							return (value+0.005).toFixed(2);
						}
					}
					return (value*1).toFixed(2);
				}else{
					return 0;
				}
			},
			showGuideFn(index,type){
				var self = this;
				this.showGuideDetail = true;
				//初始化过就不再初始化
				if(!self.guideSwiper){
					this.$nextTick(function(){
						self.guideSwiper = new Swiper('.js_guide_detail', {
							autoplay: false,//可选选项，自动滑动
							initialSlide:index,
							navigation: {
								nextEl: '.swiper-button-next',
								prevEl: '.swiper-button-prev',
							},
							on:{
								slideChangeTransitionEnd: function(){
									self.guideSwiperIndex = this.activeIndex;
								},
							},
						});
					});
				}else{
					//滑动到对应索引
					self.guideSwiper.slideTo(index, 0, function(){
						self.guideSwiperIndex = index;
					});
				}

				if(type){
					ga(gaSend, {
						hitType: "event",
						eventCategory: "activity_detail",
						eventAction: "click",
						eventLabel:"guide"
					});
				}

			},
			checkGuideFn(index){
				this.showGuideDetail = false;
				this.checkGuideIndex = index;
			},
			changeCurrency(e){
				var self = this;
				var value = e.target ? e.target.value : e;
				var picInfo = this.picInfo;
				var thisDetail = picInfo.details;
				
				var exchange = this.exchange;
				//设置当前币种
				for(var i=0;i<exchange.length;i++){
					var thisEx = exchange[i];
				 	//检测当前货币类型
				 	if(thisEx.code==value){
						self.nowExchange = thisEx;
					}
				}
				//换算折扣价
				self.axios.get("https://api.localpanda.com/api/product/activity/"+this.id+"/price?currency="+value).then(function(res) {
							if(self.picInfo.childDiscount){
								self.picInfo.childDiscount=res.data.childDiscount
							}
							self.picInfo.bottomPrice=res.data.bottomPrice
							self.picInfo.currency=res.data.currency
							
							
					}, function(res) {
						
					});
					
					self.axios.get("https://api.localpanda.com/api/product/activity/"+this.id+"/price/detail?currency="+value+(self.participants?'&participants='+self.participants:'')).then(function(res) {
							self.picInfo.details=res.data
							
							//重设book价格
							self.setPeoplePrice();

							self.sixArr=res.data
							if(self.peopleNum>0){
								self.adultsPic =thisDetail[self.peopleNum-1].price;	
							}
							if(res.data.length>6){
								self.isShowTable=true
								self.sixArr=res.data.concat().splice(0,6);
							}else{
								self.sixArr=res.data;
							}
					}, function(res) {
						
					});
				
				//切换币种
				self.$emit('input',this.nowExchange);

				//请求推荐模块
				this.axios.get("https://api.localpanda.com/api/product/activity/"+this.id+"/recommend?currency="+value).then(function(res) {
					if(res.status==200){
						self.$emit('currencyChange',res.data);
					}
				}, function(res) {});
			},
			///选择日期和人数
			checkInit(){
				var self = this;
				
				//团期日期
				var saleDate = [];
				for(var i=0;i<this.calendar.length;i++){
					var thisData = this.calendar[i];
					saleDate.push(thisData.saleDate);
				}


				this.options = {
					minDate: this.picInfo.earliestBookDate,
					maxDate: addmulMonth(this.picInfo.earliestBookDate, 12),
					disableMobile: true,
					enable: saleDate,
					onOpen : function(e){
						
						self.showWinBg = true;
					},
					onChange(){
						self.showWinBg = false;
					}
				}
				
				self.flatPickr = new Flatpickr('#js_changetime',this.options);
			},
			peopleRed(e,type){
				if(/change_btn_dis/.test(e.target.className)){
					return;
				};

				if(type==1){
					this.changeAdults--;
				}else{
					this.changeChildren--;
				};
			},
			peopleAdd(e,type){
				if(/change_btn_dis/.test(e.target.className)){
					return;
				};

				if(type==1){
					this.changeAdults++;
				}else{
					this.changeChildren++;
				}
			},
			// peopleChange(){
			// 	var changeChildren = this.changeChildren;
			// 	this.peopleText = 'Adult x '+this.changeAdults+(changeChildren?' , '+(changeChildren==1?'child':'children')+' x '+changeChildren:'');
			// 	this.showChangePeople = false;
			// 	this.showPriceInfo = true;
			// 	this.bookChildren = changeChildren;
			// 	this.bookPeople = this.changeAdults+changeChildren;
			// },
			setPeoplePrice(){
				var details = this.picInfo.details;
				var bookPeople = this.bookPeople;
				for(var i=0;i<details.length;i++){
					var thisData = details[i];
					if(thisData.capacity==bookPeople){
						this.price = thisData.price;
						this.perPersonPrice = thisData.perPersonPrice;
						this.amount = this.returnFloat(this.price - (this.picInfo.childDiscount?this.returnFloat(this.picInfo.childDiscount*this.bookChildren):0));
						break;
					}
				}
			},
			availability(){
				var self = this;
				var peopleStatus = this.peopleStatus();
				//判断日期
				if(!self.startDate){
					setTimeout(function(){
						self.flatPickr.open();
					},80);
					self.showWinBg = true;
				}else{
					this.validatePeople();
				}
				
				ga(gaSend, {
					hitType: "event",
					eventCategory: "activity_detail",
					eventAction: "click",
					eventLabel:"Check_availability"
				});

			},
			validatePeople(){
				var peopleStatus = this.peopleStatus();
				// var $check_people = document.querySelectorAll('.check_people');
				if(this.bookAdults + this.bookChildren==0){ //判断是否已选人数
					this.checkTipText = 'include at least one adult';
					// $check_people[0].style.borderColor = 'red';
				}else if(peopleStatus==0){ //判断人数对不对
					this.checkTipText = 'The minimum number of Participants is '+this.picInfo.minParticipants+' in total';
					this.showPriceInfo = false;
					// $check_people[0].style.borderColor = 'red';
					// $check_people[1].style.borderColor = 'red';
					return false;
				}else if(peopleStatus==2){
					this.checkTipText = 'Exceed the maximum number of Participants';
					this.showPriceInfo = false;
					// $check_people[0].style.borderColor = 'red';
					// $check_people[1].style.borderColor = 'red';
					return false;
				}else if(!this.bookAdults){
					this.checkTipText = 'include at least one adult';
					// $check_people[0].style.borderColor = 'red';
				}else{
					this.checkTipText = '';
					this.showPriceInfo = true;
					// $check_people[0].style.borderColor = '#ebebeb';
					// $check_people[1].style.borderColor = '#ebebeb';
					return true;
				}
			},
			//检测人数是否在产品可选人数之内
			peopleStatus(){
				var allPeople = this.bookAdults + this.bookChildren;
				var picInfo = this.picInfo;
				if(allPeople>=picInfo.minParticipants && allPeople<=picInfo.maxParticipants){
					return 1;
				}else if(allPeople<picInfo.minParticipants){
					return 0;
				}else{
					return 2;
				}
			},
			addZero(num){
				return num>9 ? num : '0'+num;
			},
			getRefundDate(dateStr,days){
				var dt = new Date(dateStr.replace(/\-/g,'/'));
				dt.setDate(dt.getDate()-days);
				return dt.getFullYear() + "-" +this.addZero(dt.getMonth()+1) + "-" + this.addZero(dt.getDate());
			},
			goCheck(){
				var checkTop = document.querySelector('#check_all').offsetTop;
				document.documentElement.scrollTop = document.body.scrollTop = checkTop;
			},
			hideScroll(val){
				if(val){
					document.querySelector('html').style.overflowY = 'hidden';
					document.querySelector('body').style.overflowY = 'hidden';
				}else{
					document.querySelector('html').style.overflowY = 'inherit';
					document.querySelector('body').style.overflowY = 'inherit';
				}
			},
			inquiryCallback(val){
				this.dialogInquiryStatus = false;
				if(val){
					var data = val.data;
					this.feedbackId = data.response;
					this.inqueryEmailOld = val.email;
					this.dialogStatus = true;
				}
			},
			serviceConfirmCallback(){
				this.dialogStatus = false;
				this.emailSendTip = true;
			},
			confirmCallback(){
				this.dialogInquiryStatus = false;
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
				
			},
			gaInquire(){
				ga('gtag_UA_107010673_2.send', {
					hitType: 'event',
					eventCategory: 'activity_detail',
					eventAction: 'click',
					eventLabel: 'activity_inquiry',

				});
				// localStorage.setItem("owner",this.detail.owner)
				// location.href='/info/inquiry?objectId='+this.id
				this.dialogInquiryStatus = true;
			},
			bookFn(){
				var self = this;
				if(!self.startDate){
					setTimeout(function(){
						self.flatPickr.open();
					},80);
					self.showWinBg = true;
					return false;
				}
				// else if(!this.bookAdults){
				// 	this.validatePeople();
				// 	return false;
				// }

				ga(gaSend, {
					hitType: "event",
					eventCategory: "activity_detail",
					eventAction: "click",
					eventLabel:"book_succeed"
				});
				
				var orderInfo = {
		      activityId: this.id,
		      amount: this.amount,
					currency: this.picInfo.currency,
					symbol: this.nowExchange.symbol,
					adultNum: this.bookAdults,
					refundTimeLimit: this.picInfo.refundTimeLimit,
				  fullRefund:this.picInfo.fullRefund,
				  finalRefundPeriod:(this.picInfo.fullRefund?this.getRefundDate(this.startDate,this.picInfo.refundTimeLimit):null),  //最后退款日期
					childrenNum: this.bookChildren,
					infantNum: 0,
					startDate: this.startDate, //出游时间
					startTime: null,  //
					adultsPic: this.price,
					title: this.detail.title,
					childDiscount: this.picInfo.childDiscount*this.bookChildren, //儿童优惠总价
					childDiscountP: this.picInfo.childDiscount,  //儿童优惠平均价
				  pickup: this.detail.pickup,
				  owner:this.detail.owner,
		      averagePrice: this.perPersonPrice, //人均价 
		      guideId: this.checkGuideIndex!=='' ? this.detail.guide[this.checkGuideIndex].guideId : null
				};
				
				
				orderInfo = JSON.stringify(orderInfo);
		    localStorage.setItem("orderInfo", orderInfo);
				location.href="/activity/booking/"+this.id;
			}
		},
		mounted: function() {
			var self=this;

			//币种信息
			this.exchange = this.currencyData;

			var cookieCurrency = JSON.parse(Cookie.get('currency'));
			var ua = window.navigator.userAgent.toLowerCase();
			var isWx = (ua.match(/MicroMessenger/i) == 'micromessenger') ? true : false;
			//设置当前币种
			var currency= cookieCurrency ? cookieCurrency : (isWx ? {'code':'CNY','symbol':'¥'} : {'code':'USD','symbol':'$'});

			if(this.currency.code!=currency.code){
				this.currency=currency
			}
			console.log(currency);
			console.log(this.$data);

			//初始化日期选择
			this.checkInit();

			//等待渲染完毕后调用
			this.$nextTick(function(){
				//头图
				new Swiper('#swiper_bannerbox', {
					autoplay: {
						delay: 3000,
						disableOnInteraction: false
					},
					loop: false,
					lazy: true,
					// 如果需要分页器
					pagination: {
						el: '#swiper_banner_pagination'
					}
				});

				//导游
				new Swiper('.js_guide', {
					autoplay: false,//可选选项，自动滑动
					slidesPerView : 4.5
				});
			});


			//浏览器事件处理，针对inquiry弹层
      window.onpopstate = function(event) {
				self.confirmCallback();
				self.serviceConfirmCallback();
			};

			// console.log(this.picInfo);

		},
		watch: {
			//监听币种变化
			value:function(val){
				if(this.nowExchange.code !== val.code){
					this.changeCurrency(val.code);
				}
				this.nowExchange = val;
				this.SelectCurrency=val.code
				
			},
			bookAdults:function(val){
				
				this.adultsText = (val>1?'Adults':'Adult')+' x '+val;
				
				//校验人数
				if(this.validatePeople()){
					this.bookPeople = val + this.bookChildren;
				}

				ga(gaSend, {
					hitType: "event",
					eventCategory: "activity_detail",
					eventAction: "select",
					eventLabel:"guests"
				});

				ga(gaSend, {
					hitType: "event",
					eventCategory: "activity_detail",
					eventAction: "select",
					eventLabel:"detail_select"
				});
				
			},
			bookChildren:function(val){
				
				this.childrenText = (val?(val==1?'Child':'Children')+' x '+val:'Chlidren (age 3-12)');

				//校验人数
				if(this.validatePeople()){
					this.bookPeople = val + this.bookAdults;
				}
			},
			bookPeople:function(){
				//设置价格
				this.setPeoplePrice();
			},
			showGuideDetail:function(val){
				this.hideScroll(val);
			},
			showWinBg:function(val){
				this.hideScroll(val);
			},
			startDate(){
				ga(gaSend, {
					hitType: "event",
					eventCategory: "activity_detail",
					eventAction: "select",
					eventLabel:"date"
				});

				ga(gaSend, {
					hitType: "event",
					eventCategory: "activity_detail",
					eventAction: "select",
					eventLabel:"detail_select"
				});

				
			}
		}
	};
</script>

<style lang="scss" scoped>
	#activitiesDetail{
		background-color: #f5f7f6;
		.crumbs{
			font-size: 0.22rem;
			background-color: #fff;
			color: #878e95;
			vertical-align: top;
			line-height: 0.6rem;
			overflow: hidden;
			padding: 0 0.3rem;
			*{
				float: left;
				color: #878e95;
			}
		}
		.banner{
			width:  100%;
			img{
				max-width: 100%;
			}
		}
		.detail_box{
			padding: 0.3rem 0.3rem 0.4rem;
			background-color: #fff;
			margin-bottom: 0.16rem;
			h3{
				font-size: 0.3rem;
				font-weight: bold;
				color: #353a3f;
				line-height: 0.54rem;
				overflow: hidden;
				i{
					float: left;
					margin-top: 0.12rem;
					margin-right: 0.2rem;
					width: 0.06rem;
					height: 0.3rem;
					background-color: #1bbc9d;
					border-radius: 0.03rem;
				}
			}
			.detail_p{
				font-size: 0.26rem;
				line-height: 0.36rem;
			}
		}
		.activity_top{
			padding-top: 0.3rem;
			h2{
				font-size: 0.44rem;
				font-weight: bold;
				line-height: 0.56rem;
				span{ color: #fff; background-color: #f4b33f; font-size: 0.26rem; line-height: 0.38rem; display: inline-block; padding: 0 0.1rem; border-radius: 0.05rem; vertical-align: middle; margin-right: 0.2rem; font-weight: normal;}
			}
			.price_info{
				padding-top: 0.2rem;
				
				p{
					font-size: 0.46rem;
					span{
						font-size: 0.22rem;
						color: #878e95;
					}
				}
			}
			.booking_info{
				color: #878e95;
				span{ float: right; font-size: 0.22rem}
				.remark_star{
					 float: right;
					 padding-top: 0.04rem;
					 margin-right: 0.1rem;
				}
			}
			.activity_info{
				padding-top: 0.15rem;
				border-top: 1px solid #dde0e0;
				margin-top: 0.2rem;
				li{
					padding: 0.1rem 0;
					i{font-size: 0.26rem; margin-right: 0.15rem;}
					font-size: 0.26rem;
					line-height: 0.36rem;
				}
			}
		}

		.why{
			.detail_p{
				margin-top: 0.25rem;
			}
			.detail_txt_list{
				margin-top: 0.3rem;
			}
		}

		.guide{
			.guide_list{
				width: calc(100vw - 0.4rem);
				margin-top: 0.4rem;
				padding-bottom: 0.1rem;
				.swiper-slide{
					border-radius: 50%;
					overflow: hidden;
					position: relative;
					img{ width: 100%; border: 4px solid #fff; box-sizing: border-box; border-radius: 50%;}
					.guide_list_head{
						width: 100%;
						padding-bottom: calc(100% - 8px);
						height: 0;
						border: 4px solid #fff; box-sizing: border-box; border-radius: 50%;
						background-position: center center;
						background-size: cover;
						background-repeat: no-repeat;
					}
					span{ 
						display: none; width: 100%; height: 100%; position: absolute; left: 0; top: 0; text-align: center;
						i{
							position: absolute; left: 50%; top: 50%; transform: translate(-50%,-50%); color: #1bbc9d;
						}
					}
				}
				.active{
					.guide_list_head{border-color:rgba(27,188,157,0.8);}
					span{
						display: block;
					}
				}
			}
		}

		.check{
			.check_info{
				li{
					clear: both;
					position: relative;
					margin-top: 0.24rem;
					.check_box,input{
						line-height: 0.74rem;
						border: 1px solid #ebebeb;
						box-sizing: border-box;
						width: 100%;
						padding-left: 0.76rem;
						position: relative;
						z-index: 2;
						background: none;
						
						font-size: 0.28rem;
						color: #878e95;
						border-radius: 4px;
					}
					input{color: #353a3f;}
					input::-webkit-input-placeholder { color: #878e95; }
					.input_icon{
						position: absolute;
						left: 0;
						top: 0;
						width: 0.6rem;
						text-align: center;
						line-height: 0.76rem;
						color: #878e95;
						font-size: 0.36rem;
					}
					.flatpickr-input{ opacity: 0; z-index: 2; position: relative;}
					.time_box{ position: absolute; left: 0; z-index: 1; top: 0;}
					.arrow{
						width: auto;
						display: block;
						text-align: center;
						position: absolute;
						right: 0.1rem;
						top: 0;
						line-height: 0.76rem;
						color: #353a3f;
						font-size: 0.26rem;
						// border: 6px solid #000;
						// border-color: #000 #fff #fff #fff;
					}
					.check_tip{
						margin: 0 0 0.25rem;
						span{ color: red; display: inline-block; vertical-align: middle;}
					}
				}
				.check_people{
					width: 48%;
					float: left;
					clear: inherit;
					height: 0.78rem;
					border: 1px solid #ebebeb;
					box-sizing: border-box;
					margin-bottom: 0.25rem;
					&:nth-child(3){
						margin-left: 4%;
					}
					select{
						opacity: 0;
						border: none;
						height: 0.74rem;
						line-height: 0.74rem;
						width: 100%;
						position: relative;
						z-index: 2;
						box-sizing: border-box;
						padding-left: 0.7rem;
						background: none;
						appearance:none;
						-moz-appearance:none;
						-webkit-appearance:none;
						font-size: 0.28rem;
					}
					.check_people_text{ position: absolute; left: 0.76rem; top: 0; height: 0.74rem; line-height: 0.74rem; font-size: 0.22rem;}
					.check_child_text{ position: absolute; left: 0.6rem; top: 0; height: 0.74rem; line-height: 0.74rem; font-size: 0.22rem;}
				}
				.change_people{
					position: absolute; left: 0; top: calc(100% - 1px); width: 100%; box-sizing: border-box; padding: 0 0.26rem 0.36rem; background-color: #fff; z-index: 3;border: #ebebeb solid 1px;border-top:none; border-radius: 0 0 4px 4px;
					dl{
						overflow: hidden;
						padding: 0.44rem 0 0.2rem;
						&:nth-child(1){
							border-top: #ebebeb solid 1px;
						}
						dt{ float: left;line-height: 0.6rem; font-size: 0.28rem; font-weight: bold;
							span{ display: block;font-size: 0.24rem; line-height: 0.24rem; margin-top: 0.1rem;}
						}
						dd{ 
							float: right;
							.change_btn{
								display: inline-block;
								color: #1bbc9d;
								width: 0.6rem;
								height: 0.6rem;
								line-height: 0.6rem;
								text-align: center;
								border: 1px solid #1bbc9d;
								border-radius: 50%;
								font-size: 0.36rem;
							}
							.change_btn_dis{ color: #ccc; border-color: #ccc;}
							.people_num{
								display: inline-block;
								width: 0.8rem;
								text-align: center;
								font-size: 0.36rem;
								line-height: 0.6rem;
							}
						}
					}
					.btn{ height: 0.78rem; line-height: 0.78rem; margin-top: 0.3rem;}
				}

				
			}
			.book_all{
				margin-top: 0.5rem;
				.book_guide_check{
					padding-left: 0.7rem;
					overflow: hidden;
					font-size: 0.28rem;
					margin-bottom: 0.3rem;
					line-height: 0.38rem;
					i{ float: left; margin-left: -0.7rem; width: 0.38rem; height: 0.38rem; border: 1px solid #dde0e0; border-radius: 50%; box-sizing: border-box;}
				}
				.active{
					i{border: 6px solid #1bbc9d;}
				}
				.book_guide_info{
					font-size: 0.28rem;
					line-height: 0.78rem;
					.book_guide_select{
						float: right;
						color: #1bbc9d;
						text-decoration: underline;
					}
					.book_guide_photo{
						float: left;
						width: 0.78rem;
						height: 0.78rem;
						border-radius: 50%;
						overflow: hidden;
						margin-right: 0.3rem;
						background-position: center center;
						background-size: cover;
						background-repeat: no-repeat;
					}
				}
				.book_price_box{
					font-size: 0.28rem;
					margin-top: 0.3rem;
					.book_price_info{
						border-top: #ebebeb solid 1px;
						overflow: hidden;
						padding: 0.3rem 0;
						dt{
							float: left;
							span{
								display: block;
								line-height: 0.4rem;
							}
						}
						dd{
							float: right;
							.price_select_box{
								display: inline-block;
								float: none;
								line-height: 0.32rem;
								margin-right: 0.2rem;
								select{
									line-height: 0.32rem;
								}
								.iconfont{
									line-height: 0.34rem;
									height: 0.32rem;
								}
								
							}
						}
					}
					.hr{ height: 1px; background-color: #ebebeb;}
					.book_tip{ margin-top: 0.3rem; font-size: 0.22rem;}
					.btn{margin-top: 0.6rem;}
				}
			}
		}

		.itinerary{
			padding-bottom: 0.2rem;
			.btn_viewall{
				float: right;
				color: #1bbc9d;
				border: 1px solid #1bbc9d;
				height: 0.52rem;
				line-height: 0.52rem;
				padding: 0 0.4rem;
				border-radius: 0.27rem;
				font-weight: normal;
			}
			.itinerary_list{
				border-top: 1px solid #dde0e0;
				&:nth-child(2){ border:none;}
				dt{
					font-size: 0.26rem;
					font-weight: bold;
					line-height: 0.4rem;
					padding: 0.3rem 0;
					position: relative;
					z-index: 2;
					i{
						float: right;
						font-size: 0.36rem;
					}
					span{
						float: left;
						margin:0.14rem 0.2rem 0 0;
						width: 0.12rem;
						height: 0.12rem;
						border-radius: 0.06rem;
						background-color: #353a3f;
					}
					.i_up{
						display: block;
					}
					.i_down{
						display: none;
					}
				}
				dd{
					padding-bottom: 0.4rem;
					margin-top: -0.3rem;
					display: none;
					p{
						line-height: 0.36rem;
						font-size: 0.26rem;
						margin-top: 0.1rem;
					}
					img{
						display: block;
						max-width: 100%;
						margin-top: 0.15rem;
						border-radius: 5px;
					}
				}
			}
			.active{
				dt{
					.i_up{
						display: none;
					}
					.i_down{
						display: block;
					}
				}
				dd{
					display: block;
				}
				
			}
		}

		.similar{
			padding-bottom: 0.5rem;
			.similar_list{
				margin-top: 0.3rem;
				li{
					overflow: hidden;
					height: 0.96rem;
					line-height: 0.96rem;
					background-color: #faf9f8;
					border-radius: 5px;
					border: solid 1px #ebebeb;
					padding-left: 0.3rem;
					font-size: 0.28rem;
					font-weight: bold;
					margin-top: 0.14rem;
					i{
						float: right;
						font-size: 0.26rem;
						margin-right: 0.3rem;
					}
				}
			}
		}
		

		.detail_txt_list{
			li{
				margin-top: 0.1rem;
				padding-left: 0.32rem;
				font-size: 0.26rem;
				line-height: 0.36rem;
				i{
					float: left;
					margin-left: -0.32rem;
					margin-top: 0.12rem;
				}
				.dian{
					width: 0.12rem;
					height: 0.12rem;
					border-radius: 50%;
					background-color: #353a3f;
				}
			}
		}

		



		.btn_inquire{
			display: block;
			height: 0.86rem;
			line-height: 0.86rem;
			text-align: center;
			color: #FFF;
			font-weight: bold;
			border-radius: 0.6rem;
			margin-top: 0.23rem;
			font-size: 0.32rem;
			border: solid 1px #1bbc9d;
			background: #fff;
			color: #1bbc9d;
			font-size:0.36rem;
		}
		
		
		.guide_dialog{
			position: fixed;
			left: 0;
			top: 0;
			z-index: 999;
			width: 100%;
			height: 100%;
			box-sizing: border-box;
			
			color: #353a3f;
			background-color: #f5f5f5;
			.guide_dialog_header{
				padding: 0 0.3rem;
				background-color: #f5f5f5;
				// padding: 0.3rem 0;
				font-size: 0.28rem;
				height: 1rem;
				line-height: 1rem;
				// color: #000;
				
				// position: fixed;
				// top: 0;
				// left: 0;
				// width: 100%;
				.iconfont{
					position: absolute;
					right: 0.3rem;
					top: 0;
					font-size: 0.4rem;
					padding: 0 0.2rem;
				}
			}
			.swiper-container{
				height: calc(100% - 1rem);
				.swiper-wrapper,.swiper-slide{
					height: 100%;
				}
				.swiper-button-next,.swiper-button-prev{
					width: 0.88rem;
					height: 0.88rem;
					border-radius: 50%;
					text-align: center;
					line-height: 0.88rem;
					color: #fff;
					font-size: 0.36rem;
					background: none;
					background-color: rgba(0,0,0,0.3);
					z-index: 99;
				}
				.swiper-button-next:focus,.swiper-button-prev:focus,.swiper-button-next:active,.swiper-button-prev:active{
					box-shadow: none;
					border: none;
				}
			}
			.guide_detail{
				height: calc(100vh - 2.2rem);
				overflow-y: auto;
				-webkit-overflow-scrolling: touch;
				background-color: #fff;
				margin: 0 0.3rem;
				.guide_img{
					
					height: 4.6rem;
					background-size: cover;
					background-position: center center;
					background-repeat: no-repeat;
					background-color: #fff;
				}
				
				
				.guide_content{
					padding: 0.4rem;
					box-sizing: border-box;
					
					h3{ font-size: 0.46rem;}
					p{ font-size: 0.26rem; margin-top: 0.15rem;
						b{ font-weight: bold;}
					}
				}
			}
			.guide_dialog_footer{
				position: fixed;
				bottom: 0;
				width: 100%;
				padding: 0.15rem 0.6rem;
				background-color: #f5f5f5;
			}
		}

		.price_select_box{
			float: right;
			position: relative;
			font-size: 0.32rem;
			line-height: 0.8rem;
			i{
				position: absolute;
				right: 0;
				top: 0;
				height: 0.8rem;
				line-height: 0.84rem;
				vertical-align: top;
				font-size: 0.36rem;
				font-weight: bold;
				color: #878e95;
				overflow: hidden;
			}
			select{
				line-height: 0.8rem;
				padding: 0 0.4rem 0 0.2rem;
				font-size: 0.24rem;
				color: #878e95;
				background: none;
				border: none;
				appearance:none;
				-moz-appearance:none;
				-webkit-appearance:none;
				position: relative;
				z-index: 2;
			}
		}

		.win_bg{
			width: 100%;
			height: 100%;
			position: fixed;
			left: 0;
			top: 0;
			background-color: rgba(0,0,0,0.6);
			z-index: 100;
		}
	}
</style>
<style lang="scss">

@import "~/assets/scss/plugin/flatpickr.min.css";

	.flatpickr-months .flatpickr-prev-month svg,
	.flatpickr-months .flatpickr-next-month svg {
		width: 20px!important;
		height: 20px!important;
	}
	.flatpickr-calendar{
		padding: 10px 0;
		width: 90%;
		max-width: 500px;
		position: fixed;
		left: 50%!important;
		top: 50%!important;
		right: auto!important;
		transform: translate(-50%,-50%);
		opacity: 1;
		visibility: initial;
		
		&.animate.open{
			animation: all 0 cubic-bezier(.23,1,.32,1);
			z-index: 999;
			opacity: 1;
		}
		.flatpickr-next-month,.flatpickr-prev-month{
			top: 5px;
		}
		.flatpickr-month{
			height: 40px;
		}
		
		.flatpickr-days,.flatpickr-weekdays,.flatpickr-rContainer,.dayContainer{
			width: 100%;
			max-width: none;
		}
		.flatpickr-day{
			max-width: none;
			height: 7vh;
			max-height: 45px;
		}
	}
	.flatpickr-calendar.open:before,.flatpickr-calendar.open:after{
		display: none;
	}
	.flatpickr-calendar .flatpickr-day.nextMonthDay,.flatpickr-calendar .flatpickr-day.prevMonthDay{
		color: #393939;
	}
	.flatpickr-calendar .flatpickr-day.disabled, .flatpickr-day.disabled:hover{
		color:rgba(57, 57, 57, .3);
	}
	.dateTime {
		
		.flatpickr-input {
			border: none!important;
			padding-left: 0!important;
			height: 1.4rem!important;
			text-align: right;
			color: #1bbc9d;
			font-size: 0.36rem!important;
			width: 100%;
			
		}
		
	}

	#activitiesDetail{
		.header{
			.selectCurrey_box{ display: none!important;}
		}
		.banner{
			.swiper-pagination-bullet{
				border: 1px solid #fff;
				background:none;
				width: 0.14rem;
				height: 0.14rem;
				opacity: 1;
			}
			.swiper-pagination-bullet-active{
				border-color:#1bbc9d;
				background-color: #fff;
			}
		}

		.booking_info{
			.remark_star{
				.star_list{
					width: 0.26rem;
					height: 0.26rem;
				}
			}
		}

		.remark_star{
			display: inline-block;
			.star_list{
				display: inline-block;
				overflow: hidden;
				position: relative;
				vertical-align: top;
				width: 0.32rem;
				height: 0.32rem;
				padding: 1px;
				border-radius: 50%;
				background-image: -webkit-gradient(linear, right top, left top, from(#009efd), to(#1bbc9d));
				background-image: linear-gradient(270deg, #009efd 0%, #1bbc9d 100%);
				i{
					display: inline-block;
					width: 100%;
					height: 100%;
					background-color: #fff;
					border-radius: 50%;
					position: relative;
					overflow: hidden;
					vertical-align: top;
					&:after{
						content: "";
						display: block;
						width: 40%;
						height: 40%;
						border-radius: 50%;
						overflow: hidden;
						position: absolute;
						left: 50%;
						top: 50%;
						transform: translate(-50%,-50%);
						-webkit-transform: translate(-50%,-50%);
						background-image: -webkit-gradient(linear, right top, left top, from(#009efd), to(#1bbc9d));
						background-image: linear-gradient(270deg, #009efd 0%, #1bbc9d 100%);
					}
				}
			}
			.star_half{
				position: absolute;
				right: 0;
				top: 0;
				width: 100%;
				height: 100%;
				overflow: hidden;
				display: none;
				.star_list{
					position: absolute;
					right: 0;
					top: 0;
					margin: 0!important;
					background: #ddd;
					i{
						&:after{
							background: #ddd;
						}
					}
				}
			}
		}
		.star_no{
			.star_half{
				width: 100%;
				display: block;
			}
		}
		.star_no{
			.star_half{
				width: 100%;
				display: block;
			}
		}
		.star_h{
			.star_half{
				width: 50%;
				display: block;
			}
		}
		
	}
	
</style>