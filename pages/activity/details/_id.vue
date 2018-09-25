<template>
	<div id="activitiesDetail">
		<Head :nowCurrency="currency" @headCurrency="headCurrencyFn" @getExchange="setExchange"></Head>
		<Mbanner :bannerPhotos="detail.bannerPhotos" :destination="destination"></Mbanner>
		<Mdetails
			:remark="remark" 
			:notice="notice" 
			:inclusions="inclusions" 
			:exclusions="exclusions" 
			:introduction="introduction" 
			:isShowBookNow="isShowBookNow" 
			:isscroll="isscroll" 
			:picInfo="picInfo" 
			:id="id" 
			:detail="detail" 
			:highlights="highlights" 
			:destinations="destinations" 
			:itemsIncluded="itemsIncluded" 
			:recommed="recommed"
			:photoList="photoList"
			:destination="destination" 
			:remarkData="remarkData" 
			:userABtestID="userABtestID" 
			:participants="participants"
			:ABtest="ABtest" 
			:isABtestShow="isABtestShow" 
			@currencyChange="currencyChangeFn" 
			v-model="currency"
			:exchange="exchange" 
			:calendar="calendar"
			></Mdetails>
		<transition name="slideleft">
            <Mmeau v-show="isShowMeau" class="Mmeau" 
						:detail="detail" 
						:notice="notice" 
						:exclusions="exclusions" 
						:picInfo="picInfo" 
						:photoList="photoList" 
						:id="id" 
						:itemsIncluded="itemsIncluded" 
						:introduction="introduction" 
						:remark="remark" 
						:recommed="recommed" 
						:remarkData="remarkData" 
						:userABtestID="userABtestID" 
						:ABtest="ABtest" 
						:highlights="highlights"
						></Mmeau>
        </transition>
      	<div class="marsk" v-if="isscroll" @click.stop="showMeau">
        	<i class="iconfont">&#xe665;</i>
        </div>
				
				<foot></foot>
	</div>
</template>

