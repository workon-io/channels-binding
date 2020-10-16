import useBind from './useBind'

const useDelete = ({
    data: initialData, // as initial data
    action = 'delete',
    passive = true,
    args = {},
    onData: defaultOnData,
    onSuccess,
    onErrors,
    ...props
}) => {

    const [data, setData] = React.useState(initialData);
    const [success, setSuccess] = React.useState(false);
    const [errors, setErrors] = React.useState(null);
    const onData = defaultOnData || ((newData, oldData, setData) => {
        if (newData.id === initialData.id) {
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
        args: data && data.id ? { ...args, id: data.id } : args,
        onData,
        ...props
    })
    const submit = overData => results.send({ ...(overData || {}), id: data.id })

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