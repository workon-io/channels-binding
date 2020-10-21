import useBind from './useBind'
import React from 'react'


const useForm = ({
    object: defaultObject, // as initial data
    action = 'form',
    passive = false,
    params = {},
    intercept: defaultIntercept,
    onSuccess,
    onErrors,
    ...props
}) => {

    const [object, setObject] = React.useState(defaultObject);
    const [success, setSuccess] = React.useState(false);
    const [errors, setErrors] = React.useState(null);

    const intercept = defaultIntercept || ((newData, oldData, setData) => {
        if (newData.errors) {
            setErrors(newData.errors)
            onErrors && onErrors(newData.errors)
        }
        else if (newData.success === true) {
            setObject(newData.object)
            setSuccess(true)
            onSuccess && onSuccess(newData.object)
        }
        else {
            setData(newData)
        }
    })

    const { data, ...results } = useBind({
        data,
        action,
        passive,
        params: object && object.id ?
            { ...params, id: object.id } :
            { ...params, ...object },
        intercept,
        ...props
    })

    const setValue = (name, value) => setData({ ...data, [name]: value })

    const submit = overData => results.send(object && object.id ?
        { ...params, submit: overData, id: data.id } :
        { ...params, ...object, submit: overData, id: data.id }
    )

    const fields = data.fields || {}
    _.map(fields, field => {

        if (field.event && results.api) {
            field.stream = `${results.api.name}:${field.event}`
        }
        // console.log(field)
        fields[field.name] = field
    })

    return {
        ...results,
        object,
        fields,
        errors,
        success,
        setValue,
        submit
    }
}

export default useForm