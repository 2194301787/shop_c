import { View, Image } from '@tarojs/components'
import { FC, Ref, ReactElement, CSSProperties, useState, useEffect, useImperativeHandle, forwardRef } from 'react'
import Taro from '@tarojs/taro'

import closeIcon from '@/assets/images/close.png'

import styles from './index.module.scss'

type PageStateProps = {
  maskSlot: ReactElement<any, any>
  maskWidth?: number | string
  ref?: Ref<any>
  title?: string
}

interface maskStyleType {
  box: CSSProperties
  inner: CSSProperties
}

const Dialog: FC<PageStateProps> = forwardRef((props, ref) => {
  const { maskSlot, maskWidth, title } = props
  const [isShow, setIsShow] = useState(false)
  const [maskStyle, setMaskStyle] = useState<maskStyleType>({
    box: {
      opacity: 0,
    },
    inner: {
      width: typeof maskWidth === 'number' ? Taro.pxTransform(maskWidth) : maskWidth,
      transform: 'translate(-50%,-60%)',
    },
  })
  const [nowStyle, setNowStyle] = useState<CSSProperties>({
    display: isShow ? 'block' : 'none',
  })

  useImperativeHandle(ref, () => ({
    open,
    close,
  }))

  const open = () => {
    setIsShow(true)
  }
  const close = () => {
    setIsShow(false)
  }

  const innerClose = e => {
    e.stopPropagation()
  }

  const clickClose = e => {
    e.stopPropagation()
    close()
  }

  useEffect(() => {
    if (isShow) {
      setNowStyle({ display: 'block' })
    }
    setTimeout(() => {
      setMaskStyle(val => {
        const result = Object.assign({}, val)
        result.box.opacity = isShow ? 1 : 0
        result.inner.transform = isShow ? 'translate(-50%,-50%)' : 'translate(-50%,-60%)'
        return result
      })
      if (!isShow) {
        setTimeout(() => {
          setNowStyle({ display: 'none' })
        }, 100)
      }
    }, 100)
  }, [isShow])

  return (
    <View onClick={close} style={{ ...nowStyle, ...maskStyle.box }} className={styles.mask}>
      <View onClick={innerClose} style={maskStyle.inner} className={styles.mask_content}>
        <View className={styles.mask_nav}>
          <View className={styles.title}>{title}</View>
          <Image onClick={clickClose} className={styles.icon} src={closeIcon} />
        </View>
        {maskSlot}
      </View>
    </View>
  )
})

Dialog.defaultProps = {
  maskWidth: 300,
  title: '',
}

export default Dialog
