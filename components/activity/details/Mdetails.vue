<template>
	<div class="m-details">
		<div class="m-details-cont">
			<div class="toursType ">{{detail.category}}</div>
			<div class="activitiyTitle">
				<h3>{{detail.title}}</h3>
				<div class="types">
					<a :href="returnUrl(i)" v-for="i in detail.tourTypes">{{i}}</a>
				</div>
			</div>

			<div class="price">
				<div class="picRate">
					<select class="currency_type" id="changeCurrency" @change="changeCurrency" v-model="defaultCurrency">
						<option :value="item.code" v-for="item in exchange" :key="item.code">{{item.code}}</option>
					</select>
					<span class="iconfont">&#xe666;</span>
				</div>
				<div class="picinfo">
					<p v-if="picInfo.originalPrice">From <span class="oldpic">{{nowExchange.symbol}} {{returnFloat(picInfo.originalPrice)}}</span></p>
					<p> <b>{{nowExchange.symbol}} {{returnFloat(picInfo.bottomPrice)}}</b> pp</p>
				</div>
			</div>

			<div class="toursMessage">
				<ul>
					<li class="clearfix">
						<label class="iconfont">&#xe653;</label>
						<span>Mode: {{detail.trafficType}}</span>
					</li>
					<li class="clearfix">
						<label class="iconfont">&#xe610;</label>
						<span>Location: {{destinations}}</span>
					</li>
					<li class="clearfix">
						<label class="iconfont">&#xe624;</label>
						<span>Duration: {{detail.duration}} {{detail.durationUnit|firstUpperCase}}</span>
					</li>
					<li class="clearfix">
						<label class="iconfont">&#xe627;</label>
						<span>Languages: English, French, Spanish, Russian, German, Japanese, Korean</span>
					</li>
					<li class="clearfix">
						<label class="iconfont">&#xe652;</label>
						<span v-if="picInfo.minParticipants==picInfo.maxParticipants">Participants: {{picInfo.minParticipants}}</span>
						<span v-else>Participants: {{picInfo.minParticipants}} - {{picInfo.maxParticipants}}</span>
					</li>
				</ul>
			</div>
			<p class="says">{{detail.recommendedReason}}</p>
			<div class="heightLights" id="heightLights">
				<p :key="index" class="clearfix" v-for="(item,index) in highlights"><i class="iconfont">&#xe654;</i><span>{{item}}</span></p>
			</div>
			<div class="journey" id="journey" ref="journey">
				<div class="expect">
					<h3 class="expect-title">What You Can Expect</h3>
					<div class="introduction" :class="{'show':isShowMore}">
						<p :key="index" v-for="(j,index) in introduction">{{j}}</p>
						<ul>
							<li :key="index" v-for="(i,index) in detail.itineraries">
								<div class="item_v clearfix">
									<div class="contTitle">
										<h3>{{i.title}}</h3>
										<p>{{i.description}}</p>
									</div>
									<div class="cont" v-if="i.photoUrl">
										<img v-lazy="i.photoUrl" />
									</div>
								</div>
							</li>
						</ul>
					</div>
					
				</div>
			</div>
			 <div class="notes" v-if="photoList.length>0" @click="showPhoto" id="photoList">
					<h3>Pictures of our travelers</h3>
					<div class="photoCover" v-lazy:background-image="photoList.length>0?photoList[0].url:''">
						<div class="mask"></div>
						<div class="cover">
							<h4>Check out our customers' travel experiences with us!</h4>
							<button>Have a look</button>
						</div>
					</div>

				</div>
			<div class="provide" v-if="picInfo.details.length>0" id="picDetails">
					<h3>Price Details</h3>
					<p class="childDiscount" v-if="picInfo.childDiscount">Children's price is  {{nowExchange.symbol}}  {{returnFloat(picInfo.childDiscount)}}  {{nowExchange.code}}  less than adults' price.</p>

					<table class="price_list">
						<tr>
							<th>No. of people</th>
							<th>Total cost</th>
							<th>Price per person</th>
						</tr>
						<tr :key="index" v-for="(item,index) in sixArr">
							<td>
								<span v-if="item.capacity==1">1 person</span>
								<span v-else>{{item.capacity}} people</span>
							</td>
							<td><span>{{nowExchange.symbol}} {{returnFloat(item.price)}} {{nowExchange.code}}</span></td>
							<td>
								<div v-show="item.capacity">
									<span>{{nowExchange.symbol}} {{returnFloat(item.price/item.capacity)}} {{nowExchange.code}}</span>
								</div>
							</td>
						</tr>
					</table>



					<!-- <el-table :data="sixArr" stripe style="width: 100%">
						<el-table-column prop="capacity" label="No. of people"  align="center">
							<template slot-scope="scope">
								<span v-if="scope.row.capacity==1">1 person</span>
								<span v-else>{{scope.row.capacity}} people</span>
							</template>
						</el-table-column>
						<el-table-column prop="price" label="Total cost" align="center">
							<template slot-scope="scope">
								<span>{{nowExchange.symbol}} {{returnFloat(scope.row.price)}} {{nowExchange.code}}</span>
							</template>
						</el-table-column>
						<el-table-column prop="childenTotal" label="Price per person"  align="center">
							<template slot-scope="scope">
								<div v-show="scope.row.capacity">
									<span>{{nowExchange.symbol}} {{returnFloat(scope.row.price/scope.row.capacity)}} {{nowExchange.code}}</span>
								</div>
							</template>
						</el-table-column>
					</el-table> -->
					<div class="view" v-if="isShowTable" @click="showTable">View More</div>
					<p v-if="picInfo.priceInstructions" class="picNote">{{picInfo.priceInstructions}}</p>
				</div>
			<div class="provide" id="provide">
				<h3>What's Included?</h3>
				<ul v-if="itemsIncluded">
					<li :key="index" v-for="(item,index) in itemsIncluded">{{item}}</li>
				</ul>
				<ul v-if="inclusions">
					<li :key="index" v-for="(item,index) in inclusions">
						<h5>{{item.title}}</h5>
						<p v-if="item.content" v-html="item.content"></p>
					</li>
				</ul>
			</div>
			<div class="provide" v-if="exclusions" id="exclusions">
				<h3>Exclusions</h3>
				<ul>
					<li :key="index" v-for="(item,index) in exclusions">
						<h5>{{item.title}}</h5>
						<p v-if="item.content" v-html="item.content"></p>
					</li>
				</ul>
			</div>
			<div class="notes" v-if="notice.length>0" id="notice">
				<h3>Additional Info</h3>
				<p v-for="(item,index) in notice" :key="index">{{item}}</p>
			</div>
			<!-- <div class="notes" v-if="picInfo.priceInstructions" id="PriceNote">
				<h3>Price Note</h3>
				<p>{{picInfo.priceInstructions}}</p>
			</div> -->
			<div class="notes" v-if="picInfo.refundInstructions" id="CancellationPolicy">
				<h3>Rescheduling and Cancellation Policy</h3>
				<p v-html="picInfo.refundInstructions.replace(/\r\n/g,'<br/>')"></p >
			</div>
			<div class="notes" id="notes" v-if="remark.length>0">
				<h3>Notes</h3>
				<p v-if="remark" :key="index" v-for="(item,index) in remark">{{item}}</p>
			</div>
			<div class="inqury" @click="goInqury">
				Send us any questions you have here
				<i class="iconfont">&#xe620;</i>
			</div>
			<div class="recommend" id="recommend" v-if="recommed.length>0">
				<h3>Similar Experiences</h3>
				<div class="swiper-container" id="swiper_tuijian">
					<div class="swiper-wrapper">
						<div class="swiper-slide" :key="index" v-for="(i,index) in recommed">
							<a :href="'/activity/details/'+i.activityId">
								<div class="activity-pic">
									<img v-lazy="i.coverPhotoUrl">
								</div>
								<div class="activity-cont">
									<div class="activity-info clearfix">
										<div class="activity-cont-type"><i class="iconfont">&#xe653;</i>{{i.category}}{{i.groupType?' · '+i.groupType:''}}</div>
										
									</div>

									<h4 style="-moz-box-orient: vertical;
								    -webkit-box-orient:vertical;">{{i.title}}</h4>
									<div class="duration"><i class="iconfont">&#xe624;</i>Duration: {{i.duration}} {{i.durationUnit|firstUpperCase}}</div>
									<div class="pic">
										<div class="old-pic" v-if="i.originalPrice">${{returnFloat(i.originalPrice)}}</div>
										<div class="current-price">From<b>${{returnFloat(i.bottomPrice)}}</b><span>  pp</span></div>
									</div>
								</div>
							</a>
						</div>
					</div>
				</div>
			</div>
		</div>
		<div class="book">
			<button><a :href="'/info/inquiry?objectId='+id" @click="gaInquire">Inquire</a></button>
			<button class="bookBtn" @click="goBooking">Book</button>
		</div>
		<photo :photoList="photoList" :alertPicStatus="alertPicStatus" @alert-call-back="setCallBack"></photo>
	</div>
	
