import { Button, View } from '@tarojs/components'
import { FC, forwardRef, useState, useEffect, useRef } from 'react'
import AddressItem from '@/components/address-item'
import { inject, observer } from 'mobx-react'
import H5Nav from '@/components/nav-bar/h5-nav'
import ShopLabel from '@/components/shop-label'
import event from '@/utils/event'
import Taro from '@tarojs/taro'
import { eventBusEnum, couponTypeEnum } from '@/constant'
import { defaultAddress } from '@/api/modules/address'
import CartList from '@/components/cart-list'
import { toFiexd, isEmpty } from '@/utils'
import Dialog from '@/components/dialog'
import { createOrder, payOrder } from '@/api/modules/order'

import styles from './index.module.scss'

type PageStateProps = {
  store: {
    config: {
      buyCartList: any
      setPageParams: (obj: any) => void
      clearCartList: () => void
    }
  }
}

const ConfirmOrder: FC<PageStateProps> = forwardRef((props, _ref) => {
  const [address, setAddress] = useState<any>(undefined)
  const [cartList, setCartList] = useState<any[]>([])
  const [realPrice, setRealPrice] = useState(0)
  const { price, num } = props.store.config.buyCartList
  const maskRef = useRef<any>(null)
  const couponObj = useRef<any>({})
  const buyNow = useRef<Date>(new Date())
  const orderId = useRef<number | undefined>(undefined)

  useEffect(() => {
    countRealPrice()
  }, [cartList])

  const submitCreate = async () => {
    if (isEmpty(address)) {
      Taro.showToast({
        icon: 'none',
        title: '请选择地址',
      })
      return
    }
    try {
      const { data } = await createOrder({
        shopList: cartList,
        addressId: address.id,
        price,
        realPrice,
        buyNow: buyNow.current,
        buyCount: num,
      })
      orderId.current = data
      maskRef.current.open()
    } catch (error) {
      Taro.showToast({
        icon: 'none',
        title: error,
      })
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
      backPage()
      maskRef.current.close()
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

  const countRealPrice = () => {
    let count = 0
    cartList.forEach(item => {
      item.shopList.forEach(citem => {
        if (citem.realPrice) {
          count += citem.realPrice
        } else {
          count += citem.price * citem.cardBuyCount
        }
      })
    })
    setRealPrice(toFiexd(count))
  }

  const toAddress = () => {
    Taro.navigateTo({
      url: 'pages/take-address/index',
    })
  }

  Taro.useReady(() => {
    event.on(eventBusEnum.swapPage, (type, data) => {
      if (type === 'address') {
        setAddress(data)
      } else if (type === 'coupon') {
        const some = data.list.some(item => {
          return Object.keys(couponObj.current).some(citem => {
            return Number(citem) !== Number(data.shopId) && couponObj.current[citem].includes(item.couponId)
          })
        })
        if (some) {
          setTimeout(() => {
            Taro.showToast({
              icon: 'none',
              title: '选择的优惠券有重复使用，请重新选择',
            })
          }, 200)
          return
        }
        couponObj.current[data.shopId] = data.list.map(item => item.couponId)
        setCartList(val => {
          const result: any[] = Object.assign([], val)
          result.forEach(item => {
            item.shopList.forEach(citem => {
              if (citem.id === data.shopId) {
                citem.couponList = data.list
                citem.realPrice = countPrice(citem, data.list, citem.cardBuyCount)
              }
            })
          })
          return result
        })
      }
    })
    initData()
  })

  const countPrice = (shopItem: any, couponList: any[], num: number): number => {
    let count = 0
    for (let i = 0; i < num; i++) {
      const item = couponList[i]
      if (item) {
        if (item.couponType === couponTypeEnum.discount) {
          count += toFiexd((shopItem.price * item.discount) / 10)
        } else {
          count += shopItem.price - item.discount <= 0 ? 0.01 : shopItem.price - item.discount
        }
      } else {
        count += shopItem.price
      }
    }
    return toFiexd(count)
  }

  const initData = async () => {
    setCartList(
      props.store.config.buyCartList.list.map(item => {
        const shopList = item.shopList.map(citem => {
          return {
            ...citem,
            couponList: [],
          }
        })
        return {
          ...item,
          shopList,
        }
      })
    )
    setRealPrice(price)
    const { data } = await defaultAddress()
    if (data) {
      setAddress(data)
    }
  }

  const changeCoupon = (storeId, item) => {
    const couponIds: any[] = []
    Object.keys(couponObj.current).forEach(keys => {
      if (Number(item.id) !== Number(keys)) {
        couponIds.push(...couponObj.current[keys])
      }
    })
    const obj: any = {
      shopId: item.id,
      shopStoreId: storeId,
      sids: couponIds,
      max: item.cardBuyCount,
      price: item.price,
    }
    if (couponObj.current[item.id]) {
      obj.ids = couponObj.current[item.id]
    }
    props.store.config.setPageParams(obj)
    Taro.navigateTo({
      url: 'pages/take-coupon/index',
    })
  }

  const backPage = () => {
    props.store.config.setPageParams({})
    props.store.config.clearCartList()
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
        {realPrice !== price && realPrice !== 0 && <View className={styles.real_price}>{realPrice.toFixed(2)}</View>}
        <Button onClick={submitCreate} type="primary" className={styles.btn}>
          提交订单
        </Button>
      </View>
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

export default inject('store')(observer(ConfirmOrder))
