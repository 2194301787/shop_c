import { forwardRef } from 'react'

const bindRef = WrappedComponent => {
  const ConvertRef = props => {
    const { forwardedRef, ...other } = props
    return <WrappedComponent {...other} ref={forwardedRef} />
  }
  // “ref”是保留字段需要用普通的字段来代替，传递给传入的组件
  return forwardRef((props, ref) => {
    return <ConvertRef {...props} forwardedRef={ref} />
  })
}

export default bindRef
