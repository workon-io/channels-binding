import useBind from './useBind'
import useDelete from './useDelete'

const useRetrieve = ({
    // data,
    action = 'retrieve',
    params = {},
    versatile = false,
    //listen: defaultListen,
    intercept: defaultIntercept,
    pk = 'id',
    ...props
}) => {
    const nominalIntercept = data => _.toString(data[pk]) == _.toString(params[pk])
    const intercept = defaultIntercept || (versatile ? null : nominalIntercept)
    //const listen = defaultListen || (versatile && [data])
    return useBind({
        //data,
        action,
        //params, //: data && data[pk] ? { ...params, id: data[pk] } : params,
        intercept,
        //listen,
        ...props
    })
}
export default useRetrieve