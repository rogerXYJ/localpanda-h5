<template>
	<div class="M-activityList">
		<Head></Head>
		<div class="filterInfo" :class="{xiding:isscroll}">
			<span class="destination ">
				<i class="iconfont">&#xe610;</i>
				<select v-model="value" @change="locationFn(value)">
					<option :key="index" v-for="(item,index) in options">{{item.label}}</option>
				</select>
			</span>
			<span class="destination" @touchend="showFilter">
				<i class="iconfont">&#xe668;</i>
				Filter
			</span>
			<span class="destination">
				<i class="iconfont">&#xe66b;</i>
				<select  @change="sortFn(selected)" v-model="selected">
					<option :key="index" v-for="(item,index) in select">{{item.selectText}}</option>
				</select>
			</span>
		</div>
		<div class="list-cont" v-if="records>0">
			<ul class="clearfix">
				<li class="activity-item" :key="index" v-for="(item,index) in activityList">

					<a :href="'/activity/details/'+item.activityId">
						<div class="activity">

							<div class="activity-photo" v-lazy:background-image="item.coverPhotoUrl">

							</div>

						</div>
						<div class="activitDe">
							<div class="info">
								<div class="activeType">
									<div class="tourType">{{item.category}} · {{item.duration}} {{item.durationUnit|firstUpperCase}}</div>

								</div>
								<div class="titleText" style="-moz-box-orient: vertical;
							    -webkit-box-orient:vertical;">
									{{item.title}}
								</div>
								
								<div class="totalPic">
									<div class="nowPic">From <b>${{returnFloat(item.bottomPrice)}}</b><span>  pp</span></div>
								</div>
							</div>

						</div>
					</a>

				</li>
			</ul>
		</div>
		<div class="empty" v-else>
			<p>No activities or tours that match your interests are found.</p>
			<p>You can try to modify your screening conditions.</p>
		</div>
		
		<transition name="slideleft">
			<Mfilter 
				v-show="isshow" 
				@callBack="setCallBack" 
				:sort="sort" 
				:category="category" 
				:durations="durations" 
				:tourtype="tourtype" 
				:loc="loc"
				:checkedCategory="checkedCategory"
				:checkedDurations="checkedDurations"
				:checkedTourtype="checkedTourtype"
				
				class="view" 
				></Mfilter>
		</transition>
		<infinite-loading  @infinite="infiniteHandler" spinner="bubbles"  ref="infiniteLoading">
			<span slot="no-more">You've reached the bottom of the page.</span>
			<span slot="no-results" class="no-results"></span>
		</infinite-loading>
		<div class="inquireBtn"><a href="/info/feedback">Inquire</a></div>
		<footMobile></footMobile>
	</div>
