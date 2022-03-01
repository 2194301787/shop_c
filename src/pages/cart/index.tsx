import { FC, useState, useEffect, forwardRef } from 'react'
import { useDidShow, showToast, navigateTo, showModal, useReady } from '@tarojs/taro'
import { View, Image, Input, Button, Block } from '@tarojs/components'
import { findAllShopCard, delShopCard as delShopCardApi } from '@/api/modules/shop'
import { filePath } from '@/constant'
import ShopRadio from '@/components/shop-radio'
import { toFiexd } from '@/utils'
import event from '@/utils/event'
import { eventBusEnum } from '@/constant'
import { inject, observer } from 'mobx-react'

import styles from './index.module.scss'

type PageStateProps = {
  store: any
}

const Index: FC<PageStateProps> = forwardRef((props, _ref) => {
  const [cardList, setcardList] = useState<any[]>([])
  const [allNum, setAllNum] = useState(0)
  const [checkAll, setCheckAll] = useState(false)
  const [allPrice, setAllPrice] = useState(0)
  const [isHandle, setIsHandle] = useState(false)
  const [isLogin, setIsLogin] = useState(true)

  useReady(() => {
    event.once(eventBusEnum.cartInit, () => {
      setIsLogin(false)
    })
  })

  useDidShow(() => {
    initData(true)
  })

  useEffect(() => {
    if (isHandle === false) {
      setcardList(list => {
        const result: any[] = Object.assign([], list)
        result.forEach(item => {
          item.shopList.forEach(citem => {
            if (citem.shopCount <= 0 && citem._isCheck) {
              citem._isCheck = false
            }
          })
        })
        return result
      })
    } else {
      setcardList(list => {
        const result: any[] = Object.assign([], list)
        result.forEach(item => {
          item._isCheck = !item.shopList.some(citem => {
            return !citem._isCheck
          })
        })
        isCheckAll(list)
        return result
      })
    }
  }, [isHandle])

  useEffect(() => {
    if (!isHandle) {
      countPrice(cardList)
    }
  }, [cardList, isHandle])

  const onBuy = () => {
    if (allPrice <= 0) {
      showToast({
        icon: 'none',
        title: '请选择',
      })
      return
    }
    const cards: any[] = JSON.parse(JSON.stringify(cardList))
    const list: any[] = []
    let num = 0
    cards.forEach(item => {
      const itemList = item.shopList.filter(citem => {
        return citem._isCheck
      })
      if (itemList.length > 0) {
        num += itemList.length
        delete item._isCheck
        list.push({
          ...item,
          shopList: itemList.map(sItem => {
            delete sItem._isCheck
            delete sItem._inpEL
            return sItem
          }),
        })
      }
    })
    if (list.length <= 0) {
      showToast({
        icon: 'none',
        title: '请选择',
      })
      return
    }
    props.store.config.setBuyCardList({
      price: allPrice,
      list,
      num,
    })
    navigateTo({
      url: 'pages/confirm-order/index',
    })
  }

  const countPrice = list => {
    let price = 0
    list.forEach(item => {
      item.shopList.forEach(citem => {
        if (citem._isCheck) {
          price += citem.price * (citem.cardBuyCount < 0 ? 1 : citem.cardBuyCount)
        }
      })
    })
    setAllPrice(toFiexd(price))
  }

  const initData = async (diff = false) => {
    try {
      const res = (await findAllShopCard()) as any
      let num = 0
      const result = res.data.map((item, index) => {
        if (cardList.length > 0 && diff && cardList[index] && cardList[index].id === item.id) {
          if (cardList[index].shopList.length === item.shopList.length) {
            item._isCheck = cardList[index]._isCheck
          } else {
            item._isCheck = false
          }
        } else {
          item._isCheck = false
        }
        item.shopList.forEach((citem, cindex) => {
          num++
          citem._isCheck = false
          citem._inpEL = false
          if (citem.cardBuyCount > citem.shopCount) {
            citem.cardBuyCount = citem.shopCount
          } else if (
            cardList.length > 0 &&
            diff &&
            cardList[index].shopList[cindex] &&
            cardList[index].shopList[cindex].cardId === citem.cardId
          ) {
            citem._isCheck = cardList[index].shopList[cindex]._isCheck
            citem.cardBuyCount = cardList[index].shopList[cindex].cardBuyCount
          }
        })
        return {
          ...item,
        }
      })
      setcardList(result)
      setAllNum(num)
    } catch (error) {
      if (error.includes('jwt') && isLogin) {
        setcardList([])
        navigateTo({
          url: 'pages/login/index',
        })
        setTimeout(() => {
          showToast({
            title: '登录已过期，请重新登录',
            icon: 'none',
          })
        }, 500)
      }
    }
  }

  const checkShop = (index, cindex) => {
    setcardList(list => {
      const result: any[] = Object.assign([], list)
      if (result[index].shopList[cindex].shopCount > 0 || isHandle) {
        result[index].shopList[cindex]._isCheck = !result[index].shopList[cindex]._isCheck
      } else {
        showToast({
          icon: 'none',
          title: '该商品暂时没有库存',
        })
      }
      result[index]._isCheck = !checkAllStore(result, index)
      isCheckAll(result)
      return result
    })
  }

  const checkAllStore = (list, index) => {
    return list[index].shopList.some(item => {
      if (isHandle) {
        return !item._isCheck
      } else {
        return !item._isCheck && item.shopCount > 0
      }
    })
  }

  const checkStore = index => {
    setcardList(list => {
      const result: any[] = Object.assign([], list)
      result[index].shopList.forEach(item => {
        if (item.shopCount > 0 || isHandle) {
          item._isCheck = !result[index]._isCheck
        }
      })
      result[index]._isCheck = !checkAllStore(result, index)
      isCheckAll(result)
      return result
    })
  }

  const isCheckAll = list => {
    let bool = list.some(item => {
      return (
        !item._isCheck &&
        item.shopList.some(citem => {
          return !citem.isCheck
        })
      )
    })
    setCheckAll(!bool)
  }

  const checkAllItem = () => {
    setcardList(list => {
      const result = list.map(item => {
        item.shopList = item.shopList.map(citem => {
          if (citem.shopCount > 0 || isHandle) {
            citem._isCheck = !checkAll
          }
          return citem
        })
        item._isCheck = !checkAll
        return item
      })
      return result
    })
    setCheckAll(!checkAll)
  }

  const changeBuyCount = (e, index, cindex) => {
    let val: number | string = parseInt(e.detail.value)
    if (isNaN(val)) {
      val = 0
    }
    setcardList(list => {
      const result: any[] = Object.assign([], list)
      result[index].shopList[cindex].cardBuyCount = val
      return result
    })
  }

  const inputFocus = (index, cindex) => {
    setcardList(list => {
      const result: any[] = Object.assign([], list)
      result[index].shopList[cindex]._inpEL = true
      return result
    })
  }

  const inputBlur = (index, cindex) => {
    const now = Number(cardList[index].shopList[cindex].cardBuyCount)
    const max = cardList[index].shopList[cindex].shopCount
    setcardList(list => {
      const result: any[] = Object.assign([], list)
      if (now > max) {
        result[index].shopList[cindex].cardBuyCount = max
      } else if (now <= 1 && max >= 1) {
        result[index].shopList[cindex].cardBuyCount = 1
      } else if (now < 1 && max <= 0) {
        result[index].shopList[cindex].cardBuyCount = 0
      }
      result[index].shopList[cindex]._inpEL = false
      return result
    })
  }

  const delShopCard = async () => {
    const verity = cardList.some(item => {
      return (
        item._isCheck ||
        item.shopList.some(citem => {
          return citem._isCheck
        })
      )
    })
    if (verity) {
      const data = await showModal({
        title: '提示',
        content: '是否删除',
      })
      if (data.confirm) {
        const list: any[] = []
        cardList.forEach(item => {
          item.shopList.forEach(citem => {
            if (citem._isCheck) {
              list.push(citem.cardId)
            }
          })
        })
        await delShopCardApi({
          ids: list,
        })
        initData()
        setIsHandle(false)
      }
    } else {
      showToast({
        icon: 'none',
        title: '请选择',
      })
    }
  }

  return (
    <View className={'container ' + styles.page}>
      <View className={styles.nav}>
        <View className={styles.title}>购物车({allNum})</View>
        <View
          onClick={() => {
            setIsHandle(val => !val)
          }}
          className={styles.handle}
        >
          {isHandle ? '返回' : '管理'}
        </View>
      </View>
      <View className={styles.card_box}>
        {cardList.map((item, index) => {
          return (
            <View key={'store' + item.id} className={styles.card_inner}>
              <View className={styles.store}>
                <ShopRadio
                  changeCheck={() => {
                    checkStore(index)
                  }}
                  isCheck={item._isCheck}
                ></ShopRadio>
                <Image
                  className={styles.store_bg}
                  mode="aspectFill"
                  src={process.env.fileUrl + filePath.shopStore + '/' + item.avatar}
                ></Image>
                <View className={styles.store_name}>{item.name}</View>
              </View>
              {item.shopList.map((citem, cindex) => {
                return (
                  <View key={'shop' + citem.id} className={styles.shop}>
                    <ShopRadio
                      changeCheck={() => {
                        checkShop(index, cindex)
                      }}
                      isCheck={citem._isCheck}
                    ></ShopRadio>
                    <Image
                      className={styles.shop_bg}
                      mode="aspectFill"
                      src={process.env.fileUrl + filePath.shop + '/' + citem.avatar}
                    ></Image>
                    <View className={styles.shop_detail}>
                      <View className={styles.shop_msg}>
                        <View className={styles.shop_title}>{citem.name}</View>
                        <View className={styles.count}>库存：{citem.shopCount}</View>
                      </View>
                      <View className={styles.shop_footer}>
                        <View className={styles.price}>￥{citem.price}</View>
                        <Input
                          style={{ borderColor: citem._inpEL ? 'rgb(27 27 27)' : 'rgb(187, 187, 187)' }}
                          onFocus={() => {
                            inputFocus(index, cindex)
                          }}
                          onInput={e => {
                            changeBuyCount(e, index, cindex)
                          }}
                          onBlur={() => {
                            inputBlur(index, cindex)
                          }}
                          value={citem.cardBuyCount}
                          className={styles.buy_number}
                          type="number"
                        ></Input>
                      </View>
                    </View>
                  </View>
                )
              })}
            </View>
          )
        })}
      </View>
      <View className={styles.card_footer}>
        <View className={styles.select}>
          <ShopRadio changeCheck={checkAllItem} title="全部" isCheck={checkAll}></ShopRadio>
        </View>
        <View className={styles.card_buy}>
          {isHandle ? (
            <Button onClick={delShopCard} className={styles.submit_buy + ' ' + styles.del_shop} type="warn">
              删除
            </Button>
          ) : (
            <Block>
              <View className={styles.count}>
                <View className={styles.label}>合计：</View>
                <View className={styles.price}>￥{allPrice}</View>
              </View>
              <Button onClick={onBuy} className={styles.submit_buy}>
                结算
              </Button>
            </Block>
          )}
        </View>
      </View>
    </View>
  )
})

export default inject('store')(observer(Index))
