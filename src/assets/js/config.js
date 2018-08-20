// 成功
export const success = 1

// 跨域开发接口
export const baseUrl = process.env.API_HOST

// 路径
export const path = ''

window.DSE = {
  baseGisUrl: 'http://10.100.3.213:8096/arcgis_js_api/library/4.7'
}

// arcgis部署方案
export const options = {
  // 相对路径部署
  // url: '/static/arcgis_js_api/library/4.8/dojo/dojo.js',
  // css: '/static/arcgis_js_api/library/4.8/esri/css/main.css'

  // 我的本机部署
  // url: 'http://localhost/arcgis/arcgis_js_v48_api/arcgis_js_api/library/4.8/dojo/dojo.js',
  // css: 'http://localhost/arcgis/arcgis_js_v48_api/arcgis_js_api/library/4.8/esri/css/main.css'

  // 开发环境
  // url: 'http://10.100.50.71:2282/arcgis_js_api/library/4.7/init.js',
  // css: 'http://10.100.50.71:2282/arcgis_js_api/library/4.7/esri/css/main.css',

  // 正式环境
  // url: 'http://sw.nxstjt.com/arcgis_js_api/library/4.7/init.js',
  // css: 'http://sw.nxstjt.com/arcgis_js_api/library/4.7/esri/css/main.css'

  // 王尚浪的配置
  /*
   * 这个请求地址经过proxyTable配置后，"http://10.100.50.129:8081/arcgis_js_api"部分会被替换成"http://10.100.3.213:8096"，
   * 浏览器实际发起的请求是"http://10.100.3.213:8096/library/4.7/init.js"，而init.js里的baseUrl改成：baseUrl:window.DSE.baseGisUrl + '/dojo'
   * 这样，init.js里加载的内容就不存在跨域了
  */
  url: 'http://10.100.50.129:8086/arcgis_js_api/library/4.7/init.js',
  css: 'http://10.100.50.129:8086/arcgis_js_api/library/4.7/esri/css/main.css'
}
