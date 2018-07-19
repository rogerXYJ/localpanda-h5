<template>
	<div class="footMobile">
		<div class="footMessage">
			<ul>
				<li :key="index" v-for="(i,index) in footData">
					<div class="name" @click="showFn(index)">{{i.name}} <i class="iconfont">&#xe62f;</i></div>
					<div class="footContent" v-if="i.show">
						<div class="payments" v-if="i.name=='Payments'">
							<span>
								<svg class="icon" aria-hidden="true">
										<use xlink:href="#icon-mastercard"></use>
								</svg>
							</span>
							<span>
								<svg class="icon" aria-hidden="true">
										<use xlink:href="#icon-americanexpress"></use>
								</svg>
							</span>
							<span>
								<svg class="icon" aria-hidden="true">
										<use xlink:href="#icon-paypal"></use>
								</svg>
							</span>
							<span>
								<svg class="icon" aria-hidden="true">
										<use xlink:href="#icon-visa"></use>
								</svg>
							</span>
							<span>
								<svg class="icon" aria-hidden="true">
										<use xlink:href="#icon-wechat"></use>
								</svg>
							</span>
						</div>
						<div class="item" :key="thisindex" v-for="(j,thisindex) in i.cont" v-else><a :class="j.url?'':'font-color'" :href="j.url?j.url:'javascript:;'" >{{j.text}}</a></div>
					</div>
				</li>
			</ul>
			<div class="log">
				<!-- <div class="localpanda">
					<svg class="icon3" aria-hidden="true">
							<use xlink:href="#icon-logo_"></use>
					</svg>
				</div>	 -->
				<div class="cooperation">
					<a href="https://www.facebook.com/LocalPandaGuides/?fref=ts">
						<svg class="icon2" aria-hidden="true">
								<use xlink:href="#icon-facebook"></use>
						</svg>
					</a>
					<a href="https://twitter.com/LocalPandaGuide">
						<svg class="icon2" aria-hidden="true">
								<use xlink:href="#icon-twitter1"></use>
						</svg>
					</a>
					<a href="https://www.instagram.com/localpandaguides/">
						<svg class="icon2" aria-hidden="true">
								<use xlink:href="#icon-instagram"></use>
						</svg>
					</a>
					<a href="http://www.linkedin.com/company/local-panda/">
						<svg class="icon2" aria-hidden="true">
								<use xlink:href="#icon-linkedin"></use>
						</svg>
					</a>
					<a href="https://www.youtube.com/channel/UCvqMXh6m1becSul6bAvEvzw">
						<svg class="icon2" aria-hidden="true">
								<use xlink:href="#icon-yutobe-plus"></use>
						</svg>
					</a>
				</div>
				
				<p>© 2018 Local Panda All Rights Reserved.</p>
			</div>
		</div>
	</div>
</template>

<script>
	if (process.BROWSER_BUILD) {
	  require('~/assets/font/iconfont.js')
	  
	}
	export default {
		name:'footMobile',
		data(){
			return{
				footData:[{
						name:"Explore",
						cont:[
							{
								text:"Activities in Shanghai",
								url:"/activity/list/Shanghai"
							},
							{
								text:"Activities in Beijing",
								url:"/activity/list/Beijing"
							},
							{
								text:"Activities in Chengdu",
								url:"/activity/list/Chengdu"
							},
							{
								text:"Activities in Xi'an",
								url:"/activity/list/Xian"
							},
							{
								text:"Activities in Guilin",
								url:"/activity/list/Guilin"
							},
							
						],
						show:false
					},
					{
						name:"Company",
						cont:[
							{
								text:"About Us",
								url:"/info/about-us"
							},
							{
								text:"Contact Us",
								url:"/info/feedback/"
							}
						],
						show:false
					},
					{
						name:'Need Help',
						cont:[
							{
								text:"Legal",
								
							},
							{
								text:"Terms of Use",
								
							},
							{
								text:"Privacy Policy",
								url:"/info/privacy-policy"
								
							},
							{
								text:'Service Terms',
								url:"/info/service-terms"
							}
						],
						show:false
						
					},
					{
						name:"Payments",
						show:false
					}
				]
					
					

				
			}
		},
		components: {
	    },
	    methods: {
	    	showFn(index){
	    		this.footData[index].show=!this.footData[index].show
	    	}
	    },
	    mounted: function() {
	        
	     	
	    }
	}
</script>

<style lang="scss" scoped>
	.icon {
      width: 0.7rem; height: 0.44rem;
		vertical-align: middle;
	   fill: currentColor;
	   overflow: hidden;
	   border-radius: 0.066666rem;
    }
    .icon3{
    	width:3.12rem;
    	height:0.8rem;
       vertical-align:middle;
       fill: currentColor;
       
       overflow: hidden;
    }
    .icon2{
    	width: 0.6rem; height: 0.6rem;
       vertical-align:middle;
       fill: currentColor;
       
       overflow: hidden;
    }
    .font-color{
    	color: #878E95;
    }
	.footMobile{
		margin-top: 0.8rem;
		.footMessage{
			padding:0 0.3rem 1.1rem;
			ul{
				li{
					border-top:1px solid #dde0e0;
					&:last-child{
						border-bottom: 1px solid #dde0e0;
					}
					.name{
						height: 1.12rem;
						line-height: 1.12rem;
						position: relative;
						font-size: 0.3rem;
						i{
							position: absolute;
							right: 0;
							font-size: 0.3rem;
							color: #878e95;
						}
					}
					.footContent{
						padding:0 0.293333rem 0.5rem;
						.item{
							margin-top:0.36rem;
							a{
								display: block;
								font-size: 0.26rem;
							}
							&:first-child{
								margin-top: 0;
							}
							
							
						}
						.payments{
							margin-top:0.133333rem;
							span{
								margin-right: 0.133333rem;
								
								display: inline-block;
							}
						}
					}
				}
			}
			.log{
				padding: 0.6rem 0 0;
				text-align: center;
				.cooperation{
					a{
						display: inline-block;
						margin-left: 0.25rem;
						&:first-child{
							margin-left: 0;
						}
					}
				}
				p{
					margin-top: 0.5rem;
				}
			}
		}
	}
</style>