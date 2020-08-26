import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import CheckIcon from '@material-ui/icons/Check';
import ClearIcon from '@material-ui/icons/Clear';

const useStyles = makeStyles(theme => ({
	root: {
		padding: '0 8px',
		display: 'block',
		fontSize: '1em',
	},
	checkbox: {
		padding: '0px 7px'
	},
	true: {
		color: theme.palette.success.main
	},
	false: {
		color: theme.palette.error.main
	},
	null: {
		color: theme.palette.head.main
	},
}));

const Icons = {
	true: CheckIcon,
	false: ClearIcon,
	null: ClearIcon,
	undefined: ClearIcon,
}

const BooleanField = ({
	label,
	value,
	inderterminate,
	onChange,
}) => {
	const classes = useStyles();
	if (onChange) {
		const [checked, setChecked] = React.useState(value == true);
		const handleChange = e => {
			setChecked(e.target.checked);
			if (inderterminate === false) {
				onChange(e.target.checked || null);
			} else {
				onChange(e.target.checked);
			}
		}

		React.useEffect(() => {
			_.isUndefined(value) && setChecked(false);
		}, [value]);

		return (<FormControl className={classes.root} variant="outlined">
			<FormControlLabel
				control={<Checkbox
					className={classes.checkbox}
					indeterminate={inderterminate !== false && _.isUndefined(value)}
					checked={checked}
					onChange={handleChange}
				/>}
				label={label}
			/>
		</FormControl>);

	} else {
		if (_.isUndefined(value)) return null;
		const Icon = Icons[value] || 'span';
		return <span>
			{label && <>{label}:</>}
			<Icon fontSize={'small'} className={classes[value]} />
		</span>
	}
}
export default BooleanField