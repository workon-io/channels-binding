
class State {
    @observable data = {}
    @action.bound setValue(name, value) {
        this.data = ({ ...this.data, [name]: value });
    }
}

const useFilters = (
    path, // ex: component.product,
    defaultData,
    filters,
    listen = [],
    fetching = true
) => {

    const state = new State()
    const setFilter = (...args) => state.setValue(...args)
    const [initalData, newFetching] = React.useState(data)


    const [condition, setCondition] = React.useState(defaultData || {});
    const [data, setData] = React.useState(defaultData || {});
    if (path) {
        const [api, model] = path.split('.')
        fetching = API[api].useEventEffect({
            [`${model}.search`]: {
                ...filters
            }
        }, newData => {
            newData.id === data.id && newData != data && setData(newData)
        }, _.isArray(listen) ? listen : [listen], fetching)
    }
    return [filters, setFilter]
}


export default useFilters