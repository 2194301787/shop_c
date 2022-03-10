import { observable } from 'mobx'
import { getUserInfo, loginV3 } from '@/api/modules/user'
import Taro from '@tarojs/taro'
import { findAllMember } from '@/api/modules/user'

const user = observable({
  token: Taro.getStorageSync('token'),
  userInfo: undefined,
  memberList: [],
  async getMember() {
    if (this.memberList.length > 0) {
      return this.memberList
    } else {
      const { data } = await findAllMember()
      this.memberList = data
      return this.memberList
    }
  },
  async setUserInfo() {
    const res = (await getUserInfo()) as any
    this.userInfo = res?.data
    return this.userInfo
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
