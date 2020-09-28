import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';

const styles = makeStyles(theme => ({
    root: {
        padding: theme.spacing(0, 1),
        paddingTop: 0,
    },
    flex: {
        verticalAlign: 'bottom',
        display: 'inline-flex'
    }
}));

const FielWrapper = ({
    fullWidth,
    errors,
    ...props
}) => {
    const classes = styles();
    return <div className={clsx(classes.root, !fullWidth && classes.flex)}>
        <FormControl
            className={classes.formControl}
            error={Boolean(errors)}
            {...(fullWidth ? { fullWidth } : {})}
        >
            {props.children}
            {errors && _.map(errors, error => <FormHelperText>{error}</FormHelperText>)}
        </FormControl>
    </div>
}

export default FielWrapper