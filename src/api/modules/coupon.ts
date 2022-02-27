import request from '@/api'

export const createTakeCoupon = data => {
  return request.Post('/coupon/createTakeCoupon', data)
}

export const findAllTakeCoupon = data => {
  return request.Get('/coupon/findAllTakeCoupon', data, undefined, {
    showLoading: true,
    clearEmpty: true,
  })
}
