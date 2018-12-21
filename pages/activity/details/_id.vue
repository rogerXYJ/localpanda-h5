<template>
	<div id="activitiesDetail">
		<Head :nowCurrency="nowExchange" @headCurrency="headCurrencyFn"></Head>
		<!-- 面包屑 -->
		<div class="crumbs">
			<a href="/">Home</a> <i class="iconfont">&#xe64a;</i>
			<a :href="'/activity/list/'+detail.destinations[0]">{{detail.destinations[0]}} Activities</a>
		</div>

		<!-- banner -->
		<div class="banner">
			<div class="swiper-container" id="swiper_bannerbox">
				<div class="swiper-wrapper">
					<div class="swiper-slide" :key="index" v-for="(slide, index) in detail.bannerPhotos">
						<img v-lazy="slide.url" lazy="error"  />
					</div>
				</div>
				<div class="swiper-pagination" id="swiper_banner_pagination"></div>
			</div>
		</div>

		<!-- 产品标题信息 -->
		<div class="detail_box activity_top">
			<h2><span :class="{'private':detail.groupType=='Private'}" v-if="detail.groupType">{{detail.groupType}}</span>{{detail.title}}</h2>
			<!-- 币种信息 -->
			<div class="price_info clearfix">
				

				<div class="select_people" :class="{'unified_pricing':picInfo.unifiedPricing}">
					{{returnText(participants)}}
					<select class="select_people_box" v-model="participants" @change="changePeople">
						<option :value="item.people" :key="index" v-for="(item,index) in participantsData">{{item.text}}</option>
					</select>
					<i class="iconfont">&#xe666;</i>
				</div>
				<p> {{nowExchange.symbol}} {{participants>0?returnFloat(getPeoplePrice(participants,true)):returnFloat(picInfo.bottomPrice)}}</p>

				
				<div class="price_select_box">
					<small v-if="participants==0 && !picInfo.unifiedPricing">From</small>
					<select v-model="selectCurrency">
						<option :value="item.code" :key="index" v-for="(item,index) in exchange">{{item.code}}</option>
					</select>
					<i class="iconfont">&#xe666;</i>
				</div>
			</div>
			<div class="price_tip" v-if="!participants && !picInfo.unifiedPricing">Price based on group of {{getBottomCapacity()}}</div>
			<!-- 预定和点评次数 -->
			<div class="booking_info" v-if="detail.sales">
				<!-- <span v-if="reviewsData && reviewsData.records">( {{reviewsData.records}} )</span>
				<div v-if="reviewsData && reviewsData.records" class="reviews_star" v-html="reviewsStarHtml(6)"></div> -->
				Booked {{detail.sales}} {{detail.sales>1?'times':'time'}} (last 30 days)
			</div>

			<!-- 产品基本信息 -->
			<ul class="activity_info">
				<!-- Duration -->
				<li v-if="/DAY/.test(detail.durationUnit)"><i class="iconfont">&#xe624;</i>Duration : {{detail.duration}} {{setTimeStr(detail.duration,detail.durationUnit)}}</li>
				<li @click="durationInfoGa" v-else><i class="iconfont">&#xe624;</i>Duration : {{detail.duration}} {{setTimeStr(detail.duration,detail.durationUnit)}} <span class="iconfont" v-if="!/DAY/.test(detail.durationUnit)">&#xe689;</span></li>
				
				<li v-if="getPickupTitle(detail.pickup) && detail.category!='Ticket' && detail.statement" @click="pickupGa"><i class="iconfont">&#xe68a;</i>{{getPickupTitle(detail.pickup)}} <span class="iconfont">&#xe689;</span></li>

				<!-- 语言 -->
				<li v-if="detail.groupType=='Group'"><i class="iconfont">&#xe627;</i>Offered in English</li>
				<li @click="languageGa" v-else-if="detail.category!='Ticket'"><i class="iconfont">&#xe627;</i>English (and other languages)-speaking guide <span class="iconfont">&#xe689;</span></li>

				<li v-if="detail.destinations.length>1"><i class="iconfont">&#xe610;</i>{{detail.destinations.join(', ')}}</li>
				<li v-if="picInfo.fullRefund===1"><i class="iconfont">&#xe688;</i>Free cancellation  up to {{(picInfo.refundTimeLimit>2?picInfo.refundTimeLimit+' days':24*picInfo.refundTimeLimit+' hours')}} before your trip</li>
				<li v-if="detail.limits"><i class="iconfont">&#xe68b;</i>{{detail.limits}}</li>
			</ul>

		</div>
		
		<!-- Why you’ll love this trip -->
		<div class="detail_box why">
			<h3><i></i>Why you'll love this trip</h3>
			<p class="detail_p">{{detail.recommendedReason}}</p>
			
			<ul class="detail_txt_list">
				<li v-for="item in getTextArr(detail.highlights)" :key="item"><i class="dian"></i>{{item}}</li>
			</ul>
		</div>

		<!-- 导游 -->
		<div class="detail_box guide" v-if="detail.guide">
			<h3><i></i>Explore our guides</h3>
			<p class="gray">Select your preference below</p>

			<div class="guide_list">
				<div class="swiper-container js_guide">
					<div class="swiper-wrapper">
						<div class="swiper-slide" :class="{'active':checkGuideIndex===index}" v-for="(item,index) in detail.guide" :key="index" @click="showGuideFn(index,'ga')">
							<!-- <img :src="item.guidePhoto.headPortraitUrl" width="100%" alt=""> -->
							<div class="guide_list_head" v-lazy:background-image="item.guidePhoto.headPortraitUrl"></div>
							<span><i class="iconfont">&#xe654;</i></span>
						</div>
					</div>
				</div>
			</div>
		</div>


		<!-- 预定板块 -->
		<div class="detail_box check" id="check_all">
			<div class="check_all_box">
				<h3>Available On</h3>
				<ul class="check_info clearfix">
					<li class="available_on">
						<i class="iconfont input_icon">&#xe60d;</i>
						<input id="js_changetime" v-model="startDate" readonly type="text" placeholder="Select Date">
						<input class="time_box" :value="formatDate(startDate)" readonly type="text" placeholder="Date">
						<i class="iconfont arrow">&#xe60f;</i>
					</li>
					<li class="check_people">
						<i class="iconfont input_icon">&#xe63d;</i>
						<i class="iconfont arrow">&#xe60f;</i>
						<div class="check_people_text" :style="bookAdults>0?'color:#333;font-size:0.28rem;':'color:#888;font-size:0.28rem;'">{{adultsText}}</div>
						<select id="" v-model="bookAdults">
							<option :value="item" v-for="item in picInfo.maxParticipants" :key="item">{{(item>1?'Adults':'Adult')+' x '+item}}</option>
						</select>
					</li>
					<li class="check_people">
						<i class="iconfont input_icon">&#xe63d;</i>
						<i class="iconfont arrow">&#xe60f;</i>
						<div class="check_child_text" :style="bookChildren>0?'color:#333;font-size:0.28rem;':'color:#888;font-size:0.22rem;'">{{childrenText}}</div>
						<select id="" v-model="bookChildren">
							<option :value="0">Child x 0</option>
							<option :value="item" v-for="item in picInfo.maxParticipants-1" :key="item">{{(item>1?'Children':'Child')+' x '+item}}</option>
						</select>
					</li>
					<li>
						<div class="check_tip" v-show="checkTipText"><span>{{checkTipText}}</span></div>
						<div class="check_tip">Participants : {{picInfo.minParticipants}}-{{picInfo.maxParticipants}}. Free for infants under 3 years old.</div>
					</li>
					<li v-show="!showPriceInfo">
						<span class="btn" @click="availability">Book</span>
						<!-- <div class="inquire_box">
							Got questions before booking? <span @click="gaInquire">Contact Us</span>
						</div> -->
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
								<span>{{nowExchange.symbol}}{{returnFloat(perPersonPrice)}}×{{bookPeople}} {{bookPeople>1?'Travelers':'Traveler'}}</span>
								<span v-if="picInfo.childDiscount && bookChildren">-{{nowExchange.symbol}}{{returnFloat(picInfo.childDiscount*bookChildren)}} for {{bookChildren>1?'Children':'Child'}}</span>
							</dt>
							<dd>{{nowExchange.symbol}}{{returnFloat(price)}}</dd>
						</dl>
						<dl class="book_price_info">
							<dt>Total Amount</dt>
							<dd>
								<div class="price_select_box">
									<select v-model="selectCurrency">
										<option :value="item.code" :key="index" v-for="(item,index) in exchange">{{item.code}}</option>
									</select>
									<i class="iconfont">&#xe666;</i>
								</div>
								{{nowExchange.symbol}}{{amount}}</dd>
						</dl>
						<div class="hr"></div>
						<p class="book_tip" v-if="picInfo.refundTimeLimit && picInfo.fullRefund===1">Free cancellation  up to {{(picInfo.refundTimeLimit>2?picInfo.refundTimeLimit+' days':24*picInfo.refundTimeLimit+' hours')}} before your trip</p>
						<!-- {{picInfo.refundInstructions}} -->
						<span class="btn" @click="bookFn">Book</span>
						<span class="btn_inquire" @click="gaInquire">Inquire</span>
						<!-- <div class="inquire_box">
							Got questions before booking? <span @click="gaInquire">Contact Us</span>
						</div> -->
					</div>
				</div>
			</div>
		</div>

		<!-- 行程板块 -->
		<div class="detail_box itinerary" v-if="detail.itinerary.length">
			<h3><span class="btn_viewall" @click="itineraryViewall">View all</span><i></i>Experience Details</h3>
			<div class="itinerary_tip" v-if="detail.groupType=='Private'">Our staff can help you make changes to your itinerary since this is a private tour.</div>
			<dl class="itinerary_list" v-for="(items,index) in detail.itinerary" :key="index">
				<dt @click="itineraryFn" v-if="items.description"><i class="iconfont i_down">&#xe667;</i><i class="iconfont i_up">&#xe666;</i><span></span>{{items.title}}</dt>
				<dt v-else><span></span>{{items.title}}</dt>
				<dd>
					<p>{{items.description}}</p>
					<img v-if="items.photo" v-lazy="items.photo.url" alt="">
				</dd>
			</dl>
		</div>

		<!-- 相似产品推荐1 -->
		<div class="detail_box similar" v-if="detail.manual.records">
			<h3><i></i>Similar Experiences</h3>
			<ul class="similar_list_manual">
				<li :key="index" v-for="(i,index) in detail.manual.entities">
					<!--  v-show="participants==0 || participants && i.perPersonPrice" -->
					<a @click="similarFn(i.activityId)">
						<h4><span class="tag" :class="{'private':i.groupType=='Private'}" v-if="i.groupType">{{i.groupType}}</span> {{i.shortTitle?i.shortTitle:i.title}} <span class="tag_time">{{i.duration}} {{setTimeStr(i.duration,i.durationUnit)}}</span>	</h4>
						<div class="similar_list_foot">
							<span class="price"><i class="gray">{{participants==0?'From':''}}</i><b>{{nowExchange.code}} {{nowExchange.symbol}}{{participants==0?returnFloat(i.bottomPrice):returnFloat(i.perPersonPrice)}}</b>{{returnText(participants)}}</span>
						</div>

						<i class="iconfont similar_arrow">&#xe64a;</i>
					</a>
				</li>
			</ul>
		</div>

		<!-- 其他产品信息 -->
		<div class="detail_box other_box">
			
			<div class="other_list" v-if="inclusions.length">
				<!--  || detail.pickup -->
				<h3 @click="otherFn"><span class="iconfont i_down">&#xe667;</span><span class="iconfont i_up">&#xe666;</span><i></i>Inclusions</h3>
				<div class="other_content">
					<ul class="detail_txt_list">
						<li v-for="(item,index) in inclusions" :key="index">
							<i class="iconfont">&#xe65c;</i>{{item.title}}
							<p>{{item.content}}</p>
						</li>
						<li v-if="detail.pickup !== 0 && detail.category!='Ticket' && detail.statement">
							<i class="iconfont">&#xe65c;</i>{{getPickupTitle(detail.pickup)=='Pick-up included, drop-off excluded'?'Pick-up included':getPickupTitle(detail.pickup)}}
							<p v-html="enterToBr(detail.statement)"></p>
						</li>
					</ul>
					
				</div>
			</div>

			<div class="other_list" v-if="exclusions.length">
				<h3 @click="otherFn"><span class="iconfont i_down">&#xe667;</span><span class="iconfont i_up">&#xe666;</span><i></i>Exclusions</h3>
				<div class="other_content">
					<ul class="detail_txt_list">
						<li v-for="(item,index) in exclusions" :key="index">
							<i class="iconfont red">&#xe606;</i>{{item.title}}
							<p>{{item.content}}</p>
						</li>
					</ul>
				</div>
			</div>

			<div class="other_list" v-if="detail.pickup===0 && detail.category !== 'Ticket'">
				<h3 @click="otherFn"><span class="iconfont i_down">&#xe667;</span><span class="iconfont i_up">&#xe666;</span><i></i>Meeting Point Info</h3>
				<div class="other_content">
					<ul class="detail_txt_list">
						<li v-for="(item,index) in detail.venues" :key="index"><i class="dian"></i>{{item}}</li>
					</ul>
				</div>
			</div>
			<div class="other_list" v-else-if="detail.category == 'Ticket' &&　getTextArr(detail.statement).length">
				<h3 @click="otherFn"><span class="iconfont i_down">&#xe667;</span><span class="iconfont i_up">&#xe666;</span><i></i>Usage Instructions</h3>
				<div class="other_content">
					<ul class="detail_txt_list">
						<li v-for="(item,index) in getTextArr(detail.statement)" :key="index"><i class="dian"></i>{{item}}</li>
					</ul>
				</div>
			</div>

			<div class="other_list" v-if="delEnter(detail.remark) || notice.length">
				<h3 @click="otherFn"><span class="iconfont i_down">&#xe667;</span><span class="iconfont i_up">&#xe666;</span><i></i>{{delEnter(detail.remark)?'Important Info':'Additional Info'}}</h3>
				<div class="other_content">
					<ul class="detail_txt_list">
						<li v-for="item in getTextArr(detail.remark)" :key="item">
							<i class="dian"></i>{{item}}
						</li>
						<h4 v-if="notice.length && delEnter(detail.remark)">Additional Info</h4>
						<li v-for="(item,index) in notice" :key="index">
							<i class="dian"></i>{{item.title}}
							<p>{{item.content}}</p>
						</li>
					</ul>
				</div>
			</div>

			<div class="other_list" v-if="delEnter(picInfo.refundInstructions)">
				<h3 @click="otherFn"><span class="iconfont i_down">&#xe667;</span><span class="iconfont i_up">&#xe666;</span><i></i>Rescheduling & Cancellation Policy</h3>
				<div class="other_content">
					<p class="detail_p detail_p_mt" v-for="(item,index) in getTextArr(picInfo.refundInstructions)" :key="index">{{item}}</p>
					<!-- <ul class="detail_txt_list">
						<li v-for="(item,index) in getTextArr(picInfo.refundInstructions)" :key="index"><i class="dian"></i>{{item}}</li>
					</ul> -->
				</div>
			</div>

		</div>

		<!-- 点评 -->
		<div class="detail_box reviews" v-if="reviewsData &&　reviewsData.records">
			<div class="reviews_title">
				<span class="reviews_num">{{reviewsData.records}} {{reviewsData.records==1 ? 'Review':'Reviews'}}</span>
				<div class="reviews_star" v-html="reviewsStarHtml(reviewsData.avgScore)"></div>
			</div>
			<div class="reviews_list" v-for="(item,index) in reviews" :key="index">
				<div class="reviews_list_top">
					<div class="reviews_star" v-html="reviewsStarHtml(item.score)"></div>
					<div class="reviews_photo">
						<span class="reviews_photo_def" v-if="!item.userPortraitPhoto">{{item.userName.substring(0,1)}}</span>
						<div class="reviews_photo_img" v-lazy:background-image="item.userPortraitPhoto.url" v-else></div>
						<!-- <img v-else v-lazy="item.userPortraitPhoto?item.userPortraitPhoto.url:''" alt=""> -->
					</div>
					<div class="reviews_list_info">
						<h5>{{item.userName}}</h5>
						<p>{{item.createTime.substring(0,10)}}</p>
						<!-- May 24,2018 -->
					</div>
				</div>
				<div class="reviews_list_content" :content="item.content">{{item.content.length>200?item.content.substring(0,200)+'...':item.content}} <span class="reviews_text_more" v-if="item.content.length>200" @click="reviewsShowMore">View More</span> </div>
				<ul class="reviews_img_s">
					<li v-if="item.userCommentPhoto" v-for="(itemChild,index2) in item.userCommentPhoto" @click="showBigPic(index,index2)" :key="index2"><img v-lazy="itemChild.url" alt=""></li>
				</ul>
			</div>
			<div class="reviews_more" @click="loadMoreReviews" v-if="reviewsData && reviewsData.records>3 && reviewsData.records>reviews.length">Show more</div>
		</div>


		<!-- 相似产品推荐2 -->
		<div class="detail_box experiences">
			<h3><i></i>Other People Also Choose</h3>
			<div class="swiper-container" id="swiper_experiences">
				<div class="swiper-wrapper">
					<div class="swiper-slide" :key="index" v-for="(i,index) in detail.recommend.entities">
						<a @click="alsoFn(i.activityId)">
							<div class="activity-pic">
								<img v-lazy="i.coverPhotoUrl">
							</div>
							<div class="activity-cont">
								<div class="activity-info clearfix">
									<div class="activity-cont-type"><i class="iconfont">&#xe653;</i>{{i.category}}{{i.groupType?' · '+i.groupType:''}}</div>
									
								</div>

								<h4 style="-moz-box-orient: vertical;
									-webkit-box-orient:vertical;">{{i.title}}</h4>
								<div class="duration"><i class="iconfont">&#xe624;</i>Duration: {{i.duration}} {{setTimeStr(i.duration,i.durationUnit)}}</div>
								<div class="pic">
									<div class="current-price">{{participants==0?'From':''}} {{nowExchange.code}} <b>{{nowExchange.symbol}}{{participants==0?returnFloat(i.bottomPrice):returnFloat(i.perPersonPrice)}}</b><span>  {{returnText(participants)}}</span></div>
								</div>
							</div>
						</a>
					</div>
				</div>
			</div>
		</div>


		<div class="bookBtnBox" v-show="showFixedBtn">
			<a @click="gaInquire">Inquire</a>
			<a class="bookBtn" @click="goCheck">Book</a>
		</div>
		

		<!-- 公底部 -->
		<foot></foot>

		<!-- 导游弹窗 -->
		<div class="guide_dialog" v-show="showGuideDetail">
			<div class="guide_dialog_header">
				<span class="iconfont" @click="showGuideDetail=false">&#xe606;</span>
				{{guideSwiperIndex+1}}/{{detail.guide.length}} {{detail.guide.length>1?'Experts':'Expert'}}
			</div>

			<div class="swiper-container js_guide_detail">
				<div class="swiper-wrapper">
					<div class="swiper-slide" v-for="(item,index) in detail.guide" :key="index">
						<div class="guide_detail">
							<div class="guide_img" v-lazy:background-image="item.guidePhoto.headPortraitUrl"></div>
							<div class="guide_content">
								<h3>{{item.enName}}</h3>
								<p>{{item.slogan}}</p>
								<p><b>Trips Given: </b>{{item.serviceTimes}}</p>
								<p><b>Birthplace: </b>{{item.birthplace}}</p>
								<p><b>Language(s): </b><span v-for="(Language,num) in item.guideLanguages" :key="num">{{(num>0?' , ':'')+Language.language+'('+Language.level+')'}}</span></p>
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

		<!-- 日历遮罩 -->
		<transition name="fade">
			<div class="win_bg" id="win_bg" @click="showWinBg = false" v-show="showWinBg"></div>
		</transition>


		<!-- 顶部Duration信息弹层 -->
		<dialogBox title="Duration tips" v-model="showDurationInfo" width="90%" height="auto">
			<div class="dialog_tip_info">All trips start when you meet your tour guide (or driver if the trip does not include a guide), and conclude when you depart from your tour guide (or driver).
				<p v-if="detail.groupType=='Private'">Since this is a private trip, you can appoint the starting time of your trip when booking.</p>
			</div>
		</dialogBox>

		<!-- 顶部Languages信息弹层 -->
		<dialogBox title="Other languages" v-model="showLanguagesInfo" width="90%" height="auto">
			<div class="dialog_tip_info">* Le français<br>
