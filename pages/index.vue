
<style lang="scss" scoped>
.home{
	padding-top: 1.01rem;
	.search_banner{
		width: 100%;
		height: 5rem;
		background: url('https://resource.localpanda.cn/homepage/search_bg.jpg') no-repeat center center;
		background-size: cover;
		position: relative;
		padding-top: 0.8rem;
		&:before{
			content:'';
			font-size: 0;
			height: 0;
			display: block;
			overflow: hidden;
		}
		h1{
			text-align: center;
			color: #fff;
			font-size: 0.56rem;
			line-height: 0.58rem;
			
			font-weight: bold;
			text-shadow: 0 0 4px rgba(0, 0, 0, 0.5);
		}
		p{
			margin-top: 0.25rem;
			text-align: center;
			color: #fff;
			font-size: 0.26rem;
			line-height: 0.34rem;
			text-shadow: 0 0 4px rgba(0, 0, 0, 0.7);
		}
		.home_search{
			height: 0.88rem;
			line-height: 0.88rem;
			background-color: #ffffff;
			box-shadow: 0px 5px 10px 0px rgba(0, 0, 0, 0.1);
			border-radius: 0.08rem;
			position: relative;
			margin:0.5rem 0.36rem 0;
			input{
				padding: 0 0.26rem;
				width: 100%;
				line-height: 0.88rem;
				background: none;
				border: none;
				font-size: 0.26rem;
				color: #353a3f;
				&::-webkit-input-placeholder {color: #a9abab;}
			}
			.input_bg{
				width: 100%;
				height: 100%;
				position: absolute;
				left: 0;
				top: 0;
				z-index: 2;
			}
		}
	}

	h3{
		font-size: 0.4rem;
		font-weight: bold;
		margin-top: 0.65rem;
		margin-bottom: 0.4rem;
		padding:0 0.3rem;
	}
	.highlights{
		margin:0.14rem 0.3rem 0;
		position: relative;
		a{
			display: block;
			.highlights_info{
				text-align: center;
				color: #fff;
				position: absolute; left: 0; top: 50%; width: 100%; transform: translateY(-50%);
				h4{
					font-size: 0.4rem;
					line-height: 0.48rem;
					text-shadow: 0 0 4px rgba(0, 0, 0, 0.7);
					padding: 0 0.4rem;
				}
				p{
					font-size: 0.25rem; line-height: 0.3rem; margin-top: 0.36rem; padding: 0 0.4rem;
					text-shadow: 0 0 4px rgba(0, 0, 0, 0.7);
				}
			}
		}
	}

	.brand_info{
		padding: 0 0.3rem;
		margin-top: 0.75rem;
		dl{
			padding-left: 0.68rem;
			margin-top: 0.26rem;
			dt{
				font-size: 0.34rem; font-weight: bold; line-height: 0.5rem;
				i{
					float: left; margin-left: -0.68rem; width: 0.5rem; height: 0.5rem; text-align: center; line-height: 0.5rem; background-color: #f5f7f7; border-radius: 50%; font-size: 0.3rem; 
					color: transparent;
        	-webkit-background-clip: text;
					background-image: -webkit-gradient(linear, right top, left top, from(#009efd), to(#1bbc9d));
    			background-image: linear-gradient(270deg, #009efd 0%, #1bbc9d 100%);
				}
			}
			dd{ font-size: 0.24rem; line-height: 0.34rem; margin-top: 0.1rem;}
		}
	}

	.specialties{
		margin: -0.14rem 0.3rem 0;
		overflow: hidden;
		.specialties_left,.specialties_right{
			float: left; width: calc(50% - 0.08rem);
		}
		.specialties_right{ margin-left: 0.14rem;}
		.specialties_img{
			display: block;
			position: relative;
			margin-top: 0.14rem;
			strong{
				position: absolute; left: 0; top: 50%; width: 100%; display: block; transform: translateY(-50%); text-align: center; color: #fff; font-size: 0.3rem;
				text-shadow: 0 0 4px rgba(0, 0, 0, 0.7);
			}
		}
	}

	.customize{
		margin: 0.8rem 0.3rem 0;
		position: relative;
		.customize_info{
			position: absolute;
			left: 0;
			top: 50%;
			width: 100%;
			transform: translateY(-50%);
			text-align: center;
			color: #fff;	
			h4{
				font-size: 0.4rem;
				font-weight: bold;
				text-shadow: 0 0 4px rgba(0, 0, 0, 0.7);
			}
			p{
				font-size: 0.25rem;
				line-height: 0.3rem;
				margin-top: 0.2rem;
				text-shadow: 0 0 4px rgba(0, 0, 0, 0.7);
			}
			a{
				display: inline-block;
				border-radius: 4px;
				width: 2.92rem;
				height: 0.7rem;
				line-height: 0.7rem;
				text-align: center;
				background-color: #fe483e;
				font-size: 0.24rem;
				font-weight: bold;
				margin-top: 0.4rem;
				color: #fff;
			}
		}
	}

	.guests{
		margin-top: 0.8rem;
		background-color: #faf9f8;
		padding: 0.3rem 0;
		h4{
			color: #878e95;
			text-align: center;
			font-size: 0.28rem
		}
		.swiper-container{
			padding-bottom: 0.4rem;
			.swiper-slide{
				padding: 0 0.3rem;
				img{
					display: block;
					margin: 0.4rem auto 0;
					border-radius: 50%;
					box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
				}
				b{ display: block; margin-top: 0.2rem; text-align: center; font-size: 0.34rem; line-height: 0.28rem;}
				p{ margin-top: 0.15rem; text-align: center; font-size: 0.24rem;}
			}
			.swiper-pagination{
				bottom: 0;
			}
			
		}
	}
	

	.inquire{
		position: fixed;
		right: 0.2rem;
		bottom: 0.3rem;
		z-index: 6;
		background-color: #1bbc9d;
		display: inline-block;
		width: auto;
		height: 0.86rem;
		line-height: 0.81rem;
		border-radius: 0.43rem;
		font-size: 0.28rem;
		font-weight: bold;
		padding: 0 0.45rem;
		&:focus,&:hover{
			color: #fff;
		}
	}
}
</style>
<style lang="scss">
.guests{
	.swiper-pagination{
		bottom: 0;
		.swiper-pagination-bullet{
			background-color: #aaa;
		}
		.swiper-pagination-bullet-active{
			background-color: #999;
		}
	}
}
.home{
	.header{
		top:0;
		position: fixed !important;
		width: 100%;
	}
}
</style>


<template>
	<div class="home">
		<Head :showSearch="showHeaderSearch" @closeSearch="showHeaderSearch=false" @searchChange="searchChange"></Head>

		<div class="search_banner">
			<h1>Unlock Local <br> Access to China</h1>
			<p>Explore hundreds of unique,<br>immersive and authentic experiences</p>
			<div class="home_search">
				<input type="text" v-model="keyword" placeholder="Search attractions, activities or destinations">
				<div class="input_bg" @click="showHeaderSearch=true"></div>
			</div>
		</div>


		<!-- 活动亮点 -->
		<h3>Latest Highlights</h3>
		<div class="highlights">
			<a href="https://www.localpanda.com/activity/list/Tibet">
				<img src="https://resource.localpanda.cn/homepage/tibet.jpg" width="100%" alt="">
				<div class="highlights_info">
					<h4>Experience the Majesty of Tibet</h4>
					<p>Rub shoulders with pilgrims and monks, marvel at the cosmos from Mount Everest Base Camp, wander pastoral landscapes dotted with yaks.</p>
				</div>
			</a>
		</div>
		<div class="highlights">
			<a href="https://www.localpanda.com/activity/list/Bund">
				<img src="https://resource.localpanda.cn/homepage/bund.jpg" width="100%" alt="">
				<div class="highlights_info">
					<h4>The Bund - Where Future Meets Past</h4>
					<p>Walk along the Huangpu river and enjoy views of the world’s most futuristic skylines from atop the banking houses of colonial-era Shanghai.</p>
				</div>
			</a>
		</div>

		<!-- 品宣部分 -->
		<div class="brand_info">
			<dl>
				<dt><i class="iconfont">&#xe677;</i>Bridging East and West</dt>
				<dd>Our multicultural team understands what China has to offer and what you as a traveler are looking for</dd>
			</dl>
			<dl>
				<dt><i class="iconfont">&#xe678;</i>Exceptional Trips</dt>
				<dd>We hand-pick our offerings to ensure excellence in quality and competitive pricing</dd>
			</dl>
			<dl>
				<dt><i class="iconfont">&#xe651;</i>Personalized Experiences</dt>
				<dd>We work closely with you to craft and deliver experiences that fit your personality, interests, and travel style</dd>
			</dl>
		</div>

		<!-- Our Specialties -->
		<h3>Our Specialties</h3>
		<div class="specialties">
			<div class="specialties_left">
				<a class="specialties_img" href="https://m.localpanda.com/activity/list/Great%20Wall">
					<img src="https://resource.localpanda.cn/homepage/greatwall.jpg" width="100%" alt="">
					<strong>The Great Wall</strong>
				</a>
				<a class="specialties_img" href="https://m.localpanda.com/activity/list/Food">
					<img src="https://resource.localpanda.cn/homepage/experiences.jpg" width="100%" alt="">
					<strong>Foodie Experiences</strong>
				</a>
				<a class="specialties_img" href="https://m.localpanda.com/activity/list/Forbidden%20City">
					<img src="https://resource.localpanda.cn/homepage/forbiddencity.jpg" width="100%" alt="">
					<strong>Forbidden City</strong>
				</a>
				<a class="specialties_img" href="https://m.localpanda.com/travel/expats">
					<img src="https://resource.localpanda.cn/homepage/expatadventures.jpg" width="100%" alt="">
					<strong>Expat Adventures</strong>
				</a>
			</div>
			<div class="specialties_right">
				<a class="specialties_img" href="https://m.localpanda.com/activity/list/Panda">
					<img src="https://resource.localpanda.cn/homepage/giantpandas.jpg" width="100%" alt="">
					<strong>Giant Pandas</strong>
				</a>
				<a class="specialties_img" href="https://m.localpanda.com/activity/list/Watertown">
					<img src="https://resource.localpanda.cn/homepage/watertowns.jpg" width="100%" alt="">
					<strong>Water Towns</strong>
				</a>
				<a class="specialties_img" href="https://m.localpanda.com/activity/list/Terra-Cotta%20Warriors">
					<img src="https://resource.localpanda.cn/homepage/terracottawarriors.jpg" width="100%" alt="">
					<strong>Terracotta Warriors</strong>
				</a>
				<a class="specialties_img" href="https://m.localpanda.com/activity/list/Landmarks">
					<img src="https://resource.localpanda.cn/homepage/landmarks.jpg" width="100%" alt="">
					<strong>Landmarks</strong>
				</a>
			</div>
		</div>

		<div class="customize">
			<img src="https://resource.localpanda.cn/homepage/custom.jpg" width="100%" alt="">
			<div class="customize_info">
				<h4>BY YOU / FOR YOU</h4>
				<p>Choose your cities, match your dates, <br>design your bespoke journey</p>
				<a class="btn_customize" href="/travel/customize/step1">Build Your Adventure</a>
			</div>
		</div>


		<div class="guests">
			<h4>What our guests are saying</h4>
			<div class="swiper-container" id="swiper_guests">
				<div class="swiper-wrapper">
					<div class="swiper-slide">
						<img src="https://resource.localpanda.cn/static/content/reviews/Claudia.jpg" width="34%" alt="">
						<b>Claudia Flores</b>
						<p>Local Panda had an incredible amount of attention and patience throughout my trip. I had a great tour that went way beyond my expectations. The sites and smells of everywhere we visited around Shanghai were fantastic as well. My guide, Jamie, was nice, intelligent, great English, everything you want in a tour guide. Thanks again!</p>
					</div>		
					<div class="swiper-slide">
						<img src="https://resource.localpanda.cn/static/content/reviews/Selvarani.jpg" width="34%" alt="">
						<b>Selvarani Saravanamuthu</b>
						<p>I have to say a huge thank you to Local Panda for putting together this memorable trip. The tours have been par excellence, and I can't be happy enough about it. Local Panda have provided us with a wonderful and memorable experience we will cherish forever. I will not hesitate to recommend Local Panda to my friends when they plan their trip to China.</p>
					</div>		
					<div class="swiper-slide">
						<img src="https://resource.localpanda.cn/static/content/reviews/Cynthia.jpg" width="34%" alt="">
						<b>Cynthia Huang</b>
						<p>Local Panda Exceeded our expectations in every way. Our guide Rebecca was a Hangzhou native whose local knowledge of the city was beyond anything we could have hoped for. The personalized service sets Local Panda apart. If you want to see something, or do something off of the beaten path, they will go above and beyond to accommodate you."</p>
					</div>					
				</div>
				<div class="swiper-pagination" id="swiper_guests_pagination"></div>
			</div>
		</div>
		
		<Foot></Foot>


		<a href="/info/feedback/" class="btn inquire">Inquire</a>
		
	</div>
</template>
<script>

	import Head from '~/components/header/'
	import Foot from "~/components/footer/"

	import Vue from "vue";

	if(process.browser) {
		require('~/assets/js/plugin/swiper.js');
	}
	
	export default {
		name: 'activityList',
		components: {
			Head,
			Foot
		},
		async asyncData({
			route,
			apiBasePath
		}) {

			var params = route.params;
			
			var postData = {
				
			};

			//console.log(postData);

			var getData = '';

			try{
				// listdata = await Vue.axios.post(apiBasePath + "search/activity", JSON.stringify(postData), {
				// 	headers: {
				// 		'Content-Type': 'application/json'
				// 	}
				// })
			}catch(err){};

			//列表页数据
			var homeData = getData.data?getData.data:'';


			return {
				homeData:homeData,
				showHeaderSearch: false,

				keyword:''
			}
		},
		computed:{
			
		},
		methods: {
			//头部搜索change回调
			searchChange(value){
				this.keyword = value;
			},
			
		},
		watch: {
			
		},
		mounted: function() {
			var self = this;


			
			new Swiper('#swiper_guests', {
				lazy: true,
				pagination: {
					el: '#swiper_guests_pagination'
				}
			});

			
			
		},
		head() {
			return {
				title: 'Local Panda | The China Travel Experts.',
				meta: [{
						hid: "keywords",
						name: "keywords",
						content: 'Local Panda, China, China travel, China tour, China travel company, China travel guide, China tour package'
					},
					{
						hid: "description",
						name: "description",
						content: 'China specialized travel platform, handpicked local guides, book private and personalized tours, trip planning assistance, hundreds of things to do and see in China, sightseeing day activities, car service and transportation'
					}
				]
			};
		},
	}
</script>