</template>

<script>

import vue from 'vue'
import photo from '~/components/activity/details/photo'
// if(process.browser) {
// 	const VueAwesomeSwiper = require('vue-awesome-swiper/dist/ssr')
// 	vue.use(VueAwesomeSwiper)
// 	require('swiper/dist/css/swiper.css')
// }
	
	export default {
		props: [
			"remark",
			"detail",
			"highlights",
			"destinations",
			"itemsIncluded",
			"id",
			"isscroll",
			"isShowBookNow",
			"picInfo",
			"recommed",
			"introduction",
			"inclusions",
			"exclusions",
			"notice",
			"photoList",
			"destination"
		],
		name: 'm-details',
		data() {
			return {
				isShowMore: false,
				showbtn: 0,
				sixArr: [],
				isShowTable: false, //价格明细
				alertPicStatus: false,
				
				defaultCurrency : 'USD',
				nowExchange:{},//{'rate':1,'currency':'USD','symbol':'$'}
				exchange:[]
				
		}
	},
	components: {
		photo
	},
		methods: {
			gaInquire(){
				ga('gtag_UA_107010673_2.send', {
						hitType: 'event',
						eventCategory: 'activity_detail',
						eventAction: 'click',
						eventLabel: 'activity_inquiry',
	
					});
			},
			changeCurrency(e){
				var self = this;
				var value = e.target ? e.target.value : e;
				var picInfo = this.picInfo;
				var thisDetail = picInfo.details;

				
				//换算折扣价
				var exchange = this.exchange;
				for(var i=0;i<exchange.length;i++){
					var thisEx = exchange[i];
					//检测当前货币类型
					if(thisEx.code==value){
						//设置当前币种
						this.nowExchange = thisEx;
						//切换折扣价币种
						picInfo.currency = value;
						picInfo.symbol = thisEx.symbol;
						picInfo.bottomPrice = picInfo.defaultPrice.bottomPrice * thisEx.exchangeRate;
						picInfo.originalPrice = picInfo.defaultPrice.originalPrice * thisEx.exchangeRate;
						if(picInfo.defaultPrice.childDiscount){
							//之所以在这里加returnFloat，是为了让儿童优惠后的总价格，不会超过总价-儿童优惠价
							picInfo.childDiscount = picInfo.defaultPrice.childDiscount * thisEx.exchangeRate;
						}
						//切换价格详情币种
						for(var i=0;i<thisDetail.length;i++){
							thisDetail[i].price = thisDetail[i].defaultPrice * thisEx.exchangeRate;
						}

						//切换详情币种
						var sixArr = this.sixArr;
						for(var i=0;i<sixArr.length;i++){
							//之所以在这里加returnFloat，是为了让儿童优惠后的总价格，不会超过总价-儿童优惠价
							sixArr[i].price = sixArr[i].defaultPrice * thisEx.exchangeRate;
						}
						
						break;
					}
				}
				
				if(this.people>0){
					this.adultsPic = thisDetail[this.people-1].price;
				}
			},
			setPriceData(){
				var picInfo = this.picInfo;
				var thisDetail = picInfo.details;
				//设置默认价格和折扣价
				picInfo.defaultPrice = {
					bottomPrice: picInfo.bottomPrice,
					originalPrice: picInfo.originalPrice
				};
				//儿童折扣
				if(picInfo.childDiscount){
					picInfo.defaultPrice.childDiscount = picInfo.childDiscount;
				}
				//设置人数列表价格
				for(var i=0; i<thisDetail.length; i++){
					var thisPrice = thisDetail[i].price;
					thisDetail[i].defaultPrice = thisPrice;
				}
			},
			goInqury(){
				location.href="/info/inquiry?objectId="+this.id
			},
			showMore(id) {
				if(id == 0) {
					this.showbtn = 0
					this.isShowMore = false
				} else {
					this.showbtn = 1
					this.isShowMore = true
				}

			},
			cutXiaoNum(num, len) {
				var numStr = num.toString();
				if(len == null || len == undefined) {
					len = numStr.length;
				}
				var index = numStr.indexOf(".");
				if(index == -1) {
					index = numStr.length;
					numStr += ".0000000000000";
				} else {
					numStr += "0000000000000";
				}
				var newNum = numStr.substring(0, index + len + 1);
				return newNum;
			},
			round(val) {
				if(typeof val === "number" && val % 1 === 0) {
					return val;
				} else if(val.toString().split(".")[1].length <= 1) {
					return val;
				} else {
					return(parseFloat(this.cutXiaoNum(val, 1)) + 0.1).toFixed(1);
				}
			},
			//内链
			returnUrl(val){
				
				let options={
					tourtype:[val]
				}
				
				let url="/activity/list/China?options="+encodeURIComponent(JSON.stringify(options))
				return url
			},
			showTable() {
				this.isShowTable = false
				this.sixArr=this.tableData(this.picInfo.details)
			},
			goBooking(){
				let objDetail={
					id:this.id,
					picInfo:this.picInfo,
					title:this.detail.title,
					category:this.detail.category,
					refundTimeLimit:this.detail.refundTimeLimit,
				}
				console.log(objDetail)
				objDetail=JSON.stringify(objDetail)
				localStorage.setItem("objDetail",objDetail)
				location.href="/activity/check/"
			},
			 returnFloat(value) {
				value*=1;
				if(value) {
					var numberArr = (''+value).split('.');
					if(numberArr.length>1 && numberArr[1].length>2){
						return (value+0.005).toFixed(2);
					}
					return value.toFixed(2);
				}else{
					return 0;
				}
			},
			//唤起图片轮播
			showPhoto() {
				this.alertPicStatus = true
			},
			//图片轮播状态回调
			setCallBack(val) {
				this.alertPicStatus = val
			},
			tableData(details) {
				
				var newObj = function(obj) {
					var o = {};
					for(var key in obj) {
						o[key] = obj[key];
					}
					return o;
				}

				let newArr = [],
					tableD = [];



				if(details.length==1){
					for(let i=0;i<details[0].capacity;i++){
						var s=newObj(details[0]);
						newArr.push(s)
					}
					
				}else{
					for(let i = 0; i < details.length; i++) {
						let thisD = details[i];
						newArr.push(thisD);
						if(i + 1 > details.length - 1) break;

						var thisC = thisD.capacity;
						var nextC = details[i + 1].capacity;
						var forLen = nextC - thisC - 1;
						for(let j = 0; j < forLen; j++) {
							var midArr = newObj(details[i+1]);
							//console.log(midArr)
							newArr.push(midArr);
						}
						//console.log(newArr)
					}
				}
				

				for(var k = 0; k < newArr.length; k++) {
					newArr[k].capacity = k + 1;

				}
				
				return newArr;
			}
		},
		filters: {
			firstUpperCase(val) {
				if(val)
					return val.toLowerCase().replace(/( |^)[a-z]/g, L => L.toUpperCase());
			}
		},
		mounted: function() {
			
			let that = this;
			
			//加载币种
			that.axios.get("https://api.localpanda.com/api/public/currency/all/"+that.picInfo.currency).then(function(response) {
				// console.log(response);
				if(response.status==200){
					that.exchange = response.data;
					that.nowExchange = that.exchange[0];
					//设置当前货币符号
					that.picInfo.symbol = that.nowExchange.symbol;
					
					//设置币种
					var ua = window.navigator.userAgent.toLowerCase();
					var isWx = (ua.match(/MicroMessenger/i) == 'micromessenger') ? true : false;
					if(isWx||that.picInfo.currency=="CNY"){
						that.defaultCurrency = 'CNY';
						that.changeCurrency('CNY');
					}
					
				}
			}, function(response) {});
			
			//调整不同币种价格数据
			that.setPriceData();
			if(that.picInfo.childDiscount){
				that.picInfo.childDiscountDefault = that.picInfo.childDiscount;
			}

			//设置价格详情页，渲染数据
			that.detailAll = that.tableData(that.picInfo.details);
			if(that.tableData(that.picInfo.details).length>5){
				that.isShowTable=true
				that.sixArr=that.detailAll.concat().splice(0,6);
			}else{
				that.sixArr=that.detailAll;
			}


			new Swiper('#swiper_tuijian', {
				lazy: true,
				slidesPerView :"auto",
				initialSlide: 0,
				spaceBetween:17,
			});
			


			//var ua = window.navigator.userAgent.toLowerCase();
			//that.isWx = (ua.match(/MicroMessenger/i) == 'micromessenger') ? true : false;
		},
		watch:{
			
		}
	}
