<template>
	<div class="header" :class="{'header_hyaline':isExpats}">
		<div class="nav_bg" :class="{'show_nav':showWinBg}"  @click="hideDialog"></div>

		<div class="header_box">

			<!-- 导航展开按钮 -->
			<div class="header_btn iconfont" @click="showNav">&#xe665;</div>
<!-- <span></span>
				<span></span>
				<span></span> -->

			

			<!-- 搜索 -->
			<div class="header_search_icon iconfont" @click="showSearchDialog=true">&#xe67a;</div>

			<!-- 币种 -->
			<div class="selectCurrey_box">
				<select class="selectCurrey" v-model="currency">
					<option v-for="(item,index) in exchange" :value="item.code">{{item.code}} ( {{item.symbol}} )</option>
				</select>
				<span class="iconfont selectCurreyIcon">&#xe666;</span>
			</div>
			
			<!-- logo -->
			<div class="logo" v-if="isExpats">
				<svg aria-hidden="true" @click="goHome">
						<use xlink:href="#icon-logo_2"></use>
				</svg>
			</div>
			<div class="logo" v-else>
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
			<a :href="islogIn?'/user/myBookings?menu=0&flag=1':'/user/bookings/entry'">My Bookings</a>
			<!-- <a href="/travel/customize/step1">Customize Your Trip</a> -->
			<a href="/info/feedback/">Contact Us</a>
			<a href="/info/about-us">About Us</a>
			<a href="javascript:;" @click="logout" v-if="islogIn">Log Out</a>
		</nav>

		<!-- 弹出登录 -->
		<div class="login_box" v-show="showLogin">
			<!-- 返回上一页，可以设置title属性,标签内有插槽可以写右上角的按钮等 -->
			<headBack :type="'close'" :close="pageClose" title=""></headBack>

			<div class="login_content">
				<h2>Login</h2>
				<p>You can use your Facebook account to log into www.localpanda.com and access our platform's services. Your login will be directed to Facebook. Local Panda does not track or own your personal information e.g. Facebook account or password. Please be assured to use our platform.</p>
				<span class="btn" @click="facebookLogin"><i class="iconfont">&#xe613;</i>Log in with Facebook</span>
			</div>
		</div>

		<!-- 搜索 -->
		<div class="h_search_all" :class="{h_search_show:showSearchDialog}">
			<div class="h_search_top">
				<i class="iconfont h_search_back" @click="hideDialogSearch">&#xe615;</i>
				<span class="btn" @click="searchFn">Search</span>
				<div class="h_search_input_box">
					<input type="text" id="h_search_input" @focus="autoComplate" @keyup="autoComplate" v-model="searchVal" maxlength="60" placeholder="Attraction, Activity, Destination">
					<span class="iconfont s_input_search">&#xe67a;</span>
					<span class="s_input_close" @click="searchVal=''">
						<i class="iconfont" v-show="searchVal">&#xe629;</i>
					</span>
				</div>
			</div>
			<div class="h_search_content">
				<div class="h_search_content_bg" @click="hideDialogSearch"></div>
				<dl class="h_search_complate" v-show="searchValTrim">
					<dd :key="index" v-for="(item,index) in searchData">
						<a :href="getUrl(item.value,'suggest')" @click="ga('search','suggestion'),ga('search','search')">
							<i class="iconfont" v-if="item.type=='DESTINATION'">&#xe610;</i>
							<i class="iconfont" v-else>&#xe609;</i>
							<span v-html="textHighlight(item.value)"></span>
						</a>
					</dd>
				</dl>

				<div class="h_search_hot" v-show="!searchValTrim">
					<dl>
						<dt>Destination</dt>
						<!-- <i class="iconfont">&#xe610;</i> -->
						<dd v-for="(item,index) in recommend.destination" :key="index"><a :href="getUrl(item,'recommend')" @click="ga('search','recommendation'),ga('search','search')">{{item}}</a></dd>
					</dl>

					<dl>
						<dt>popular choices</dt>
						<dd v-for="(item,index) in recommend.hot" :key="index"><a :href="getUrl(item,'recommend')" @click="ga('search','recommendation'),ga('search','search')">{{item}}</a></dd>
					</dl>

				</div>
				
			</div>
		</div>


	</div>
</template>

