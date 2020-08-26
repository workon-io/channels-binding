import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import LinearProgress from '@material-ui/core/LinearProgress';
import Pagination from '@material-ui/lab/Pagination';
import OverflowTip from '@channels-binding/core/utils/OverflowTip';
import BooleanField from '../fields/Boolean';
import Field from '../fields/Field';

const useStyles = makeStyles(theme => ({
    root: {
        position: 'relative'
    },
    table: {
        tableLayout: 'auto',
        '& td, & th': {
            padding: '2px 5px 2px 5px',
            cursor: 'pointer',
        },
        '& thead ': {
            boxShadow: '0px 0px 3px 1px rgba(0, 0, 0, 0.18)',
        },
        '& thead th': {
            paddingTop: 13,
            paddingBottom: 9,
            background: theme.palette.head.main,
            borderBottom: 0
        },
        '& tbody tr:first-child td': {
            paddingTop: 10
        },
        '& tbody tr:last-child td': {
            paddingBottom: 10
        },
        '& td:first-child, & th:first-child': {
            paddingLeft: 10
        },
        '& td:last-child, & th:last-child': {
            paddingRight: 10
        }
    },
    mainLayout: {
        overflowY: 'auto',
    },
    leftLayout: {
        width: 170,
        position: 'absolute',
        overflow: 'hidden',
        zIndex: 1,
        pointerEvents: 'none',
        '&::after': {
            content: '" "',
            width: 100000,
            position: 'absolute',
            top: -100,
            bottom: -100,
            right: 30,
            boxShadow: '0px 3px 1px -2px rgba(0,0,0,0.2), 0px 2px 2px 0px rgba(0,0,0,0.14), 0px 1px 5px 0px rgba(0,0,0,0.12)',
            pointerEvents: 'none'
        }
    },
    leftLayoutInner: {
        width: 140,
        overflow: 'hidden',
        background: 'white',
        pointerEvents: 'all',
    },
    sortLabelIcon: {
        position: 'absolute'
    },
    rowSelected: {
        // background: '#e8e8e8',
        background: theme.palette.primary.main,
        '& td, & th': {
            color: 'white',
            // color: theme.palette.info.main,
        },
    },
    pagination: {
        textAlign: 'center',
        margin: 5,
        '& > nav': {
            display: 'inline-block'
        }
    },
    add: {
        position: 'fixed',
        right: '5px',
        bottom: '5px',
    },

}));

class State {
    @observable columnHovered = null
    setColumHovered(index) { this.columnHovered = index }
}

const DataTable = props => {

    const {
        fetching,
        columns,
        rows,
        BodyRow,
        HeadRow,
        fixedColumnsLeft,
        page,
        limit,
        onPageChange,
        count,
        ...rest
    } = props
    const ref = React.useRef()
    const tableLeftRef = React.useRef()
    const tableRef = React.useRef()
    const TableLayout = React.forwardRef(({ layout }, ref) => {
        return <Table
            ref={ref}
            className={classes.table}
            size="small"
            style={{
                tableLayout: layout || 'auto' // fixed
            }}
            {...rest}
        >
            <DataTable.Head classes={classes} {...props} />
            <DataTable.Body classes={classes} {...props} />
        </Table>
    })
    const classes = useStyles();

    const [collapse, setCollapse] = React.useState(false)
    const handleResize = e => {
        const collapsed = tableRef.current.scrollWidth > ref.current.clientWidth
        if (collapsed !== collapse) { setCollapse(!collapsed) }

        if (fixedColumnsLeft && tableLeftRef.current && tableRef.current.rows.length) {
            tableLeftRef.current.style.width = tableRef.current.offsetWidth + 'px'
            const width = _.sumBy(_.slice(
                tableRef.current.rows[0].cells, 0, fixedColumnsLeft
            ), 'offsetWidth')
            tableLeftRef.current.parentElement.parentElement.style.width = (width + 30) + 'px'
            tableLeftRef.current.parentElement.style.width = width + 'px'
        }
    }

    React.useEffect(() => { handleResize() }, [])
    React.useEffect(() => {
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize)
    }, []);

    const paginator = count > limit && <DataTable.Pagination page={page} onChange={onPageChange} count={count} limit={limit} rows={rows} />

    return <div className={classes.root}>
        <div ref={ref} style={{
            overflowY: 'auto',
        }}>
            {/* {paginator} */}
            {/* {fixedColumnsLeft && collapse && <div className={classes.leftLayout}>
                <div className={classes.leftLayoutInner}>
                    <TableLayout ref={tableLeftRef} />
                </div>
            </div>} */}
            <div className={classes.mainLayout} >
                <TableLayout ref={tableRef} />
            </div>
            {paginator}
        </div>
        {/* <Pagination count={count} page={page} onChange={setPage} /> */}
    </div>
}

