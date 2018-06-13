
<style lang="scss" scoped>

	
	.activity_list{
		background-color: #f5f7f7;

		// 筛选
		.filter_box{
			position: relative;
			z-index: 3;
			.filter_type{
				background-color: #fff;
				padding-top:0.06rem;
				position: relative;
				dd{
					padding: 0.24rem 0;
					
					float: left;
					width: 33.3%;
					
					font-size: 0.24rem;
					color: #353a3f;
					.filter_type_btn{
						display: inline-block;
						text-align: center;
						border-left: #ededed solid 1px;
						height: 0.36rem;
						line-height: 0.36rem;
						width: 100%;
						position: relative;
						margin-left: -1px;
						.iconfont{
							font-size: 0.3rem;
							color: #1bbc9d;
							margin-right: 0.16rem;
							vertical-align: top;
						}
						
					}
					&:nth-last-child(1){
						.iconfont{
							font-size: 0.26rem;
						}
					}
					.filter_products{
						position: absolute;
						left: 0;
						top: 0.9rem;
						width: 100%;
						height: 100vh;
						background-color: rgba(0,0,0,0.5);
						border-top: #f5f5f5 solid 1px;
						-webkit-transition:all 0.2s ease-out 0s;
						z-index: -1;
						opacity: 0;
						visibility: hidden;
						.products_list,.rank_list{
							background-color: #fff;
							padding: 0 0.44rem;
							li{
								border-bottom: #ededed solid 1px;
								&:nth-last-child(1){
									border:none;
								}
							}
						}
						.products_footer{
							padding: 0.3rem;
							background-color: #fff;
							.btn{
								width: 60%;
								font-weight: bold;
							}
							.btn_plain{
								width: 30%;
								float: right;
							}
						}
						.rank_list,.city_list{
							padding-bottom: 0.2rem;
						}
					}
					.show_products,.show_rank{
						z-index: 1;
						opacity: 1;
						visibility: inherit;
					}
				}
			}
		}

		//条件结果
		.requirement_result{
			overflow-x: auto;
			white-space: nowrap;
			-webkit-overflow-scrolling: touch;
			width: 100%;
			padding: 0.08rem 0.2rem 0.15rem 0.11rem;
			span{
				display: inline-block;
				padding: 0 0.26rem;
				line-height: 0.52rem;
				border: solid 1px #ebebeb;
				background-color: #fff;
				border-radius: 0.26rem;
				margin-left: 0.09rem;
				font-size: 0.24rem;
				color: #353a3f;
			}
		}
		.destination_result{
			padding: 0.1rem 0;
			font-size: 0.26rem;
			color: #878e95;
			margin-left: 0.2rem;
			b{
				margin-right: 0.15rem;
			}
		}

		//列表
		.list_box{
			padding: 0 0.2rem;
			.list_ul{
				li{
					margin-top: 0.16rem;
					background-color: #ffffff;
					box-shadow: 0px 8px 50px 0px rgba(0, 0, 0, 0.06);
					display: block;
					position: relative;
					padding-left: 29%;
					overflow: hidden;
					border-radius: 0.1rem;
					a{
						.list_img{
							position: absolute;
							left: 0;
							top: 0;
							width: 29%;
							height: 100%;
							min-height: 2rem;
							background-size: cover;
							background-position: center;
						}
						.list_content{
							padding: 0.1rem 0.2rem 0.2rem;
							h4{
								color: #353a3f;
								font-size: 0.28rem;
								font-weight: bold;
								line-height: 0.32rem;
								height: 0.64rem;
								overflow: hidden;
							}
							.list_tag{
								font-size: 0.22rem;
								color: #1bbc9d;
								margin-top: 0.1rem;
								line-height: 0.28rem;
								span{
									margin-right: 0.14rem;
									display: inline-block;
								}
							}
							.duration{
								margin-top: 0.06rem;
								font-size: 0.22rem;
								color: #353a3f;
								b{
									margin-right: 0.1rem;
								}
							}
							.price_box{
								margin-top: 0.16rem;
								.list_price{
									float: right;
									color: #878e95;
									font-size: 0.22rem;
									b{
										color: #353a3f;
										font-size: 0.28rem;
										margin: 0 0.07rem;
									}
								}
								.tag_private,.tag_group{
									display: inline-block;
									background-color: #52b589;
									box-shadow: 0rem 0.11rem 0.35rem 0rem rgba(82, 181, 137, 0.3);
									border-radius: 0.1rem;
									color: #fff;
									padding: 0 0.16rem;
									height: 0.34rem;
									line-height: 0.34rem;
									font-size: 0.22rem;
									
								}
								.tag_group{
									background-color: #efae99;
									box-shadow: 0rem 0.11rem 0.35rem 0rem rgba(239, 174, 153, 0.3);
								}
							}
							
						}
						
					}
				}
			}
		}

		.filter_dialog{
			position: fixed;
			left: 0;
			top:0;
			height: 100%;
			width: 100%;
			z-index: -1;
			opacity: 0;
			-webkit-transition:all 0.2s ease-out 0s;
			-webkit-transform: scale(0.5);
			background-color: #fff;
			.head_back{
				border-bottom: #f3f3f3 solid 1px;
				.filter_clear{
					color: #1bbc9d;
					font-size: 0.28rem;
				}
			}
			.filter_content{
				height: calc(100vh - 1rem -1.5rem);
				overflow-y: auto;
				dt{
					height: 0.74rem;
					line-height: 0.74rem;
					background-color: #f5f7f7;
					padding-left: 0.44rem;
					color: #878e95;
					font-size: 0.24rem;
					font-weight: bold;
				}
				dd{
					padding: 0 0.44rem;
					.checkbox_label{
						display: block;
						margin-left: 0;
						border-bottom: #ededed solid 1px;
						&:nth-last-child(1){
							border:none;
						}
					}
				}
				
			}
			.filter_dialog_footer{
				background-color: #fff;
				padding: 0.28rem 0.3rem;
			}
		}
		.show_filter{
			opacity: 1;
			-webkit-transform: scale(1);
			z-index: 101;
		}

	}
	

	
