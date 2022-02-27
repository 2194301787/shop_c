import { FC, ReactElement } from 'react'
import { View, Text, Image, ITouchEvent } from '@tarojs/components'

import rightIcon from '@/assets/images/right.png'

import styles from './index.module.scss'

type PageStatePorps = {
  textSlot?: ReactElement<any, any>
  text?: string
  clickItem?: (event: ITouchEvent) => void
}

const ShopLabel: FC<PageStatePorps> = props => {
  const { textSlot, text, clickItem } = props

  return (
    <View onClick={clickItem} className={styles.label}>
      <View className={styles.label_inner}>
        <View className={styles.text}>{textSlot ? textSlot : <Text className={styles.str}>{text}</Text>}</View>
        <Image className={styles.icon_img} src={rightIcon} />
      </View>
    </View>
  )
}

ShopLabel.defaultProps = {
  clickItem: () => {},
}

export default ShopLabel
