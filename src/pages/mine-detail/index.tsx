import { FC, useState, forwardRef } from 'react'
import { View, Image, Form, Input, Button, Picker, Text } from '@tarojs/components'
import { useRouter, useReady, chooseImage, uploadFile, showToast, navigateBack } from '@tarojs/taro'
import H5Nav from '@/components/nav-bar/h5-nav'
import { findUser } from '@/api/modules/user'
import FormItem from '@/components/form-item'
import { filePath } from '@/constant'
import { uploadImageUrl } from '@/api/modules/config'
import { inject, observer } from 'mobx-react'
import { updateUser } from '@/api/modules/user'
import { formartDate } from '@/utils'

import styles from './index.module.scss'

type PageStateProps = {
  store: any
}

const MineDetail: FC<PageStateProps> = forwardRef((props, _ref) => {
  const router = useRouter()
  const [userInfo, setUserInfo] = useState<any>({
    username: '',
    avatar: '',
    phone: '',
    password: '',
  })
  const [birthDate, setBirthDate] = useState('')

  useReady(() => {
    initData()
  })

  const initData = async () => {
    const { id } = router.params
    if (id) {
      const { data } = await findUser({
        id,
      })
      setBirthDate(formartDate(data.birthDate))
      setUserInfo(val => {
        const result = {}
        Object.keys(val).forEach(item => {
          result[item] = data[item]
        })
        return result
      })
    }
  }

  const submit = async e => {
    const pass = e.detail.value.password
    if (pass && pass !== e.detail.value.againPass) {
      showToast({
        title: '两次输入密码不一致',
        icon: 'none',
      })
      return
    }
    await updateUser({
      ...e.detail.value,
      againPass: '',
      id: router.params.id,
      avatar: userInfo.avatar,
      password: pass ? props.store.config.getEncrypt(pass) : '',
    })
    props.store.user.setUserInfo()
    navigateBack({
      delta: 1,
    })
  }

  const changeTime = e => {
    setBirthDate(e.detail.value)
  }
  const changeAvatar = () => {
    chooseImage({
      success(res) {
        const tempFilePaths = res.tempFilePaths
        uploadFile({
          url: uploadImageUrl,
          filePath: tempFilePaths[0],
          name: 'file',
          formData: {
            filePath: filePath.myAvatar,
          },
          success(res) {
            const data = JSON.parse(res.data as unknown as string)
            setUserInfo(val => {
              return Object.assign({}, val, {
                avatar: data.data,
              })
            })
          },
        })
      },
    })
  }

  return (
    <View className={'container'}>
      <H5Nav title="个人信息" />
      <View onClick={changeAvatar} className={styles.user_box}>
        <Image src={process.env.fileUrl + filePath.myAvatar + '/' + userInfo.avatar} className={styles.avatar} />
        <View className={styles.tip}>更换头像</View>
      </View>
      <Form onSubmit={submit}>
        <View className={styles.user_label}>
          <FormItem
            text="账号"
            rightSlot={
              <Input value={userInfo.username} className="shop_input" name="username" placeholder="请输入账号" />
            }
          />
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
            rightSlot={
              <Input value={userInfo.phone} className="shop_input" name="phone" placeholder="请输入电话号码" />
            }
          />
        </View>
        <View className={styles.user_pass}>
          <View className={styles.pass_tip}>修改密码(不填不修改)</View>
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

export default inject('store')(observer(MineDetail))
