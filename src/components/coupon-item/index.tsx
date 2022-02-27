import { View, Text, Block, ITouchEvent } from '@tarojs/components'
import { FC } from 'react'
import { couponRangeEnum, couponTypeEnum } from '@/constant'
import { formartDate } from '@/utils'

import styles from './index.module.scss'

type pageStateProps = {
  couponItem: any
  typeNum: number
  clickItem?: (e: ITouchEvent) => void
}

const CouponItem: FC<pageStateProps> = props => {
  const { couponItem, typeNum, clickItem } = props

  const rangeStr = (item: any) => {
    return item.rangeType === couponRangeEnum.all
      ? '通用券'
      : item.rangeType === couponRangeEnum.store
      ? '店铺-' + couponItem.shopStore?.name
      : couponRangeEnum.shop
      ? '商品-' + couponItem.shop?.name
      : ''
  }

  return (
    <View className={styles.coupon}>
      <View className={styles.discount}>
        {couponItem.couponType === couponTypeEnum.favorable && <Text className={styles.unit}>￥</Text>}
        <Text className={styles.price}>{couponItem.discount}</Text>
        {couponItem.couponType === couponTypeEnum.discount && <Text className={styles.unit}> 折</Text>}
      </View>
      <View className={styles.detail}>
        <View className={styles.info}>
          <View className={styles.text}>名称：{couponItem.name}</View>
          <View className={styles.text}>范围：{rangeStr(couponItem)}</View>
          <View className={styles.text}>满减：{couponItem.meetCount}元</View>
          <View className={styles.text}>条件：VIP{couponItem.member?.level}</View>
          {!couponItem.isUnlimited && <View className={styles.text}>剩余：{couponItem.couponCount}张</View>}
          {!couponItem.isinfinite && (
            <Block>
              <View className={styles.text + ' ' + styles.textTime}>
                开始时间：{formartDate(couponItem.startTime, 'YYYY/MM/DD')}
              </View>
              <View className={styles.text + ' ' + styles.textTime}>
                结束时间：{formartDate(couponItem.endTime, 'YYYY/MM/DD')}
              </View>
            </Block>
          )}
        </View>
        <View onClick={clickItem} className={styles.btn}>
          {typeNum === 0 ? '领取' : typeNum === 1 ? '已领取' : '未知'}
        </View>
      </View>
    </View>
  )
}

export default CouponItem
