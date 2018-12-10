//加载build配置信息，用于服务器端自动打包发布区分测试和线上环境。
const nuxtBuild = require('./nuxt.build');

const config = {
  router: {
    middleware: [
      'base'
    ]
  },
  build: {
    // publicPath: '/mobile/_nuxt/', //PC和移动共存区分用
    extractCSS: {
      allChunks: true 
    },
    vendor: [
      //'swiper',
      'axios',
      'vue-lazyload',
      '~/assets/font/iconfont.js'
    ],
  },
  plugins: [
    // { src: '~/plugins/swiper.js', ssr: false },
    { src: '~/plugins/axios.js'},
    { src: '~/plugins/vue-lazyload.js', ssr: false },
    { src: '~/assets/js/plugin/swiper-4.2.6.min.js', ssr: false },
    { src: '~/plugins/ga.js', ssr: false },
    { src: '~/plugins/main.js', ssr: false }
  ],
  css: [
    '~/assets/scss/plugin/swiper.min.css',
    '~/assets/scss/_main.scss'
  ],
  render: {
    resourceHints:false
  },
  performance: {
    prefetch: false
  }
};

//加入build配置信息
if(nuxtBuild){
  for(var key in nuxtBuild){
    config.build[key] = nuxtBuild[key];
  }
}

module.exports = config;