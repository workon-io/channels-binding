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
    const nominalOnData = (data, oldData, setData) => {
        if (
            _.parseInt(data.id) === _.parseInt(oldData.id) ||
            (!oldData.id && data.id)
        ) {
            setData(data)
        }
    }
    const onData = defaultOnData || (versatile ? null : nominalOnData)
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