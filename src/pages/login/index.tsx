import { FC, forwardRef } from 'react'
import { View, Form, Input, Button } from '@tarojs/components'
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

  const reflash = () => {
    const some = Object.keys(event.callbacks).some(item => {
      return item === eventBusEnum.initData
    })
    if (some) {
      event.trigger(eventBusEnum.initData)
    }
  }

  Taro.useReady(() => {
    pages.forEach(item => {
      if (item.path.includes('pages/cart/index')) {
        reflash()
      }
    })
  })

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
      <H5Nav title="登录" />
      <View className={styles.login}>
        <Form onSubmit={submit}>
          <View className={styles.login_input}>
            <Input name="username" placeholder="请输入用户名或手机号" />
          </View>
          <View className={styles.login_input}>
            <Input name="password" placeholder="请输入密码" />
          </View>
          <Button className={styles.btn} type="primary" formType="submit">
            登录
          </Button>
        </Form>
      </View>
    </View>
  )
})

export default inject('store')(observer(Index))
