import { ScrollView, View } from '@tarojs/components'
import { FC, useState, useRef, useEffect, forwardRef } from 'react'
import H5Nav from '@/components/nav-bar/h5-nav'
import CartList from '@/components/cart-list'
import Taro from '@tarojs/taro'
import { findAllOrder } from '@/api/modules/order'
import { orderList as orderListEnum } from '@/constant'
import { inject, observer } from 'mobx-react'

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

const OrderList: FC<PageStateProps> = forwardRef((props, _ref) => {
  const [orderList, setOrderList] = useState<any[]>([])
  const [isLoading, setIsloading] = useState(false)
  const [status, setStatus] = useState<number>(-1)
  const router = Taro.useRouter()
  const pageInfo = useRef<PageInfo>(defaultPageInfo())

  Taro.useReady(() => {
    const state = router.params.status ? Number(router.params.status) : 0
    setStatus(state)
  })

  useEffect(() => {
    if (status !== -1) {
      initData(true)
    }
  }, [status])

  const initData = async (clear = false) => {
    try {
      if (clear) {
        pageInfo.current = defaultPageInfo()
      }
      if (pageInfo.current.isMore) {
        setIsloading(true)
        const { data, total } = (await findAllOrder({
          status,
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
      <H5Nav title="订单列表" />
      <View className={styles.nav}>
        <View
          onClick={() => {
            setStatus(0)
          }}
          className={styles.nav_list + ' ' + (status === 0 ? styles.active_nav : '')}
        >
          全部
        </View>
        {orderListEnum.map(item => {
          return (
            <View
              key={item.value}
              onClick={() => {
                setStatus(item.value)
              }}
              className={styles.nav_list + ' ' + (item.value === status ? styles.active_nav : '')}
            >
              {item.label}
            </View>
          )
        })}
      </View>
      <ScrollView
        style={{ height: `calc(100% - ${props.store.config.navH}px - ${Taro.pxTransform(84)})` }}
        onScrollToLower={onScrollToLower}
        className={styles.order_box}
        scrollY
      >
        {orderList.map(item => {
          return (
            <View key={item.id} className={styles.order_list}>
              <CartList orderItem={item} status={status} cardList={item.shopList} />
            </View>
          )
        })}
        {isLoading && <View className="shop_loading">加载中...</View>}
      </ScrollView>
    </View>
  )
})

export default inject('store')(observer(OrderList))
