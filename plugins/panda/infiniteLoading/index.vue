<style lang="scss">
//样式类型，pc.scss 和 mobile.scss
@import "./mobile.scss";
</style>

<template>
  <div class="infiniteLoading">

    <div  v-bind:class="['loaders loading',loadingStatus ? 'on' : 'off']">
      <div class="spinner">
          <div class="spinner-container container1">
            <div class="circle1"></div>
            <div class="circle2"></div>
            <div class="circle3"></div>
            <div class="circle4"></div>
          </div>
          <div class="spinner-container container2">
            <div class="circle1"></div>
            <div class="circle2"></div>
            <div class="circle3"></div>
            <div class="circle4"></div>
          </div>
          <div class="spinner-container container3">
            <div class="circle1"></div>
            <div class="circle2"></div>
            <div class="circle3"></div>
            <div class="circle4"></div>
          </div>
        </div>
      
      
      
    </div>
  </div>
</template>

<script>
	export default {
    name: "slider",
    props:{
      value: Array,
      min: String,
      max: String,
      maxTipValue: String,
      step: String
    },
		data() {
      
			return {
        loadingStatus:true
			}
    },
    computed:{
      
    },
		methods: {
      
		},
		mounted(){
      
      
    },
    watch:{
      
    }
	}
</script>
