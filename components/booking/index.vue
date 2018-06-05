<template>
	<div class="bookings">
		<div class="bookingbox">
			<div class="head">
				<div class="iconfont back" @touchend="back">&#xe606;</div>
				<div class="title">Select country code</div>
				<div class="select">
					<input v-model="selectCode" />
				</div>
			</div>
			<ul v-if="codeList.length>0">
				<li v-for="(item,index) in codeList" @click="selectCodeFn(item.country_name,item.prefix)">{{item.country_name}} (+{{item.prefix}})</li>
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
    		},
    		selectCodeFn(country,code) {
    			ga('gtag_UA_107010673_2.send', {
						hitType: 'event',
						eventCategory: 'activity_booking',
						eventAction: 'input',
						eventLabel: 'country_code'
	
					});
    			let codeDetails={
					mobileCode:country + "(+" + code + ")",
					code:"(+" + code + ")",
					status:false,
					
				}
    			this.$emit('getCode',codeDetails)
			},
			
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
					var other = [];
					var str = val.replace(/\(/, "\\\(").replace(/\)/, "\\\)").replace(/\+/, '\\\+')
					console.log(str)
					for(let i = 0; i < this.countryCode.length; i++) {

						if(new RegExp(("^" + str), "i").test(self.countryCode[i].country_name + "(" + "+" + self.countryCode[i].prefix + ")")) {
							var json = {
								country_name: self.countryCode[i].country_name,
								prefix: self.countryCode[i].prefix
							}
							other.push(json)

						} else {

						}
					}

					self.codeList = other
					//this.countryCode=arr

					//console.log(self.codeList)
				} else {
					self.codeList = self.countryCode

				}
			},
    	}
	}
</script>

<style lang="scss" scoped>
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
				padding-top: 1.6rem;
				li{
					margin-top: 0.58rem;
					font-size: 0.36rem;
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