const app = getApp();
const util = require('../../utils/util.js')
Page({
  data: {
    openid : app.globalData.openid,
    searchSongList: [], //放置返回数据的数组
    isFromSearch: true,   // 用于判断searchSongList数组是不是空数组，默认true，空的数组
    searchPageNum: 1,   // 设置加载的第几次，默认是第一次
    callbackcount: 15,      //返回数据的个数
    searchLoading: false, //"上拉加载"的变量，默认false，隐藏
    searchLoadingComplete: false  //“没有数据”的变量，默认false，隐藏
  },
  onLoad() {
    wx.setNavigationBarTitle({
      title: '卡券列表'
    })
    let that = this;
    that.fetchList();
    that.setData({  
      searchPageNum: 1,   //第一次加载，设置1
      searchSongList:[],  //放置返回数据的数组,设为空
      isFromSearch: true,  //第一次加载，设置true
      searchLoading: false,  //把"上拉加载"的变量设为true，显示
      searchLoadingComplete:false //把“没有数据”设为false，隐藏
    })
  },
  fetchList: function() {
    let that = this ,
        openid = app.globalData.openid ,
        pagenum = that.data.searchPageNum ;
    util.getSearchMusic(openid,pagenum,function(data){
      if(data.page.length > 0){
        let searchList = [];
        that.data.isFromSearch ? searchList= data.page : searchList= that.data.searchSongList.concat(data.page)
        that.setData({
          searchSongList: searchList,
          //searchLoading: true
        });
        if( that.data.searchSongList.length < 13){
          that.setData({
            searchLoading: false
          });
        }else{
          that.setData({
            searchLoading: true
          });
        }
      //没有数据了，把“没有数据”显示，把“上拉加载”隐藏
      }else{
        that.setData({
          searchLoadingComplete: true,
          searchLoading: false
        });
      }
    })
  },
  //滚动到底部触发事件
  searchScrollLower: function(){
    let that = this;
    if(that.data.searchLoading && !that.data.searchLoadingComplete){
      that.setData({
        searchPageNum: that.data.searchPageNum+1,  //每次触发上拉事件，把searchPageNum+1
        isFromSearch: false  //触发到上拉事件，把isFromSearch设为为false
      });
      that.fetchList();
    }
  }
})
