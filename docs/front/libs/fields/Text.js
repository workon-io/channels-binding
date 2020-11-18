import HelpIcon from '@material-ui/icons/Help';
import { Input, InputAdornment, Tooltip, FormControl, FormHelperText } from '@material-ui/core';

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

const TextField = ({
	label,
	value,
	defaultValue,
	onChange,
	helpText,
	errors,
	...props
}) => {
	const classes = styles();

	if (onChange) {
		const handleChange = e => onChange(e.target.value)
		return <div className={classes.root}>
			<FormControl
				fullWidth
				className={classes.formControl}
				error={Boolean(errors)}
			>
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
					{...props}
				/>
				{errors && _.map(errors, error => <FormHelperText>{error}</FormHelperText>)}
			</FormControl>
		</div>
	} else {
		return <>
			{label && <>{label}: </>}
			{value || (label ? 'n/a' : '')}
		</>
	}
}

export default TextField