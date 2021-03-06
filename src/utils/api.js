import Taro from '@tarojs/taro'

const BASE_PATH = 'https://www.printf520.com:8080';

function getQueryString(option) {
  const { query = {} } = option;
  if (query.toString() === '{}') {
    return '';
  }
  let queryString = '?';
  for (const key in query) {
    if (query[key]) {
      queryString += `${key}=${query[key]}&`;
    }
  }
  return queryString === '?' ? '' : queryString;
}

/*获取当前页带参数的url*/
function getCurrentPageUrlWithArgs(){
  // eslint-disable-next-line no-undef
  let pages = getCurrentPages() //获取加载的页面
  let currentPage = pages[pages.length-1] //获取当前页面的对象
  let url = currentPage.route //当前页面url
  let options = currentPage.options //如果要获取url中所带的参数可以查看options
   
  //拼接url的参数
  let urlWithArgs = url + '?'
  if (options['q']) {
    // 普通二维码链接
    let str = decodeURIComponent(options['q'])
    urlWithArgs += str.split('?')[1]
  } else {
    for(let key in options){
      if (key !== '__key_') {
        let value = options[key]
        urlWithArgs += key + '=' + value + '&'
      }
    }
    urlWithArgs = urlWithArgs.substring(0, urlWithArgs.length-1)
  }
   
  return urlWithArgs
}

export default class Api {
  static request(path, options = {}) {
    const url = `${BASE_PATH}${path}${getQueryString(options)}`;
    return new Promise(resolve => {
      Taro.showLoading({ title: '正在加载' });
      // Taro.showNavigationBarLoading()
      Taro.request({
        url: url,
        method: options.method || 'GET',
        header: options.header || {
          'Content-Type': 'application/json'
        },
        timeout: 12000,
        data: options.body
      }).then(res => {
        if (res.statusCode === 200 && res.data.code !== 9010) {
          Taro.hideLoading();
          // Taro.hideNavigationBarLoading()
          resolve(res.data);
        } else {
          // const route = encodeURIComponent(getCurrentPageUrlWithArgs());
          // // 跳转到登录页
          // Taro.redirectTo({
          //   url: `/pages/authorize/phone/index?from=${route}`
          // });
        }
      })
    })
  }
}