* Deutsch<br>
* Español<br>
* Português<br>
* русский язык<br>
* 日本語<br>
* 한국어<br><br>
Price may vary depending on the language. If you need guides in other languages, feel free to contact us.</div>
		</dialogBox>

		<!-- 顶部Pickup信息弹层 -->
		<dialogBox title="Tips" v-model="showPickupInfo" width="90%" height="auto">
			<div class="dialog_tip_info" v-html="enterToBr(detail.statement)"></div>
		</dialogBox>
		


		<!-- 点评弹层 -->
		<div class="swiper-container swiper_reviews" id="swiper_reviews" v-show="showReviewsPic">
			<div class="swiper-wrapper">
				<div class="swiper-slide" :key="index" v-for="(item,index) in thisReviewsData.userCommentPhoto" v-if="thisReviewsData">
					<!-- </div> -->
					<div class="swiper-zoom-container">
						<p></p>
						<img class="image" :src="item.url">
					</div>
				</div>					
			</div>
			<div class="reviews_num">{{reviewsIndex}} / {{thisReviewsData.userCommentPhoto?thisReviewsData.userCommentPhoto.length:0}}</div>
			<div class="reviews_close" @click="closeBigPic"><i class="iconfont">&#xe606;</i></div>
		</div>


		<!-- inquiry弹层 -->
		<dialogBox v-model="dialogInquiryStatus" @confirmCallback="confirmCallback" width="100%">
			<inquiry :objectId="id" @inquiryCallback="inquiryCallback"></inquiry>
		</dialogBox>


		<!-- service弹窗 -->
		<dialogBox v-model="dialogStatus" confirmShow="true" confirmText="Confirm" @confirmCallback="serviceConfirmCallback" @closeCallback="serviceConfirmCallback" width="100%">
			<div class="service_box">
        <div class="tip_title"> Thank you. You have submitted <br> your Inquiry successfully! <br>We will get back to you within 1 day.</div>
				<p class="tip_detail">A confirmation email has been sent to “{{inqueryEmailOld}}”,<br>Please check. If you have not received it, please check your junk mail folder. If you still do not see it,<br>please <a @click="showEmailBox=true">click here</a> to enter your correct or alternative email address.</p>
				<div class="email_box" v-show="showEmailBox">
					<input type="text" v-model="inqueryEmail">
          <div class="email_tip red" v-show="emailTip">Please enter a valid email</div>
          <div class="email_tip green" v-show="emailSendTip"><i class="iconfont">&#xe654;</i> Email address has been updated ,and We have sent an email to your new mailbox</div>
					<span class="btn_sendemail" @click="sendEmail">Resend email address</span>
				</div>
			</div>
			<service></service>
		</dialogBox>


	</div>
