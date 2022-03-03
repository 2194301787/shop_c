import request from '@/api'

export const createOrder = data => {
  return request.Post('/order/createOrder', data, undefined, {
    showLoading: true,
  })
}

export const payOrder = data => {
  return request.Post('/order/payOrder', data, undefined, {
    showLoading: true,
  })
}
