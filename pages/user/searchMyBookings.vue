<template >
	<div class="searchMyBooking" >

		<!-- 返回上一页，可以设置title属性,标签内有插槽可以写右上角的按钮等 -->
		<headBack title=""></headBack>
		
		<div class="page_main">
			<h2>For Guest Users</h2>
			<p class="top_tip">Please enter reservee's following<br>information to view the order status</p>
			<ul class="search_info">
				<li class="user_name">
					<input class="input validate" type="text" vType="enName" v-model="lastName" placeholder="First name">
					<input class="input validate" type="text" vType="enName" v-model="firstName" placeholder="Last name">
				</li>
				<li>
					<input class="input validate" type="text" vType="email" v-model="email" placeholder="Email">
				</li>
				<li>
					<span class="btn" @click="search">Submit</span>
				</li>
			</ul>
			
			<p class="search_tip" v-show="showErrorText" v-html="errorText"></p>

			<div class="login_box">
				<h2>Login</h2>
				<p>If you have already logged in via your <br>Facebook account and placed an order, you can login <br>through Facebook and view the status of your order</p>
				<span class="btn" @click="facebookLogin"><i class="iconfont">&#xe613;</i>Log in with Facebook</span>
			</div>

		</div>
	</div>
	
</template>

<script>
	import Validate from "~/assets/js/panda/validate.js"
	import headBack from "~/components/header/back"

	export default {
		name: 'searchMyBooking',
		components: {
			headBack
		},
		data(){
			return {
				lastName: "",
				firstName: "",
				email: "",
				errorText: "The information marked red is incorrect. Please enter again. If you have any questions, you can email service@localpanda.com or call +862180182090.",
				showErrorText: false
			}
		},
		methods: {
			search(){
				var self = this;




				let postData = {
					"lastName": this.lastName,
					"firstName": this.firstName,
					"emailAddress": this.email
				};

				//校验
				if(this.validate.validate()){
					self.axios.post("https://api.localpanda.com/api/activity/order/list", JSON.stringify(postData), {
						headers: {
							'Content-Type': 'application/json'
						}
					}).then(function(response) {
						if(response.data.length>0){
							window.localStorage.setItem("obj",JSON.stringify(postData));
							window.location.href="/user/myBookings?menu=0&flag=1"
						}else{
							self.showErrorText = true;
						}
					}, function(response) {})
				}
				
				
			},

			ChangeCallback(response) {
				if(response.status === 'connected') {

				} else if(response.status === 'not_authorized') { //未经授权
					FB.logout(function(response) {})
				} else {
					//console.log('不是登陆到Facebook;不知道是否授权');
				}
			},
			fbAsyncInit() {
				let that = this
				FB.init({
					appId: '487179281653793',
					cookie: true,
					xfbml: true,
					version: 'v2.10'
				});
				FB.AppEvents.logPageView();

				// check on loading
				FB.getLoginStatus(function(response) {
					that.ChangeCallback(response);
				})
				that.loadJs=true
				
			},
			loadScript(url, callback,Fn) {
				var that=this
				var script = document.createElement('script');
				var head = document.getElementsByTagName('head')[0];
				var loaded;
				script.src = url;
				if(typeof callback === 'function'){
						script.onload = script.onreadystatechange = function(){
								if(!loaded && (!script.readyState || /loaded|complete/.test(script.readyState))){
										script.onload = script.onreadystatechange = null;
										loaded = true;
										callback();
										if(that.loadJs==true){
											Fn()
										}
								}
						}
				}
				head.appendChild(script);
			},
			facebookLogin(){
				let that = this
				that.loadScript("//connect.facebook.net/en_US/sdk.js",that.fbAsyncInit,that.logIn)
			},
			logIn(){
				let that=this
				FB.login(function(response) {
					/*console.log("login"+response)*/
					if(response.authResponse) {
						that.checkLoginState()
					}
				});
			},
			checkLoginState() {
				let that = this
				FB.getLoginStatus(function(response) {
					that.statusChangeCallback(response);
					//location.reload()
				})
			},
			statusChangeCallback(response) {
				const that = this
				if(response.status === 'connected') { //登陆状态已连接
					that.fbToken = response.authResponse.accessToken;
					that.faceUserID = response.authResponse.userID;
					/*console.log(response.authResponse.userID )
					console.log(that.faceUserID)*/
					var Istrue = false
					//获取用户信息
					FB.api('/me?fields=name,picture', function(response) {
						Istrue = true
						that.logImg = response.picture.data.url
						
						window.localStorage.setItem("user_photo", that.logImg)
						that.islogIn = 1;

						window.localStorage.setItem("logstate", that.islogIn);
						window.localStorage.setItem("fbToken", that.fbToken);
						
						that.getToken(Istrue)
					});

					//setTimeout(function(){history.go(0)},300)
				} else if(response.status === 'not_authorized') { //未经授权
					FB.logout(function(response) {})
				} else {
					//console.log('不是登陆到Facebook;不知道是否授权');
				}
			},
			getToken(Istrue) {
				if(Istrue == true) {
					let $this = this;
					let obj = {
						accessToken: $this.fbToken,
						userId: $this.faceUserID
					}
					this.axios.post("https://api.localpanda.com/api/user/login/facebook", JSON.stringify(obj), {
						headers: {
							'Content-Type': 'application/json; charset=UTF-8'
						}
					}).then(function(response) {
						/*console.log("getToken"+response)*/
						
						$this.userid = response.data.response
						
						window.localStorage.setItem("userid", $this.userid)
						
						window.location.href="/user/myBookings?menu=0&flag=1"
						

					}, function(response) {})
				}
			}
			
		},
		mounted(){
			//调用校验组件
			this.validate = new Validate({
				inputClassName:'validate',
				errorClassName:'valError'
			});
			
		}
	}
</script>
<style lang="scss">
	.page_main{
		padding: 0 0.4rem;
	}
	h2{
		font-size: 0.38rem;
		color: #353a3f;
		text-align: center;
	}
	.top_tip{
		text-align: center;
		color: #353a3f;
		font-size: 0.26rem;
		line-height: 0.3rem;
		margin-top: 0.32rem;
	}
	.input{
		height: 0.9rem;
		border-radius: 0.45rem;
		border: solid 1px #dde0e0;
		color: #353a3f;
		padding: 0 0.38rem;
		width: 100%;
	}
	.search_info{
		margin-top: 0.08rem;
		li{
			margin-top: 0.28rem;
			overflow: hidden;
		}
		.user_name{
			.input{
				width: 50%;
				float: left;
				&:first-child{
					border-radius: 0.45rem 0 0 0.45rem;
				}
				&:last-child{
					border-radius:0 0.45rem 0.45rem 0;
					margin-left: -1px;
				}
			}
			
		}
		.valError{
			border-color: #e14f3f;
			position: relative;
			z-index: 2;
		}
	}
	.search_tip{
		color: #e14f3f;
		font-size: 0.22rem;
		line-height: 0.3rem;
		margin-top: 0.5rem;
	}

	.login_box{
		margin-top: 0.5rem;
		padding-top: 0.42rem;
		border-top: #dde0e0 solid 1px;
		h2{}
		p{
			color: #353a3f;
			font-size: 0.26rem;
			line-height: 0.3rem;
			margin-top: 0.3rem;
			text-align: center;
		}
		.btn{
			background: #4361b3;
			margin: 0.36rem 0 0;
			i{
				font-size: 0.36rem;
				vertical-align: top;
				margin-right: 0.1rem;
			}
		}
		
	}
</style>
<style lang="scss" scoped>
	
</style>

