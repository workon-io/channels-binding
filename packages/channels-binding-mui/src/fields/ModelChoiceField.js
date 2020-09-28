import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import { useSearch, useBind } from '@channels-binding/core'
import FieldWrapper from './Mixins/FieldWrapper';

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
        label,
        value: id,
        stream,
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
        passive = false,
        ...otherProps
    } = props
    const classes = styles();

    const [filters, setFilters] = React.useState({})
    const [page, setPage] = React.useState(1)
    const [limit, setLimit] = React.useState(20)
    const [order, setOrder] = React.useState(null)

    const { data: valueObject } = useBind({
        stream,
        action: 'retrieve',
        hash: Math.random(100),
        data: { id },
        args: { id },
        listen: [id],
        passive: passive || !Boolean(id)
    })
    const { data: results, search } = useSearch({
        stream,
        passive: true,
        listen: [page, limit, order, filters],
        args: { page, limit, order, ...defaultFilters, ...filters }
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

    return <FieldWrapper {...props}>
        {valueObject.email}
        {valueObject && renderOption(valueObject, { selected: true })}
        <Autocomplete
            multiple={multiple}
            options={results.rows || []}
            value={valueObject}
            onOpen={e => search()}
            onChange={handleChange}
            getOptionLabel={getOptionLabel}
            // getValue={getValue}
            renderOption={renderOption}
            renderInput={renderInput}
        // style={{ width: 300 }}
        />
    </FieldWrapper>
}

export default ModelChoiceField