</template>

<script>

	import Vue from 'vue';
	import Head from '~/components/header/index';
	import foot from "~/components/footer/index";
	import dialogBox from '~/plugins/panda/dialogBox';
	import inquiry from '~/components/info/inquiry/inquiry'
	import service from '~/components/info/inquiry/service';
	import {addmulMonth,formatDate} from "~/assets/js/utils";
	import Flatpickr from 'flatpickr';

	export default {
		name: "activitiesDetail",
		async asyncData({
			route,
			store,
			error,
			apiBasePath,
			redirect,
			req
		},callback) {
			
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


			//获取IP 
			var ABType = 'A';
			if(userCookie.ABType){
				ABType = userCookie.ABType;
			}else{
				var ip = req.headers['x-real-ip'],
					ipNum = ip.split('.').join('')%2;
				if(ipNum){ //奇数
					ABType = 'B'
				}
				console.log('IP:'+ip);
			}

			//console.log(userCookie.currency);

			//node请求时间
			var consoleTimeS = new Date().getTime();
			console.log('node start time:'+consoleTimeS);

			let id = route.params.id;
			// 服务端渲染部分 这部分操作还没有页面实例，只是初始化页面数据
			let data = {
				ABType: ABType,
				id: id,
				detail: {}, //详情数据
				logIn: "",
				toast: "This activity was booked by another guest an hour ago",
				toastShow: false,
				participants:0,
				exchange:[],
				calendar:[],
				people:0,

				//点评
				reviews:[],
				reviewsData:[],

				//选择日期和人数板块
				showFixedBtn:true,
				showWinBg:false,
				showChangePeople:false,
				showPriceInfo:false,
				startDate:'',
				adultsText:'Adults',
				childrenText:'',
				checkTipText:'',
				changeAdults:0,
				changeChildren:0,
				bookAdults:0,
				bookChildren:0,
				bookPeople:0,
				price:0,
				perPersonPrice:0,
				amount:0,

				// 币种
				nowExchange:{code: "USD", symbol: "$"},
				selectCurrency:'USD',
			};

			//设置币种
			if(userCookie.currency){
				data.nowExchange = JSON.parse(decodeURIComponent(userCookie.currency));
				data.selectCurrency = data.nowExchange.code;
			}
			//设置人数
			if(userCookie.participants){
				data.participants=JSON.parse(decodeURIComponent(userCookie.participants))
			}else if(ABType=='B'){
				data.participants=2;
			}

			
			try {
				//基本信息
				var Promise1 = new Promise(function(resolve, reject){
					Vue.axios.get(apiBasePath + "product/activity/" + id).then(function(res) {
						
						//获取可售日期
						if(!res.data.allAvailable){
							Vue.axios.get(apiBasePath + "product/activity/"+id+"/sale/calendar").then(function(response) {
								data.calendar = response.data?response.data:[];
								resolve(res);
							}, function() {
								resolve(res);
							});
						}else{
							resolve(res);
						}
					}, function(res) {
						resolve(res);
					});
				});

				
				//推荐信息
				var recommendOptions = {
					"id": id,
					'currency':data.nowExchange.code,
					'pageNum':1,
					'pageSize':3
				};
				if(data.participants){
					recommendOptions.participants = data.participants;
				}
				var Promise2 = new Promise(function(resolve, reject){
					Vue.axios.post(apiBasePath+"search/activity/recommend",JSON.stringify(recommendOptions),{
						headers: {
						'Content-Type': 'application/json'
						}
					}).then(function(res) {
						resolve(res);
					}, function(res) {
						resolve(res);
					});
					// Vue.axios.get(apiBasePath + "product/activity/"+id+"/recommend?currency="+data.nowExchange.code).then(function(res) {
					// 	resolve(res);
					// }, function(res) {
					// 	resolve(res);
					// });
				});

				//价格信息
				var Promise3 = new Promise(function(resolve, reject){
					Vue.axios.get(apiBasePath + "product/activity/"+id+"/price?currency="+data.nowExchange.code).then(function(res) {
						resolve(res);
					}, function(res) {
						resolve(res);
					});
				});

				//价格明细
				var Promise4 = new Promise(function(resolve, reject){
					Vue.axios.get(apiBasePath + "product/activity/"+id+"/price/detail?currency="+data.nowExchange.code).then(function(res) {
						resolve(res);
					}, function(res) {
						resolve(res);
					});
				});

				//点评
				var Promise5 = new Promise(function(resolve, reject){
					Vue.axios.post(apiBasePath+"user/comment/list",JSON.stringify({"activityId": id,'pageNum':1,'pageSize':3}),{
							headers: {
							'Content-Type': 'application/json'
							}
						}).then(function(res) {
						resolve(res);
					}, function(res) {
						resolve(res);
					});
				});

				//banner
				var Promise6 = new Promise(function(resolve, reject){
					Vue.axios.get(apiBasePath+"public/photo/"+id+"/ACTIVITY_BANNER/list").then(function(res) {
						resolve(res);
					}, function(res) {
						resolve(res);
					});
				});

				//行程
				var Promise7 = new Promise(function(resolve, reject){
					Vue.axios.get(apiBasePath+"product/activity/"+id+"/itinerary/list").then(function(res) {
						resolve(res);
					}, function(res) {
						resolve(res);
					});
				});

				//包含
				var Promise8 = new Promise(function(resolve, reject){
					Vue.axios.get(apiBasePath+"product/activity/"+id+"/content/ITEMS_INCLUDED/list").then(function(res) {
						resolve(res);
					}, function(res) {
						resolve(res);
					});
				});

				//不包含
				var Promise9 = new Promise(function(resolve, reject){
					Vue.axios.get(apiBasePath+"product/activity/"+id+"/content/ITEMS_EXCLUDED/list").then(function(res) {
						resolve(res);
					}, function(res) {
						resolve(res);
					});
				});

				//注意事项
				var Promise10 = new Promise(function(resolve, reject){
					Vue.axios.get(apiBasePath+"product/activity/"+id+"/content/NOTICE/list").then(function(res) {
						resolve(res);
					}, function(res) {
						resolve(res);
					});
				});

				//导游信息
				var Promise11 = new Promise(function(resolve, reject){
					Vue.axios.get(apiBasePath+"product/ACTIVITY/"+id+"/guide/info/list").then(function(res) {
						resolve(res);
					}, function(res) {
						resolve(res);
					});
				});

				//人工推荐
				var manualOptions = {
					"id": id,
					'currency':data.nowExchange.code,
					'pageNum':1,
					'pageSize':10
				};
				if(data.participants){
					manualOptions.participants = data.participants;
				}
				var Promise12 = new Promise(function(resolve, reject){
					Vue.axios.post(apiBasePath+"search/activity/recommend/manual",JSON.stringify(manualOptions),{
							headers: {
							'Content-Type': 'application/json'
							}
						}).then(function(res) {
						resolve(res);
					}, function(res) {
						resolve(res);
					});
				});

				
				Promise.all([Promise1,Promise2,Promise3,Promise4,Promise5,Promise6,Promise7,Promise8,Promise9,Promise10,Promise11,Promise12]).then(function(results){

					//基本信息
					var detailData = results[0].data;
					
					if(detailData.valid || route.query.valid==1) {//.valid == 1

						//基本信息
						data.detail = detailData;
						

						//价格信息
						data.picInfo = results[2].data;
						data.picInfo.departureTime ? (data.time = data.picInfo.departureTime[0]) : (data.time = "");
						data.picInfo.details = results[3].data;

						//设置儿童年龄提示文字
						data.childrenText = 'Chlidren (age 3-'+data.picInfo.childStandard+')';

						

						//点评信息
						var reviewsData = results[4];
						if(reviewsData.data){
							data.reviewsData = reviewsData.data;
							data.reviews = reviewsData.data.entities;
						}

						//banner图
						data.detail.bannerPhotos = results[5].data || [];
						//行程信息
						data.detail.itinerary = results[6].data || [];

						//包含
						data.inclusions = results[7].data || [];
						//不包含
						data.exclusions = results[8].data || [];
						//注意事项
						data.notice = results[9].data || [];
						//导游信息
						data.detail.guide = results[10].data;

						//推荐信息
						data.detail.recommend = results[1].data;

						//人工推荐信息
						data.detail.manual = results[11].data;


						if(detailData.latestBooking < 1) {
							data.toast = "This activity was booked by another guest in the past hour.";
						} else if(detailData.latestBooking == 1) {
							data.toast = "This activity was booked by another guest an hour ago.";
						} else {
							data.toast = "This activity was booked by another guest " + detailData.latestBooking + " hours ago.";
						}


					} else {
						//同步回调
						callback(null,error({
							statusCode: 404,
							message: "404"
						}));
					};


					var consoleTimeS2 = new Date().getTime();
					console.log('node end time:'+consoleTimeS2);
					console.log('在node端渲染，请求所有接口花费时间：'+(consoleTimeS2-consoleTimeS)+' ms');

					//同步回调
					// console.log(data);
					callback(null,data);
					

				});


			} catch(err) {
				console.log(err);
				return error({
					statusCode: 500,
					message: JSON.stringify(err)
				});
			}

			
			
			//return data;
		},
		head() {
			let title = this.detail.title;
			let description = this.detail.category + " " + this.detail.duration + " " + this.detail.durationUnit + " " + this.detail.title;
			let keywords = this.detail.tourTypes ? this.detail.tourTypes.join(",") : '';
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
		components: {
			Head,
			foot,
			dialogBox,
			inquiry,
			service
		},
		data(options){
			
			return {
				showDurationInfo:false,
				showLanguagesInfo:false,
				showPickupInfo:false,


				//导游
				showGuideDetail:false,
				guideSwiper:null,
				hasGuide:false,
				checkGuideIndex:'',
				guideSwiperIndex:0,

				

				//点评页数
				thisReviewsData:'',
				showReviewsPic:false,
				reviewsIndex:1,
				pageNum:2,

				//inquiry
				dialogInquiryStatus:false,
				dialogStatus:false,
				emailTip:false,
				emailSendTip:false,
				showEmailBox:false,
				inqueryEmail:'',
				inqueryEmailOld:'',
				feedbackId: '',
			}
		},
		computed:{
			participantsData(){
				var participantsArr = [];
				var picInfo = this.picInfo;
				for(var i=1;i<=picInfo.maxParticipants;i++){
					if(i>=picInfo.minParticipants && i<=9){
						participantsArr.push({
							people:i,
							text: i==1 ? (1+' Person') : (i>=9 ? i+' People & more' : i+' People')
						});
					}
				}
				return participantsArr;
			}
		},
		methods: {
			formatDate:formatDate,
			changePeople(e){
				this.bookAdults = this.participants;
				this.bookChildren = 0;
				Cookie.set('participants',this.participants,{path:'/','expires':30})
			},
			headCurrencyFn(){
				
			},
			itineraryFn(e){
				var thisList = getParents(e.target,'itinerary_list');
				if(/active/.test(thisList.className)){
					thisList.className = 'itinerary_list';
				}else{
					//加载图片
					var thisImg = thisList.querySelector('img');
					if(thisImg){
						thisImg.setAttribute('src',thisImg.getAttribute('data-src'));
					}
					thisList.className = 'itinerary_list active';
				}

				//View all 和 View less动态改变
				var itinerary_active = document.querySelectorAll('.itinerary_list.active'),
					itinerary_list = document.querySelectorAll('.itinerary_list');
				if(itinerary_active.length == itinerary_list.length){
					document.querySelector('.btn_viewall').innerHTML = 'View less';
				}else{
					document.querySelector('.btn_viewall').innerHTML = 'View all';
				}

				ga(gaSend, {
					hitType: "event",
					eventCategory: "activity_detail",
					eventAction: "click",
					eventLabel: "expand"
				});
				
			},
			itineraryViewall(e){
				var itinerary_list = document.querySelectorAll('.itinerary_list');
				
				if(e.target.innerHTML == 'View all'){
					e.target.innerHTML = 'View less';
					for(var i=0;i<itinerary_list.length;i++){
						var thisData = itinerary_list[i];
						//加载图片
						var thisImg = thisData.querySelector('img');
						if(thisImg){
							thisImg.setAttribute('src',thisImg.getAttribute('data-src'));
						}
						//展开样式
						thisData.className = 'itinerary_list active';
					}
				}else{
					e.target.innerHTML = 'View all';
					for(var i=0;i<itinerary_list.length;i++){
						var thisData = itinerary_list[i];
						thisData.className = 'itinerary_list';
					}
				}

				ga(gaSend, {
					hitType: "event",
					eventCategory: "activity_detail",
					eventAction: "click",
					eventLabel: "expand_all"
				});
				
				
			},
			returnText(peopleNum){
				if(this.picInfo.unifiedPricing){
					return ' pp';
				}
				return peopleNum?(peopleNum==1?' for 1 person':' based on group of '+ peopleNum):' pp '
			},
			getPeoplePrice(peopleNum,pp){
				var price = this.picInfo.details
				for(var i =0;i<price.length;i++){
					if(peopleNum==price[i].capacity){
						return pp ? price[i].perPersonPrice : price[i].price;
					}
				}
				return price[price.length-1].perPersonPrice;
			},
			delEnter(text){
				if(!text)return '';
				return text.replace(/(^\s*)|(\s*$)/g, "").replace(/(^\r\n*)|(\r\n*$)/g, "");
			},
			getTextArr(text){
				if(!text)return [];
				var arr = text.split('\n');
				var newArr = [];
				for(var i=0;i<arr.length;i++){
					var thisData = arr[i];
					if(thisData.replace(/(^\s*)|(\s*$)/g, "")){
						newArr.push(thisData);
					}
				}
				return newArr;
			},
			getPickupTitle(pickup){
				if(pickup==1){
					return 'Pick-up and drop-off included';
				}else if(pickup==2){
					return 'Pick-up included, drop-off excluded';
				};
				return '';
			},
			enterToBr(text){
				return text ? text.replace(/\n/g,'<br>') : '';
			},
			otherFn(e){
				var thisList = getParents(e.target,'other_list');
				if(/active/.test(thisList.className)){
					thisList.className = 'other_list';
				}else{
					thisList.className = 'other_list active';
				}
			},
			reviewsShowMore(e){
				var parent = e.target.parentNode;
				parent.innerHTML = parent.getAttribute('content');
			},
			loadMoreReviews(e){
				var postData = {
					"activityId": this.id,
					'pageNum':this.pageNum,
					'pageSize':3
				};
				var thisBtn = e.target;
				var self = this;

				if(self.reviewsLoading){
					return false;
				}

				self.reviewsLoading = true;
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
						self.reviews = self.reviews.concat(entities);
						self.pageNum++;
					}else if(entities && entities.length==0){
						thisBtn.style.display = 'none';
					}
					//开启请求状态
					self.reviewsLoading = false;
					
				}, function(response) {
					self.reviewsLoading = false;
				});
			},
			showBigPic(index,imgIndex){
				var that = this;
				this.thisReviewsData = this.reviews[index];
				this.showReviewsPic = true;
				
				//展示图册
				this.$nextTick(()=>{
					this.swiper_reviews = new Swiper('#swiper_reviews', {
						lazy: false,
						initialSlide:imgIndex,
						zoom:true,
						on:{
							slideChangeTransitionEnd: function(swiper){
								that.reviewsIndex = this.activeIndex+1;
							}
						}
					});
				})
				//this.swiper_reviews.update();
				//this.swiper_reviews.destroy();
			},
			closeBigPic(){
				this.showReviewsPic = false;
				this.swiper_reviews.destroy();
				this.thisReviewsData = '';
				this.reviewsIndex = 1;
			},
			reviewsStarHtml(score){
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
			setTimeStr(num,str){
				if(str.toLowerCase()=='hours'){
					return num===1 ? 'Hour' : 'Hours'
				}else if(str.toLowerCase()=='days'){
					return num===1 ? 'Day' : 'Days'
				}
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
					return (value*1).toFixed(2);
				}else{
					return 0;
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
			getManual(){
				var self = this;
				//人工推荐
				var manualOptions = {
					"id": self.id,
					'currency':self.nowExchange.code,
					'pageNum':1,
					'pageSize':10
				};
				if(self.participants){
					manualOptions.participants = self.participants;
				}
				self.axios.post("https://api.localpanda.com/api/search/activity/recommend/manual",JSON.stringify(manualOptions),{
					headers: {
					'Content-Type': 'application/json'
					}
				}).then(function(res) {
					self.detail.manual = res.data;
				}, function(res) {});
			},
			getRecommend(){
				var self = this;
				//请求推荐信息
				var recommendOptions = {
					"id": self.id,
					'currency':self.nowExchange.code,
					'pageNum':1,
					'pageSize':3
				};
				if(self.participants){
					recommendOptions.participants = self.participants;
				}
				self.axios.post("https://api.localpanda.com/api/search/activity/recommend",JSON.stringify(recommendOptions),{
					headers: {
					'Content-Type': 'application/json'
					}
				}).then(function(res) {
					self.detail.recommend = res.data;
				}, function(res) {});
			},
			getPriceData(options,callback){
				var self = this;
				//价格信息
				var promisePrice = new Promise(function(resolve, reject){
					self.axios.get("https://api.localpanda.com/api/product/activity/"+options.activityId+"/price?currency="+options.currency).then(function(res) {
						resolve(res);
					}, function(res) {
						resolve(res);
					});
				});
				var promisePriceDetail = new Promise(function(resolve, reject){
					self.axios.get("https://api.localpanda.com/api/product/activity/"+options.activityId+"/price/detail?currency="+options.currency+(options.participants?'&participants='+options.participants:'')).then(function(res) {
						resolve(res);
					}, function(res) {
						resolve(res);
					});
				});

				Promise.all([promisePrice,promisePriceDetail]).then(function(results){
					var priceData = results[0].data,
						priceDetailData = results[1].data;
						if(typeof callback === 'function'){
							callback({
								priceData:priceData,
								priceDetailData:priceDetailData
							});
						}
				});

			},
			changeCurrency(){
				var self = this;
				var selectCurrency = this.selectCurrency;
				var exchange = this.exchange;

				//获取最新价格信息
				this.getPriceData({
					activityId: this.id, //产品id
					currency: selectCurrency,  //当前币种
					participants: this.participants  //人数
				},function(data){ //data包含价格基本信息，价格详情
					var priceData = data.priceData,
						priceDetailData = data.priceDetailData;

					//设置价格信息
					if(priceData.childDiscount){
						self.picInfo.childDiscount= priceData.childDiscount
					}
					self.picInfo.bottomPrice = priceData.bottomPrice;
					self.picInfo.currency = priceData.currency;

					//设置当前币种
					for(var i=0;i<exchange.length;i++){
						var thisEx = exchange[i];
						//检测当前货币类型
						if(thisEx.code==selectCurrency){
							self.nowExchange = thisEx;
						}
					}

					//更新价格详情
					self.picInfo.details = priceDetailData;

					//获取该人数的最新总价
					if(self.participants>0){
						self.adultsPic = self.getPeoplePrice(self.participants);
					}

					//重设book价格，计算儿童差价和pandaPhone之后得价格
					self.setPeoplePrice();

					//更新人工推荐产品价格
					self.getManual();

					//推荐产品
					self.getRecommend();
					
				});
				
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
			inquiryCallback(val){
				this.dialogInquiryStatus = false;
				if(val){
					var data = val.data;
					this.feedbackId = data.response;
					this.inqueryEmailOld = val.email;
					this.dialogStatus = true;
				}
			},
			serviceConfirmCallback(){
				this.dialogStatus = false;
				this.emailSendTip = true;
			},
			confirmCallback(){
				this.dialogInquiryStatus = false;
			},
			sendEmail(){
				var that = this;
				if(/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test(this.inqueryEmail)){

					//默认是修改feedback的邮箱
					var postData = {
						emailAddress: this.inqueryEmail,
						id: this.feedbackId
					};
					var postUrl = "https://api.localpanda.com/api/user/feedback";

					//修改邮箱请求
					that.axios.post(postUrl, JSON.stringify(postData), {
						headers: {
							'Content-Type': 'application/json'
						}
					}).then(function(response) {
						if(response.data.succeed) {
							that.inqueryEmailOld = that.inqueryEmail;
							that.emailSendTip = true;
							that.inqueryEmail = '';
						};

					}, function(response) {

					})
					this.emailTip = false;
				}else{
					this.emailTip = true;
				}
			},
			contactCallBack(val){
				if(val){
					var data = val.data;
					this.feedbackId = data.response;
					this.inqueryEmailOld = val.email;
					this.dialogStatus = true;
				}
				
			},
			gaInquire(){
				ga('gtag_UA_107010673_2.send', {
					hitType: 'event',
					eventCategory: 'activity_detail',
					eventAction: 'click',
					eventLabel: 'activity_inquiry',

				});
				// localStorage.setItem("owner",this.detail.owner)
				// location.href='/info/inquiry?objectId='+this.id
				this.dialogInquiryStatus = true;
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
					eventLabel:"activity_book_succ"
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
					venues: this.detail.venues,
				  owner:this.detail.owner,
		      averagePrice: this.perPersonPrice, //人均价 
					guideId: this.checkGuideIndex!=='' ? this.detail.guide[this.checkGuideIndex].guideId : null,
					phoneHirePrice: this.picInfo.phoneHirePrice,
					pandaPhoneCheck:this.pandaPhoneCheck,
					picInfo: this.picInfo
				};
				
				
				orderInfo = JSON.stringify(orderInfo);
		    localStorage.setItem("orderInfo", orderInfo);
				location.href="/activity/booking/"+this.id;
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
			getBottomCapacity(){
				var details = Object.assign([],this.picInfo.details);
				details.sort(function(a,b){
					return a.perPersonPrice - b.perPersonPrice;
				});
				return details[0].capacity;
			},
			languageGa(){
				this.showLanguagesInfo=true;
				ga(gaSend, {
					hitType: "event",
					eventCategory: "activity_detail",
					eventAction: "click",
					eventLabel:"language"
				});
			},
			durationInfoGa(){
				this.showDurationInfo=true;
				ga(gaSend, {
					hitType: "event",
					eventCategory: "activity_detail",
					eventAction: "click",
					eventLabel:"duration"
				});
			},
			pickupGa(){
				this.showPickupInfo=true;
				ga(gaSend, {
					hitType: "event",
					eventCategory: "activity_detail",
					eventAction: "click",
					eventLabel:"pickup"
				});
			},
			similarFn(activityId){
				ga(gaSend, {
					hitType: "event",
					eventCategory: "activity_detail",
					eventAction: "click",
					eventLabel:"recommend_manual"
				});

				location.href =  '/activity/details/'+activityId;
			},
			alsoFn(activityId){
				ga(gaSend, {
					hitType: "event",
					eventCategory: "activity_detail",
					eventAction: "click",
					eventLabel:"recommend_system"
				});

				location.href =  '/activity/details/'+activityId;
			}
		},
		mounted: function() {
			var self=this;

			//币种信息
			this.exchange = this.currencyData;

			var cookieCurrency = JSON.parse(Cookie.get('currency'));
			var ua = window.navigator.userAgent.toLowerCase();
			var isWx = (ua.match(/MicroMessenger/i) == 'micromessenger') ? true : false;
			//设置当前币种
			var currency= cookieCurrency ? cookieCurrency : (isWx ? {'code':'CNY','symbol':'¥'} : {'code':'USD','symbol':'$'});

			if(this.nowExchange.code!=currency.code){
				this.nowExchange=currency;
				this.selectCurrency =  currency.code;
			}
			// console.log(currency);
			console.log(this.$data);
			console.log(this.$data.detail);
			console.log(this.$data.picInfo);

			//初始化日期选择
			this.checkInit();

			//选择默认处理
			if(this.participants>this.picInfo.maxParticipants){
				this.participants = this.picInfo.maxParticipants;
			}
			if(this.participants){
				this.bookAdults = this.participants;
			}


			//ABtest类型
			//没有cookie，写入cookie
			if(!Cookie.get('ABType')){
				Cookie.set('ABType',this.ABType,{path:'/','expires':30});
			}
			if(this.ABType == 'B'){
				//写入默认人数记录
				Cookie.set('participants',this.participants,{path:'/','expires':30});
			};

			//等待渲染完毕后调用
			this.$nextTick(function(){
				//头图
				new Swiper('#swiper_bannerbox', {
					autoplay: {
						delay: 3000,
						disableOnInteraction: false
					},
					loop: false,
					lazy: true,
					// 如果需要分页器
					pagination: {
						el: '#swiper_banner_pagination'
					}
				});

				//导游
				new Swiper('.js_guide', {
					autoplay: false,//可选选项，自动滑动
					slidesPerView : 4.5
				});

				//底部推荐
				new Swiper('#swiper_experiences', {
					lazy: true,
					slidesPerView :"auto",
					initialSlide: 0,
					spaceBetween:17,
				});
			});


			//浏览器事件处理，针对inquiry弹层
      window.onpopstate = function(event) {
				self.confirmCallback();
				self.serviceConfirmCallback();
				self.showDurationInfo = false;
				self.showLanguagesInfo = false;
				self.showPickupInfo = false;
			};

			// console.log(this.picInfo);

			var $check_all = document.querySelector('#check_all');
			window.onscroll = function(){
				self.scrollFn($check_all);
			}

		},
		watch: {
			//监听币种变化
			selectCurrency:function(){
				this.changeCurrency();
			},
			participants(){

				//更新人工推荐产品价格
				this.getManual();

				this.getRecommend();
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
			},
			bookPeople:function(val){
				this.participants = val;
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
	};
</script>

<style lang="scss" scoped>
	#activitiesDetail{
		background-color: #f5f7f6;
		.crumbs{
			font-size: 0.22rem;
			background-color: #fff;
			color: #878e95;
			vertical-align: top;
			line-height: 0.6rem;
			overflow: hidden;
			padding: 0 0.3rem;
			*{
				float: left;
				color: #878e95;
			}
		}
		.banner{
			width:  100%;
			img{
				max-width: 100%;
			}
		}
		.detail_box{
			padding: 0.3rem 0.3rem 0.4rem;
			background-color: #fff;
			margin-bottom: 0.3rem;
			box-shadow: 0 0 10px rgba(0,0,0,0.05);
			h3{
				font-size: 0.3rem;
				font-weight: bold;
				color: #353a3f;
				line-height: 0.54rem;
				overflow: hidden;
				i{
					float: left;
					margin-top: 0.12rem;
					margin-right: 0.2rem;
					width: 0.06rem;
					height: 0.3rem;
					background-color: #1bbc9d;
					border-radius: 0.03rem;
				}
				.iconfont{
					float: right;
					font-size: 0.36rem;
				}
			}
			.detail_p{
				font-size: 0.26rem;
				line-height: 0.36rem;
			}
			.detail_p_mt{
				margin-top: 0.1rem;
			}
		}
		.activity_top{
			padding-top: 0.3rem;
			h2{
				font-size: 0.44rem;
				font-weight: bold;
				line-height: 0.56rem;
				span{ color: #fff; background-color: #f4b33f; font-size: 0.26rem; line-height: 0.38rem; display: inline-block; padding: 0 0.1rem; border-radius: 0.05rem; vertical-align: middle; margin-right: 0.2rem; font-weight: normal;}
				.private{ background-color: #1bbc9d;}
			}
			.price_info{
				padding-top: 0.2rem;
				.select_people{
					float: right;
					margin-left: 0.2rem;
					position: relative;
					font-size: 0.32rem;
					line-height: 0.6rem;
					padding-right: 0.4rem;
					color: #878e95;
					i{
						position: absolute;
						right: 0;
						top: 0;
						height: 0.6rem;
						line-height: 0.6rem;
						vertical-align: top;
						font-size: 0.36rem;
						font-weight: bold;
					}
					select{
						line-height: 0.6rem;
						padding: 0;
						background: none;
						border: none;
						appearance:none;
						-moz-appearance:none;
						-webkit-appearance:none;
						position: absolute;
						right: 0;
						top: 0;
						width: 100%;
						height: 100%;
						z-index: 2;
						opacity: 0;
					}
				}
				.unified_pricing{
					padding: 0;
					.select_people_box,.iconfont{
						display: none;
					}
				}
				
				.price_select_box{
					float: right;
					margin-top: 0.06rem;
					margin-right: 0.1rem;
					small{
						color: #888;
						font-size: 0.26rem;
					}
				}
				p{
					float: right;
					font-size: 0.46rem;
					position: relative;
					span{
						font-size: 0.22rem;
						color: #878e95;
					}
					small{
						font-size: 0.28rem;
						color: #888;
					}
				}
				
			}
			.price_tip{
				text-align: right;
			}
			.booking_info{
				color: #878e95;
				text-align: right;
				span{ float: right; font-size: 0.22rem}
				.reviews_star{
					 float: right;
					 padding-top: 0.04rem;
					 margin-right: 0.1rem;
				}
			}
			.activity_info{
				padding-top: 0.15rem;
				border-top: 1px solid #dde0e0;
				margin-top: 0.2rem;
				li{
					padding: 0.1rem 0 0.1rem 0.4rem;
					i{font-size: 0.26rem; margin-right: 0.15rem; float: left; margin-left: -0.4rem;}
					font-size: 0.26rem;
					line-height: 0.36rem;
					span.iconfont{ vertical-align: top; margin-left: 0.2rem; position: relative; top: 1px;}
				}
			}
		}

		.why{
			.detail_p{
				margin-top: 0.25rem;
			}
			.detail_txt_list{
				margin-top: 0.3rem;
			}
		}

		.guide{
			.guide_list{
				width: calc(100vw - 0.4rem);
				margin-top: 0.4rem;
				padding-bottom: 0.1rem;
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

		.check{
			.check_all_box{
				width: calc(100vw - 0.3rem);
				margin-left: -0.15rem;
				border: 2px solid #1bbc9d;
				border-radius: 10px;
				padding: 0.3rem;
				h3{
					line-height: 0.32rem;
					font-size: 0.28rem;
				}
				.available_on{
					margin-top: 0.15rem;
				}
			}
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
					input::-moz-placeholder { color: #878e95; }
					input::-ms-input-placeholder { color: #878e95; }
					input::placeholder { color: #878e95; }
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
					.flatpickr-input{ opacity: 0; z-index: 2; position: relative;}
					.time_box{ position: absolute; left: 0; z-index: 1; top: 0;}
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
					.inquire_box{
						margin-top: 0.25rem;
						font-size: 0.26rem;
						line-height: 0.44rem;
						padding: 0.06rem 0;
						span{
							display: inline-block;
							vertical-align: top;
							color: #1bbc9d;
							text-decoration: underline;
							margin-left: 0.2rem;
						}
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
					.check_people_text{ position: absolute; left: 0.76rem; top: 0; height: 0.74rem; line-height: 0.74rem; font-size: 0.22rem;}
					.check_child_text{ position: absolute; left: 0.6rem; top: 0; height: 0.74rem; line-height: 0.74rem; font-size: 0.22rem;}
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
							.price_select_box{
								display: inline-block;
								float: none;
								line-height: 0.32rem;
								margin-right: 0.2rem;
								select{
									line-height: 0.32rem;
								}
								.iconfont{
									line-height: 0.34rem;
									height: 0.32rem;
								}
								
							}
						}
					}
					.hr{ height: 1px; background-color: #ebebeb;}
					.book_tip{ margin-top: 0.3rem; font-size: 0.22rem;}
					.btn{margin-top: 0.6rem;}
					.inquire_box{
						margin-top: 0.25rem;
						font-size: 0.26rem;
						line-height: 0.44rem;
						padding: 0.06rem 0;
						span{
							display: inline-block;
							vertical-align: top;
							color: #1bbc9d;
							text-decoration: underline;
							margin-left: 0.2rem;
						}
					}
				}
			}
		}

		.itinerary{
			padding-bottom: 0.2rem;
			.btn_viewall{
				float: right;
				color: #1bbc9d;
				border: 1px solid #1bbc9d;
				height: 0.52rem;
				line-height: 0.52rem;
				padding: 0 0.4rem;
				border-radius: 0.27rem;
				font-weight: normal;
			}
			.itinerary_tip{
				color: #666;
				padding: 0.1rem 0 0.3rem;
				font-size: 0.26rem;
			}
			.itinerary_list{
				border-top: 1px solid #dde0e0;
				&:nth-child(2){ border:none;}
				dt{
					font-size: 0.26rem;
					font-weight: bold;
					line-height: 0.4rem;
					padding: 0.3rem 0 0.3rem 0.35rem;
					position: relative;
					z-index: 2;
					i{
						float: right;
						font-size: 0.36rem;
					}
					span{
						float: left;
						margin:0.14rem 0 0 -0.35rem;
						width: 0.12rem;
						height: 0.12rem;
						border-radius: 0.06rem;
						background-color: #353a3f;
					}
					.i_up{
						display: block;
					}
					.i_down{
						display: none;
					}
				}
				dd{
					padding-bottom: 0.4rem;
					margin-top: -0.3rem;
					display: none;
					p{
						line-height: 0.36rem;
						font-size: 0.26rem;
						margin-top: 0.1rem;
					}
					img{
						display: block;
						max-width: 100%;
						min-height: 3rem;
						margin-top: 0.15rem;
						border-radius: 5px;
					}
				}
			}
			.active{
				dt{
					.i_up{
						display: none;
					}
					.i_down{
						display: block;
					}
				}
				dd{
					display: block;
				}
				
			}
		}

		.similar{
			padding-bottom: 0.5rem;
			.similar_list_manual{
				li{
					background-color: #fff;
					box-shadow: 0px 2px 0.3rem 0px rgba(0, 0, 0, 0.08);
					border-radius: 5px;
					margin-top: 10px;
					position: relative;
					&:hover{
						box-shadow: 0px 2px 0.3rem 0px rgba(0, 0, 0, 0.12);
					}
					a{
						display: block;
						padding:0.2rem 0.8rem 0.2rem 0.3rem;
					}
					h4{
						font-size: 0.28rem;
						color: #353a3f;
						font-weight: bold;
						overflow:hidden;
						-webkit-line-clamp: 2;   //要设置的行数
						-webkit-box-orient: vertical;
						display: -webkit-box;
						text-overflow: ellipsis;
						max-height: 0.86rem;
					}
					.tag{
						color: #fff;
						display: inline-block;
						height: 0.28rem;
						line-height: 0.28rem;
						border-radius: 0.14rem;
						padding: 0 0.2rem;
						background-color: #efae99;
						font-size: 0.2rem;
						font-weight: normal;
						vertical-align: top;
						margin-right: 5px;
						position: relative;
						top: 0.08rem;
					}
					.private{ background-color: #1bbc9d;}
					.tag_time{
						display: inline-block;
						font-size: 0.2rem;
						height: 0.28rem;
						line-height: 0.26rem;
						padding: 0 0.2rem;
						border-radius:0.1rem;
						border: 1px solid #878e95;
						vertical-align: top;
						position: relative;
						top: 3px;
						margin-left: 5px;
						color: #878e95;
						font-weight: normal;
					}
					.similar_list_foot{
						margin-top: 0.2rem;
						line-height: 0.3rem;
						font-size: 0.22rem;
						width: 100%;
						box-sizing:border-box;
						overflow: hidden;
						color: #878e95;
						.price{
							b{
								font-size: 0.28rem;
								margin: 0 3px;
								color: #353a3f;
							}
						}
						.gray{
							color: #878e95;
						}
						.reviews_star{
							float: left;
							margin-top: 8px;
							margin-right: 6px;
						}
					}

					.similar_arrow{
						font-size: 0.4rem;
						position: absolute;
						right: 10px;
						top: 50%;
						margin-top: -0.3rem;
						color: #878e95;
					}
				}
			}
			.similar_list{
				margin-top: 0.3rem;
				li{
					overflow: hidden;
					height: 0.96rem;
					line-height: 0.96rem;
					background-color: #faf9f8;
					border-radius: 5px;
					border: solid 1px #ebebeb;
					padding-left: 0.3rem;
					font-size: 0.28rem;
					font-weight: bold;
					margin-top: 0.14rem;
					i{
						float: right;
						font-size: 0.24rem;
						margin-right: 0.3rem;
					}
				}
			}
		}

		.other_box{
			.other_list{
				border-top: 1px solid #ddd;
				&:nth-child(1){ border: none; margin-top: -0.2rem;}
				h3{
					padding: 0.38rem 0;
				}
				h4{
					margin-top: 0.2rem;
					padding: 0.2rem 0 0 0.45rem;
					font-size: 0.3rem;
					font-weight: bold;
				}
				.other_content{
					margin-top: -0.2rem;
					padding: 0 0 0.5rem;
					display: none;
				}
				.i_up{
					display: block;
				}
				.i_down{
					display: none;
				}
			}
			.active{
				.other_content{
					display: block;
				}
				.i_up{
					display: none;
				}
				.i_down{
					display: block;
				}
			}
		}

		.reviews{
			.reviews_title{
				.reviews_num{
					font-size: 0.44rem;
					font-weight: bold;
				}
				.reviews_star{
					margin-left: 0.5rem;
					vertical-align: top;
					margin-top: 0.16rem;
				}
			}
			.reviews_list{
				padding: 0.4rem 0;
				border-bottom: #ddd solid 1px;
				// &:nth-child(2){
				// 	border: none
				// }
				
				.reviews_list_top{
					overflow: hidden;
					.reviews_photo{
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
						.reviews_photo_img{ width: 100%; height: 100%; background-size: cover;}
						.reviews_photo_def{
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
					.reviews_list_info{
						float: left;
						h5{
							font-size: 0.28rem;
							font-weight: bold;
						}
						p{
							font-size: 0.24rem;
						}
					}
					.reviews_star{
						float: right;
						margin-top: 0.3rem;
						
					}
				}
				.reviews_list_content{
					font-size: 0.26rem;
					margin-top: 0.24rem;
					word-wrap:break-word;
					.reviews_text_more{
						color: #1bbc9d;
						font-size: 0.24rem;
					}
				}
				.reviews_img_s{
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
			
			.reviews_more{
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
		

		.detail_txt_list{
			li{
				margin-top: 0.1rem;
				padding-left: 0.45rem;
				font-size: 0.26rem;
				line-height: 0.36rem;
				i{
					float: left;
					margin-left: -0.45rem;
					margin-top: 0.12rem;
				}
				.dian{
					margin-left: -0.35rem;
					width: 0.12rem;
					height: 0.12rem;
					border-radius: 50%;
					background-color: #353a3f;
				}
				.iconfont{
					font-size: 0.22rem;
					margin-top: 0.02rem;
				}
				p{
					margin-top: 0.1rem;
					color: #666;
				}
			}
		}

		.warning_box{
			border: solid 1px #ffe6c2;
			background-color: #fffbf2;
			border-radius: 5px;
			padding: 0.2rem 0.3rem;
			margin-top: 0.3rem;
			line-height: 0.36rem;
			font-size: 0.26rem;
		}



		.btn_inquire{
			display: block;
			height: 0.86rem;
			line-height: 0.86rem;
			text-align: center;
			color: #FFF;
			// font-weight: bold;
			border-radius: 0.6rem;
			margin-top: 0.23rem;
			font-size: 0.32rem;
			border: solid 1px #1bbc9d;
			background: #fff;
			color: #1bbc9d;
			font-size:0.36rem;
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


		.swiper_reviews{
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
			.reviews_close{
				position: absolute;
				right: 0;
				top: 0;
				color: #fff;
				padding: 0.3rem 0.4rem;
				z-index: 3;
			}
			.reviews_num{
				position: absolute;
				left: 10%;
				top: 1rem;
				color: #fff;
				font-size: 0.32rem;
			}
		}


		.experiences {
			.swiper-wrapper {
				margin-top: 0.3rem;
				padding-bottom: 0.2rem;
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
						height: 3.3rem;
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
						.pic {
							position: absolute;
							right: 0.4rem;
							bottom: 0.5rem;
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

		.price_select_box{
			float: right;
			position: relative;
			font-size: 0.4rem;
			line-height: 0.6rem;
			i{
				position: absolute;
				right: 0;
				top: 0;
				height: 0.6rem;
				line-height: 0.66rem;
				vertical-align: top;
				font-size: 0.44rem;
				font-weight: bold;
				color: #878e95;
				overflow: hidden;
			}
			select{
				line-height: 0.6rem;
				padding: 0 0.4rem 0 0.2rem;
				font-size: 0.36rem;
				color: #878e95;
				background: none;
				border: none;
				appearance:none;
				-moz-appearance:none;
				-webkit-appearance:none;
				position: relative;
				z-index: 2;
			}
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
		

		.service_box{
			font-size: 14px;

			.tip_title{
				margin-top: 0.2rem;
				padding: 0.3rem 0;
				text-align: center;
				font-size: 0.34rem;
				// background-color: #fafafa;
			}

			.tip_detail{ 
				margin-top: 20px; font-size: 14px; line-height: 22px;
				a{ color:#00B886; cursor: pointer;
					&:hover{ text-decoration: underline;}
				}
			}
			.email_box{
				margin-top: 10px;
				input{
					width: 100%;
					border: 1px solid #ddd;
					height: 32px;
					line-height: 32px;
				}
				.btn_sendemail{
					display: inline-block;
					margin-top: 0.2rem;
					height: 32px;
					border-radius: 16px;
					line-height: 30px;
					padding: 0 20px;
					font-size: 14px;
					cursor: pointer;
					background-image: -webkit-gradient(linear, right top, left top, from(#009efd), to(#1bbc9d));
					background-image: linear-gradient(270deg, #009efd 0%, #1bbc9d 100%);
					color: #fff;
				}
			}
			.email_tip{
				margin-top: 9px;
				i{
					font-size: 14px;
				}
			}
			
			
		}

		.bookBtnBox {
			width: 100%;
			box-sizing: border-box;
			position: fixed;
			padding: 0.25rem 0.4rem;
			bottom: 0;
			left: 0;
			z-index: 99;
			background: #fff;
			border-top: 1px solid #dde0e0;
			display: flex;
			a{
				flex: 1;
				margin-right: 0.32rem;
				width: 3.6rem;
				height: 0.9rem;
				line-height: 0.86rem;
				text-align: center;
				color: #FFF;
				font-weight: bold;
				border-radius: 0.6rem;
				font-size: 0.32rem;
				background-image: linear-gradient(270deg, #009efd 0%, #1bbc9d 100%);
				&:last-child{
					margin-right: 0;
					background-image: linear-gradient(270deg, #009efd 0%, #1bbc9d 100%);
				}
				&:first-child{
					border: solid 1px #1bbc9d;
					box-sizing: border-box;
					background: #fff;
					color: #1bbc9d;
					font-size:0.36rem;
				}
				
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

	#activitiesDetail{
		.header{
			.selectCurrey_box{ display: none!important;}
		}
		.banner{
			.swiper-pagination-bullet{
				border: 1px solid #fff;
				background:none;
				width: 0.14rem;
				height: 0.14rem;
				opacity: 1;
			}
			.swiper-pagination-bullet-active{
				border-color:#1bbc9d;
				background-color: #fff;
			}
		}

		.booking_info{
			.reviews_star{
				.star_list{
					width: 0.26rem;
					height: 0.26rem;
				}
			}
		}

		.dialog_tip_info{
			margin-top: 0rem;
			font-size: 0.26rem;
			h4{
				font-weight: bold;
				padding-bottom: 0.1rem;
			}
			p{
				margin-top: 0.2rem;
			}
		}

		.reviews{
			.reviews_list_top{
				.reviews_star{
					.star_list{
						width: 0.26rem;
						height: 0.26rem;
					}
				}
			}
		}

		.reviews_star{
			display: inline-block;
			.star_list{
				display: inline-block;
				overflow: hidden;
				position: relative;
				vertical-align: top;
				width: 0.32rem;
				height: 0.32rem;
				padding: 2px;
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
		
	}
	
</style>