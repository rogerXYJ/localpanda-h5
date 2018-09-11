<template >
	<div class="searchMyBooking" >

		<!-- 返回上一页，可以设置title属性,标签内有插槽可以写右上角的按钮等 -->
		<headBack title=""></headBack>
		
		<div class="page_main">
			<h2>For Guest Users</h2>
			<!-- <p class="top_tip">Please enter reservee's following<br>information to view the order status</p> -->
			<ul class="search_info">
				<li class="user_name">
					<input class="input validate" type="text" vType="enName" v-model="firstName" placeholder="First name">
					<input class="input validate" type="text" vType="enName" v-model="lastName" placeholder="Last name">
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
				<p>If you have already logged in via your <br>Facebook account and placed an order, you can login <br>through Facebook and  view your order details</p>
				<span class="btn" @click="facebookLogin"><i class="iconfont">&#xe613;</i>Log in with Facebook</span>
			</div>

		</div>
	</div>
	
</template>

<script>
	import Validate from "~/plugins/panda/validate/"
	import FBLogin from "~/plugins/panda/FBLogin/";
	import headBack from "~/components/header/back"

	export default {
		name: 'searchMyBooking',
		components: {
			headBack
		},
		head() {
			let title = 'My Orders - Localpanda.com ';
			let description = 'Review your order history with Local Panda '
			let keywords ='My Orders, Local Panda'
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
		data(){
			return {
				lastName: "",
				firstName: "",
				email: "",
				errorText: "",
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
					self.axios.post("https://api.localpanda.com/api/order/activity/list", JSON.stringify(postData), {
						headers: {
							'Content-Type': 'application/json'
						}
					}).then(function(response) {
						if(response.data.length>0){
							window.localStorage.setItem("obj",JSON.stringify(postData));
							window.location.href="/user/myBookings?menu=0&flag=1"
						}else{
							self.errorText = "Sorry, we didn't find an order under this name and email";
							self.showErrorText = true;
						}
					}, function(response) {})
				}else{
					self.errorText = 'The information marked red is incorrect. Please enter again. If you have any questions, you can email service@localpanda.com or call +862180182090.';
					self.showErrorText = true;
				}
				
			},
			facebookLogin(){
				//faceBook登录,默认调用方法，其它调用参数，见js文件顶部
				new FBLogin({
					loginCallBack:function(){
						location.href="/user/myBookings?menu=0&flag=1";
					}
				});
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
		margin-top: 0.48rem;
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
.searchMyBooking{
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
}
	
</style>
<style lang="scss" scoped>
	
</style>

