<template>
	<div class="details">

		<Head></Head>
		<div class="headbanner">
			<div class="swiper-container" id="swiper_banner">
				<div class="swiper-button-next"><i class="iconfont">&#xe620;</i></div>
				<div class="swiper-button-prev"><i class="iconfont">&#xe615;</i></div>
				<div class="swiper-wrapper">
					<div class="swiper-slide" :key="index" v-for="(slide, index) in bannerPic" :style="{backgroundImage:'url('+slide.url+')'}">
						<a @click.stop="showPhoto(index)">
							<div class="mask"></div>
							<h3>{{slide.title}}</h3>
							<p>{{slide.content}}</p>
						</a>
					</div>
				</div>
				<div class="swiper-pagination" id="swiper_banner_pagination"></div>
			</div>
		</div>
		<div class="product">
			<div class="title" v-if="products&&products.length>0">
				<h3>Hand-picked Trip Experiences</h3>
				<h4>See the itineraries designed for you</h4>
			</div>
			<div class="empty" v-show="!products">Destination Experiences Are Coming Soon …</div>
			<ul v-if="products&&products.length>0">
				<li v-for="item in products">
					<a :href="'/activity/details/'+item.id">
						<div class="productPic" :style="{backgroundImage:'url('+item.cover+')'}">
							<p>{{item.title}} </p>
						</div>
						<div class="productInfo">
							<div class="clearfix">
								<div class="price">
									<span>Starting from</span>
									<b>¥{{item.bottomPrice}} <i>¥{{item.originalPrice}}</i></b>
									<span>per person</span>
								</div>
								<div class="introduce">
									<em>{{item.category}}</em>
									<div class="discount"><span>{{item.discount}}% Off</span></div>

								</div>
							</div>
							<div class="date" v-if="item.startDate"><b>Starting Date</b>:<span>{{item.startDate}}</span></div>
							<div class="city"><b>Cities</b> :<span v-html="item.destinations"></span></div>
							<div class="tags">
								<span v-for="i in item.tags.split(',')">{{i}}</span>
							</div>
							<p class="description">{{item.description}}</p>
						</div>
					</a>
				</li>
			</ul>
		</div>
		<linkFoot :noUrl="noUrl"></linkFoot>
		<banner :photoList="bannerPic" :alertPicStatus="alertPicStatus" @alert-call-back="setCallBack" :index="index"></banner>
	</div>
</template>

<script>
	import Head from '~/components/header/index'
	import linkFoot from '~/components/travel/expats/linkFoot'
	import banner from '~/components/activity/details/photo'
	export default {
		name: 'expats',
		data() {
			let theme = this.$route.params.theme;
			return {
				theme: theme,
				bannerPic: [],
				products: [],
				alertPicStatus: false,
				index: '',
				tdk:{},
				noUrl:false
				
			}
		},
		head() {
			return {
				title: this.tdk.title,
				meta: [{
						hid: "keywords",
						name: "keywords",
						content: this.tdk.keywords
					},
					{
						hid: "description",
						name: "description",
						content: this.tdk.description
					}
				]
			}
		},
		methods: {
			showPhoto(index){
				let self=this
				
				self.index=index
				self.alertPicStatus = true
				
			},
			//图片轮播状态回调
			setCallBack(val) {
				this.alertPicStatus = val
			},
			getData() {
				let that = this
				//console.log(that.theme)
				that.axios.get("https://api.localpanda.com/api/content/landingpage/expats/" + that.theme).then((res) => {
					that.bannerPic = res.data.photos
					that.products = res.data.products
					if(res.data.products){
						that.noUrl=false
					}else{
						that.noUrl=true
					}
					that.tdk={
						title:res.data.title,
						keywords:res.data.keywords,
						description:res.data.description
					}
					that.$nextTick(function(){
						new Swiper('#swiper_banner', {
						
						//延迟加载 
							lazy: {
								loadPrevNext: true,
								//loadPrevNextAmount: 3,
							},
							//前进后退按钮
							navigation: {
								nextEl: '.swiper-button-next',
								prevEl: '.swiper-button-prev',
							},
							// 如果需要分页器
							pagination: {
								el: '#swiper_banner_pagination',
								type: 'fraction'
		
							}
							
						});
					})  

				}, (res) => {})
			}

		},
	
		components: {
			Head,
			linkFoot,
			banner
		},
		created(){
			
		},
		mounted: function() {
			this.getData()
			let self=this
			setTimeout(function() {
				
			},500);
			
		}
	}
</script>

