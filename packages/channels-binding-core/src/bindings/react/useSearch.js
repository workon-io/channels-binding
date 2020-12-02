import useBind from './useBind'

const useSearch = (props, options = {}) => {

    _.isString(props) && (props = {
        ...options,
        event: props
    })

    const {
        action = 'search',
        filters = {},
        page = 1,
        limit = 25,
        order = null,
        ...otherProps
    } = props


    const results = useBind({
        action,
        params: _.merge({ filters, page, limit, order }, otherProps.params),
        ...otherProps
    })

    return {
        ...results,
        filters,
        search: results.send
    }
}
export default useSearch