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

			<div class="price clearfix">

				<!-- <div class="people_change" @click="showPeopleBox=true">
					pp for party of {{peopleNum}}
					<span class="iconfont">&#xe666;</span>
				</div> -->

				<div class="select_people">
					<!-- {{peopleNum}} People <i class="iconfont">&#xe666;</i> -->
					<select class="select_people_box" v-model="peopleNum" @change="changePeople">
						<option :value="item.label" :key="index" v-for="(item,index) in participantsOptionFn()">{{item.selectparticipant}}</option>
					</select>
					<i class="iconfont">&#xe666;</i>
				</div>

				<div class="picinfo">
					<!-- <p v-if="picInfo.originalPrice">From <span class="oldpic">{{nowExchange.symbol}} {{returnFloat(picInfo.originalPrice)}}</span></p> -->
					<p>{{peopleNum?' ':(picInfo.unifiedPricing?'':'From ')}} <b>{{nowExchange.symbol}} {{peopleNum>0?returnFloat(retrunPrice()/peopleNum):returnFloat(picInfo.bottomPrice)}}</b>{{returnText(peopleNum)}}</p>
					
				</div>

				

				<div class="picRate">
					<select class="currency_type" id="changeCurrency" @change="changeCurrency" v-model="SelectCurrency">
						<option :value="item.code" v-for="item in exchange" :key="item.code">{{item.code}}</option>
					</select>
					<span class="iconfont">&#xe666;</span>
				</div>

				<div class="sales" v-if="detail.sales"> Booked {{detail.sales}} {{detail.sales==1?'time':'times'}} (last 30 days)</div>
				
			</div>

			<div class="toursMessage">
				<ul>
					<li class="clearfix">
						<label class="iconfont fs13">&#xeb0e;</label>
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


			<!-- 导游板块 -->
			<div class="guide_all" v-if="detail.guide.length">
				<h3>Travel with our experts</h3>
				<p>You can  select your best fit or let us assign one for you</p>
				<div class="guide_list">
					<div class="swiper-container js_guide">
						<div class="swiper-wrapper">
							<div class="swiper-slide" :class="{'active':checkGuideIndex===index}" v-for="(item,index) in detail.guide" :key="index" @click="showGuideFn(index,'ga')">
								<!-- <img :src="item.guidePhoto.headPortraitUrl" width="100%" alt=""> -->
								<div class="guide_list_head" :style="'background-image:url('+item.guidePhoto.headPortraitUrl+')'"></div>
								<span><i class="iconfont">&#xe654;</i></span>
							</div>
						</div>
					</div>
				</div>
			</div>

			<!-- 预定信息板块 -->
			<div class="check_all" id="check_all">
				<h3>Check Availability</h3>
				<ul class="check_info clearfix">
					<li>
						<i class="iconfont input_icon">&#xe60d;</i>
						<input id="js_changetime" v-model="startDate" readonly type="text" placeholder="Select Date">
						<!-- <div class="check_box" id="js_changetime">Select</div> -->
					</li>
					<li class="check_people">
						<i class="iconfont input_icon">&#xe63d;</i>
						<i class="iconfont arrow">&#xe60f;</i>
						<div class="check_people_text" :style="bookAdults>0?'color:#333;font-size:0.3rem;':'color:#888;font-size:0.3rem;'">{{adultsText}}</div>
						<select id="" v-model="bookAdults">
							<option :value="item" v-for="item in picInfo.maxParticipants" :key="item">{{(item>1?'Adults':'Adult')+' x '+item}}</option>
						</select>
					</li>
					<li class="check_people">
						<i class="iconfont input_icon">&#xe63d;</i>
						<i class="iconfont arrow">&#xe60f;</i>
						<div class="check_people_text" :style="bookChildren>0?'color:#333;font-size:0.3rem;':'color:#888;font-size:0.22rem;'">{{childrenText}}</div>
						<select id="" v-model="bookChildren">
							<option :value="0">Child x 0</option>
							<option :value="item" v-for="item in picInfo.maxParticipants-1" :key="item">{{(item>1?'Children':'Child')+' x '+item}}</option>
						</select>
					</li>
					<li>
						<div class="check_tip" v-show="checkTipText"><span>{{checkTipText}}</span></div>
						<div class="check_tip">Participants : {{picInfo.minParticipants}}-{{picInfo.maxParticipants}}. Free for infants under 3 years old.</div>
					</li>
					<!-- <li>
						<i class="iconfont input_icon">&#xe63d;</i>
						<i class="iconfont arrow">&#xe60f;</i>
						<input id="js_changepeople" @click="showChangePeople=true" readonly type="text" v-model="peopleText" placeholder="Select">
						<div class="change_people" v-show="showChangePeople">
							<dl>
								<dt>Adults</dt>
								<dd>
									<i class="iconfont change_btn" :class="{'change_btn_dis':changeAdults<2 || (changeAdults+changeChildren<picInfo.minParticipants+1)}" @click="peopleRed($event,1)">&#xe64d;</i>
									<span class="people_num">{{changeAdults}}</span>
									<i class="iconfont change_btn" :class="{'change_btn_dis':(changeAdults+changeChildren>=picInfo.maxParticipants)}" @click="peopleAdd($event,1)">&#xe64b;</i>
								</dd>
							</dl>
							<dl>
								<dt style="line-height:0.34rem;">Children<span>(Age 3-7)</span></dt>
								<dd>
									<i class="iconfont change_btn" :class="{'change_btn_dis':changeChildren<1 || (changeAdults+changeChildren<picInfo.minParticipants+1)}" @click="peopleRed($event,2)">&#xe64d;</i>
									<span class="people_num">{{changeChildren}}</span>
									<i class="iconfont change_btn" :class="{'change_btn_dis':(changeAdults+changeChildren>=picInfo.maxParticipants)}" @click="peopleAdd($event,2)">&#xe64b;</i>
								</dd>
							</dl>
							<span class="btn" @click="peopleChange">Done</span>
						</div>
					</li> -->
					<li v-show="!showPriceInfo">
						
						<span class="btn" @click="availability">Check availability</span>
						<span class="btn_inquire" @click="gaInquire">Inquire</span>
					</li>
				</ul>

				<!-- 绿色预定板块 -->
				<div class="book_all" v-show="showPriceInfo">

					<!-- 导游信息 -->
					<div v-if="detail.guide.length">
						<div class="book_guide_check" :class="{'active':checkGuideIndex===''}" @click="checkGuideIndex=''">
							<i></i>Let us assign one expert for you
						</div>
						<div class="book_guide_check" :class="{'active':checkGuideIndex!==''}" @click="showGuideFn(checkGuideIndex?checkGuideIndex:0,'ga')">
							<i></i>Select your best expert (free of charge)
						</div>
					</div>
					<div class="book_guide_info" v-if="checkGuideIndex!==''">
						<div class="book_guide_select" @click="showGuideFn(checkGuideIndex)">Reselect</div>
						<div class="book_guide_photo" :style="'background-image:url('+detail.guide[checkGuideIndex].guidePhoto.headPortraitUrl+')'"></div>
						{{detail.guide[checkGuideIndex].enName}} has been selected !
					</div>

					<!-- 价格明细 -->
					<div class="book_price_box">
						<dl class="book_price_info">
							<dt>
								<span>{{nowExchange.symbol}}{{perPersonPrice}}×{{bookPeople}} {{bookPeople>1?'People':'Person'}}</span>
								<span v-if="picInfo.childDiscount && bookChildren">-{{nowExchange.symbol}}{{returnFloat(picInfo.childDiscount*bookChildren)}} for {{bookChildren>1?'Children':'Child'}}</span>
							</dt>
							<dd>{{nowExchange.symbol}}{{price}}</dd>
							<!-- <a class="iconfont" href="#picDetails">&#xe659;</a> -->
						</dl>
						<dl class="book_price_info">
							<dt>Total ({{nowExchange.code}})</dt>
							<dd>
								<div class="picRate">
									<select class="currency_type" id="changeCurrency" @change="changeCurrency" v-model="SelectCurrency">
										<option :value="item.code" v-for="item in exchange" :key="item.code">{{item.code}}</option>
									</select>
									<span class="iconfont">&#xe666;</span>
								</div>
								{{nowExchange.symbol}}{{amount}}</dd>
						</dl>
						<div class="hr"></div>
						<p class="book_tip" v-if="picInfo.refundTimeLimit">You can get a 100% refund up to {{(picInfo.refundTimeLimit>2?picInfo.refundTimeLimit:24*picInfo.refundTimeLimit)}} {{picInfo.refundTimeLimit>2?'days':'hours'}} before your trip</p>
						<!-- {{picInfo.refundInstructions}} -->
						<span class="btn" @click="bookFn">Book</span>
						<span class="btn_inquire" @click="gaInquire">Inquire</span>
					</div>
				</div>

			</div>


			<div class="journey" ref="journey" v-if="detail.itineraries" id="Itinerary">
				<div class="expect">
					<h3 class='itinerary_title'>Itinerary</h3>
					<div class="introduction" :class="{'show':isShowMore}">
						<!-- introduction.length ||  -->
						<!-- <p :key="index" v-for="(j,index) in introduction">{{j}}</p> -->
						<ul>
							<li :key="index" v-for="(i,index) in itinerary">
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
						<a v-if="detail.itineraries.length>3" class="more" href="javascript:;" @click="fn">{{showMoreItinerary?'View More':'View Less'}}</a>	
					</div>

					<div class="itinerary_tip" v-if="detail.groupType=='Private'"><span class="red">*</span> If you want to adjust your itinerary, feel free contact us. Since the tour is private, our staff can help you make changes according to your needs.</div>
					
				</div>
			</div>
			 <!--<div class="notes" v-if="photoList.length>0" @click="showPhoto" id="photoList">
					<h3>Pictures of our travelers</h3>
					<div class="photoCover" v-lazy:background-image="photoList.length>0?photoList[0].url:''">
						<div class="mask"></div>
						<div class="cover">
							<h4>Check out our customers' travel experiences with us!</h4>
							<button>Have a look</button>
						</div>
					</div>

				</div>-->
			
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
				<div class="remark_more" @click="loadMoreRemark" v-if="records>3">Show more</div>
			</div>
			
			
			<div class="notes" id="notes" v-if="remark.length>0">
				<h3>Notes</h3>
				<p v-if="remark" :key="index" v-for="(item,index) in remark">{{item}}</p>
			</div>
			<!-- <div class="notes" v-if="detail.notice.length>0" id="notice">
				<h3>Additional Info</h3>
				<p v-for="(item,index) in detail.notice" :key="index">{{item.title}}</p>
			</div> -->
			<!-- <div class="notes" v-if="picInfo.priceInstructions" id="PriceNote">
				<h3>Price Note</h3>
				<p>{{picInfo.priceInstructions}}</p>
			</div> -->
			<div class="notes" v-if="picInfo.refundInstructions" id="CancellationPolicy">
				<h3>Rescheduling and Cancellation Policy</h3>
				<p v-html="picInfo.refundInstructions.replace(/\r\n/g,'<br>').replace(/\n/g,'<br>')"></p >
			</div>
			<div class="provide" v-if="picInfo.details.length>0" id="picDetails">
					<h3>Price Details</h3>
					<p class="childDiscount" v-if="picInfo.childDiscount">Children's price is  {{nowExchange.code}} {{nowExchange.symbol}}  {{returnFloat(picInfo.childDiscount)}}  less than adults' price.</p>

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
							<td><span>{{nowExchange.code}} {{nowExchange.symbol}} {{item.price}} </span></td>
							<td>
								<div v-show="item.capacity">
									<span>{{nowExchange.code}} {{nowExchange.symbol}} {{item.perPersonPrice}} </span>
								</div>
							</td>
						</tr>
					</table>
					<div class="view" v-if="isShowTable" @click="showTable">View More</div>
					<p v-if="picInfo.priceInstructions" class="picNote">{{picInfo.priceInstructions}}</p>
				</div>
				<div class="notes" v-if="detail.notice||(notice&&notice.length>0)" id="notice">
					<h3>Additional Info</h3>
					<p v-if="detail.notice&&!notice.length">{{detail.notice}}</p>
					<ul v-if="notice&&notice.length>0">
						<li v-for="item in notice">
							<h5>{{item.title}}</h5>
							<span v-if="item.content">{{item.content}}</span>
						</li>
					</ul>
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
										<!-- <div class="old-pic" v-if="i.originalPrice">{{nowExchange.symbol}}{{returnFloat(i.originalPrice)}}</div> -->
										<div class="current-price">From {{nowExchange.code}} <b>{{nowExchange.symbol}}{{returnFloat(i.bottomPrice)}}</b><span>  pp</span></div>
									</div>
								</div>
							</a>
						</div>
					</div>
				</div>
			</div>
		</div>
		<div class="book" v-show="showFixedBtn">
			<button @click="gaInquire">Inquire</button>
			<a class="bookBtn" @click="goCheck">Check availability</a>
		</div>
		<!--<photo :photoList="photoList" :alertPicStatus="alertPicStatus" @alert-call-back="setCallBack"></photo>-->


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

		

		<transition name="fade">
			<div class="win_bg" id="win_bg" @click="showWinBg = false" v-show="showWinBg"></div>
		</transition>


		<div class="guide_dialog" v-show="showGuideDetail">
			<div class="guide_dialog_header">
				<span class="iconfont" @click="showGuideDetail=false">&#xe606;</span>
				{{guideSwiperIndex+1}}/{{detail.guide.length}} Experts
			</div>

			<div class="swiper-container js_guide_detail">
				<div class="swiper-wrapper">
					<div class="swiper-slide" v-for="(item,index) in detail.guide" :key="index">
						<div class="guide_detail">
							<div class="guide_img" :style="'background-image:url('+item.guidePhoto.headPortraitUrl+')'"></div>
							<div class="guide_content">
								<h3>{{item.enName}}</h3>
								<p>Old Beijing history consultant</p>
								<p><b>Trips Given: </b>{{item.serviceTimes}}</p>
								<p><b>Birthplace: </b>{{item.birthplace}}</p>
								<p><b>Language(s): </b><span v-for="(Language,num) in item.guideLanguages">{{(num>0?' , ':'')+Language.language+'('+Language.level+')'}}</span></p>
								<p>{{item.selfIntro}}</p>
								<br>
							</div>
						</div>
						<div class="guide_dialog_footer">
							<div class="btn" @click="checkGuideFn(index)" v-if="checkGuideIndex===index"><i class="iconfont">&#xe654;</i> Successfully selected</div>
							<div class="btn" @click="checkGuideFn(index)" v-else>Select this expert</div>
						</div>
						
					</div>
				</div>
				<div class="swiper-button-prev iconfont">&#xe615;</div><!--左箭头-->
    		<div class="swiper-button-next iconfont">&#xe620;</div><!--右箭头-->
			</div>

			

		</div>

	</div>
	
