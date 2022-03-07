import { View, Image, Form, Input, Picker, Text, Button } from '@tarojs/components'
import { FC, useState, forwardRef } from 'react'
import H5Nav from '@/components/nav-bar/h5-nav'
import FormItem from '@/components/form-item'
import { filePath, eventBusEnum } from '@/constant'
import Taro from '@tarojs/taro'
import { uploadImageUrl } from '@/api/modules/config'
import { inject, observer } from 'mobx-react'
import { register } from '@/api/modules/user'
import event from '@/utils/event'

import styles from './index.module.scss'

type PageStateProps = {
  store: any
}

const Register: FC<PageStateProps> = forwardRef((props, _ref) => {
  const [birthDate, setBirthDate] = useState('')
  const [avatar, setAvatar] = useState('')

  const submit = async e => {
    const { value } = e.detail
    const pass = value.password
    const arr = Object.keys(value)
    let bool = true
    for (let i = 0; i < arr.length; i++) {
      if (!value[arr[i]] && arr[i] !== 'password' && arr[i] !== 'againPass') {
        Taro.showToast({
          icon: 'none',
          title: '请输入完整',
        })
        bool = false
        break
      }
      if (arr[i] === 'phone' && !/^[1][3,4,5,7,8,9][0-9]{9}$/.test(value[arr[i]])) {
        Taro.showToast({
          icon: 'none',
          title: '请输入正确的电话号码',
        })
        bool = false
        break
      }
    }
    if (!bool) {
      return
    }
    if (!pass) {
      Taro.showToast({
        title: '请输入密码',
        icon: 'none',
      })
      return
    }
    if (pass && pass !== value.againPass) {
      Taro.showToast({
        title: '两次输入密码不一致',
        icon: 'none',
      })
      return
    }
    try {
      await register({
        ...value,
        avatar,
        againPass: '',
        password: props.store.config.getEncrypt(pass),
      })
      event.trigger(eventBusEnum.swapPage, value)
      Taro.navigateBack({
        delta: 1,
      })
    } catch (error) {
      if (error && error.includes('Validation')) {
        Taro.showToast({
          title: '手机或用户名已被注册',
          icon: 'none',
        })
      }
    }
  }

  const changeTime = e => {
    setBirthDate(e.detail.value)
  }

  const changeAvatar = () => {
    Taro.chooseImage({
      success(res) {
        const tempFilePaths = res.tempFilePaths
        Taro.uploadFile({
          url: uploadImageUrl,
          filePath: tempFilePaths[0],
          name: 'file',
          formData: {
            filePath: filePath.myAvatar,
          },
          success(res) {
            const data = JSON.parse(res.data as unknown as string)
            setAvatar(data.data)
          },
        })
      },
    })
  }

  return (
    <View className="container">
      <H5Nav title="注册" />
      <View onClick={changeAvatar} className={styles.user_box}>
        <Image src={process.env.fileUrl + filePath.myAvatar + '/' + avatar} className={styles.avatar} />
        <View className={styles.tip}>上传头像</View>
      </View>
      <Form onSubmit={submit}>
        <View className={styles.user_label}>
          <FormItem text="账号" rightSlot={<Input className="shop_input" name="username" placeholder="请输入账号" />} />
          <FormItem
            text="出生日期"
            rightSlot={
              <Picker
                className="shop_picker"
                mode="date"
                name="birthDate"
                value={birthDate || ''}
                onChange={changeTime}
              >
                <View>{birthDate || <Text className="picker_text">请选择出生日期</Text>}</View>
              </Picker>
            }
          />
          <FormItem
            text="电话号码"
            rightSlot={<Input className="shop_input" name="phone" placeholder="请输入电话号码" />}
          />
        </View>
        <View className={styles.user_pass}>
          <FormItem
            text="密码"
            rightSlot={<Input className="shop_input" password name="password" placeholder="请输入密码" />}
          />
          <FormItem
            text="确认密码"
            rightSlot={<Input className="shop_input" name="againPass" password placeholder="请再次输入密码" />}
          />
        </View>
        <View className={styles.btn}>
          <Button formType="submit" type="primary" className={styles.submit}>
            确定
          </Button>
        </View>
      </Form>
    </View>
  )
})

export default inject('store')(observer(Register))
