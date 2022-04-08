import { View, Button } from '@tarojs/components'
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

  Taro.useDidShow(() => {
    initData()
  })

  const initData = async () => {
    const { data } = await findAllAddress()
    setList(data)
  }

  const changeAddress = item => {
    event.trigger(eventBusEnum.swapPage, 'address', item)
    Taro.navigateBack({
      delta: 1,
    })
  }

  const addAdress = () => {
    Taro.navigateTo({
      url: 'pages/my-address/index',
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
      <View className={styles.footer}>
        <Button onClick={addAdress} className={styles.btn} type="primary">
          添加收货地址
        </Button>
      </View>
    </View>
  )
}

export default TakeAddress
