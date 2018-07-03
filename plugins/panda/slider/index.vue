<style lang="scss">
//样式类型，pc.scss 和 mobile.scss
@import "./mobile.scss";
</style>

<template>
  <div class="slider_box">
    <div class="slider_line_bg">
      <p v-once :style="defaultLine()"></p>
      <span class="slider_btn" @touchmove="btnMove" @touchstart="btnStart" @touchend="btnEnd" v-once :style="defaultBtn1()"></span>
      <span class="slider_btn" @touchmove="btnMove" @touchstart="btnStart" @touchend="btnEnd" v-once :style="defaultBtn2()" v-if="value.length==2"></span>
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
      step: String
    },
		data() {
      var min = this.min?this.min:0;
      var max = this.max?this.max:100;
			return {
        minValue: (this.value[0]<min)?this.value[0]:min,
        maxValue: (this.value[1]>max)?this.value[1]:max,
        stepNum: this.step ? parseInt(this.step) : 1,
        oldLeft: 0,
        oldX: 0,
        sliderWidth: 0
			}
    },
    computed:{
      
    },
		methods: {
      btnStart(e){
        var target = e.target,
          parent = target.parentNode;

        this.oldLeft = target.offsetLeft;
        this.oldX = e.targetTouches[0].clientX;
        this.sliderWidth = parent.clientWidth;
        this.thisLine = parent.getElementsByTagName('p')[0];
        this.thisBtn = parent.getElementsByTagName('span');
        //this.btnWidth = e.target.clientWidth/2;
      },
      btnMove(e){
        e.preventDefault();
        e.stopPropagation();

        var target = e.target,
          parent = target.parentNode;

        //获取当前拖拽的位置
        var _touch1 = e.targetTouches[0];
        var moveX = _touch1.clientX - this.oldX;
        //获取当前移动的距离
        var left = this.oldLeft + moveX;
        if(left<0){
          left = 0;
        }else if(left>this.sliderWidth){
          left = this.sliderWidth;
        }
        //修改拖拽按钮的位置
        target.style.left = left/this.sliderWidth*100 +'%';

        //获得按钮拖拽后的最大，最小值
        var btnLeft1 = this.thisBtn[0].offsetLeft,
          btnLeft2 = this.thisBtn[1] ? this.thisBtn[1].offsetLeft : 0;
        var left = {
          min: btnLeft1>btnLeft2?btnLeft2:btnLeft1,
          max: btnLeft1<btnLeft2?btnLeft2:btnLeft1
        }
        //设置区间色块的位置和宽度
        this.thisLine.style.width = (left.max-left.min)/this.sliderWidth*100 +'%';
        this.thisLine.style.left = (left.min)/this.sliderWidth*100 +'%';

        
        
        var min = Math.round((this.maxValue-this.minValue)*(left.min/this.sliderWidth))+parseInt(this.minValue),
          max = Math.round((this.maxValue-this.minValue)*(left.max/this.sliderWidth))+parseInt(this.minValue);

        var stepNum = this.stepNum;
        //拖动数值变化最小区间
        if(stepNum>1){
          if(min%stepNum < stepNum/2){
            min = min - min%stepNum;
          }else{
            min = min - min%stepNum + stepNum;
          };
          if(max%stepNum < stepNum/2){
            max = max - max%stepNum;
          }else{
            max = max - max%stepNum + stepNum;
          };
        }

        if(max>this.maxValue){
          max = this.maxValue;
        }
        if(min<this.minValue){
          min = this.minValue;
        }

        //多个区间
        if(this.value.length==2){
          this.$emit('input',[min,max]);
        }else{
          //显示值单个
          var value = Math.round((this.maxValue-this.minValue)*(btnLeft1/this.sliderWidth))+parseInt(this.minValue)
          this.$emit('input',[value]);
        }
      },
      btnEnd(e){
        
      },
      defaultLine(){
        var left = 0;
        var width = this.value[0] / this.maxValue * 100;
        //多个区间
        if(this.value.length==2){
          left = (this.value[0]-this.minValue) / (this.maxValue-this.minValue) * 100;
          width = (this.value[1] - this.value[0]) / (this.maxValue-this.minValue) * 100;
        }
        return 'width:'+width+'%;left:'+left+'%';
      },
      defaultBtn1(){
        var left = (this.value[0]-this.minValue) / (this.maxValue-this.minValue) * 100;
        return 'left:'+left+'%';
      },
      defaultBtn2(){
        var left = (this.value[1]-this.minValue) / (this.maxValue-this.minValue) * 100;
        return 'left:'+left+'%';
      }
		},
		mounted(){
      
      
    },
    watch:{
      
    }
	}
</script>
