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

export const findAllOrder = data => {
  return request.Post('/order/findAllOrder', data, undefined, {
    clearEmpty: true,
  })
}

export const delOrder = data => {
  return request.Post('/order/delOrder', data, undefined, {
    showLoading: true,
  })
}

export const findOrder = data => {
  return request.Get('/order/findOrder', data)
}
