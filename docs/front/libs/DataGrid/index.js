import { Table, TableContainer, TableBody, TableHead, LinearProgress } from '@material-ui/core';
import Pagination from './Pagination'
import TableHeadRow from './TableHeadRow'
import TableBodyRow from './TableBodyRow'
import NoRowOverlay from './NoRowOverlay'
import styles from './styles'


const useStyles = makeStyles(styles);

const DataGrid = ({

    eachRows,
    height = 'auto',
    maskHeadsOnEmpty = true,
    emptyMessage = 'No result',

    columns: defaultColumns,
    count: defaultCount,
    rows: defaultRows,
    page: defaultPage,
    limit: defaultLimit,
    order: defaultOrder,

    defaultEmptyMessage = 'No results',
    linkRowTo = null,
    rowProps,
    onChange,

    children,

    stream,
    filters,
    intercept,
    pk = 'id',
    ...props

}) => {

    const classes = useStyles();
    const history = useHistory()
    const [page, setPage] = React.useState(defaultPage || 1)
    const [limit, setLimit] = React.useState(defaultLimit || 25)
    const [order, setOrder] = React.useState(defaultOrder)

    const { fetching, data, search } = useSearch({
        stream,
        passive: Boolean(defaultRows),
        data: { rows: defaultRows, },
        filters,
        page,
        limit,
        order,
        intercept: intercept,
        ...props
    })
    let finalRows = data.rows && data.rows.length > 0 ? data.rows : (defaultRows || [])
    const finalColumns = defaultColumns ? (_.isFunction(defaultColumns) ? defaultColumns(data) : defaultColumns) : []
    const finalCount = data.count // || defaultCount || (finalRows ? finalRows.length : 0)
    const finalLimit = data.limit
    const finalPage = data.page
    const finalOrder = data.order || order || null

    const paginator = data.count > limit && <Pagination
        page={finalPage}
        onChange={setPage}
        count={finalCount}
        limit={finalLimit}
        rows={finalRows}
    />

    if (order && (!stream || defaultRows)) { // Not streamed content case
        const asc = _.startsWith(order, '-')
        finalRows = _.orderBy(finalRows, row => _.get(row, _.trim(order, '-')) || (asc ? null : ''), [asc ? 'asc' : 'desc']);
    }

    const handleRowClick = data => {
        if (linkRowTo) {
            const to = linkRowTo(data)
            _.startsWith(to, 'http') ?
                document.location.href = to
                :
                history.push(to)
        }
    }

    React.useEffect(() => {
        defaultRows
    }, [defaultRows])

    React.useEffect(() => {
        onChange && onChange(({
            count: finalCount,
            order: finalOrder,
            page: finalPage,
            limit: finalLimit,
            rows: finalRows,
            fetching
        }))
    }, [finalCount, finalOrder, finalPage, finalLimit, finalRows, fetching])

    return <div className={classes.root}>
        <TableContainer className={classes.container} style={{ height }}>
            <Table
                className={classes.table}
                stickyHeader={true}
            >
                {((!maskHeadsOnEmpty || fetching) || (finalRows && finalRows.length > 0)) && <TableHead>
                    <TableHeadRow
                        columns={finalColumns}
                        order={finalOrder}
                        setOrder={setOrder}
                        classes={classes}
                    />
                    <tr style={{ position: 'relative' }}>
                        <td colSpan={'100%'} style={{ position: 'absolute', left: 0, right: 0, height: 4, padding: 0 }}>
                            {fetching && <LinearProgress />}
                        </td>
                    </tr>
                </TableHead>}
                <TableBody>
                    {finalRows && finalRows.length ?
                        _.map(finalRows, data => <TableBodyRow
                            key={data[pk] || key(data)}
                            stream={stream}
                            pk={pk}
                            data={data}
                            rowProps={rowProps}
                            columns={finalColumns}
                            onClick={handleRowClick}
                        />)
                        :
                        (!fetching && emptyMessage != null && <tr style={{ position: 'relative' }}>
                            <td colSpan={'100%'} style={{ padding: 10, textAlign: 'center' }}>
                                <NoRowOverlay message={emptyMessage} />
                            </td>
                        </tr>)
                    }
                </TableBody>
            </Table>
        </TableContainer>
        <div style={{ position: 'sticky', bottom: 0, zIndex: 1 }}>
            {paginator}
        </div>
    </div >
}

export default DataGrid