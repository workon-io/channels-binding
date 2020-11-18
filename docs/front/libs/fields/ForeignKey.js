import Autocomplete from '@material-ui/lab/Autocomplete';
import { useSearch, useBind } from '@channels-binding/core'

import { TextField, FormControl, FormHelperText } from '@material-ui/core';

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

const SearchSelect = ({
	label,
	value: id,
	stream,
	onChange,
	multiple,
	helpText,
	errors,
	getValue = item => item.id,
	getOptionLabel = item => {
		try {
			return item.name || item.label
		}
		catch (e) {
			return item.id
		}
	},
	renderInput = params => <TextField
		{...params}
		label={label}
	/>,
}) => {
	const classes = styles();

	const [filters, setFilters] = React.useState({})
	const [page, setPage] = React.useState(1)
	const [limit, setLimit] = React.useState(20)
	const [order, setOrder] = React.useState(null)
	const { data: valueObject } = useBind({
		stream,
		action: 'retrieve',
		data: { id },
		params: { id },
		listen: [id],
		passive: !Boolean(id)
	})
	const { data: results, search } = useSearch({
		stream,
		passive: true,
		listen: [page, limit, order, filters],
		params: { page, limit, order, ...filters }
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

export default SearchSelect