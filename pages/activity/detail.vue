<template>
    <div class="null">

    </div>
</template>
<script>
export default {
    name:'detail',
    data(){
        return{}
    },
    beforeCreate() {
        const q={
            id:this.$route.query.id,
            participants:this.$route.query.participants,
        }
        this.$route.push({name:"details",query:q})
    }
}
</script>
