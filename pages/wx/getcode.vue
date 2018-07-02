 <template>
    <div class="getcode"></div>
</template>

<script>

export default {
    name: 'getcode',
    data () {
		var query = this.$route.query;
        return {
			query: query,
			returnLink: query.link,
			code:query.code
        }
    },
    methods: {
        
    },
    mounted: function() {

		if(!this.code){
			localStorage.setItem('wxCodeReturnLink',this.returnLink);
			location.href = 'http://open.weixin.qq.com/connect/oauth2/authorize?appid=wx6d8182a46738b4c1&redirect_uri=https://www.localpanda.com/wx/getcode&response_type=code&scope=snsapi_base&state=200#wechat_redirect';
		}else{
			var wxCodeReturnLink = localStorage.getItem('wxCodeReturnLink');
			location.href = wxCodeReturnLink + (/\?/.test(wxCodeReturnLink) ? '&' : '?') +'code=' + this.code;
		}
    }
}
</script>

