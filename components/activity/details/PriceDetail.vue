<template>
	<div class="priceDetail">
		<div class="cont">
			<div class="back"><i class="iconfont" @click="back">&#xe606;</i></div>
			<div class="head">
				<h3>Price details</h3>
			</div>
			<div class="details">
				<p class="childDiscount" v-if="picInfo.childDiscount">Children's price is   {{picInfo.symbol}}  {{returnFloat(picInfo.childDiscount)}} {{picInfo.currency}}  less than adults' price.</p>


				<table class="price_list">
					<tr>
						<th>No. of people</th>
						<th>Total cost</th>
						<th>Price per person</th>
					</tr>
					<tr :key="index" v-for="(item,index) in picInfo.details">
						<td>
							<span v-if="item.capacity==1">1 person</span>
							<span v-else>{{item.capacity}} people</span>
						</td>
						<td>
							<span>{{picInfo.symbol}} {{returnFloat(item.price)}} {{picInfo.currency}}</span>
						</td>
						<td>
							<div v-show="item.capacity">
								<span>{{picInfo.symbol}} {{returnFloat(item.price/item.capacity)}} {{picInfo.currency}}</span>
							</div>
						</td>
					</tr>
				</table>



				<!-- <el-table :data="sixArr" stripe style="width: 100%">
					<el-table-column prop="capacity" label="No. of people"  align="center" width="90">
						<template slot-scope="scope">
							<span v-if="scope.row.capacity==1">1 person</span>
							<span v-else>{{scope.row.capacity}} people</span>
						</template>
					</el-table-column>
					<el-table-column prop="price" label="Total cost" align="center">
						<template slot-scope="scope">
							<span>{{picInfo.symbol}} {{returnFloat(scope.row.price)}} {{picInfo.currency}}</span>
						</template>
					</el-table-column>
					<el-table-column prop="childenTotal" label="Price per person"  align="center">
						<template slot-scope="scope">
							<div v-show="scope.row.capacity">
								<span>{{picInfo.symbol}} {{returnFloat(scope.row.price/scope.row.capacity)}} {{picInfo.currency}}</span>
							</div>
						</template>
					</el-table-column>
				</el-table> -->

			</div>
		</div>
	</div>
</template>

<script>
	import { getPriceMark} from "~/assets/js/utils";

	export default {
		props: [
			'picInfo'
		],
		name: "priceDetail",
		data() {

			
			return {
				sixArr:[],
			}

		},
		components: {

		},
		methods: {
			getPriceMark:getPriceMark,
			back() {
				this.$emit('call-back-detail', false);
			},
			cutXiaoNum(num, len) {
				var numStr = num.toString();
				if(len == null || len == undefined) {
					len = numStr.length;
				}
				var index = numStr.indexOf(".");
				if(index == -1) {
					index = numStr.length;
					numStr += ".0000000000000";
				} else {
					numStr += "0000000000000";
				}
				var newNum = numStr.substring(0, index + len + 1);
				return newNum;
			},
			round(val) {
				if(typeof val === "number" && val % 1 === 0) {
					return val;
				} else if(val.toString().split(".")[1].length <= 1) {
					return val;
				} else {
					return(parseFloat(this.cutXiaoNum(val, 1)) + 0.1).toFixed(1);
				}
			},
			returnFloat(value) {
				value*=1;
				if(value) {
					var numberArr = (''+value).split('.');
					if(numberArr.length>1 && numberArr[1].length>2){
						return (value+0.005).toFixed(2);
					}
					return value.toFixed(2);
				}else{
					return 0;
				}
			},
			// tableData(details) {
			// 	//没有数据返回出去，以免报错
			// 	if(!details){
			// 		return;
			// 	}
			// 	//console.log(details);
			// 	var newObj = function(obj) {
			// 		var o = {};
			// 		for(var key in obj) {
			// 			o[key] = obj[key];
			// 		}
			// 		return o;
			// 	}

			// 	let newArr = [],
			// 		tableD = [];

			// 	if(details.length==1){
			// 		for(let i=0;i<details[0].capacity;i++){
			// 			var s=newObj(details[0]);
			// 			newArr.push(s)
			// 		}
					
			// 	}else{
			// 		for(let i = 0; i < details[details.length-1].capacity; i++) {
			// 			let thisD = details[i];
			// 			newArr.push(thisD);
			// 			if(i + 1 > details.length - 1) break;

			// 			var thisC = thisD.capacity;
			// 			var nextC = details[i + 1].capacity;
			// 			var forLen = nextC - thisC - 1;
			// 			for(let j = 0; j < forLen; j++) {
			// 				var midArr = newObj(details[i+1]);
			// 				//console.log(midArr)
			// 				newArr.push(midArr);
			// 			}
			// 			//console.log(newArr)
			// 		}
			// 	}
					
			// 	for(var k = 0; k < newArr.length; k++) {
			// 		newArr[k].capacity = k + newArr[0].capacity;

			// 	}
				
			// 	return newArr;
			// }
		},
		mounted: function() {
			let that=this
			
			that.$nextTick(function(){
				console.log(that.picInfo.details)
				
			})
//			console.log(that.tableData(that.picInfo.details))
			
		},
	}
</script>
<style lang="scss">
	.el-table__row .cell {
		text-align: center;
		line-height: 0.56rem!important;
		word-wrap:break-word!important;
		
		span {
			font-size: 0.26rem;
			color: #353a3f;
			
		}
	}
	.el-table__header .cell{
		
	}
	.el-table th{
		word-wrap:break-word!important;
	}
	.el-table thead tr th{
		word-wrap:break-word!important;
		
	}
	.el-table th>.cell {
		
		font-size: 0.26rem;
		font-weight: bold;
		color: #353a3f;
		
		padding: 0;
		
	}
	.el-table {
		margin-top: 0.2rem;
	}
	
	.el-table--group::after,
	.el-table--border::after,
	.el-table::before {
		height: 0;
	}
	
	.el-table--striped .el-table__body tr.el-table__row--striped td {
		background: rgba(27, 188, 157, 0.06)!important;
	}
	
	.el-table th,
	 .el-table td {
	 	padding:0.146666rem 0;
	 }
	
	.el-table tr:hover {
		background: #fff;
	}
	
	.el-table--enable-row-hover .el-table__body tr:hover>td {
		background: #fff;
	}
	
	.el-table th.is-leaf,
	.el-table td {
		border: 0;
	}
</style>
<style lang="scss" scoped>
	.price_list{
		margin-top: 0.2rem;
		width: 100%;
		tr{
			&:nth-child(2n+3){
				background: rgba(27, 188, 157, .06) !important;
			}
		
			th{
				text-align: center;
				
			}
			td{
				text-align: center;
				font-size: 0.24rem;
				line-height: 0.56rem;
				padding: 0.1rem 0;
				
			}
		}
		
	}
	.priceDetail{
		position: fixed;
		left: 0;
		top: 0;
		width: 100%;
		min-height: 100%;
		z-index: 99999999;
		background: #fff;
		.cont{
			position: absolute;
			left: 0;
			top: 0;
			height: 100%;
			width:100%;
			overflow: scroll;
			padding:0 0.4rem 0.533333rem;
			
			.back{
				padding: 0.34rem 0 0.4rem;
			}
			.head{
				h3{
					font-size:0.6rem;
					font-weight: bold;
				}
			}
		}
		.details{
			
			p{
				font-size: 0.32rem;
				margin-top: 0.2rem;
			}
		}
	}
</style>