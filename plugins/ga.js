const nuxtConfig = require('../nuxt.config');



export default ({ app }) => {


  //let NODE_ENV = process.env.NODE_ENV,
  var buildData = nuxtConfig.build;

  //测试和线上key
  window.payCode = buildData.payCode ? buildData.payCode : 'pk_test_ymxnY3KoqRcjCEElfvFxPy1G';
  window.paypalCode = buildData.paypalCode ? buildData.paypalCode : 'sandbox';

  //判断是否禁用ga
  window.gaSend = '';
  if(!buildData.testGa){
    //防止ga报错，默认添加ga方法
    window.ga = function(){
      console.log('this is test! no ga code!');
    };
    window._gat = {
      _getTracker(){
        console.log('this is test! no ga code!');
        return {_addTrans(){},_addItem(){},_trackTrans(){}};
      }
    }
  }else{
    //添加google统计代码
    var scriptArr = [
      'https://www.googletagmanager.com/gtag/js?id=UA-107010673-2',
      'https://www.google-analytics.com/analytics.js'
    ]
    for(var i=0;i<scriptArr.length;i++){
      var gaScript = document.createElement('script');
      gaScript.async=1;
      gaScript.src=scriptArr[i];
      document.body.appendChild(gaScript);
    }

    //添加默认数据
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments)};
    gtag('js', new Date());
    gtag('config', 'UA-107010673-2');
    window.gaSend = 'gtag_UA_107010673_2.send';

    //支付电商统计
    if(/payment/.test(window.location.pathname)){
      var gaTimer = setInterval(function(){
        if(ga){
          //电商ga，创建跟踪器
          ga('create', 'UA-107010673-2', 'auto');
          //加载跟踪器插件
          ga('require', 'ecommerce');
          //GA加载完毕回调
          if(typeof window.gaCallback == 'function'){
            window.gaCallback();
          };
          //停止检测
          window.clearInterval(gaTimer);
        }
      },300);
    }
    

  }
}