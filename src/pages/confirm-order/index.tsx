import { Button, View } from '@tarojs/components'
import { FC, forwardRef, useState } from 'react'
import AddressItem from '@/components/address-item'
import { inject, observer } from 'mobx-react'
import H5Nav from '@/components/nav-bar/h5-nav'
import ShopLabel from '@/components/shop-label'
import event from '@/utils/event'
import Taro from '@tarojs/taro'
import { eventBusEnum } from '@/constant'
import { defaultAddress } from '@/api/modules/address'
import CartList from '@/components/cart-list'

import styles from './index.module.scss'

type PageStateProps = {
  store: any
}

const couponObj: any = {}

const ConfirmOrder: FC<PageStateProps> = forwardRef((props, _ref) => {
  const [address, setAddress] = useState<any>(undefined)
  const [cartList, setCartList] = useState<any[]>([])
  const [realPrice, setRealPrice] = useState(0)
  const { price, num } = props.store.config.buyCartList

  const toAddress = () => {
    Taro.navigateTo({
      url: 'pages/take-address/index',
    })
  }

  Taro.useReady(() => {
    event.on(eventBusEnum.swapPage, data => {
      setAddress(data)
    })
    initData()
  })

  const initData = async () => {
    setCartList(props.store.config.buyCartList.list)
    setRealPrice(price)
    const { data } = await defaultAddress()
    if (data) {
      setAddress(data)
    }
  }

  const changeCoupon = item => {
    let str = ''
    if (couponObj[item.id]) {
      str = '?ids=' + JSON.stringify(couponObj[item.id])
    }
    Taro.navigateTo({
      url: 'pages/take-coupon/index' + str,
    })
  }

  const backPage = () => {
    event.off(eventBusEnum.swapPage)
  }

  return (
    <View className={'container'}>
      <H5Nav backHandle={backPage} title="确认订单" />
      <View onClick={toAddress} className={styles.address_box}>
        {address ? <AddressItem addressItem={address} /> : <ShopLabel text="请选择地址" />}
      </View>
      <View className={styles.card}>
        <CartList changeCoupon={changeCoupon} cardList={cartList} />
      </View>
      <View className={styles.footer}>
        <View className={styles.count}>共{num}件，</View>
        <View className={styles.price_tip}>合计:</View>
        <View
          style={{ textDecoration: realPrice !== price && realPrice !== 0 ? 'line-through ' : 'none' }}
          className={styles.price}
        >
          ￥{price.toFixed(2)}
        </View>
        {realPrice !== price && realPrice !== 0 && <View className={styles.real_price}>￥{realPrice.toFixed(2)}</View>}
        <Button type="primary" className={styles.btn}>
          提交订单
        </Button>
      </View>
    </View>
  )
})

export default inject('store')(observer(ConfirmOrder))
