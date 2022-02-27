import { Picker } from '@tarojs/components'
import { FC, useState, ReactElement, forwardRef, useImperativeHandle, Ref } from 'react'
import { useReady } from '@tarojs/taro'
import areadata from '@/lib/areadata/areadata'

type PageStateProps = {
  defaultValue: string[]
  onChangeArea?: (str: string[]) => void
  pickerSlot?: ReactElement<any, any> | string
  pickerName?: string
  ref?: Ref<any>
}

const co = {}
const ro = {}

const AddressPicker: FC<PageStateProps> = forwardRef((props, ref) => {
  const { defaultValue, pickerSlot, onChangeArea, pickerName } = props
  const [list, setList] = useState<any[]>([[], [], []])
  const [pageValue, setPageValue] = useState([0, 0, 0])

  useReady(() => {
    initData()
  })

  useImperativeHandle(ref, () => ({
    changeValue,
  }))

  const changeValue = () => {
    setTimeout(() => {
      const [province, city, region] = defaultValue
      const pIndex = list[0].findIndex(item => {
        return province === item.label
      })
      if (pIndex >= 0) {
        const cKey = list[0][pIndex].value
        const cIndex = co[cKey].findIndex(item => {
          return item.label === city
        })
        if (cIndex >= 0) {
          const rKey = co[cKey][cIndex].value
          const rIndex = ro[rKey].findIndex(item => {
            return item.label === region
          })
          setList([list[0], co[cKey], ro[rKey]])
          setPageValue([pIndex, cIndex, rIndex])
        }
      }
    }, 20)
  }

  const initData = () => {
    const result: any[] = []
    const defaultList = [0, 0, 0]
    const p: any[] = []
    let cs = '',
      rs = ''

    areadata.forEach((item: any, i) => {
      if (defaultValue[0] && item.label === defaultValue[0]) {
        cs = item.value
        defaultList[0] = i
      }
      p.push({
        value: item.value,
        label: item.label,
      })
      if (item.children) {
        item.children.forEach((citem, ci) => {
          if (defaultValue[1] && citem.label === defaultValue[1]) {
            rs = item.value
            defaultList[1] = ci
          }
          if (!co[item.value]) {
            co[item.value] = [
              {
                value: citem.value,
                label: citem.label,
              },
            ]
          } else {
            co[item.value].push({
              value: citem.value,
              label: citem.label,
            })
          }
          if (citem.children) {
            citem.children.forEach((ritem, ri) => {
              if (defaultValue[2] && ritem.label === defaultValue[2]) {
                defaultList[2] = ri
              }
              if (!ro[citem.value]) {
                ro[citem.value] = [
                  {
                    value: ritem.value,
                    label: ritem.label,
                  },
                ]
              } else {
                ro[citem.value].push({
                  value: ritem.value,
                  label: ritem.label,
                })
              }
            })
          }
        })
      }
    })
    let c = cs ? co[cs] : areadata[0].children
    let r = rs ? ro[rs] : areadata[0].children[0].children
    result.push(p, c, r)
    setPageValue(defaultList)
    setList(result)
  }

  const changeArea = e => {
    const { column, value } = e.detail
    switch (column) {
      case 0:
        setPageValue([value, 0, 0])
        setList((val: any) => {
          const key = val[0][value].value
          return [val[0], co[key], ro[co[key][0].value]]
        })
        break
      case 1:
        setPageValue(val => {
          return [val[0], value, 0]
        })
        setList((val: any[]) => {
          return [val[0], val[1], ro[val[1][value].value]]
        })
        break
      case 2:
        setPageValue(val => {
          return [val[0], val[1], value]
        })
        break
      default:
        break
    }
  }

  const onSubmit = e => {
    const { value } = e.detail
    const province = list[0][value[0]].label
    const city = list[1][value[1]].label
    const region = list[2][value[2]].label
    onChangeArea && onChangeArea([province, city, region])
  }

  return (
    <Picker
      range={list}
      name={pickerName}
      rangeKey="label"
      mode="multiSelector"
      onChange={onSubmit}
      value={pageValue}
      onColumnChange={changeArea}
    >
      {pickerSlot}
    </Picker>
  )
})

AddressPicker.defaultProps = {
  pickerName: 'addressList',
}

export default AddressPicker
