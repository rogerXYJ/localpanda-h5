<style lang="scss">
//样式类型，pc.scss 和 mobile.scss
@import "./mobile.scss";
</style>

<template>
  <div class="infinite_loading">
    <div class="infinite_content" v-if="!isLoading">
      <slot></slot>
    </div>
    <div  v-bind:class="['loaders loading',isLoading && loadingStatus ? 'on' : 'off']">
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
    name: "infiniteLoading",
    props:{
      onInfinite: Object
    },
		data() {
      
			return {
        loadingStatus:false,
        isLoading:true
			}
    },
    computed:{
      
    },
		methods: {
      
		},
		mounted(){
      
      window.addEventListener('scroll',()=>{
        var loadY = this.$el.offsetTop,
          winY = scrollY,
          winH = document.documentElement.clientHeight;
        if(winY+winH > loadY){
          this.loadingStatus = true;
        }else{
          this.loadingStatus = false;
        }
      });


      this.stateChanger = {
        loaded: () => {
          this.isLoading = true;
        },
        complete: () => {
          this.isLoading = false;
        }
      };

    },
    watch:{
      loadingStatus:function(valNew,valOld){
        if(valNew && valNew != valOld){
          if(typeof onInfinite === 'function'){
            this.onInfinite(this.stateChanger);
          }else{
            this.$emit('infinite',this.stateChanger);
          }
          
        }
      }
    }
	}
</script>
