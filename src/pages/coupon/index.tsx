import { View } from '@tarojs/components'
import { FC, useState, useEffect } from 'react'
import { findAllTakeCoupon, createTakeCoupon } from '@/api/modules/coupon'
import H5Nav from '@/components/nav-bar/h5-nav'
import CouponItem from '@/components/coupon-item'
import Taro from '@tarojs/taro'

import styles from './index.module.scss'

const navList = [
  {
    value: 0,
    label: '未领取',
  },
  {
    value: 1,
    label: '已领取',
  },
]

const Coupon: FC = () => {
  const [typeNum, setTypeNum] = useState(0)
  const [list, setList] = useState<any[]>([])
  const [takeList, setTakeList] = useState<any[]>([])

  useEffect(() => {
    initData()
  }, [typeNum])

  const initData = async () => {
    const { data } = await findAllTakeCoupon({
      typeNum,
    })
    if (typeNum === 0) {
      setList(data)
    } else if (typeNum === 1) {
      setTakeList(data)
    }
  }

  const takeCoupon = async item => {
    try {
      await createTakeCoupon({
        level: item.member?.level,
        shopName: item.shop?.name,
        shopStoreName: item.shopStore?.name,
        shopId: item.shopId,
        shopStoreId: item.shopStoreId,
        couponId: item.id,
      })
      initData()
    } catch (error) {
      Taro.showToast({
        icon: 'none',
        title: error,
      })
    }
  }

  const changeNav = (value: number) => {
    setTypeNum(value)
  }

  return (
    <View className={'container'}>
      <H5Nav title="优惠券中心" />
      <View className={styles.nav}>
        {navList.map(item => {
          return (
            <View
              key={item.value}
              onClick={() => {
                changeNav(item.value)
              }}
              className={styles.nav_list + ' ' + (typeNum === item.value ? styles.nav_active : '')}
            >
              {item.label}
            </View>
          )
        })}
      </View>
      <View className={styles.coupon_box}>
        {typeNum === 0
          ? list.map(item => {
              return (
                <View className={styles.box} key={item.id}>
                  <CouponItem
                    clickItem={() => {
                      takeCoupon(item)
                    }}
                    couponItem={item}
                    typeNum={typeNum}
                  />
                </View>
              )
            })
          : typeNum === 1
          ? takeList.map(item => {
              return (
                <View className={styles.box} key={item.id}>
                  <CouponItem couponItem={item} typeNum={typeNum} />
                </View>
              )
            })
          : ''}
      </View>
    </View>
  )
}

export default Coupon
