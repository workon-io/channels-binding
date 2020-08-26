import Chip from '@material-ui/core/Chip';
import Button from '@material-ui/core/Button';
import CloseIcon from '@material-ui/icons/Close';

const useStyles = makeStyles((theme) => ({
    root: {
        // background: 'white',
        // color: theme.palette.info.main,
        background: theme.palette.primary.main,
        color: 'white',
        textTransform: 'none',
        fontWeight: 300
        // borderRadius: 3,
        // boxShadow: '0px 3px 1px -2px rgba(0,0,0,0.2), 0px 2px 2px 0px rgba(0,0,0,0.14), 0px 1px 5px 0px rgba(0,0,0,0.12);'
    }
}));

const FilterBadge = ({ onClear, children }) => {

    const classes = useStyles();

    return <Button
        variant="contained"
        size="small"
        className={classes.root}
        onClick={onClear}
        endIcon={<CloseIcon />}
    >
        {children}
    </Button>
    return <Chip
        elevation={3}
        className={classes.root}
        // size="small"
        label={children}
        onClick={onClear}
        onDelete={onClear}
    />
}

export default FilterBadge