<script>
	if (process.browser) {
	  //require('~/assets/js/pages/talk.js')
	}
	
	//element-ui 组件
	//require('~/plugins/element-ui.js');

	import Vue from 'vue';
	import Head from '~/components/header/index'
	import Mbanner from "~/components/activity/details/Mbanner";
	import Mdetails from "~/components/activity/details/Mdetails";
	import Mmeau from '~/components/activity/details/m-meau'
	import foot from "~/components/footer/index"
	
	import { delNullArr,getUrlParams } from "~/assets/js/utils";

	

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


			//callback(null, { title: res.data.title });

			var consoleTimeS = new Date().getTime();
			console.log('node start time:'+consoleTimeS);

			let id = route.params.id;
			// 服务端渲染部分 这部分操作还没有页面实例，只是初始化页面数据
			let data = {
				detail: {}, //详情数据
				highlights: [], //highlights字符串转成数组
				destinations: "", //目的地
				itemsIncluded: [], //itemsIncluded转成数组
				logIn: "",
				id: id,
				isShowMeau: false,
				isShowBookNow: false,
				isscroll: false,
				introduction: "",
				remark: [],
				destination: "",
				toast: "This activity was booked by another guest an hour ago",
				toastShow: false,
				inclusions:[],
				exclusions:[],
				notice:[],
				photoList:[],
				recommed:[],
				remarkData:[],
				userABtestID:'',
				ABtest: false,
				isABtestShow:false,
				currency:{code: "USD", symbol: "$", exchangeRate: 1},
				participants:0,
				exchange:[],
				calendar:[]
			};
			var response = {};
			let apiActivityPriceRes = {};
			let apiActivityRecommendRes = {};
			let photoList={};

			if(userCookie.currency){
				data.currency = JSON.parse(decodeURIComponent(userCookie.currency));
				
			}
			if(userCookie.participants){
				data.participants=JSON.parse(decodeURIComponent(userCookie.participants))
			}

			//ABtest 点评
			// if(id == '11280' || id =='11068'){
			// 	data.ABtest = true;
			// }
			
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

				

				//游客图片
				var Promise2 = new Promise(function(resolve, reject){
					resolve({});
//					Vue.axios.get(apiBasePath+"public/photo/"+id+"/ACTIVITY_TRAVELER/list").then(function(res) {
//						// var consoleTimeS2 = new Date().getTime();
//						// 	console.log('游客图片接口花费时间：'+(consoleTimeS2-consoleTimeS)+' ms');
//						
//					}, function(res) {
//						resolve(res);
//					});
				});

				//推荐信息
				var Promise3 = new Promise(function(resolve, reject){
					Vue.axios.get(apiBasePath + "product/activity/"+id+"/recommend?currency="+data.currency.code).then(function(res) {
						// var consoleTimeS2 = new Date().getTime();
						// 	console.log('推荐接口花费时间：'+(consoleTimeS2-consoleTimeS)+' ms');
						resolve(res);
					}, function(res) {
						resolve(res);
					});
				});

				//价格信息
				var Promise4 = new Promise(function(resolve, reject){
					Vue.axios.get(apiBasePath + "product/activity/"+id+"/price?currency="+data.currency.code).then(function(res) {
						// var consoleTimeS2 = new Date().getTime();
						// 	console.log('价格接口花费时间：'+(consoleTimeS2-consoleTimeS)+' ms');
						resolve(res);
					}, function(res) {
						resolve(res);
					});
				});

				//价格明细
				var Promise7 = new Promise(function(resolve, reject){
					Vue.axios.get(apiBasePath + "product/activity/"+id+"/price/detail?currency="+data.currency.code).then(function(res) {
						// var consoleTimeS2 = new Date().getTime();
						// 	console.log('价格接口花费时间：'+(consoleTimeS2-consoleTimeS)+' ms');
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
							// var consoleTimeS2 = new Date().getTime();
							// console.log('点评接口花费时间：'+(consoleTimeS2-consoleTimeS)+' ms');
						resolve(res);
					}, function(res) {
						resolve(res);
					});
				});

				//banner
				var Promise6 = new Promise(function(resolve, reject){
					Vue.axios.get(apiBasePath+"public/photo/"+id+"/ACTIVITY_BANNER/list").then(function(res) {
						// var consoleTimeS2 = new Date().getTime();
						// 	console.log('游客图片接口花费时间：'+(consoleTimeS2-consoleTimeS)+' ms');
						resolve(res);
					}, function(res) {
						resolve(res);
					});
				});

				//行程
				var Promise8 = new Promise(function(resolve, reject){
					Vue.axios.get(apiBasePath+"product/activity/"+id+"/itinerary/list").then(function(res) {
						// var consoleTimeS2 = new Date().getTime();
						// 	console.log('游客图片接口花费时间：'+(consoleTimeS2-consoleTimeS)+' ms');
						resolve(res);
					}, function(res) {
						resolve(res);
					});
				});

				//包含
				var Promise9 = new Promise(function(resolve, reject){
					Vue.axios.get(apiBasePath+"product/activity/"+id+"/content/ITEMS_INCLUDED/list").then(function(res) {
						resolve(res);
					}, function(res) {
						resolve(res);
					});
				});

				//不包含
				var Promise10 = new Promise(function(resolve, reject){
					Vue.axios.get(apiBasePath+"product/activity/"+id+"/content/ITEMS_EXCLUDED/list").then(function(res) {
						resolve(res);
					}, function(res) {
						resolve(res);
					});
				});

				//注意事项
				var Promise11 = new Promise(function(resolve, reject){
					Vue.axios.get(apiBasePath+"product/activity/"+id+"/content/NOTICE/list").then(function(res) {
						resolve(res);
					}, function(res) {
						resolve(res);
					});
				});

				//导游信息
				var Promise12 = new Promise(function(resolve, reject){
					Vue.axios.get(apiBasePath+"product/ACTIVITY/"+id+"/guide/info/list").then(function(res) {
						resolve(res);
					}, function(res) {
						resolve(res);
					});
				});

				
				Promise.all([Promise1,Promise2,Promise3,Promise4,Promise5,Promise6,Promise7,Promise8,Promise9,Promise10,Promise11,Promise12]).then(function(results){

					//基本信息
					response = results[0];
					var detailData = response.data;
					
					if(detailData.valid || route.query.valid==1) {//.valid == 1
						
						detailData.highlights ?
							(data.highlights = delNullArr(detailData.highlights.split("\n"))) :
							"";
							
						detailData.itemsIncluded ?
							(data.itemsIncluded = delNullArr(
								detailData.itemsIncluded.split("\n")
							)) :
							"";
						data.destinations = detailData.destinations.join(", ");
						detailData.introduction ?
							(data.introduction = delNullArr(
								detailData.introduction.split("\n")
							)) :
							"";
						detailData.remark ?
							(data.remark = delNullArr(detailData.remark.split("\n"))) :
							"";
						data.destination = detailData.destinations[0];
						
						data.inclusions = results[8].data || [];
						data.exclusions = results[9].data || [];
						data.notice = results[10].data || [];
						//detailData.notice ? (data.notice=delNullArr(results[10].data.split("\n"))) : '';

						if(detailData.latestBooking < 1) {
							data.toast =
								"This activity was booked by another guest in the past hour.";
						} else if(detailData.latestBooking == 1) {
							data.toast = "This activity was booked by another guest an hour ago.";
						} else {
							data.toast =
								"This activity was booked by another guest " +
								detailData.latestBooking +
								" hours ago.";
						}


						data.detail = detailData;

						//banner图
						data.detail.bannerPhotos = results[5].data || [];
						//行程信息
						data.detail.itineraries = results[7].data || [];

						//导游信息
						data.detail.guide = results[11].data;

					} else {
						//同步回调
						callback(null,error({
							statusCode: 404,
							message: "404"
						}));
					};

					//游客照片
//					photoList = results[1];
//					data.photoList=photoList.data;

					//推荐信息
					apiActivityRecommendRes = results[2];
					data.recommed = apiActivityRecommendRes.data;

					//价格信息
					apiActivityPriceRes = results[3];
					data.picInfo = apiActivityPriceRes.data;
					data.picInfo.departureTime ? (data.time = data.picInfo.departureTime[0]) : (data.time = "");
					data.picInfo.details = results[6].data;

					//点评信息
					var remarkData = results[4];
					if(remarkData.data){
						data.remarkData = remarkData.data;
					}


					var consoleTimeS2 = new Date().getTime();
					console.log('node end time:'+consoleTimeS2);
					console.log('在node端渲染，请求所有接口花费时间：'+(consoleTimeS2-consoleTimeS)+' ms');

					//同步回调
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
			Mbanner,
			Mdetails,
			Mmeau,
			Head,
			foot
		},
		methods: {
			showMeau(){
				this.isShowMeau=true
			},
			scorllBar() {
				let data = this;
				
				

				if(window.scrollY > 100) {
					
					
					data.isscroll = true;
				} else {
					
					data.isscroll = false;
				}
			},
			currencyChangeFn(data){
				this.recommed = data;
			},
			headCurrencyFn(currency){
				this.currency = currency;
			},
			setExchange(val){
				this.exchange=val
				
			},
		},
		mounted: function() {
			
			let self = this;
			self.id!='undefined'?self.id:getUrlParams()
			this.logIn = window.localStorage.getItem("logstate");
			document.getElementById('Mmenu').addEventListener("click", function(){self.isShowMeau=false});
			window.addEventListener("scroll", this.scorllBar);
			//  if(window.name != "bencalie"){
			// 	location.reload();
			// 	window.name = "bencalie";
			// }else{
			// 	window.name = "";
			// }
			var cookieCurrency = JSON.parse(Cookie.get('currency'));
			var ua = window.navigator.userAgent.toLowerCase();
			var isWx = (ua.match(/MicroMessenger/i) == 'micromessenger') ? true : false;
			var currency= cookieCurrency ? cookieCurrency : (isWx ? {'code':'CNY','symbol':'¥'} : {'code':'USD','symbol':'$'});

			if(this.currency!=currency){
				this.currency=currency
			}
			console.log(this.$data);

			//等待渲染完毕后调用
			setTimeout(function(){
				new Swiper('#swiper_bannerbox', {
					autoplay: {
						delay: 3000,
						disableOnInteraction: false
					},
					loop: true,
					lazy: true,
					// 如果需要分页器
					pagination: {
						el: '#swiper_banner_pagination'
					}
				});
			},1000);


			var galoadTimer = null;
			// setTimeout(function(){
			// 	//获取ABtestID
			// 	var userABtestID = Cookie.get('userABtestID');
			// 	self.userABtestID = userABtestID?userABtestID:'';
			// 	//GA统计
			// 	self.isABtestShow = self.remarkData.entities && self.remarkData.entities.length && self.ABtest && self.userABtestID%2==0;
			// 	if(self.isABtestShow){

			// 		galoadTimer = setInterval(function(){
			// 			if(window.ga){
			// 				window.clearInterval(galoadTimer);
			// 				ga(gaSend, {
			// 					hitType: 'event',
			// 					eventCategory: 'activity_detail',
			// 					eventAction: 'abtest_comment',
			// 					eventLabel: 'load',
			// 				});
			// 			}
			// 		},500);
					
			// 		//console.log('ABtest产品，加载到了点评！');
			// 	}
			// },100);


		},
		watch: {
			isShowMeau:function(val,oldVal){
				if(val){
					document.getElementsByTagName("body")[0].style.overflow="hidden";
				}else{
					document.getElementsByTagName("body")[0].style.overflow="visible";
				}
			}
		}
	};
