/* getDateString()
*  flag 0: current time
*  flag 1: start time example 00:00
*  flag 2: end time example 23:59
* */
export function getDateToString (date, flag) {
  var M = date.getMonth() + 1
  var d = date.getDate()
  if (M < 10) {
    M = '0' + M
  }
  if (d < 10) {
    d = '0' + d
  }
  if (flag === 0) {
    var h = date.getHours()
    var m = date.getMinutes()

    if (m < 10) {
      m = '0' + m
    }
    if (h < 10) {
      h = '0' + h
    }
    return date.getFullYear() + '-' + M + '-' + d + ' ' + h + ':' + m
  } else if (flag === 1) {
    return date.getFullYear() + '-' + M + '-' + d + ' 00:00'
  } else if (flag === 2) {
    return date.getFullYear() + '-' + M + '-' + d + ' 23:59'
  }
}
