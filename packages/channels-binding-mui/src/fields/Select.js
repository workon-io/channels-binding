import Input from '@material-ui/core/Input';
import InputAdornment from '@material-ui/core/InputAdornment';
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';
import CircularProgress from '@material-ui/core/CircularProgress';
import HelpIcon from '@material-ui/icons/Help';
import Tooltip from '@material-ui/core/Tooltip';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import { useSearch } from '@channels-binding/core'

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
	adornmentStart: {
		fontSize: 11,
		marginTop: 1,
		color: theme.palette.info.main,
	},
	adornmentEnd: {
		fontSize: 12,
		color: theme.palette.text.disabled
	}
}));

const SelectField = ({
	label,
	value,
	stream,
	defaultValue,
	choices,
	onChange,
	helpText,
	errors,
	...props
}) => {
	const classes = styles();

	if (onChange) {
		if (_.isArray(choices)) {
			choices = _.map(choices, choice => ({ label: choice[1], value: choice[0] }))
		}
		else if (_.isPlainObject(choices)) {
			choices = _.map(choices, (v, k) => ({ label: v, value: k }))
		}
		const { data, fetching } = useSearch({ stream, data: choices })
		if (data && data.results) {
			choices = _.map(data.results, (v, k) => ({ label: v.label, value: v.id }))
		}
		const [options, setOptions] = React.useState(choices || []);

		// const handleChange = (e, option) => onChange(option.value)
		const handleChange = e => onChange(e.target.value)
		const realValue = value || defaultValue
		return <div className={classes.root}>
			<FormControl
				fullWidth
				className={classes.formControl}
				error={Boolean(errors)}
			>
				<InputLabel id="demo-simple-select-label">{label}</InputLabel>
				<Select
					// labelId="demo-simple-select-label"
					// id="demo-simple-select"
					value={realValue}
					onChange={handleChange}
					fullWidth
					onKeyUp={e => e.keyCode === 13 && handleChange(e)}
					onFocus={e => e.stopPropagation()}
					{...props}
				>
					{_.map(choices, choice => <MenuItem key={key(choice)} value={choice.value}>
						{props.multiple && <Checkbox checked={realValue.indexOf(choice.value) > -1} />}
						{choice.label}
					</MenuItem>)}
				</Select>
				{errors && _.map(errors, error => <FormHelperText>{error}</FormHelperText>)}
			</FormControl>
			{/* <Autocomplete
				// open={open}
				// onOpen={() => {
				// 	setOpen(true);
				// }}
				// onClose={() => {
				// 	setOpen(false);
				// }}
				value={realValue}
				getOptionSelected={(option, value) => {
					console.log(value, option.value, option.value == realValue);
					return option.value == realValue ? option : false
				}}
				getOptionLabel={option => {
					console.log(option);
					return option.label
				}}
				options={options}
				onChange={handleChange}
				fullWidth
			renderInput={params => (
				<TextField
					{...params}
					defaultValue={value}
					label={label}
					fullWidth
					onKeyUp={e => e.keyCode === 13 && handleChange(e)}
					onFocus={e => e.stopPropagation()}
					// loading={loading}
					size="small"
					placeholder={label}
					margin={'dense'}
					// variant="outlined"
					InputProps={{
						...params.InputProps,
						endAdornment: (
							<>
								{loading ? <CircularProgress color="inherit" size={20} /> : null}
			{params.InputProps.endAdornment}
							</>
						),
					}}
/>
			)}
/> */}
		</div >
	} else {
		return <>
			{label && <>{label}: </>}
			{value || (label ? 'n/a' : '')}
		</>
	}
}

export default SelectField