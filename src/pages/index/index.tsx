import { FC, useState, useRef, useEffect } from 'react'
import { View, ScrollView, Image } from '@tarojs/components'
import NavList from '@/components/navigation/nav-list'
import { shopTypeMap, shopTypeList, filePath } from '@/constant'
import { navigateTo, pxTransform, useDidShow } from '@tarojs/taro'
import { findTypeShop } from '@/api/modules/shop'
import { sleep } from '@/utils'

import styles from './index.module.scss'

const pageObj = {}
shopTypeList.forEach(item => {
  pageObj[item] = {
    pageIndex: 1,
    pageSize: 10,
    dataList: [],
    total: 0,
    isMore: true,
  }
})

const Index: FC = () => {
  const [pageData, setPageData] = useState(JSON.parse(JSON.stringify(pageObj)))
  const [current, setCurrent] = useState(0)
  const navRef = useRef<any>(null)
  const [isLoading, setIsloading] = useState(false)
  const pageFrist = useRef(false)
  const isFlash = useRef(false)

  useDidShow(() => {
    isFlash.current = true
    setPageData(JSON.parse(JSON.stringify(pageObj)))
  })

  useEffect(() => {
    if (isFlash.current) {
      isFlash.current = false
      initData()
    }
  }, [pageData])

  const initData = async () => {
    const shopKey = shopTypeList[current]
    const item = pageData[shopKey]
    if (item.isMore) {
      try {
        setIsloading(true)
        await sleep(100)
        const { data, total } = (await findTypeShop({
          shopType: shopKey,
          pageIndex: item.pageIndex,
          pageSize: item.pageSize,
        })) as any
        if (total > item.dataList.length) {
          setPageData(val => {
            const obj = { ...val }
            obj[shopKey].dataList.push(...data)
            obj[shopKey].pageIndex++
            obj[shopKey].total = total
            return obj
          })
        } else {
          setPageData(val => {
            const obj = { ...val }
            obj[shopKey].isMore = false
            return obj
          })
        }
      } finally {
        setIsloading(false)
      }
    }
  }

  const selectChange = ({ index }) => {
    setCurrent(index)
  }

  useEffect(() => {
    if (pageFrist.current) {
      initData()
    } else {
      pageFrist.current = true
    }
  }, [current])

  const onScrollToLower = () => {
    initData()
  }

  const goToDetail = item => {
    navigateTo({
      url: 'pages/detail/index?id=' + item.id,
    })
  }

  return (
    <View className={'container ' + styles.page}>
      <View className={styles.page_nav}>
        <NavList ref={navRef} keyId="label" dataList={shopTypeMap} selectChange={selectChange} />
      </View>
      <ScrollView
        style={{ height: `calc(100% - ${pxTransform(68)})` }}
        className={styles.page_scorll}
        onScrollToLower={() => {
          onScrollToLower()
        }}
        scrollY
      >
        {pageData[shopTypeList[current]].dataList.map(item => {
          return (
            <View
              onClick={() => {
                goToDetail(item)
              }}
              key={item.id}
              className={styles.shop_card}
            >
              <Image
                className={styles.shop_bg}
                mode="aspectFill"
                src={process.env.fileUrl + filePath.shop + '/' + item.avatar}
              />
              <View className={styles.shop_content}>
                <View className={styles.shop_name}>{item.name}</View>
                <View className={styles.shop_price}>￥{item.price}</View>
                <View className={styles.shop_store}>{item.shopStore?.name}</View>
              </View>
            </View>
          )
        })}
        {isLoading && <View className="shop_loading">加载中...</View>}
      </ScrollView>
    </View>
  )
}

export default Index
