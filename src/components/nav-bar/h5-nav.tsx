import { FC, CSSProperties, useState } from 'react'
import { View, Image } from '@tarojs/components'
import leftArrow from '@/assets/images/left.png'
import { pxTransform, navigateBack, useReady, getSystemInfo } from '@tarojs/taro'

import styles from './h5-nav.module.scss'

type PageStateProps = {
  title?: string
  isBack?: boolean
  backHandle?: () => void
}

const H5Nav: FC<PageStateProps> = props => {
  const [statusH, setStateH] = useState(44)
  const [topH, setTopH] = useState(0)
  const { title, isBack, backHandle } = props
  let titleStyle: CSSProperties = {
    textAlign: 'center',
  }

  useReady(() => {
    getSystemInfo({
      success(res) {
        if (res.statusBarHeight !== NaN && res.statusBarHeight !== 0) {
          setTopH(res.statusBarHeight)
        }
        if (res.platform === 'ios') {
          setStateH(44)
        } else if (res.platform === 'android') {
          setStateH(48)
        }
      },
    })
  })

  const navStyle: CSSProperties = {
    height: statusH + topH + 'px',
    lineHeight: statusH + topH + 'px',
  }

  const topStyle: CSSProperties = {
    height: topH + 'px',
  }

  if (isBack) {
    titleStyle = {
      display: 'inline-block',
      paddingLeft: pxTransform(70),
    }
  }

  const goBack = () => {
    if (isBack) {
      backHandle && backHandle()
      navigateBack({
        delta: 1,
      })
    }
  }

  return (
    <View style={navStyle} className={styles.nav_header}>
      <View style={topStyle}></View>
      <View className={styles.nav_box}>
        {isBack && <Image className={styles.arrow} src={leftArrow} />}
        <View onClick={goBack} style={titleStyle} className={styles.title}>
          {title}
        </View>
      </View>
    </View>
  )
}

H5Nav.defaultProps = {
  isBack: true,
}

export default H5Nav