</script>
<style lang="scss">
.el-table__row .cell {
		line-height: 0.56rem!important;
		word-wrap:break-word!important;
		
		span {
			font-size: 0.24rem;
			color: #353a3f;
			
		}
	}
	.el-table th{
		word-wrap:break-word!important;
	}
	.el-table thead tr th{
		word-wrap:break-word!important;
		
	}
	.el-table__header tr th .cell{
		padding: 0 10px;
	}
	.el-table th>.cell {
		font-size: 0.2rem;
		font-weight: bold;
		color: #353a3f;
		padding: 0!important;
		
	}
	.el-table {
		margin-top: 0.4rem;
	}
	
	.el-table--group::after,
	.el-table--border::after,
	.el-table::before {
		height: 0;
	}
	
	.el-table--striped .el-table__body tr.el-table__row--striped td {
		background: rgba(27, 188, 157, 0.06)!important;
	}
	
	.el-table th,
	 .el-table td {
	 	padding:0.146666rem 0;
	 }
	
	.el-table tr:hover {
		background: #fff;
	}
	
	.el-table--enable-row-hover .el-table__body tr:hover>td {
		background: #fff;
	}
	
	.el-table th.is-leaf,
	.el-table td {
		border: 0;
	}
	/*@import "~assets/scss/_table.scss";*/

	.picNote{
		margin-top: 0.1rem;
		font-size: 0.28rem;
	}

	.price_list{
		margin-top: 0.2rem;
		width: 100%;
		tr{
			&:nth-child(2n+3){
				background: rgba(27, 188, 157, .06) !important;
			}
		
			th{
				text-align: center;
				
			}
			td{
				text-align: center;
				font-size: 0.24rem;
				line-height: 0.56rem;
				padding: 0.1rem 0;
				
			}
		}
		
	}

	.price {
		text-align: right;
	.picinfo {
			display: inline-block;
			
			p {
				font-size: 0.28rem;
				color: #878e95;
				b {
					font-size: 0.44rem;
					color: #353a3f;
				}
				span.oldpic {
					text-decoration: line-through;
				}
			}
		}
		.picRate {
			display: inline-block;
			color: #fff;
			position: relative;
			opacity: 0.5;
			margin-right: 0.2rem;
			span {
				font-size: 10px;
			}
			.iconfont {
				float: right;
				margin-top: 0.2rem;
				height: 0.8rem;
				line-height: 0.8rem;
				text-align: center;
				font-size: 0.4rem;
				color: #666;
			}
			.currency_type {
				background: none;
				color: #666;
				border: none;
				height: 0.8rem;
				padding: 0 0 0 0.2rem;
				font-size: 0.28rem;
				margin-top: 0.2rem;
				-webkit-appearance: none;
				-moz-appearance: none;
				appearance: none;
			}
		}
	}

