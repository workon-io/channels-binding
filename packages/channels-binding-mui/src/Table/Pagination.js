import TablePagination from '@material-ui/lab/Pagination';

const useStyles = makeStyles(theme => ({
    root: {
        textAlign: 'center',
        paddingTop: 10,
        paddingBottom: 5,
        fontSize: 11,
        '& > nav': {
            display: 'inline-block',
            marginRight: 5
        },
        '&:last-child': {
            paddingBottom: 10,
        }
    },
    dark: {
        background: theme.palette.primary.main,
        color: 'white',
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


    }

}));

const Pagination = ({
    page,
    count,
    limit,
    rows,
    onChange,
    dark = true
}) => {
    const classes = useStyles();
    const handleChange = (e, page) => onChange && onChange(page)
    return count && rows && rows.length && <div
        className={clsx(classes.root, dark && classes.dark)}
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
        {rows.length} of {count}
    </div> || null
}

export default Pagination