</template>
<script>

	import Head from '~/components/header/index'
	import { getUrlParams } from '~/assets/js/utils';
	import InfiniteLoading from 'vue-infinite-loading/src/components/Infiniteloading.vue'
	import Mfilter from '~/components/activity/list/M-filter'
	import footMobile from "~/components/footer/index"
		//element-ui 组件
	require('~/plugins/element-ui.js');

	import Vue from "vue";
	
	export default {
		name: 'M-activityList',
		async asyncData({
			route,
			store,
			error,
			apiBasePath,
			redirect
		}) {
			let loc=route.params.slug;
			let sort = route.query.sort ? JSON.parse(route.query.sort) :{"type": "SCORE"};
			let opctions = route.query.opctions ? JSON.parse(route.query.opctions) : null
			if(!route.query.opctions){
				opctions = route.query.options ? JSON.parse(route.query.options) : null;
			}
			let data={
				options: [
					{
						value: 'Shanghai',
						label: 'Shanghai',
						url: '/activity/list/Shanghai'
					},
					{
						value: 'Beijing',
						label: 'Beijing',
						url: '/activity/list/Beijing'
					},
					{
						value: 'Chengdu',
						label: 'Chengdu',
						url: '/activity/list/Chengdu'
					},
					{
						value: "Xi'an",
						label: "Xi'an",
						url: '/activity/list/Xian'
					},
					{
						value: "Guilin",
						label: "Guilin",
						url: '/activity/list/Guilin'
					}
				],
				value: loc == "Xian" ? "Xi\'an" : loc,
				loc: loc,
				activityList: '',
				selected: 'Recommended',
				apiBasePath: apiBasePath,
				select: [{
						selectText: "Recommended",
						type: "SCORE",
						isSelect: true
					},
					{
						selectText: "Price :Low to High",
						type: "PRICE",
						isSelect: true
					},
					{
						selectText: "Price :High to Low",
						type: "PRICE",
						isSelect: false
					}

				],
				isshow:false,
				records: '',
				pageNum: 1,
				pageSize: 10,
				sort: sort,
				category:'',
				durations:'',
				tourtype:'',
				checkedCategory: [],
				checkedDurations: [],
				checkedTourtype: [],
				isscroll:false,
			};
			let listdata={}
			let filters=[]
			let obj={}
			if(sort) {
				if(sort.type == "PRICE" && sort.reverse == true) {
					data.selected = "Price :High to Low"
				} 
				if(sort.type == "PRICE" && sort.reverse == false) {
					data.selected = "Price :Low to High"
				}
			}else{
				data.selected = "Recommended"
			}
			if(opctions) {
				if(opctions.category&&opctions.category.length > 0) {
					data.checkedCategory = data.checkedCategory.concat(opctions.category)
					let jsonCategory = {
						type: 'CATEGORY',
						filterValues: data.checkedCategory
					}
					filters.push(jsonCategory)
				}
				if(opctions.durations&&opctions.durations.length > 0) {
					data.checkedDurations = data.checkedDurations.concat(opctions.durations)
					let jsonDurations = {
						type: 'DURATION',
						filterValues: data.checkedDurations
					}
					filters.push(jsonDurations)
				}
				if(opctions.tourtype&&opctions.tourtype.length > 0) {
					for(let i = 0; i < opctions.tourtype.length; i++) {
						opctions.tourtype[i] = opctions.tourtype[i].replace(/And/g, '&')
					}
					data.checkedTourtype = data.checkedTourtype.concat(opctions.tourtype)
					let jsonTourtype = {
						type: 'TOUR_TYPE',
						filterValues: data.checkedTourtype
					}
					filters.push(jsonTourtype)

				}
				obj = {
					location: data.loc == "Xian" ? "Xi\'an" : data.loc,
					pageNum: data.pageNum,
					pageSize: data.pageSize,
					filters: filters,
					sort: sort
				}
			} else {
				obj = {
					location: data.loc == "Xian" ? "Xi\'an" : data.loc,
					pageNum: data.pageNum,
					pageSize: data.pageSize,
					sort: sort
				}
			}
			
			
			
			try{
				listdata = await Vue.axios.post(apiBasePath + "search/activity", JSON.stringify(obj), {
					headers: {
						'Content-Type': 'application/json; charset=UTF-8'
					}
				})
				data.records = listdata.data.records
				data.activityList = listdata.data.entities
				for(let i = 0; i < listdata.data.aggregations.length; i++) {
					/*if(listdata.data.aggregations[i].type=="CITY"){
						data.cities=listdata.data.aggregations[i].items
					}else*/
					if(listdata.data.aggregations[i].type == "CATEGORY") {
						data.category = listdata.data.aggregations[i].items
					} else if(listdata.data.aggregations[i].type == "DURATION") {
						data.durations = listdata.data.aggregations[i].items
					} else if(listdata.data.aggregations[i].type == "TOUR_TYPE") {
						data.tourtype = listdata.data.aggregations[i].items
					}

				}
			}catch(err) {
				//return error(JSON.stringify(err));
			}
			return data
		},
		head() {
			let location = this.value;
			let title = "The Top " + location + " Tours | " + location + " Local Activities and Experiences";
			let keywords = "Best Things to do in " + location + ", " + location + " tours, " + location + " trip, " + location + " travel, " + location + " tour packages, " + location + " guide, china tours"
			if(location == "Beijing") {
				var description = "See top things to do in Beijing, including Beijing city tours, Beijing walking tours, Beijing history & culture tours, and Beijing food tours. Visit the Forbidden City, Temple of Heaven, Great Wall, Tiananmen Square, and Beijing Summer Palace with our local China tour guides."
			} else if(location == "Shanghai") {
				var description = "See top things to do in Shanghai, including Shanghai city tours, Shanghai walking tours, Shanghai history & culture tours, and Shanghai food tours. Visit the bund shanghai, the Shanghai Tower, the French concession, yu garden, zhujiajiao and Suzhou with our local China tour guides."
			} else if(location == "Guilin") {
				var description = "See top things to do in Guilin, including Guilin scenic tours, Guilin walking tours, Guilin history & culture tours, Guilin food tours, and Guilin Biking tours. See the best scenery in Guilin including Elephant Trunk Hill, Guilin Forest, Li River, Sun & Moon Pagodas, and Yaoshan Mountain."
			} else if(location == "Chengdu") {
				var description = "See top things to do in Chengdu, including Chengdu city tours, Chengdu walking tours, Chengdu history & culture tours, and Chengdu food tours. Visit the Giant Panda Breeding Research Base, Mount Qingcheng, Wenshu Yuan Monestary, Jinli Street, and Dujiangyan with our local China tour guides."
			} else {
				var description = "See top things to do in Xi'an, including Xi'an city tours, Xi'an walking tours, Xi'an history & culture tours, and Xi'an food tours. Visit the Terra-cotta Warriors, Xi'an City Wall, Muslim Quarter, Shaanxi History Museum, and Xi'an markets with our local China tour guides."
			}
			return {
				title: title,
				meta: [{
						hid: "keywords",
						name: "keywords",
						content: keywords
					},
					{
						hid: "description",
						name: "description",
						content: description
					}
				]
			};
		},
		components: {
			Mfilter,
			Head,
			InfiniteLoading,
			footMobile
		},
		methods: {
			locationFn(loc){
				location.href="/activity/list/"+loc
			},
			setCallBack(val){
				this.isshow=val
				//页面滚动
				document.body.style.overflowY = 'auto';
			},
			showFilter(){
				this.isshow=true;
				//阻止页面滚动
				document.body.style.overflowY = 'hidden';
			},
		
			sortFn(val){
				let opctions=this.getUrlParam("opctions")?JSON.parse(this.getUrlParam("opctions")):JSON.parse(this.getUrlParam("options"))
				if(opctions==null){
					opctions={}
				}
				if(val == "Recommended") {
					this.sort = {
						type: "SCORE"
					}
				} 
				if(val == "Price :Low to High") {
					this.sort = {
						type: "PRICE",
						reverse: false
					}
				}
				if(val == "Price :High to Low") {
					this.sort = {
						type: "PRICE",
						reverse: true
					}
				}
					this.sort=JSON.stringify(this.sort)
					
					location.href = "/activity/list/" + this.loc + "?options=" + JSON.stringify(opctions)  + (/SCORE/.test(this.sort)?"":"&sort=" + this.sort);
				
				
				
			},
			returnFloat(value) {
				var value = Math.round(parseFloat(value) * 100) / 100;
				var xsd = value.toString().split(".");
				if(xsd.length == 1) {
					value = value.toString() + ".00";
					return value;
				}
				if(xsd.length > 1) {
					if(xsd[1].length < 2) {
						value = value.toString() + "0";
					}
					return value;
				}
			},
			getUrlParam(k) {
				var regExp = new RegExp('([?]|&)' + k + '=([^&]*)(&|$)');
				var result = window.location.href.match(regExp);
				if(result) {
					return decodeURIComponent(result[2]);
				} else {
					return null;
				}
			},
			infiniteHandler($state){
				//console.log(1111)
				let that=this
				that.pageNum++
				let filters=[]
				let obj={}
				if(that.checkedCategory&&that.checkedCategory.length > 0) {
					let jsonCategory = {
						type: 'CATEGORY',
						filterValues: that.checkedCategory
					}
					filters.push(jsonCategory)
				}
				if(that.checkedDurations&&that.checkedDurations.length > 0) {
					let jsonDurations = {
						type: 'DURATION',
						filterValues: that.checkedDurations
					}
					filters.push(jsonDurations)
				}
				if(that.checkedTourtype&&that.checkedTourtype.length > 0) {
					let jsonTourtype = {
						type: 'TOUR_TYPE',
						filterValues: that.checkedTourtype
					}
					filters.push(jsonTourtype)
				}
				if(filters.length&&filters.length > 0) {
					obj = {
						location: that.loc == "Xian" ? "Xi\'an" : that.loc,
						pageNum: that.pageNum,
						pageSize: that.pageSize,
						filters: filters,
						sort: that.sort
					}
				} else {
					obj = {
						location: that.loc == "Xian" ? "Xi\'an" : that.loc,
						pageNum: that.pageNum,
						pageSize: that.pageSize,
						sort: that.sort
					}
				}
				Vue.axios.post(that.apiBasePath + "search/activity", JSON.stringify(obj), {
					headers: {
						'Content-Type': 'application/json; charset=UTF-8'
					}
				}).then(function(response) {
					if(response.data.entities&&response.data.entities.length) {
						that.activityList=that.activityList.concat(response.data.entities)
						$state.loaded();
					}else{
						 $state.complete();
					}
				}, function(response) {
					$state.complete();
				})
			}
		},
		filters: {
			firstUpperCase(val) {
				if(val)
					return val.toLowerCase().replace(/( |^)[a-z]/g, (L) => L.toUpperCase());
			}
		},
		watch: {
			pageNum: function(val, oldVal) {
			},
			checkedDurations(val, oldVal) {
			},
			checkedTourtype(val, oldVal) {
				if(val.length > 0) {
					for(let i = 0; i < val.length; i++) {
						val[i] = val[i].replace(/And/g, "&")
					}
				}
			}
		},
		mounted: function() {
			let opctions=JSON.parse(this.getUrlParam("opctions"))?JSON.parse(this.getUrlParam("opctions")):JSON.parse(this.getUrlParam("options"))
			console.log()
			let that=this
			window.addEventListener("scroll", (e)=>{
				if(scrollY>400){
					that.isscroll=true
				}else{
					that.isscroll=false
				}
			});
		}
	}
