import useBind from './useBind'
import useDelete from './useDelete'

const useRetrieve = ({
    data,
    action = 'retrieve',
    args = {},
    versatile = false,
    listen: defaultListen,
    onData: defaultOnData,
    ...props
}) => {
    const onData = defaultOnData || (
        versatile ? null : ((data, oldData, setData) => {
            if (data.id === oldData.id) {
                setData(data)
            }
        })
    )
    const listen = defaultListen || (versatile && [data])
    return useBind({
        data,
        action,
        args: data && data.id ? { ...args, id: data.id } : args,
        onData,
        listen,
        ...props
    })
}
export default useRetrieve