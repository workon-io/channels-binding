import useBind from './useBind'

const useAutoBind = (props, options = {}) => {

    _.isString(props) && (props = {
        ...options,
        event: props,
    })

    return useBind({
        passive: Boolean(props.data),
        versatile: true,
        ...props
    })
}
export default useAutoBind