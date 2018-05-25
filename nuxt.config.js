module.exports = {
  router: {
    middleware: [
      'base'
    ]
  },
  build: {

    // publicPath: 'https://resource.localpanda.cn/static/js/',
    // testGa: true,
    // payCode: 'pk_live_mRSdUvgwE4pZo2IVofL4cVch',

    vendor: [
      'swiper',
      'axios',
      'vue-lazyload',
      //'element-ui',
      '~/assets/font/iconfont.js'
    ],
  },
  plugins: [
    { src: '~/plugins/swiper.js', ssr: false },
    { src: '~/plugins/axios.js'},
    { src: '~/plugins/vue-lazyload.js', ssr: false },
    { src: '~/plugins/ga.js', ssr: false }
  ],
  css: [
    'swiper/dist/css/swiper.css',
    '~/assets/scss/_main.scss',
  ],
  render: {
    resourceHints:false
  },
  performance: {
    prefetch: false

  }
}
