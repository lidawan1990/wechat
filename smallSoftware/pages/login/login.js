const app = getApp();
const md5 = require('../../utils/md5.js');
var codeVar = require('../../utils/com.js')
var isClick = true;
var smsFlag = false;
Page({
  data: {
    disabled: false,
    isShow: false, //默认按钮1显示，按钮2不显示
    sec: "60", //设定倒计时的秒数
    username: '',
    password: '',
    openid: ''
  },
  onReady: function() {
    wx.setNavigationBarTitle({
      title: "用户登录"
    })
  },

  getCode: function() {
    var _this = this;　　　　 //防止this对象的混杂，用一个变量来保存
    var time = _this.data.sec　　 //获取最初的秒数
    codeVar.getCode(_this, time);　　 //调用倒计时函数
  },

  // 获取输入账号 
  phoneInput: function(e) {
    this.setData({
      phone: e.detail.value
    })
  },

  // 获取输入密码 
  passwordInput: function(e) {
    this.setData({
      password: e.detail.value
    })
  },

  //获取短信验证码
  getCodeNum: function() {
    var _this = this;　　　　 //防止this对象的混杂，用一个变量来保存
    if (isClick) {
      isClick = false;
      if (!this.data.phone) {
        isClick = true;
        wx.showModal({
          title: '提示',
          content: '手机号不能为空',
          showCancel: false,
          duration: 2000
        })
      } else {
        var session_id = wx.getStorageSync('JSESSIONID'); //本地取存储的sessionID 
        var header;
        if (session_id != "" && session_id != null) {
          header = {
            'content-type': 'application/json',
            'Cookie': 'JSESSIONID=' + session_id
          }
        } else {
          header = {
            'content-type': 'application/json'
          }
        }
        //发送短信验证码
        wx.request({
          url: app.globalData.preUrl +'/activity/bindingUser/send_message',
          data: {
            phone: _this.data.phone
          },
          header: header,
          success: function(res) {
            isClick = true;
            if (res.data.status == "1") {
              smsFlag = true;
              _this.getCode();　　 //调用倒计时函数
            } else {
              wx.showModal({
                content: res.data.msg,
                showCancel: false
              });
            }
          }
        })
      }
    }

  },

  // 登录 
  login: function() {
    let that=this;
    if (that.data.phone.length == 0 || that.data.password.length==0) {
      wx.showModal({
        content: '手机号或登录密码不能为空',
        showCancel: false
      });
      return;
    }
    var session_id = wx.getStorageSync('JSESSIONID'); //本地取存储的sessionID 
    console.info("请求时" + session_id);
    var header;
    if (session_id != "" && session_id != null) {
      header = {
        'content-type': 'application/json',
        'Cookie': 'JSESSIONID=' + session_id
      }
    } else {
      header = {
        'content-type': 'application/json'
      }
    }
    if (that.data.disabled) {
      return;
    }
    that.setData({
      disabled: true
    });
    wx.request({
      url: app.globalData.preUrl +'/activity/bindingUser/bindingUser',
      data: {
        phone: that.data.phone,
        password: that.data.password
      },
      header: header,
      success: function(res) {
        that.setData({
          disabled: false
        });
        if (res.data.status == "1") {
          app.globalData.sysDriver = res.data.sysDriver;
          app.globalData.sysCars = res.data.sysCars;
          wx.switchTab({
            url: '../list/list',
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
  onShareAppMessage: function () {
    if (!this.data.id) {
      // todo 返回默认分享信息，比如小程序首页
    }
  },

  //注册
  register: function() {
    wx.navigateTo({
      url: '../register/register'
    });
  }
})