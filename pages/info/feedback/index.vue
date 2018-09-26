<template>
	<div class="feedback">
		<div class="back"><i class="iconfont" @click="back">&#xe615;</i></div>
		<div class="head">
			<h3>Get in touch with us</h3>
			<p>If you have any questions, suggestions, or just want to chat, feel free to contact us using the boxes below. We'll 
get back to you within 1 day. </p>
		</div>
		<div class="fillin ">
			<div class="inputItem">
				<p>Name <span class="red">*</span></p>
				<input v-model="name" :class="{err:nameError}" @focus="namefocus" class="inputin" />
			</div>
			<div class="inputItem">
				<p>Email Address <span class="red">*</span></p>
				<input v-model="email" :class="{err:emailErr}" @focus="emailfocus" class="inputin"/>
			</div>
			<div class="inputItem">
				<p>Message <span class="red">*</span></p>
				<textarea v-model="textInfo" @focus="textInfofocus" :class="{err:textInfoErr}"></textarea>
			</div>
		</div>
		
		<div class="btn" @click.stop="submit">Send Us a Message</div>
		<Dialog @setIsShowAlert="setShowAlert" 
			:isShowAlert="isShowAlert"
			:alertTitle="alertTitle"
			:alertMessage="alertMessage"
		></Dialog>

		<!-- service弹窗 -->
		<dialogBox v-model="dialogStatus" confirmShow="true" confirmText="Confirm" @confirmCallback="confirmCallback" @closeCallback="confirmCallback" width="100%">
			
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
	import Dialog from "~/components/info/inquiry/Dialog"
	import service from '~/components/info/inquiry/service';
	import dialogBox from '~/plugins/panda/dialogBox';
	import { regExp, GetDateStr, addmulMonth } from '~/assets/js/utils'
	export default {
    name: 'inquiry',
    data () {
			return {
				name:'',
				nameError:false,
				email: '',
				emailErr: false,
				textInfo: '',
				textInfoErr: false,
		
					
				isclick:false,
				
				
				isShowAlert:false,
				alertTitle:"",
				alertMessage:"",


				//service
				dialogStatus:false,
				emailTip:false,
				emailSendTip:false,
				showEmailBox:false,
				inqueryEmail:'',
				inqueryEmailOld:'',
				feedbackId: ''
					
      }
    },
    components: {
			Dialog,
			dialogBox,
    	service
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
			gaFail(){
				ga('gtag_UA_107010673_2.send', {
					hitType: 'event',
					eventCategory: 'public',
					eventAction: 'submit',
					eventLabel: 'feedback_fail',

				});
			},
			submit(){
				let status=false
				let that = this
				if(that.name == '' || regExp.isNub(that.name) || regExp.isCode(that.name)) {
					that.nameError = true
					status=false
				} else if(!regExp.isEmail(that.email)) {
					that.emailErr = true
					status=false
				}else if(that.textInfo == '') {
					that.textInfoErr = true
					status=false
				}else{
					status=true
					ga('gtag_UA_107010673_2.send', {
						hitType: 'event',
						eventCategory: 'public',
						eventAction: 'submit',
						eventLabel: 'feedback_succ',
		
					});
					if(window.localStorage.getItem("userid")){
						var obj = {
							userId:window.localStorage.getItem("userid"),
							objectType:"GENERAL",
							userName: that.name,
							emailAddress: that.email,
							message: that.textInfo,
							"utcOffset": new Date().getTimezoneOffset() / 60 * -1
							
						}
					}else{
						var obj = {
							objectType:"GENERAL",
							userName: that.name,
							emailAddress: that.email,
							message: that.textInfo,
							"utcOffset": new Date().getTimezoneOffset() / 60 * -1
							
						}
					}
					
					if(that.isclick==false){
						that.isclick=true
						that.axios.put("https://api.localpanda.com/api/user/feedback", JSON.stringify(obj), {
							headers: {
								'Content-Type': 'application/json; charset=UTF-8'
							}
						}).then(function(response) {
							
							
							if(response.data.succeed) {
								
								that.contactCallBack({'data':response.data,'email':that.email});

								// that.isShowAlert=true
								// that.alertTitle="Submission completed!"
								// that.alertMessage="Thank you for your feedback. We will get back to you within 1 day."	
								
							} else {
								that.isShowAlert=true
								that.alertMessage="Failed!"
							}

							that.isclick=false;

						}, function(response) {
							that.isclick=false;
						})
					}
					
				}
				if(status==false){
					that.gaFail()
				}
      },
			confirmCallback(){
				this.dialogStatus = false;
				this.name = '';
				this.email = '';
				this.textInfo = '';
				
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
				
			}
    },
  	created:function(){
  
      	
  	},
    mounted: function() {
      
    },
    watch:{
    	
    }
	}
</script>
<style lang="scss">
	@import '~assets/scss/_main.scss';
	@import '~/assets/font/iconfont.css';
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
	
</style> 
<style lang="scss" scoped>
	.feedback{
		padding:0 0.4rem 1rem;
		.back {
			padding: 0.34rem 0 0.2rem;
			i{
				font-size: 0.4rem;
			}
		}
		.head {
			margin-top: 0.106666rem;
			h3 {
				font-size: 0.6rem;
				font-weight: bold;
				line-height: 0.42rem;
			}
			p {
				font-size:0.26rem;
				margin-top: 0.15rem;
			}
		}
		.fillin{
			margin-top: 0.3rem;
			
			.inputItem{
				margin-top:0.35rem;
				
				/*border-bottom: 2px solid #ebebeb;*/
				p{
					font-size:0.36rem;
					span{
						color: red;
						
					}
				}	
			
				.inputin{
					width: 100%;
					height: 0.86rem;
					line-height: 0.86rem;
					border:1px solid #dde0e0;
					border-radius: 0.08rem;
					padding-left: 0.24rem;
					font-size: 0.36rem;
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
						padding-top: 0.293333rem;
						margin-top: 0.13rem;
						font-size: 0.346666rem;
						&:-webkit-placeholder { /* Mozilla Firefox 4 to 18 */
    						color: #dde0e0; 
						}
					}
			}
		}

		.btn{
			margin-top: 0.5rem;
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
	}
</style> 