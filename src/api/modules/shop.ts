import request from '@/api'

export const findTypeShop = data => {
  return request.Post('/shop/findTypeShop', data)
}

export const getShop = data => {
  return request.Get('/shop/getShop', data)
}

export const createShopCard = data => {
  return request.Post('/shop/createShopCard', data, undefined, {
    showLoading: true,
    checkLogin: true,
  })
}

export const findAllShopCard = (data = undefined) => {
  return request.Get('/shop/findAllShopCard', data, undefined, {
    showLoading: true,
  })
}

export const delShopCard = data => {
  return request.Post('/shop/delShopCard', data, undefined, {
    showLoading: true,
  })
}
