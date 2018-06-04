
///*********** Facebook登录组件 *********** */

/*

//faceBook登录,调用方法
new FBLogin({
	//登录回调方法
	loginCallBack:function(){
		window.location.href="/user/myBookings?menu=0&flag=1";
	}
});

*/


var FBLogin = (function(){

	//默认参数
	var defaultOpt = {
		loginCallBack: null
	};

	function FBLogin(options){
		//合并自定义参数
		for(var key in options){
			defaultOpt[key] = options[key];
		}
		this.options = defaultOpt || {};
		this.loadJs = false;
		this.init();
	}
	//facebook登录相关***********
	var _proto = FBLogin.prototype;

	_proto.init = function(){
		//调用登录
		this.facebookLogin();
	};

	_proto.ChangeCallback = function(response) {
		if(response.status === 'connected') {

		} else if(response.status === 'not_authorized') { //未经授权
			FB.logout(function(response) {})
		} else {
			//console.log('不是登陆到Facebook;不知道是否授权');
		}
	};

	_proto.fbAsyncInit = function() {
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
		that.loadJs=true;
		
	}
	
	_proto.loadScript = function(url) {
		
		var that=this
		var script = document.createElement('script');
		var head = document.getElementsByTagName('head')[0];
		var loaded;
		script.src = url;
		
		script.onload = script.onreadystatechange = function(){
				if(!loaded && (!script.readyState || /loaded|complete/.test(script.readyState))){
						script.onload = script.onreadystatechange = null;
						loaded = true;
						

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


						if(that.loadJs==true){
							FB.login(function(response) {
								/*console.log("login"+response)*/
								if(response.authResponse) {
									that.checkLoginState()
								}
							});
						}
				}
		}
		
		head.appendChild(script);
	}

	_proto.facebookLogin = function(){
		let that = this
		that.loadScript("//connect.facebook.net/en_US/sdk.js")
	}

	_proto.logIn = function(){
		let that=this
		FB.login(function(response) {
			/*console.log("login"+response)*/
			if(response.authResponse) {
				that.checkLoginState()
			}
		});
	}
	
	_proto.checkLoginState = function() {
		let that = this
		FB.getLoginStatus(function(response) {
			that.statusChangeCallback(response);
			//location.reload()
		})
	}

	_proto.statusChangeCallback = function(response) {
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
	}

	_proto.getToken = function(Istrue) {
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
				
				//登录回调
			if(typeof $this.options.loginCallBack == 'function'){
				$this.options.loginCallBack();
			}else{
				window.location.href="/user/myBookings?menu=0&flag=1"
			}

				

			}, function(response) {})
		}
	}


	

	return FBLogin;

})();

export default FBLogin;