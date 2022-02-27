import request from '@/api'

export const createAddress = data => {
  return request.Post('/address/createAddress', data, undefined, {
    clearEmpty: true,
    showLoading: true,
  })
}

export const updateAddress = data => {
  return request.Post('/address/updateAddress', data, undefined, {
    clearEmpty: true,
    showLoading: true,
  })
}

export const delAddress = data => {
  return request.Post('/address/delAddress', data, undefined, {
    showLoading: true,
  })
}

export const findAllAddress = (data = undefined) => {
  return request.Get('/address/findAllAddress', data)
}

export const findAddress = data => {
  return request.Get('/address/findAddress', data)
}
