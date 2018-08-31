<template>
	<div class="expats">
		
		<div class="headPhoto">
			
			<div class="headPhoto_bg">
				<Head :isExpats="isExpats" :class="{position:scroll}"></Head>
				<h3 class="bannerTitle">Find the Ultimate Experience</h3>
				<p class="bannerDes">We know that you've come a long way and spent a lot of time and energy to be here. We help you make sure the memories are worth it.</p>
				<div class="bg-shadow"></div>
			</div>
			
			
			<div class="hotActivity page-content">
				<h3>Seasonal Deal</h3>
				<div class="contentBox">
					<div class="activityPhoto">
						<a style="display: block;" href="/travel/expats/details/excursions">
							<span>Jun Extravaganza: UNLIMITED archery, <br/>
	horseriding, karting & kayaking</span>
						</a>
					</div>
					<div class="activityInfo clearfix">
						<div class="price">
							<h4>Seasonal Deals:</h4>
							<b>638 RMB</b>
							<h5>per person</h5>
						</div>
						<div class="dateCity">
							<p>June 31-July 1</p>
							<div class="city">Cities: Taihu Lake, Suzhou</div>
						</div>
					</div>
					<div class="clickBtn">
						<button><a href="/travel/expats/details/excursions">Wanna Get It Free?</a></button>
						<button><a href="/activity/details/11270">Book Now!</a></button>

					</div>
				</div>
			</div>
			<linkFoot :noUrl="noUrl"></linkFoot>
		</div>

		
	</div>
</template>

<script>
	
	import Head from '~/components/header/index'
	import linkFoot from '~/components/travel/expats/linkFoot'
	export default {
		name: 'expats',
		data() {
			return {
				isExpats: true,
				scroll:false,
				noUrl:false
			}
		},
		methods: {
			scrollBar(e){
				let data = this;
				
				if(window.scrollY > 10) {
					data.scroll = true;
					data.isExpats=false
				} else {
					data.scroll = false;
					data.isExpats=true
				}
			}
			
		},
		head(){
			let title="China Adventure Travel | Trips & Experiences"
			let keywords="Adventure Travel, China Trip, China Tour, China Tour Package, Tibet, Yellow Mountain, Avatar Mountains, Xinjiang, China Nature, China Scenery"
			let description="Discover the most stunning off-the-beaten-path destinations in China with Local Panda's signature trips to Tibet, Xinjiang, Zhangjiajie, and more."
			return{
				title: title,
				meta: [{
						hid: "keywords",
						name: "keywords",
						content:keywords 
					},
					{
						hid: "description",
						name: "description",
						content: description
					}
				],
			}
		},
		components: {
			Head,
			linkFoot
		},
		mounted: function() {
			let that=this
			console.log(that.noUrl)
			window.addEventListener("scroll", this.scrollBar);
		}
	}
</script>
<style lang="scss">
	
	.position{
		position: fixed!important;
		width: 100%;
		top: 0;
		
	}
	html,
	body {
		background: #f5f7f7;
	}

	.page-content {
		margin: 0 0.3rem;
	}
	
	
	.expats {
		
		.headPhoto {
			
			position: relative;
			opacity: 0.9;
			.headPhoto_bg{
				background: url("https://cloud.localpanda.com/content/landingpage/expats/banner.jpg") no-repeat;
				height: 5rem;
				background-size: cover;
				background-position: center;
				position: relative;
				padding-top: 1.6rem;
				.header{
					position: fixed;
					left: 0;
					top: 0;
					width: 100%;
				}
			}
			.bannerTitle {
				text-align: center;
				font-size: 0.44rem;
				font-weight: bold;
				color: #fff;
				text-shadow: 0 0.05rem 0.1rem rgba(0, 0, 0, 0.3);
			}
			.bannerDes {
				padding: 0 1.03rem;
				color: #fff;
				font-size: 0.24rem;
				margin-top: 0.22rem;
				line-height: 0.28rem;
				text-align: center;
				text-shadow: 0 0.05rem 0.1rem rgba(0, 0, 0, 0.3);
			}
			.bg-shadow {
				position: absolute;
				bottom: 0;
				height: 1.23rem;
				width: 100%;
				background: linear-gradient(to top, #f5f7f7 30%, rgba(255, 249, 248, 0));
			}
		}
		.hotActivity {
			margin-top: -1rem;
			background-color: #fe483e;
			box-shadow: 0px 0.08rem 0.5rem 0px rgba(253, 72, 62, 0.06);
			border-radius: 0.1rem;
			position: relative;
			padding: 0 0.04rem 0.04rem;
			h3 {
				height: 0.55rem;
				line-height: 0.55rem;
				font-size: 0.22rem;
				color: #fff;
				padding-left: 0.1rem;
				font-weight: bold;
			}
			;
			.contentBox {
				padding: 0.1rem 0.1rem 0.3rem 0.1rem;
				background: #fff;
				border-radius: 0.1rem;
				.activityPhoto {
					height: 2.18rem;
					width: 100%;
					position: relative;
					border-radius: 0.1rem;
					background: url("https://cloud.localpanda.com/content/landingpage/expats/MembersSeasonalDeal.jpg") no-repeat;
					background-size: cover;
					background-position: center;
					span {
						position: absolute;
						left: 0.24rem;
						bottom: 0.2rem;
						font-size: 0.28rem;
						line-height: 0.36rem;
						color: #fff;
						text-shadow: 0 0.05rem 0.1rem rgba(0, 0, 0, 0.3);
					}
				}
				.activityInfo {
					padding: 0.22rem 0.2rem 0;
					.price {
						float: left;
						h4 {
							font-size: 0.22rem;
							color: #878e95;
						}
						b {
							display: block;
							color: #52b589;
							font-size: 0.36rem;
						}
						h5 {
							font-size: 0.2rem;
							color: #878e95;
						}
					}
					.dateCity {
						float: right;
						text-align: right;
						p {
							font-size: 0.22rem;
						}
					}
				}
				.clickBtn {
					padding: 0.3rem 0.2rem 0;
					button {
						display: inline-block;
						width: 48%;
						margin-right: 4%;
						height: 0.68rem;
						text-align: center;
						line-height: 0.68rem;
						border-radius: 0.34rem;
						background: none;
						font-size: 0.24rem;
						font-weight: bold;
						a {
							display: block;
						}
						&:first-child {
							border: solid 0.02rem #fe483e;
							a {
								color: #fe483e;
							}
						}
						&:last-child {
							a {
								color: #fff;
							}
							margin-right:0;
							background-color: #fe483e;
							box-shadow: 0px 0.11rem 0.35rem 0px rgba(254,
							72,
							62,
							0.3);
							border-radius: 0.34rem;
						}
					}
				}
			}
		}
	}
</style>