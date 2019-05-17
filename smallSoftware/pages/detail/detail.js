const app = getApp();
const util = require('../../utils/util.js')
Page({
  data: {
    id: '', //运单编号
    billStatus: '', //运单状态
    bill: '',
    sysCars: '',
    sysDriver: '',
    orderSn: '', //订单编号
    phoneFormat: '', //手机号格式化
    storePhone: '',
    phoneList: '',
    phoneNameList: '',
    customerName: '',
    customerPhone: '',
    img_arr: [], 
    tempFilePaths: [],
    picUrl:''
  },
  onLoad: function(options) {
    var that = this;
    that.setData({
      id: options.id,
    });
    that.loadData();
  },
  //返回上一页面
  back: function() {
    let that = this;
    let currentNavtab = 0;
    if (that.data.billStatus == 5 || that.data.billStatus == 6) {
      currentNavtab = 1;
    }
    wx.reLaunch({
      url: '../list/list?currentNavtab=' + currentNavtab
    })
  },
  //
  loadData: function() {
    let that = this;
    wx.request({
      url: app.globalData.preUrl + '/activity/waybill/getBillById',
      data: {
        id: that.data.id
      },
      header: {
        'content-type': 'application/json'
      },
      success: function(res) {
        var data = res.data;
        if (data.status == '1') {
          var mobile = data.sysDriver.mobile;
          if (mobile) {
            var phoneFormat = mobile.substring(0, 4) + "****" + mobile.substring(8);
            that.setData({
              phoneFormat: phoneFormat,
            });
          }
          that.setData({
            bill: data.bill,
            billStatus: data.bill.billStatus,
            sysCars: data.sysCars,
            sysDriver: data.sysDriver,
            orderSn: data.orderSn,
            customerName: data.customerName,
            customerPhone: data.customerPhone,
            phoneList: [
              data.storePhone,
              data.salePhone
            ],
            phoneNameList: [
              '卖家电话：' + data.storePhone,
              '业务员电话：' + data.salePhone
            ],
          });
        } else {
          wx.showModal({
            content: data.msg,
            showCancel: false
          });
        }
      }
    })
  },
  tel: function() {
    let that = this;
    wx.showActionSheet({
      itemList: that.data.phoneNameList,
      success: function(res) {
        var phone = that.data.phoneList[res.tapIndex];
        if (phone.length > 0) {
          wx.makePhoneCall({
            phoneNumber: phone
          })
        }

      },
      fail: function(res) {
        console.log(res.errMsg)
      }
    })
  },
  //更新状态
  update: function(e) {
    let that = this;
    let billStatus = parseInt(that.data.billStatus) + 1;
    if (that.data.picUrl.length <= 0 && billStatus=='6'){
      wx.showModal({
        content: '请上传收货单信息',
        showCancel: false
      });
      return;
    }
    wx.request({
      url: app.globalData.preUrl + '/activity/waybill/modifyBill',
      data: {
        billId: that.data.id,
        status: billStatus,
        picUrl: that.data.picUrl
      },
      header: {
        'content-type': 'application/json'
      },
      success: function(res) {
        var data = res.data;
        if (data.success) {
          wx.reLaunch({
            url: '../list/list',
          })
        } else {
          wx.showModal({
            content: data.msg,
            showCancel: false
          });
        }
      }
    })
  },

  // 上传 取货单
  upload: function () {
    let that = this;
    wx.chooseImage({
      count: 3, //最多可以选择的图片总数  
      sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有  
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有  
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths
        let tempFilePathsimg = that.data.tempFilePaths
        //获取当前已上传的图片的数组
        var tempFilePathsimgs = tempFilePathsimg.concat(tempFilePaths)
        that.setData({
          tempFilePaths: tempFilePathsimgs
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
            success: function (res) {
              var data = JSON.parse(res.data);
              wx.hideToast();

              if (data.status == '1') {
                var url=that.data.picUrl;
                if (url){
                  url = url + "," + data.imageUrl;
                }else{
                  url = data.imageUrl;
                }
                that.setData({
                  picUrl: url 
                });
              } else {
                wx.showModal({
                  content: data.msg,
                  showCancel: false
                });
              }

            },
            fail: function (res) {
              wx.hideToast();
              wx.showModal({
                title: '错误提示',
                content: '上传图片失败',
                showCancel: false,
                success: function (res) { }
              })
            }
          });
        }
      }
    });
  },
  previewImage: function (e) {
    let index = e.target.dataset.index; //预览图片的编号
    let that = this;
    wx.previewImage({
      current: that.data.tempFilePaths[index], //预览图片链接
      urls: that.data.tempFilePaths, //图片预览list列表
      success: function (res) {
        //console.log(res);
      },
      fail: function () {
        //console.log('fail')
      }
    })
  },
  previewImage1: function (e) {
    let index = e.target.dataset.index; //预览图片的编号
    let that = this;
    wx.previewImage({
      current: that.data.bill.pics[index], //预览图片链接
      urls: that.data.bill.pics, //图片预览list列表
      success: function (res) {
        //console.log(res);
      },
      fail: function () {
        //console.log('fail')
      }
    })
  },
  deleteImg: function (e) {
    let index = e.target.dataset.index; //预览图片的编号
    let that = this;
    let tempFilePaths=that.data.tempFilePaths;
    tempFilePaths.splice(index,1);
    that.setData({
      tempFilePaths: tempFilePaths
    })
  },
})