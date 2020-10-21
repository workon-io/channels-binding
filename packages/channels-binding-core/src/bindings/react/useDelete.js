import useBind from './useBind'
import React from 'react'

const useDelete = ({
    data: initialData, // as initial data
    action = 'delete',
    passive = true,
    params = {},
    intercept: defaultIntercept,
    onSuccess,
    onErrors,
    pk = 'id',
    ...props
}) => {

    const [data, setData] = React.useState(initialData);
    const [success, setSuccess] = React.useState(false);
    const [errors, setErrors] = React.useState(null);
    const intercept = defaultIntercept || ((newData, oldData, setData) => {
        if (
            newData[pk] === initialData[pk] ||
            newData[pk] === params[pk]
        ) {
            if (newData.errors) {
                setSuccess(false)
                setErrors(newData.errors)
                console.error(newData.errors)
                onErrors && onErrors(newData.errors)
            }
            else {
                setErrors(null)
                setSuccess(true)
                onSuccess && onSuccess(data)
            }
        }
    })

    const results = useBind({
        action,
        passive,
        params: data && data[pk] ? { ...params, id: data[pk] } : params,
        intercept,
        ...props
    })
    const submit = overData => results.send({ ...(overData || {}), id: data[pk] })

    React.useEffect(() => {
        setData(initialData)
    }, [initialData])

    return {
        ...results,
        errors,
        success,
        deleted: success,
        submit
    }
}

export default useDelete