DataTable.Head = props => {
    const { columns, fetching, HeadRow, ...rest } = props
    const Row = HeadRow || DataTable.HeadRow
    return <TableHead>
        <Row columns={columns} {...rest} />
        {fetching && <TableRow><TableCell colSpan={'100%'} style={{ padding: 0 }}><LinearProgress /></TableCell></TableRow>}
    </TableHead>
}

DataTable.Body = props => {
    const { rows, BodyRow, ...rest } = props
    const Row = BodyRow || DataTable.BodyRow
    return <TableBody>
        {rows && rows.map((data) => (
            <Row key={data.id} data={data} {...rest} />
        ))}
    </TableBody>
}


DataTable.HeadRow = props => {
    const { columns, classes, ...rest } = props
    return <TableRow>
        {_.map(columns, col => {
            const {
                name,
                label,
                autowrap,
                render,
                minWidth,
                ...rest
            } = col
            const content = label || (label == '' ? label : name)

            return <TableCell
                key={name}
                align={props.align}
            // style={{
            //     minWidth: minWidth,
            //     // borderRight: '1px solid rgba(224, 224, 224, 1)'
            //     // width: `calc((100% - 0px) / ${columns.length}`
            // }}
            // {...rest}
            // sortDirection={orderBy === headCell.id ? order : false}
            >
                <TableSortLabel
                    classes={{
                        icon: classes.sortLabelIcon
                    }}
                // active={orderBy === headCell.id}
                // direction={orderBy === headCell.id ? order : 'asc'}
                // onClick={createSortHandler(headCell.id)}
                >
                    {/* { autowrap ? <OverflowTip width={autowrap}>{content}</OverflowTip> : content}   */}
                    <OverflowTip >{content}</OverflowTip>
                    {/* {orderBy === headCell.id ? (
                    <span className={classes.visuallyHidden}>
                        {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                    </span>
                    ) : null} */}
                </TableSortLabel>
            </TableCell>
        })}
    </TableRow>
}

DataTable.BodyRow = props => {
    const { data, columns, classes, selected, children, ...rest } = props
    return <>
        <TableRow
            // {...rest}
            onClick={props.onClick}
            className={clsx(classes.row, selected && classes.rowSelected)}
        >
            {_.map(columns, col => {
                const {
                    name,
                    label,
                    autowrap,
                    render,
                    type,
                    ...rest
                } = col

                let value = render ? render(data) : data[col.name]
                if (type) {
                    value = <Field type={type} value={value} {...rest} />
                }
                else if (value === true || value === false) {
                    value = <BooleanField value={value} />
                }
                else if (value === null) {
                    value = <BooleanField value={value} />
                }
                else if (value === null) {
                    value = <BooleanField value={value} />
                }
                return <TableCell
                    key={name}
                    align={props.align}
                    style={autowrap ? { maxWidth: autowrap } : {}}
                >
                    {autowrap ? <OverflowTip width={autowrap}>{value}</OverflowTip> : value}
                </TableCell>
            })}
        </TableRow>
        {React.Children.count(children) > 0 && <tr style={{ display: 'none' }}><td colSpan='100%'>{children}</td></tr>}
    </>
}

DataTable.Pagination = ({ page, count, limit, rows, onChange }) => {
    const classes = useStyles();
    const handleChange = (e, page) => onChange && onChange(page)
    return count && rows && rows.length && <div className={classes.pagination}>
        <Pagination count={parseInt(count / (limit || rows.length)) + 1} page={Math.max(1, Math.min(count, page))} color="primary" onChange={handleChange} showFirstButton showLastButton />
        {rows.length} of {count}
    </div> || null

}

export default DataTable