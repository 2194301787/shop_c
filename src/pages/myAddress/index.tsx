import { FC, useState, useRef } from 'react'
import { View, Form, Input, Text, Textarea, Button } from '@tarojs/components'
import Taro from '@tarojs/taro'
import H5Nav from '@/components/nav-bar/h5-nav'
import FormItem from '@/components/form-item'
import ShopRadio from '@/components/shop-radio'
import AddressPicker from '@/components/address-picker'
import { createAddress, updateAddress, findAddress } from '@/api/modules/address'

import styles from './index.module.scss'

const Address: FC = () => {
  const router = Taro.useRouter()
  const isEdit = !!router.params.id
  const [addressInfo, setAddressInfo] = useState<any>({
    name: '',
    phone: '',
    content: '',
  })
  const addressRef = useRef<any>()
  const [isDefault, setIsDefault] = useState(false)
  const [addressList, setAddressList] = useState<string[]>([])

  Taro.useReady(() => {
    initData()
  })
  const initData = async () => {
    if (!isEdit) {
      Taro.setNavigationBarTitle({
        title: '新增收货地址',
      })
    } else {
      const { data } = await findAddress({
        id: router.params.id,
      })
      const { name, phone, content, isDefault, province, city, region } = data
      setAddressInfo({
        name,
        phone,
        content,
      })
      setIsDefault(isDefault)
      setAddressList([province, city, region])
      addressRef.current?.changeValue()
    }
  }

  const changeArea = arr => {
    setAddressList(arr)
  }

  const changeIpt = (e, type) => {
    setAddressInfo(val => {
      return Object.assign(
        {},
        {
          ...val,
          [type]: e.detail.value,
        }
      )
    })
  }

  const submit = async e => {
    const { value } = e.detail
    const arr = Object.keys(value)
    let bool = true
    for (let i = 0; i < arr.length; i++) {
      if (!value[arr[i]]) {
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
    if (bool) {
      const data = {
        ...value,
        addressList: '',
        province: addressList[0],
        city: addressList[1],
        region: addressList[2],
        isDefault,
      }
      if (isEdit) {
        await updateAddress({
          ...data,
          id: router.params.id,
        })
      } else {
        await createAddress(data)
      }
      Taro.navigateBack({
        delta: 1,
      })
    }
  }

  return (
    <View className={'container'}>
      <H5Nav title={`${isEdit ? '编辑' : '新增'}收货地址`} />
      <Form onSubmit={submit}>
        <View className={styles.myAddress}>
          <FormItem
            text="收货人"
            rightSlot={
              <Input
                onInput={e => {
                  changeIpt(e, 'name')
                }}
                className="shop_input"
                value={addressInfo.name}
                name="name"
                placeholder="请输入收货人"
              />
            }
          />
          <FormItem
            text="手机号"
            rightSlot={
              <Input className="shop_input" name="phone" value={addressInfo.phone} placeholder="请输入手机号" />
            }
          />

          <FormItem
            text="所在地区"
            rightSlot={
              <View>
                <AddressPicker
                  ref={addressRef}
                  defaultValue={addressList}
                  onChangeArea={changeArea}
                  pickerSlot={
                    <View className="shop_picker">
                      {addressList.length > 0 ? (
                        addressList.join('-')
                      ) : (
                        <Text className="picker_text">请选择所在省市区</Text>
                      )}
                    </View>
                  }
                />
              </View>
            }
          />
          <FormItem
            text="详细地址"
            rightSlot={
              <Textarea
                className="shop_text_area"
                name="content"
                value={addressInfo.content}
                placeholder="请输入详情地址"
              />
            }
          />
          <View className={styles.is_default}>
            <View className={styles.text}>设为默认收货地址</View>
            <ShopRadio
              changeCheck={() => {
                setIsDefault(bool => !bool)
              }}
              isCheck={isDefault}
            />
          </View>
          <View className={styles.btn}>
            <Button formType="submit" type="primary">
              保存
            </Button>
          </View>
        </View>
      </Form>
    </View>
  )
}

export default Address
