<template>
	

	<div class="service_info">
		<p v-if="showTip && showTip!='false'">If you still do not receive a response, please check your junk mail folder. Additionally, you can contact us in the following ways:</p>
		<div class="service_content">
			<dl>
				<dt>Call</dt>
				<dd>+1 (888) 930 8849 (Toll Free)<br>+86 166 0218 3842<br>+61 488 849 818<br>+86 (21) 8018-2090 <div>
					* Please be aware that we may call you from above numbers</div></dd>
			</dl>
			<dl>
				<dt>Email</dt>
				<dd>service@localpanda.com</dd>
			</dl>
			<dl>
				<dt>Whatsapp</dt>
				<dd>+86 158 1057 5179</dd>
			</dl>
			<dl>
				<dt>Text or leave a voice message </dt>
				<dd>+1 (888) 931 2853<br>+44 7479 270518<br>+61 488 849 818</dd>
			</dl>
			<dl>
				<dt>WeChat QR code</dt>
				<dd><img src="https://cloud.localpanda.com/static/icon/LPwechat.jpg" width="120" alt=""></dd>
			</dl>
			
		</div>
	</div>
</template>
<script>
	export default {
		name: "service",
		props:['status'],
		data() {
			return {
				showTip: this.status!=undefined?this.status:true
			}
		},
		methods: {
			
		},
		watch: {
			
		}
	}
</script>

<style lang="scss" scoped>

.service_info{
	margin-top: 40px;
	p{
		font-size: 14px;
	}
	.service_content{
		overflow: hidden;
		// .service_left{
		// 	float: left;
		// 	width: 50%;
		// }
		// .service_right{
		// 	float: left;
		// 	width: 50%;
		// }
		dl{
			margin-top: 20px;
			dt{
				font-size: 16px;
				font-weight: bold;
			}
			dd{
				margin-top: 5px;
				line-height: 22px;
				font-size: 13px;
				img{
					margin-top: 6px;
				}
			}
		}
	}
}
	
</style>