import $ from 'jquery'
import {baseUrl} from '@/assets/js/config'

/* 项目通用接口 */
// 获取文件请求url地址
export function getFilePathUrl () {
  const url = 'filepath' + '/znb/CommonCtrl/getFilePathUrl.do'
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

// 巡检上报 -> 添加巡检区域（标面）
export function addPlanArea (data) {
  const url = baseUrl + '/pipe/InspectController/addPlanArea.do'
  return $.ajax({
    type: 'POST',
    url: url,
    data: JSON.stringify(data),
    contentType: 'application/json'
  })
}

// 巡检工作 -> 巡检工作查询（巡检工作查询如果只传ID就是查询详情）
export function getInspectData (data) {
  const url = baseUrl + '/pipe/InspectController/getInspectData.do'
  return $.ajax({
    type: 'POST',
    url: url,
    data: JSON.stringify(data),
    contentType: 'application/json'
  })
}

// 巡检签到
export function addSign (data) {
  data.forEach((item, key) => {
    console.log(key, ': ', item)
  })
  const url = baseUrl + '/pipe/SignController/addSign.do'
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

// 获取隐患信息
export function gethiddenTrouble () {
  const url = '/static/hiddenTrouble.json'
  return $.ajax({
    type: 'GET',
    url: url
  })
}

// 获取巡检人信息
export function getInspector () {
  const url = '/static/inspector.json'
  return $.ajax({
    type: 'GET',
    url: url
  })
}
