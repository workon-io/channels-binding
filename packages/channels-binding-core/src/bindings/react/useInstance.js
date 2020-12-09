import useAutoBind from './useAutoBind'
import usePassiveBind from './usePassiveBind'

const useInstance = (props, options = {}) => {

    _.isString(props) && (props = {
        ...options,
        event: props,
    })

    const [deleted, setDeleted] = React.useState(false)
    const retrieve = useAutoBind({
        ...props
    })

    usePassiveBind({ stream: retrieve.stream, action: 'updated', intercept: retrieve.dispatch })
    usePassiveBind({ stream: retrieve.stream, action: 'deleted', intercept: data => setDeleted(true) })

    return {
        deleted,
        ...retrieve,
    }
}
export default useInstance