import { FC, ReactElement } from 'react'
import { View, Text } from '@tarojs/components'
import { pxTransform } from '@tarojs/taro'

import styles from './index.module.scss'

type PageStateProps = {
  text?: string
  labelWidth?: number
  rightSlot?: ReactElement<any, any> | string
}

const FormItem: FC<PageStateProps> = props => {
  const { text, labelWidth, rightSlot } = props

  return (
    <View className={styles.form_item}>
      <View className={styles.item_inner}>
        <View style={{ width: pxTransform(labelWidth as number) }} className={styles.label}>
          {text}
        </View>
        <View className={styles.slot}>
          {rightSlot ? (
            typeof rightSlot === 'string' ? (
              <Text className={styles.slot_text}>{rightSlot}</Text>
            ) : (
              rightSlot
            )
          ) : (
            ''
          )}
        </View>
      </View>
    </View>
  )
}

FormItem.defaultProps = {
  labelWidth: 200,
}

export default FormItem
