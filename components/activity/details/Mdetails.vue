<template>
	<div class="m-details">
		<div class="m-details-cont">
			<div class="toursType ">{{detail.category}} <b v-if="detail.groupType">·</b> {{detail.groupType}}</div>
			<div class="activitiyTitle">
				<h3>{{detail.title}}</h3>
				<div class="types">
					<a :href="returnUrl(i)" v-for="i in detail.tourTypes">{{i}}</a>
				</div>
			</div>

			<div class="price">

				<!-- <div class="people_change" @click="showPeopleBox=true">
					pp for party of {{peopleNum}}
					<span class="iconfont">&#xe666;</span>
				</div> -->

				<div class="select_people">
					<!-- {{peopleNum}} People <i class="iconfont">&#xe666;</i> -->
					<select v-model="peopleNum" @change="changePeople">
						<option :value="item" :key="index" v-for="(item,index) in picInfo.maxParticipants" v-if="item>=picInfo.minParticipants">pp for party of {{item}}</option>
					</select>
					<i class="iconfont">&#xe666;</i>
				</div>

				<div class="picinfo">
					<!-- <p v-if="picInfo.originalPrice">From <span class="oldpic">{{nowExchange.symbol}} {{returnFloat(picInfo.originalPrice)}}</span></p> -->
					<p> <b>{{nowExchange.symbol}} {{detailAll.length>0 ? (detailAll.length==1?returnFloat(detailAll[0].price):returnFloat(detailAll[peopleNum-detailAll[0].capacity].price/peopleNum)) : ''}}</b></p>
				</div>

				

				<div class="picRate">
					<select class="currency_type" id="changeCurrency" @change="changeCurrency" v-model="defaultCurrency">
						<option :value="item.code" v-for="item in exchange" :key="item.code">{{item.code}}</option>
					</select>
					<span class="iconfont">&#xe666;</span>
				</div>

				<div class="sales" v-if="detail.sales"> Booked {{detail.sales}} {{detail.sales==1?'time':'times'}} (last 30 days)</div>
				
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
						<span v-if="detail.groupType=='Group'">Language: English</span>
						<span v-else>Languages: English, French, Spanish, Russian, German, Japanese, Korean</span>
					</li>
					<li class="clearfix">
						<label class="iconfont">&#xe652;</label>
						<span v-if="picInfo.minParticipants==picInfo.maxParticipants">Participants: {{picInfo.minParticipants}}</span>
						<span v-else>Participants: {{picInfo.minParticipants}} - {{picInfo.maxParticipants}}</span>
					</li>
				</ul>
			</div>
			<p class="says">{{detail.recommendedReason}}</p>

			<h3 class="expect-title" id="journey">What You Can Expect</h3>
			<div class="heightLights" id="heightLights" v-if="highlights.length">
				<p :key="index" class="clearfix" v-for="(item,index) in highlights"><i class="iconfont">&#xe654;</i><span>{{item}}</span></p>
			</div>
			<div class="journey" ref="journey" v-if="introduction.length || detail.itineraries">
				<div class="expect">
					
					<div class="introduction" :class="{'show':isShowMore}">
						<p :key="index" v-for="(j,index) in introduction">{{j}}</p>
						<ul>
							<li :key="index" v-for="(i,index) in detail.itineraries">
								<div class="item_v clearfix">
									<div class="contTitle">
										<h3>{{i.title}}</h3>
										<p>{{i.description}}</p>
									</div>
									<div class="cont" v-if="i.photo">
										<img v-lazy="i.photo.url" />
									</div>
								</div>
							</li>
						</ul>
					</div>

					<div class="itinerary_tip" v-if="detail.groupType=='Private'"><span class="red">*</span> If you want to adjust your itinerary, feel free contact us. Since the tour is private, our staff can help you make changes according to your needs.</div>
					
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
			
			<div class="provide" id="provide" v-if="inclusions.length">
				<h3>What's Included?</h3>
				<ul>
					<li :key="index" v-for="(item,index) in itemsIncluded">{{item}}</li>
				</ul>
				<ul v-if="inclusions">
					<li :key="index" v-for="(item,index) in inclusions">
						<h5>{{item.title}}</h5>
						<p v-if="item.content" v-html="item.content"></p>
					</li>
				</ul>
			</div>
			<div class="provide" v-if="exclusions.length" id="exclusions">
				<h3>Exclusions</h3>
				<ul>
					<li :key="index" v-for="(item,index) in exclusions">
						<h5>{{item.title}}</h5>
						<p v-if="item.content" v-html="item.content"></p>
					</li>
				</ul>
			</div>
			<!-- 点评模块 -->
			<div class="remark_all" id="Reviews" v-if="remarkDataAll.length">
				<div class="remark_title">
					<span class="reviews">{{records}} {{remarkDataAll.length==1 ? 'Review':'Reviews'}}</span>
					<div class="remark_star" v-html="remarkStarHtml(avgscore)"></div>
				</div>
				<div class="remark_list" v-for="(item,index) in remarkDataAll" :key="index">
					<div class="remark_list_top">
						<div class="remark_star" v-html="remarkStarHtml(item.score)">
							<!-- <span class="star_list" v-for="itemIndex in 5" :class="{star_h:item.score%2==1&&item.score/2<itemIndex}"><i></i><div class="star_half"><span class="star_list"><i></i></span></div></span> -->
							<!-- <span class="star_list"><i></i><div class="star_half"><span class="star_list"><i></i></span></div></span>
							<span class="star_list"><i></i><div class="star_half"><span class="star_list"><i></i></span></div></span>
							<span class="star_list star_h"><i></i><div class="star_half"><span class="star_list"><i></i></span></div></span>
							<span class="star_list star_no"><i></i><div class="star_half"><span class="star_list"><i></i></span></div></span> -->
						</div>
						<div class="remark_photo" :style="'background-image:url('+(item.userPortraitPhoto?item.userPortraitPhoto.url:'')+')'">
							<span class="remark_photo_def" v-if="!item.userPortraitPhoto">{{item.userName.substring(0,1)}}</span>
							<!-- <img v-else v-lazy="item.userPortraitPhoto?item.userPortraitPhoto.url:''" alt=""> -->
						</div>
						<div class="remark_list_info">
							<h5>{{item.userName}}</h5>
							<p>{{getDate(item.createTime)}}</p>
							<!-- May 24,2018 -->
						</div>
					</div>
					<div class="remark_list_content" :content="item.content">{{item.content.length>200?item.content.substring(0,200)+'...':item.content}} <span class="remark_text_more" v-if="item.content.length>200" @click="remarkShowMore">View More</span> </div>
					<ul class="remark_img_s">
						<li v-for="(itemChild,index2) in item.userCommentPhoto" @click="showBigPic(index,index2)" :key="index2"><img v-lazy="itemChild.url" alt=""></li>
					</ul>
				</div>
				<div class="remark_more" @click="loadMoreRemark">Show more</div>
			</div>
			<div class="notes" v-if="notice.length>0" id="notice">
				<h3>Additional Info</h3>
				<p v-for="(item,index) in notice" :key="index">{{item.title}}</p>
			</div>
			<!-- <div class="notes" v-if="picInfo.priceInstructions" id="PriceNote">
				<h3>Price Note</h3>
				<p>{{picInfo.priceInstructions}}</p>
			</div> -->
			<div class="notes" v-if="picInfo.refundInstructions" id="CancellationPolicy">
				<h3>Rescheduling and Cancellation Policy</h3>
				<p v-html="picInfo.refundInstructions.replace(/\r\n/g,'<br/>')"></p >
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
					<div class="view" v-if="isShowTable" @click="showTable">View More</div>
					<p v-if="picInfo.priceInstructions" class="picNote">{{picInfo.priceInstructions}}</p>
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


		<!-- 选人数 -->
		<!-- <div class="win_bg" v-show="showPeopleBox" @touchmove="noScroll"></div>
		<div class="people_change_box" v-show="showPeopleBox" @touchmove="noScroll">
			<dl class="people_dl">
				<dt>Guest Number: </dt>
				<dd>
					<div class="number_box">
						<span class="btn_minus iconfont" @click="peopleMinus">&#xe64d;</span>
						<span class="people_number">{{peopleNum}}</span>
						<span class="btn_plus iconfont" @click="peoplePlus">&#xe64b;</span>
					</div>
				</dd>
			</dl>

			<div class="btn people_change_btn" @click="showPeopleBox=!showPeopleBox">Submit</div>
			
		</div> -->

		
		<div class="swiper-container swiper_remark" id="swiper_remark" v-show="showRemarkPic">
			<div class="swiper-wrapper">
				<div class="swiper-slide" :key="index" v-for="(item,index) in thisRemarkData.userCommentPhoto">
					<!-- </div> -->
					<div class="swiper-zoom-container">
						<p></p>
						<img class="image" :src="item.url">
					</div>
				</div>					
			</div>
			<div class="remark_num">{{remarkIndex}} / {{thisRemarkData.userCommentPhoto?thisRemarkData.userCommentPhoto.length:0}}</div>
			<div class="remark_close" @click="closeBigPic"><i class="iconfont">&#xe606;</i></div>
		</div>

		



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
			"destination",
			"remarkData"
		],
		name: 'm-details',
		data() {
			var participants = parseInt(this.$route.query.participants);
			return {
				isShowMore: false,
				showbtn: 0,
				sixArr: [],
				isShowTable: false, //价格明细
				alertPicStatus: false,
				detailAll:[],

				remarkDataAll:this.remarkData.entities?this.remarkData.entities:[],
				avgscore:this.remarkData.avgScore?this.remarkData.avgScore:10,
				records:this.remarkData.records?this.remarkData.records:0,
				thisRemarkData:'',
				showRemarkPic:false,
				remarkIndex:1,
				pageNum:2,
				
				defaultCurrency : 'USD',
				nowExchange:{},//{'rate':1,'currency':'USD','symbol':'$'}
				exchange:[],

				peopleNum: participants ? participants : 2,
				showPeopleBox: false
				
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
					localStorage.setItem("owner",this.detail.owner)
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
				
				this.detailAll = this.tableData(thisDetail);

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
				
				let url="/activity/list/"+encodeURIComponent(val);
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
					refundTimeLimit:this.picInfo.refundTimeLimit,
				}
				console.log(objDetail)
				objDetail=JSON.stringify(objDetail)
				localStorage.setItem("objDetail",objDetail)
				location.href="/activity/check/"+this.detail.activityId+"?people="+this.peopleNum;
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
						s.capacity = i+1;
						newArr.push(s)
					}
					
				}else{
					
					for(let i = 0; i < details[details.length-1].capacity; i++) {
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
					newArr[k].capacity = k + newArr[0].capacity;

				}

				//console.log(newArr);
				
				return newArr;
			},
			peopleMinus(e){
				this.peopleNum--;
				var minLen = this.picInfo.minParticipants;
				if(this.peopleNum <= minLen){
					e.target.style.opacity = 0.5;
					this.peopleNum = minLen;
				}else{
					e.target.parentNode.getElementsByClassName('btn_plus')[0].style.opacity = 1;
				}
			},
			peoplePlus(e){
				this.peopleNum++;
				var maxLen = this.picInfo.maxParticipants;
				if(this.peopleNum >= maxLen){
					e.target.style.opacity = 0.5;
					this.peopleNum = maxLen;
				}else{
					e.target.parentNode.getElementsByClassName('btn_minus')[0].style.opacity = 1;
				}
			},
			changePeople(e){
				this.peopleNum = e.target.value;
			},
			noScroll(e){
				e.preventDefault();
				return false;
			},

			getDate(date){
				return date.substring(0,10);
			},
			showBigPic(index,imgIndex){
				var that = this;
				this.thisRemarkData = this.remarkDataAll[index];
				this.showRemarkPic = true;
				
				setTimeout(function(){
					that.swiper_remark = new Swiper('#swiper_remark', {
						lazy: false,
						initialSlide:imgIndex,
						zoom:true,
						on:{
							slideChangeTransitionEnd: function(swiper){
								that.remarkIndex = this.activeIndex+1;
							}
						}
						
					});
				},200);
				//this.swiper_remark.update();
				//this.swiper_remark.destroy();
			},
			closeBigPic(){
				this.showRemarkPic = false;
				this.swiper_remark.destroy();
				this.thisRemarkData = '';
				this.remarkIndex = 1;
			},
			remarkShowMore(e){
				var parent = e.target.parentNode;
				parent.innerHTML = parent.getAttribute('content');
			},
			loadMoreRemark(e){
				var postData = {
					"activityId": this.id,
					'pageNum':this.pageNum,
					'pageSize':3
				};
				var thisBtn = e.target;
				var self = this;

				if(self.remarkLoading){
					return false;
				}

				self.remarkLoading = true;
				self.axios.post("https://api.localpanda.com/api/user/comment/list",JSON.stringify(postData),{
					headers: {
					'Content-Type': 'application/json'
					}
				}).then(function(response) {
					var entities = response.data.entities;
					if(entities && entities.length){
						if(entities.length<3){
							thisBtn.style.display = 'none';
						}else{
							thisBtn.style.display = 'block';
						};
						self.remarkDataAll = self.remarkDataAll.concat(entities);
						self.pageNum++;
					}else if(entities && entities.length==0){
						thisBtn.style.display = 'none';
					}
					//开启请求状态
					self.remarkLoading = false;
					
				}, function(response) {
					self.remarkLoading = false;
				});
			},
			remarkStarHtml(score){
				var thisHtml = '';
				for(var i=0;i<5;i++){
					if(/\./.test(score/2+'') && i == parseInt(score/2)){
						thisHtml += '<span class="star_list star_h"><i></i><div class="star_half"><span class="star_list"><i></i></span></div></span>';
					}else if(i>score/2-1){
						thisHtml += '<span class="star_list star_no"><i></i><div class="star_half"><span class="star_list"><i></i></span></div></span>';
					}else{
						thisHtml += '<span class="star_list"><i></i><div class="star_half"><span class="star_list"><i></i></span></div></span>';
					}
				}
				return thisHtml;
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
			
			this.picInfo.defaultCurrency = this.picInfo.currency;
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
			
			//根据最低成团人数修改默认人数
			if(this.picInfo.minParticipants == 1 && this.picInfo.maxParticipants == 1){
				this.peopleNum = 1;
			}else if(this.picInfo.minParticipants>2 && this.peopleNum<=this.picInfo.minParticipants){
				this.peopleNum = this.picInfo.minParticipants;
			}

			//console.log(this.picInfo);
			//var ua = window.navigator.userAgent.toLowerCase();
			//that.isWx = (ua.match(/MicroMessenger/i) == 'micromessenger') ? true : false;

			
			

			//console.log(this.remarkDataAll);


		},
		watch:{
			
		}
	}
