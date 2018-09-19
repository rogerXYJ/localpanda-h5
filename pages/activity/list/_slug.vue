
<style lang="scss" scoped>

	
	.activity_list{
		background-color: #f5f7f7;

		// 筛选
		.filter_box{
			position: relative;
			z-index: 3;
			min-height: 0.9rem;
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
					.active{
						color: #1bbc9d;
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
								.checkbox_label{
									padding-left: 0.34rem;
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
			margin-top: 0.1rem;
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
			.noListData{
				font-size: 0.32rem;
				text-align: center;
				padding:0.4rem 0.2rem;
			}
			.list_ul{
				li{
					margin-top: 0.16rem;
					background-color: #ffffff;
					box-shadow: 0px 8px 50px 0px rgba(0, 0, 0, 0.06);
					display: block;
					position: relative;
					padding-left: 29%;
					overflow: hidden;
					border-radius: 0.08rem;
					border-bottom: 2px solid #dde0e0;
					a{
						.list_img{
							position: absolute;
							left: 0;
							top: 0;
							width: 29%;
							height: 100%;
							min-height: 1.6rem;
							background-size: cover;
							background-position: center;
							p{
								position: absolute;
								left: 0;
								bottom: 0;
								padding: 0.08rem 0.1rem;
								text-align: center;
								width: 100%;
								font-size: 0.18rem;
								line-height: 0.28rem;
								overflow: hidden;
								color: #fff;
								background-color: rgba(0, 0, 0, 0.7);
							}
						}
						.list_content{
							padding: 0.1rem 0.2rem 0.16rem;
							h4{
								color: #353a3f;
								font-size: 0.28rem;
								font-weight: bold;
								line-height: 0.32rem;
								max-height: 0.64rem;
								overflow:hidden;
								-webkit-line-clamp: 2;
								-webkit-box-orient: vertical;
								display: -webkit-box;
								text-overflow: ellipsis;
								margin-bottom: 0.1rem;

								.tag_private,.tag_group{
									display: inline-block;
									background-color: #52b589;
									border-radius: 0.12rem;
									color: #fff;
									padding: 0 0.16rem;
									height: 0.24rem;
									line-height: 0.24rem;
									font-size: 0.16rem;
									vertical-align: top;
									margin-top: 0.04rem;
								}
								.tag_group{
									background-color: #efae99;
								}
							}
							
							.list_tag{
								font-size: 0.2rem;
								color: #1bbc9d;
								margin-bottom: 0.06rem;
								line-height: 0.29rem;
								max-height: 0.58rem;
								overflow:hidden;
								-webkit-line-clamp: 2;
								-webkit-box-orient: vertical;
								display: -webkit-box;
								text-overflow: ellipsis;
								word-wrap:break-word;
								width: 100%;
								span{
									margin-right: 0.14rem;
									display: inline-block;
								}
							}
							.duration,.destination{
								font-size: 0.22rem;
								color: #353a3f;
								b{
									margin-right: 0.1rem;
									font-weight: normal;
								}
							}
							.destination{
								 width:100%; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;
							}
							.sales{
								margin-top: 0.16rem;
								text-align: right;
							}
							.price_box{
								margin-top: -0.14rem;
								
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
								p{
									font-size: 0.2rem;
									clear: both;
									color: #878e95;
									text-align: right;
								}
								
							}
							
						}
						
					}
				}
			}
			.list_loading{
				margin-top: 0.2rem;
				text-align: center;
				span{
					text-align: center;
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
			-webkit-transform: scale(0.3);
			background-color: #fff;
			visibility: hidden;
			.head_back{
				border-bottom: #f3f3f3 solid 1px;
				.filter_clear{
					color: #1bbc9d;
					font-size: 0.28rem;
				}
			}
			.filter_content{
				height: calc(100vh - 1rem -1.5rem);
				-webkit-overflow-scrolling: touch;
				overflow-y: auto;
				padding-bottom: 1.4rem;
				dt{
					height: 0.74rem;
					line-height: 0.74rem;
					background-color: #f5f7f7;
					padding-left: 0.44rem;
					color: #878e95;
					font-size: 0.24rem;
					font-weight: bold;
					text-transform:uppercase;
				}
				dd{
					padding: 0 0.44rem;
					.checkbox-group{
						max-height: 5.8rem;
						overflow: hidden;
					
						.checkbox_label{
							display: block;
							margin-left: 0;
							border-bottom: #ededed solid 1px;
							padding-left: 0.34rem;
							&:nth-last-child(1){
								border:none;
							}
						}
					}
					.filter_more{
						color: #1bbc9d;
						font-size: 0.24rem;
						display: inline-block;
						padding: 0.2rem 0.2rem 0.3rem;
						margin-left: 0.3rem;
					}
					.filter_price{
						padding: 0.4rem 0;
						margin: 0 0.4rem;
						.filter_price_text{
							margin-top: 0.2rem;
							font-size: 0.26rem;
							.price_max{
								float: right;
							}
						}
					}
				}
				
			}
			.filter_dialog_footer{
				background-color: #fff;
				padding: 0.28rem 0.3rem;
				border-top: #dde0e0 solid 1px;
				position: fixed;
				left: 0;
				bottom: 0;
				width: 100%;
			}
		}
		
		.show_filter{
			opacity: 1;
			-webkit-transform: scale(1);
			z-index: 101;
			visibility: inherit;
		}

		.fixed_all{
			position: relative;
			height: 1.98rem;
			.filter_fixed{
				position: fixed;
				top: 0;
				left: 0;
				width: 100%;
				z-index: 99;
				border-bottom: #eee solid 1px;
			}
		}
		.h_search_top{
			height: 1.08rem;
			//margin-top: -1.08rem;
			padding: 0.22rem 0.2rem 0 0.2rem;
			background-color: #fff;
			border-bottom: #dde0e0 solid 1px;
			position: relative;
			
			.h_search_back{
				position: absolute;
				left: 0;
				top: 0.24rem;
				line-height: 0.62rem;
				padding: 0 0.2rem;
			}
			.btn{
				float: right;
				margin-right: -1.56rem;
				width: 1.36rem;
				height: 0.62rem;
				line-height: 0.62rem;
				font-size: 0.24rem;
				box-shadow: 0rem 0.11rem 0.35rem 0rem	rgba(27, 188, 157, 0.3);
			}
			.select_people{
				position: absolute;
				right: 0.2rem;
				top: 0.22rem;
				border-left: #ededed solid 1px;
				z-index: 3;
				height: 0.62rem;
				line-height: 0.62rem;
				padding-left: 0.15rem;
				font-size: 0.24rem;
				text-align: center;
				vertical-align: top;
				font-size: 0.26rem;
				i{
					position: absolute;
					right: 0.1rem;
					top: 0;
					width: 0.4rem;
					height: 0.62rem;
					line-height: 0.62rem;
					vertical-align: top;
					font-size: 0.36rem;
					font-weight: bold;
				}
				select{
					width: 100%;
					height: 100%;
					padding: 0 0.6rem 0 0.2rem;
					background: none;
					border: none;
					appearance:none;
					-moz-appearance:none;
					-webkit-appearance:none;
					position: relative;
					z-index: 2;
				}
			}
			.h_search_input_box{
				width: 100%;
				height: 0.62rem;
				background-color: #ffffff;
				box-shadow: 0rem 0rem 0.35rem 0rem rgba(53, 58, 63, 0.16);
				border-radius: 0.31rem;
				position: relative;
				overflow: hidden;
				.s_input_search{
					position: absolute;
					left: 0.15rem;
					top: 50%;
					-webkit-transform: translateY(-50%);
					color:#878e95;
				}
				input{
					width: 100%;
					height: 100%;
					border: none;
					padding-left: 0.6rem;
					color: #353a3f;
				}
				input::-webkit-input-placeholder { color: #dde0e0; }
				p{
					position: absolute;
					left: 0;
					top: 0;
					width: 100%;
					height: 100%;
					z-index: 1;
				}
			}
		}
		.showSearch{
			// -webkit-transition:all 0.3s linear 0s; 
			// transition:all 0.3s linear 0s; 
			//margin-top: 0;
		}

		.win_bg{
			width: 100%;
			height: 100%;
			position: fixed;
			left: 0;
			top: 0;
			background-color: rgba(0,0,0,0.6);
			z-index: 100;
		}
		.people_change_box{
			position: fixed;
			width: 90%;
			left: 5%;
			top:30%;
			z-index: 100;
			padding: 1rem 0.4rem;
			background-color:#fff;
			.people_dl{
				padding-left: 2rem;
				dt{
					float: left;
					margin-left: -2rem;
					font-size:0.32rem;
					line-height: 0.6rem;
				}
				dd{
					.number_box{
						text-align: center;
						span{
							vertical-align: top;
						}
						.iconfont{
							display: inline-block;
							width: 0.6rem;
							height: 0.6rem;
							line-height: 0.6rem;
							text-align: center;
							border:#1bbc9d solid 1px;
							color: #1bbc9d;
							border-radius:50%;
							margin: 0 0.2rem;
						}
						.people_number{
							display: inline-block;
							line-height: 0.6rem;
							font-size:0.4rem;
							min-width: 0.6rem;
						}

					}
				}
			}
			.people_change_btn{
				margin-top: 1rem;
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
	.activity_list{
		.checkbox_label,.radio_label{
			padding: 0.3rem 0;
			display: block;
			width: 100%;
			.checkbox_box{
				float: left;
				margin-left: -0.34rem;
				
			}
			.checkbox_content,.radio_content{
				padding-left: 0.2rem;
				font-size:0.26rem;
			}
			.checkbox_content{
				display: block;
			}
		}
		.header_search_icon{
			display: none;
		}
		.hideFilterClose{
			.head_back{
				.btn_back{
					display: none;
				}
			}
		}
		.filter_price{
			.slider_box{
				
			}
		}
	}
		
	
	

</style>


<template>
	<div class="activity_list">
		<Head :searchValue="keyword" :showSearch="showHeaderSearch" @searchChange="searchChange" @closeSearch="showHeaderSearch=false"  :nowCurrency="currency" @headCurrency="headCurrencyFn"></Head>

		<div class="fixed_all" id="fixed_all">
			<div class="fixed_box" :class="{filter_fixed:isFixed}">
				<!-- 搜索 -->
				<div class="h_search_top">
					<!-- <span class="btn" @click="listSearch">Search</span> -->
					
					<div class="h_search_input_box" @click="showHeaderSearch=true">
						<input type="text" id="h_search_input" v-model="keyword" placeholder="Attraction, Activity, Destination">
						<i class="iconfont s_input_search">&#xe67a;</i>
						<p></p>
					</div>

					<div class="select_people">
						<!-- {{peopleNum}} People <i class="iconfont">&#xe666;</i> -->
						<select class="select_people_box" v-model="postData.participants" @change="changePeople">
							<option v-for="(item,index) in participantsOptionFn()" :value="item.label">{{item.selectparticipant}}</option>
						</select>
						<i class="iconfont">&#xe666;</i>
					</div>
				</div>
				<!-- participantsAll -->

				<!-- 筛选 -->
				<div class="filter_box">
					<dl class="filter_type clearfix">

						<!-- products -->
						<dd>
							<span class="filter_type_btn" :class="{active:showProducts}" @click="productsFn"><i class="iconfont">&#xe679;</i>Products</span>
							<div class="filter_products" @click="hideFilter" :class="{show_products:showProducts}">
								<checkbox-group v-model="filterCheck.category">
									<ul class="products_list city_list">
										<li :key="index" v-for="(item,key,index) in aggregations[0].items">
											<checkbox :label="key">{{key}} ( {{item}} )</checkbox>
										</li>
									</ul>
								</checkbox-group>
								<div class="products_footer">
									<span class="btn btn_plain" @click="productsClear">Clear</span>
									<span class="btn" @click="productsConfirm">See experiences</span>
								</div>
							</div>
						</dd>

						<!-- filter -->
						<dd><span class="filter_type_btn" @click="filterFn"><i class="iconfont">&#xe668;</i>Filter</span></dd>

						<!-- Rank -->
						<dd><span class="filter_type_btn" :class="{active:showRank}" @click="rankFn"><i class="iconfont">&#xe66b;</i>Rank</span>
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
			</div>
		</div>

		<!-- 筛选结果 -->
		<!-- <div class="requirement_result">
			<span :key="index" v-for="(item,index) in filterTag">{{item}}</span>
		</div> -->
		<div class="destination_result" v-show="activityList.length">{{listdata.records}} {{listdata.records>1?'activities':'activity'}} found </div>
		

		<!-- 产品列表 -->
		<div class="list_box">
			<div class="noListData" v-show="!activityList.length">
				<p>No offerings that match your interests are found.You can try to modify your screening conditions.</p>
			</div>
			<ul class="list_ul" v-show="activityList.length">
				<li :key="index" v-for="(item,index) in activityList">
					<a :href="'/activity/details/'+item.activityId">
						<div class="list_img" v-lazy:background-image="item.coverPhotoUrl">
							<p>{{item.category}}</p>
						</div>
						<div class="list_content">
							<h4>
								<span class="tag_private" v-if="item.groupType=='Private'">{{item.groupType}}</span>
								<span class="tag_group" v-if="item.groupType=='Group'">{{item.groupType}}</span>
								{{item.title}}</h4>
							<div class="list_tag" v-html="item.attractions?tourTypesStr(item.attractions):tourTypesStr(item.tourTypes)">
								<!-- <span :key="index" v-for="(item,index) in item.tourTypes">"{{item}}"</span> -->
							</div>
							
							<p class="destination"><b>{{item.destinations&&item.destinations.length>1?'Destinations':'Destination'}}:</b>{{item.destinations.join(' & ')}}</p>

							<p class="duration"><b>Duration:</b>{{item.duration}} {{toLower(item.durationUnit)}}</p>
							
							<!-- <div class="sales">
								Booked by {{item.sales}} travelers (last 30 days)
							</div> -->
							<div class="price_box clearfix">
								<span class="list_price">{{!postData.participants?'From ':''}}
									{{currency.code}}<b>{{currency.symbol}}{{postData.participants?item.perPersonPrice:item.bottomPrice}}</b>{{postData.participants?(postData.participants==1?'for 1 person':'pp for party of '+postData.participants):'pp'}}
								</span>
								<p v-if="item.sales">Booked {{item.sales}} {{item.sales>1?'times':'time'}} (last 30 days)</p>
							</div>
						</div>
					</a>
				</li>
			</ul>
			<infiniteLoading class="list_loading" @infinite="infiniteHandler">
				<span>You've reached the bottom of the page.</span>
				<span class="no-results"></span>
			</infiniteLoading>
		</div>
		
		<Foot></Foot>

		<!-- 筛选 -->
		<div class="filter_dialog" :class="{show_filter:showFilter,hideFilterClose:hideFilterClose}">
			<Back title="Filter" type="close" :close="filterClose">
				<span class="filter_clear" @click="filterClear" v-show="showClear">Clear</span>
			</Back>
			<div class="filter_content">
				<dl>
					<dt>Price / Person</dt>
					<dd>
						<div class="filter_price" v-if="currency.code=='CNY'">
							<slider v-model="sliderValue" max="3030" maxTipValue="3000+" step="30"></slider>
							<div class="filter_price_text"><span class="price_max">{{currency.symbol}}{{sliderValue[1]>3000?'3000+':sliderValue[1]}}</span>{{currency.symbol}}{{sliderValue[0]>3000?'3000+':sliderValue[0]}}</div>
						</div>
						<div class="filter_price" v-else-if="currency.code=='JPY'">
							<slider v-model="sliderValue" max="50500" maxTipValue="50000+" step="500"></slider>
							<div class="filter_price_text"><span class="price_max">{{currency.symbol}}{{sliderValue[1]>50000?'50000+':sliderValue[1]}}</span> {{currency.symbol}}{{sliderValue[0]>50000?'50000+':sliderValue[0]}}</div>
						</div>
						<div class="filter_price" v-else>
							<slider v-model="sliderValue" max="505" maxTipValue="500+" step="5"></slider>
							<div class="filter_price_text"><span class="price_max">{{currency.symbol}}{{sliderValue[1]>500?'500+':sliderValue[1]}}</span>{{currency.symbol}}{{sliderValue[0]>500?'500+':sliderValue[0]}}</div>
						</div>
					</dd>
				</dl>
				<dl :key="index" v-for="(item,index) in aggregations" v-if="getObjLength(item.items)>1&&item.items && item.type !='CATEGORY'">
					<dt>{{getFilterType(item.type)}}</dt>
					<dd v-if="item.type=='DURATION'">
						<checkbox-group v-model="filterCheck.duration">
							<checkbox :change="filterChange" :key="index2" v-for="(itemType,key,index2) in item.items" :label="key">{{getDayStr(key)}}( {{itemType}} )</checkbox>
						</checkbox-group>
						<span class="filter_more" @click="showMore" v-if="getObjLength(item.items)>6">View More</span>
					</dd>
					<dd v-else>
						<checkbox-group v-model="filterCheck[toLower(item.type)]">
							<checkbox :change="filterChange" :key="index2" v-for="(itemType,key,index2) in item.items" :label="key">{{key}} ( {{itemType}} )</checkbox>
						</checkbox-group>
						<span class="filter_more" @click="showMore" v-if="getObjLength(item.items)>6">View More</span>
					</dd>

				</dl>
			</div>

			<div class="filter_dialog_footer">
				<span class="btn" @click="filterConfirm">Apply</span>
			</div>
		</div>

		<Loading :loadingStatus="loadingStatus"></Loading>
		 <!-- <Talk :zendeskStatus="zendeskStatus" @getShowZendesk="setShowZendesk"></Talk> -->

		<!-- <a @click="chat" class="btn inquire">Inquire</a> -->
		<a href="/info/feedback/" class="btn inquire">Inquire</a>
		
	</div>
</template>
<script>

	import Head from '~/components/header/index'
	import Back from '~/components/header/back'
	import Foot from "~/components/footer/index"
	import {checkboxGroup,checkbox} from "~/plugins/panda/checkbox/"
	import {radioGroup,radio} from "~/plugins/panda/radio/"
	import slider from "~/plugins/panda/slider/"
	import infiniteLoading from '~/plugins/panda/infiniteLoading/'
	import Loading from "~/components/plugin/Loading"
	// import Talk from '~/components/booking/talk'

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
			radio,
			slider,
			infiniteLoading,
			Loading,
			// Talk
		},
		async asyncData({
			route,
			router,
			apiBasePath,
			req
		}) {

			var params = route.params;
			//当前城市
			var loc = params.slug ? params.slug : 'china';

			//目的地
			var city = ['Shanghai','Beijing','Chengdu','Xi\'an','Guilin'];
			
			//接口默认数据
			var listdata = {};

			//获取url数据
			var query = route.query;
			var options = query.options ? JSON.parse(query.options) : '';
			var sort = query.sort ? JSON.parse(query.sort) : '';
			var keyword = query.keyword ? query.keyword : '';
			var gaType = query.type ? query.type : 'direct';
			//如果什么条件都没有则默认北京的数据
			var isAll = (loc.toLowerCase() =='china' && !options && !keyword);

			if(isAll){
				loc = 'Beijing';
			}

			if(keyword){
				loc = keyword;
			}
			//默认请求接口post的数据
			var postData = {
				keyword:loc=='Xian'?"Xi'an":loc,
				pageNum:1,
				pageSize:10,
				sort:{"type":"SCORE"},
				participants: 0,
				currency:'USD',
				type: gaType
			};
			
			
			//获取页面cookie
			var userCookie = {};
			if(req){
				var cookie = req.headers.cookie;
				if(cookie){
					var cookieArr = cookie.split(';');
					for(var i=0;i<cookieArr.length;i++){
						var thisCookie = cookieArr[i].split('=');
						userCookie[thisCookie[0].trim()] = (thisCookie[1]||'').trim();
					}
				}
			};

			
			var participants = 0
			var currency = {code: "USD", symbol: "$", exchangeRate: 1};
			if(userCookie.currency){
				currency = JSON.parse(decodeURIComponent(userCookie.currency));
				postData.currency = currency.code;
			}
			
			if(userCookie.participants){
				postData.participants=JSON.parse(decodeURIComponent(userCookie.participants));
			}
			//兼容老的key，老key转为新key
			var oldType = function(text){
				if(text=='TOURTYPE'){
					return 'TOUR_TYPE';
				}else if(text=='DURATIONS'){
					return 'DURATION';
				}
				return text;
			};
			
		

			//兼容老的key，新key转为老key
			var oldTypeKey = function(text){
				if(text=='tour_type'){
					return 'tourtype';
				}else if(text=='duration'){
					return 'durations';
				}
				return text;
			};

			var price = [0,505];

			if(currency.code=='CNY'){
				price = [0,3030];
			}else if(currency.code=='JPY'){
				price = [0,50500];
			}
			
			
			//根据url数据生成post需要的格式
			var postFilters = [];
			for(var key in options){
				var keyUpper = key.toUpperCase();
				if(keyUpper=='PRICE'){
					if(currency.code == "CNY"){
						if(options[key].maxValue>3000){
						postFilters.push({
							type: keyUpper,
							minValue: options[key].minValue
						});
						}else{
							postFilters.push({
								type: keyUpper,
								minValue: options[key].minValue,
								maxValue: options[key].maxValue
							});
						}	
					}else if(currency.code == "JPY"){
						if(options[key].maxValue>50000){
						postFilters.push({
							type: keyUpper,
							minValue: options[key].minValue
						});
						}else{
							postFilters.push({
								type: keyUpper,
								minValue: options[key].minValue,
								maxValue: options[key].maxValue
							});
						}	
					}else{
						if(options[key].maxValue>500){
							postFilters.push({
								type: keyUpper,
								minValue: options[key].minValue
							});
						}else{
							postFilters.push({
								type: keyUpper,
								minValue: options[key].minValue,
								maxValue: options[key].maxValue
							});
						}
					}
					
					
					//设置默认价格区间
					price = [options[key].minValue,options[key].maxValue];

				}else{
					postFilters.push({
						type: oldType(keyUpper),//兼容老的字段
						filterValues: options[key]
					});
				}
				
			};

			
			//价格区间
			// var price = {
			// 	minValue : options.price.minValue,
			// 	maxValue : options.price.maxValue
			// };

			//如果有筛选数据,则在默认数据里添加上filters
			if(options){
				postData.filters = postFilters;
			};

			//如果有排序数据,则在默认数据里修改sort
			if(sort){
				postData.sort = sort;
			}
			let obj = Object.assign({}, postData);
			//处理调用select 人数
			if(obj.participants==0){
				delete obj.participants
			}
			//console.log(postData);
			try{
				listdata = await Vue.axios.post(apiBasePath + "search/activity", JSON.stringify(obj), {
					headers: {
						'Content-Type': 'application/json'
					}
				})
			}catch(err){};

			//列表页数据
			var data = listdata.data;
			//console.log(obj)
			//console.log(data);

			//根据接口数据，生成需要筛选的类型默认数据和默认filter数据
			var filterAll = {},
				filterCheck = {};
			//人数
			var participantsAll = {};
			

			if(data.aggregations && data.records){
				data.aggregations.forEach(item => {
					var thisFilter = [];
					for(var key in item.items){
						thisFilter.push(key);
					}
					//当前类型
					var thisType = item.type.toLowerCase();
					if(item.items){
						filterAll[thisType] = thisFilter;  ////添加filter每种类型数据
					};

					//人数选择
					if(thisType == 'min_participants'){
						participantsAll['minValue'] = item.value;
					}else if(thisType == 'max_participants'){
						participantsAll['maxValue'] = item.value;
					}
					
					//检测url是否有老的筛选类型
					if(options[oldTypeKey(thisType)]){
						filterCheck[thisType] = options[oldTypeKey(thisType)];
					}else{
						filterCheck[thisType] = options[thisType] ? options[thisType] : []; //添加filter每种类型默认check数据
					}
				});
			}

			//默认排序数据
			var rankCheck = 'Recommended';
			if(sort){
				if(sort.type=='PRICE' && sort.reverse == true){
					rankCheck = 'Price :High to Low';
				}else if(sort.type=='PRICE' && sort.reverse == false){
					rankCheck = 'Price :Low to High';
				}else if(sort.type=='SALES'){
					rankCheck = 'Popularity';
				}
			}

			
			//检测是否有filter的check数据，除去Products（category）。用于默认是否显示clear
			var hasFilterCheck = (function(){
				var hasNum = 0;
				for(var key in options){
					if(key!='category'){
						hasNum++;
					}
				}
				return hasNum;
			}());
			

			var locNew = (loc=='Xian'?'Xi\'an':loc);
			if(locNew.toLowerCase()=='china'){
				locNew = '';
			}


			//console.log(participantsAll);

			//设置默认价格
			filterCheck.price = {
				minValue: price[0],
				maxValue: price[1]
			}


			return {
				listdata: data,
				activityList: data.entities?data.entities:[],
				apiBasePath: apiBasePath,
				postData: postData,
				keyword: keyword?keyword:locNew,
				defaultKeyword: keyword?keyword:locNew,
				query: query,

				//切换币种
				currency:currency,

				cityCheck:loc,
				city: city,
				showCity:false,

				productsCheck:[],   //打钩的值
				products:[],
				showProducts:false, 

				filterCheck:filterCheck,
				filterCheckDefault: filterCheck,
				filter: filterAll,
				showFilter: false,
				hideFilterClose: false,

				rankCheck: rankCheck,
				rank:['Recommended','Price :Low to High','Price :High to Low','Popularity'],
				showRank:false,

				isFixed:false,
				fixedShowSearch:true,
				loadingStatus: false,
				showClear: hasFilterCheck?true:false,

				showHeaderSearch: false,
				participantsOption:[
					{
						selectparticipant:'Travelers',
						label:0

					},
					{
						selectparticipant:'1 person',
						label:1
					},
					{
						selectparticipant:'2 people',
						label:2

					},
					{
						selectparticipant:'3 people',
						label:3

					},
					{
						selectparticipant:'4 people',
						label:4

					},
					{
						selectparticipant:'5 people',
						label:5

					},
					{
						selectparticipant:'6 people',
						label:6

					},
					{
						selectparticipant:'7 people',
						label:7

					},
					{
						selectparticipant:'8 people',
						label:8

					},
					{
						selectparticipant:'9 people & more',
						label:9

					},
				],




				participantsAll:participantsAll,
				peopleNum: 0,

				//price: price,
				defaultPrice: price,
				sliderValue: price,
				zendeskStatus:false
			}
		},
		computed:{
			//渲染选中标签
			filterTag:function(){
				var allTag = [];
				for(var key in this.filterCheck){
					var thisArr = this.filterCheck[key];
					//处理duration数组的天数显示
					if(key == 'duration'){
						thisArr = thisArr.map(item=>{
							return this.getDayStr(item); //调用数字转天数得方法，重写数组
						})
					}
					//把所有标签的数组连接到一个数组里
					allTag = allTag.concat(thisArr);
				}
				return allTag;
			},
			//获取指定顺序的数据
			aggregations:function(){
				//获取默认数据
				var aggregations = this.listdata.aggregations;

				//设置自定义顺序
				var sortDefault = {
					'PRICE':2,
					'CATEGORY':1,
					'GROUP_TYPE':3,
					'ATTRACTION':4,
					'DURATION':5,
					'TOUR_TYPE':6,
					'CITY': 6
				};

				var newAggregations = [];
				//给数据添加排序的序号
				for(var i=0;i<aggregations.length;i++){
					var thisType = aggregations[i].type;
					var thisNum = sortDefault[aggregations[i].type];
					aggregations[i].number = thisNum ? thisNum : 10; //没有的字段默认设置顺序为10

					if(typeof sortDefault[thisType] !== 'undefined'){
						newAggregations.push(aggregations[i]);
					}
				};

				//排序
				newAggregations = newAggregations.sort(function(a,b){
					return a.number > b.number;
				});

				return newAggregations;
			}
		},
		methods: {
			isWork(){
				//获取东八区时区
				var nowDate = this.getLocalTime(8),
					nowHour = nowDate.getHours();
					console.log(nowHour)
					console.log(this.getLocalTime(8))
				if(nowHour>=9 && nowHour<20){
					return true;
				};
				return false;
			},
			   //得到标准时区的时间的函数
			getLocalTime(i) {
				//参数i为时区值数字，比如北京为东八区则输进8,西5输入-5
				if (typeof i !== 'number') return;
				var d = new Date();
				//得到1970年一月一日到现在的秒数
				var len = d.getTime();
				//本地时间与GMT时间的时间偏移差
				var offset = d.getTimezoneOffset() * 60000;
				//得到现在的格林尼治时间
				var utcTime = len + offset;
				return new Date(utcTime + 3600000 * i);
			},
			chat(){
				if(this.isWork()){
					this.zendeskStatus=true;
					document.documentElement.scrollTop=0;
					history.pushState({
						'type': 'showlistChat'
					}, '');
				}else{
					location.href="/info/feedback/"
				}
				
			},
			setShowZendesk(val){
				this.zendeskStatus=val
				history.back()
			},
			participantsOptionFn(){
				var participants=this.participantsOption,
				minParticipants=this.participantsAll.minValue,
				maxParticipants=this.participantsAll.maxValue;
				var newParticipants=[];
				for(var i = 1;i<participants.length;i++){
					if(participants[i].label>=minParticipants&&participants[i].label<=maxParticipants){
						newParticipants.push(participants[i])
					}
				}
				newParticipants.unshift({
					selectparticipant:'Travelers',
					label:0
				})
				
				return newParticipants;
			},

			hideFilter(e){
				var isBg = /filter_products/.test(e.target.className);
				if(isBg){
					this.showProducts = false;
					this.showRank = false;
				}
			},

			//products相关
			productsFn(){
				//显示Products
				this.showProducts=!this.showProducts;
				//隐藏排序弹窗
				this.showRank = false;
			},
			productsClear(){
				//GA统计
				this.ga('click','products_clear');

				//清空数据
				this.filterCheck.category = [];
				//跳转url
				this.jumpUrl();
			},
			//products确定选择
			productsConfirm(){
				//GA统计
				this.ga('click','products_apply');
				//记录加载页面后是否需要Ga统计
				localStorage.setItem('listGa','true');
				
				this.jumpUrl();
			},


			//filter相关
			filterFn(){
				this.showFilter=!this.showFilter;	
				this.showProducts= false;
				this.showRank = false;

				//浏览器弹窗后，添加一个新页面记录。
				history.pushState({
					'type':'showDialog'
				},'');

				if(this.showFilter){
					//GA统计
					this.ga('filter','filter_open');
				}
			},
			filterClose(){
				this.showFilter = false;
				//GA统计
				this.ga('filter','filter_close');

				//恢复check状态
				this.filterCheck = JSON.parse(JSON.stringify(this.filterCheckDefault));

				this.sliderValue = this.defaultPrice;

				//关闭后退浏览器
				history.back()
			},
			//确定选择
			filterConfirm(){
				//GA统计
				this.ga('filter','filter_apply');
				//记录加载页面后是否需要Ga统计
				localStorage.setItem('listGa','true');

				this.jumpUrl();
				this.loadingStatus = true;
			},
			filterClear(){
				//GA统计
				this.ga('filter','filter_clear');
				//清空数据
				for(var key in this.filterCheck){
					//只清Products地以外的数据
					if(key!='category'){
						this.filterCheck[key] = [];
					}
					
				}
				//跳转url
				this.jumpUrl();
				this.loadingStatus = true;
			},

			//筛选的时候触发函数
			filterChange(e){
				var that = this;

				//检测是否显示filter里的clear，由于选中时组件通信有延迟，所以在定时器里执行。
				setTimeout(function(){
					var filterLen = 0;
					var nowCheck = that.filterCheck;

					//判断当前的check数据，并且除去Products的数据，Products数据是单独的clear
					for(var key in nowCheck){
						if(nowCheck[key].length && key!='category'){
							filterLen++;
						};
					}

					//除了Products（category）的数据，还有数据则显示clear
					if(filterLen){
						that.showClear = true;
						//隐藏关闭按钮
						//that.hideFilterClose = true;
					}else{
						if(that.sliderValue[0] == 0 && that.sliderValue[1]==505){
							that.showClear = false;
						}
						
						//隐藏关闭按钮
						//that.hideFilterClose = false;
					}

					
				},200);
				
			},

			//rank相关
			rankFn(){
				this.showRank=!this.showRank;	
				this.showProducts= false;
			},
			//切换排序
			rankChange(e){
				var thisValue = e.target.value;
				this.rankCheck = thisValue;

				/* GA 排序统计  start */
				var gaLabel = 'score';
				if(thisValue=='Price :Low to High'){
					gaLabel = 'price_up';
				}else if(thisValue=='Price :High to Low'){
					gaLabel = 'price_down';
				}else if(thisValue=='Popularity'){
					gaLabel = 'popularity';
				};
				this.ga('sort',gaLabel);
				/* GA 排序统计  end */
				
				this.jumpUrl();
				this.loadingStatus = true;
			},
			
			//切换城市
			cityChange(e){
				var isNew = /\/new\//.test(location.href);
				location.href = '/activity/list/'+(isNew?'new/':'') + (e.target.value=="Xi'an"?'Xian':e.target.value);
				//this.productsFn();
				this.loadingStatus = true;
			},
			

			
			

			//跳转刷新
			jumpUrl(){

				//获取当前路径
				var path = this.$route.path;
				//获取当前选中的数据
				var filterCheck = this.filterCheck;
				//获取rank对象
				var rankCheck = this.rankCheck;
				
				//默认跳转数据
				var jumpData = {
					options:{},
					sort:{},
					keyword:this.keyword
				}

				//设置当前排序数据
				if(rankCheck=='Price :Low to High'){
					jumpData.sort = JSON.stringify({"type":"PRICE","reverse":false})
				}else if(rankCheck=='Price :High to Low'){
					jumpData.sort = JSON.stringify({"type":"PRICE","reverse":true})
				}else if(rankCheck=='Popularity'){
					jumpData.sort = JSON.stringify({"type": "SALES"})
				}

				//人数
				// if(this.peopleNum!=2){
				// 	jumpData.participants = this.peopleNum;
				// }

				//去掉空数据,并对跳转的数据排序，把需要的数据放在新的options里
				var options = {};
				for(var key in filterCheck){
					if(filterCheck[key].length){
						options[key] = filterCheck[key].sort();
					}else if(key=='price' && !Array.isArray(filterCheck[key])){
						if(this.postData.currency=="CNY"){
							if(filterCheck[key].minValue!=0 || filterCheck[key].maxValue!=3030){
								options[key] = filterCheck[key];
							}	
						}else if(this.postData.currency=="JPY"){
							if(filterCheck[key].minValue!=0 || filterCheck[key].maxValue!=50050){
							options[key] = filterCheck[key];
							}
						}else{
							if(filterCheck[key].minValue!=0 || filterCheck[key].maxValue!=505){
								options[key] = filterCheck[key];
							}
						}
						
						
					}
				}

				

				//设置当前筛选数据，并对数据做转码操作
				jumpData.options = encodeURIComponent(JSON.stringify(options));

				//检测是否有某个筛选项，并对有效的筛选项做url连接
				var urlQuery = this.getUrlQuery(jumpData);
				window.name = "aa";
				//有数据则跳转
				location.href = '/activity/list/China' + (urlQuery ? ('?' + urlQuery) : '');

				//var hasOptions = JSON.stringify(options)!='{}';
				//location.href = path + (hasOptions?'?options=' + optionsEncode:'') + (sort?(hasOptions?'&':'?')+'sort='+JSON.stringify(sort):'');

			},
			getUrlQuery(jumpData){
				var urlQuery = '';
				for(var key in jumpData){
					//检测有效数据
					if(JSON.stringify(jumpData[key]) != '{}' && jumpData[key] != '%7B%7D' && jumpData[key] != ''){
						urlQuery += '&' + key + '=' + jumpData[key];
					}
				};
				return urlQuery.substring(1); //去掉第一个&
			},
			hideBodyScroll(){
				document.getElementsByTagName('html')[0].style.overflowY = 'hidden';
				document.getElementsByTagName('body')[0].style.overflowY = 'hidden';
			},
			showBodyScroll(){
				document.getElementsByTagName('html')[0].style.overflowY = 'inherit';
				document.getElementsByTagName('body')[0].style.overflowY = 'inherit';
			},

			showMore(e){
				var thisMore = e.target;
				var thisGroupBox = thisMore.parentNode.querySelectorAll('.checkbox-group')[0];

				if(thisMore.innerHTML=='View More'){
					thisGroupBox.style.maxHeight = 'initial';
					thisMore.innerHTML = 'View Less';
				}else{
					thisGroupBox.style.maxHeight = '5.8rem';
					thisMore.innerHTML = 'View More';
				}
				

				
			},

			
			toLower(text){
				return text.toLowerCase();
			},
			getDayStr(text){
				if(text==0){
					return 'Half Day';
				}else if(text==1){
					return text+' Day';
				}
				return text+' Days';
			},
			getObjLength(obj){
				var thisObjLength = 0;
				for(var key in obj){
					thisObjLength++;
				}
				return thisObjLength;
			},
			getFilterType(type){
				var typeStr = '';
				switch(type){
					case 'DURATION': typeStr = 'Duration'; break;
					case 'GROUP_TYPE': typeStr = 'Service Type'; break;
					case 'TOUR_TYPE': typeStr = 'Themes'; break;
					case 'ATTRACTION': typeStr = 'Points of Interest'; break;
					case 'CATEGORY': typeStr = 'Products'; break;
					case 'CITY': typeStr = 'DESTINATIONS COVERED'; break;
					//case 'PRICE': typeStr = 'Price / person for party of '+this.peopleNum; break;
				};
				return typeStr ? typeStr : type;
			},
			tourTypesStr(arr){
				// var str = '';
				// if(!arr){
				// 	return str;
				// }
				// for(var i=0;i<arr.length;i++){
				// 	str += '"'+arr[i]+'"　';
				// }
				return arr ? arr.join(' <b>·</b> ') : '';
			},
			infiniteHandler($state){
				var that = this;
				
				//修改翻页数量
				this.postData.pageNum++;
				let obj = Object.assign({},this.postData);
				//处理调用select 人数
				if(obj.participants==0){
					delete obj.participants
				}
				//请求数据
				this.axios.post(that.apiBasePath + "search/activity", JSON.stringify(obj), {
					headers: {
						'Content-Type': 'application/json; charset=UTF-8'
					}
				}).then(function(response) {
					if(response.data.entities&&response.data.entities.length) {
						that.activityList=that.activityList.concat(response.data.entities)
						$state.loaded();
					}else{
						 $state.complete();
					}
				}, function(response) {
					$state.complete();
				})
			},
			ga(action,label){
				ga('gtag_UA_107010673_2.send', {
					hitType: 'event',
					eventCategory: 'activity_list',
					eventAction: action,
					eventLabel: label
				});
			},

			//头部搜索change回调
			searchChange(value){
				this.keyword = value;
			},
			listSearch(){
				this.jumpUrl();
			},

			//选择人数
			peopleMinus(e){
				this.peopleNum--;
				var minLen = 1;
				if(this.peopleNum <= minLen){
					e.target.style.opacity = 0.5;
					this.peopleNum = minLen;
				}else{
					e.target.parentNode.getElementsByClassName('btn_plus')[0].style.opacity = 1;
				}
			},
			peoplePlus(e){
				this.peopleNum++;
				var maxLen = 20;
				if(this.peopleNum >= maxLen){
					e.target.style.opacity = 0.5;
					this.peopleNum = maxLen;
				}else{
					e.target.parentNode.getElementsByClassName('btn_minus')[0].style.opacity = 1;
				}
			},
			changePeople(e){
				//this.showPeopleBox=false;
				this.peopleNum = e.target.value;
				var urlObj = this.$route.query;
				urlObj.participants = this.peopleNum;
				Cookie.set('participants',this.postData.participants,{path:'/','expires':30})
				var urlQuery = this.getUrlQuery(urlObj);

				//有数据则跳转
				location.href = '/activity/list/China' + (urlQuery ? ('?' + urlQuery) : '');
				this.loadingStatus = true;

			},

			showPrice(value){
				return value
			},
			headCurrencyFn(currency){
				
				var that = this;
				
				//修改翻页数量
				//this.postData.pageNum = 1;
				this.postData.currency = currency.code;

				
				//console.log(filterCheck);

				//重置价格区间
				var filterCheck = this.filterCheck;
				for(var key in filterCheck){
					if(key=='price'){
						delete filterCheck[key];
					}
				}
				
				this.jumpUrl();
				
				//请求数据
				// this.axios.post(that.apiBasePath + "search/activity", JSON.stringify(this.postData), {
				// 	headers: {
				// 		'Content-Type': 'application/json; charset=UTF-8'
				// 	}
				// }).then(function(response) {
				// 	if(response.data.entities&&response.data.entities.length) {
				// 		that.currency = currency;
				// 		that.activityList= response.data.entities;

				// 		var price = [0,505];
				// 		if(currency.code=='CNY'){
				// 			price = [0,3030];
				// 		}else if(currency.code=='JPY'){
				// 			price = [0,50500];
				// 		}
				// 		that.sliderValue = price;
				// 	}else{
						 
				// 	}
				// }, function(response) {
					
				// })
			}
			
		},
		watch: {
			showProducts:function(value){
				if(value){
					this.hideBodyScroll();
				}else{
					this.showBodyScroll();
					//恢复check状态
					this.filterCheck = JSON.parse(JSON.stringify(this.filterCheckDefault));
				}
			},
			showFilter:function(value){
				if(value){
					this.hideBodyScroll();
				}else{
					this.showBodyScroll();
				}
			},
			showRank:function(value){
				if(value){
					this.hideBodyScroll();
				}else{
					this.showBodyScroll();
				}
			},
			sliderValue:function(value){
				this.filterCheck.price = {
					minValue: value[0],
					maxValue: value[1]
				}
				this.showClear = true;
				//隐藏关闭按钮
				//this.hideFilterClose = true;
			}
		},
		mounted: function() {
			var self = this;
			//filter统计ga   start  ///////////////////////////////////////////
			var listGa = localStorage.getItem('listGa');
			//延迟执行防止ga组件没加载完毕
			setTimeout(function(){
				if(listGa){
					for(var key in self.filterCheck){
						var thisArr = self.filterCheck[key];
						//check的类型有数据则统计这个类型的ga
						if(thisArr.length){
							self.ga('filter',key);
						}
					}
				}
				//干掉ga触发，这个在点击的时候才开启触发，从新加载页面统计过后，干掉触发条件
				localStorage.removeItem('listGa');
			},900);
			//filter统计ga   end  ///////////////////////////////////////////


			//返回页面的时候币种不一致 就刷新页面
			var nowCurrency = JSON.parse(Cookie.get('currency'));
			if(nowCurrency && nowCurrency.code != this.currency.code){
				location.reload();
			}

			// if(window.name != "aa"){
			// 	//location.reload();
			// 	window.name = "aa";
			// }else{
			// 	window.name = "";
			// }
			document.querySelector('.select_people_box option').setAttribute('hidden','hidden')
			
			//筛选悬浮
			// var filterBox = document.getElementById('fixed_all'),
			// 	h_search_H = document.querySelectorAll('.h_search_top')[0].clientHeight,
			// 	filterBoxTop = filterBox.offsetTop + h_search_H;
			// var oldY = 0;
			// window.addEventListener("scroll", (e)=>{
				
			// 	//向上滑动
			// 	if(scrollY<oldY){
			// 		this.fixedShowSearch = true;
			// 		if(scrollY<filterBoxTop - h_search_H){
			// 			this.isFixed=false;
			// 		}else{
			// 			this.isFixed=true;
			// 		}
			// 	}else if(scrollY>filterBoxTop){
			// 		this.isFixed=true;
			// 		this.fixedShowSearch = false;
			// 	}
			// 	oldY = scrollY;
				
			// });

			var filterBox = document.getElementById('fixed_all');
			window.addEventListener("scroll", (e)=>{
				if(scrollY<filterBox.offsetTop){
					this.isFixed=false;
				}else{
					this.isFixed=true;
				}
				
			});

			//浏览器事件处理
			window.onpopstate = function(event) {
				if(self.showFilter){
					self.showFilter = false;
				}
				if(self.zendeskStatus){
					self.zendeskStatus=false
				}
			};
			
		},
		head() {
			let keyword = this.defaultKeyword ? this.defaultKeyword : 'China';

			let pageTdk = {
				title: 'All China {{keyword}} Trips | {{keyword}} Activities and Experiences | {{keyword}} Tours',
				description: 'Browse top {{keyword}} experiences, {{keyword}} tours, {{keyword}} trips, {{keyword}} travel, {{keyword}} guides, and other China trips, led by local experts.',
				keywords: 'China {{keyword}}, {{keyword}} trips, {{keyword}} tours, {{keyword}} day tours, {{keyword}} day trips, {{keyword}} city tours, {{keyword}} walking tours, {{keyword}} landmarks, {{keyword}} attractions, {{keyword}} highlights.'
			};

			
			var isDestination = function(str){
				//视为目的地的关键词
				var destination = ['shanghai','beijing','chengdu','xi\'an','guilin','china'];
				for(var i=0;i<destination.length;i++){
					if(destination[i]==str.toLowerCase()){
						return true;
					}
				}
				return false;
			};

			//检测是否目的地
			if(isDestination(keyword)){
				pageTdk = {
					title: 'The Top {{keyword}} Trips | {{keyword}} Local Activities and Experiences | {{keyword}} Tours',
					description: 'Best Things to do in {{keyword}}, {{keyword}} tours, {{keyword}} trip, {{keyword}} travel, {{keyword}} tour packages, {{keyword}} guide, China tours',
					keywords: 'See top things to do in {{keyword}}, including {{keyword}} city tours, {{keyword}} walking tours, {{keyword}}history & culture tours, and {{keyword}} food tours. Visit the bund {{keyword}} with our local China tour guides.'
				};
			}
			

			return {
				title: pageTdk.title.replace(/{{keyword}}/g,keyword),
				meta: [{
						hid: "keywords",
						name: "keywords",
						content: pageTdk.keywords.replace(/{{keyword}}/g,keyword)
					},
					{
						hid: "description",
						name: "description",
						content: pageTdk.description.replace(/{{keyword}}/g,keyword)
					}
				]
			};
		},
	}
</script>

