<template>
	<div id="bookDetail" class="bookDetail">
		<headBack title="Booking Details" :close="back"></headBack>
		<!-- <div class="back"><i class="iconfont" @click="back">&#xe615;</i></div> -->
		<div class="head">
			<!-- <h3>Booking Details</h3> -->
			<p>{{title}}</p>
		</div>
		<div class="select">
			<ul>
				
				<li class="clearfix" :class="{err:dateErr}">
					<label>Date</label>
					<div class="dateTime">
						<!-- <flatPickr placeholder="Please Select" v-model="dateTime" :config="options"></flatPickr> -->
						<input id="js_changetime" placeholder="Please Select" onfocus="blur()" v-model="dateTime" readonly type="text">
					</div>
				</li>

				<li class="clearfix" @touchend="show()" :class="{err:peopleErr}">
					<!-- <label>Guests</label>
					<div v-if="adults+children<1" class="guests">{{people + (people>1?" People":" Person")}}</div>
					<div v-if="adults+children==1" class="guests">{{adults+children}} Person</div>
					<div v-if="adults+children>1" class="guests">{{adults+children}} People</div> -->

					<SelectPeople class="view" :people="people" :picInfo="picInfo" @call-back="setCallBack" @sureSelect="getSave"></SelectPeople>
				</li>
				
				<li class="clearfix" v-if="adults+children>=1">
					<label v-if="children==0&&adults==1">{{picInfo.symbol}}{{returnFloat(adultsPic/(adults+children))}} x {{adults+children}} Person</label>
					
					<label v-else>{{picInfo.symbol}}{{returnFloat(adultsPic/(adults+children))}} x {{adults+children}} People 
					<br/>
					<em v-if="children>0&&picInfo.childDiscount"><b style="display: inline-block;">- {{picInfo.symbol}}{{returnFloat(children*picInfo.childDiscount)}}</b> for child(ren)</em>
					</label>
					<span @click.stop="showPriceDetail"><i class="iconfont">&#xe659;</i>{{picInfo.symbol}}{{returnFloat(adultsPic)}}</span>
				</li>
				<li class="clearfix" v-if="adults+children>=1">
					<label>Total ({{picInfo.currency}})</label>
					<span class="weight" v-if="children>0&&picInfo.childDiscount">{{picInfo.symbol}}{{returnFloat(returnFloat(adultsPic)-returnFloat(children*picInfo.childDiscount))}}</span>
					<span class="weight" v-else>{{picInfo.symbol}}{{returnFloat(adultsPic)}}</span>

					<div class="picRate">
						<select class="currency_type" @change="changeCurrency" v-model="picInfo.currency">
							<option :value="item.code" v-for="item in exchange" :key="item.code">{{item.code}}</option>
						</select>
						<span class="iconfont">&#xe666;</span>
					</div>
				</li>
			</ul>
			<p>{{dateErrText}}</p>
			<p>You can get a 100% refund up to {{refundTimeLimit}} hours before your trip.</p>
		</div>
		<div class="btn_next">
			<button @click="order">Next</button>
		</div>
		<!-- <transition name="slideleft">
			
		</transition> -->
		<transition name="slideleft">
			<PriceDetail v-show="isshowDetail" class="view" :picInfo="picInfo" @call-back-detail="setCallBackDetail"></PriceDetail>
		</transition>
		
		<transition name="fade">
			<div class="win_bg" id="win_bg" @click="showWinBg = false" v-show="showWinBg"></div>
		</transition>
		
	</div>
	
</template>

