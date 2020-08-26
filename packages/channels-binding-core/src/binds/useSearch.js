import useBind from './useBind'

const useSearch = ({
    action = 'search',
    ...props
}) => {
    const results = useBind({
        action,
        ...props
    })

    return {
        ...results,
        search: results.send
    }
}
export default useSearch