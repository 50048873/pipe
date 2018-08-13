import $ from 'jquery'
import {baseUrl} from '@/assets/js/config'

/* 项目通用接口 */
// 获取文件请求url地址
export function getFilePathUrl () {
  const url = baseUrl + '/znb/CommonCtrl/getFilePathUrl.do'
  return $.ajax({
    type: 'GET',
    url: url
  })
}

// 获取签到点
export function getSignPoint () {
  const url = '/static/signPoint.json'
  return $.ajax({
    type: 'GET',
    url: url
  })
}

// 巡检 -> 上传
export function getReservoirDetailInspectionAdd (data) {
  return $.ajax({
    type: 'POST',
    contentType: false,
    processData: false,
    cache: false,
    url: baseUrl + '/znb/patrolRecord/addRecord.do',
    data: data
  })
}
