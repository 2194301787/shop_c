import { FC, useEffect } from 'react'
import { Provider } from 'mobx-react'
import store from '@/store'

import './app.scss'

const App: FC = props => {
  useEffect(() => {
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
