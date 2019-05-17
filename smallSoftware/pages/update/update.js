const app = getApp();
const md5 = require('../../utils/md5.js');
var isClick = true;
Page({
  data: {
	disabled: false,
    id: "",
    sex: '',
    userInfo: {},
    sysDriver: {},
    sysCars: {},
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
    isClick = true;
    this.setData({
      sysDriver: app.globalData.sysDriver,
      licenceImage: app.globalData.sysDriver.licenceImage,
      runImage: app.globalData.sysDriver.runImage,
      transportImage: app.globalData.sysDriver.transportImage,
      sysCars: app.globalData.sysCars,
      id: app.globalData.sysCars.id,
      sex: app.globalData.sysDriver.sex,
    });
    this.setData({
      tempFilePaths: [
        this.data.licenceImage
      ],
      tempFilePaths1: [
        this.data.runImage
      ],
      tempFilePaths2: [
        this.data.transportImage
      ],
    })
    if (app.globalData.sysDriver.sex == '1') {
      this.setData({
        items: [{
            name: '0',
            value: '男'
          },
          {
            name: '1',
            value: '女',
            checked: 'true'
          },
        ]
      });
    }
  
  },
  radioChange: function(e) {
    this.setData({
      sex: e.detail.value
    })
  },
  //返回上一页面
  back: function() {
    wx.reLaunch({
      url: '../myCenter/myCenter',
    })
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
            url: app.globalData.preUrl +'/activity/cars/upload',
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
                wx.showToast({
                  title: '上传成功',
                  icon: 'succes',
                  duration: 1000,
                  mask: true
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
            url: app.globalData.preUrl +'/activity/cars/upload',
            filePath: res.tempFilePaths[i],
            name: 'file',
            formData: {
              'imgIndex': i
            },
            header: {
              "Content-Type": "multipart/form-data"
            },
            success: function(res) {
              wx.hideToast();
              var data = JSON.parse(res.data);             
              if (data.status == '1') {
                that.setData({
                  runImage: data.imageUrl
                });
                wx.showToast({
                  title: '上传成功',
                  icon: 'succes',
                  duration: 1000,
                  mask: true
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
            url: app.globalData.preUrl +'/activity/cars/upload',
            filePath: res.tempFilePaths[i],
            name: 'file',
            formData: {
              'imgIndex': i
            },
            header: {
              "Content-Type": "multipart/form-data"
            },
            success: function(res) {
              wx.hideToast();
              var data = JSON.parse(res.data);
              if (data.status == '1') {
                that.setData({
                  transportImage: data.imageUrl
                });
                wx.showToast({
                  title: '上传成功',
                  icon: 'succes',
                  duration: 1000,
                  mask: true
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
  //司机修改
  formSubmit: function(e) {
    let that = this;
    //车牌号和载重
    if (e.detail.value.carNo.length == 0 || e.detail.value.ton.length==0) {
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
    //手机号
    if (e.detail.value.mobile.length == 0 ) {
      wx.showModal({
        content: '手机号码不得为空!',
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
    if ((e.detail.value.userPwd.length!=0)&&(e.detail.value.userPwd.length < 6 || e.detail.value.userPwd.length > 20)) {
      wx.showModal({
        content: '请输入6-20密码!',
        showCancel: false
      });
      return;

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
    if(that.data.disabled){
    	return;
    }
    that.setData({
        disabled: true
    });
    if (isClick) {
      isClick = false;
      //发送更新请求
      wx.request({
        url: app.globalData.preUrl +'/activity/cars/updateCars',
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        method: "POST",
        data: {
          sex: that.data.sex,
          id: that.data.id,
          carNo: e.detail.value.carNo,
          ton: e.detail.value.ton,
          mobile: e.detail.value.mobile,
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
          if (res.data.success) {
            wx.request({
              url: app.globalData.preUrl +'/activity/cars/findSysDriver',
              method: "GET",
              data: {
                id: that.data.id
              },
              success: function(res) {
                if (res.data.status == '1') {
                  app.globalData.sysDriver = res.data.sysDriver;
                  app.globalData.sysCars = res.data.sysCars;
                }
              }
            });
            wx.showToast({
              title: '修改成功',
              icon: 'succes',
              duration: 1000,
              mask: true,
              complete: function () {
                setTimeout(function () {
                  that.back();
                }, 1000) 
              }             
            });  
            
          } else {
            isClick = true;
            wx.showModal({
              content: res.data.msg,
              showCancel: false
            });
          }
          that.setData({
              disabled: false
          });
        },
        fail: function(res) {
        	that.setData({
                disabled: false
            });
          wx.showModal({
            content: res.data,
            showCancel: false
          });
        }
      })
    }

  }

})