import useAutoBind from './useAutoBind'
import usePassiveBind from './usePassiveBind'

const useRetrieve = (props, options = {}) => {

    _.isString(props) && (props = {
        ...options,
        event: props,
    })

    const retrieve = useAutoBind({
        ...props
    })

    usePassiveBind({ stream: retrieve.stream, action: 'updated', intercept: retrieve.dispatch })

    return retrieve
}
export default useRetrieve