import { View, Image } from '@tarojs/components'
import { FC } from 'react'
import { filePath } from '@/constant'
import { toFiexd } from '@/utils'

import styles from './index.module.scss'

type PageStateProps = {
  cardList?: any[]
  changeCoupon?: (item: any) => void
}

const CartList: FC<PageStateProps> = props => {
  const { cardList, changeCoupon } = props

  const selectCoupon = (e, item) => {
    e.stopPropagation()
    changeCoupon && changeCoupon(item)
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
                        {citem.couponList && citem.couponList.length > 0 ? (
                          <View className={styles.coupon_name}></View>
                        ) : (
                          <View
                            onClick={e => {
                              selectCoupon(e, citem)
                            }}
                            className={styles.tip}
                          >
                            点击选择优惠券
                          </View>
                        )}
                      </View>
                      <View className={styles.shop_tip}>
                        <View className={styles.price}>￥{toFiexd(citem.price).toFixed(2)}</View>
                        <View className={styles.count}>x{citem.cardBuyCount}</View>
                      </View>
                    </View>
                  )
                })}
              </View>
            </View>
          )
        })}
    </View>
  )
}

export default CartList