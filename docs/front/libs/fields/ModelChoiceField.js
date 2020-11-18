import Autocomplete from '@material-ui/lab/Autocomplete';
import { useSearch, useBind } from '@channels-binding/core'
import FieldWrapper from './Mixins/FieldWrapper';

import { TextField, FormControl, FormHelperText } from '@material-ui/core';

const styles = makeStyles(theme => ({
    root: {
        padding: theme.spacing(0, 1),
        paddingTop: 0,
    },
    flex: {
        display: 'flex'
    },
    input: {
        marginTop: 0,
        padding: 0,
    },
    inputInput: {
        paddingBottom: 3
    },
}));

const ModelChoiceField = props => {
    const {
        stream,
        passive = true,

        label,
        value,
        flex,
        filters: defaultFilters,
        onChange,
        multiple,
        helpText,
        errors,
        getValue: defaultGetValue,
        getOptionLabel: defaultGetOptionLabel,
        renderInput: defaultRenderInput,
        renderOption: defaultRenderOption,
        ...otherProps
    } = props
    const classes = styles();

    const [filters, setFilters] = React.useState({})
    const [page, setPage] = React.useState(1)
    const [limit, setLimit] = React.useState(20)
    const [order, setOrder] = React.useState(null)

    const retrieve = useRetrieve({
        stream,
        action: 'retrieve',
        hash: Math.random(100),
        data: value,
        params: { id: value && value.id },
        passive: passive, //passive || !Boolean(object.id)
    })
    const search = useSearch({
        stream,
        passive: true,
        page, limit, order, filters
    })

    const getValue = defaultGetValue || (item => item.id)
    const renderInput = defaultRenderInput || (params => <TextField
        {...params}
        value=''
        label={label}
    />)
    const getOptionLabel = defaultGetOptionLabel || (item => {
        try {
            return _.toString(item.name || item.label || item.id)
        }
        catch (e) {
            return _.toString(item.id)
        }
    })
    const renderOption = defaultRenderOption || ((item, { selected }) => getOptionLabel(item))
    const handleChange = (e, item) => {
        if (onChange) {
            onChange(getValue(item))
        }
    }

    if (onChange) {

        return <FieldWrapper {...props}>
            {retrieve.data && renderOption(retrieve.data, { selected: true })}
            <Autocomplete
                multiple={multiple}
                options={search.data.rows || []}
                value={retrieve.data}
                onOpen={e => search.search()}
                onChange={handleChange}
                getOptionLabel={getOptionLabel}
                // getValue={getValue}
                renderOption={renderOption}
                renderInput={renderInput}
            // style={{ width: 300 }}
            />
        </FieldWrapper>
    }
    else {
        return renderOption(retrieve.data, { selected: true })
    }

}

export default ModelChoiceField