</script>

<style lang="scss" scoped>

	.M-activityList{
		.filterInfo{
			padding:0 0.4rem 0.36rem;
			border-bottom:1px solid #dde0e0;
			.destination{
				font-size: 0.28rem;
				margin-left: 0.12rem;
				
				border: solid 1px #dde0e0;
				border-radius: 8px;
				display: inline-block;
				padding:0.14rem 0.16rem 0.14rem 0.1rem;
				line-height: 0.4rem;

				&:first-child{
					margin-left: 0;
				}
				&:nth-child(2){
					i{
						margin-right:0;
					}
				}
				i{
					font-size: 0.25rem;
					margin-right: 0.1rem;
					color:#cacccc;
					vertical-align: top;
					line-height: 0.4rem;
				}
				select{
					-webkit-appearance: none;
					-moz-appearance: none;
					appearance: none;
					border: none;
					font-size: 0.28rem;
					background:transparent;
					vertical-align: top;
					display: inline-block;
					height: 0.4rem;
					line-height: 0.4rem;
				}	
			}
			@media only screen and (min-width: 700px){
				.destination{
					padding:0.16rem 0.3rem;
				}
			}
			
		}
		
		
		
		.list-cont{
			padding:0.1rem  0.4rem 0;
			.activity-item {
				&:nth-child(2n+2){
					margin-right: 0;
				}
				float:left;
				width:48%;
				margin-right: 4%;
				margin-top:0.4rem;
				.activity {
					.activity-photo {
						height: 2.2rem;
						background-repeat: no-repeat!important;
						background-size: cover!important;
						position: relative;
					}
					@media only screen and (min-width: 700px){
						.activity-photo{
							height: 3rem;
						}
					}
				}
				.activitDe {
					.activeType {
						line-height: 0.7rem;
						.tourType {
							color: #d87b65;
							font-size:0.24rem;
							
						}
					}
					.titleText {
						width: 100%;
						height:1.2rem;
						line-height:0.4rem;
						text-overflow: ellipsis;
						display: -webkit-box;
						display: -moz-box;
						-moz-box-orient: vertical;
						-webkit-box-orient: vertical;
						-webkit-line-clamp: 3;
						-moz-line-clamp: 3;
						-o-text-overflow: ellipsis;
						word-wrap: break-word;
						font-size: 0.29rem;
						font-weight: bold;
						text-align: left;
						overflow: hidden;
					}
					.duration {
						margin-top: 0.22rem;
						font-size: 0.24rem;
						color: #878e95;
					}
					.totalPic {
						padding-top: 0.15rem;
						.oldpic {
							text-align: right;
							font-size: 14px;
							color: #878e95;
							text-decoration: line-through;
						}
						.nowPic {
							text-align:left;
							font-size: 0.24rem;
							color: #878e95;
							b {
								color: #353a3f;
								font-size: 0.38rem;
							}
							span {
								color: #353a3f;
							}
						}
					}
				}
			}
		}
		.xiding{
			position: fixed;
			top:0;
			left:0;
			right:0;
			background:#fff;
			z-index: 9;
			padding-top:0.36rem;
		}
		.empty{
			padding: 0.533333rem;
			p{
				text-align: center;
				font-size: 0.32rem;
			}
		}
		.view {
			width: 100%;
			transition: all 0.3s cubic-bezier(.55, 0, .1, 1);
		}
		.slideleft-enter-active,
		.slideleft-leave-active {
			opacity: 0;
			-webkit-transform: translate(100%, 0);
			transform: translate(100%, 0);
		}
		.slideleft-enter,
		.slideleft-leave-to {
			opacity: 0;
			-webkit-transform: translate(100%, 0);
			transform: translate(100%, 0);
		}
		.no-results{
			display: inline-block;
			padding: 0 0.586666rem;
			word-wrap:break-word; 
			
		}
		.inquireBtn{
			width: 1.8rem;
			height: 0.84rem;
			background-image: linear-gradient(270deg, 
			#009efd 0%, 
			#1bbc9d 100%),;
			position: fixed;
			bottom: 0.4rem;
			right:0.4rem;
			line-height:0.84rem;
			text-align: center;
			border-radius:0.42rem;
			a{
				display: block;
				font-size: 0.3rem;
				color: #fff;
				font-weight: bold;
				
			}
		}
	}
</style>