<style lang="scss">
	.mask {
		position: absolute;
		left: 0;
		top: 0;
		min-width: 100%;
		min-height: 100%;
		background: rgba(0, 0, 0, .1);
	}
	
	.headbanner {
		.swiper-slide {
			height: 4rem;
			background-repeat: no-repeat;
			background-position: center;
			background-size: cover;
			color: #fff;
			a{
				display: block;
				color: #fff;
				h3 {
					text-align: center;
					font-size: 0.44rem;
					font-weight: bold;
					position: relative;
					margin-top: 0.73rem;
					z-index: 2;
					text-shadow: 0 0.05rem 0.1rem rgba(0, 0, 0, 0.3);
				}
				p {
					margin-top: 0.28rem;
					padding: 0 0.69rem;
					text-align: center;
					position: relative;
					z-index: 2;
					font-size: 0.24rem;
					text-shadow: 0 0.05rem 0.1rem rgba(0, 0, 0, 0.3);
					line-height: 0.28rem;
				}	
			}
			
		}
		.swiper-pagination {
			padding: 0 0.15rem;
			width: auto;
			height: 0.48rem;
			text-align: center;
			line-height: 0.48rem;
			padding: 0 0.1rem;
			left: 0.32rem;
			bottom: 0.18rem;
			background: #353a3f;
			border-radius: 0.1rem;
			color: #fff;
			font-size: 0.26rem;
		}
		.swiper-button-next {
			width: 0.64rem;
			height: 0.66rem;
			background: rgba(0, 0, 0, 0.4);
			right: 0;
			text-align: center;
			line-height: 0.66rem;
			color: #fff;
			border-top-left-radius: 0.1rem;
			border-bottom-left-radius: 0.1rem;
			z-index: 99;
		}
		.swiper-button-prev {
			width: 0.64rem;
			height: 0.66rem;
			background: rgba(0, 0, 0, 0.4);
			left: 0;
			text-align: center;
			line-height: 0.66rem;
			color: #fff;
			border-top-right-radius: 0.1rem;
			border-bottom-right-radius: 0.1rem;
			z-index: 99;
		}
	}
	
	.product {
		padding: 0.6rem 0.3rem 0;
		h3 {
			font-size: 0.44rem;
			font-weight: bold;
		}
		h4 {
			font-size: 0.24rem;
			margin-top: 0.1rem;
		}
		.empty{
			font-size: 0.44rem;
			font-weight: bold;
			color: #878e95;
			text-align: center;
		}
		li {
			margin-top: 0.3rem;
			border-radius: 0.1rem;
			box-shadow: 0px 0.08rem 0.5rem 0px rgba(0, 0, 0, 0.06);
			.productPic {
				border-top-left-radius: 0.1rem;
				border-top-right-radius: 0.1rem;
				background: url("https://cloud.localpanda.com/content/landingpage/experts/MembersSeasonalDeal.jpg");
				height: 2.18rem;
				background-repeat: no-repeat;
				background-size: cover;
				background-position: center;
				position: relative;
				p {
					position: absolute;
					bottom: 0.25rem;
					left: 0.25rem;
					font-size: 0.28rem;
					color: #fff;
					text-shadow: 0 0.05rem 0.1rem rgba(0, 0, 0, 0.3);
				}
			}
			.productInfo {
				padding: 0.32rem 0.2rem;
				.price {
					float: left;
					span {
						font-size: 0.22rem;
						display: block;
					}
					b {
						font-size: 0.36rem;
						color: #52b589;
						i {
							font-weight: normal;
							font-size: 0.2rem;
							color: #353a3f;
							vertical-align: middle;
							text-decoration: line-through;
						}
					}
				}
				.introduce {
					float: right;
					em {
						font-size: 0.22rem;
						color: #ee7000;
						display: block;
					}
					.discount {
						margin-top: 0.12rem;
						text-align: right;
						span {
							display: inline-block;
							width: 1.16rem;
							height: 0.32rem;
							text-align: center;
							line-height: 0.32rem;
							background-color: #1bbc9d;
							box-shadow: 0px 0.11rem 0.35rem 0px rgba(27, 188, 157, 0.3);
							border-radius: 0.16rem;
							font-size: 0.22rem;
							color: #fff;
						}
					}
				}
				.city {
					font-size: 0.2rem;
				}
				.tags {
					span {
						display: inline-block;
						padding: 0.03rem 0.22rem;
						border: solid 0.02rem #99a1a8;
						border-radius: 0.22rem;
						font-size: 0.22rem;
						color: #99a1a8;
						margin-top: 0.18rem;
						margin-left: 0.14rem;
						&:first-child {
							margin-left: 0
						}
					}
				}
				.description {
					font-size: 0.2rem;
					line-height: 0.26rem;
					color: #878e95;
					margin-top: 0.18rem;
					text-overflow: ellipsis;
					display: -webkit-box;
					display: -moz-box;
					-webkit-box-orient: vertical;
					-webkit-line-clamp: 2;
					word-wrap: break-word;
					overflow: hidden;
				}
			}
		}
	}
</style>