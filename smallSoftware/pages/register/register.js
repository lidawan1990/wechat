const app = getApp();
const md5 = require('../../utils/md5.js');
var codeVar = require('../../utils/com.js')
var isClick = true;
var isClickGetCode = true;
var smsFlag = false;
Page({
  data: {
    disabled: false,
    isShow: false, //默认按钮1显示，按钮2不显示
    sec: "300"　, //设定倒计时的秒数
    mobile: '',
    sex: '',
    licenceImage: '',
    runImage: '',
    transportImage: '',
    tempFilePaths: '',
    tempFilePaths1: '',
    tempFilePaths2: '',
    items: [{
        name: '0',
        value: '男',
        checked: 'true'
      },
      {
        name: '1',
        value: '女'
      },
    ]
  },
  onReady: function() {
    wx.setNavigationBarTitle({
      title: "用户注册"
    });
    this.setData({
      sex: '0'
    })
  },
  radioChange: function(e) {
    this.setData({
      sex: e.detail.value
    })
  },
  // 获取输入手机号 
  phoneInput: function(e) {
    this.setData({
      mobile: e.detail.value
    })
  },
  getCode: function() {
    var _this = this;　　　　 //防止this对象的混杂，用一个变量来保存
    var time = _this.data.sec　　 //获取最初的秒数
    codeVar.getCode(_this, time);　　 //调用倒计时函数
  },
  //获取短信验证码
  getCodeNum: function() {
    var _this = this;　　　　 //防止this对象的混杂，用一个变量来保存
    if (_this.data.mobile.length == 0) {
      wx.showModal({
        title: '提示',
        content: '手机号不能为空',
        showCancel: false,
        duration: 2000
      });
      return;
    }
    if (_this.data.mobile.length != 11) {
      wx.showModal({
        title: '提示',
        content: '手机号应为11位',
        showCancel: false,
        duration: 2000
      });
      return;
    }
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
    if (isClickGetCode) {
      isClickGetCode = false;

      //发送短信验证码
      wx.request({
        url: app.globalData.preUrl + '/activity/bindingUser/send_message',
        data: {
          phone: _this.data.mobile
        },
        header: header,
        success: function(res) {
          isClickGetCode = true;
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

  },
  //返回上一页面
  back: function() {
    wx.navigateBack();
  },
  //上传本人驾照  
  uploadLicenceImage: function() {
    let that = this;
    wx.chooseImage({
      count: 1, //最多可以选择的图片总数  
      sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有  
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有  
      success: function(res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        that.setData({
          tempFilePaths: res.tempFilePaths
        })
        //启动上传等待中...  
        wx.showToast({
          title: '正在上传...',
          icon: 'loading',
          mask: true,
          duration: 10000
        })
        var uploadImgCount = 0;
        for (var i = 0, h = res.tempFilePaths.length; i < h; i++) {
          wx.uploadFile({
            url: app.globalData.preUrl + '/activity/cars/upload',
            filePath: res.tempFilePaths[i],
            name: 'file',
            formData: {
              'imgIndex': i
            },
            header: {
              "Content-Type": "multipart/form-data"
            },
            success: function(res) {
              var data = JSON.parse(res.data);
              wx.hideToast();
              if (data.status == '1') {
                that.setData({
                  licenceImage: data.imageUrl
                });
              } else {
                wx.showModal({
                  content: data.msg,
                  showCancel: false
                });
              }

            },
            fail: function(res) {
              wx.hideToast();
              wx.showModal({
                title: '错误提示',
                content: '上传图片失败',
                showCancel: false,
                success: function(res) {}
              })
            }
          });
        }
      }
    });
  },
  listenerButtonPreviewLicenceImage: function(e) {
    let index = e.target.dataset.index; //预览图片的编号
    let that = this;
    wx.previewImage({
      current: that.data.tempFilePaths[index], //预览图片链接
      urls: that.data.tempFilePaths, //图片预览list列表
      success: function(res) {
        //console.log(res);
      },
      fail: function() {
        //console.log('fail')
      }
    })
  },
  //上传本人行驶证 
  uploadRunImage: function() {
    let that = this;
    wx.chooseImage({
      count: 1, //最多可以选择的图片总数  
      sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有  
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有  
      success: function(res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        that.setData({
          tempFilePaths1: res.tempFilePaths
        })
        //启动上传等待中...  
        wx.showToast({
          title: '正在上传...',
          icon: 'loading',
          mask: true,
          duration: 10000
        })
        var uploadImgCount = 0;
        for (var i = 0, h = res.tempFilePaths.length; i < h; i++) {
          wx.uploadFile({
            url: app.globalData.preUrl + '/activity/cars/upload',
            filePath: res.tempFilePaths[i],
            name: 'file',
            formData: {
              'imgIndex': i
            },
            header: {
              "Content-Type": "multipart/form-data"
            },
            success: function(res) {
              var data = JSON.parse(res.data);
              wx.hideToast();
              if (data.status == '1') {
                that.setData({
                  runImage: data.imageUrl
                });
              } else {
                wx.showModal({
                  content: data.msg,
                  showCancel: false
                });
              }

            },
            fail: function(res) {
              wx.hideToast();
              wx.showModal({
                title: '错误提示',
                content: '上传图片失败',
                showCancel: false,
                success: function(res) {}
              })
            }
          });
        }
      }
    });
  },
  listenerButtonPreviewRunImage: function(e) {
    let index = e.target.dataset.index; //预览图片的编号
    let that = this;
    wx.previewImage({
      current: that.data.tempFilePaths1[index], //预览图片链接
      urls: that.data.tempFilePaths1, //图片预览list列表
      success: function(res) {
        //console.log(res);
      },
      fail: function() {
        //console.log('fail')
      }
    })
  },
  //上传本人运营证 
  uploadTransportImage: function() {
    let that = this;
    wx.chooseImage({
      count: 1, //最多可以选择的图片总数  
      sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有  
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有  
      success: function(res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        that.setData({
          tempFilePaths2: res.tempFilePaths
        })
        //启动上传等待中...  
        wx.showToast({
          title: '正在上传...',
          icon: 'loading',
          mask: true,
          duration: 10000
        })
        var uploadImgCount = 0;
        for (var i = 0, h = res.tempFilePaths.length; i < h; i++) {
          wx.uploadFile({
            url: app.globalData.preUrl + '/activity/cars/upload',
            filePath: res.tempFilePaths[i],
            name: 'file',
            formData: {
              'imgIndex': i
            },
            header: {
              "Content-Type": "multipart/form-data"
            },
            success: function(res) {
              var data = JSON.parse(res.data);
              wx.hideToast();
              if (data.status == '1') {
                that.setData({
                  transportImage: data.imageUrl
                });
              } else {
                wx.showModal({
                  content: data.msg,
                  showCancel: false
                });
              }

            },
            fail: function(res) {
              wx.hideToast();
              wx.showModal({
                title: '错误提示',
                content: '上传图片失败',
                showCancel: false,
                success: function(res) {}
              })
            }
          });
        }
      }
    });
  },
  listenerButtonPreviewTransportImage: function(e) {
    let index = e.target.dataset.index; //预览图片的编号
    let that = this;
    wx.previewImage({
      current: that.data.tempFilePaths2[index], //预览图片链接
      urls: that.data.tempFilePaths2, //图片预览list列表
      success: function(res) {
        //console.log(res);
      },
      fail: function() {
        //console.log('fail')
      }
    })
  },
  //司机注册
  formSubmit: function(e) {
    let that = this;
    //车牌号和载重
    if (e.detail.value.carNo.length == 0 || e.detail.value.ton.length == 0) {
      // wx.showToast({
      //   title: '车牌号或载重不得为空!',
      //   icon: 'loading',
      //   duration: 1500
      // })
      // setTimeout(function() {
      //   wx.hideToast()
      // }, 2000)
      wx.showModal({
        content: '车牌号或载重不得为空!',
        showCancel: false
      });
      return;
    }
    //手机号和密码
    if (e.detail.value.mobile.length == 0 || e.detail.value.userPwd.length == 0) {
      wx.showModal({
        content: '手机号码或密码不得为空!',
        showCancel: false
      });
      return;
    }
    //手机号格式
    if (e.detail.value.mobile.length != 11) {
      wx.showModal({
        content: '请输入11位手机号码!',
        showCancel: false
      });
      return;
    }
    //密码格式
    if (e.detail.value.userPwd.length < 6 || e.detail.value.userPwd.length > 20) {
      wx.showModal({
        content: '请输入6-20密码!',
        showCancel: false
      });
      return;

    }
    if (!smsFlag) {
      wx.showModal({
        content: '请点击发送验证码',
        showCancel: false
      })
    }
    //有效证件图片
    if (that.data.licenceImage.length == 0) {
      wx.showModal({
        content: '请上传本人驾照',
        showCancel: false
      });
      return;
    }
    if (that.data.runImage.length == 0) {
      wx.showModal({
        content: '请上传行驶证',
        showCancel: false
      });
      return;
    }
    if (that.data.transportImage.length == 0) {
      wx.showModal({
        content: '请上传营运证',
        showCancel: false
      });
      return;
    }
    if (that.data.disabled) {
      return;
    }
    that.setData({
      disabled: true
    });
    if (isClick) {
      isClick = false;
      var session_id = wx.getStorageSync('JSESSIONID'); //本地取存储的sessionID 
      var header;
      if (session_id != "" && session_id != null) {
        header = {
          'content-type': 'application/x-www-form-urlencoded',
          'Cookie': 'JSESSIONID=' + session_id
        }
      } else {
        header = {
          'content-type': 'application/x-www-form-urlencoded'
        }
      }
      //发送注册请求
      wx.request({
        url: app.globalData.preUrl + '/activity/cars/addCars',
        header: header,
        method: "POST",
        data: {
          sex: that.data.sex,
          carNo: e.detail.value.carNo,
          ton: e.detail.value.ton,
          mobile: e.detail.value.mobile,
          code: e.detail.value.code,
          userPwd: e.detail.value.userPwd,
          userName: e.detail.value.userName,
          identNo: e.detail.value.identNo,
          age: e.detail.value.age,
          address: e.detail.value.address,
          carDesc: e.detail.value.carDesc,
          licenceImage: that.data.licenceImage,
          runImage: that.data.runImage,
          transportImage: that.data.transportImage
        },
        success: function(res) {
          that.setData({
            disabled: false
          });
          isClick = true;
          //var data = JSON.parse(res.data);
          if (res.data.success) {
            wx.showToast({
              title: "注册成功",
              icon: 'loading',
              duration: 1500
            });
            wx.redirectTo({
              url: '../login/login'
            });
          } else {
            isClick = true;
            wx.showModal({
              content: res.data.msg,
              showCancel: false
            });
          }
        },
        fail: function(res) {
          that.setData({
            disabled: false
          });
          var data = JSON.parse(res.data);
          wx.showModal({
            content: data.msg,
            showCancel: false
          });
        }
      })
    }

  }

})