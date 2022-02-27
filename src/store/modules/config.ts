import { observable } from 'mobx'
import { getPublicPem } from '@/api/modules/config'
import JSEncrypt from 'jsencrypt'
import Taro from '@tarojs/taro'

const config = observable({
  publicPem: Taro.getStorageSync('getPublicPem'),
  crypt: new JSEncrypt(),

  async setPublicPem() {
    const { data } = (await getPublicPem()) as any
    this.publicPem = data
    Taro.setStorageSync('getPublicPem', data)
    this.crypt.setPublicKey(data)
  },
  setCrypt() {
    this.crypt.setPublicKey(this.publicPem)
  },
  getDecrypt(str) {
    return this.crypt.decrypt(str)
  },
  getEncrypt(str) {
    return this.crypt.encrypt(str)
  },
})

export default config
