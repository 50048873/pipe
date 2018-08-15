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

// 巡检上报 -> 添加巡查隐患和其它
export function addDanger (data) {
  data.forEach((item, key) => {
    console.log(key, ': ', item)
  })
  const url = baseUrl + '/pipe/DangerController/addDanger.do'
  return $.ajax({
    type: 'POST',
    contentType: false,
    processData: false,
    cache: false,
    url: url,
    data: data
  })
}

// 巡检上报 -> 在建工程和道路改造
export function addPorject (data) {
  data.forEach((item, key) => {
    console.log(key, ': ', item)
  })
  const url = baseUrl + '/pipe/DangerController/addPorject.do'
  return $.ajax({
    type: 'POST',
    contentType: false,
    processData: false,
    cache: false,
    url: url,
    data: data
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

// 获取签到点
export function gethiddenTrouble () {
  const url = '/static/hiddenTrouble.json'
  return $.ajax({
    type: 'GET',
    url: url
  })
}
