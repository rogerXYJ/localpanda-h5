<template>
	<div id="activitiesDetail">
		<Head :nowCurrency="currency" @headCurrency="headCurrencyFn"></Head>
		
		<div class="crumbs">
			<a href="#">Home</a> <i class="iconfont">&#xe64a;</i>
			<a href="#">Beijing Activities</a>
		</div>

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
		
		<foot></foot>
	</div>
</template>

<script>

	import Vue from 'vue';
	import Head from '~/components/header/index'
	import foot from "~/components/footer/index"

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
				calendar:[]
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
						data.detail.itineraries = results[6].data || [];

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
			foot
		},
		methods: {
			headCurrencyFn(){
				
			}
		},
		mounted: function() {
			

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
			console.log(this.$data);

			//等待渲染完毕后调用
			this.$nextTick(function(){
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
			});

		},
		watch: {
			
		}
	};
</script>

<style lang="scss" scoped>
	#activitiesDetail{
		.crumbs{
			font-size: 0.22rem;
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
	}
</style>
<style lang="scss">

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
		
	}
	
</style>