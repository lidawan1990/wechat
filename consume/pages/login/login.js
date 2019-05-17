const app = getApp();
const md5 = require('../../utils/md5.js');

Page({
  onshow() {
    wx.setNavigationBarTitle({
      title: '核销登陆'
    })
  },
  // data: { 
  //   username: '', 
  //   password:'',
  //   openid : ''
  // },
  // onShow() {
  //   var that = this;
  //   //登录
  //   wx.login({
  //     success: function (res) {
  //         var code = res.code; //返回code
  //         wx.request({
  //           url: 'http://www.liandisoft.com/shop/activity/consume/getopenid',
  //           data: {
  //             code:res.code,
  //           },
  //           header: {
  //             'content-type': 'application/json'
  //           },
  //           success: function (res) {
  //             if (res != null || res.data != null) {
  //               app.globalData.openid = res.data.openid;
  //               app.globalData.consumeInfo = res.data.consumeInfo;
  //               that.setData({
  //                 openid: res.data.openid,
  //               })
  //               if (res.data.ishaveconsume){
  //                 // wx.switchTab({
  //                 //   url: '../index/index'
  //                 // })
  //                 wx.navigateTo({
  //                   url: '../index/index'
  //                 })
  //               }
  //             }
  //           }
  //         })
  //       }
  //   })
  // },
  // 获取输入账号 
  phoneInput :function (e) { 
    this.setData({ 
      username:e.detail.value 
    }) 
  }, 
  
// 获取输入密码 
  passwordInput :function (e) { 
    this.setData({ 
      password:e.detail.value 
    }) 
  }, 
  
// 登录 
  login: function () { 
    if(this.data.username.length == 0 || this.data.password.length == 0){ 
      wx.showModal({ 
        title: '提示', 
        content:'用户名和密码不能为空',
        showCancel:false,
        duration: 2000 
      }) 
    }else { 
      // 这里修改成跳转的页面 
      /*wx.showToast({ 
        title: '登录成功', 
        icon: 'success', 
        duration: 2000 
      }) */
      wx.request({
        url: 'https://clcw.hxdjt.com.cn/shop/activity/consume/userBnding',
        data: {
          username : this.data.username,
          password : md5.hex_md5(this.data. password),
          openid: app.globalData.openid
        },
        header: {
          'content-type': 'application/json'
        },
        success: function (res) {
          if(res.data.message == "操作成功"){
            wx.redirectTo({
              url: '../index/index'
            })
          }else{
            wx.showModal({
              content: res.data.message,
              showCancel: false,
            });
          }
        }
      })
    } 
  } 
})