</script>
<style lang="scss">
	#launcher{
		bottom: 2.133333rem!important;
	}

	#activitiesDetail{
		.header{
			.selectCurrey_box{ display: none!important;}
		}
	}
	
</style>
<style lang="scss" scoped>
	

	.icon {
		width: 36px;
		height: 36px;
		vertical-align: -0.15em;
		fill: currentColor;
		overflow: hidden;
	}
	
	#activitiesDetail {
		overflow-x: hidden;
		.bannerImg {
			height: 552px;
			img {
				width: 100%;
				height: 100%;
			}
			.pic {
				position: relative;
				width: 1170px;
				margin: 0 auto;
				.view {
					position: absolute;
					width: 100px;
					height: 36px;
					line-height: 36px;
					text-align: center;
					background: #fff;
					box-shadow: 0px 2px 6px 0px rgba(0, 0, 0, 0.1);
					border-radius: 3px;
					bottom: 20px;
				}
			}
		}
		.toast-container {
			position: fixed;
			bottom: 12px;
			left: 12px;
			animation: fa 8s ease-in-out forwards;
			padding: 10px 20px;
			transform: translateY(100%);
			width: 260px;
			background: #565e66;
			.toast-text {
				float: right;
				font-size: 16px;
				color: #fff;
				width: 200px;
			}
			@keyframes fa {
				0% {
					transform: translateY(100%);
				}
				10% {
					transform: translateY(0);
				}
				20% {
					transform: translateY(0);
					opacity: 1;
				}
				50% {
					transform: translateY(0);
					opacity: 1;
				}
				70% {
					transform: translateY(0);
					opacity: 1;
				}
				100% {
					transform: translateY(0);
					opacity: 0;
				}
			}
		}
		 .slideleft-enter-active,
		    .slideleft-leave-active {
		        transition: all .8s;
		    }
		    
		    .slideleft-enter,
		    .slideleft-leave-to {
		        opacity: 0;
		    }
		    
		    .Mmeau {
		       
		    }
		.marsk{
			position: fixed;
			bottom: 2rem;
			right: 0.293333rem;
			width:1rem;
			height: 1rem;
			line-height: 1rem;
			text-align: center;
			border-radius: 50%;
			box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.2);
			background: #fff;
			z-index: 66;
			color: #1bbc9d;
			.iconfont{
				font-size: 0.48rem;
				line-height: 1rem;
				vertical-align: top;
			}
			}
	}
</style>