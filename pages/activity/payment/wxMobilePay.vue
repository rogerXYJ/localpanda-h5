 <template>
    <div class="wxMobilePay">
        <!-- <div class="loading_box">
            <span class="loading"></span>The transaction is being confirmed …
        </div> -->
        <div class="confirm_box">
            <h3>Please confirm whether the payment has been completed ?</h3>
            <div class="btn_list">
                <a class="btn_ok" @touchstart="confirmation">Completion</a>
                <a @touchstart="tryAgain">Try again</a>
            </div>
        </div>
    </div>
</template>

<script>


export default {
    name: 'wxMobilePay',
    data () {
		var query = this.$route.query;
        return {
			query: query
        }
        
    },
    methods: {
        confirmation(e){
            var query = this.query;
			let postData={
				orderId:query.orderId,
				flag:1
			}
            //查询订单
            this.axios.post("https://api.localpanda.com/api/payment/query/status",JSON.stringify(postData),{
                headers: {
                    'Content-Type': 'application/json;'
                }
            }).then(function(response) {
                if(response.status==200){
                    var succeed = false,
                        msg = '';
                    if(response.data.succeed){
                        succeed = true;
                    }else{
                        msg = 'fail';
                    }
                    window.location.href = "https://www.localpanda.com/activity/payment/success?email="+query.email+"&orderId=" + query.orderId + '&amount=' + query.amount+"&succeed="+succeed+'&symbol='+query.symbol+'&currency='+query.currency+'&msg='+msg;
                }else{
                    alert('Please try again!');
                }
            }, function(response) {
                alert('Please try again!');
            })

            
        },
        tryAgain(){
            var query = this.query;
            window.location.href = 'https://www.localpanda.com/activity/payment/?objectId='+query.orderId+'&login='+(query.logIn?query.logIn:0);
        }
    },
    mounted: function() {
        
       localStorage.removeItem('AndroidOpenWx');

    }
}
</script>
<style lang="scss">
@import "~assets/scss/_main.scss";
html{ font-size:50px;}
.wxMobilePay{ background-color: rgba(0,0,0,0.5); height: 100vh; color: #fff;}
.loading_box{ text-align: center; padding-top: 30px; font-size: 15px; line-height: 20px;
    .loading{ display: inline-block; width: 20px; height:20px; background: url('https://cloud.localpanda.com/static/icon/loading.gif') center center no-repeat; background-size: 100%; vertical-align: top; margin-right: 6px;}
}
.confirm_box{
    position: absolute;
    left: 10%;
    top: 50%;
    transform: translateY(-50%);
    width: 80%;
    background-color: #fff;
    h3{
        color: #333;
        margin-top: 0.6rem;
        text-align: center;
        font-size: 0.3rem;
        line-height: 0.4rem;
    }
    .btn_list{
        padding: 0 0.4rem 1rem;
        a{
            display: block;
            height: 0.8rem;
            line-height: 0.8rem;
            color: #888;
            text-align: center;
            background-color: #eee;
            border-radius: 0.4rem;
            margin-top: 0.4rem;
            font-size: 0.26rem;
        }
        .btn_ok{
            color: #fff;
            background: -webkit-gradient(linear, left top, right top, from(#1bbc9d), to(#009efc));
            background: linear-gradient(to right, #1bbc9d, #009efc);
        }
    }
}

</style>

