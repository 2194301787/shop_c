import { FC, useState, useEffect, forwardRef, useRef } from 'react'
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
  const isFrist = useRef(true)

  useReady(() => {
    event.once(eventBusEnum.cartInit, () => {
      setIsLogin(false)
    })
  })

  useDidShow(() => {
    initData(true)
  })

  useEffect(() => {
    if (isFrist.current) {
      isFrist.current = false
    } else {
      if (isHandle === false) {
        setcardList(list => {
          const result: any[] = Object.assign([], list)
          result.forEach((item, index) => {
            item.shopList.forEach(citem => {
              if (citem.shopCount <= 0 && citem._isCheck) {
                citem._isCheck = false
              }
            })
            item._isCheck = !checkAllStore(result, index)
          })
          isCheckAll(result)
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
    }
  }, [isHandle])

  const onBuy = () => {
    if (allPrice <= 0) {
      showToast({
        icon: 'none',
        title: '?????????',
      })
      return
    }
    const cards: any[] = JSON.parse(JSON.stringify(cardList))
    const list: any[] = []
    let cardId: any = []
    let num = 0
    cards.forEach(item => {
      const itemList = item.shopList.filter(citem => {
        return citem._isCheck
      })
      if (itemList.length > 0) {
        cardId.push(...itemList.map(shopItem => shopItem.cardId))
        delete item._isCheck
        list.push({
          ...item,
          shopList: itemList.map(sItem => {
            num += sItem.cardBuyCount
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
        title: '?????????',
      })
      return
    }
    props.store.config.setBuyCardList({
      price: allPrice,
      list,
      num,
    })
    navigateTo({
      url: 'pages/confirm-order/index?ids=' + cardId.join(','),
    })
  }

  const countPrice = list => {
    if (!isHandle) {
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
            const n = cardList[index].shopList[cindex].cardBuyCount
            citem.cardBuyCount = citem.shopCount >= n ? n : citem.shopCount
          }
        })
        return {
          ...item,
        }
      })
      countPrice(result)
      setAllNum(num)
      setcardList(result)
    } catch (error) {
      setcardList([])
      setAllNum(0)
      if (typeof error === 'string' && error.includes('jwt') && isLogin) {
        navigateTo({
          url: 'pages/login/index',
        })
        setTimeout(() => {
          showToast({
            title: '?????????????????????????????????',
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
          title: '???????????????????????????',
        })
      }
      result[index]._isCheck = !checkAllStore(result, index)
      isCheckAll(result)
      countPrice(result)
      return result
    })
  }

  const checkAllStore = (list, index) => {
    let count = 0
    const some = list[index].shopList.some(item => {
      if (isHandle) {
        return !item._isCheck
      } else {
        if (item.shopCount > 0) {
          count++
        }
        return !item._isCheck && item.shopCount > 0
      }
    })
    if (!isHandle && count <= 0) {
      return true
    } else {
      return some
    }
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
      countPrice(result)
      return result
    })
  }

  const isCheckAll = list => {
    let bool = list.some(item => {
      return !item._isCheck
    })
    setCheckAll(!bool)
  }

  const checkAllItem = () => {
    setCheckAll(!checkAll)
    setcardList(list => {
      const result = list.map(item => {
        let count = 0
        item.shopList = item.shopList.map(citem => {
          if (citem.shopCount > 0 || isHandle) {
            if (citem.shopCount > 0) {
              count++
            }
            citem._isCheck = !checkAll
          }
          return citem
        })
        if (isHandle || count > 0) {
          item._isCheck = !checkAll
        }
        return item
      })
      countPrice(result)
      return result
    })
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
      countPrice(result)
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
        title: '??????',
        content: '????????????',
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
        title: '?????????',
      })
    }
  }

  return (
    <View className={'container ' + styles.page}>
      <View className={styles.nav}>
        <View className={styles.title}>?????????({allNum})</View>
        <View
          onClick={() => {
            setIsHandle(val => !val)
          }}
          className={styles.handle}
        >
          {isHandle ? '??????' : '??????'}
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
                        <View className={styles.count}>?????????{citem.shopCount}</View>
                      </View>
                      <View className={styles.shop_footer}>
                        <View className={styles.price}>???{citem.price}</View>
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
          <ShopRadio changeCheck={checkAllItem} title="??????" isCheck={checkAll}></ShopRadio>
        </View>
        <View className={styles.card_buy}>
          {isHandle ? (
            <Button onClick={delShopCard} className={styles.submit_buy + ' ' + styles.del_shop} type="warn">
              ??????
            </Button>
          ) : (
            <Block>
              <View className={styles.count}>
                <View className={styles.label}>?????????</View>
                <View className={styles.price}>???{allPrice}</View>
              </View>
              <Button onClick={onBuy} className={styles.submit_buy}>
                ??????
              </Button>
            </Block>
          )}
        </View>
      </View>
    </View>
  )
})

export default inject('store')(observer(Index))
