import { View, Image, Block, Button } from '@tarojs/components'
import { FC } from 'react'
import { filePath } from '@/constant'
import { toFiexd } from '@/utils'
import { couponTypeEnum, orderType } from '@/constant'

import styles from './index.module.scss'

type PageStateProps = {
  cardList?: any[]
  changeCoupon?: (id: string | number, item: any) => void
  status?: number
  orderItem?: any
  orderHandle?: (val: string) => void
  state?: number
  orderDelivery?: (type: number) => void
  addressItem?: any
}

const CartList: FC<PageStateProps> = props => {
  const { cardList, changeCoupon, status, orderItem, orderHandle, state, orderDelivery, addressItem } = props

  const selectCoupon = (e, shopStoreId, item) => {
    e.stopPropagation()
    changeCoupon && changeCoupon(shopStoreId, item)
  }

  const orderPage = val => {
    orderHandle && orderHandle(val)
  }

  const delivery = (type: number) => {
    orderDelivery && orderDelivery(type)
  }

  return (
    <View className={styles.card_box}>
      {cardList &&
        cardList.map(item => {
          return (
            <View key={'store' + item.id} className={styles.card_list}>
              <View className={styles.store}>
                <Image
                  className={styles.bg}
                  mode="aspectFill"
                  src={process.env.fileUrl + filePath.shopStore + '/' + item.avatar}
                />
                <View className={styles.name}>{item.name}</View>
              </View>
              <View className={styles.shop_box}>
                {item.shopList.map(citem => {
                  return (
                    <View key={'shop' + citem.id} className={styles.shop}>
                      <Image
                        className={styles.bg}
                        mode="aspectFill"
                        src={process.env.fileUrl + filePath.shop + '/' + citem.avatar}
                      />
                      <View className={styles.shop_content}>
                        <View className={styles.name}>{citem.name}</View>
                        {status !== -2 && citem.couponList && citem.couponList.length > 0 ? (
                          <View
                            onClick={e => {
                              selectCoupon(e, item.id, citem)
                            }}
                            className={styles.coupon_name}
                          >
                            ????????????{citem.couponList.map(c => c.name).join(',')}
                          </View>
                        ) : (
                          status === undefined && (
                            <View
                              onClick={e => {
                                selectCoupon(e, item.id, citem)
                              }}
                              className={styles.tip}
                            >
                              ?????????????????????
                            </View>
                          )
                        )}
                      </View>
                      <View className={styles.shop_tip}>
                        {status !== -2 && <View className={styles.price}>???{toFiexd(citem.price).toFixed(2)}</View>}
                        <View className={styles.count}>x{citem.cardBuyCount}</View>
                        {citem.couponList && citem.couponList.length > 0 && status !== -2
                          ? citem.couponList.map(couponItem => {
                              return (
                                <View key={'coupon' + couponItem.id} className={styles.discount}>
                                  {couponItem.couponType === couponTypeEnum.discount
                                    ? `${couponItem.discount}???`
                                    : `-???${couponItem.discount.toFixed(2)}`}
                                </View>
                              )
                            })
                          : ''}
                      </View>
                    </View>
                  )
                })}
              </View>
              {!isNaN(Number(status)) && status !== -2 && orderItem && (
                <Block>
                  <View className={styles.order_box}>
                    <View
                      className={
                        styles.price_box + ' ' + (orderItem.price !== orderItem.realPrice ? styles.un_price : '')
                      }
                    >
                      {orderItem.price === orderItem.realPrice ? '?????????' : '??????'}???{orderItem.price.toFixed(2)}
                    </View>
                    {orderItem.price !== orderItem.realPrice && (
                      <View className={styles.real}>????????????{orderItem.realPrice.toFixed(2)}</View>
                    )}
                  </View>
                  {status !== -1 && (
                    <View className={styles.order_btn}>
                      <Button
                        onClick={() => {
                          orderPage('????????????')
                        }}
                        plain
                        className={styles.btn}
                      >
                        ????????????
                      </Button>
                      <Button
                        onClick={() => {
                          orderPage('????????????')
                        }}
                        plain
                        className={styles.btn}
                      >
                        ????????????
                      </Button>
                      {orderItem.status === orderType.unpaid && (
                        <Button
                          onClick={() => {
                            orderPage('????????????')
                          }}
                          plain
                          type="primary"
                          className={styles.btn}
                        >
                          ????????????
                        </Button>
                      )}
                    </View>
                  )}
                </Block>
              )}
              {status === -2 && addressItem && (
                <View className={styles.address}>
                  ???????????????
                  {addressItem.name +
                    ',' +
                    addressItem.phone +
                    ' ' +
                    addressItem.province +
                    addressItem.city +
                    addressItem.region +
                    addressItem.content}
                </View>
              )}
              {status === -2 && (
                <View className={styles.order_btn}>
                  {state === orderType.unship && (
                    <Button
                      onClick={() => {
                        delivery(orderType.unship)
                      }}
                      plain
                      className={styles.btn}
                    >
                      ????????????
                    </Button>
                  )}
                  {state === orderType.unreceipt && (
                    <Button
                      onClick={() => {
                        delivery(orderType.unreceipt)
                      }}
                      plain
                      className={styles.btn}
                    >
                      ????????????
                    </Button>
                  )}
                </View>
              )}
            </View>
          )
        })}
    </View>
  )
}

export default CartList
