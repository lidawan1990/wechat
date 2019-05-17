//index.js
const errMsg = require('../../utils/errcode.js')
//获取应用实例
const app = getApp()

Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    appid:'wx0fedd70c18fb3715',//appid
    secret:'2b23fe827af76d2c908dad6e4296807d',//secret
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    wx.setNavigationBarTitle({
      title: '卡券核销'
    })
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  getUserInfo: function(e) {
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  saoma : function(){
    var that = this;
    wx.scanCode({
      success: (res) => {
        this.show = res;
        that.setData({
          show: this.show
        })
        // wx.showToast({
        //   title: '扫码成功',
        //   icon: 'success',
        //   duration: 2000
        // })
        wx.request({
          url: 'https://clcw.hxdjt.com.cn/shop/activity/consume/consume',
          data: {
            code: res.result,
            consume_id: app.globalData.consumeInfo.id
          },
          header: {
            'content-type': 'application/json'
          },
          success: function (res) {
            if(res.data.errcode == 0 ){
              wx.showToast({
                title: errMsg.errcode(res.data.errcode),
                icon: 'success',
                duration: 2000
              })
            }else{
              wx.showModal({
                title : '错误' ,
                content : errMsg.errcode(res.data.errcode),
                showCancel : false,
              })
            }
          }
        })
      },
      fail: (res) => {
        wx.showToast({
          title: '失败',
          icon: 'loading',
          duration: 2000
        })
      },
      complete: (res) => {
      }
    })
  },
  listTab:function(){
    wx.navigateTo({
      url: '../list/list'
    })
  },
  unuserBnding: function () {
    wx.showModal({
      title: '提示',
      content: '确定要解除绑定吗？',
      success: function (sm) {
        if (sm.confirm) {
          wx.request({
            url: 'https://clcw.hxdjt.com.cn/shop/activity/consume/unuserBnding2',
            data: {
              openid: app.globalData.openid
            },
            header: {
              'content-type': 'application/json'
            },
            success: function (res) {
              if (res.data.message == '操作成功'){
                wx.showModal({
                  content: res.data.message,
                  showCancel: false,
                  success:function(sure) {
                    if(sure.confirm) {
                      wx.redirectTo({
                        url: '../login/login'
                      })
                    }
                  }
                });
              }else{
                wx.showModal({
                  content: res.data.message,
                  showCancel: false,
                });
              }
            }
          })
        } else if (sm.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  }
  
})
