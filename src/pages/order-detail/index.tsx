import { Block, Button, View, Image } from '@tarojs/components'
import { FC, useState, useRef } from 'react'
import H5Nav from '@/components/nav-bar/h5-nav'
import CartList from '@/components/cart-list'
import Taro from '@tarojs/taro'
import { findOrder, payOrder } from '@/api/modules/order'
import { formartDate } from '@/utils'
import { orderMap, orderType, eventBusEnum, filePath } from '@/constant'
import Dialog from '@/components/dialog'
import event from '@/utils/event'

import styles from './index.module.scss'

const OrderDetail: FC = () => {
  const [orderItem, setOrderItem] = useState<any>({ address: {}, shopList: [] })
  const router = Taro.useRouter()
  const maskRef = useRef<any>(null)

  Taro.useReady(() => {
    initData()
  })

  const initData = async () => {
    const { data } = await findOrder({
      id: router.params.id,
    })
    data.shopList = JSON.parse(data.shopList)
    setOrderItem(data)
  }

  const paySubmit = async () => {
    try {
      await payOrder({
        orderId: orderItem.id,
      })
      Taro.showToast({
        icon: 'none',
        title: '支付成功',
      })
      maskRef.current.close()
      event.trigger(eventBusEnum.initData)
      Taro.navigateBack({
        delta: 1,
      })
    } catch (error) {
      Taro.showToast({
        icon: 'none',
        title: error,
      })
    }
  }

  return (
    <View className="container">
      <H5Nav title="订单详情" />
      <View className={styles.order_page}>
        <View className={styles.card_box}>
          <CartList orderItem={orderItem} status={-1} cardList={orderItem.shopList} />
        </View>
        <View className={styles.order_box}>
          <View className={styles.title}>订单信息</View>
          <View className={styles.order_item}>
            <View className={styles.label}>收货信息:</View>
            <View className={styles.value}>
              {orderItem.address?.name}，{orderItem.address?.phone}，
              {orderItem.address?.province +
                ' ' +
                orderItem.address?.city +
                ' ' +
                orderItem.address?.region +
                ' ' +
                orderItem.address?.content}
            </View>
          </View>
          <View className={styles.order_item}>
            <View className={styles.label}>创建时间:</View>
            <View className={styles.value}>{formartDate(orderItem.createdAt, 'YYYY/MM/DD HH:mm:ss')}</View>
          </View>
          <View className={styles.order_item}>
            <View className={styles.label}>订单编号:</View>
            <View className={styles.value}>{orderItem.id}</View>
          </View>
          <View className={styles.order_item}>
            <View className={styles.label}>订单状态:</View>
            <View className={styles.value}>{orderMap[orderItem.status]}</View>
          </View>
          {(orderItem.status === orderType.unreceipt || orderItem.status === orderType.completed) && (
            <Block>
              <View className={styles.order_item}>
                <View className={styles.label}>配送人员:</View>
                <View className={styles.value}>
                  <Image
                    className={styles.user_bg}
                    src={process.env.fileUrl + filePath.myAvatar + '/' + orderItem.delivery.avatar}
                  />
                  <View className={styles.user_name}>{orderItem.delivery.username}</View>
                </View>
              </View>
              <View className={styles.order_item}>
                <View className={styles.label}>配送人电话:</View>
                <View className={styles.value}>{orderItem.delivery.phone}</View>
              </View>
            </Block>
          )}
        </View>
        {orderItem.status === orderType.unpaid && (
          <View className={styles.btn_box}>
            <Button
              onClick={() => {
                maskRef.current.open()
              }}
              type="primary"
            >
              立即支付
            </Button>
          </View>
        )}
      </View>
      <Dialog
        maskWidth="70%"
        title="微信支付"
        ref={maskRef}
        maskSlot={
          <View className={styles.pay_content}>
            <View className={styles.price}>￥{orderItem.realPrice?.toFixed(2)}</View>
            <Button onClick={paySubmit} className={styles.btn} type="primary">
              确定支付
            </Button>
          </View>
        }
      />
    </View>
  )
}

export default OrderDetail
