import SuggestionItem from './SuggestionItem'

const SuggestionsItems = props => {
    const chip = !_.isObject(props.data)

    return _.map(chip ? props.filters : props.data, (data, name) => (
        data && <SuggestionItem key={name} {...props} name={name} data={data} chip={chip} />
    ))
}

export default SuggestionsItems