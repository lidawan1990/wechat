let errcodemessage = [
  {code:'422' ,message: '卡券异常'},
  {code:'-1' ,message: '系统繁忙，此时请开发者稍后再试'},
  {code:'0' ,message: '核销成功'}, 
  {code:'40009' ,message: '图片文件超长'},
  {code:'40013',message: '不合法的Appid，请开发者检查AppID的正确性，避免异常字符，注意大小写'},
  {code:'40053',message: '不合法的actioninfo，请开发者确认参数正确'},
  {code:'40071',message: '不合法的卡券类型'},
  {code:'40072',message:'不合法的编码方式'},
  {code:'40078',message: '不合法的卡券状态'},
  {code:'40079',message: '不合法的时间'},
  {code:'40080',message: '不合法的CardExt'},
  {code:'40099',message: '卡券已被核销'},
  {code:'40100',message: '不合法的时间区间'},
  {code:'40116',message: '不合法的Code码'},
  {code:'40122',message: '不合法的库存数量'},
  {code:'40124',message: '会员卡设置查过限制的'}, 
  {code:'40127',message: '卡券被用户删除或转赠中'},
  {code:'41012',message: '缺少cardid参数'},
  {code:'45030',message: '该cardid无接口权限'},
  {code:'45031',message: '库存为0'},
  {code:'45033',message: '用户领取次数超过限制get_limit'}, 
  {code:'41011',message: '缺少必填字段'},
  {code:'45021',message: '字段超过长度限制，请参考相应接口的字段说明'},
  {code:'40056',message: '不合法的Code码'},
  {code:'43009',message: '自定义SN权限，请前往公众平台申请'},
  {code:'43010',message: '无储值权限，请前往公众平台申请'}
]

let that = this ;
function errcode(code){
  let msg = '';
  errcodemessage.forEach(function(value,key,arr){
    if(value.code == code){
      msg = value.message
    }
  });
  return msg
}

module.exports = {
  errcode: errcode,
}