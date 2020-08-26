import Input from '@material-ui/core/Input';
import InputAdornment from '@material-ui/core/InputAdornment';
import HelpIcon from '@material-ui/icons/Help';
import Tooltip from '@material-ui/core/Tooltip';
import quantify from "@channels-binding/core/utils/quantify";

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
		color: theme.palette.text.disabled,
		//fontStyle: 'italic'
	},
	units: {
		fontSize: 10,
		color: theme.palette.info.main,
		marginLeft: 2
		//fontStyle: 'italic'
	}
}));

const QuantityRange = ({
	label,
	value,
	units,
	scale,
	helpText,
	onChange,
	...props
}) => {
	const classes = styles();
	let quantity = quantify(value, units);
	// value && console.log( label, value )

	if (onChange) {
		const [error, setError] = React.useState(null);
		const handleChange = e => onChange(e.target.value)
		// value && console.log(quantity) 

		return <div className={classes.root}>
			<Input
				value={value || ''}
				classes={{
					root: classes.input,
					input: classes.inputInput,
				}}
				size="small"
				placeholder={label}
				// inputValue={inputValue}
				margin={'dense'}
				// disableUnderline={true}
				// label={label}
				// error={error}
				// helperText={error}
				onChange={handleChange}
				onKeyUp={e => e.keyCode === 13 && handleChange(e)}
				onFocus={e => e.stopPropagation()}
				startAdornment={value ? <InputAdornment className={classes.adornmentStart} position="start">
					{label}:
				</InputAdornment> : null}
				endAdornment={units && <InputAdornment className={classes.adornmentEnd} position="end">
					{quantity.input.units}
					{helpText && <Tooltip title={helpText}>
						<HelpIcon />
					</Tooltip>}
				</InputAdornment>}
				fullWidth
				{...props}
			/>
		</div>
	}
	else {
		let computedValue = value
		if (_.isArray(value) && value.length == 2) {
			const min = value[0] * scale
			const max = value[1] * scale
			const andOper = value => value < 0 ? value : `+${value}`
			computedValue = <span>
				{andOper(min)}/{andOper(max)}
				{units && <span className={classes.units}>{units}</span>}
			</span>
		}

		// let computedValue = value && <span>
		// 	{quantity.best.value} 
		// 	<span className={classes.units}>{quantity.best.units}</span>
		// </span>
		const computedLabel = <span>
			{label && <span className={classes.label}>{label}: </span>}
			{computedValue || (label ? 'n/a' : '')}
		</span>
		if (units == '%%') {
			return <RiskFactor value={computedValue} />
		}
		else {
			return <Tooltip title={`Scalar value: ${value}`}>
				{computedLabel || null}
			</Tooltip>
		}
	}
};

QuantityRange.defaultProps = {
	scale: 1,
	units: null,
};

export default QuantityRange;