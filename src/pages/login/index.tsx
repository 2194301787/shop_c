import { FC, forwardRef, useState } from 'react'
import { View, Form, Input, Button, InputProps } from '@tarojs/components'
import H5Nav from '@/components/nav-bar/h5-nav'
import { inject, observer } from 'mobx-react'
import Taro from '@tarojs/taro'
import event from '@/utils/event'
import { eventBusEnum } from '@/constant'

import styles from './index.module.scss'

type PageStateProps = {
  store: any
}

const Index: FC<PageStateProps> = forwardRef((props, _ref) => {
  const pages = Taro.getCurrentPages()
  const [userInfo, setUserInfo] = useState({
    username: '',
    password: '',
  })

  const reflash = () => {
    const some = Object.keys(event.callbacks).some(item => {
      return item === eventBusEnum.cartInit
    })
    if (some) {
      event.trigger(eventBusEnum.cartInit)
    }
  }

  Taro.useReady(() => {
    event.on(eventBusEnum.swapPage, user => {
      setUserInfo({
        username: user.username,
        password: user.password,
      })
    })
    pages.forEach(item => {
      if (item.path.includes('pages/cart/index')) {
        reflash()
      }
    })
  })

  const backHandle = () => {
    event.off(eventBusEnum.swapPage)
  }

  const Register = () => {
    Taro.navigateTo({
      url: 'pages/register/index',
    })
  }

  const submit = async e => {
    try {
      const username = e.detail.value.username
      const password = e.detail.value.password
      if (username && password) {
        await props.store.user.setLogin({
          username,
          password: props.store.config.getEncrypt(password),
        })
        Taro.navigateBack({
          delta: 1,
        })
      } else {
        Taro.showToast({
          icon: 'none',
          title: '请输入完整',
        })
      }
    } catch (error) {
      Taro.showToast({
        icon: 'none',
        title: error,
      })
    }
  }
  return (
    <View className={'container ' + styles.page}>
      <H5Nav backHandle={backHandle} title="登录" />
      <View className={styles.login}>
        <Form onSubmit={submit}>
          <View className={styles.login_input}>
            <Input value={userInfo.username} name="username" placeholder="请输入用户名或手机号" />
          </View>
          <View className={styles.login_input}>
            <Input
              value={userInfo.password}
              type={'password' as unknown as undefined}
              name="password"
              placeholder="请输入密码"
            />
          </View>
          <Button className={styles.btn} type="primary" formType="submit">
            登录
          </Button>
          <Button onClick={Register} type="warn" className={styles.btn}>
            注册
          </Button>
        </Form>
      </View>
    </View>
  )
})

export default inject('store')(observer(Index))
