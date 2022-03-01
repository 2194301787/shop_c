export const shopTypeList: any[] = ['全部', '电器', '电子', '器材', '美食', '家居', '萌宠', '衣服', '其他']

export const shopTypeMap: any[] = shopTypeList.map(item => ({
  label: item,
  value: item,
}))

export enum filePath {
  myAvatar = '/myAvatar',
  shop = '/shop',
  shopStore = '/shopStore',
  shopText = '/shopText',
}

export enum orderType {
  unpaid = 1, // 待付款
  unship, // 待发货
  unreceipt, // 待收货
  completed, // 已完成
  reimburse, // 退款/售后
}

export const orderMap = {
  [orderType.unpaid]: '待付款',
  [orderType.unship]: '待发货',
  [orderType.unreceipt]: '待收货',
  [orderType.completed]: '已完成',
  [orderType.reimburse]: '退款/售后',
}

export const orderList = [
  {
    label: orderMap[orderType.unpaid],
    value: orderType.unpaid,
  },
  {
    label: orderMap[orderType.unship],
    value: orderType.unship,
  },
  {
    label: orderMap[orderType.unreceipt],
    value: orderType.unreceipt,
  },
  {
    label: orderMap[orderType.completed],
    value: orderType.completed,
  },
  {
    label: orderMap[orderType.reimburse],
    value: orderType.reimburse,
  },
]

export enum couponTypeEnum {
  favorable = 1,
  discount,
}

export enum couponRangeEnum {
  all = 1,
  store,
  shop,
}

export enum eventBusEnum {
  cartInit = 'cartInit',
  swapPage = 'swapPage',
  initData = 'initData',
}
