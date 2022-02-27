import { observable } from 'mobx'
import { getUserInfo, loginV3 } from '@/api/modules/user'
import Taro from '@tarojs/taro'

const user = observable({
  token: Taro.getStorageSync('token'),
  userInfo: undefined,
  async setUserInfo() {
    const res = (await getUserInfo()) as any
    this.userInfo = res?.data
  },
  clearToken() {
    this.token = undefined
    this.userInfo = undefined
    Taro.removeStorageSync('token')
  },
  async setLogin(userData) {
    try {
      const res = (await loginV3(userData)) as any
      this.userInfo = res.data
      this.token = res.token
      Taro.setStorageSync('token', res.token)
      return res
    } catch (error) {
      return Promise.reject(error)
    }
  },
})

export default user
