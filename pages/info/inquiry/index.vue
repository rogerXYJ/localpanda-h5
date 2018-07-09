<template>
	<div class="inquiry">
		<div class="back"><i class="iconfont" @click="back">&#xe615;</i></div>
		<div class="head">
			<h3>Send My Inquiry</h3>
			<p>If you have questions or needs about any specific tour, we have professional consultants to answer your questions 
on a 1-1 basis.</p>
		</div>
		<div class="fillin ">
			<div class="inputItem">
				<p>Name<span>*</span></p>
				<input v-model="name" :class="{err:nameError}" @focus="namefocus" class="inputin" />
			</div>
			<div class="inputItem">
				<p>Email Address<span>*</span></p>
				<input v-model="email" :class="{err:emailErr}" @focus="emailfocus" class="inputin"/>
			</div>
			<div class="inputItem">
				<p>Date of Arrival</p>
				<input id="js_changetime" class="inputin" placeholder="Select Date" onfocus="this.blur()" v-model="dateTime" readonly type="text">
			</div>
			<div class="inputItem">
				<p>Number of People<span>*</span></p>
				<div class="peopleN">
					<div class="peopleshow" :class="peopleNub==0?'color8':''"  @click.stop="showchoose">
						<span v-if="peopleNub==0">Select People</span>
						<span v-if="peopleNub==1">1 Person</span>
						<span v-if="peopleNub>1">{{peopleNub}} People</span>
						<i class="iconfont icon-down" v-if="!isshowchoose">&#xe60f;</i>
						<i class="iconfont icon-down" v-else>&#xe63f;</i>
					</div>
					<div class="choosePeople" v-if="isshowchoose">
						<b>People</b>
						<div class="operation">
							<em class="iconfont" @click.stop="del(0)">&#xe64d;</em>
							<div>{{peopleNub}}</div>
							<em class="iconfont" @click.stop="add(0)">&#xe64b;</em>
						</div>
					</div>
				</div>
			</div>
			<div class="inputItem">
				<p>Message<span>*</span></p>
				<textarea v-model="textInfo" @focus="textInfofocus" :class="{err:textInfoErr}"></textarea>
			</div>
		</div>
		
		<div class="btn" @click.stop="submit">Submit</div>
		<Dialog @setIsShowAlert="setShowAlert" 
				:isShowAlert="isShowAlert"
				:alertTitle="alertTitle"
				:alertMessage="alertMessage"
				></Dialog>
		<transition name="fade">
			<div class="win_bg" id="win_bg" @click="showWinBg = false" v-show="showWinBg"></div>
		</transition>
	</div>
</template>

