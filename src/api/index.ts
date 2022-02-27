import Taro from '@tarojs/taro'
import store from '@/store'

enum Methods {
  POST = 'POST',
  GET = 'GET',
}

enum ContentType {
  form = 'application/x-www-form-urlencoded',
  json = 'application/json; charset=utf-8',
  multipart = 'multipart/form-data',
}

interface optionType {
  showLoading?: boolean
  checkLogin?: boolean
  clearEmpty?: boolean
}
interface paramsType {
  url: string
  data: any
  headerOption: any
  method: any
  option: optionType | undefined
}

enum HTTP_STATUS {
  SUCCESS = 200,
  CREATED = 201,
  ACCEPTED = 202,
  CLIENT_ERROR = 400,
  AUTHENTICATE = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  SERVER_ERROR = 500,
  BAD_GATEWAY = 502,
  SERVICE_UNAVAILABLE = 503,
  GATEWAY_TIMEOUT = 504,
}

let _boolToLogin = true

function toLogin() {
  const pages = Taro.getCurrentPages()
  const now = pages[pages.length - 1]
  if (now && !now.path.includes('/pages/login/') && _boolToLogin) {
    _boolToLogin = false
    store.user.clearToken()
    Taro.navigateTo({
      url: 'pages/login/index',
    })
    setTimeout(() => {
      _boolToLogin = true
    }, 1000)
  }
}
function handleEmptyData(data, bool) {
  try {
    if (bool) {
      const result = Object.assign({}, data)
      Object.keys(result).forEach(key => {
        if (result[key] === '' || result === null || result === undefined) {
          delete result[key]
        }
      })
      return result
    } else {
      return data
    }
  } catch (error) {
    return Promise.reject(error)
  }
}

const customInterceptor = chain => {
  const requestParams = chain.requestParams
  return chain
    .proceed(requestParams)
    .then(res => {
      if (res.statusCode === HTTP_STATUS.SUCCESS) {
        if (res.data.sendCode === HTTP_STATUS.SUCCESS) {
          return res.data
        } else {
          return Promise.reject(res.data.message)
        }
      } else {
        return Promise.reject(res)
      }
    })
    .catch(async err => {
      if (err.status === HTTP_STATUS.AUTHENTICATE) {
        toLogin()
      }
      if (typeof err === 'string') {
        return Promise.reject(err)
      }
      return Promise.reject(await err.text())
    })
}

Taro.addInterceptor(customInterceptor)
Taro.addInterceptor(Taro.interceptors.timeoutInterceptor)

class Server {
  public baseUrl = '/api'
  static instance: Server | null = null

  private constructor() {}

  static get Instance() {
    if (this.instance) {
      return this.instance
    }
    this.instance = new Server()
    return this.instance
  }

  private request(params: paramsType) {
    const { url, data, method, headerOption, option } = params
    const token = store.user.token
    const header: any = {
      'Content-Type': ContentType.json,
    }
    if (token) {
      header.Authorization = `Bearer ${token}`
    }
    if (headerOption) {
      Object.assign(header, headerOption)
    }
    if (option) {
      if (option.checkLogin && !token) {
        toLogin()
        return Promise.reject('未登录')
      } else if (option.showLoading) {
        Taro.showLoading({ title: '加载中' })
      }
    }
    return Taro.request({
      url: this.baseUrl + url,
      data: handleEmptyData(data, option ? option.clearEmpty : false),
      method: method,
      header,
      complete() {
        if (option && option.showLoading) {
          Taro.hideLoading()
        }
      },
    })
  }

  Get(url, data, headerOption?, option?: optionType) {
    return this.request({
      url,
      data,
      method: Methods.GET,
      headerOption,
      option,
    })
  }

  Post(url, data, headerOption?, option?: optionType) {
    return this.request({
      url,
      data,
      method: Methods.POST,
      headerOption,
      option,
    })
  }

  Form(url, data, headerOption = { 'Content-Type': ContentType.form }, option?: optionType) {
    return this.request({
      url,
      data,
      method: Methods.POST,
      headerOption,
      option,
    })
  }
}

export default Server.Instance
