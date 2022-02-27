import { FC, useState } from 'react'
import { Button, View } from '@tarojs/components'
import H5Nav from '@/components/nav-bar/h5-nav'
import ShopRadio from '@/components/shop-radio'
import Taro from '@tarojs/taro'
import { findAllAddress, updateAddress, delAddress } from '@/api/modules/address'

import styles from './index.module.scss'

const Address: FC = () => {
  const [list, setList] = useState<any[]>([])

  Taro.useDidShow(() => {
    initData()
  })

  const initData = async () => {
    const { data } = await findAllAddress()
    setList(data)
  }

  const addAddress = () => {
    Taro.navigateTo({
      url: 'pages/myAddress/index',
    })
  }

  const gotoDetail = id => {
    Taro.navigateTo({
      url: 'pages/myAddress/index?id=' + id,
    })
  }

  const changeCheck = async item => {
    await updateAddress({
      id: item.id,
      isDefault: !item.isDefault,
    })
    initData()
  }

  const delItem = async item => {
    const { confirm } = await Taro.showModal({
      content: '确认删除',
    })
    if (confirm) {
      await delAddress({
        ids: [item.id],
      })
      initData()
    }
  }

  return (
    <View className={'container'}>
      <H5Nav title="我的收货地址" />
      <View className={styles.address}>
        {list.map(item => {
          return (
            <View key={item.id} className={styles.list}>
              <View
                onClick={() => {
                  gotoDetail(item.id)
                }}
                className={styles.list_detail}
              >
                <View className={styles.top}>
                  <View className={styles.name}>{item.name}</View>
                  <View className={styles.phone}>{item.phone}</View>
                </View>
                <View className={styles.content}>{item.province + item.city + item.region + item.content}</View>
              </View>
              <View className={styles.handle}>
                <ShopRadio
                  changeCheck={() => {
                    changeCheck(item)
                  }}
                  isCheck={item.isDefault}
                  tipStyle={{ fontSize: Taro.pxTransform(30) }}
                  title="默认地址"
                />
                <View
                  onClick={() => {
                    delItem(item)
                  }}
                  className={styles.del}
                >
                  删除
                </View>
              </View>
            </View>
          )
        })}
      </View>
      <View className={styles.footer}>
        <Button onClick={addAddress} className={styles.btn} type="primary">
          添加收货地址
        </Button>
      </View>
    </View>
  )
}

export default Address
