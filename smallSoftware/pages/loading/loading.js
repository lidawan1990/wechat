const app = getApp();
const md5 = require('../../utils/md5.js');

Page({
  data: {
    openid: ''
  },
  onShow() {
    var that = this;
    //登录
    wx.login({
      success: function(res) {
        var code = res.code; //返回code
        console.info("登录时code=" + code);
        wx.request({
          url: app.globalData.preUrl + '/activity/bindingUser/getopenid',
          data: {
            code: res.code,
          },
          header: {
            'content-type': 'application/json'
          },
          success: function(res) {
            console.info("登录时=" + res.data.sessionId);
            wx.setStorageSync('JSESSIONID', res.data.sessionId) //如果本地没有就说明第一次请求 把返回的session id 存入本地       
            if (res != null || res.data != null) {
              app.globalData.openid = res.data.openid;
              app.globalData.sysDriver = res.data.sysDriver;
              app.globalData.sysCars = res.data.sysCars;
              if (res.data.status == '1') {
                wx.switchTab({
                  url: '../list/list',
                })
              } else if (res.data.status == '2') {
                wx.showModal({
                  content: res.data.msg,
                  showCancel: false
                });
              } else {
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

  onLoad: function() {
    var that = this;
    // .....
    that.setData({
      //...
      loadingHidden: true
    })

  }

})