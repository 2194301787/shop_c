import { View } from '@tarojs/components'
import { FC } from 'react'
import CartList from '@/components/cart-list'
import H5Nav from '@/components/nav-bar/h5-nav'
import Taro from '@tarojs/taro'

import styles from './index.module.scss'

const DeliveryOrder: FC = () => {
  Taro.useDidShow(() => {})

  return (
    <View className="container">
      <H5Nav title="配送列表" />
    </View>
  )
}

export default DeliveryOrder
