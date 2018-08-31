import $ from 'jquery'

// 巡检上报 -> 添加巡查隐患和其它
export function addDanger (data) {
  const url = window.DSE.baseUrl + '/pipe/DangerController/addDanger.do'
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
  const url = window.DSE.baseUrl + '/pipe/DangerController/addPorject.do'
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
  const url = window.DSE.baseUrl + '/pipe/InspectController/addPlanArea.do'
  return $.ajax({
    type: 'POST',
    url: url,
    data: JSON.stringify(data),
    contentType: 'application/json'
  })
}

// 巡检工作 -> 巡检工作查询（巡检工作查询如果只传ID就是查询详情）
export function getInspectData (data) {
  const url = window.DSE.baseUrl + '/pipe/InspectController/getInspectData.do'
  return $.ajax({
    type: 'POST',
    url: url,
    data: JSON.stringify(data),
    contentType: 'application/json'
  })
}

// 巡检签到
export function addSign (data) {
  const url = window.DSE.baseUrl + '/pipe/SignController/addSign.do'
  return $.ajax({
    type: 'POST',
    contentType: false,
    processData: false,
    cache: false,
    url: url,
    data: data
  })
}

// getSessionUser
export function getSessionUser () {
  const url = window.DSE.baseUrl + '/pipe/sysController/getSessionUser.do'
  return $.ajax({
    type: 'GET',
    url: url,
    xhrFields: {
      withCredentials: true
    }
  })
}

// 获取签到点
export function getSignPoint () {
  const url = process.env.NODE_ENV === 'development' ? '/static/signPoint.json' : './static/signPoint.json'
  return $.ajax({
    type: 'GET',
    url: url
  })
}

// 获取隐患信息
export function gethiddenTrouble () {
  const url = process.env.NODE_ENV === 'development' ? '/static/hiddenTrouble.json' : './static/hiddenTrouble.json'
  return $.ajax({
    type: 'GET',
    url: url
  })
}

// 获取巡检人信息
export function getInspector () {
  const url = process.env.NODE_ENV === 'development' ? '/static/inspector.json' : './static/inspector.json'
  return $.ajax({
    type: 'GET',
    url: url
  })
}
