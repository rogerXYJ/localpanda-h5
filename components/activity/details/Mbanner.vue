<template>
	<div id="banner">
		<!--<div class="back"><i class="iconfont" @click="back">&#xe615;</i></div>-->
		<div class="swiper-container" id="swiper_bannerbox">
			<div class="swiper-wrapper">
				<div class="swiper-slide" :key="index" v-for="(slide, index) in bannerPhotos">
					<img v-lazy="slide.url" lazy="error"  />
				</div>
			</div>
			<div class="swiper-pagination" id="swiper_banner_pagination"></div>
		</div>
		
	</div>
</template>
<script>

import vue from 'vue'

// if (process.browser){
//   	const VueAwesomeSwiper = require('vue-awesome-swiper/dist/ssr')
// 	vue.use(VueAwesomeSwiper)
//   	require('swiper/dist/css/swiper.css')
  	
// }
export default {
  props: ["bannerPhotos", "destination"],
  name: "banner",
  data() {
    return {};
  },
  components: {},
  methods: {
    	back(){
    		history.back()
    	}
  },
  mounted: function() {
    
    
    

  }
};
</script>
<style lang="scss">
.swiper-container{
	.swiper-pagination{
		.swiper-pagination-bullet{
			background-color: rgb(53, 58, 63);
			opacity: 0.5;
		}
		.swiper-pagination-bullet-active{
			opacity: 1;
			background-color: #fff;
		}
	}
}
</style>

<style lang="scss" scoped>
#banner {
  position: relative;
  .back{
  	position: absolute;
  	top: 0.426666rem;
  	left: 0.586666rem;
  	z-index: 11111111;
  	i{
  		color: #fff;
  	}
  }
  img {
    width: 100%;
  }
  img[lazy=loading]{
    width: 1px;
	}
	img[lazy=error]{
    height: 0;
  }

	
	
  
}



</style>