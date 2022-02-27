import { FC, forwardRef } from 'react'
import { View, Image, Block, Button } from '@tarojs/components'
import H5Nav from '@/components/nav-bar/h5-nav'
import ShopLabel from '@/components/shop-label'
import { inject, observer } from 'mobx-react'
import { filePath } from '@/constant'
import { logout as logoutApi } from '@/api/modules/user'
import Taro from '@tarojs/taro'

import styles from './index.module.scss'

type PageStateProps = {
  store: any
}

const Setting: FC<PageStateProps> = forwardRef((props, _ref) => {
  const {
    store: {
      user: { userInfo },
    },
  } = props

  const logout = async () => {
    await logoutApi()
    props.store.user.clearToken()
    Taro.reLaunch({
      url: 'pages/index/index',
    })
  }

  const toMineDetail = () => {
    Taro.navigateTo({
      url: 'pages/mine-detail/index?id=' + userInfo.id,
    })
  }

  const toAddress = () => {
    Taro.navigateTo({
      url: 'pages/address/index',
    })
  }

  return (
    <View className={'container'}>
      <H5Nav title="设置" />
      {userInfo && (
        <Block>
          <View className={styles.set_box}>
            <ShopLabel
              clickItem={toMineDetail}
              textSlot={
                <View className={styles.user_box}>
                  <Image
                    src={process.env.fileUrl + filePath.myAvatar + '/' + userInfo.avatar}
                    className={styles.avatar}
                  ></Image>
                  <View className={styles.user_info}>
                    <View className={styles.user_name}>{userInfo.username}</View>
                    <View className={styles.level}>
                      {userInfo.memberId ? 'VIP' + userInfo.member?.level : '非会员'}
                    </View>
                  </View>
                </View>
              }
            />
            <ShopLabel clickItem={toAddress} text="我的收货地址" />
          </View>
          <View className={styles.btn}>
            <Button onClick={logout} className={styles.logout}>
              退出登录
            </Button>
          </View>
        </Block>
      )}
    </View>
  )
})

export default inject('store')(observer(Setting))
