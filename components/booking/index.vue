<template>
	<div class="bookings">
		<div class="bookingbox">
			<div class="head">
			<!--	<div class="iconfont back" @touchend="back">&#xe606;</div>-->
				<div style="margin-top: 0.3rem;" class="title">Select country code <i class="iconfont" style="float: right;" @touchend="back">&#xe606;</i></div>
				<div class="select">
					<input v-model="selectCode" @blur="Ga"/>
				</div>
			</div>
			<ul v-if="codeList.length>0">
				<li :key="index" v-for="(item,index) in codeList" @click="selectCodeFn(item.country_name,item.prefix)">{{item.country_name}} (+{{item.prefix}})</li>
			</ul>
			<div class="empty" v-else>There are no results that match your search.</div>
		</div>
	</div>
</template>

<script>
	export default{
		props:["countryCode"],
		name:"bookings",
		data (){
			return{
				selectCode:"",
				codeList:'',
				scroll:false
			}
			
		},
		components: {
        	
    	},
    	methods: {
    		back(){
    			this.$emit('back',false)
    			ga('gtag_UA_107010673_2.send', {

					hitType: 'event',
					eventCategory: 'activity_booking',
					eventAction: 'input',
					eventLabel: 'country_code_close'

				});
				},
				selectCodeFn(country,code) {
    			ga('gtag_UA_107010673_2.send', {
						hitType: 'event',
						eventCategory: 'activity_booking',
						eventAction: 'select',
						eventLabel: 'country_code_select'
	
					});
    			let codeDetails={
						mobileCode:country + "(+" + code + ")",
						code:"(+" + code + ")",
						status:false,
						country:country
					}
    			this.$emit('getCode',codeDetails)
				},
    	// 	Ga(){

			// 		console.log(222222222);
    	// 		ga('gtag_UA_107010673_2.send', {
			// 			hitType: 'event',
			// 			eventCategory: 'activity_booking',
			// 			eventAction: 'select',
			// 			eventLabel: 'country_code_select'
	
			// 		});
    	// 		let codeDetails={
			// 		mobileCode:country + "(+" + code + ")",
			// 		code:"(+" + code + ")",
			// 		status:false,
			// 		country:country
			// 	}
    	// 		this.$emit('getCode',codeDetails)
			// },
			Ga(){
				ga('gtag_UA_107010673_2.send', {
					hitType: 'event',
					eventCategory: 'activity_booking',
					eventAction: 'inpt',
					eventLabel: 'country_code_input'

				});
			}
    	},
    	mounted: function() {
    		let $this=this
    		this.codeList=this.countryCode
    		
    	},
    	watch:{
    		selectCode: function(val, oldVal) {
				let self = this
				if(val) {
					
					self.codeList = [];
					// var other = [];
					// var other1=[];
					// var str = val.replace(/\(/, "\\\(").replace(/\)/, "\\\)").replace(/\+/, '\\\+').replace(/\-/,'\\\-');
					// for(let i = 0; i < this.countryCode.length; i++) {
					// 	var str1=self.countryCode[i].country_name + "(+" + self.countryCode[i].prefix + ")"
					// 	if(new RegExp(str,"i").test(str1)) {
					// 		if(val[0].toLowerCase()==str1[0].toLowerCase()){
					// 			var json = {
					// 				country_name: self.countryCode[i].country_name,
					// 				prefix: self.countryCode[i].prefix
					// 			}
					// 			other.push(json)
					// 		}else{
					// 			var json={
					// 				country_name: self.countryCode[i].country_name,
					// 				prefix: self.countryCode[i].prefix
					// 			}
					// 			other1.push(json)
					// 		}
					// 	}
					// }
					// self.codeList = other.concat(other1)
					//this.countryCode=arr

					var newVal = val.replace('(','\\(').replace(')','\\)').replace('+','\\+').replace('-','\\-');
					var thisKey = [],
						otherKey = [];
					var countryCode = this.countryCode;
					for(var i=0;i<this.countryCode.length;i++){
						var thisData = this.countryCode[i];
						var regStr = thisData.country_name;
						if(/(^-?[0-9]\d*$)/.test(newVal)){
							regStr = thisData.prefix;
						}
						if((new RegExp(newVal,'i')).test(regStr)){
							thisKey.push(thisData);
						}else{
							otherKey.push(thisData);
						}
					}
					thisKey.sort(function(a,b){
						if(/(^-?[0-9]\d*$)/.test(newVal)){
							return a.prefix.indexOf(newVal)-b.prefix.indexOf(newVal);
						}
						return a.country_name.toLowerCase().indexOf(newVal)-b.country_name.toLowerCase().indexOf(newVal);
					})
					self.codeList = thisKey;

					//console.log(self.codeList)
				} else {
					self.codeList = self.countryCode

				}
			},
    	}
	}
</script>

<style lang="scss" scoped>
.back{
	text-align: right!important;
	height: 0.8rem;
	line-height: 0.8rem;
}
.head{
	position: fixed;
	top: 0;
	background: #fff;
	width: calc(100% - 0.9rem);
	padding-bottom: 0.3rem;
}
	.bookings{
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background: #fff;
		overflow: hidden;
		z-index: 101;
		.bookingbox{
			position: absolute;
			overflow: auto;
			width: 100%;
			top: 0;
			padding:0 0.44rem 0.46rem;
			height:100%;
			
			.title{
				font-size: 0.4rem;
				font-weight: bold;
			}
			.select{
				margin-top: 0.46rem;
				input{
					height: 0.98rem;
					width: 100%;
					border-radius: 0.06rem;
					border: solid 0.02rem #dde0e0;
					font-size: 0.36rem;
				}
			}
			ul{
				padding-top: 2.74rem;
				li{
					margin-top: 0.58rem;
					font-size: 0.36rem;
					&:first-child{
						margin-top: 0;
					}
				}
				
			}
			.empty{
				padding: 0.6rem;
				font-size: 0.36rem;
				text-align: center;
			}
		}
	}
</style>