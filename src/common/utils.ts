export const deepClone = (source:any) => {

}

/**
 * 时间格式化工具
 * @param time
 * @param format  default {y}-{m}-{d} {h}:{i}:{s}
 */
export const timeFormat = function(time:Date|string|number,format?:string):string {
  if (!time) {
    return ''
  }
  let date = null
  if (time instanceof Date){
    date = time
  }else if (typeof time === 'number'){
    const len = ('' + time).length
    if (len !=10 && len != 13){
      return ''
    }
    if (len === 10){
      time = time * 1000
    }
    date = new Date(time)
  }else {
    date = new Date(time)
  }
  if (date.toString() === 'Invalid Date'){
    return  ''
  }
  const formatObj:any = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  }
  const formatString = format || '{y}-{m}-{d} {h}:{i}:{s}'
  return formatString.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
    let value = formatObj[key]
    if (key === 'a') {
      return ['一', '二', '三', '四', '五', '六', '日'][value - 1]
    }
    if (result.length > 0 && value < 10) {
      value = '0' + value
    }
    return value || 0
  })
}