</style>
<style lang="scss">
	.checkbox_label,.radio_label{
		padding: 0.3rem 0;
		display: block;
		width: 100%;
		.checkbox_content,.radio_content{
			padding-left: 0.2rem;
			font-size:0.26rem;
		}
	}
	
</style>


<template>
	<div class="activity_list">
		<Head></Head>

		<!-- 筛选 -->
		<div class="filter_box">
			<dl class="filter_type clearfix">

				<!-- products -->
				<dd>
					<span class="filter_type_btn" @click="productsFn"><i class="iconfont">&#xe679;</i>City</span>
					<div class="filter_products" @click="hideFilter" :class="{show_products:showProducts}">
						<radio-group v-model="cityCheck">
							<ul class="products_list city_list">
								<li :key="index" v-for="(item,index) in city">
									<radio :label="item" :change="cityChange">{{item=='Xian'?"Xi'an":item}}</radio>
								</li>
							</ul>
						</radio-group>
						<!-- <div class="products_footer">
							<span class="btn btn_plain" @click="productsClear">Clear</span>
							<span class="btn" @click="productsConfirm">See experiences</span>
						</div> -->
					</div>
				</dd>

				<!-- filter -->
				<dd><span class="filter_type_btn" @click="filterFn"><i class="iconfont">&#xe668;</i>Filter</span></dd>

				<!-- Rank -->
				<dd><span class="filter_type_btn" @click="rankFn"><i class="iconfont">&#xe66b;</i>Rank</span>
					<div class="filter_products" @click="hideFilter" :class="{show_rank:showRank}">
						<radio-group v-model="rankCheck">
							<ul class="rank_list">
								<li :key="index" v-for="(item,index) in rank">
									<radio :label="item" :change="rankChange">{{item}}</radio>
								</li>
							</ul>
						</radio-group>
					</div>
				</dd>
			</dl>
		</div>

		<!-- 筛选结果 -->
		<div class="requirement_result">
			<span :key="index" v-for="(item,index) in filterTag">{{item}}</span>
		</div>
		<div class="destination_result"><b>{{cityCheck}}</b>（{{listdata.records}} activities found）</div>

		<!-- 产品列表 -->
		<div class="list_box">
			<ul class="list_ul">
				<li :key="index" v-for="(item,index) in listdata.entities">
					<a :href="'/activity/details/'+item.activityId">
						<div class="list_img" v-lazy:background-image="item.coverPhotoUrl"></div>
						<div class="list_content">
							<h4>{{item.title}}</h4>
							<div class="list_tag">
								<span :key="index" v-for="(item,index) in item.category.split(' ')">"{{item}}"</span>
							</div>
							<p class="duration"><b>Duration:</b>{{item.duration}} {{toLower(item.durationUnit)}}</p>
							<div class="price_box">
								<span class="list_price">From<b>${{item.bottomPrice}}</b>pp</span>
								<span class="tag_group">{{item.groupType}}</span>
							</div>
						</div>
					</a>
				</li>
			</ul>
		</div>
		
		<Foot></Foot>

		<div class="filter_dialog" :class="{show_filter:showFilter}">
			<Back title="Filter" type="close" :close="filterClose">
				<span class="filter_clear" @click="filterClear">Clear</span>
			</Back>
			<div class="filter_content">
				<dl :key="index" v-for="(item,index) in listdata.aggregations">
					<dt>{{item.type}}</dt>
					<dd v-if="item.type=='DURATION'">
						<checkbox-group v-model="filterCheck.duration">
							<checkbox :key="index2" v-for="(itemType,key,index2) in item.items" :label="key">{{getStr(key)}} ( {{itemType}} )</checkbox>
						</checkbox-group>
					</dd>
					<dd v-else>
						<checkbox-group v-model="filterCheck[toLower(item.type)]">
							<checkbox :key="index2" v-for="(itemType,key,index2) in item.items" :label="key">{{key}} ( {{itemType}} )</checkbox>
						</checkbox-group>
					</dd>
				</dl>
			</div>

			<div class="filter_dialog_footer">
				<span class="btn" @click="filterConfirm">See experiences</span>
			</div>
		</div>
	</div>
