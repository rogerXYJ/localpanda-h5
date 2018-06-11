<template>
	<div class="linkfoot">
		<div class="tour">
			<h3>Signature Destinations</h3>
			<h4>Browse a list of trips to embark your next adventure</h4>
			<ul class="clearfix">
				<li v-for="(item,index) in tourList" :key="index" :style="{backgroundImage: 'url(' + item.imgUrl + ')'}">
					<a :href="item.linkUrl">
						<div class="mask"></div>
						<div class="content">
							<p>{{item.name}}</p>
							<p class="text" v-if="item.nameText">{{item.nameText}}</p>
						</div>
					</a>
				</li>
			</ul>
		</div>
		<div class="customizeBtn">
			<h4>Can’t find your ideal trip? Don’t worry!</h4>
			<button class="btn"><a href="/travel/customize/step1">Let’s Customize Your Trip</a></button>
		</div>
	</div>
</template>

<script>
export default {
    name: 'linkfoot',
    data () {
        return {
			tourList:[
				{
					name:"Shangri-la",
					imgUrl:'https://resource.localpanda.cn/content/landingpage/experts/Shangrila.jpg',
					linkUrl:'/travel/expats/details/shangrila'
				},
				{
					name:"Tibet",
					imgUrl:'https://resource.localpanda.cn/content/landingpage/experts/Tibet.jpg',
					linkUrl:'/travel/expats/details/tibet'
				},
				{
					name:"Zhangjiajie",
					imgUrl:'https://resource.localpanda.cn/content/landingpage/experts/Zhangjiajie.jpg',
					linkUrl:'/travel/expats/details/zhangjiajie'
				},
				{
					name:"Xinjiang",
					imgUrl:'https://resource.localpanda.cn/content/landingpage/experts/Xinjiang.jpg',
					linkUrl:'/travel/expats/details/xinjiang'
				},
				{
					name:"Silk Road",
					imgUrl:'https://resource.localpanda.cn/content/landingpage/experts/SilkRoad.jpg',
					linkUrl:'/travel/expats/details/silk_road'
				},
				{
					name:"Yellow Mountain",
					imgUrl:'https://resource.localpanda.cn/content/landingpage/experts/YellowMountain.jpg',
					linkUrl:'/travel/expats/details/yellow_mountain'
				},
				{
					name:"Inner Mongolia",
					imgUrl:'https://resource.localpanda.cn/content/landingpage/experts/InnerMongolia.jpg',
					linkUrl:'/travel/expats/details/inner_mongolia'
				},
				{
					name:"Seasonal Deal",
					nameText:'Members Only',
					imgUrl:'https://resource.localpanda.cn/content/landingpage/experts/SeasonalDeal.jpg',
					linkUrl:'/travel/expats/details/excursions'
				}
			
			
			
			
			]
        }
    },
    methods: {
       
    },
    components:{
    	 
    },
    mounted: function() {
	
    }
  }
</script>

<style lang="scss" scoped>
	.tour {
		margin-top: 0.6rem;
		padding: 0 0.3rem;
		h3 {
			font-size: 0.44rem;
			font-weight: bold;
		}
		h4 {
			font-size: 0.24rem;
			margin-top: 0.1rem;
		}
		ul {
			margin-top: 0.1rem;
			li {
				background-repeat: no-repeat;
				background-size: cover;
				background-position: center;
				float: left;
				margin-top: 0.3rem;
				margin-right: 0.3rem;
				float:left;
				width:48%;
				margin-right: 4%;
				height: 1.76rem;
				position: relative;
				border-radius: 0.06rem;
				.content {
					width: 100%;
					position: absolute;
					left: 50%;
					top: 50%;
					transform: translate(-50%, -50%);
				}
				p {
					position: relative;
					z-index: 2;
					font-size: 0.3rem;
					color: #fff;
					font-weight: bold;
					text-shadow: 0 0.05rem 0.1rem rgba(0, 0, 0, 0.3);
					text-align: center;
				}
				.text {
					font-size: 0.22rem!important;
					font-weight: normal!important;
				}
				&:nth-child(2n+0) {
					margin-right: 0;
				}
			}
		}
	}
	
	.customizeBtn {
		margin: 0.6rem 0.3rem;
		background: #fff;
		box-shadow: 0px 0.08rem 0.5rem 0px rgba(0, 0, 0, 0.06);
		border-radius: 0.1rem;
		padding: 0.48rem 0.3rem;
		h4 {
			text-align: center;
			font-size: 0.28rem;
		}
		.btn {
			margin-top: 0.3rem;
			font-size: 0.32rem;
			font-weight: bold;
			a{
				color: #fff;
				display: block;
			}
		}
	}
	
	.mask {
		position: absolute;
		left: 0;
		top: 0;
		min-width: 100%;
		min-height: 100%;
		background: rgba(0, 0, 0, .4);
		border-radius: 0.06rem;
	}
</style>