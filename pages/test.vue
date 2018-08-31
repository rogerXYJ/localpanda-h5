<template>
    <div class="test">
        <button @click="zendeskStatus=true">dianji</button>
        <Talk :zendeskStatus="zendeskStatus" @getShowZendesk="setShowZendesk"></Talk>
     </div>
</template>

<script>
import Talk from '~/components/booking/talk'

export default {
  name: "test",
  data() {
    return {
        zendeskStatus:false
    };
  },
  components: {
     Talk
  },
  methods: {
     setShowZendesk(val){
         this.zendeskStatus=val
     },
     
  },
  mounted: function() {
      
  },
  watch: {}
};
</script>

<style lang="scss" scoped>

</style>