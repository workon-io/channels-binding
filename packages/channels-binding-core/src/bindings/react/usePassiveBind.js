import useBind from './useBind'

const usePassiveBind = props => {

    _.isString(props) && (props = {
        event: props,
        passive: true,
    })

    return useBind({
        passive: true,
        ...props
    })
}
export default usePassiveBind