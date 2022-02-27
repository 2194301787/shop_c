import request from '@/api'

export const getUserInfo = (data = undefined) => {
  return request.Get('/user/getUserInfo', data)
}

export const loginV3 = (data = undefined) => {
  return request.Post('/user/loginV3', data)
}

export const logout = (data = undefined) => {
  return request.Get('/user/logout', data, undefined, {
    showLoading: true,
  })
}

export const findUser = data => {
  return request.Get('/user/findUser', data)
}

export const updateUser = data => {
  return request.Post('/user/updateUser', data, undefined, {
    clearEmpty: true,
    showLoading: true,
  })
}
