import { ScrollView, View, Button } from '@tarojs/components'
import { FC, useState, useRef, useEffect, forwardRef } from 'react'
import H5Nav from '@/components/nav-bar/h5-nav'
import CartList from '@/components/cart-list'
import Taro from '@tarojs/taro'
import { findAllOrder, delOrder, payOrder } from '@/api/modules/order'
import { orderList as orderListEnum, eventBusEnum } from '@/constant'
import { inject, observer } from 'mobx-react'
import Dialog from '@/components/dialog'
import event from '@/utils/event'

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

let cacheState = -1

const OrderList: FC<PageStateProps> = forwardRef((props, _ref) => {
  const [orderList, setOrderList] = useState<any[]>([])
  const [isLoading, setIsloading] = useState(false)
  const [status, setStatus] = useState<number>(-1)
  const router = Taro.useRouter()
  const pageInfo = useRef<PageInfo>(defaultPageInfo())
  const maskRef = useRef<any>(null)
  const [realPrice, setRealPrice] = useState(0)
  const orderId = useRef<number | undefined>(undefined)

  Taro.useReady(() => {
    const state = router.params.status ? Number(router.params.status) : 0
    cacheState = state
    setStatus(state)
    event.on(eventBusEnum.initData, () => {
      setStatus(cacheState)
      initData(true, cacheState)
    })
  })

  useEffect(() => {
    if (status !== -1) {
      cacheState = status
      initData(true)
    }
  }, [status])

  const initData = async (clear = false, takeStatus?) => {
    try {
      if (clear) {
        pageInfo.current = defaultPageInfo()
      }
      if (pageInfo.current.isMore) {
        setIsloading(true)
        const { data, total } = (await findAllOrder({
          status: takeStatus || status,
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

  const orderHandle = (val, item) => {
    switch (val) {
      case '订单详情':
        Taro.navigateTo({
          url: 'pages/order-detail/index?id=' + item.id,
        })
        break
      case '删除订单':
        deleteOrder(item.id)
        break
      case '立即支付':
        setRealPrice(item.realPrice)
        orderId.current = item.id
        maskRef.current.open()
        break
      default:
        break
    }
  }

  const paySubmit = async () => {
    try {
      await payOrder({
        orderId: orderId.current,
      })
      Taro.showToast({
        icon: 'none',
        title: '支付成功',
      })
      maskRef.current.close()
      initData(true)
    } catch (error) {
      Taro.showToast({
        icon: 'none',
        title: error,
      })
    }
  }

  const deleteOrder = async id => {
    const { confirm } = await Taro.showModal({
      content: '是否该订单删除',
    })
    if (confirm) {
      await delOrder({
        ids: [id],
      })
      initData(true)
    }
  }

  const backHandle = () => {
    event.off(eventBusEnum.initData)
  }

  const onScrollToLower = () => {
    initData()
  }
  return (
    <View className="container">
      <H5Nav backHandle={backHandle} title="订单列表" />
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
              <CartList
                orderHandle={val => {
                  orderHandle(val, item)
                }}
                orderItem={item}
                status={status}
                cardList={item.shopList}
              />
            </View>
          )
        })}
        {isLoading && <View className="shop_loading">加载中...</View>}
      </ScrollView>
      <Dialog
        maskWidth="70%"
        title="微信支付"
        ref={maskRef}
        maskSlot={
          <View className={styles.pay_content}>
            <View className={styles.price}>￥{realPrice.toFixed(2)}</View>
            <Button onClick={paySubmit} className={styles.btn} type="primary">
              确定支付
            </Button>
          </View>
        }
      />
    </View>
  )
})

export default inject('store')(observer(OrderList))
