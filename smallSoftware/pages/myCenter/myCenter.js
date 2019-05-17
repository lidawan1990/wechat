//获取应用实例
const app = getApp();
Page({
  data: {
    phoneFormat: '',//手机号格式化
    userInfo: {},
    sysDriver: {},
    sysCars: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  onReady: function() {

  },
  //返回上一页面
  back: function() {
    wx.redirectTo({
      url: '../list/list'
    });
  },
  //解绑用户
  unbindingUser: function() {
    wx.request({
      url: app.globalData.preUrl + '/activity/bindingUser/unbindingUser',
      data: {
        openid: app.globalData.openid
      },
      header: {
        'content-type': 'application/json'
      },
      success: function(res) {
        if (res.data.status == "1") {
          wx.showToast({
            title: '解绑成功',
            icon: 'succes',
            duration: 1000,
            mask: true,
            complete: function() {
              setTimeout(function() {
                wx.redirectTo({
                  url: '../login/login'
                })
              }, 1000)
            }
          })
        } else {
          wx.showModal({
            content: res.data.msg,
            showCancel: false
          });
        }
      }
    })
  },
  //修改用户信息
  updateUserInfo: function() {
    wx.navigateTo({
      url: '../update/update',
    })
  },
  onLoad: function() {
    let that=this;
    var mobile = app.globalData.sysDriver.mobile;
    if (mobile) {
      var phoneFormat = mobile.substring(0, 4) + "****" + mobile.substring(8);
      that.setData({
        phoneFormat: phoneFormat,
      });
    }
    that.setData({
      sysDriver: app.globalData.sysDriver,
      sysCars: app.globalData.sysCars,
    })

    if (app.globalData.userInfo) {
      that.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (that.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        that.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          that.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  }
})