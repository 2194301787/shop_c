import { FC, CSSProperties } from 'react'
import { ITouchEvent, View } from '@tarojs/components'

import styles from './index.module.scss'

type PageStatePorps = {
  isCheck?: boolean
  changeCheck?: (event: ITouchEvent) => void
  title?: string
  tipStyle?: CSSProperties
}

const ShopRadio: FC<PageStatePorps> = props => {
  const { isCheck, changeCheck, title, tipStyle } = props

  const cssStyle: CSSProperties = {
    backgroundColor: 'white',
  }
  if (isCheck) {
    cssStyle.backgroundColor = 'rgb(0, 163, 0)'
  }

  return (
    <View onClick={changeCheck} className={styles.check}>
      <View className={styles.check_box}>
        <View style={cssStyle} className={styles.check_inner}></View>
      </View>
      {title && (
        <View style={tipStyle} className={styles.title}>
          {title}
        </View>
      )}
    </View>
  )
}

ShopRadio.defaultProps = {
  isCheck: true,
  changeCheck: () => {},
}

export default ShopRadio
