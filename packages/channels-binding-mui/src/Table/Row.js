import TableRow from '@material-ui/core/TableRow';


const useStyles = makeStyles(theme => ({
    root: {
        '&:hover': {
            outline: `1px solid ${theme.palette.secondary.main}`,
        }
    },
    selected: {
        // background: '#e8e8e8',
        backgroundColor: `${theme.palette.primary.main} !important`,
        '& td, & th': {
            color: 'white',
            // color: theme.palette.info.main,
        },
    }
}));

const Row = ({ isHead = false, ...props }) => isHead ? <HeadRow  {...props} /> : <BodyRow {...props} />

const HeadRow = ({
    ...props
}) => {

    return <TableRow {...props} >{props.children}</TableRow>
}

const BodyRow = ({
    selected,
    ...props
}) => {
    const classes = useStyles();

    return <TableRow
        classes={{
            root: classes.root,
            selected: classes.selected,
            hover: classes.hover
        }}
        {...props}
    >
        {props.children}
    </TableRow>
}

export default Row

//  {React.Children.count(children) > 0 && <tr style={{ display: 'none' }}><td colSpan='100%'>{children}</td></tr>}