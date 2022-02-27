import request from '@/api'

export const getPublicPem = (data = undefined) => {
  return request.Get('/config/getPublicPem', data)
}

export const testApi = (data = undefined) => {
  return request.Post('/config/testApi', data, undefined, {
    clearEmpty: true,
  })
}

export const uploadImageUrl = '/api/config/uploadImage'
