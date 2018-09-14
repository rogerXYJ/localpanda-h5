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
					<label>Available On</label>
					<div class="dateTime">
						<!-- <flatPickr placeholder="Please Select" v-model="dateTime" :config="options"></flatPickr> -->
						<input id="js_changetime" placeholder="Select Date" onfocus="blur()" v-model="dateTime" readonly type="text">
					</div>
				</li>

				<li class="clearfix" @touchend="show()" :class="{err:peopleErr}">
					<!-- <label>Guests</label>
					<div v-if="adults+children<1" class="guests">{{people + (people>1?" People":" Person")}}</div>
					<div v-if="adults+children==1" class="guests">{{adults+children}} Person</div>
					<div v-if="adults+children>1" class="guests">{{adults+children}} People</div> -->

					<SelectPeople  class="view" :people="people" :picInfo="picInfo" @call-back="setCallBack" @sureSelect="getSave"></SelectPeople>
				</li>
				
				<li class="clearfix" v-if="adults+children>=1">
					<label v-if="children==0&&adults==1">{{nowExchange.symbol}}{{returnFloat(adultsPic/(adults+children))}} x {{adults+children}} Person</label>
					
					<label v-else>{{nowExchange.symbol}}{{returnFloat(adultsPic/(adults+children))}} x {{adults+children}} People 
					<br/>
					<em v-if="children>0&&picInfo.childDiscount"><b style="display: inline-block;">- {{nowExchange.symbol}}{{returnFloat(children*picInfo.childDiscount)}}</b> for child(ren)</em>
					</label>
					<span @click.stop="showPriceDetail"><i class="iconfont">&#xe659;</i>{{nowExchange.symbol}}{{returnFloat(adultsPic)}}</span>
				</li>
				<li class="clearfix" v-if="adults+children>=1">
					<label>Total ({{picInfo.currency}})</label>
					<span class="weight" v-if="children>0&&picInfo.childDiscount">{{nowExchange.symbol}}{{returnFloat(returnFloat(adultsPic)-returnFloat(children*picInfo.childDiscount))}}</span>
					<span class="weight" v-else>{{nowExchange.symbol}}{{returnFloat(adultsPic)}}</span>

					<div class="picRate">
						<select class="currency_type" @change="changeCurrency" v-model="picInfo.currency">
							<option :value="item.code" v-for="item in exchange" :key="item.code">{{item.code}}</option>
						</select>
						<span class="iconfont">&#xe666;</span>
					</div>
				</li>
			</ul>
			<p>{{dateErrText}}</p>
			<p style="color:#353a3f" v-if="dateTime&&timeout&&picInfo.fullRefund">You can reschedule or cancel your trip at zero cost before {{formatDate(delmulDay(dateTime,picInfo.refundTimeLimit))}}.</p>
		</div>
		<div class="btn_next">
			<button @click="order">Next</button>
		</div>
		<!-- <transition name="slideleft">
			
		</transition> -->
		<transition name="slideleft">
			<div class="priceDetail" v-if="isshowDetail">
				<div class="cont">
					<div class="back"><i class="iconfont" @click="back">&#xe606;</i></div>
					<div class="head">
						<h3>Price details</h3>
					</div>
					<div class="details">
						<p class="childDiscount" v-if="picInfo.childDiscount">Children's price is   {{picInfo.symbol}}  {{returnFloat(picInfo.childDiscount)}} {{picInfo.currency}}  less than adults' price.</p>


						<table class="price_list">
							<tr>
								<th>No. of people</th>
								<th>Total cost</th>
								<th>Price per person</th>
							</tr>
							<tr :key="index" v-for="(item,index) in picInfo.details">
								<td>
									<span v-if="item.capacity==1">1 person</span>
									<span v-else>{{item.capacity}} people</span>
								</td>
								<td>
									<span>{{picInfo.symbol}} {{returnFloat(item.price)}} {{picInfo.currency}}</span>
								</td>
								<td>
									<div v-show="item.capacity">
										<span>{{picInfo.symbol}} {{returnFloat(item.price/item.capacity)}} {{picInfo.currency}}</span>
									</div>
								</td>
							</tr>
						</table>
					</div>
				</div>
			</div>
		</transition>
		
		<transition name="fade">
			<div class="win_bg" id="win_bg" @click="showWinBg = false" v-show="showWinBg"></div>
		</transition>
		
	</div>
	
</template>