</template>
<script>

	import Head from '~/components/header/index'
	import Back from '~/components/header/back'
	import Foot from "~/components/footer/index"
	import {checkboxGroup,checkbox} from "~/plugins/panda/checkbox/"
	import {radioGroup,radio} from "~/plugins/panda/radio/"

	import Vue from "vue";
	
	export default {
		name: 'activityList',
		components: {
			Head,
			Back,
			Foot,
			checkboxGroup,
			checkbox,
			radioGroup,
			radio
		},
		async asyncData({
			route,
			apiBasePath
		}) {
			let loc = route.params.slug;
			

			var listdata = {};

			var postData = {
				location:'Beijing',
				pageNum:1,
				pageSize:10,
				sort:{"type":"SCORE"}
			};

			try{
				listdata = await Vue.axios.post(apiBasePath + "search/activity", JSON.stringify(postData), {
					headers: {
						'Content-Type': 'application/json; charset=UTF-8'
					}
				})
			}catch(err){};

			//列表页数据
			var data = listdata.data;

			//根据接口数据，生成需要筛选的类型默认数据和默认选中数据
			var filter = {},
				filterCheck = {};
			if(data.aggregations){
				data.aggregations.forEach(item => {
					var thisFilter = [];
					for(var key in item.items){
						thisFilter.push(key);
					}
					var type = item.type.toLowerCase();
					filter[type] = thisFilter;
					filterCheck[type] = thisFilter;
				});
			}


			return {
				listdata: data,
				cityCheck:loc,
				city:['Shanghai','Beijing','Chengdu','Xian','Guilin'],
				showCity:false,

				productsCheck:[],   //打钩的值
				products:[],
				showProducts:false,

				filterCheck:filterCheck,
				filter: filter,
				showFilter: false,

				rankCheck:'Recommended',
				rank:['Recommended','Price :Low to High','Price :High to Low'],
				showRank:false
			}
		},
		computed:{
			filterTag:function(){
				var allTag = [];
				for(var key in this.filterCheck){
					console.log(this.filterCheck[key]);
					allTag.splice(this.filterCheck[key]);
				}
				console.log(allTag);
				return allTag;
			}
		},
		methods: {
			hideFilter(e){
				var isBg = /filter_products/.test(e.target.className);
				if(isBg){
					this.showProducts = false;
					this.showRank = false;
				}
			},

			//products相关
			productsFn(){
				this.showProducts=!this.showProducts;	
				this.showRank = false;
			},
			productsClear(){
				//清空数据
				this.productsCheck = [];
				//跳转url

			},

			//filter相关
			filterFn(){
				this.showFilter=!this.showFilter;	
				this.showProducts= false;
				this.showRank = false;
			},
			filterClose(){
				this.showFilter = false;
			},
			filterClear(){
				//清空数据
				for(var key in this.filterCheck){
					this.filterCheck[key] = [];
				}
				//跳转url
				this.jumpUrl();
			},

			//rank相关
			rankFn(){
				this.showRank=!this.showRank;	
				this.showProducts= false;
			},
			//切换排序
			rankChange(e){
				this.rankCheck = e.target.value;
				this.jumpUrl();
			},
			
			//切换城市
			cityChange(e){
				var isNew = /\/new\//.test(location.href);
				location.href = '/activity/list/'+(isNew?'new/':'') + e.target.value;
				this.productsFn();
			},
			

			//确定选择
			// productsConfirm(){
			// 	this.jumpUrl();
			// },
			//确定选择
			filterConfirm(){
				this.jumpUrl();
			},

			//跳转刷新
			jumpUrl(){
				//获取当前路径
				var path = this.$route.path;
				//获取当前选中的数据
				var filterCheck = this.filterCheck;
				//获取rank对象
				var rankCheck = this.rankCheck;
				var sort = '';

				console.log(rankCheck);
				if(rankCheck=='Price :Low to High'){
					sort = {"type":"PRICE","reverse":false}
				}else if(rankCheck=='Price :High to Low'){
					sort = {"type":"PRICE","reverse":true}
				}

				//去掉空数据,并对跳转的数据排序，把需要的数据放在新的options里
				var options = {};
				for(var key in filterCheck){
					if(filterCheck[key].length){
						options[key] = filterCheck[key].sort();
					}
				}
				//跳转并对对象转码
				var optionsEncode = encodeURIComponent(JSON.stringify(options));
				//检测是否有筛选项
				var hasOptions = JSON.stringify(options)!='{}';
				location.href = path + (hasOptions?'?options=' + optionsEncode:'') + (sort?(hasOptions?'&':'?')+'sort='+JSON.stringify(sort):'');

			},
			filterStr(){
				// for(var key in this.filterCheck){

				// }
			},

			
			toLower(text){
				return text.toLowerCase();
			},
			getStr(text){
				if(text==0){
					return 'Half Day';
				}else if(text==1){
					return text+' Day';
				}
				return text+' Days';
			}
		},
		watch: {
			
		},
		mounted: function() {
			console.log(this.$data.filter);
		},
		head() {
			let location = this.value;
			let title = "The Top " + location + " Tours | " + location + " Local Activities and Experiences";
			let keywords = "";
			let description = ""
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
	}
</script>

