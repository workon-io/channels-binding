import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import FieldWrapper from './Mixins/FieldWrapper';

const styles = makeStyles(theme => ({
	root: {
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

const ChoiceField = props => {
	const classes = styles();
	const {
		label,
		value,
		stream,
		getValue: defaultGetValue,
		getOptionLabel: defaultGetOptionLabel,
		renderInput: defaultRenderInput,
		renderOption: defaultRenderOption,
		defaultValue,
		choices,
		onChange,
		helpText,
		errors,
		...otherProps
	} = props

	if (onChange) {
		const [options, setOptions] = React.useState(choices || []);
		const getValue = defaultGetValue || (item => item.id)
		const getOptionLabel = defaultGetOptionLabel || (choice => {
			if (_.isObject(choice)) {
				try {
					return _.toString(choice.label || choice.name || choice.id)
				}
				catch (e) {
					return _.toString(choice)
				}
			}
			else {
				return _.toString(choice)
			}
		})
		const renderOption = defaultRenderOption || ((item, { selected }) => getOptionLabel(item))

		// const handleChange = (e, option) => onChange(option.value)
		const handleChange = e => onChange(choices[e.target.value])
		const valueObject = value || defaultValue
		return <FieldWrapper {...props}>
			<InputLabel id="demo-simple-select-label">{label}</InputLabel>
			<Select
				// labelId="demo-simple-select-label"
				// id="demo-simple-select"
				value={valueObject}
				onChange={handleChange}
				fullWidth
				onKeyUp={e => e.keyCode === 13 && handleChange(e)}
				onFocus={e => e.stopPropagation()}
				{...props}
			>
				{_.map(choices, (choice, i) => <MenuItem key={_.isObject(choice) ? key(choice) : i} value={i}>
					{props.multiple && <Checkbox checked={_.find(choices, valueObject) === i} />}
					{renderOption(choice, { selected: valueObject == choice })}
				</MenuItem>)}
			</Select>
		</FieldWrapper>
	} else {
		return <>
			{label && <>{label}: </>}
			{value || (label ? 'n/a' : '')}
		</>
	}
}

export default ChoiceField