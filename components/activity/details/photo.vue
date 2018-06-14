<template>
	<div id="photo" v-bind:class="['alertPicOuter',alertPicActive ? 'on' : 'off']">
		<div class="false" @click="cancle"><i class="iconfont">&#xe606;</i></div>
			<div class="swiper-pagination" id="swiper_photo_pagination"></div>
			<div v-bind:class="{'boxshow animated zoomIn' : alertPicActive , 'boxshow animated zoomOut' : !alertPicActive}">
				<div class="conter">
					<div class="swiper-container gallery-top" id="swiper_photo">
						<div class="swiper-wrapper">
							<div class="swiper-slide" :key="index" v-for="(i,index) in photoList">
								<div class="swiper-zoom-container">
									<img class="isExpats" v-lazy="i.url" v-if="i.title"/>
									<img class="image" v-lazy="i.url" v-else>
								
									<div class="des" v-if="i.title">
										<h3>{{i.title}}</h3>
										<p>{{i.content}}</p>
									</div>
								</div>
							</div>					
						</div>
					</div>
				
					<!--<div v-swiper:swiperThumbs="swiperOptionThumbs" class="gallery-thumbs" ref="swiperThumbs">
						<div class="swiper-wrapper">
							<div class="swiper-slide" v-for="(i,index) in photoList" :class="index==0?'imgActive':''">
								<img :src="i.url" />
							</div>
							
						</div>
					</div>-->
			</div>
		</div>
	</div>
</template>

<script>
export default {
		name: "photo",
		data() {
			var self = this;
			return {
				alertPicActive: false,
				des:false,
				swiperOptionTop: {
					 pagination: {
			            el: '.swiper-pagination',
			            type: 'fraction'
			          },
					 lazy: {
					    loadPrevNext: true,
					  },
//					on: {
//						slideChangeTransitionStart: function(){
//							var activeIndex = this.activeIndex;
//							self.swiperThumbs.slideTo(activeIndex);
//							
//							var list = self.swiperThumbs.$el[0].getElementsByClassName('swiper-slide');
//							for(var i=0;i<list.length;i++){
//								if(i==this.activeIndex){
//									list[i].className = 'swiper-slide swiper-slide-visible imgActive';
//								}else{
//									list[i].className = list[i].className.replace(/imgActive/,'');
//								}
//							}
//						}
//					}
							
				},
//				swiperOptionThumbs: {
//					lazy: {
//					    loadPrevNext: true,
//					  },
//					watchSlidesProgress : true,
//					watchSlidesVisibility : true,
//					slidesPerView:"auto",
//					on:{
//						tap: function(e){
//							self.swiperTop.slideTo(this.clickedIndex);
//							console.log(this.clickedIndex)
//							var list = this.$el[0].getElementsByClassName('swiper-slide');
//							for(var i=0;i<list.length;i++){
//								if(i==this.clickedIndex){
//									list[i].className = 'swiper-slide swiper-slide-visible imgActive';
//								}else{
//									list[i].className = list[i].className.replace(/imgActive/,'');
//								}
//								
//							}
//						}
//					}
//						
//				}
			      
			}
		},
		methods: {
			cancle() {
				this.$emit('alert-call-back', false);
				this.alertPicActive = false;
			},
			
			
		},
		watch: {
			alertPicStatus: function(val, oldVal) {
				if(val) {
					this.alertPicActive = true;
					console.log(this.index)
					var self = this;
					setTimeout(function(){
						self.swiper_photo = new Swiper('#swiper_photo', {
							lazy: {
								loadPrevNext: true,
							},
							// 如果需要分页器
							pagination: {
								el: '#swiper_photo_pagination',
								type: 'fraction'
							},
							initialSlide:self.index?self.index:0,
							zoom:true
							
						});
					},200);
					
				} else {
					this.alertPicActive = false;
					this.swiper_photo.destroy();
				}
			}
		},
		created:function(){
//			if(process.browser){
//				let u = navigator.userAgent
//				console.log(navigator.userAgent)
//				u.indexOf('Android') > -1||u.indexOf('iPhone') > -1?this.swiperOptionThumbs.slidesPerView=2:this.swiperOptionThumbs.slidesPerView=3
//				console.log(this.swiperOptionThumbs.slidesPerView)
//			}
			 
			 //
			
		},
		mounted:function() {
			 
			 
		
		},
		props: ['alertPicStatus','photoList','index']
	}
</script>

<style lang="scss" scoped>
	@import "~assets/scss/_setting.scss";
	@import "~assets/scss/_animate.scss";
	.alertPicOuter {
		background: rgba(0, 0, 0,1);
		height: 100%;
		width: 100%;
		position: fixed;
		z-index: 999999999999999999;
		top: 0;
		left: 0;
		&.on {
			display: block;
		}
		&.off {
			display: none;
		}
		.boxshow {
			width: 100%;
			left: 0;
			top: 50%;
			position: absolute;
			transform: translateY(-50%);
			    .gallery-top {
			    	.swiper-slide{
			    		text-align: center;
			    		overflow: hidden;
			    		height: 100vh;
			    		img{
			    			max-width: 100%;
			    			position: relative;
			    			
			    		}
			    		.image{
			    				
			    				top: 50%;
			    				transform: translateY(-50%);
			    			}
			    			.isExpats{
			    				top: 2.37rem;
			    			}
			    		.des{
			    			position: relative;
			    			padding:0 0.38rem 0 0.3rem;
			    			margin-top:calc(50% + 1.37rem);
			    			transform: translateY(-50%);
			    			color: #fff;
			    			h3{
			    				font-size: 0.44rem;
			    				font-weight: bold;
			    				text-align: left;
			    			}
			    			p{
			    				font-size: 0.24rem;
			    				text-align: left;
			    				margin-top: 0.28rem;
			    			}
			    		}
			    	}
			    }
			    .gallery-thumbs {
			        height: 2.586666rem;
			        box-sizing: border-box;
			        margin-top: 3.253333rem;
			    }
			    .gallery-thumbs .swiper-slide {
			    	text-align: center;
			        height: 2.586666rem;
			        width: 3.866666rem!important;
					opacity: 0.4; 
					overflow: hidden;
			       img{
					     height: 2.586666rem;
					    }
			       
			    }
			    .gallery-thumbs .imgActive {
			        opacity: 1;
			    }
			    
			   
		}
		.swiper-pagination{
			text-align: right;
		}
		.swiper-pagination-fraction{
			    	top: 1.573333rem;
			    	bottom: auto;
					right: 0.4rem;
					left: auto;
					font-size: 0.32rem;
					color: #fff!important;
			    	
		}
		.swiper-zoom-container{
			display: inherit;
		}
		.false {
			&:hover {
				cursor: pointer;
			}
			i {
				font-size: 0.4rem;
				color: #fff;
			}
			position: absolute;
			right: 0.4rem;
			top: 0.4rem;
			z-index: 999;
		}
	}
</style>
<style lang="scss">
</style>