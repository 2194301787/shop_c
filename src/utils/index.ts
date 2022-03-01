import moment from 'moment'

export const toFiexd = (val: number, num = 2) => {
  return Math.floor(val * 100) / Math.pow(10, num)
}

export const sleep = time => {
  return new Promise(resolve => setTimeout(resolve, time))
}

export const formartDate = (date: Date | string, strType = 'YYYY-MM-DD') => {
  return moment(date).format(strType)
}

export const isEmpty = (val: any) => {
  if (val === null || val === undefined) return true

  if (typeof val === 'boolean') return false

  if (typeof val === 'number') return !val

  if (val instanceof Error) return val.message === ''

  switch (Object.prototype.toString.call(val)) {
    // String or Array
    case '[object String]':
    case '[object Array]':
      return !val.length

    // Map or Set or File
    case '[object File]':
    case '[object Map]':
    case '[object Set]': {
      return !val.size
    }
    // Plain Object
    case '[object Object]': {
      return !Object.keys(val).length
    }
  }
  return false
}