</script>


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
					font-size: 0.34rem;
					line-height: 0.4rem;
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
				margin-top: 0.3rem;
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

			.expect-title {
				font-size: 0.36rem;
				font-weight: bold;
				margin-top: 0.4rem;
			}
			.journey {
				padding-top: 0.4rem;
				padding-bottom: 0.64rem;
				border-bottom: 1px solid #dde0e0;
				.expect {
					
					.introduction {
						
					
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
					.itinerary_tip{
						margin-top: 0.4rem;
						font-size: 0.26rem;
						.red{
							color: red;
						}
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
	}


</style>

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
		
		.picinfo {
			float: right;
			line-height: 0.74rem;
			margin-right: 0.3rem;
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
				margin-right: 0.2rem;
				span {
					font-size: 10px;
				}
				.iconfont {
					float: right;
					height: 0.8rem;
					line-height: 0.8rem;
					text-align: center;
					font-size: 0.36rem;
					color: #666;
					font-weight: bold;
				}
				.currency_type {
					background: none;
					color: #666;
					border: none;
					height: 0.8rem;
					font-size: 0.28rem;
					-webkit-appearance: none;
					-moz-appearance: none;
					appearance: none;
				}
			}
			.select_people{
				float: right;
				position: relative;
				font-size: 0.32rem;
				line-height: 0.8rem;
				i{
					position: absolute;
					right: 0;
					top: 0;
					height: 0.8rem;
					line-height: 0.8rem;
					vertical-align: top;
					font-size: 0.36rem;
					font-weight: bold;
				}
				select{
					width: 100%;
					height: 100%;
					line-height: 0.8rem;
					padding: 0 0.4rem 0 0.2rem;
					background: none;
					border: none;
					appearance:none;
					-moz-appearance:none;
					-webkit-appearance:none;
					position: relative;
					z-index: 2;
				}
			}
		}
	.sales{
		text-align: right;
		clear: both;
		top: -0.1rem;
		position: relative;
		padding-right: 0.08rem;
		color: #878e95;
	}


	// 点评
	.remark_all{
		padding-top: 0.45rem;
		padding-bottom: 0.6rem;
		
		.remark_title{
			.reviews{
				font-size: 0.44rem;
				font-weight: bold;
			}
			.remark_star{
				margin-left: 0.5rem;
				vertical-align: top;
				margin-top: 0.16rem;
			}
		}
		.remark_list{
			padding: 0.4rem 0;
			border-bottom: #ddd solid 1px;
			// &:nth-child(2){
			// 	border: none
			// }
			
			.remark_list_top{
				overflow: hidden;
				.remark_photo{
					float: left;
					width: 0.8rem;
					height: 0.8rem;
					border-radius: 50%;
					overflow: hidden;
					margin-right: 0.24rem;
					background-size: cover;
					img{
						vertical-align: top;
					}
					.remark_photo_def{
						display: block;
						width: 100%;
						height: 100%;
						line-height: 0.8rem;
						font-size: 0.4rem;
						color: #fff;
						text-align: center;
						background-image: -webkit-gradient(linear, right top, left top, from(#009efd), to(#1bbc9d));
						background-image: linear-gradient(270deg, #009efd 0%, #1bbc9d 100%);
					}
				}
				.remark_list_info{
					float: left;
					h5{
						font-size: 0.28rem;
						font-weight: bold;
					}
					p{
						font-size: 0.24rem;
					}
				}
				.remark_star{
					float: right;
					margin-top: 0.3rem;
					.star_list{
						width: 0.24rem;
						height: 0.24rem;
					}
				}
			}
			.remark_list_content{
				font-size: 0.26rem;
				margin-top: 0.24rem;
				word-wrap:break-word;
				.remark_text_more{
					color: #1bbc9d;
					font-size: 0.24rem;
				}
			}
			.remark_img_s{
				margin-top: 0.15rem;
				overflow: hidden;
				li{
					float: left;
					border-radius: 0.1rem;
					width: 31%;
					margin-left: 2%;
					margin-top: 0.1rem;
					overflow: hidden;
					&:nth-child(1){
						margin-left: 0;
					}
					&:nth-child(4){
						margin-left: 0;
					}
					img{
						width: 100%;
						vertical-align: top;
					}
				}
			}
		}
		
		.remark_more{
			width: 3.2rem;
			margin: 0.6rem auto 0;
			height: 0.88rem;
			line-height: 0.8rem;
			border-radius: 0.44rem;
			border: solid 2px #1bbc9d;
			color: #1bbc9d;
			text-align: center;
			font-size: 0.28rem;
			font-weight: bold;
		}
		
	}

	.star_list{
		display: inline-block;
		overflow: hidden;
		position: relative;
		vertical-align: top;
		width: 0.32rem;
		height: 0.32rem;
		padding: 1px;
		border-radius: 50%;
		background-image: -webkit-gradient(linear, right top, left top, from(#009efd), to(#1bbc9d));
		background-image: linear-gradient(270deg, #009efd 0%, #1bbc9d 100%);
		i{
			display: inline-block;
			width: 100%;
			height: 100%;
			background-color: #fff;
			border-radius: 50%;
			position: relative;
			overflow: hidden;
			vertical-align: top;
			&:after{
				content: "";
				display: block;
				width: 40%;
				height: 40%;
				border-radius: 50%;
				overflow: hidden;
				position: absolute;
				left: 50%;
				top: 50%;
				transform: translate(-50%,-50%);
				-webkit-transform: translate(-50%,-50%);
				background-image: -webkit-gradient(linear, right top, left top, from(#009efd), to(#1bbc9d));
				background-image: linear-gradient(270deg, #009efd 0%, #1bbc9d 100%);
			}
		}
	}
	.remark_star{
		display: inline-block;
		
		.star_half{
			position: absolute;
			right: 0;
			top: 0;
			width: 100%;
			height: 100%;
			overflow: hidden;
			display: none;
			.star_list{
				position: absolute;
				right: 0;
				top: 0;
				margin: 0!important;
				background: #ddd;
				i{
					&:after{
						background: #ddd;
					}
				}
			}
		}
	}
	.star_no{
		.star_half{
			width: 100%;
			display: block;
		}
	}
	.star_no{
		.star_half{
			width: 100%;
			display: block;
		}
	}
	.star_h{
		.star_half{
			width: 50%;
			display: block;
		}
	}

	.swiper_remark{
		position: fixed;
		left: 0;
		top: 0;
		width: 100%;
		height: 100%;
		z-index: 99;
		background-color: rgba(0,0,0,0.8);
		p{
			position: absolute;
			width: 100%;
			height: 100%;
		}
		img{
			position: relative;
			z-index: 2;
			max-width: 100%;
			// left: 50%;
			// top:50%;
			// transform: translate(-50%,-50%);
			// -webkit-transform: translate(-50%,-50%);
		}
		.remark_close{
			position: absolute;
			right: 0;
			top: 0;
			color: #fff;
			padding: 0.3rem 0.4rem;
			z-index: 3;
		}
		.remark_num{
			position: absolute;
			left: 10%;
			top: 1rem;
			color: #fff;
			font-size: 0.32rem;
		}
	}
</style>