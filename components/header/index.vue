<template>
	<div class="M-head">
		<div class="log">
			<svg class="iconLog" aria-hidden="true" @click="goback">
			    <use xlink:href="#icon-logo_"></use>
			</svg>
		</div>
	</div>
</template>

<script>
	
	export default{
		name:'M-head',
		data(){
			return{
				
			}
		},
		components: {
	    },
	    methods: {
	    	goback(){
	    		location.href="/"
	    	}
	    },
	    mounted: function() {
	        
	     	
	    }
	}
</script>

<style lang="scss" scoped>
.M-head{
	padding: 0.2rem 0 0.2rem 0.4rem;
	background:#fff;
	.iconLog {
		width: 2.266666rem;
		height:0.746666rem;
		fill: currentColor;
		overflow: hidden;
		vertical-align: top;
	}
	.log{
		 width: 2.266666rem;
		 height:0.746666rem;
		 overflow: hidden;
	}
}
</style>