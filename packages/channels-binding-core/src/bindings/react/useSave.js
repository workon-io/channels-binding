import useBind from './useBind'
import React from 'react'


const useSave = ({
    data: initialData, // as initial data
    action = 'save',
    passive = true,
    params = {},
    intercept: defaultIntercept,
    onSuccess,
    onErrors,
    ...props
}) => {

    const [data, setData] = React.useState(initialData);
    const [success, setSuccess] = React.useState(false);
    const [errors, setErrors] = React.useState(null);
    const intercept = defaultIntercept || ((newData, oldData, setData) => {
        if (newData.errors) {
            setSuccess(false)
            setErrors(newData.errors)
            console.error(newData.errors)
            onErrors && onErrors(newData.errors)
        }
        else {
            setData({ ...data, id: newData.id })
            setErrors(null)
            setSuccess(true)
            onSuccess && onSuccess(data)
        }
    })

    const setValue = (name, value) => setData({ ...data, [name]: value })

    const results = useBind({
        action,
        passive,
        params: data && data.id ? { ...params, id: data.id } : params,
        intercept,
        ...props
    })
    const submit = overData => results.send({ ...(overData || data), id: data.id })

    React.useEffect(() => {
        setData(initialData)
    }, [initialData])

    return {
        ...results,
        data,
        errors,
        success,
        setValue,
        submit
    }
}

export default useSave