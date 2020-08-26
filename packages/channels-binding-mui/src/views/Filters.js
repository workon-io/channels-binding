import GenericField from "../fields/Field";
import useFilters from '@channels-binding/core/utils/useFilters'

class State {
    @observable data = {}
    @action.bound setValue(name, value) {
        this.data = ({ ...this.data, [name]: value });
    }
}

const Filters = ({
    path,
    data,
    defaultData,
    filters,
    listen,
    fetching,
    children,
    onChange
}) => {

    const state = new State()
    const setValue = (...args) => state.setValue(...args)
    const [initalData, newFetching] = React.useState(data)
    const [errors, setErrors] = React.useState(null);
    const ComponentField = observer(({ name, ...props }) => {
        if (_.isUndefined(state.data[name])) {
            state.data[name] = initalData[name]
        }
        const value = state.data[name] || ""
        const handleChange = value => setValue(name, value);
        const placeHolder = name || props.label
        return <div>
            <GenericField value={value} placeHolder={placeHolder} onChange={handleChange} {...props} />
        </div>
    })
    const Field = props => <ComponentField
        {...props}
    />

    const handleSubmit = e => {
        onChange(state.data)
    }
    return <Observer>{() => _.isFunction(children) ? children({
        Field,
        setValue,
        values: state.data,
        submit: handleSubmit,
        initalData: initalData,
        errors: errors
    }) : children}</Observer>
}

export default Filters
