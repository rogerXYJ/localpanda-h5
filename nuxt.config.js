module.exports = {
  router: {
    middleware: [
      'base'
    ]
  },
  build: {
    publicPath: 'https://cloud.localpanda.com/static/js/',
    // testGa: true,
    // payCode: 'pk_live_mRSdUvgwE4pZo2IVofL4cVch',
    // paypalCode: 'production',
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
}