</template>

<script>

import vue from 'vue'
import Flatpickr from 'flatpickr';
import {addmulMonth} from "~/assets/js/utils";
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
			//"photoList",
			"destination",
			"remarkData",
			"userABtestID",
			"ABtest",
			"isABtestShow",
			'value',
			"participants",
			"exchange",
			"calendar"
		],
		name: 'm-details',
		data() {
			//var participants = parseInt(this.$route.query.participants);
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
				
				//defaultCurrency : 'USD',
				nowExchange:{},//{'rate':1,'currency':'USD','symbol':'$'}
				//exchange:[],
				peopleNum:parseInt(this.participants)?parseInt(this.participants):0,
				showPeopleBox: false,
				
				itinerary:[],//行程折叠
				showMoreItinerary:false,
				SelectCurrency:'USD',
				participantsOption:[
					{
						selectparticipant:'',
						label:0

					},
					{
						selectparticipant:'1 person',
						label:1
					},
					{
						selectparticipant:'2 people ',
						label:2

					},
					{
						selectparticipant:'3 people',
						label:3

					},
					{
						selectparticipant:'4 people ',
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
			
			//选择日期和人数板块
			showFixedBtn:true,
			showWinBg:false,
			showChangePeople:false,
			showPriceInfo:false,
			startDate:'',
			adultsText:'Adults',
			childrenText:'Chlidren (age 3-'+this.picInfo.childStandard+')',
			checkTipText:'',
			changeAdults:1,
			changeChildren:0,
			bookAdults:0,
			bookChildren:0,
			bookPeople:0,
			price:0,
			perPersonPrice:0,
			amount:0,

			//导游
			showGuideDetail:false,
			guideSwiper:null,
			hasGuide:false,
			checkGuideIndex:'',
			guideSwiperIndex:0,
		}
	},
	components: {
		photo
	},
		methods: {
			
			retrunPrice(){
				var price = this.picInfo.details
				for(var i =0;i<price.length;i++){
					if(this.peopleNum==price[i].capacity){
						return price[i].price
					}
				}
			},
			participantsOptionFn(){
				var participants=this.participantsOption,
				minParticipants=this.picInfo.minParticipants,
				maxParticipants=this.picInfo.maxParticipants;
				
				var newParticipants=[];
				for(var i = 1;i<participants.length;i++){
					if(participants[i].label>=minParticipants&&participants[i].label<=maxParticipants){
						newParticipants.push(participants[i])
					}
				}
				newParticipants.unshift({
					selectparticipant:'',
					label:0
				})
				
				return newParticipants;
			},
			//行程展开收起
			fn(){
				this.showMoreItinerary=!this.showMoreItinerary
				if(this.showMoreItinerary){
					this.itinerary=this.detail.itineraries.concat().splice(0,3)
				}else{
					this.itinerary=this.detail.itineraries
				}

			},
			gaInquire(){
				ga('gtag_UA_107010673_2.send', {
						hitType: 'event',
						eventCategory: 'activity_detail',
						eventAction: 'click',
						eventLabel: 'activity_inquiry',
	
					});
					localStorage.setItem("owner",this.detail.owner)
					location.href='/info/inquiry?objectId='+this.id
			},
			changeCurrency(e){
				var self = this;
				var value = e.target ? e.target.value : e;
				var picInfo = this.picInfo;
				var thisDetail = picInfo.details;

				
				var exchange = this.exchange;
				//设置当前币种
				for(var i=0;i<exchange.length;i++){
					var thisEx = exchange[i];
				 	//检测当前货币类型
				 	if(thisEx.code==value){
						 self.nowExchange = thisEx;
					 }
				}
				
				
				//换算折扣价
				
				self.axios.get("https://api.localpanda.com/api/product/activity/"+this.id+"/price?currency="+value).then(function(res) {
							if(self.picInfo.childDiscount){
								self.picInfo.childDiscount=res.data.childDiscount
							}
							self.picInfo.bottomPrice=res.data.bottomPrice
							self.picInfo.currency=res.data.currency
							
							
					}, function(res) {
						
					});
					
					self.axios.get("https://api.localpanda.com/api/product/activity/"+this.id+"/price/detail?currency="+value+(self.participants?'&participants='+self.participants:'')).then(function(res) {
							self.picInfo.details=res.data
							
							//重设book价格
							self.setPeoplePrice();

							self.sixArr=res.data
							if(self.peopleNum>0){
								self.adultsPic =thisDetail[self.peopleNum-1].price;	
							}
							if(res.data.length>6){
								self.isShowTable=true
								self.sixArr=res.data.concat().splice(0,6);
							}else{
								self.sixArr=res.data;
							}
					}, function(res) {
						
					});
				
				//切换币种
				self.$emit('input',this.nowExchange);

				//请求推荐模块
				this.axios.get("https://api.localpanda.com/api/product/activity/"+this.id+"/recommend?currency="+value).then(function(res) {
					if(res.status==200){
						self.$emit('currencyChange',res.data);
					}
				}, function(res) {});
			},
			// setPriceData(){
			// 	var picInfo = this.picInfo;
			// 	var thisDetail = picInfo.details;
			// 	//设置默认价格和折扣价
			// 	picInfo.defaultPrice = {
			// 		bottomPrice: picInfo.bottomPrice,
			// 		originalPrice: picInfo.originalPrice
			// 	};
			// 	//儿童折扣
			// 	if(picInfo.childDiscount){
			// 		picInfo.defaultPrice.childDiscount = picInfo.childDiscount;
			// 	}
			// 	//设置人数列表价格
			// 	for(var i=0; i<thisDetail.length; i++){
			// 		var thisPrice = thisDetail[i].price;
			// 		thisDetail[i].defaultPrice = thisPrice;
			// 	}
			// },
			returnText(peopleNum){
				if(this.picInfo.unifiedPricing){
					return ' pp';
				}
				return peopleNum?(peopleNum==1?' for 1 person':' pp for party of '+ peopleNum):' pp '
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
				this.sixArr=this.picInfo.details
			},
			goBooking(){
				
				// if(this.isABtestShow){
				// 	ga(gaSend, {
				// 		hitType: 'event',
				// 		eventCategory: 'activity_detail',
				// 		eventAction: 'abtest_comment',
				// 		eventLabel: 'book',
				// 	});
				// }


				let objDetail={
					id:this.id,
					picInfo:this.picInfo,
					title:this.detail.title,
					pickup:this.detail.pickup,
					owner:this.detail.owner,
					refundTimeLimit:this.picInfo.refundTimeLimit,
					
				}
				console.log(objDetail)
				objDetail=JSON.stringify(objDetail)
				localStorage.setItem("objDetail",objDetail)
				
				location.href="/activity/check/"+this.detail.activityId;
			},
			zeroLength(text){
				var num = 0;
				for(var i=0;i<text.length;i++){
					var thisStr = text[i];
					if(thisStr==0 && i>1){
						num++;
					}
				}
				return num;
			},
			 returnFloat(value) {
				value*=1;
				if(value) {
					var numberArr = (''+value).split('.');
					if(numberArr.length>1 && numberArr[1].length>2){
						if(this.zeroLength(numberArr[1])>5){
							return value.toFixed(2);
						}else{
							return (value+0.005).toFixed(2);
						}
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
				Cookie.set('participants',this.peopleNum,{path:'/','expires':30})
				
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
			},

			///选择日期和人数
			checkInit(){
				var self = this;
				
				//团期日期
				var saleDate = [];
				for(var i=0;i<this.calendar.length;i++){
					var thisData = this.calendar[i];
					saleDate.push(thisData.saleDate);
				}


				this.options = {
					minDate: this.picInfo.earliestBookDate,
					maxDate: addmulMonth(this.picInfo.earliestBookDate, 12),
					disableMobile: true,
					enable: saleDate,
					onOpen : function(e){
						
						self.showWinBg = true;
					},
					onChange(){
						self.showWinBg = false;
					}
				}
				
				self.flatPickr = new Flatpickr('#js_changetime',this.options);
			},
			peopleRed(e,type){
				if(/change_btn_dis/.test(e.target.className)){
					return;
				};

				if(type==1){
					this.changeAdults--;
				}else{
					this.changeChildren--;
				};
			},
			peopleAdd(e,type){
				if(/change_btn_dis/.test(e.target.className)){
					return;
				};

				if(type==1){
					this.changeAdults++;
				}else{
					this.changeChildren++;
				}
			},
			// peopleChange(){
			// 	var changeChildren = this.changeChildren;
			// 	this.peopleText = 'Adult x '+this.changeAdults+(changeChildren?' , '+(changeChildren==1?'child':'children')+' x '+changeChildren:'');
			// 	this.showChangePeople = false;
			// 	this.showPriceInfo = true;
			// 	this.bookChildren = changeChildren;
			// 	this.bookPeople = this.changeAdults+changeChildren;
			// },
			setPeoplePrice(){
				var details = this.picInfo.details;
				var bookPeople = this.bookPeople;
				for(var i=0;i<details.length;i++){
					var thisData = details[i];
					if(thisData.capacity==bookPeople){
						this.price = thisData.price;
						this.perPersonPrice = thisData.perPersonPrice;
						this.amount = this.returnFloat(this.price - (this.picInfo.childDiscount?this.returnFloat(this.picInfo.childDiscount*this.bookChildren):0));
						break;
					}
				}
			},
			availability(){
				var self = this;
				var peopleStatus = this.peopleStatus();
				//判断日期
				if(!self.startDate){
					setTimeout(function(){
						self.flatPickr.open();
					},80);
					self.showWinBg = true;
				}else{
					this.validatePeople();
				}
				
				ga(gaSend, {
					hitType: "event",
					eventCategory: "activity_detail",
					eventAction: "click",
					eventLabel:"Check_availability"
				});

			},
			validatePeople(){
				var peopleStatus = this.peopleStatus();
				// var $check_people = document.querySelectorAll('.check_people');
				if(this.bookAdults + this.bookChildren==0){ //判断是否已选人数
					this.checkTipText = 'include at least one adult';
					// $check_people[0].style.borderColor = 'red';
				}else if(peopleStatus==0){ //判断人数对不对
					this.checkTipText = 'The minimum number of Participants is '+this.picInfo.minParticipants+' in total';
					this.showPriceInfo = false;
					// $check_people[0].style.borderColor = 'red';
					// $check_people[1].style.borderColor = 'red';
					return false;
				}else if(peopleStatus==2){
					this.checkTipText = 'Exceed the maximum number of Participants';
					this.showPriceInfo = false;
					// $check_people[0].style.borderColor = 'red';
					// $check_people[1].style.borderColor = 'red';
					return false;
				}else if(!this.bookAdults){
					this.checkTipText = 'include at least one adult';
					// $check_people[0].style.borderColor = 'red';
				}else{
					this.checkTipText = '';
					this.showPriceInfo = true;
					// $check_people[0].style.borderColor = '#ebebeb';
					// $check_people[1].style.borderColor = '#ebebeb';
					return true;
				}
			},
			showGuideFn(index,type){
				var self = this;
				this.showGuideDetail = true;
				//初始化过就不再初始化
				if(!self.guideSwiper){
					this.$nextTick(function(){
						self.guideSwiper = new Swiper('.js_guide_detail', {
							autoplay: false,//可选选项，自动滑动
							initialSlide:index,
							navigation: {
								nextEl: '.swiper-button-next',
								prevEl: '.swiper-button-prev',
							},
							on:{
								slideChangeTransitionEnd: function(){
									self.guideSwiperIndex = this.activeIndex;
								},
							},
						});
					});
				}else{
					//滑动到对应索引
					self.guideSwiper.slideTo(index, 0, function(){
						self.guideSwiperIndex = index;
					});
				}

				if(type){
					ga(gaSend, {
						hitType: "event",
						eventCategory: "activity_detail",
						eventAction: "click",
						eventLabel:"guide"
					});
				}

			},
			checkGuideFn(index){
				this.showGuideDetail = false;
				this.checkGuideIndex = index;
			},
			scrollFn($check_all){
				var top = document.documentElement.scrollTop || document.body.scrollTop;
				var boxTop = $check_all.offsetTop;
				var winH = window.innerHeight;
				if(top>boxTop-winH+100 && top<boxTop+$check_all.clientHeight){
					this.showFixedBtn = false;
				}else{
					this.showFixedBtn = true;
				}
			},
			//检测人数是否在产品可选人数之内
			peopleStatus(){
				var allPeople = this.bookAdults + this.bookChildren;
				var picInfo = this.picInfo;
				if(allPeople>=picInfo.minParticipants && allPeople<=picInfo.maxParticipants){
					return 1;
				}else if(allPeople<picInfo.minParticipants){
					return 0;
				}else{
					return 2;
				}
			},
			addZero(num){
				return num>9 ? num : '0'+num;
			},
			getRefundDate(dateStr,days){
				var dt = new Date(dateStr.replace(/\-/g,'/'));
				dt.setDate(dt.getDate()-days);
				return dt.getFullYear() + "-" +this.addZero(dt.getMonth()+1) + "-" + this.addZero(dt.getDate());
			},
			goCheck(){
				var checkTop = document.querySelector('#check_all').offsetTop;
				document.documentElement.scrollTop = document.body.scrollTop = checkTop;
			},
			hideScroll(val){
				if(val){
					document.querySelector('html').style.overflowY = 'hidden';
					document.querySelector('body').style.overflowY = 'hidden';
				}else{
					document.querySelector('html').style.overflowY = 'inherit';
					document.querySelector('body').style.overflowY = 'inherit';
				}
			},
			bookFn(){
				var self = this;
				if(!self.startDate){
					setTimeout(function(){
						self.flatPickr.open();
					},80);
					self.showWinBg = true;
					return false;
				}
				// else if(!this.bookAdults){
				// 	this.validatePeople();
				// 	return false;
				// }

				ga(gaSend, {
					hitType: "event",
					eventCategory: "activity_detail",
					eventAction: "click",
					eventLabel:"book_succeed"
				});
				
				var orderInfo = {
		      activityId: this.id,
		      amount: this.amount,
					currency: this.picInfo.currency,
					symbol: this.nowExchange.symbol,
					adultNum: this.bookAdults,
					refundTimeLimit: this.picInfo.refundTimeLimit,
				  fullRefund:this.picInfo.fullRefund,
				  finalRefundPeriod:(this.picInfo.fullRefund?this.getRefundDate(this.startDate,this.picInfo.refundTimeLimit):null),  //最后退款日期
					childrenNum: this.bookChildren,
					infantNum: 0,
					startDate: this.startDate, //出游时间
					startTime: null,  //
					adultsPic: this.price,
					title: this.detail.title,
					childDiscount: this.picInfo.childDiscount*this.bookChildren, //儿童优惠总价
					childDiscountP: this.picInfo.childDiscount,  //儿童优惠平均价
				  pickup: this.detail.pickup,
				  owner:this.detail.owner,
		      averagePrice: this.perPersonPrice, //人均价 
		      guideId: this.checkGuideIndex!=='' ? this.detail.guide[this.checkGuideIndex].guideId : null
				};
				
				
				orderInfo = JSON.stringify(orderInfo);
		    localStorage.setItem("orderInfo", orderInfo);
				location.href="/activity/booking/"+this.id;
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
			
			var ua = window.navigator.userAgent.toLowerCase();
			var isWx = (ua.match(/MicroMessenger/i) == 'micromessenger') ? true : false;
			
			var cookieCurrency = JSON.parse(Cookie.get('currency'));
			var currency= cookieCurrency ? cookieCurrency : (isWx ? {'code':'CNY','symbol':'¥'} : {'code':'USD','symbol':'$'});
			that.nowExchange=currency
			//that.picInfo.symbol = that.nowExchange.symbol;
			
			if(isWx && !cookieCurrency){
				//that.defaultCurrency = 'CNY';
				that.changeCurrency('CNY');
			}
			//this.picInfo.currency=currency.code
			//this.picInfo.defaultCurrency = this.picInfo.currency;
			//调整不同币种价格数据
			//that.setPriceData();
			if(that.picInfo.childDiscount){
				that.picInfo.childDiscountDefault = that.picInfo.childDiscount;
			}

			//行程折叠
		
			if(this.detail.itineraries&&this.detail.itineraries.length>0){
				if(this.detail.itineraries.length>3){
					this.showMoreItinerary=true
					this.itinerary=this.detail.itineraries.concat().splice(0,3)	
				}else{
					this.itinerary=this.detail.itineraries
				}
				
			}
			
			//设置价格详情页，渲染数据
			//that.detailAll = that.tableData(that.picInfo.details);
			
			if(that.picInfo.details.length>6){
				that.isShowTable=true
				that.sixArr=that.picInfo.details.concat().splice(0,6);
			}else{
				that.sixArr=that.picInfo.details;
			}

			//console.log(this.detail);

			//初始化日期选择
			this.checkInit();


			new Swiper('#swiper_tuijian', {
				lazy: true,
				slidesPerView :"auto",
				initialSlide: 0,
				spaceBetween:17,
			});


			new Swiper('.js_guide', {
				autoplay: false,//可选选项，自动滑动
				slidesPerView : 4.5
			});

			

			
			
			//根据最低成团人数修改默认人数
			// if(this.picInfo.minParticipants == 1 && this.picInfo.maxParticipants == 1){
			// 	this.peopleNum = 1;
			// }else if(this.picInfo.minParticipants>2 && this.peopleNum<=this.picInfo.minParticipants){
			// 	this.peopleNum = this.picInfo.minParticipants;
			// }

			if(this.peopleNum>this.picInfo.maxParticipants){
				this.peopleNum = this.picInfo.maxParticipants;
			}

			//选择人数默认最低
			if(this.peopleNum){
				this.bookAdults = this.peopleNum;
			}


			//var ua = window.navigator.userAgent.toLowerCase();
			//that.isWx = (ua.match(/MicroMessenger/i) == 'micromessenger') ? true : false;
			document.querySelector('.select_people_box option').setAttribute('hidden','hidden')

			var $check_all = document.querySelector('#check_all');
			window.onscroll = function(){
				that.scrollFn($check_all);
			}
			//console.log(this.remarkDataAll);
			

		},
		watch:{
			//监听币种变化
			value:function(val){
				this.nowExchange = val;
				this.SelectCurrency=val.code
				this.changeCurrency(val.code);
			},
			bookAdults:function(val){
				
				this.adultsText = (val>1?'Adults':'Adult')+' x '+val;
				
				//校验人数
				if(this.validatePeople()){
					this.bookPeople = val + this.bookChildren;
				}

				ga(gaSend, {
					hitType: "event",
					eventCategory: "activity_detail",
					eventAction: "select",
					eventLabel:"guests"
				});

				ga(gaSend, {
					hitType: "event",
					eventCategory: "activity_detail",
					eventAction: "select",
					eventLabel:"detail_select"
				});
				
			},
			bookChildren:function(val){
				
				this.childrenText = (val?(val==1?'Child':'Children')+' x '+val:'Chlidren (age 3-12)');

				//校验人数
				if(this.validatePeople()){
					this.bookPeople = val + this.bookAdults;
				}

				// ga(gaSend, {
				// 	hitType: "event",
				// 	eventCategory: "activity_detail",
				// 	eventAction: "select",
				// 	eventLabel:"Children"
				// });
			},
			bookPeople:function(){
				//设置价格
				this.setPeoplePrice();
			},
			showGuideDetail:function(val){
				this.hideScroll(val);
			},
			showWinBg:function(val){
				this.hideScroll(val);
			},
			startDate(){
				ga(gaSend, {
					hitType: "event",
					eventCategory: "activity_detail",
					eventAction: "select",
					eventLabel:"date"
				});

				ga(gaSend, {
					hitType: "event",
					eventCategory: "activity_detail",
					eventAction: "select",
					eventLabel:"detail_select"
				});

				
			}
		}
	}
</script>


<style lang="scss" scoped>
	// @import "~/assets/font/iconfont.css";
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
						display: inline-block;
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
								top: 50%;
								transform: translateY(-50%)
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
						.fs13{
							font-size: 0.26rem;
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
				font-size: 0.32rem;
				font-weight: bold;
				margin-top: 0.44rem;
			}
			.journey {
				padding-top: 0.4rem;
				padding-bottom: 0.64rem;
				border-bottom: 1px solid #dde0e0;
				.expect {
					.itinerary_title{
						font-size: 0.32rem;
						font-weight: bold;
						margin-bottom:0.4rem;
					}
					.introduction {
						
					
						p {
							font-size: 0.26rem;
							margin-top: 0.266666rem;
							&:first-child {
								margin-top: 0;
							}
						}
						.more{
							display:inline-block;
							
							font-size:0.26rem;
							color:#1bbc9d;
							font-weight:bold;
							margin-top:0.4rem;
						}
						ul {
							li {
								margin-top: 0.506666rem;
								.contTitle {
									h3 {
										font-size: 0.26rem;
										font-weight: bold;
									}
									p {
										font-size: 0.26rem;
										margin-top: 0.15rem;
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
				padding: 0.44rem 0;
				border-bottom: 1px solid #dde0e0;
				h3 {
					font-size: 0.32rem;
					font-weight: bold;
				}
				.childDiscount{
					margin-top: 0.22rem;
					font-size: 0.28rem;
				}
				ul {
					li {
						padding-left: 0.22rem;
						display: inherit;
						margin-top: 0.1rem;
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
							margin-top: 0.3rem;
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
					font-size: 0.32rem;
					font-weight: bold;
				}
				p {
					margin-top: 0.18rem;
					font-size: 0.26rem;
				}
				ul{
					li{
						padding-left: 0.22rem;
						display: inherit;
						margin-top: 0.1rem;
						font-size: 0.32rem;
						position: relative;
						h5 {
							font-size: 0.28rem;
						}
						span {
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
							margin-top: 0.3rem;
						}
					}
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
		.btn_inquire{
			display: block;
			height: 0.86rem;
			line-height: 0.86rem;
			text-align: center;
			color: #FFF;
			font-weight: bold;
			border-radius: 0.6rem;
			margin-top: 0.23rem;
			font-size: 0.32rem;
			border: solid 1px #1bbc9d;
			background: #fff;
			color: #1bbc9d;
			font-size:0.36rem;
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
			button,a{
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
				font-size: 0.32rem;
				&:last-child{
					margin-right: 0;
					background-image: linear-gradient(270deg, #009efd 0%, #1bbc9d 100%);
				}
				&:first-child{
					border: solid 1px #1bbc9d;
					background: #fff;
					color: #1bbc9d;
					font-size:0.36rem;
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


		.guide_all{
			width: 100vw;
			margin-left: -0.4rem;
			padding:0.36rem 0 0.5rem 0.4rem;
			box-sizing: border-box;
			color: #353a3f;
			background-color: #f5f7f6;
			margin-top: -1px;
			h3{
				font-size: 0.3rem;
				font-weight: bold;
			}
			p{
				font-size: 0.26rem;
			}
			.guide_list{
				width: calc(100vw - 0.4rem);
				margin-top: 0.4rem;
				.swiper-slide{
					border-radius: 50%;
					overflow: hidden;
					position: relative;
					img{ width: 100%; border: 4px solid #fff; box-sizing: border-box; border-radius: 50%;}
					.guide_list_head{
						width: 100%;
						padding-bottom: calc(100% - 8px);
						height: 0;
						border: 4px solid #fff; box-sizing: border-box; border-radius: 50%;
						background-position: center center;
						background-size: cover;
						background-repeat: no-repeat;
					}
					span{ 
						display: none; width: 100%; height: 100%; position: absolute; left: 0; top: 0; text-align: center;
						i{
							position: absolute; left: 50%; top: 50%; transform: translate(-50%,-50%); color: #1bbc9d;
						}
					}
				}
				.active{
					.guide_list_head{border-color:rgba(27,188,157,0.8);}
					span{
						display: block;
					}
				}
			}
		}

		.check_all{
			color: #353a3f;
			box-sizing: border-box;
			width: calc(100vw - 0.4rem);
			border: 2px solid #1bbc9d;
			margin-left: -0.2rem;
			margin-top: 0.58rem;
			padding: 0.3rem 0.3rem 0.4rem;
			border-radius: 6px;
			h3{
				font-size: 0.3rem;
				font-weight: bold;
			}
			.btn{ font-weight: bold;}
			.check_info{
				li{
					clear: both;
					position: relative;
					margin-top: 0.24rem;
					.check_box,input{
						line-height: 0.74rem;
						border: 1px solid #ebebeb;
						box-sizing: border-box;
						width: 100%;
						padding-left: 0.76rem;
						position: relative;
						z-index: 2;
						background: none;
						
						font-size: 0.28rem;
						color: #878e95;
						border-radius: 4px;
					}
					input{color: #353a3f;}
					input::-webkit-input-placeholder { color: #878e95; }
					.input_icon{
						position: absolute;
						left: 0;
						top: 0;
						width: 0.6rem;
						text-align: center;
						line-height: 0.76rem;
						color: #878e95;
						font-size: 0.36rem;
					}
					.arrow{
						width: auto;
						display: block;
						text-align: center;
						position: absolute;
						right: 0.1rem;
						top: 0;
						line-height: 0.76rem;
						color: #353a3f;
						font-size: 0.26rem;
						// border: 6px solid #000;
						// border-color: #000 #fff #fff #fff;
					}
					.check_tip{
						margin: 0 0 0.25rem;
						span{ color: red; display: inline-block; vertical-align: middle;}
					}
				}
				.check_people{
					width: 48%;
					float: left;
					clear: inherit;
					height: 0.78rem;
					border: 1px solid #ebebeb;
					box-sizing: border-box;
					margin-bottom: 0.25rem;
					&:nth-child(3){
						margin-left: 4%;
					}
					select{
						opacity: 0;
						border: none;
						height: 0.74rem;
						line-height: 0.74rem;
						width: 100%;
						position: relative;
						z-index: 2;
						box-sizing: border-box;
						padding-left: 0.7rem;
						background: none;
						appearance:none;
						-moz-appearance:none;
						-webkit-appearance:none;
						font-size: 0.28rem;
					}
					.check_people_text{ position: absolute; left: 0.6rem; top: 0; height: 0.74rem; line-height: 0.74rem; font-size: 0.22rem;}
				}
				.change_people{
					position: absolute; left: 0; top: calc(100% - 1px); width: 100%; box-sizing: border-box; padding: 0 0.26rem 0.36rem; background-color: #fff; z-index: 3;border: #ebebeb solid 1px;border-top:none; border-radius: 0 0 4px 4px;
					dl{
						overflow: hidden;
						padding: 0.44rem 0 0.2rem;
						&:nth-child(1){
							border-top: #ebebeb solid 1px;
						}
						dt{ float: left;line-height: 0.6rem; font-size: 0.28rem; font-weight: bold;
							span{ display: block;font-size: 0.24rem; line-height: 0.24rem; margin-top: 0.1rem;}
						}
						dd{ 
							float: right;
							.change_btn{
								display: inline-block;
								color: #1bbc9d;
								width: 0.6rem;
								height: 0.6rem;
								line-height: 0.6rem;
								text-align: center;
								border: 1px solid #1bbc9d;
								border-radius: 50%;
								font-size: 0.36rem;
							}
							.change_btn_dis{ color: #ccc; border-color: #ccc;}
							.people_num{
								display: inline-block;
								width: 0.8rem;
								text-align: center;
								font-size: 0.36rem;
								line-height: 0.6rem;
							}
						}
					}
					.btn{ height: 0.78rem; line-height: 0.78rem; margin-top: 0.3rem;}
				}

				
			}
			.book_all{
				margin-top: 0.5rem;
				.book_guide_check{
					padding-left: 0.7rem;
					overflow: hidden;
					font-size: 0.28rem;
					margin-bottom: 0.3rem;
					line-height: 0.38rem;
					i{ float: left; margin-left: -0.7rem; width: 0.38rem; height: 0.38rem; border: 1px solid #dde0e0; border-radius: 50%; box-sizing: border-box;}
				}
				.active{
					i{border: 6px solid #1bbc9d;}
				}
				.book_guide_info{
					font-size: 0.28rem;
					line-height: 0.78rem;
					.book_guide_select{
						float: right;
						color: #1bbc9d;
						text-decoration: underline;
					}
					.book_guide_photo{
						float: left;
						width: 0.78rem;
						height: 0.78rem;
						border-radius: 50%;
						overflow: hidden;
						margin-right: 0.3rem;
						background-position: center center;
						background-size: cover;
						background-repeat: no-repeat;
					}
				}
				.book_price_box{
					font-size: 0.28rem;
					margin-top: 0.3rem;
					.book_price_info{
						border-top: #ebebeb solid 1px;
						overflow: hidden;
						padding: 0.3rem 0;
						dt{
							float: left;
							span{
								display: block;
								line-height: 0.4rem;
							}
						}
						dd{
							float: right;
							
							.iconfont{
								font-size: 0.4rem;
								vertical-align: middle;
								color: #878e95;
								line-height: 0.24rem;
								margin-right: 5px;
								position: relative;
								top: -1px;
							}
							.picRate{
								
								.currency_type{
									height: auto;
									width: 100%;
									padding-right: 0.5rem;
									position: relative;
									z-index: 2;
								}
								.iconfont{
									height: auto;
									line-height: 100%;
									vertical-align: middle;
									top:2px;
									position: absolute;
									right: 0;
								}
							}
							
						}
					}
					.hr{ height: 1px; background-color: #ebebeb;}
					.book_tip{ margin-top: 0.3rem; font-size: 0.22rem;}
					.btn{margin-top: 0.6rem;}
				}
			}
		}
		.guide_dialog{
			position: fixed;
			left: 0;
			top: 0;
			z-index: 999;
			width: 100%;
			height: 100%;
			box-sizing: border-box;
			
			color: #353a3f;
			background-color: #f5f5f5;
			.guide_dialog_header{
				padding: 0 0.3rem;
				background-color: #f5f5f5;
				// padding: 0.3rem 0;
				font-size: 0.28rem;
				height: 1rem;
				line-height: 1rem;
				// color: #000;
				
				// position: fixed;
				// top: 0;
				// left: 0;
				// width: 100%;
				.iconfont{
					position: absolute;
					right: 0.3rem;
					top: 0;
					font-size: 0.4rem;
					padding: 0 0.2rem;
				}
			}
			.swiper-container{
				height: calc(100% - 1rem);
				.swiper-wrapper,.swiper-slide{
					height: 100%;
				}
				.swiper-button-next,.swiper-button-prev{
					width: 0.88rem;
					height: 0.88rem;
					border-radius: 50%;
					text-align: center;
					line-height: 0.88rem;
					color: #fff;
					font-size: 0.36rem;
					background: none;
					background-color: rgba(0,0,0,0.3);
					z-index: 99;
				}
				.swiper-button-next:focus,.swiper-button-prev:focus,.swiper-button-next:active,.swiper-button-prev:active{
					box-shadow: none;
					border: none;
				}
			}
			.guide_detail{
				height: calc(100vh - 2.2rem);
				overflow-y: auto;
				-webkit-overflow-scrolling: touch;
				background-color: #fff;
				margin: 0 0.3rem;
				.guide_img{
					
					height: 4.6rem;
					background-size: cover;
					background-position: center center;
					background-repeat: no-repeat;
					background-color: #fff;
				}
				
				
				.guide_content{
					padding: 0.4rem;
					box-sizing: border-box;
					
					h3{ font-size: 0.46rem;}
					p{ font-size: 0.26rem; margin-top: 0.15rem;
						b{ font-weight: bold;}
					}
				}
			}
			.guide_dialog_footer{
				position: fixed;
				bottom: 0;
				width: 100%;
				padding: 0.15rem 0.6rem;
				background-color: #f5f5f5;
			}
		}
	}


</style>

<style lang="scss">
	@import "~/assets/scss/plugin/flatpickr.min.css";

	.flatpickr-months .flatpickr-prev-month svg,
	.flatpickr-months .flatpickr-next-month svg {
		width: 20px!important;
		height: 20px!important;
	}
	.flatpickr-calendar{
		padding: 10px 0;
		width: 90%;
		max-width: 500px;
		position: fixed;
		left: 50%!important;
		top: 50%!important;
		right: auto!important;
		transform: translate(-50%,-50%);
		opacity: 1;
		visibility: initial;
		
		&.animate.open{
			animation: all 0 cubic-bezier(.23,1,.32,1);
			z-index: 999;
			opacity: 1;
		}
		.flatpickr-next-month,.flatpickr-prev-month{
			top: 5px;
		}
		.flatpickr-month{
			height: 40px;
		}
		
		.flatpickr-days,.flatpickr-weekdays,.flatpickr-rContainer,.dayContainer{
			width: 100%;
			max-width: none;
		}
		.flatpickr-day{
			max-width: none;
			height: 7vh;
			max-height: 45px;
		}
	}
	.flatpickr-calendar.open:before,.flatpickr-calendar.open:after{
		display: none;
	}
	.flatpickr-calendar .flatpickr-day.nextMonthDay,.flatpickr-calendar .flatpickr-day.prevMonthDay{
		color: #393939;
	}
	.flatpickr-calendar .flatpickr-day.disabled, .flatpickr-day.disabled:hover{
		color:rgba(57, 57, 57, .3);
	}

	
	#launcher {
		bottom: 0.266666rem!important;
	}
	input::-webkit-input-placeholder, textarea::-webkit-input-placeholder {   
	 /* WebKit browsers */   
	color: #878e95;   
	}   
	input:-moz-placeholder, textarea:-moz-placeholder {   
	/* Mozilla Firefox 4 to 18 */   
	color: #878e95   
	}   
	input::-moz-placeholder, textarea::-moz-placeholder {   
	 /* Mozilla Firefox 19+ */   
	color: #878e95
	}   
	input:-ms-input-placeholder, textarea:-ms-input-placeholder {   
	 /* Internet Explorer 10+ */   
	color: #878e95  
	}
	.dateTime {
		
		.flatpickr-input {
			border: none!important;
			padding-left: 0!important;
			height: 1.4rem!important;
			text-align: right;
			color: #1bbc9d;
			font-size: 0.36rem!important;
			width: 100%;
			
		}
		
	}



	.m-details{
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
			
			line-height: 0.74rem;
			
				p {
					position: absolute;;
					right:0.8rem;
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
					
					line-height: 0.8rem;
					padding: 0 0.2rem 0 0.2rem;
					background: none;
					border: none;
					appearance:none;
					-moz-appearance:none;
					-webkit-appearance:none;
					position: relative;
					z-index: 2;
					opacity: 0;
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
	}
</style>