<template>
	<div class="header">
		<div class="nav_bg" :class="{show_nav:showWinBg}" @click="hideDialog"></div>

		<div class="header_box">
			<!-- 导航展开按钮 -->
			<div class="header_btn" @click="showNav">
				<span></span>
				<span></span>
				<span></span>
			</div>

			<!-- logo -->
			<div class="logo">
				<svg aria-hidden="true" @click="goHome">
						<use xlink:href="#icon-logo_"></use>
				</svg>
			</div>
		</div>
		

		<!-- 导航展开内容 -->
		<nav class="header_nav" :class="{show_nav:navIsShow}">
			<a href="/">Home</a>
			<a href="javascript:;" @click="showLoginPage" v-if="!islogIn">Log in</a>
			<a href="/user/profile?menu=1&flag=1" v-else>My Profile</a>
			<a href="/user/searchMyBookings">My Bookings</a>
			<a href="/travel/customize/step1">Customize Your Trip</a>
			<a href="/info/contact-us">Contact Us</a>
			<a href="/info/about-us">About Us</a>
			<a href="javascript:;" @click="logOut" v-if="islogIn">Log Out</a>
		</nav>

		<!-- 弹出登录 -->
		<div class="login_box" v-show="showLogin">
			<!-- 返回上一页，可以设置title属性,标签内有插槽可以写右上角的按钮等 -->
			<headBack :type="'close'" :pageClose="pageClose" title=""></headBack>

			<div class="login_content">
				<h2>Login</h2>
				<p>If you have already logged in via your <br>Facebook account and placed an order, you can login <br>through Facebook and view the status of your order</p>
				<span class="btn" @click="facebookLogin"><i class="iconfont">&#xe613;</i>Log in with Facebook</span>
			</div>
		</div>
	</div>
</template>

<script>
	import headBack from "~/components/header/back";

	export default {
		name:'M-head',
		data(){
			return {
				navIsShow: false,
				showWinBg: false,
				showLogin: false,
				islogIn: false
			}
		},
		components: {
			headBack
		},
		methods: {
			goHome(){
				location.href = '/';
			},
			showNav(){
				this.navIsShow = !this.navIsShow;
				this.showWinBg = !this.showWinBg;
			},
			hideDialog(){
				this.showWinBg = false;
				this.navIsShow = false;
				this.showLogin = false;
			},
			showLoginPage(){
				//弹出登录
				this.showLogin = true;
				//隐藏导航
				this.navIsShow = false;
			},
			pageClose(){
				//头部关闭回调
				this.showLogin = false;
				//隐藏背景
				this.showWinBg = false;
			},

			//facebook登录相关***********
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
			},
			logOut(){
				let that=this
				that.loadScript("//connect.facebook.net/en_US/sdk.js",that.fbAsyncInit)
			}
			//facebook登录相关***********

		},
		mounted: function() {
			
			var logstate = localStorage.getItem("logstate");
			this.islogIn = logstate?true:false;
			
		}
	}
</script>

<style lang="scss" scoped>
.header{
	background:#fff;
	height: 0.99rem;
	
	margin-bottom: 0.36rem;
	position: relative;
	z-index: 9;
	
	.header_box{
		position: relative;
		z-index: 2;
		background-color: #fff;
		border-bottom: #dde0e0 solid 1px;
		.logo{
			margin-left: 0.4rem;
			width: 2.2rem;
			height:0.99rem;
			overflow: hidden;
			svg{
				width: 100%;
				height: 100%;
			}
		}
		.header_btn{
			float: right;
			width: 1.15rem;
			height: 0.99rem;
			padding: 0.32rem 0.4rem;
			span{
				width: 100%;
				height: 0.04rem;
				display: block;
				background: #1bbc9d;
				margin-bottom: 0.11rem;
				&:nth-last-child(1){
					margin-bottom: 0;
				}
			}
		}
	}
	
	.nav_bg{
		width: 100%;
		height: 100vh;
		position: absolute;
		left: 0;
		top: 0;
		background-color: rgba(0,0,0,0.4);
		visibility: hidden;
		opacity: 0;
		-webkit-transition:all 0.4s ease-out 0s; 
  	transition:all 0.4s ease-out 0s; 
	}
	.header_nav{
		visibility: hidden;
		opacity: 0;
		-webkit-transition:all 0.4s ease-out 0s; 
  	transition:all 0.4s ease-out 0s; 
		position: relative;
		z-index: 2;
		background-color: #fff;
		a{
			border-bottom: #ebebeb solid 1px;
			display: block;
			-webkit-transition:all 0.4s ease-out 0s; 
  		transition:all 0.4s ease-out 0s; 
			height: 0;
			line-height: 0;
			margin: 0 0.38rem;
			color: #353a3f;
			font-size: 0.26rem;
			overflow: hidden;
			
			&:nth-last-child(1){
				margin-bottom: 0;
			}
			&:focus{
				color: #1bbc9d;
			}
		}
	}
	.show_nav{
		visibility: inherit;
		opacity: 1;
		a{
			height: 1.18rem;
			line-height: 1.18rem;
		}
	}
	.login_box{
		position: fixed;
		left: 0;
		top: 0;
		z-index: 3;
		width: 100%;
		background-color: #fff;
		padding-bottom: 0.8rem;
		.login_content{
			padding: 0 0.4rem;
		
			h2{
				font-size: 0.38rem;
				color: #353a3f;
				text-align: center;
			}
			p{
				color: #353a3f;
				font-size: 0.26rem;
				line-height: 0.3rem;
				margin-top: 0.3rem;
				text-align: center;
			}
			.btn{
				background: #4361b3;
				margin-top: 0.36rem;
				i{
					font-size: 0.36rem;
					vertical-align: top;
					margin-right: 0.1rem;
				}
			}
		}
	}
}
</style>