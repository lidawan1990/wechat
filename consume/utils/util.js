 const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}
function getSearchMusic(openid,pageindex,callback) {
  wx.request({
    url: 'https://clcw.hxdjt.com.cn/shop/activity/consume/consumeList',
    data: {
      openid: openid,
      pageNumber: pageindex
    },
    header: {
      'content-type': 'application/json'
    },
    method: 'GET',
    success: function (res) {
        callback(res.data);
    }
  })
}

module.exports = {
  formatTime: formatTime,
  getSearchMusic: getSearchMusic
}