<script>

	import Dialog from "~/components/info/inquiry/Dialog"
	import { regExp, GetDateStr, addmulMonth } from '~/assets/js/utils'
	import Flatpickr from 'flatpickr';
	export default {
	
    name: 'inquiry',
    data () {
    	let id=this.$route.query.objectId
    	console.log(id)
        return {
          	name:'',
          	nameError:false,
          	email: '',
			emailErr: false,
			textInfo: '',
			textInfoErr: false,
			
      		dateTime:'',
          	options:{},
          	showWinBg:false,
          	isshowchoose:false,
          	peopleNub:0,
          	flatPickr:null,
          	objectType:"ACTIVITY",
          	isclick:false,
          	
          	
          	isShowAlert:false,
          	alertTitle:"",
          	alertMessage:"",
          	objectId:id
        }
    },
    components: {
        Dialog
    },
    methods: {
       setShowAlert(val){
       	this.isShowAlert=val
       },
       back(){
       	 history.back()
       },
       namefocus() {
			this.nameError = false
		},
		emailfocus() {
			this.emailErr = false
		},
		textInfofocus() {
			this.textInfoErr = false
		},
		GAfail(){
			ga('gtag_UA_107010673_2.send', {
					hitType: 'event',
					eventCategory: 'activity_detail',
					eventAction: 'submit',
					eventLabel: 'activity_inquiry_fail',

				});
		},
    submit(){
			let ok=false
			let that = this;

			setTimeout(function(){
				var err = document.querySelectorAll('.err')[0];
				if(err){
					err.scrollIntoViewIfNeeded();
					// var errT = err.offsetTop;
					// var doc = document.querySelectorAll('html,body');
					// doc[0].scrollTop = errT;
					// doc[1].scrollTop = errT;
				}
			},60);


			if(that.name == '' || regExp.isNub(that.name) || regExp.isCode(that.name)) {
				ok=false
				that.nameError = true
			} else if(!regExp.isEmail(that.email)) {
				that.emailErr = true
				ok=false
			}else if(that.peopleNub==0){
				ok=false
				that.isshowchoose=true
			
			}else if(that.textInfo == '') {
				that.textInfoErr = true
				ok=false
			}else{
				ok=true
				ga('gtag_UA_107010673_2.send', {
						hitType: 'event',
						eventCategory: 'activity_detail',
						eventAction: 'submit',
						eventLabel: 'activity_inquiry_succ',
	
					});
				var obj = {
					objectType: that.objectType,
					userName: that.name,
					emailAddress: that.email,
					message: that.textInfo,
					//phoneNumber:that.phone?that.phone:null,
					travelDate: that.dateTime ? that.dateTime : null,
					participants: that.peopleNub,
					objectId: that.objectId ? that.objectId : null,
//					destinations: that.destination ? that.destination : null,
					"utcOffset": new Date().getTimezoneOffset() / 60 * -1,
				}
				
				if(that.isclick==false){
					that.isclick=true
					that.axios.post("https://api.localpanda.com/api/user/feedback/commit", JSON.stringify(obj), {
						headers: {
							'Content-Type': 'application/json; charset=UTF-8'
						}
					}).then(function(response) {
						
						
						if(response.data.succeed) {
							
							that.isShowAlert=true
				       		that.alertTitle="Submission completed!"
				       		that.alertMessage="Thank you for your feedback. We will get back to you within 1 day."	
							
						} else {
						
						}

					}, function(response) {

					})
				}

				
				
			}
			if(ok==false){
				that.GAfail()
			}
       },
       showchoose(){
       	 this.isshowchoose=true
       },
       add() {
			this.peopleNub++
			
		},
		del() {
			if(this.peopleNub == 0) {
				this.peopleNub = 0
			} else {
				this.peopleNub--
			}	
		},
    },
  	created:function(){
  		let that=this
  		if(process.browser){
  			this.options = {
				minDate: GetDateStr(1),
				maxDate: addmulMonth(GetDateStr(1), 12),
				disableMobile: true,
				onOpen : function(selectedDates, dateStr, instance){
					
					that.showWinBg = true;
				},
				onChange(){
					that.showWinBg = false;
				}
			}
  		}
      	
  	},
    mounted: function() {
			let that=this
			that.flatPickr = new Flatpickr('#js_changetime',this.options);
			document.getElementsByTagName("body")[0].addEventListener('click', function() {
				that.isshowchoose = false
			})

			document.getElementById('win_bg').addEventListener('click', function() {
				that.showWinBg=false;
			})

			

    },
    watch:{
    	"flatPickr.isOpen":function(val,oldVal){
    		if(val){
    			this.isshowchoose = false
    			document.getElementsByTagName("html")[0].style.overflow="hidden"
    		}else{
    			
    			document.getElementsByTagName("html")[0].style.overflow="inherit"
    		}
    	}
    }
}
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
		position: fixed;
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
	.flatpickr-day{
		// color: #393939!important;
	}
	.flatpickr-day.disabled{
		// color: rgba(57, 57, 57, .3)!important;
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

	.inputItem {
		
		.flatpickr-input {
			height: 1rem!important;
			border:1px solid #dde0e0;
			border-radius: 0.08rem;
			padding-left: 0.24rem!important;
			font-size: 0.34rem!important;
		}
	}

	.alertTitle {
		.box{
			margin-left: 0 !important;
		}
	}

</style> 
<style lang="scss" scoped>
	.inquiry{
		padding:0 0.5rem 1rem;
		.back {
			padding: 0.34rem 0 0.3rem;
			i{
				font-size: 0.4rem;
			}
		}
		.head {
			h3 {
				font-size: 0.6rem;
				font-weight: bold;
			}
			p {
				font-size:0.28rem;
	line-height: 0.36rem;
			}
		}
		.fillin{
			margin-top: 0.3rem;
			
			.inputItem{
				margin-top:0.44rem;
				/*border-bottom: 2px solid #ebebeb;*/
				p{
					font-size:0.36rem;
					span{
						color: red;
					}
				}
				.peopleN{
					position: relative;
					.peopleshow{
						width:100%;
						height: 1rem;
						border:1px solid #dde0e0;
						border-radius: 0.08rem;
						padding-left: 0.24rem;
						line-height: 1rem;
						font-size: 0.34rem;
						margin-top: 0.133333rem;
						i{
							position: absolute;
							right: 0.36rem;
							
							font-size: 0.22rem;
							color: #878e95;
							
						}
						
					}
					.choosePeople{
						position: absolute;
						width:100%;
						top:1rem;
						left: 0;
						line-height:1.44rem;
						padding: 0 0.306666rem;
						background: #fff;
						box-shadow: 0px 0px 30px 0px rgba(0, 0, 0, 0.15);
						z-index:2;
		
						b{
							font-size: 0.42rem;
							float: left;
						}
						.operation{
							float:right;
							em{
								font-weight: bold;
								display: inline-block;
								width: 0.6rem;
								height: 0.6rem;
								border:1px solid #1bbc9d;
								border-radius: 50%;
								font-size: 0.186666rem;
								text-align:center;
								line-height:0.6rem;
								color:#1bbc9d;
								
							}
							div{
								display: inline-block;
								font-size: 0.38rem;
								margin: 0 0.5rem;
								vertical-align: middle;
								border:none;
							}
						}
					}
				}
				.inputin{
					width:100%;
					height: 0.9rem;
					border:1px solid #dde0e0;
					border-radius: 0.08rem;
					padding-left: 0.24rem;
					font-size: 0.34rem;
					margin-top: 0.1rem;
					&:-webkit-placeholder { /* Mozilla Firefox 4 to 18 */
						color: #878e95; 
					}
					
				}
				textarea{
						height:1.893333rem;
						border:1px solid #dde0e0;
						border-radius: 0.08rem;
						width: 100%;
						padding-left: 0.24rem;
						padding-top: 0.22rem;
						margin-top: 0.3rem;
						font-size: 0.28rem;
						&:-webkit-placeholder { /* Mozilla Firefox 4 to 18 */
    						color: #dde0e0; 
						}
					}
			}
		}
		.btn{
			margin-top: 0.6rem;
		}
		.win_bg{ width:100%;height: 100%; background-color:rgba(0,0,0,0.5); position:fixed; left:0; top:0;}
		.fade-enter-active, .fade-leave-active {
		transition: opacity .5s;
		}
		.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
		opacity: 0;
		}
		.err {
			border-color: red!important;
			color: red!important;
		}
		.color8{
			color: #878e95;
		}

		
	}

	
</style> 