<script>
	import headBack from "~/components/header/back";
	import FBLogin from "~/plugins/panda/FBLogin/";

	export default {
		props:["showSearch",'searchValue',"isExpats",'nowCurrency'],
		name:'M-head',
		data(){
			var query = this.$route.query;
			return {
				navIsShow: false,
				showWinBg: false,
				showLogin: false,
				islogIn: false,
				showSearchDialog: false,
				searchData:[],
				searchVal: query.keyword?query.keyword:this.searchValue,
				query: query,
				path: this.$route.path,
				//gaType: query.type ? query.type : 'direct',
				inputTimer: null,
				//搜索默认推荐
				recommend:{
					destination:["Shanghai","Beijing","Xi'an","Guilin","Chengdu","Tibet","Suzhou","Hangzhou"],
					hot:["Bund","Watertown","Great Wall","Terra-Cotta Warriors","Forbidden City","Li River","Layover Tour","Day trips","Local Food","Dumplings","Landmarks","Short Excursions","Family Friendly","Panda","Everest Base Camp"]
				},

				currency: 'USD',
				exchange:[],
				showCurrency: true
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
			setBodyHidden(type){
				if(type){
					document.getElementsByTagName('html')[0].style.overflowY = 'hidden';
					document.getElementsByTagName('body')[0].style.overflowY = 'hidden';
				}else{
					document.getElementsByTagName('html')[0].style.overflowY = 'inherit';
					document.getElementsByTagName('body')[0].style.overflowY = 'inherit';
				}
				
			},
			facebookLogin(){
				//faceBook登录,默认调用方法，其它调用参数，见js文件顶部
				new FBLogin();
			},
			logout(){

				//faceBook退出登录,默认调用方法，其它调用参数，见js文件顶部
				new FBLogin({
					logout:true
				});
			},
			changeFn(){
				location.reload();
			},
			autoComplate(e){
				var self = this,
					keyword = e.target.value.replace(/(^\s*)|(\s*$)/g,'');

				if(e.keyCode == "13"){
					this.searchFn();
					return;
				}

				if(!keyword){
					self.searchData = [];
					return;
				}

				if(this.inputting){
					return;
				}

				var postData = {
					keyword: keyword,
					size: 10
				};

				var setTimes = 300;
				if(e.type=='focus'){
					setTimes = 0;
				}

				clearTimeout(this.inputTimer);
				this.inputTimer = setTimeout(function(){
					
					//请求数据
					self.axios.post("https://api.localpanda.com/api/search/suggest", JSON.stringify(postData), {
						headers: {
							'Content-Type': 'application/json'
						}
					}).then(function(response) {
						if(response.status == 200 || response.status == 304){
							self.searchData = response.data;
						}
					}, function(response) {
						
					})

				},setTimes);



				

			},
			getUrl(value,type){
				// var query = JSON.parse(JSON.stringify(this.query));
				// query.keyword = value;
				// var queryStr = '';
				// for(var key in query){
				// 	queryStr += '&' + key + '=' + encodeURIComponent(query[key]);
				// };
				// return '/activity/list/China' + (queryStr ? '?' : '') + queryStr.substring(1);

				return '/activity/list/China?keyword=' + value.replace(/(^\s*)|(\s*$)/g,'')+'&type=' + (type?type:'direct');
			},
			searchFn(){
				if(!this.searchVal.replace(/(^\s*)|(\s*$)/g,'')){
					document.getElementById('h_search_input').focus();
					return;
				}
				
				//调用ga
				this.ga('search','search');
				this.ga('search','direct');
				
				location.href = this.getUrl(this.searchVal,'direct');
			},
		
			textHighlight(value){
				var reg = new RegExp(this.searchVal.replace(/(^\s*)|(\s*$)/g,''),'gi');
				var textReg = value.match(reg);
				if(textReg){
					textReg = textReg[0];
				}
				return value.replace(reg,'<b>'+textReg+'</b>');
			},

			searchFocus(){
				setTimeout(function(){
					var thisInput = document.getElementById('h_search_input');
					thisInput.focus();
					thisInput.setSelectionRange(100,100);
				},300);
			},

			hideDialogSearch(){
				var thisInput = document.getElementById('h_search_input');
				thisInput.blur();
				var self = this;
				setTimeout(function(){
					self.showSearchDialog=false;
				},50);
			},

			moveStop(e){
				e.preventDefault();
			},

			//ga公用方法
			ga(action,label){
				var urlPath = this.$route.path.substring(1).split('/').join('_');
				if(/activity_list/.test(urlPath)){
					urlPath = 'activity_list';
				}else if(/activity_details/.test(urlPath)){
					urlPath = 'activity_details';
				}

				ga('gtag_UA_107010673_2.send', {
					hitType: 'event',
					eventCategory: urlPath,
					eventAction: action,
					eventLabel: label
				});
			}
		},
		computed:{
			searchValTrim(){
				return this.searchVal?this.searchVal.replace(/(^\s*)|(\s*$)/g,''):'';
			}
		},
		watch:{
			showWinBg:function(val){
				this.setBodyHidden(val);
			},
			showSearchDialog:function(val){
				this.setBodyHidden(val);
				if(val==false){
					this.$emit('closeSearch',false)
				}else{
					this.searchFocus();
				}
				
			},
			showSearch:function(val){
				this.setBodyHidden(val);
				this.showSearchDialog = val;
				this.searchFocus();
			},
			searchVal:function(val){
				this.$emit('searchChange',val);
			},
			currency:function(val){
				
				var thisCurrency = '',
					exchange = this.exchange;
				for(var i=0;i<exchange.length;i++){
					var thisData = exchange[i];
					if(thisData.code==val){
						thisCurrency = thisData;
					}
				}

				if(thisCurrency){
					
					Cookie.set('currency',JSON.stringify({
						code: thisCurrency.code,
						symbol: thisCurrency.symbol
					}),{path:'/','expires':30});
					console.log(Cookie.get('currency'))
					this.$emit('headCurrency',thisCurrency);
				}
			},			
			nowCurrency:function(val){
				this.currency= val.code;
			},
		},
		mounted: function() {
			this.showSearchDialog = this.showSearch;
			
			var logstate = localStorage.getItem("logstate");
			this.islogIn = logstate?true:false;
			
			//获取币种
			var self = this;
			window.currencyCallbackHeader = function(data){
				self.exchange = data;
				self.$emit('getExchange',data)
			};
			
			//读取币种
			var nowCurrency = JSON.parse(Cookie.get('currency'));
			if(nowCurrency){
				this.currency = nowCurrency.code;
			}


		}
	}
</script>

<style lang="scss" scoped>

.header{
	height: 0.99rem;
	position: relative;
	z-index: 100;
	
	.header_box{
		position: relative;
		z-index: 2;
		background: #fff;
		border-bottom: #dde0e0 solid 1px;
		.logo{
			margin-left: 0.3rem;
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
			height: 0.99rem;
			line-height: 0.99rem;
			padding: 0 0.3rem 0 0.25rem;
			font-size: 0.48rem;
			color: #1bbc9d;
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

		.selectCurrey_box{
			float: right;
			position: relative;
			margin-right: 0.15rem;
			.selectCurrey{
				-webkit-appearance: none;
				-moz-appearance: none;
				appearance: none;
				background-color: transparent;
				border: none;
				height: 0.98rem;
				line-height: 0.98rem;
				padding-right: 0.4rem;
				position: relative;
				z-index: 2;
			}
			span.iconfont{
				position: absolute; right: 0; top: 0; line-height: 0.99rem;
				font-size: 0.4rem;
			}
		}
		


		.header_search_icon{
			height: 0.98rem;
			line-height: 1rem;
			overflow: hidden;
			color: #1bbc9d;
			float: right;
			font-size: 0.4rem;
			padding: 0 0.2rem 0 0.25rem;
			
		}
	}

	.h_search_all{
		//background-color: #fff;
		position: fixed;
		left: 0;
		top: 0;
		z-index: -1;
		opacity: 0;
		-webkit-transform: translateY(1rem);
		-webkit-transition:all 0.2s ease-out 0s; 
  	transition:all 0.2s ease-out 0s; 
		width: 100%;
		height: 100vh;
		visibility: hidden;
		// overflow-y: auto;
		.h_search_top{
			background-color: #fff;
			height: 1.08rem;
			padding: 0.22rem 1.86rem 0 0.76rem;
			position: relative;
			z-index: 2;
			.h_search_back{
				position: absolute;
				left: 0;
				top: 0.24rem;
				line-height: 0.62rem;
				padding: 0 0.2rem;
			}
			.btn{
				float: right;
				margin-right: -1.56rem;
				width: 1.36rem;
				height: 0.62rem;
				line-height: 0.62rem;
				font-size: 0.24rem;
				box-shadow: 0rem 0.11rem 0.35rem 0rem	rgba(27, 188, 157, 0.3);
			}
			.h_search_input_box{
				width: 100%;
				height: 0.62rem;
				//background-color: #ffffff;
				box-shadow: 0rem 0rem 0.35rem 0rem rgba(53, 58, 63, 0.16);
				border-radius: 0.31rem;
				position: relative;
				overflow: hidden;
				.s_input_search{
					position: absolute;
					left: 0.15rem;
					top: 50%;
					-webkit-transform: translateY(-50%);
					color:#878e95;
				}
				.s_input_close{
					position: absolute;
					right: 0;
					top: 0;
					display: block;
					width: 0.62rem;
					height: 0.62rem;
					box-sizing: border-box;
					
					
					i{
						position: absolute;
						left: 50%;
						top: 50%;
						-webkit-transform: translate(-50%,-50%);
						width: 0.32rem;
						height: 0.32rem;
						line-height: 0.32rem;
						text-align: center;
						background-color: #dde0e0;
						padding: 0.02rem 0 0 0.02rem;
						box-sizing: border-box;
						color: #fff;
						border-radius: 50%;
						font-size: 0.2rem;
					}
				}
				input{
					width: 100%;
					height: 100%;
					border: none;
					padding:0 0.6rem;
					color: #353a3f;
				}
				input::-webkit-input-placeholder { color: #dde0e0; }
			}
		}
		.h_search_content{
			overflow-y: auto;
			height: calc(100vh - 1.08rem);
			//padding-bottom: 0.8rem;
			.h_search_content_bg{
				background-color: rgba(0, 0, 0, 0.7);
				width: 100%;
				height: 100vh;
				position: absolute;
				 left: 0;
				 top: 0;
			}
			.h_search_complate,.h_search_hot dl{
				position: relative;
				z-index: 2;
				background-color: #fff;
				overflow: hidden;
				padding-bottom: 0.3rem;
				min-height: 9.3rem;
				dt{
					height: 0.74rem;
					line-height: 0.74rem;
					font-weight: bold;
					text-transform: uppercase;
					padding: 0 0.3rem;
					background-color: #f5f7f7;
					position: relative;
					z-index: 2;
				}
				dd{
					margin: -1px 0.3rem 0;
					border-top: #ebebeb solid 1px;
					height: 0.92rem;
					line-height: 0.94rem;
					overflow: hidden; text-overflow:ellipsis; white-space:nowrap;
					color: #353a3f;
					a{
						font-size: 0.26rem;
						display: block;
						i{
							float: left;
							display: inline-block;
							margin-right: 0.16rem;
							color: #353a3f;
							
						}
						
					}
					
				}
			}
			
			.h_search_hot{
				position: relative;
				z-index: 2;
				min-height: 9.3rem;
				background-color: #fff;
				dl{
					padding-bottom: 0.3rem;
					min-height: 0!important;
					dt{
						margin-bottom: 0.1rem;
					}
					dd{
						float: left;
						border: none;
						background-color: #eef2f6;
						line-height: 0.64rem;
						height: 0.64rem;
						
						border-radius: 0.1rem;
						margin:0.2rem 0 0 0.3rem;
						a{
							padding: 0 0.3rem;
							&:focus{
								color: #1bbc9d;
							}
						}
					}
				}
			}
		}
	}
	.h_search_show{
		opacity: 1;
		z-index: 100;
		-webkit-transform: translateY(0);
		visibility: inherit;
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
			.fr_currency{
				float: right;
				font-size: 0.26rem;
				color: #1bbc9d;
			}
		}
	}
	.show_nav{
		visibility: inherit;
		opacity: 1;
		a{
			height: 1.12rem;
			line-height: 1.12rem;
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
.header_hyaline{
	.header_box{
		background: transparent!important;
		border: none!important;
		.header_btn{
			span{
				background: #fff!important;
			}
		}
	}
}
</style>

<style lang="scss">
.h_search_complate{
	span{
		b{
			color: #1bbc9d;
		}
	}
}
</style>
