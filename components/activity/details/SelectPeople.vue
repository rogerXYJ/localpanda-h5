<template>
	<div id="selectPeople" class="selectPeople">
		<div class="selectCont">
			<!-- <div class="back" @click="cancle()"><i class="iconfont">&#xe615;</i></div>
			<div class="head">
				<h3>How many guests</h3>
				<p>Final headcount does not include babies.</p>
			</div> -->
			<div class="choose">
				<ul>
					<li class="clearfix">
						<b>Adults</b>
						<div class="select">
							<em class="iconfont defult" v-if="adults<=1 || (children+adults)<=picInfo.minParticipants">&#xe64d;</em>
							<em class="iconfont" @click="del(0)" v-else>&#xe64d;</em>
							<div>{{adults}}</div>
							<em class="iconfont defult"  v-if="(children+adults)>=picInfo.maxParticipants">&#xe64b;</em>
							<em class="iconfont" v-else  @click="add(0)">&#xe64b;</em>
						</div>
					</li>
					<li class="clearfix">
						<b>Children <span>(≤ {{picInfo.childStandard}} years old)</span></b>
						<div class="select">
								<em class="iconfont" v-if="children>0 && (children+adults)>picInfo.minParticipants" @click="del(1)">&#xe64d;</em>
								<em class="iconfont defult" v-else>&#xe64d;</em>
							<div>{{children}}</div>
							<em class="iconfont defult" v-if="(children+adults)>=picInfo.maxParticipants || adults==0">&#xe64b;</em>
							<em class="iconfont" @click="add(1)" v-else>&#xe64b;</em>
							
						</div>
					</li>
					<!-- <li class="clearfix">
						<b>Babies</b>
						<div class="select">
							<em class="iconfont" v-if="infant>0" @click="del(2)">&#xe64d;</em>
							<em class="iconfont defult" v-else>&#xe64d;</em>
							<div>{{infant}}</div>
							<em class="iconfont" v-if="infant<picInfo.maxParticipants-1" @click="add(2)">&#xe64b;</em>
							<em class="iconfont defult" v-else>&#xe64b;</em>
						</div>
					</li> -->
				</ul>
			</div>
			<!-- <div class="save">
				<button @click="save">Save</button>
			</div> -->
		</div>
	</div>
</template>

<script>
	export default {
		props:["picInfo","people"],
		name: "selectPeople",
		data(){
			return {
				adults:0,
				children:0,
				infant:0	
			}
		},
		
		components: {
		},
		methods: {
			cancle() {
				this.$emit('call-back', false);
			},
			add(id) {
				if(id == 0) {
					this.adults++;
					
				} else if(id == 1 && this.adults>0) {
					this.children++;
				} else {
					this.infant++;
				}
				this.save();
			},
			del(id) {
				//console.log(this.picInfo.minParticipants);
				if(id == 0) {
					this.adults--;
				} else if(id == 1) {
					this.children--;
				} else {
					this.infant--;
				}
				this.save();
			},
			save(){
				let select={
					adults:this.adults,
					children:this.children,
					infant:this.infant
				}
				this.$emit('sureSelect', select);
				this.$emit('call-back', false);
			}

	},
	mounted: function() {
		var self = this;
		setTimeout(function(){
			self.adults = self.people;
		},10);
	},
	watch: {

	}
};</script>
<style lang="scss" scoped>
	.selectPeople{
		
		.selectCont{
			.back{
				padding: 0.34rem 0 0.4rem;
			}
			.head{
				h3{
					font-size:0.6rem;
					font-weight: bold;
				}
				p{
					font-size:0.28rem;
				}
			}
			.choose{
				ul{
					li{
						margin-bottom: 0.4rem;
						line-height: 0.6rem;
						&:first-child{
							margin-top: 0.4rem;
						}
						b{
							float: left;
							line-height: 0.6rem;
							font-size: 0.36rem;
							font-weight: 400;
							 span {
									font-weight: normal;
									color: #878e95;
									font-size: 0.26rem
									
								}
						}
						.select{
							float: right;
							
							em{
								font-weight: bold;
								display: inline-block;
								width: 0.6rem;
								height: 0.6rem;
								border:1px solid #1bbc9d;
								border-radius: 50%;
								font-size: 0.32rem;
								text-align:center;
								line-height:0.6rem;
								font-weight: normal;
								color:#1bbc9d;
								
							}
							div{
								display: inline-block;
								margin:0 0.15rem;
								font-size: 0.42rem;
								vertical-align: middle;
								line-height: 0.6rem;
								min-width: 0.6rem;
								text-align: center;
							}
						}
					}
				}
			}
			.save{
				position: fixed;
				bottom: 0;
				left: 0;
				width: 100%;
				padding: 0.373333rem 0.586666rem;
				button{
					width: 100%;
					height:0.9rem;
					line-height:0.9rem;
					background-image: linear-gradient(270deg,#009efd 0%,#1bbc9d 100%);
					text-align: center;
					color: #fff;
					border-radius: 0.45rem;
					font-size: 0.3rem;
					font-weight: bold;
				}
			}
		}
		.defult{
			opacity: .5;
		}
	}
</style>