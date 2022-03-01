import { View } from '@tarojs/components'
import { FC, useState } from 'react'
import H5Nav from '@/components/nav-bar/h5-nav'
import Taro from '@tarojs/taro'
import AddressItem from '@/components/address-item'
import { findAllAddress } from '@/api/modules/address'
import event from '@/utils/event'
import { eventBusEnum } from '@/constant'

import styles from './index.module.scss'

const TakeAddress: FC = () => {
  const [list, setList] = useState<any[]>([])

  Taro.useReady(() => {
    initData()
  })

  const initData = async () => {
    const { data } = await findAllAddress()
    setList(data)
  }

  const changeAddress = item => {
    event.trigger(eventBusEnum.swapPage, item)
    Taro.navigateBack({
      delta: 1,
    })
  }

  return (
    <View className="container">
      <H5Nav title="选择收货地址" />
      <View className={styles.address_list}>
        {list.map(item => {
          return (
            <View className={styles.list} key={item.id}>
              <AddressItem
                clickItem={() => {
                  changeAddress(item)
                }}
                addressItem={item}
              />
            </View>
          )
        })}
      </View>
    </View>
  )
}

export default TakeAddress