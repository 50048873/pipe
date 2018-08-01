import $ from 'jquery'
import {baseUrl} from '@/assets/js/config'

// 巡检 -> 上传
export function getReservoirDetailInspectionAdd (data) {
  // data.forEach((item, key) => {
  //   console.log(key, ': ', item)
  // })
  return $.ajax({
    type: 'POST',
    contentType: false,
    processData: false,
    cache: false,
    url: baseUrl + '/znb/patrolRecord/addRecord.do',
    data: data
  })
}
