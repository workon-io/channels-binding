import TablePagination from '@material-ui/core/Pagination';
import TextField from '@material-ui/core/TextField';

const useStyles = makeStyles(theme => ({
    root: {
        textAlign: 'center',
        paddingTop: 10,
        paddingBottom: 5,
        fontSize: 11,
        background: theme.palette.primary.main,
        color: 'white',
        '& > nav': {
            display: 'inline-block',
            marginRight: 5
        },
        '&:last-child': {
            paddingBottom: 10,
        },
        '& button': {
            color: 'white',
        },
        '& button:hover': {
            borderColor: 'white',
        },
        '& .Mui-selected': {
            backgroundColor: 'white',
            color: theme.palette.primary.main,
        },
        '& .Mui-selected:hover': {
            backgroundColor: 'white',
            color: theme.palette.primary.main,
        }
    },
    input: {
        height: 32,
        '& input': {
            paddingTop: 7,
            color: theme.palette.primary.main,
            width: 30
        }
    },
    textField: {
        background: 'white',
        borderRadius: 3
    }

}));

const Pagination = ({
    page,
    count,
    limit,
    rows,
    onChange,
}) => {
    const classes = useStyles();

    const [manualPage, debouncedManualPage, setManualPage] = useDebouncedState(page)
    const getPage = page => Math.max(1, Math.min(count, page))

    const handleChange = (e, page) => {
        setManualPage(getPage(page))
        onChange && onChange(getPage(page))
    }
    const handleManualChange = e => setManualPage(getPage(e.target.value))

    React.useEffect(() => {
        onChange && onChange(manualPage)
    }, [debouncedManualPage])

    return count && rows && rows.length && <div
        className={classes.root}
    >
        <TablePagination
            count={parseInt(count / (limit || rows.length)) + 1}
            page={Math.max(1, Math.min(count, page))}
            // color="white"
            onChange={handleChange}
            showFirstButton
            showLastButton
            variant="outlined"
            shape="rounded"
        />
        <TextField
            className={classes.textField}
            label="" size="small"
            variant="filled"
            value={manualPage}
            onChange={handleManualChange}
            InputProps={{
                className: classes.input
            }}
        />
        &nbsp;&nbsp;
        {rows.length} of {count}
    </div> || null
}

export default Pagination