import useAutoBind from './useAutoBind'
import usePassiveBind from './usePassiveBind'

const useInstance = (props, options = {}) => {

    _.isString(props) && (props = {
        ...options,
        event: props,
    })

    const [deleted, setDeleted] = React.useState(false)
    const retrieve = useAutoBind({
        ...props,
        action: 'retrieve'
    })

    usePassiveBind({ stream: retrieve.stream, action: 'updated', intercept: retrieve.dispatch })
    const remove = usePassiveBind({ stream: retrieve.stream, action: 'delete' })
    usePassiveBind({ stream: retrieve.stream, action: 'deleted', intercept: data => setDeleted(true) })

    return {
        deleted,
        remove: remove.dispatch,
        ...retrieve,
    }
}
export default useInstance