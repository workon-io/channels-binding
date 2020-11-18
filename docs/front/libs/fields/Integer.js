import HelpIcon from '@material-ui/icons/Help';
import { quantify } from "libs";


import { Input, InputAdornment, Tooltip } from '@material-ui/core';


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

const Integer = ({
	label,
	value,
	units,
	scale,
	helpText,
	onChange,
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
				margin={'dense'}
				disableUnderline={true}
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
			/>
		</div>
	}
	else {
		let computedValue = value && <span>
			{quantity.best.value}
			<span className={classes.units}>{quantity.best.units}</span>
		</span>
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

Integer.defaultProps = {
	scale: 1,
	units: null,
};

export default Integer;