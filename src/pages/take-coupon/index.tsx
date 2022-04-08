import { View } from '@tarojs/components'
import { FC, useState, forwardRef } from 'react'
import H5Nav from '@/components/nav-bar/h5-nav'
import Taro from '@tarojs/taro'
import { findAllTakeCoupon } from '@/api/modules/coupon'
import CouponItem from '@/components/coupon-item'
import { inject, observer } from 'mobx-react'
import event from '@/utils/event'
import { eventBusEnum } from '@/constant'

import styles from './index.module.scss'

type PageStateProps = {
  store: {
    config: {
      pageParams: {
        shopId: number
        shopStoreId: number
        sids: number[]
        max: number
        ids: number[]
        price: number
      }
    }
  }
}

const TakeCoupon: FC<PageStateProps> = forwardRef((props, _ref) => {
  const [list, setList] = useState<any[]>([])
  let { shopId, shopStoreId, sids, max, ids } = props.store.config.pageParams
  if (ids) {
    ids = ids.map(item => item)
  } else {
    ids = []
  }

  Taro.useDidShow(() => {
    initData()
  })

  const initData = async () => {
    const { data } = await findAllTakeCoupon({
      typeNum: 2,
      shopId,
      shopStoreId,
    })
    setList(() => {
      return data.map((item: any) => {
        item._isCheck = ids.includes(item.couponId)
        return item
      })
    })
  }

  const selectCoupon = (index: number) => {
    if (sids.includes(list[index].couponId) && !list[index]._isCheck) {
      Taro.showToast({
        icon: 'none',
        title: '该优惠券已选择',
      })
      return
    }
    if (list[index].couponId.startTime && new Date() < list[index].couponId.startTime) {
      Taro.showToast({
        icon: 'none',
        title: '该优惠券活动时间还未开始',
      })
      return
    }
    if (list[index].meetCount > 0 && list[index].meetCount > props.store.config.pageParams.price) {
      Taro.showToast({
        icon: 'none',
        title: `该商品需要达到${list[index].meetCount}元才能使用`,
      })
      return
    }
    setList(val => {
      const result: any[] = Object.assign([], val)
      const bool = !result[index]._isCheck
      if (bool) {
        const len = result.filter(item => {
          return item._isCheck
        }).length
        if (len >= max) {
          Taro.showToast({
            icon: 'none',
            title: '每个商品只能选一张优惠券',
          })
          return val
        }
      }
      result[index]._isCheck = bool
      return result
    })
  }
  const backHandle = () => {
    const result: any[] = []
    list.forEach(item => {
      if (item._isCheck) {
        const i = {
          ...item,
        }
        delete i._isCheck
        result.push(i)
      }
    })
    event.trigger(eventBusEnum.swapPage, 'coupon', {
      shopId,
      list: result,
    })
  }

  const toCoupon = () => {
    Taro.navigateTo({
      url: 'pages/coupon/index',
    })
  }

  return (
    <View className="container">
      <H5Nav backHandle={backHandle} title="选择优惠券" />
      <View className={styles.coupon}>
        {list.length > 0 ? (
          list.map((item, index) => {
            return (
              <View className={styles.list} key={item.id}>
                <CouponItem
                  clickItem={() => {
                    selectCoupon(index)
                  }}
                  couponItem={item}
                  typeNum={2}
                />
              </View>
            )
          })
        ) : (
          <View onClick={toCoupon} className={styles.to_coupon}>
            点击前往优惠券中心领取
          </View>
        )}
      </View>
    </View>
  )
})

export default inject('store')(observer(TakeCoupon))
