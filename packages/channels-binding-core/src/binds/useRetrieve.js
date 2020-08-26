import useBind from './useBind'
import useDelete from './useDelete'

const useRetrieve = ({
    data,
    action = 'retrieve',
    args = {},
    onData = (data, oldData, setData) => {
        if (data.id === oldData.id) {
            setData(data)
        }
    },
    ...props
}) => useBind({
    data,
    action,
    args: data && data.id ? { ...args, id: data.id } : args,
    onData,
    ...props
})
export default useRetrieve