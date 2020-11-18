import ModelChoiceField from "./ModelChoiceField";

const ModelMultipleChoiceField = props => {

    const getValue = items => _.map(items, 'id')

    return <ModelChoiceField
        {...props}
        multiple
        getValue={props.getvalue || getValue}
    />
}

export default ModelMultipleChoiceField