<script>
	import Flatpickr from 'flatpickr';
	
	import { GetDateStr, addmulMonth, getPriceMark,formatDate} from "~/assets/js/utils";
	import SelectPeople from "~/components/activity/details/SelectPeople"
	// import PriceDetail from "~/components/activity/details/PriceDetail"
	import headBack from "~/components/header/back";
	import Vue from 'vue';

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


			let id = route.params.id;
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
			
			var currency = {code: "USD", symbol: "$", exchangeRate: 1};
			if(userCookie.currency){
				currency = JSON.parse(decodeURIComponent(userCookie.currency));
				
			}
			
			var data = {
				dateTime: '',
				logIn: '',
				people:0,
				picInfo: '',
				refundTimeLimit:'',
				options: {},
				isshow: false,
				adults: 0,
				children: 0,
				infant: 0,
				adultsPic:'',
				id:'',
				title:'',
				pickup:'',
				dateErr:false,
				peopleErr:false,
				dateErrText:"",
				showWinBg : false,
				isshowDetail:false, //priceDetail
				participants:0,
				nowExchange:currency,//{'rate':1,'currency':'USD','symbol':'$'}
				exchange:[],
				timeout:false,
				owner:'',
				currency:currency,
				calendar:[]
				
			};
			if(userCookie.participants){
				data.participants=JSON.parse(decodeURIComponent(userCookie.participants))
				data.adults=data.participants
				data.people=data.participants
			}
			
			//基本信息
			var Promise1 = new Promise(function(resolve, reject){
				Vue.axios.get(apiBasePath + "product/activity/" + id).then(function(res) {
					// var consoleTimeS2 = new Date().getTime();
					// 	console.log('基本信息接口花费时间：'+(consoleTimeS2-consoleTimeS)+' ms');
					var thisData = res.data;
						if(!thisData.allAvailable){
							Vue.axios.get(apiBasePath + "product/activity/"+id+"/sale/calendar").then(function(data) {
								
								resolve(data);
							}, function(res) {
								resolve(data);
							});
						}else{
							resolve(data);
						}

					
				}, function(res) {
					resolve(data);
				});
			});
			var Promise2 = new Promise(function(resolve, reject){
					Vue.axios.get(apiBasePath + "product/activity/"+id+"/price?currency="+data.currency.code).then(function(res) {
						// var consoleTimeS2 = new Date().getTime();
						// 	console.log('价格接口花费时间：'+(consoleTimeS2-consoleTimeS)+' ms');
						resolve(res);
					}, function(res) {
						resolve(res);
					});
				});

			//价格明细
			var Promise3 = new Promise(function(resolve, reject){
				Vue.axios.get(apiBasePath + "product/activity/"+id+"/price/detail?currency="+data.currency.code).then(function(res) {
					// var consoleTimeS2 = new Date().getTime();
					// 	console.log('价格接口花费时间：'+(consoleTimeS2-consoleTimeS)+' ms');
					resolve(res);
				}, function(res) {
					resolve(res);
				});
			});
			Promise.all([Promise1,Promise2,Promise3]).then(function(results){
				data.calendar = results[0].data?results[0].data:[];
				data.picInfo=results[1].data
				data.picInfo.details=results[2].data

				
				//同步回调
				callback(null,data);
			});		
		},

		components: {
			//flatPickr,
			SelectPeople,
			// PriceDetail,
			headBack
		},
		methods: {
			 changeCurrency(e) {
				var self = this; 
				var value = e.target.value;
				var picInfo=self.picInfo
				picInfo.currency=value
				var exchange = this.exchange;
				for(var i = 0; i < exchange.length; i++) {
					var thisEx = exchange[i];
					if(thisEx.code == value) {
						this.nowExchange = thisEx;
						picInfo.symbol=thisEx.symbol
						
					}
				}
				const p1 = new Promise(function (resolve, reject) {
						self.axios.get("https://api.localpanda.com/api/product/activity/"+self.id+"/price?currency="+value).then(function(res) {
							resolve(res)
						}, function(res) {
							
						});
					});

					const p2 = new Promise(function (resolve, reject) {
						self.axios.get("https://api.localpanda.com/api/product/activity/"+self.id+"/price/detail?currency="+value).then(function(res) {
							resolve(res)
						}, function(res) {
							
						});
					
					})
					Promise.all([p1,p2]).then(results=>{
							if(picInfo.childDiscount){
								picInfo.childDiscount=self.returnFloat(results[0].data.childDiscount)
							}
							self.picInfo=results[0].data
							self.picInfo.details=results[1].data
							
							for(var i=0;i<results[1].data.length;i++){
								if(self.adults+self.children==results[1].data[i].capacity){
									self.adultsPic=self.returnFloat(results[1].data[i].price)
									
									self.averagePrice=self.returnFloat(results[1].data[i].perPersonPrice)
									self.amount=self.children > 0 && picInfo.childDiscount ?
							self.returnFloat(self.returnFloat(results[1].data[i].price) - self.returnFloat(self.children * results[0].data.childDiscount)):
							self.returnFloat(results[1].data[i].price)
							
							
							}

							
						}		

					})
					Cookie.set('currency',JSON.stringify(this.nowExchange),{path:'/','expires':30});
				
			 },
			// changeCurrency(e){
			// 	var self = this;
			// 	var value = e.target.value;
			// 	var picInfo = this.picInfo;
			// 	var thisDetail = picInfo.details;

			// 	//换算折扣价
			// 	var exchange = this.exchange;
			// 	for(var i=0;i<exchange.length;i++){
			// 		var thisEx = exchange[i];
			// 		//检测当前货币类型
			// 		if(thisEx.code==value){
			// 			//设置当前币种
			// 			this.nowExchange = thisEx;
			// 			//切换折扣价币种
			// 			picInfo.currency = value;
			// 			picInfo.symbol = thisEx.symbol;
			// 			picInfo.bottomPrice = picInfo.defaultPrice.bottomPrice * thisEx.exchangeRate;
			// 			picInfo.originalPrice = picInfo.defaultPrice.originalPrice * thisEx.exchangeRate;
			// 			if(picInfo.defaultPrice.childDiscount){
			// 				//之所以在这里加returnFloat，是为了让儿童优惠后的总价格，不会超过总价-儿童优惠价
			// 				picInfo.childDiscount = picInfo.defaultPrice.childDiscount * thisEx.exchangeRate;
			// 			}
			// 			//切换价格详情币种
			// 			for(var i=0;i<thisDetail.length;i++){
			// 				thisDetail[i].price = thisDetail[i].defaultPrice * thisEx.exchangeRate;
			// 			}

			// 			break;
			// 		}
			// 	}
				
			// 	//this.detailAll = this.tableData(thisDetail);

			// 	if(this.people>0){
			// 		this.adultsPic = thisDetail[this.people-thisDetail[0].capacity].price;
			// 	}

			// 	//修改全站默认币种
			// 	Cookie.set('currency',JSON.stringify(this.nowExchange),{path:'/','expires':30});
			// },
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
				//设置人数列表价格
				// for(var i=0; i<thisDetail.length; i++){
				// 	var thisPrice = thisDetail[i].defaultPrice;
				// 	thisDetail[i].defaultPrice = thisPrice;
				// }
			//},
			// tableData(details) {
				
			// 	var newObj = function(obj) {
			// 		var o = {};
			// 		for(var key in obj) {
			// 			o[key] = obj[key];
			// 		}
			// 		return o;
			// 	}

			// 	let newArr = [],
			// 		tableD = [];



			// 	if(details.length==1){
			// 		for(let i=0;i<details[0].capacity;i++){
			// 			var s=newObj(details[0]);
			// 			s.capacity = i+1;
			// 			newArr.push(s)
			// 		}
					
			// 	}else{
			// 		for(let i = 0; i < details[details.length-1].capacity; i++) {
			// 			let thisD = details[i];
			// 			newArr.push(thisD);
			// 			if(i + 1 > details.length - 1) break;

			// 			var thisC = thisD.capacity;
			// 			var nextC = details[i + 1].capacity;
			// 			var forLen = nextC - thisC - 1;
			// 			for(let j = 0; j < forLen; j++) {
			// 				var midArr = newObj(details[i+1]);
			// 				//console.log(midArr)
			// 				newArr.push(midArr);
			// 			}
			// 			//console.log(newArr)
			// 		}
			// 	}
				

			// 	for(var k = 0; k < newArr.length; k++) {
			// 		newArr[k].capacity = k + newArr[0].capacity;
			// 	}
				
			// 	return newArr;
			// },
			//退款时间计算
			delmulDay(dtstr, n) {
				var dt = new Date(dtstr.replace(/\-/g,'/'));
				dt.setDate(dt.getDate()-n);
				return dt.getFullYear() + "-" +parseInt(dt.getMonth()+1) + "-" + dt.getDate();
			},
			//国际时间转成美国时间
			formatDate:formatDate,
			back() {
				history.back()
			},
			show() {
				let that=this
				// setTimeout(()=>{
				// 	that.isshow = true
				// },0)
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
			retrunPrice(){
				var price = this.picInfo.details
				for(var i =0;i<price.length;i++){
					if(this.people==price[i].capacity){
						return price[i].price
					}
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
						
						next=false
				   
		      } else if (that.children + that.adults < that.picInfo.minParticipants) {
		      	that.peopleErr=true
		        that.dateErrText =
							"*Mimimum number of travelers:" + that.picInfo.minParticipants + ".";
							next=false
		      }else if(that.children + that.adults<1){
							that.peopleErr=true;
							next=false
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
		         
		          activityId: that.id,
		          amount:
		            that.children > 0 && that.picInfo.childDiscount
		              ? that.returnFloat(that.returnFloat(that.adultsPic) - that.returnFloat(that.children * that.picInfo.childDiscount))
		              : that.returnFloat(that.adultsPic),
							currency: that.picInfo.currency,
							symbol: that.picInfo.symbol,
		          adultNum: that.adults,
		          refundTimeLimit: that.picInfo.refundTimeLimit,
				  fullRefund:that.picInfo.fullRefund,
				  finalRefundPeriod:that.picInfo.fullRefund&&that.timeout?that.delmulDay(that.dateTime,that.picInfo.refundTimeLimit):null,
		          childrenNum: that.children,
		          infantNum: that.infant,
		          startDate: that.dateTime,
		          startTime: that.time ? that.time : null,
		          adultsPic: that.returnFloat(that.adultsPic),
		          title: that.title,
		          childDiscountP: that.picInfo.childDiscount,
				  pickup: that.pickup,
				  owner:that.owner,
		          averagePrice: that.returnFloat(
		            that.adultsPic / (that.adults + that.children)
		          ),
		          childDiscount: that.picInfo.childDiscount
		            ? that.returnFloat(that.children * that.picInfo.childDiscount)
		            : null
		        };
		        orderInfo = JSON.stringify(orderInfo);
		        
		        localStorage.setItem("orderInfo", orderInfo);
				
				location.href="/activity/booking/"+that.id
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
			
			//this.picInfo = objDetail.picInfo
			this.id= objDetail.id
			this.title= objDetail.title
			this.pickup= objDetail.pickup
			this.refundTimeLimit= objDetail.refundTimeLimit
			this.owner=objDetail.owner
			

			

			//加载币种
			that.axios.get("https://api.localpanda.com/api/public/currency/all/"+that.picInfo.currency).then(function(response) {
				// console.log(response);
				if(response.status==200){
					that.exchange = response.data;
					//that.nowExchange = that.exchange[0];
				}
			}, function(response) {});
			//that.exchange=Cookie.get('currency')?Cookie.get('currency'):{'code':'USD',}
			//console.log(this.picInfo.details);
			// this.picInfo.details = this.tableData(this.picInfo.details);
			

			//设置默认人数总价
			var maxPeople = this.picInfo.maxParticipants;

			if(this.people > maxPeople){
				this.people = maxPeople;
				this.adults = maxPeople;
			}
			console.log(this.calendar)
			//团期日期
			var saleDate = [];
			for(var i=0;i<this.calendar.length;i++){
				var thisData = this.calendar[i];
				saleDate.push(thisData.saleDate);
			}
			
			//根据人数默认总价
			if(this.participants>0){
				this.adultsPic =this.retrunPrice()
			}
			console.log(this.adultsPic)
			var currency=JSON.parse(Cookie.get('currency'))?JSON.parse(Cookie.get('currency')):{'code':'USD',symbol:"$"}
			this.picInfo.symbol=currency.symbol;
			this.options = {
				minDate: this.picInfo.earliestBookDate,
				maxDate: addmulMonth(this.picInfo.earliestBookDate, 12),
				disableMobile: true,
				enable: saleDate,
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
					var time1=new Date(val.replace(/-/g, '/')).getTime();
					var time2=new Date().getTime();
					if(parseFloat((time1-time2)/1000/60/60/24)>this.refundTimeLimit){
						this.timeout=true
					}else{
						this.timeout=false
					}
					console.log(this.timeout)


				}
			},
			adults(val, odlVal) {
		      this.people = val + this.children;
		    },
		    children(val, oldVal) {
		      this.people = val + this.adults;
		    },
		    people(val,oldVal){
		    	if(val>=this.picInfo.minParticipants){
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
						width:66%;
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
	.priceDetail{
		position: fixed;
		left: 0;
		top: 0;
		width: 100%;
		min-height: 100%;
		z-index: 99999999;
		background: #fff;
		.cont{
			position: absolute;
			left: 0;
			top: 0;
			height: 100%;
			width:100%;
			overflow: scroll;
			padding:0 0.4rem 0.533333rem;
			
			.back{
				padding: 0.34rem 0 0.4rem;
			}
			.head{
				h3{
					font-size:0.6rem;
					font-weight: bold;
				}
			}
		}
		.details{
			
			p{
				font-size: 0.32rem;
				margin-top: 0.2rem;
			}
		}
	}
	
</style>