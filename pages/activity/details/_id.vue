<template>
	<div id="activitiesDetail">
		<Head></Head>
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
			></Mdetails>
		<transition name="slideleft">
            <Mmeau v-show="isShowMeau" class="Mmeau" :notice="notice" :exclusions="exclusions" :picInfo="picInfo" :photoList="photoList" :id="id"></Mmeau>
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
			redirect
		}) {

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
				photoList:[]
				
				
			};
			let response = {};
			let apiActivityPriceRes = {};
			let apiActivityRecommendRes = {};
			let photoList={};
			try {
				response = await Vue.axios.get(apiBasePath + "activity/basic/" + id);
				if(response.data.valid == 1) {
					data.detail = response.data;
					response.data.highlights ?
						(data.highlights = delNullArr(response.data.highlights.split("\n"))) :
						"";
					response.data.itemsIncluded ?
						(data.itemsIncluded = delNullArr(
							response.data.itemsIncluded.split("\n")
						)) :
						"";
					data.destinations = response.data.destinations.join(", ");
					response.data.introduction ?
						(data.introduction = delNullArr(
							response.data.introduction.split("\n")
						)) :
						"";
					response.data.remark ?
						(data.remark = delNullArr(response.data.remark.split("\n"))) :
						"";
					data.destination = response.data.destinations[0];
					response.data.inclusions?data.inclusions=response.data.inclusions:data.inclusions=""
					response.data.exclusions?data.exclusions=response.data.exclusions:data.exclusions="";
					response.data.notice&&response.data.notice!=""?(data.notice=delNullArr(
						response.data.notice.split("\n")
					)):'';

					if(response.data.latestBooking < 1) {
						data.toast =
							"This activity was booked by another guest in the past hour.";
					} else if(response.data.latestBooking == 1) {
						data.toast = "This activity was booked by another guest an hour ago.";
					} else {
						data.toast =
							"This activity was booked by another guest " +
							response.data.latestBooking +
							" hours ago.";
					}
				} else {
					return error({
						statusCode: 500,
						message: "500"
					});
				}
				
				//游客图片
				let photoParams={
					"objectId": id,
					"objectType": "ACTIVITY_TRAVELER"
				}
				photoList=await Vue.axios.post(
					apiBasePath+"activity/traveler/photo/all",JSON.stringify(photoParams),{
						headers: {
						'Content-Type': 'application/json; charset=UTF-8'
						}
					}
				);
				data.photoList=photoList.data
				
				apiActivityRecommendRes = await Vue.axios.get(
					apiBasePath + "activity/recommend/" + id
				);
				data.recommed = apiActivityRecommendRes.data;

				apiActivityPriceRes = await Vue.axios.get(
					apiBasePath + "activity/price/" + id
				);
				// if (apiActivityPriceRes.data.available == 1) {
				data.picInfo = apiActivityPriceRes.data;
				data.picInfo.departureTime ?
					(data.time = data.picInfo.departureTime[0]) :
					(data.time = "");
				
				// } else {
				// return redirect("/");
				// }
			} catch(err) {
				console.log(err);
				return error({
					statusCode: 500,
					message: JSON.stringify(err)
				});
			}

			var consoleTimeS2 = new Date().getTime();
			console.log('node end time:'+consoleTimeS2);
			console.log('在node端渲染，请求接口花费时间：'+(consoleTimeS2-consoleTimeS)+' ms');
			
			return data;
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

				],
				script: [
					{
						src:'https://resource.localpanda.cn/static/js/swiper-4.2.6.min.js',
						type: 'text/javascript'
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
			}
		},
		mounted: function() {
			
			let data = this;
			data.id!='undefined'?data.id:getUrlParams()
			this.logIn = window.localStorage.getItem("logstate");
			document.getElementById('Mmenu').addEventListener("click", function(){data.isShowMeau=false});
			window.addEventListener("scroll", this.scorllBar);


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
			top: 50%;
			right: 0.293333rem;
			width:1rem;
			height: 1rem;
			line-height: 1rem;
			text-align: center;
			border-radius: 50%;
			box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.2);
			background: #fff;
			z-index: 200;
			color: #1bbc9d;
			.iconfont{
				font-size: 0.48rem;
				line-height: 1rem;
				vertical-align: top;
			}
			}
	}
</style>