</style>

<style lang="scss" scoped>
	@import "~/assets/font/iconfont.css";
	.m-details {
		padding: 0 0.4rem 0rem;
		.m-details-cont {
			margin-top: 0.4rem;
			.toursType {
				font-size: 0.2rem;
				color: #1bbc9d;
			}
			.activitiyTitle {
				margin-top: 0.1rem;
				h3 {
					font-size: 0.46rem;
					font-weight: bold;
				}
				.types {
					margin: 0.1rem 0 0.2rem;
					font-size: 0.3rem;
					a {
						font-size: 0.26rem;
						position: relative;
						padding: 0 0.16rem;
						color: #1bbc9d;
						&:first-child {
							padding-left: 0;
						}
						&:not(:first-child) {
							&:after {
								content: "";
								width: 0.053333rem;
								height: 0.053333rem;
								border-radius: 50%;
								background: #353a3f;
								position: absolute;
								left: 0px;
								top: 0.13rem;
							}
						}
					}
				}
			}
			.toursMessage {
				ul {
					li {
						margin-top: 0.2rem;
						
						label {
							float: left;
							font-size: 0.28rem;
						}
						span {
							display: inline-block;
							margin-left: 0.24rem;
							font-size: 0.26rem;
							float:left;
							width: 90%;
						}
					}
				}
			}
			.says {
				padding: 0.5rem 0 0.4rem;
				border-bottom: 1px solid #dde0e0;
				font-size: 0.28rem;
			}
			.heightLights {
				padding: 0.4rem 0;
				border-bottom: 1px solid #dde0e0;
				P {
					margin-top: 0.213333rem;
					padding-left: 0.4rem;
					&:first-child {
						margin-top: 0;
					}
					i {
						float: left;
						font-size: 0.16rem;
						color: #1bbc9d;
						margin-left: -0.4rem;
					}
					span {
						font-size: 0.26rem;
						display: block;
					}
				}
			}
			.journey {
				padding-top: 0.4rem;
				padding-bottom: 0.64rem;
				border-bottom: 1px solid #dde0e0;
				.expect {
					.expect-title {
						font-size: 0.36rem;
						font-weight: bold;
					}
					.introduction {
						
					
						margin-top: 0.4rem;
						p {
							font-size: 0.26rem;
							margin-top: 0.266666rem;
							&:first-child {
								margin-top: 0;
							}
						}
						ul {
							li {
								margin-top: 0.506666rem;
								.contTitle {
									h3 {
										font-size: 0.36rem;
										font-weight: bold;
									}
									p {
										font-size: 0.26rem;
										margin-top: 0.24rem;
									}
								}
								.cont {
									margin-top: 0.24rem;
									img {
										width: 100%;
										height: 100%;
									}
								}
							}
						}
					}
					.viewMore {
						font-size: 0.346666rem;
						margin-top: 0.373333rem;
						color: #1bbc9d;
					}
				}
			}
			.provide {
				padding: 0.5rem 0;
				border-bottom: 1px solid #dde0e0;
				h3 {
					font-size: 0.4rem;
					font-weight: bold;
				}
				.childDiscount{
					margin-top: 0.22rem;
					font-size: 0.28rem;
				}
				ul {
					li {
						padding-left: 0.266666rem;
						display: inherit;
						margin-top: 0.266666rem;
						font-size: 0.32rem;
						position: relative;
						h5 {
							font-size: 0.28rem;
						}
						p {
							font-size: 0.26rem;
							margin-top: 0.1rem;
							line-height: 0.34rem;
						}
						&:after {
							content: "";
							position: absolute;
							width: 0.053333rem;
							height: 0.053333rem;
							border-radius: 50%;
							background: #353a3f;
							left: 0px;
							top: 0.2rem
						}
						&:first-child {
							margin-top: 0.5rem;
						}
					}
				}
			}
			.inqury{
				border-bottom: 1px solid #dde0e0;
				height: 1.44rem;
				line-height: 1.44rem;
				font-size:0.28rem;
				font-weight: bold;
				color: #1bbc9d;
				position: relative;
				i{
					position: absolute;	
					right: 0;
					font-size: 0.28rem;
					color: #dde0e0;
				}
			}
			.notes {
				padding: 0.44rem 0;
				border-bottom: 1px solid #dde0e0;
				h3 {
					font-size: 0.4rem;
					font-weight: bold;
				}
				p {
					margin-top: 0.18rem;
					font-size: 0.26rem;
				}
				.photoCover {
						margin-top: 0.4rem;
						cursor: pointer;
						height: 3.6rem;
						background-repeat: no-repeat!important;
						background-size: cover!important;
						background-position: center;
						position: relative;
						.mask {
							position: absolute;
							left: 0;
							top: 0;
							width: 8.24rem;
							height: 100%;
							background: linear-gradient( to right, rgba(255, 249, 248,1) 40%, rgba(255, 249, 248, 0) );
						}
						.cover {
							padding: 0.613333rem 0 0 0.4rem;
							position: relative;
							h4 {
								font-size: 0.28rem;
								width: 4.866666rem;
							}
							button {
								height: 0.8rem;
								width: 3rem;
								line-height: 0.8rem;
								text-align: center;
								border-radius: 0.4rem;
								background: #fff;
								box-shadow: 0px 0.026666rem 0.266666rem 0px rgba(0, 0, 0, 0.2);
								margin-top: 0.426666rem;
								font-size: 0.28rem;
								font-weight: bold;
							}
						}
					}
			}
			.recommend {
				margin-top: 0.45rem;
				h3 {
					font-size: 0.36rem;
					font-weight: bold;
					margin-bottom: 0.45rem;
				}
				.swiper-wrapper {
					.swiper-slide {
						width:80%;
						&:last-child {
							margin-right: 0;
						}
						.activity-pic {
							
							height: 3.4rem;
							position: relative;
							img {
								width: 100%;
								height: 100%;
							}
							span {
								position: absolute;
								top: 10px;
								left: 10px;
								padding: 5px;
								font-size: 14px;
								font-weight: bold;
								background: #f4b33f;
								color: #fff;
							}
						}
						.activity-cont {
							height: 3.6rem;
							position: relative;
							padding: 0.3rem;
							box-shadow: 0px 2px 3px 0px rgba(53, 58, 63, 0.1);
							.activity-info {
								
								.activity-cont-type {
									float: left;
									font-size:  0.22rem;
									color: #d87b65;
									i {
										font-size:  0.22rem;
										color: #d87b65;
										margin-right: 0.14rem;
									}
								}
							}
							h4 {
								color: #353a3f;
								height: 0.8rem;
								line-height: 0.4rem;
								text-overflow: ellipsis;
								display: -webkit-box;
								display: -moz-box;
								-moz-box-orient: vertical;
								-webkit-box-orient: vertical;
								-webkit-line-clamp: 2;
								word-wrap: break-word;
								overflow: hidden;
								margin-top: 0.14rem;
								font-size: 0.3rem;
								font-weight: bold;
							}

							.duration {
								margin-top: 0.1rem;
									font-size: 0.22rem;
									color: #878e95;
									i {
										font-size: 0.22rem;
										color: #878e95;
										margin-right: 0.173333rem;
									}
								}
							/*.activity-cont-duration {
								margin-top: 17px;
								i {
									font-size: 12px;
									color: #878e95;
									margin-right: 6px;
								}
								font-size: 14px;
								color: #878e95;
							}*/
							.pic {
								position: absolute;
								right: 0.4rem;
								bottom: 0.4rem;
								.old-pic {
									text-align: right;
									font-size: 0.24rem;
									color: #878e95;
									text-decoration: line-through;
								}
								.current-price {
									font-size: 0.24rem;
									color: #878e95;
									margin-top: 0.093333rem;
									b {
										font-size: 0.36rem;
										color: #353a3f;
										margin-left: 6px;
									}
									span {
										color: #353a3f;
									}
								}
							}
						}
					}
				}
			}
			
		}
		.book {
			width: 100%;
			box-sizing: border-box;
			position: fixed;
			height: 1.4rem;
			padding: 0 0.4rem;
			bottom: 0;
			left: 0;
			z-index: 99;
			background: #fff;
			border-top: 1px solid #dde0e0;
			display: flex;
			button{
				flex: 1;
				margin-right: 0.32rem;
				width: 3.6rem;
				height: 0.9rem;
				line-height: 0.9rem;
				text-align: center;
				color: #FFF;
				font-weight: bold;
				border-radius: 0.6rem;
				margin-top: 0.23rem;
				font-size: 0.36rem;
				&:last-child{
					margin-right: 0;
					background-image: linear-gradient(270deg, #009efd 0%, #1bbc9d 100%);
				}
				&:first-child{
					border: solid 1px #1bbc9d;
					background: #fff;
					a{
						display: block;
						color: #1bbc9d;
						font-size:0.36rem;
					}
				}
				
			}
		}
		.view{
			margin-top: 0.266666rem;
			color:#1bbc9d;
			font-size: 0.346666rem;
		}
		.show {
			overflow: inherit!important;
			height: auto!important;
		}
	}
</style>