export default defineAppConfig({
  pages: [
    'pages/index/index',
    'pages/cart/index',
    'pages/mine/index',
    'pages/detail/index',
    'pages/login/index',
    'pages/setting/index',
    'pages/mine-detail/index',
    'pages/address/index',
    'pages/myAddress/index',
    'pages/coupon/index',
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: 'WeChat',
    navigationBarTextStyle: 'black',
  },
  tabBar: {
    selectedColor: '#e0620d',
    color: '#333333',
    list: [
      {
        text: '首页',
        pagePath: 'pages/index/index',
        iconPath: './assets/images/home.png',
        selectedIconPath: './assets/images/chome.png',
      },
      {
        text: '购物车',
        pagePath: 'pages/cart/index',
        iconPath: './assets/images/cart.png',
        selectedIconPath: './assets/images/ccart.png',
      },
      {
        text: '我的',
        pagePath: 'pages/mine/index',
        iconPath: './assets/images/mine.png',
        selectedIconPath: './assets/images/cmine.png',
      },
    ],
  },
})