import { ITouchEvent, View } from '@tarojs/components'
import { FC } from 'react'

import styles from './index.module.scss'

type PageStateProps = {
  addressItem?: any
  clickItem?: (e: ITouchEvent) => void
}

const AddressItem: FC<PageStateProps> = props => {
  const { clickItem, addressItem } = props

  return (
    <View onClick={clickItem} className={styles.address}>
      <View className={styles.user_info}>
        <View className={styles.name}>{addressItem?.name}</View>
        <View className={styles.phone}>{addressItem?.phone}</View>
      </View>
      <View className={styles.content}>
        {addressItem?.province + addressItem?.city + addressItem?.region + addressItem?.content}
      </View>
    </View>
  )
}

AddressItem.defaultProps = {
  addressItem: {},
}

export default AddressItem
