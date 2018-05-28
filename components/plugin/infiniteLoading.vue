<script>
	export default {
    name: "infiniteLoading",
    props:{
      loadCallBack: Function
    },
		data() {
			return {
        isloading:false
			}
		},
		methods: {
      scrollHandler(){
        this.isloading = true;
        var sTop = this.$el.pageYOffset;
        var sTop = document.body.scrollTop;
        if(sTop){
          
        }
        if (typeof this.loadCallBack === 'function') {
          this.loadCallBack();
        }
      }
		},
		mounted(){
      this.scrollHandler();
      window.addEventListener('scroll', this.scrollHandler);
    }
	}
</script>
<template>
	<!--//加载动画-->
	<div id="infiniteLoading">
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
</template>
<style lang="scss" scoped>
	.loaders {
		position: fixed;
		top:0;
		width:100%;
		height:100%;
		z-index:999;
	}
	
	.spinner {
  position: absolute;
  top: 50%;
  left: 50%;
  width: .6rem;
  height: .6rem;
  position: relative;
  margin: -0.3rem 0 0 -0.3rem;
}
 
.container1 > div, .container2 > div, .container3 > div {
  width: 0.16rem;
  height: 0.16rem;
  background-color: #1bbc9d;
 
  border-radius: 100%;
  position: absolute;
  -webkit-animation: bouncedelay 1.2s infinite ease-in-out;
  animation: bouncedelay 1.2s infinite ease-in-out;
  -webkit-animation-fill-mode: both;
  animation-fill-mode: both;
}
 
.spinner .spinner-container {
  position: absolute;
  width: 100%;
  height: 100%;
}
 
.container2 {
  -webkit-transform: rotateZ(45deg);
  transform: rotateZ(45deg);
}
 
.container3 {
  -webkit-transform: rotateZ(90deg);
  transform: rotateZ(90deg);
}
 
.circle1 { top: 0; left: 0; }
.circle2 { top: 0; right: 0; }
.circle3 { right: 0; bottom: 0; }
.circle4 { left: 0; bottom: 0; }
 
.container2 .circle1 {
  -webkit-animation-delay: -1.1s;
  animation-delay: -1.1s;
}
 
.container3 .circle1 {
  -webkit-animation-delay: -1.0s;
  animation-delay: -1.0s;
}
 
.container1 .circle2 {
  -webkit-animation-delay: -0.9s;
  animation-delay: -0.9s;
}
 
.container2 .circle2 {
  -webkit-animation-delay: -0.8s;
  animation-delay: -0.8s;
}
 
.container3 .circle2 {
  -webkit-animation-delay: -0.7s;
  animation-delay: -0.7s;
}
 
.container1 .circle3 {
  -webkit-animation-delay: -0.6s;
  animation-delay: -0.6s;
}
 
.container2 .circle3 {
  -webkit-animation-delay: -0.5s;
  animation-delay: -0.5s;
}
 
.container3 .circle3 {
  -webkit-animation-delay: -0.4s;
  animation-delay: -0.4s;
}
 
.container1 .circle4 {
  -webkit-animation-delay: -0.3s;
  animation-delay: -0.3s;
}
 
.container2 .circle4 {
  -webkit-animation-delay: -0.2s;
  animation-delay: -0.2s;
}
 
.container3 .circle4 {
  -webkit-animation-delay: 0s;
  animation-delay: 0s;
}
 
@-webkit-keyframes bouncedelay {
  0%, 80%, 100% { -webkit-transform: scale(0) }
  40% { -webkit-transform: scale(1.0) }
}
 
@keyframes bouncedelay {
  0%, 100% {
    transform: scale(0);
    -webkit-transform: scale(0);
  } 45%,55% {
    transform: scale(1.0);
    -webkit-transform: scale(1.0);
  }
}

</style>