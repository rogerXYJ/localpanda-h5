<template>
	<div class="bookings">
		<div class="bookingbox">
			<div class="iconfont back" @touchend="back">&#xe606;</div>
			<div class="title">Select country code</div>
			<div class="select">
				<input v-model="selectCode" />
			</div>
			<ul v-if="countryCode.length>0">
				<li v-for="(item,index) in codeList" @touchend="selectCodeFn(item.country_name,item.prefix)">{{item.country_name}} (+{{item.prefix}})</li>
			</ul>
			<div class="empty">There are no results that match your search.</div>
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
			}
			
		},
		components: {
        	
    	},
    	methods: {
    		back(){
    			this.$emit('back',false)
    		},
    		selectCodeFn(country,code) {
    			
    			let codeDetails={
					mobileCode:country + "(+" + code + ")",
					code:"(+" + code + ")",
					status:false,
					
				}
    			this.$emit('getCode',codeDetails)
			},
    	},
    	mounted: function() {
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