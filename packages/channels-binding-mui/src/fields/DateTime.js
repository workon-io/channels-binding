import Tooltip from '@material-ui/core/Tooltip';


const styles = makeStyles(theme => (
    {
        root: {
        },
        date: {
        },
        time: {
            marginLeft: 5,
            fontSize: '70%'
        },
    }));

const DateTime = ({
    label,
    value,
    units,
    scale,
    helpText,
    onChange,
}) => {
    const date = new Date(value)
    const classes = styles();

    if (onChange) {
    }
    else {

        return (
            <Tooltip title={date.toGMTString()}>
                <span className={clsx(classes.root)}>
                    <span className={clsx(classes.date)}>{date.toLocaleDateString()}</span>
                    <span className={clsx(classes.time)}>{date.toLocaleTimeString()}</span>
                </span>
            </Tooltip>
        );
    }
}

export default observer(DateTime)