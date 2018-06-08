 <template>
    <div class="expats">
    	<div class="headPhoto">
    		<Head></Head>
    		<h3>Find the Ultimate Experience</h3>
    		<p>We know that you’ve come a long way, and that you’ve spent a lot of time and energy to be here. We help you make sure the memories are worth it.</p>
    		<div class="bg-shadow"></div>
    	</div>
    	<div class="hotActivity page-content">
    		<h3>Members' Seasonal Deal</h3>
    		<div class="contentBox">
    			<div class="activityPhoto">
    				<span>Jun Extravaganza: UNLIMITED archery, <br/>
horseriding, karting & kayaking</span>
    			</div>
    			<div class="activityInfo clearfix">
    				<div class="price">
    					<h4>Seasonal Deals:</h4>
    					<b>720RMB</b>
    					<h5>per person</h5>
    				</div>
    				<div class="dateCity">
    					<p>June 31-July 1</p>
    					<div class="city">Cities: Taihu Lake, Suzhou</div>
    				</div>
    			</div>
    			<div class="clickBtn">
    				<button>Wanna Get It Free?</button>
    				<button>Book Now!</button>
    			</div>
    		</div>
    	</div>
    	<div class="tour">
    		<h3>Signature Destinations</h3>
    		<h4>Browse a list of trips to embark your next adventure</h4>
    		<ul class="clearfix">
    			<li v-for="(item,index) in tourList" :key="index" :style="{backgroundImage: 'url(' + item.imgUrl + ')'}">
    				<div class="mask"></div>
    				<div class="content">
	    				<p>{{item.name}}</p>
	    				<p class="text" v-if="item.nameText">{{item.nameText}}</p>
    				</div>
    			</li>
    		</ul>
    	</div>
    	<div class="customizeBtn">
    		<h4>Can’t find your ideal trip? Don’t worry!</h4>
    		<button class="btn">Let’s Customize Your Trip</button>
    	</div>
    </div>
</template>

