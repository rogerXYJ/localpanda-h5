<template>
	<div id="dialog" class="alertTitle" v-if="isShowAlert">
		<div class="fixed"></div>
		<div v-bind:class="{'box animated zoomIn' : isShowAlert , 'box animated zoomOut' : !isShowAlert}">
			<div class="con">
				<span :class="{magin:isShowAlert}">{{alertTitle}}</span>
				<p>{{alertMessage}}</p>
			</div>
			<div class="btn" v-on:click="conmmitFn">Confirm</div>
		</div>
	</div>
</template>
<script>
	export default {
		name: "alertTitle",
		props: ['isShowAlert','alertTitle','alertMessage'],
		data() {
			return {
				isShowTitle:true,  //是否有标题

			}
		},
		methods: {
			conmmitFn() {
				// this.isShowAlertTitle = !this.isShowAlertTitle;
			
				this.$emit("setIsShowAlert",!this.isShowAlert)
				history.back();
			},
			
		},
		watch: {
			alertTitle: function(val,oldVal){ //监听是否有标题
				if(val == ""){ 
					this.isShowTitle = false
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.alertTitle {
		.fixed{
			width: 100%;
			height: 100%;
			position: fixed;
			top:0;
			left:0;
			background: #000;
			opacity: 0.7;
			z-index: 1000;
		}
		.box{
			width:96%;
			height:4.986666rem;
			background: #fff;
			box-shadow: 0px 0px 1px #ccc;
			position: fixed;
			margin: auto;
			left: 2%;
			right: 0;
			top: 0;
			bottom: 0;
			z-index: 1100;
			border-radius: 0.4rem;
			overflow: hidden;
			margin-left: 0!important;
			.con{
				width:6.16rem;
				margin: 0 auto;
				
				span{
			
					font-size:0.4rem; 
					font-weight: bold;
					display: block;
					text-align: center;
					margin: 0.6rem 0 0.38rem;
				}
				p{
					font-size: 0.3rem;
					vertical-align:middle;
					text-align:center;
					word-wrap:break-word;

				}
			}
			.btn{
				width: 70%;
				height: 1rem;
				border-radius: 0.586666rem;
				background-image: linear-gradient(45deg,#1bbc9d 0%,#009efd 100%);
				margin: 0.48rem auto 0;
				text-align: center;
				color: #fff;
				line-height: 1rem;
				font-size:0.4rem; 
				display: block;
			}
		}
		.c{}
	}
	
</style>