<template>
	<div id="Mmenu">
		<div class="menu_list">
			
			<ul class="clearfix">

				<li v-if="highlights&&highlights.length>0">
					<a href="#journey">What You Can Expect</a>
				</li>
				<li v-if="introduction.length || detail.itineraries">
					<a href="#Itinerary">Itinerary</a>
				</li>
				<li v-if="photoList.length>0">
					<a href="#photoList">Moments in Travel</a>
				</li>
				
				<li v-if="exclusions || itemsIncluded">
					<a href="#provide">Inclusions & Exclusions</a>
				</li>
				<!-- <li v-if="remarkData.entities && remarkData.entities.length>0 && !ABtest || remarkData.entities && remarkData.entities.length && ABtest && userABtestID%2==0"> -->
				<li v-if="remarkData.entities && remarkData.entities.length>0">
					<a href="#Reviews">Reviews</a>
				</li>
				<!-- <li v-if="exclusions">
					<a href="#exclusions">Exclusions</a>
				</li> -->
				<li v-if="remark.length>0">
					<a href="#notes">Notes</a>
				</li>
			
				<!--<li v-if="picInfo.priceInstructions">
					<a href="#PriceNote">Price Note</a>
				</li>-->
				<li v-if="picInfo.refundInstructions">
					<a href="#CancellationPolicy">Rescheduling / Cancellation</a>
				</li>
				<li v-if="picInfo.details.length>0">
					<a href="#picDetails">Price Details</a>
				</li>
				<li v-if="detail.notice">
					<a href="#notice">Additional Info</a>
				</li>
				
				<li v-if="recommed.length>0">
					<a href="#recommend">Similar Experiences</a>
				</li>
			</ul>
			<div class="inquiryTab">
				<a :href="'/info/inquiry?objectId='+id">Send us any questions you have here</a>
				<i class="iconfont">&#xe620;</i>
			</div>
		</div>
	</div>
</template>

<script>
	export default {
		props: [
			'notice',
			'exclusions',
			'picInfo',
			"photoList",
			"id",
			"itemsIncluded",
			'detail',
			'introduction',
			'remark',
			'recommed',
			'remarkData',
			"userABtestID",
			"ABtest",
			'highlights'

		],
		name: "Mmenu",
		data() {
			return {
				
			}

		},
		components: {

		},
		methods: {
			
		},
			mounted: function() {
				var m = document.getElementById("Mmenu");
				var a = m.getElementsByTagName("a");
				for(var i=0 ; i<a.length ; i++){
	                a[i].index = i;//定义index变量，以便让tab按钮和tab内容相互对应
	                    a[i].onclick = function(){
	                    for(var i =0; i < a.length; i++){
	                        a[i].className = "";
	                        
	                    }
	                    this.className = "active";//为当前tab添加样式
	                    
	                }
	        
				}

				//优化手机滑动
				m.addEventListener('touchmove',function(e){
					e.preventDefault();
				},false);
				
			}
	}
</script>
<style lang="scss" scoped>
	#Mmenu {
		position: fixed;
		width: 100%;
		height: 100%;
		background: rgba(0, 0, 0, 0.4);
		top: 0;
		left: 0;
		z-index: 999999999;
		.menu_list {
			width: 100%;
			position: absolute;
			bottom: 0;
			background: #fff;
			left: 0;
			ul {
				
				li {
					text-align: center;
					margin-top: 0.14rem;
					a {
						font-size: 0.34rem;
						color: #878e95;
						display: block;
						padding: 0.15rem 0;
					}
				}
			}
		}
		.inquiryTab{
			text-align: center;
			margin-top: 0.44rem;
			margin-bottom: 0.44rem;
			position: relative;
			a{
				font-size: 0.34rem;
				color: #1bbc9d;
				font-weight: bold;	
			}
			i{
				position: absolute;
				right:0.3rem;
				color: #1bbc9d;
				vertical-align: middle;
				font-size: 0.32rem;
				top: 0.03rem;
			}
		}
		.active {
			color: #353a3f!important;
		}
	}
</style>