<script>
import Head from '~/components/header/index'
export default {
    name: 'expats',
    data () {
        return {
			tourList:[
				{
					name:"Shangri-la",
					imgUrl:'https://resource.localpanda.cn/content/landingpage/experts/Shangrila.jpg',
					linkUrl:''
				},
				{
					name:"Tibet",
					imgUrl:'https://resource.localpanda.cn/content/landingpage/experts/Tibet.jpg',
					linkUrl:''
				},
				{
					name:"Zhangjiajie",
					imgUrl:'https://resource.localpanda.cn/content/landingpage/experts/Zhangjiajie.jpg',
					linkUrl:''
				},
				{
					name:"Xinjiang",
					imgUrl:'https://resource.localpanda.cn/content/landingpage/experts/Xinjiang.jpg',
					linkUrl:''
				},
				{
					name:"Silk Road",
					imgUrl:'https://resource.localpanda.cn/content/landingpage/experts/SilkRoad.jpg',
					linkUrl:''
				},
				{
					name:"Yellow Mountain",
					imgUrl:'https://resource.localpanda.cn/content/landingpage/experts/YellowMountain.jpg',
					linkUrl:''
				},
				{
					name:"Inner Mongolia",
					imgUrl:'https://resource.localpanda.cn/content/landingpage/experts/InnerMongolia.jpg',
					linkUrl:''
				},
				{
					name:"Seasonal Deal",
					nameText:'Members Only',
					imgUrl:'https://resource.localpanda.cn/content/landingpage/experts/SeasonalDeal.jpg',
					linkUrl:''
				}
			
			
			
			
			]
        }
    },
    methods: {
       
    },
    components:{
    	Head 
    },
    mounted: function() {
	
    }
}
</script>
<style lang="scss">
	html,body{
		background: #f5f7f7;
	}
	.header{
		background: transparent!important;	
		
	}
	.header_btn{
			span{
				background: #fff!important;
				}
		}
	.header_box{
			background: transparent!important;
			border: none!important;
	}
	.page-content{
		margin:0 0.3rem;
	}
	.expats{
		.headPhoto{
			background:url("https://resource.localpanda.cn/content/landingpage/experts/banner.jpg") no-repeat;
			height: 5rem;
			background-size:cover;
			background-position: center;
			position: relative;
			opacity: 0.9; 
			h3{
				margin-top: 0.72rem;
				text-align: center;
				font-size:0.44rem;
				font-weight:bold;
				color: #fff;
				text-shadow:0 0.05rem 0.1rem rgba(0,0,0,0.3);
			}
			p{
				padding: 0 1.03rem;
				color: #fff;
				font-size: 0.24rem;
				margin-top: 0.22rem;
				line-height: 0.28rem;
				text-align: center;
				text-shadow:0 0.05rem 0.1rem rgba(0,0,0,0.3);
			}
			.bg-shadow{
				position: absolute;
				bottom: 0;
				height: 1.23rem;
				width: 100%;
				background: linear-gradient(to top,#f5f7f7 30%, rgba(255, 249, 248, 0));
				
			}
		}
		.hotActivity{
			background-color: #fe483e;
			box-shadow: 0px 0.08rem 0.5rem 0px rgba(253, 72, 62, 0.06);
			border-radius: 0.1rem;
			position: relative;
			top: -1.23rem;
			padding:0 0.04rem 0.04rem;
			h3{
				height: 0.55rem;
				line-height: 0.55rem;
				font-size: 0.22rem;
				color: #fff;
				padding-left: 0.1rem;
			};
			.contentBox{
				padding:0.1rem 0.1rem 0.3rem 0.1rem;
				background: #fff;
				border-radius: 0.1rem;
				.activityPhoto{
					height: 2.18rem;
					width: 100%;
					position: relative;
					border-radius: 0.1rem;
					background:url("https://resource.localpanda.cn/content/landingpage/experts/MembersSeasonalDeal.jpg") no-repeat;
					
					background-size:cover;
					background-position:center;
					span{
						position: absolute;
						left: 0.24rem;
						bottom: 0.2rem;
						font-size: 0.28rem;
						line-height:0.36rem;
						color: #fff;
						text-shadow:0 0.05rem 0.1rem rgba(0,0,0,0.3);
						
					}
					
				}
				.activityInfo{
					padding:0.22rem 0.2rem 0;
					.price{
						float: left;
						h4{
							font-size: 0.22rem;
							color: #878e95;
						}
						b{
							display: block;
							
							color: #52b589;
							font-size: 0.36rem;
							
						}
						h5{
							font-size: 0.2rem;
							color: #878e95;
						}
						
					}
					.dateCity{
						float: right;
						text-align: right;
						p{
							font-size: 0.22rem;
						}
					}
				}
				.clickBtn{
					padding: 0.3rem 0.2rem 0;
					display: box;
					button{
						box-flex:1;
						width: 2.97rem;
						margin-right:0.28rem;
						height: 0.68rem;
						text-align:center;
						line-height:0.68rem;
						border-radius:0.34rem;
						background:none;
						font-size: 0.24rem;
						font-weight:bold;
						&:first-child{
							border:solid 0.02rem #fe483e;
							color:#fe483e;
						} 
						&:last-child{
							margin-right:0;
							background-color: #fe483e;
							box-shadow: 0px 0.11rem 0.35rem 0px 
								rgba(254, 72, 62, 0.3);
							border-radius: 0.34rem;
							color: #fff;
						}
					}
				}
			}
		}
		.tour{
			margin-top: -0.59rem;
			padding:0 0.3rem ;
			h3{
				font-size: 0.44rem;
				font-weight: bold;
			}
			h4{
				font-size: 0.24rem;
				margin-top: 0.1rem;
			}
			ul{
				margin-top: 0.1rem;
				li{
					background-repeat: no-repeat;
					background-size: cover;
					background-position: center;
					float: left;
					margin-top: 0.3rem;
					margin-right: 0.3rem;
					width: 3.3rem;
					height: 1.76rem;
					position: relative;
					border-radius: 0.06rem;
					.content{
						width: 100%;
						position: absolute;
						left: 50%;
						top: 50%;
						transform: translate(-50%,-50%);
					}
					p{
						
						position: relative;
						z-index: 2;
						font-size: 0.3rem;
						color: #fff;
						font-weight: bold;
						text-shadow:0 0.05rem 0.1rem rgba(0,0,0,0.3);
						text-align: center;
						
						
					}
					.text{
							font-size: 0.22rem!important;
							font-weight: normal!important;
						}
					&:nth-child(2n+0){
						margin-right: 0;
					}
				}
			}
		}
		.customizeBtn{
			margin: 0.6rem 0.3rem;
			background: #fff;
			box-shadow: 0px 0.08rem 0.5rem 0px rgba(0, 0, 0, 0.06);
			border-radius: 0.1rem;
			padding: 0.48rem 0.3rem;
			h4{
				text-align: center;
				font-size: 0.28rem;
				
			}
			.btn{
				margin-top:0.3rem;
				font-size: 0.32rem;
				font-weight: bold;
			}
		}
		.mask{
			position: absolute;
		    left: 0;
		    top: 0;
		    min-width: 100%;
		    min-height: 100%;
		    background: rgba(0, 0, 0, .4);
		    border-radius: 0.06rem;
		}
	}	
</style>