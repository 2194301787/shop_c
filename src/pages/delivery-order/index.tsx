import { View, ScrollView } from '@tarojs/components'
import { FC, useState, forwardRef, useRef, useEffect } from 'react'
import CartList from '@/components/cart-list'
import H5Nav from '@/components/nav-bar/h5-nav'
import Taro from '@tarojs/taro'
import { inject, observer } from 'mobx-react'
import { orderType } from '@/constant'
import { findAllDelivery, createDelivery, completeDelivery } from '@/api/modules/order'

import styles from './index.module.scss'

interface PageInfo {
  pageIndex: number
  pageSize: number
  total: number
  isMore: boolean
}

const defaultPageInfo = (): PageInfo => {
  return {
    pageIndex: 1,
    pageSize: 10,
    total: 0,
    isMore: true,
  }
}

type PageStateProps = {
  store: {
    config: {
      navH: number
    }
  }
}

const navList = [
  {
    value: orderType.unship,
    label: '待配送',
  },
  {
    value: orderType.unreceipt,
    label: '配送中',
  },
  {
    value: orderType.completed,
    label: '已完成',
  },
]

const DeliveryOrder: FC<PageStateProps> = forwardRef((props, _ref) => {
  const [orderList, setOrderList] = useState<any[]>([])
  const [state, setState] = useState(orderType.unship)
  const [isLoading, setIsloading] = useState(false)
  const pageInfo = useRef<PageInfo>(defaultPageInfo())

  useEffect(() => {
    initData(true)
  }, [state])

  const orderDelivery = async (id, type) => {
    try {
      if (type === orderType.unship) {
        await createDelivery({
          id,
        })
      } else if (type === orderType.unreceipt) {
        await completeDelivery({
          id,
        })
      }
      initData(true)
    } catch (error) {
      Taro.showToast({
        icon: 'none',
        title: error,
      })
    }
  }

  const initData = async (clear = false) => {
    try {
      if (clear) {
        pageInfo.current = defaultPageInfo()
      }
      if (pageInfo.current.isMore) {
        setIsloading(true)
        const { data, total } = (await findAllDelivery({
          state,
          pageIndex: pageInfo.current.pageIndex,
          pageSize: pageInfo.current.pageSize,
        })) as any
        if (total > orderList.length || clear) {
          pageInfo.current.pageIndex++
          pageInfo.current.total = total
          data.forEach(item => {
            item.shopList = JSON.parse(item.shopList)
          })
          if (clear) {
            setOrderList(data)
          } else {
            setOrderList(orderList.concat(data))
          }
        } else {
          pageInfo.current.isMore = false
        }
      }
    } finally {
      setIsloading(false)
    }
  }

  const onScrollToLower = () => {
    initData()
  }

  return (
    <View className="container">
      <H5Nav title="配送列表" />
      <View className={styles.order_nav}>
        {navList.map(item => {
          return (
            <View
              key={item.value}
              onClick={() => {
                setState(item.value)
              }}
              className={styles.text + ' ' + (state === item.value ? styles.active_text : '')}
            >
              {item.label}
            </View>
          )
        })}
      </View>
      <ScrollView
        style={{ height: `calc(100% - ${props.store.config.navH}px - ${Taro.pxTransform(88)})` }}
        onScrollToLower={onScrollToLower}
        className={styles.order_box}
        scrollY
      >
        {orderList.map(item => {
          return (
            <View key={item.id} className={styles.order_list}>
              <CartList
                orderDelivery={type => {
                  orderDelivery(item.id, type)
                }}
                addressItem={item.address}
                state={item.status}
                status={-2}
                orderItem={item}
                cardList={item.shopList}
              />
            </View>
          )
        })}
        {isLoading && <View className="shop_loading">加载中...</View>}
      </ScrollView>
    </View>
  )
})

export default inject('store')(observer(DeliveryOrder))
