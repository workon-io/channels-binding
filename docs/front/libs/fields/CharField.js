import HelpIcon from '@material-ui/icons/Help';
import FieldWrapper from './Mixins/FieldWrapper';

import { Input, InputAdornment, Tooltip } from '@material-ui/core';

const styles = makeStyles(theme => ({
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

const TextField = props => {
	const {
		forwardedRef,
		label,
		value,
		defaultValue,
		onChange,
		helpText,
		errors,
		...otherProps
	} = props
	const classes = styles();

	if (onChange) {
		const handleChange = e => onChange(e.target.value)
		return <FieldWrapper {...props}>
			<Input
				{...(defaultValue ? {
					defaultValue: defaultValue || ''
				} : {
						value: value || ''
					})}
				classes={{
					root: classes.input,
					input: classes.inputInput,
				}}
				size="small"
				placeholder={label}
				margin={'dense'}
				// disableUnderline={true}
				fullWidth
				onChange={handleChange}
				onKeyUp={e => e.keyCode === 13 && handleChange(e)}
				onFocus={e => e.stopPropagation()}
				startAdornment={value ? <InputAdornment className={classes.adornmentStart} position="start">
					{label}:
				</InputAdornment> : null}
				endAdornment={helpText && <InputAdornment className={classes.adornmentEnd} position="end">
					<Tooltip title={helpText}>
						<HelpIcon />
					</Tooltip>
				</InputAdornment>}
				{...otherProps}
			/>
		</FieldWrapper>
	} else {
		return <>
			{label && <>{label}: </>}
			{value || (label ? 'n/a' : '')}
		</>
	}
}



export default TextField