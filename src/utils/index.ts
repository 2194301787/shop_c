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
