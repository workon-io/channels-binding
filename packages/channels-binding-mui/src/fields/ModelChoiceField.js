import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import { useSearch, useBind } from '@channels-binding/core'

const styles = makeStyles(theme => ({
    root: {
        padding: theme.spacing(0, 1),
        paddingTop: 0,
    },
    input: {
        marginTop: 0,
        padding: 0,
    },
    inputInput: {
        paddingBottom: 3
    },
}));

const ModelChoiceField = ({
    label,
    value: id,
    stream,
    onChange,
    multiple,
    helpText,
    errors,
    getValue: defaultGetValue,
    getOptionLabel: defaultGetOptionLabel,
    renderInput: defaultRenderInput,
}) => {
    const classes = styles();
    const getValue = defaultGetValue || (item => item.id)
    const renderInput = defaultRenderInput || (params => <TextField
        {...params}
        label={label}
    />)
    const getOptionLabel = defaultGetOptionLabel || (item => {
        try {
            return item.name || item.label
        }
        catch (e) {
            return item.id
        }
    })

    const [filters, setFilters] = React.useState({})
    const [page, setPage] = React.useState(1)
    const [limit, setLimit] = React.useState(20)
    const [order, setOrder] = React.useState(null)

    const { data: valueObject } = useBind({
        stream,
        action: 'retrieve',
        data: { id },
        args: { id },
        listen: [id],
        passive: !Boolean(id)
    })
    const { data: results, search } = useSearch({
        stream,
        passive: true,
        listen: [page, limit, order, filters],
        args: { page, limit, order, ...filters }
    })
    const { count, rows, } = results
    const handleChange = (e, item) => {
        if (onChange) {
            onChange(getValue(item))
        }
    }

    return <div className={classes.root}>
        <FormControl
            fullWidth
            className={classes.formControl}
            error={Boolean(errors)}
        >
            <Autocomplete
                multiple={multiple}
                options={results.rows || []}
                value={valueObject}
                onOpen={e => search()}
                onChange={handleChange}
                getOptionLabel={getOptionLabel}
                // getValue={getValue}
                renderInput={renderInput}
            // style={{ width: 300 }}
            />
            {errors && _.map(errors, error => <FormHelperText>{error}</FormHelperText>)}
        </FormControl>
    </div>
}

export default ModelChoiceField