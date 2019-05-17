const app = getApp();
const md5 = require('../../utils/md5.js');

Page({
  data: {
    username: '',
    password: '',
    openid: ''
  },
  onShow() {
    var that = this;
    //登录
    wx.login({
      success: function (res) {
        var code = res.code; //返回code
        wx.request({
          url: 'https://clcw.hxdjt.com.cn/shop/activity/consume/getopenid',
          data: {
            code: res.code,
          },
          header: {
            'content-type': 'application/json'
          },
          success: function (res) {
            if (res != null || res.data != null) {
              app.globalData.openid = res.data.openid;
              app.globalData.consumeInfo = res.data.consumeInfo;
              that.setData({
                openid: res.data.openid,
              })
              if (res.data.ishaveconsume) {
                wx.redirectTo({
                  url: '../index/index'
                })
              }else{
                wx.redirectTo({
                  url: '../login/login'
                })
              }
            }
          }
        })
      }
    })
  },

  onLoad: function () {
    var that = this;
    // .....
    that.setData({
      //...
      loadingHidden: true
    })

  }

})
