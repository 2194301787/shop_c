import { FC, useState, forwardRef, useImperativeHandle } from 'react'
import { View, ScrollView } from '@tarojs/components'
import { pxTransform, useReady, createSelectorQuery } from '@tarojs/taro'

import styles from './nav-list.module.scss'

type PageStateProps = {
  dataList: any[]
  keyValue?: string | number
  keyId?: string | number
  selectChange?: Function
  ref?: any
}

const NavList: FC<PageStateProps> = forwardRef((props, ref) => {
  const { dataList, keyId, selectChange } = props
  const totalWidth = pxTransform(108 * dataList.length)
  const [scrollViewWidth, setScrollViewWidth] = useState(0)
  const [scrollLeft, setScrollLeft] = useState(0)
  const [selectIndex, setSelectIndex] = useState(0)
  const borderPx = pxTransform(selectIndex * 40 + 68 * selectIndex + 20)

  useImperativeHandle(ref, () => ({
    handleSelect: index => handleSelect(index),
  }))

  const handleSelect = index => {
    setSelectIndex(index)
    getDom('.nav_active', res => {
      setScrollLeft(Math.floor(res[0]?.left + res[0]?.width) - scrollViewWidth / 2)
    })
  }

  useReady(() => {
    getDom('.nav-list-scroll', res => {
      setScrollViewWidth(res[0]?.width)
    })
  })

  const getDom = (str, cb) => {
    const dom = createSelectorQuery()
    dom.select(str).boundingClientRect()
    dom.selectViewport().scrollOffset()
    dom.exec(res => {
      cb && cb(res)
    })
  }

  const selectItem = (item, index, e) => {
    if (index !== selectIndex) {
      setSelectIndex(index)
      setScrollLeft(e.target.offsetLeft - scrollViewWidth / 2)
      selectChange && selectChange({ item, index })
    }
  }

  return (
    <ScrollView scrollLeft={scrollLeft} scrollWithAnimation scrollX>
      <View style={{ width: totalWidth }} className={'nav-list-scroll ' + styles.nav_box}>
        {dataList.map((item, index) => {
          return (
            <View
              key={item[keyId as string]}
              onClick={e => {
                selectItem(item, index, e)
              }}
              className={`${styles.nav_item} ${selectIndex === index ? 'nav_active' : ''}`}
            >
              {item.label}
            </View>
          )
        })}
        <View style={{ left: borderPx }} className={styles.nav_border}></View>
      </View>
    </ScrollView>
  )
})

NavList.defaultProps = {
  keyId: 'id',
  keyValue: 'value',
}
export default NavList
