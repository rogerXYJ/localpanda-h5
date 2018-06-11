<template>
	<div class="M-filter">
		
		<div class="cont">
			<div class="head">
				<i class="iconfont" @click.stop="close">&#xe629;</i>
				<div class="title">Filter</div>
				<div class="clear" @click.stop="clear" v-if="checkedCategory.length>0||checkedDurations.length>0||checkedTourtype.length>0">Clear</div>
			</div>
			<div class="filter-detail">
				<div class="fliterList">
					<div class="title">CATEGORIES</div>
					<div class="detail">
						<checkbox-group v-model="checkedCategory">
							<div class="checkboxlist" v-for="(item,key,index) in category">
								<checkbox :label="key" :key="key">{{key}} ({{item}})</checkbox>
							</div>
						</checkbox-group>
					</div>
				</div>
				<div class="fliterList">
					
					<div class="title">DURATION</div>
					<div class="detail">
						<checkbox-group v-model="checkedDurations">
							<div class="checkboxlist" v-for="(i,key,index) in durations">
								<checkbox v-if="key==0" :label="key" :key="key">Half Day ({{i}})</checkbox>
								<checkbox v-if="key==1" :label="key" :key="key">{{key}} Day ({{i}})</checkbox>
								<checkbox v-if="key>1" :label="key" :key="key">{{key}} Days ({{i}})</checkbox>
							</div>
						</checkbox-group>
					</div>
				</div>
				<div class="fliterList" >
					<div class="title">THEMES</div>
					<div class="detail">
						<checkbox-group v-model="checkedTourtype">
							<div class="checkboxlist" v-for="(i,key,index) in tourtype">
								<checkbox :label="key" :key="key">{{key}} ({{i}})</checkbox>
							</div>
						</checkbox-group>
					</div>
				</div>
				
				
			</div>
		</div>
		<div class="subimtBtn">
			<button @click.stop="submitFilter">See experiences</button>
		</div>
	</div>
</template>

<script>
	import {checkboxGroup,checkbox} from "~/plugins/panda/checkbox/"
	//import { checklist } from 'vux'
	export default {
		props: [
		"category", 
		"durations",
		"tourtype",
		"sort",
		"loc",
		"checkedCategory",
		"checkedDurations",
		"checkedTourtype"
		],
		name: "M-filter",
		data() {
			return {
				isshowcategory: false,
				//category: ["zhangsna", "lisi"],
				commonList:["shanghai","beijing"],
				isshowdurations: false,
				//durations: ['1', '0'],
				checklist001:[],
				labelPosition:'',
				isshowtourtype: false,
				//tourtype: ['end', 'ending', 'ending', 'ending', 'ending', 'ending', 'ending'],
				
				records: '',
			}
		},
		 components: {
			checkboxGroup,
			checkbox
		    //checklist
		 },
		methods: {
			change(){
				console.log(this.checkedCategory)
			},
			clear() {
				location.href="/activity/list/"+this.loc
			},
			close() {
				this.$emit("callBack", false)
			},
			submitFilter() {
				for(let i = 0; i < this.checkedTourtype.length; i++) {
					this.checkedTourtype[i] = this.checkedTourtype[i].replace(/&/g, "And")
				}
				let opctions =this.delNull({
					category: this.checkedCategory,
					durations: this.checkedDurations,
					tourtype: this.checkedTourtype,
				})
				opctions=JSON.stringify(opctions)
				this.sort=JSON.stringify(this.sort)
				console.log(this.sort)
				console.log(/SCORE|DEFAULT/.test(this.sort))
				location.href = "/activity/list/" + this.loc + "?options=" + opctions  + (/SCORE|DEFAULT/.test(this.sort)?"":"&sort=" + this.sort);

			},
			delNull(obj){
				var newOpctions = {};
				for(var key in obj){
					if(obj[key].length){
						newOpctions[key] = obj[key];
					}
				}
				return newOpctions;
			}
		},
		mounted:function(){
			console.log(this.category)
		}
	

	}
</script>
<style lang="scss">
	.checkbox__inner {
		width: 0.32rem;
		height: 0.32rem;
		border-radius: 0.04rem;
		&:after {
			left: 0.133333rem;
			top: 0.066666rem;
		}
	}
	.checkbox{
		width:100%;
	}
	
</style>
<style lang="scss" scoped>
	
	.M-filter {
		position: fixed;
		top: 0;
		left: 0;
		z-index: 9999;
		background: #fff;
		height: 100%;

		.checkbox_label {
			font-size: 0.34rem;
			line-height: 1rem;
			color: #353a3f;
			display: block;
		}
		.cont {
			position: absolute;
			background: #fff;
			width: 100%;
			height: 100%;
			overflow-y: auto;
			padding-bottom: 1.946666rem;
			-webkit-overflow-scrolling: touch;
			max-height: 100%;
			.head {
				border-bottom: 1px solid #dde0e0;
				height: 1.1rem;
				line-height: 1.1rem;
				text-align: center;
				position: relative;
				font-size: 0.32rem;
				font-weight: bold;
				position: fixed;
				width: 100%;
				z-index: 888;
				background: #fff;
				i {
					position: absolute;
					left: 0.4rem;
					font-size: 0.32rem;
				}
				.clear {
					position: absolute;
					right: 0.586666rem;
					top: 0;
					color: #1bbc9d;
				}
			}
			.filter-detail {
				padding-top: 1.1rem;
				
				.title{
					padding-left: 0.4rem;
					font-size: 0.24rem;
					line-height: 0.8rem;
					height: 0.8rem;
					background: #faf9f8;
					
					
				}
				.detail{
					border-top: 1px solid #dde0e0;
					border-bottom:1px solid #dde0e0;
					.checkboxlist{
						margin:0 0.4rem;
						line-height: 1rem;
						height: 1rem;
						border-bottom:1px solid #dde0e0;
						&:last-child{
							border: 0;
						}
					}
				}
				
			}
		}
		.subimtBtn {
			position: fixed;
			bottom: 0;
			left: 0;
			width: 100%;
			padding: 0.32rem 0.4rem;
			z-index: 10;
			background: #fff;
			button {
				width: 100%;
				height: 1rem;
				line-height: 1rem;
				background-image: linear-gradient(270deg, #009efd 0%, #1bbc9d 100%);
				text-align: center;
				color: #fff;
				border-radius: 0.5rem;
				font-size: 0.28rem;
				font-weight: bold;
			}
		}
	}
</style>