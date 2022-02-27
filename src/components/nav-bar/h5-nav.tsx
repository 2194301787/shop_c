import { FC, CSSProperties } from 'react'
import { View, Image, Block } from '@tarojs/components'
import leftArrow from '@/assets/images/left.png'
import { pxTransform, navigateBack } from '@tarojs/taro'

import styles from './h5-nav.module.scss'

type PageStateProps = {
  title?: string
  isBack?: boolean
}

const H5Nav: FC<PageStateProps> = props => {
  const { title, isBack } = props
  let titleStyle: CSSProperties = {
    textAlign: 'center',
  }
  if (isBack) {
    titleStyle = {
      display: 'inline-block',
      paddingLeft: pxTransform(70),
    }
  }

  const goBack = () => {
    if (isBack) {
      navigateBack({
        delta: 1,
      })
    }
  }

  return (
    <Block>
      {process.env.TARO_ENV === 'h5' && (
        <View className={styles.nav_header}>
          {isBack && (
            <View className={styles.arrow}>
              <Image src={leftArrow} />
            </View>
          )}
          <View onClick={goBack} style={titleStyle} className={styles.title}>
            {title}
          </View>
        </View>
      )}
    </Block>
  )
}

H5Nav.defaultProps = {
  isBack: true,
}

export default H5Nav
