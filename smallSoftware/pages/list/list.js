const app = getApp();
const util = require('../../utils/util.js')
Page({
  data: {
    scrollTop:0,
    isShowBill: '0', //0 加载数据中 1暂无数据 2 加载更多 3 数据加载完成
    isShowBillDone: '0',
    bill: [],
    billDone: [],
    billLength: 0,
    billDoneLength: 0,
    navTab: [{
        name: "待完成",
        num: 0
      },
      {
        name: "已完成",
        num: 0
      }
    ],
    currentNavtab: "0",
    pageNo: 0, // 待处理数据起始页数
    pageNoDone: 0, // 已处理数据起始页数
    pageSize: 5, //返回数据的个数
  },
  onShow: function() {
    this.onLoad();
  },
  onLoad(options) {
    let that = this;
    if (options&&options.currentNavtab) {
      that.setData({
        currentNavtab: options.currentNavtab
      })
    }
    wx.getSystemInfo({
      success: function(res) {
        that.setData({
          scrollHeight: res.windowHeight
        });
      }
    });
    that.setData({
      pageNo: 0,
      pageNoDone: 0,
      isShowBill: '0', //0 加载数据中 1暂无数据 2 加载更多 3 数据加载完成
      isShowBillDone: '0',
    })
    that.refresh();
    that.refreshDone();

  },
  
  //返回上一页面
  back: function() {
    wx.navigateBack();
  },
  //个人中心
  myCenter: function() {
    wx.navigateTo({
      url: '../myCenter/myCenter',
    })

  },
  switchTab: function(e) {
    let that = this;
    let idx = e.currentTarget.dataset.idx;
    this.setData({
      currentNavtab: e.currentTarget.dataset.idx
    });
    that.upper();
  },
  //上拉刷新
  upper: function() {
    let that = this;
    let currentNavtab = that.data.currentNavtab;
    if (currentNavtab == 0) {
      that.setData({
        pageNo: 0,
        isShowBill: '0', //0 加载数据中 1暂无数据 2 加载更多 3 数据加载完成
      })
      wx.showNavigationBarLoading();
      that.refresh();
      setTimeout(function() {
        wx.hideNavigationBarLoading();
        wx.stopPullDownRefresh();
      }, 2000);
    } else {
      that.setData({
        pageNoDone: 0,
        isShowBillDone: '0',
      })
      wx.showNavigationBarLoading();
      that.refreshDone();
      setTimeout(function() {
        wx.hideNavigationBarLoading();
        wx.stopPullDownRefresh();
      }, 2000);
    }

  },
  //下拉加载数据
  lower: function(e) {
    let that = this;
    let currentNavtab = that.data.currentNavtab;
    if (currentNavtab == 0) {
      if (that.data.isShowBill == '2') {
        wx.showNavigationBarLoading();
        setTimeout(function() {
          wx.hideNavigationBarLoading();
          that.setData({
            pageNo: that.data.pageNo + 1
          });
          that.nextLoad();
        }, 1000);
      }
    } else {
      if (that.data.isShowBillDone == '2') {
        wx.showNavigationBarLoading();
        setTimeout(function() {
          wx.hideNavigationBarLoading();
          that.setData({
            pageNoDone: that.data.pageNoDone + 1
          });
          that.nextLoadDone();
        }, 1000);
      }
    }
  },
  scroll: function (event) {
  //该方法绑定了页面滚动时的事件，我这里记录了当前的position.y的值,为了请求数据之后把页面定位到这里来。
    this.setData({
          scrollTop : event.detail.scrollTop
    });
  },
  //上拉刷新待处理的数据
  refresh: function() {
    var num = "navTab[" + 0 + "].num";
    let that = this;
    wx.showToast({
      title: '刷新中',
      icon: 'loading'
    });
    wx.request({
      url: app.globalData.preUrl + '/activity/waybill/getBillList',
      data: {
        pageNo: that.data.pageNo,
        pageSize: that.data.pageSize,
        carId: app.globalData.sysCars.id,
        billStatus: 0,
      },
      header: {
        'content-type': 'application/json'
      },
      success: function(res) {
        wx.hideToast();
        if (res.data.success) {
          var bill_data = res.data.page;
          if (bill_data && bill_data.length != 0) {
            that.setData({
              bill: bill_data,
              billLength: bill_data.length
            });
            let pageNo = that.data.pageNo + 1;
            let pageSize = that.data.pageSize;
            let total = parseInt(res.data.total);
            if (total != 0 && total > pageNo * pageSize) {

              that.setData({
                isShowBill: '2',
                [num]: total
              });
            } else {
              that.setData({
                isShowBill: '3',
                [num]: total
              });
            }
          } else {
            that.setData({
              isShowBill: '1',
              [num]:0
            });
          }
        } else {
          wx.showModal({
            content: res.data.msg,
            showCancel: false
          });
        }
      }
    })
  },

  //下拉加载待处理的数据
  nextLoad: function() {
    var num = "navTab[" + 0 + "].num";
    let that = this;
    wx.showToast({
      title: '加载中',
      icon: 'loading'
    });
    wx.request({
      url: app.globalData.preUrl + '/activity/waybill/getBillList',
      data: {
        pageNo: that.data.pageNo,
        pageSize: that.data.pageSize,
        carId: app.globalData.sysCars.id,
        billStatus: 0,
      },
      header: {
        'content-type': 'application/json'
      },
      success: function(res) {
        wx.hideToast();
        if (res.data.success) {
          var bill_data = res.data.page;
          if (bill_data.length != 0) {
            that.setData({
              bill: that.data.bill.concat(bill_data),
              billLength: that.data.billLength + bill_data.length
            });
            let pageNo = that.data.pageNo + 1;
            let pageSize = that.data.pageSize;
            let total = parseInt(res.data.total);
            if (total != 0 && total > pageNo * pageSize) {
              that.setData({
                isShowBill: '2',
                [num]: total
              });
            } else {
              that.setData({
                isShowBill: '3',
                [num]: total
              });
            }
          }
        } else {
          wx.showModal({
            content: res.data.msg,
            showCancel: false
          });
        }
      }
    })
  },
  //上拉刷新已完成的数据
  refreshDone: function() {
    var num = "navTab[" + 1 + "].num";
    let that = this;
    wx.showToast({
      title: '刷新中',
      icon: 'loading'
    });
    wx.request({
      url: app.globalData.preUrl + '/activity/waybill/getBillList',
      data: {
        pageNo: that.data.pageNoDone,
        pageSize: that.data.pageSize,
        carId: app.globalData.sysCars.id,
        billStatus: 6,
      },
      header: {
        'content-type': 'application/json'
      },
      success: function(res) {
        wx.hideToast();
        if (res.data.success) {
          var bill_data = res.data.page;
          if (bill_data && bill_data.length != 0) {
            that.setData({
              billDone: bill_data,
              billDoneLength: bill_data.length
            });
            let pageNo = that.data.pageNoDone + 1;
            let pageSize = that.data.pageSize;
            let total = parseInt(res.data.total);
            if (total != 0 && total > pageNo * pageSize) {
              that.setData({
                isShowBillDone: '2',
                [num]: total
              });
            } else {
              that.setData({
                isShowBillDone: '3',
                [num]: total
              });
            }
          } else {
            that.setData({
              isShowBillDone: '1',
              [num]: 0
            });
          }

        } else {
          wx.showModal({
            content: res.data.msg,
            showCancel: false
          });
        }
      }
    })
  },

  //下拉加载已完成的数据
  nextLoadDone: function() {
    var num = "navTab[" + 1 + "].num";
    let that = this;
    wx.showToast({
      title: '加载中',
      icon: 'loading'
    });
    wx.request({
      url: app.globalData.preUrl + '/activity/waybill/getBillList',
      data: {
        pageNo: that.data.pageNoDone,
        pageSize: that.data.pageSize,
        carId: app.globalData.sysCars.id,
        billStatus: 6,
      },
      header: {
        'content-type': 'application/json'
      },
      success: function(res) {
        wx.hideToast();
        if (res.data.success) {
          var bill_data = res.data.page;
          if (bill_data.length != 0) {
            that.setData({
              billDone: that.data.billDone.concat(bill_data),
              billDoneLength: that.data.billDoneLength + bill_data.length
            });
            let pageNo = that.data.pageNoDone + 1;
            let pageSize = that.data.pageSize;
            let total = parseInt(res.data.total);
            if (total != 0 && total > pageNo * pageSize) {
              that.setData({
                isShowBillDone: '2',
                [num]: total
              });
            } else {
              that.setData({
                isShowBillDone: '3',
                [num]: total
              });
            }
          }
        } else {
          wx.showModal({
            content: res.data.msg,
            showCancel: false
          });
        }
      }
    })
  },
  //点击去处理详情页面
  billDetail: function(e) {
    let id = e.currentTarget.id;
    wx.navigateTo({
      url: '../detail/detail?id=' + id
    })
  }
})