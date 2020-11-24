import useBind from './useBind'

const usePassiveBind = (props, options = {}) => {

    _.isString(props) && (props = {
        ...options,
        event: props,
        passive: true,
    })

    return useBind({
        passive: true,
        ...props
    })
}
export default usePassiveBind