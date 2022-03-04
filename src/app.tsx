import { FC, useEffect } from 'react'
import { Provider } from 'mobx-react'
import store from '@/store'
import Taro from '@tarojs/taro'

import './app.scss'

const App: FC = props => {
  useEffect(() => {
    Taro.getSystemInfo({
      success(res) {
        let statusH = 44
        let topH = 0
        if (res.statusBarHeight !== NaN && res.statusBarHeight !== 0) {
          topH = res.statusBarHeight
        }
        if (res.platform === 'ios') {
          statusH = 44
        } else if (res.platform === 'android') {
          statusH = 48
        }
        store.config.navH = statusH + topH
      },
    })
    const { config, user } = store
    if (!config.publicPem) {
      config.setPublicPem()
    } else {
      config.setCrypt()
    }
    if (!user.userInfo) {
      user.setUserInfo()
    }
  }, [])
  return <Provider store={store}>{props.children}</Provider>
}

export default App
