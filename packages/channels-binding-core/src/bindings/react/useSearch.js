import useBind from './useBind'

const useSearch = ({
    action = 'search',
    filters = {},
    page = 1,
    limit = 25,
    order = null,
    ...props
}) => {
    const results = useBind({
        action,
        params: _.merge({ filters, page, limit, order }, props.params),
        ...props
    })

    return {
        ...results,
        filters,
        search: results.send
    }
}
export default useSearch