<script>
	import Flatpickr from 'flatpickr';
	
	import { GetDateStr, addmulMonth, getPriceMark} from "~/assets/js/utils";
	import SelectPeople from "~/components/activity/details/SelectPeople"
	import PriceDetail from "~/components/activity/details/PriceDetail"
	import headBack from "~/components/header/back";
	import Vue from 'vue';

	export default {
		name: "activitiesDetail",
		data() {
			var people = parseInt(this.$route.query.people);
			
			return {
				dateTime: '',
				logIn: '',
				people: people?people:2,
				picInfo: '',
				refundTimeLimit:'',
				options: {},
				isshow: false,
				adults: people?people:2,
				children: 0,
				infant: 0,
				adultsPic:'',
				id:'',
				title:'',
				category:'',
				dateErr:false,
				peopleErr:false,
				dateErrText:"",
				showWinBg : false,
				isshowDetail:false, //priceDetail

				nowExchange:{},//{'rate':1,'currency':'USD','symbol':'$'}
				exchange:[]
				
			}
		},

		components: {
			//flatPickr,
			SelectPeople,
			PriceDetail,
			headBack
		},
		methods: {
			changeCurrency(e){
				var self = this;
				var value = e.target.value;
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

						break;
					}
				}
				
				this.detailAll = this.tableData(thisDetail);

				if(this.people>0){
					this.adultsPic = thisDetail[this.people-thisDetail[0].capacity].price;
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
				// for(var i=0; i<thisDetail.length; i++){
				// 	var thisPrice = thisDetail[i].defaultPrice;
				// 	thisDetail[i].defaultPrice = thisPrice;
				// }
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
				
				return newArr;
			},
			back() {
				history.back()
			},
			show() {
				/*let that=this
				setTimeout(()=>{
					that.isshow = true
				},0)*/
				this.isshow = true
				window.ga && ga("gtag_UA_107010673_2.send", {
					hitType: "event",
					eventCategory: "activity_detail",
					eventAction: "select",
					eventLabel: "guests"
				});
				window.ga && ga("gtag_UA_107010673_2.send", {
					hitType: "event",
					eventCategory: "activity_detail",
					eventAction: "select",
					eventLabel: "detail_select"
				});
			},
			setCallBack(val) {
				this.isshow = val

			},
			setCallBackDetail(val){
				this.isshowDetail=val;
				history.back()
			},
			getSave(val) {
				this.adults = val.adults
				this.children = val.children
				this.infant = val.infant
			},
			showPriceDetail(){
				history.pushState({
					'type':'showDialog'
				},'');
				this.isshowDetail=true
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
			gaFail(){
				 window.ga && ga("gtag_UA_107010673_2.send", {
			        hitType: "event",
			        eventCategory: "activity_detail",
			        eventAction: "click",
			        eventLabel: "activity_order_fail"
			      });
			},
			order(){
		      let next=false
		      let that = this;
		      if (that.dateTime == "") {
						that.dateErr=true;

						//弹出日历
						setTimeout(function(){
							that.flatPickr.open();
						},100);
						
				
				   
		      } else if (that.children + that.adults < that.picInfo.minParticipants) {
		      	that.peopleErr=true
		        that.dateErrText =
		          "*Mimimum number of travelers:" + that.picInfo.minParticipants + ".";
		      }else if(that.children + that.adults<1){
		      		that.peopleErr=true
		      }else {
		      	next=true
		      	window.ga && ga("gtag_UA_107010673_2.send", {
			        hitType: "event",
			        eventCategory: "activity_detail",
			        eventAction: "click",
			        eventLabel: "activity_order_succ"
			      });
		        that.dateErr=false
		        that.peopleErr=false
		        var orderInfo = {
		          userId: localStorage.getItem("userid")
		            ? localStorage.getItem("userid"): null,
		          activityId: that.id,
		          amount:
		            that.children > 0 && that.picInfo.childDiscount
		              ? that.returnFloat(that.returnFloat(that.adultsPic) - that.returnFloat(that.children * that.picInfo.childDiscount))
		              : that.returnFloat(that.adultsPic),
		          currency: that.picInfo.currency,
		          adultNum: that.adults,
		          refundTimeLimit:that.refundTimeLimit,
		          childrenNum: that.children,
		          infantNum: that.infant,
		          startDate: that.dateTime,
		          startTime: that.time ? that.time : null,
		          adultsPic: that.returnFloat(that.adultsPic),
		          title: that.title,
		          childDiscountP: that.picInfo.childDiscount,
		          category: that.category,
		          averagePrice: that.returnFloat(
		            that.adultsPic / (that.adults + that.children)
		          ),
		          childDiscount: that.picInfo.childDiscount
		            ? that.returnFloat(that.children * that.picInfo.childDiscount)
		            : null
		        };
		        orderInfo = JSON.stringify(orderInfo);
		        
		        localStorage.setItem("orderInfo", orderInfo);
				
				location.href="/activity/booking/"
		        //routes.push('/fillYourInfo')
		      }
	    		if(next==false){
	    			this.gaFail()
	    		}
			}
		},
		mounted: function() {
			
			let that=this
			this.logIn = window.localStorage.getItem("logstate");

			var objDetail = JSON.parse(window.localStorage.getItem("objDetail"));
			
			this.picInfo = objDetail.picInfo
			this.id= objDetail.id
			this.title= objDetail.title
			this.category= objDetail.category
			this.refundTimeLimit= objDetail.refundTimeLimit*24


			//加载币种
			that.axios.get("https://api.localpanda.com/api/public/currency/all/"+that.picInfo.defaultCurrency).then(function(response) {
				// console.log(response);
				if(response.status==200){
					that.exchange = response.data;
					that.nowExchange = that.exchange[0];
				}
			}, function(response) {});

			//console.log(this.picInfo.details);
			this.picInfo.details = this.tableData(this.picInfo.details);
			

			//设置默认人数总价
			var maxPeople = this.picInfo.maxParticipants;

			if(this.people > maxPeople){
				this.people = maxPeople;
				this.adults = maxPeople;
			}

			//根据人数默认总价
			this.adultsPic = this.picInfo.details[this.people-this.picInfo.details[0].capacity].price;

			this.options = {
				minDate: this.picInfo.earliestBookDate,
				maxDate: addmulMonth(this.picInfo.earliestBookDate, 12),
				disableMobile: true,
				onOpen : function(e){
					
					that.showWinBg = true;
				},
				onChange(){
					that.showWinBg = false;
				}
			}
			
			that.flatPickr = new Flatpickr('#js_changetime',this.options);
			
			
			document.getElementById('win_bg').addEventListener('touchstart', function() {
				that.showWinBg=false
			})

			window.onpopstate = function(event) {
				if(that.isshowDetail){
					that.isshowDetail = false;
				}
			};
			
		},
		watch: {
			"flatPickr.isOpen":function(val,oldVal){
	    		if(val){
	    			this.isshowchoose = false
	    			document.getElementsByTagName("html")[0].style.overflow="hidden"
	    		}else{
	    			document.getElementsByTagName("html")[0].style.overflow="inherit"
	    		}
    		},
			dateTime:function(val,oldVal){
				window.ga && ga("gtag_UA_107010673_2.send", {
					hitType: "event",
					eventCategory: "activity_detail",
					eventAction: "select",
					eventLabel:"date"
				});
				window.ga && ga("gtag_UA_107010673_2.send", {
					hitType: "event",
					eventCategory: "activity_detail",
					eventAction: "select",
					eventLabel:"detail_select"
				});
				if(val){
					this.dateErr=false
				}
			},
			adults(val, odlVal) {
		      this.people = val + this.children;
		    },
		    children(val, oldVal) {
		      this.people = val + this.adults;
		    },
		    people(val,oldVal){
		    	if(val>=this.picInfo.minParticipants||val>=1){
		    		this.dateErrText=""
		    		this.peopleErr=false
		    	}
		    	for (var i = 0; i < this.picInfo.details.length; i++) {
		        if (this.adults + this.children == this.picInfo.details[i].capacity) {
		          this.adultsPic = this.picInfo.details[i].price;
		          
		          break;
		        } else {
		          if (this.adults + this.children < this.picInfo.details[i].capacity) {
		            this.adultsPic = this.picInfo.details[i].price;
		            
		            break;
		          }
		        }
		      }
		    }
		}
	};
