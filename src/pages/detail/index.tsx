import { FC, useState } from 'react'
import { View, Swiper, SwiperItem, Image, RichText } from '@tarojs/components'
import { showModal, useRouter, useReady, showToast } from '@tarojs/taro'
import H5Nav from '@/components/nav-bar/h5-nav'
import { getShop } from '@/api/modules/shop'
import { filePath } from '@/constant'
import { createShopCard } from '@/api/modules/shop'

import buyIcon from '@/assets/images/icon_buy.png'

import styles from './index.module.scss'

type PageStateProps = {
  store: any
}

const Detail: FC<PageStateProps> = () => {
  const {
    params: { id },
  } = useRouter()
  const [shopItem, setShopItem] = useState<any>({
    _shopImgList: [],
  })

  useReady(() => {
    initData()
  })

  const initData = async () => {
    const { data } = (await getShop({
      id,
    })) as any
    data._shopImgList = []
    if (data.avatar) {
      data._shopImgList.push(data.avatar)
    }
    if (data.avatarList) {
      try {
        data._shopImgList.push(...JSON.parse(data.avatarList))
      } catch (error) {
        console.log(error)
      }
    }
    setShopItem(data)
  }

  const addCard = async () => {
    try {
      const { confirm } = await showModal({
        content: '是否添加购物车',
      })
      if (confirm) {
        const res = (await createShopCard({
          shopId: shopItem.id,
          shopStoreId: shopItem.shopStoreId,
        })) as any
        showToast({
          title: res.message,
        })
      }
    } catch (error) {
      showToast({
        title: error,
        icon: 'error',
      })
    }
  }

  return (
    <View className={'container'}>
      <H5Nav title={shopItem.name || '详情'} />
      <Swiper className={styles.swiper_box} indicatorDots>
        {shopItem._shopImgList.map(item => {
          return (
            <SwiperItem key={item}>
              <Image
                mode="aspectFill"
                className={styles.swiper_img}
                src={process.env.fileUrl + filePath.shop + '/' + item}
              />
            </SwiperItem>
          )
        })}
      </Swiper>
      <View className={styles.shop_box}>
        <View className={styles.shop_inner}>
          <View className={styles.name}>{shopItem.name}</View>
          <View className={styles.price}>￥{shopItem.price}</View>
        </View>
      </View>
      <View className={styles.shop_box}>
        <View className={styles.shop_inner}>
          <View className={styles.store}>
            <View className={styles.store_img}>
              <Image src={process.env.fileUrl + filePath.shopStore + '/' + shopItem.shopStore?.avatar} />
            </View>
            <View className={styles.store_name}>{shopItem.shopStore?.name}</View>
          </View>
        </View>
      </View>
      <View className={styles.detail}>
        <View className={styles.title}>商品详情</View>
        <RichText className={styles.detail_render} nodes={shopItem.description}></RichText>
      </View>
      <View className={styles.shop_footer}>
        <View className={styles.icon}>
          <Image className={styles.icon_img} src={buyIcon} />
        </View>
        <View className={styles.btn}>
          <View onClick={addCard} className={styles.add}>
            加入购物车
          </View>
          <View className={styles.buy}>立即购买</View>
        </View>
      </View>
    </View>
  )
}

export default Detail
