import { FC, forwardRef } from 'react'
import { View, Image, Block } from '@tarojs/components'
import { inject, observer } from 'mobx-react'
import { filePath, orderType, orderList, authorityEnum } from '@/constant'
import Taro from '@tarojs/taro'

import handleIcon from '@/assets/images/handle.png'
import rightIcon from '@/assets/images/right.png'
import unpaidIcon from '@/assets/images/unpaid.png'
import unshipIcon from '@/assets/images/unship.png'
import unreceiptIcon from '@/assets/images/unreceipt.png'
import completedIcon from '@/assets/images/completed.png'
// import reimburseIcon from '@/assets/images/reimburse.png'
import couponIcon from '@/assets/images/coupon.png'
import deliveryIcon from '@/assets/images/delivery.png'

import styles from './index.module.scss'

type PageStateProps = {
  store: any
}

const orderIconList = {
  [orderType.unpaid]: unpaidIcon,
  [orderType.unship]: unshipIcon,
  [orderType.unreceipt]: unreceiptIcon,
  [orderType.completed]: completedIcon,
  // [orderType.reimburse]: reimburseIcon,
}

const Index: FC<PageStateProps> = forwardRef((props, _ref) => {
  const {
    store: {
      user: { userInfo },
    },
  } = props

  Taro.useDidShow(() => {
    props.store.user.setUserInfo()
  })

  const goLogin = () => {
    Taro.navigateTo({
      url: 'pages/login/index',
    })
  }

  const goSetting = () => {
    Taro.navigateTo({
      url: 'pages/setting/index',
    })
  }

  const gotoCoupon = () => {
    Taro.navigateTo({
      url: 'pages/coupon/index',
    })
  }

  const goOrder = (status: number | string = '') => {
    Taro.navigateTo({
      url: 'pages/order-list/index?status=' + status,
    })
  }

  const gotoDelivery = () => {
    Taro.navigateTo({
      url: 'pages/delivery-order/index',
    })
  }

  return (
    <View className={'container ' + styles.page}>
      <View className={styles.user_box}>
        {userInfo ? (
          <View className={styles.user}>
            <View className={styles.user_avatar}>
              <Image src={process.env.fileUrl + filePath.myAvatar + '/' + userInfo.avatar}></Image>
            </View>
            <View className={styles.user_info}>
              <View className={styles.name}>{userInfo.username}</View>
              <View className={styles.level}>{userInfo.memberId ? 'VIP' + userInfo.member?.level : '非会员'}</View>
            </View>
          </View>
        ) : (
          <View onClick={goLogin} className={styles.login_text}>
            未登录👆
          </View>
        )}
        {userInfo && (
          <View className={styles.handle}>
            <Image onClick={goSetting} src={handleIcon}></Image>
          </View>
        )}
      </View>
      {userInfo && (
        <Block>
          <View className={styles.order}>
            <View className={styles.order_inner}>
              <View
                onClick={() => {
                  goOrder()
                }}
                className={styles.header}
              >
                <View className={styles.title}>我的订单</View>
                <View className={styles.nav}>
                  <View className={styles.text}>全部</View>
                  <View className={styles.icon}>
                    <Image className={styles.icon_img} src={rightIcon} />
                  </View>
                </View>
              </View>
              <View className={styles.list}>
                {orderList.map(item => {
                  return (
                    <View
                      onClick={() => {
                        goOrder(item.value)
                      }}
                      key={item.value}
                      className={styles.list_render}
                    >
                      <View className={styles.list_icon}>
                        <Image className={styles.icon_img} src={orderIconList[item.value]} />
                      </View>
                      <View className={styles.text}>{item.label}</View>
                    </View>
                  )
                })}
              </View>
            </View>
          </View>
          <View className={styles.activity}>
            <View className={styles.activity_inner}>
              <View onClick={gotoCoupon} className={styles.list}>
                <View className={styles.icon}>
                  <Image className={styles.icon_img} src={couponIcon} />
                </View>
                <View className={styles.text}>优惠券中心</View>
              </View>
              {userInfo.permissionId === authorityEnum.delivery && (
                <View onClick={gotoDelivery} className={styles.list}>
                  <View className={styles.icon}>
                    <Image className={styles.icon_img} src={deliveryIcon} />
                  </View>
                  <View className={styles.text}>配送中心</View>
                </View>
              )}
            </View>
          </View>
        </Block>
      )}
    </View>
  )
})

export default inject('store')(observer(Index))