</script>
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
		.flatpickr-day.disabled, .flatpickr-day.disabled:hover{
			color:rgba(57, 57, 57, .3);
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
	.flatpickr-day.nextMonthDay{
		color: #393939!important;
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

	
</style>
<style lang="scss" scoped>
	
	.bookDetail {
		padding: 1rem 0.45rem 1.946666rem;
		.head_back{
			position: absolute;
			left: 0;
			top: 0;
			width: 100%;
		}
		.back {
			padding: 0.34rem 0 0.4rem;
		}
		.head {
			h3 {
				font-size: 0.6rem;
				font-weight: bold;
			}
			p {
				font-size: 0.34rem;
				line-height: 0.48rem;
				margin-top: 0.2rem;
				font-weight: bold;
			}
		}
		.select {
			margin-top: 0.56rem;
			p{
				margin-top: 0.266666rem;
				color: red;
			}
			ul {
				li {
					border-top: 1px solid #ebebeb;
					
					line-height: 1.4rem;
					label {
						float: left;
						font-size: 0.36rem;
						line-height: 0.8rem;
						padding: 0.3rem 0;
					}
					div {
						float: right;
						width: 70%;
						text-align: right;
						font-size: 0.36rem;
					}
					.selectPeople{
						clear: both;
						width: 100%;
					}
					span{
						i{
							color: rgba(135,142,149,0.5);
							font-size: 0.48rem;
							margin-right: 0.173333rem;
							position: relative;
							top:2px;
						}
						float: right;
						text-align: right;
						font-size: 0.36rem;
						&.weight{
							font-weight: bold;
						}
					}
					&:last-child {
						border-bottom: 1px solid #ebebeb;
					}

					.picRate {
						color: #666;
						float: right;
						width: auto;
						position: relative;
						margin:0 0.3rem 0 0;
						span {
							font-size: 10px;
						}
						.iconfont{
							position: absolute;
							right: 0;
							top:0;
							
							text-align:center;
							font-size:18px;
						}
						.currency_type{
							border:none;
							padding-right: 20px;
							font-size: 16px;
							background:none;
							
							color: #666;
							option{
								color:#666;
							}
							position: relative;
							z-index: 2;
							-webkit-appearance: none;
							-moz-appearance: none;
							appearance: none;
						}
					}
				}
			}
		}
		.btn_next {
			position: fixed;
			bottom: 0;
			left: 0;
			width: 100%;
			padding: 0.32rem 0.4rem;
			z-index: 99;
			button {
				width: 100%;
				height: 0.9rem;
				line-height: 0.9rem;
				background-image: linear-gradient(270deg, #009efd 0%, #1bbc9d 100%);
				text-align: center;
				color: #fff;
				border-radius: 0.45rem;
				font-size: 0.32rem;
				font-weight: bold;
			}
		}
		.view {
			
			width: 100%;
			transition: all .3s cubic-bezier(.55, 0, .1, 1);
		}
		.slideleft-enter-active,
		.slideleft-leave-active {
			opacity: 0;
			-webkit-transform: translate(100%, 0);
			transform: translate(100%, 0);
		}
		.slideleft-enter,
		.slideleft-leave-to {
			opacity: 0;
			-webkit-transform: translate(100%, 0);
			transform: translate(100%, 0);
		}
		.err{
			border-top:1px solid red!important;
			border-bottom:1px solid red!important;
			color: red;
		}
		.placeho{
			color:#878e95;
		}
		
		.win_bg{ width:100%; height:100%; background-color:rgba(0,0,0,0.5); position: absolute; left:0; top:0; z-index: 100;}
		.fade-enter-active, .fade-leave-active {
		transition: opacity .5s;
		}
		.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
		opacity: 0;
		}
		
	}

	
</style>