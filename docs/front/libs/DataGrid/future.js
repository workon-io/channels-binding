import { useSearch, useRetrieve } from '@channels-binding/core'
import { DataGrid, useApiRef } from '@material-ui/data-grid';
// import { XGrid, useApiRef } from '@material-ui/x-grid';
import Pagination from '../Table/Pagination'
import LoadingOverlay from './LoadingOverlay'

const useStyles = makeStyles(theme => ({
    root: {
        '& > div': {
            height: 'auto !important'
        }
    },
    dataGrid: {
        borderColor: 'rgba(224, 224, 224, 1)',
        '& .MuiDataGrid-cell': {
            borderColor: '#f0f0f0'
        },
        '& .MuiDataGrid-columnsContainer': {
            borderColor: 'rgba(224, 224, 224, 1)'
        },
        '& .MuiDataGrid-iconSeparator': {
            color: 'rgba(224, 224, 224, 1)'
        }
    },
}));

const Table = ({
    stream,
    filters,
    intercept,

    eachRows,

    columns: defaultColumns,
    count: defaultCount,
    rows: defaultRows,
    page: defaultPage,
    limit: defaultLimit,
    order: defaultOrder,

    children,
    defaultEmptyMessage = 'No results',
    ...props

}) => {

    const classes = useStyles();
    // const apiRef = useApiRef();
    const [page, setPage] = React.useState(defaultPage)
    const [limit, setLimit] = React.useState(defaultLimit)
    // const [order, setOrder] = React.useState(defaultOrder)
    const [sortModel, setSortModel] = React.useState([
        { field: 'code', sort: 'asc' },
    ]);
    const order = sortModel && sortModel.length > 0 && `${sortModel[0].sort == 'desc' ? '-' : ''}${sortModel[0].field}`

    const columns = []
    _.map(defaultColumns, (col, i) => {
        columns.push({
            ...col,
            field: col.field || i,
            headerName: col.label || col.headerName || '',
            renderCell: col.render || col.renderCell,
            sortable: col.field ? true : false
        })
    })

    console.log(JSON.stringify({ page, limit, order, ...filters }))
    const { fetching, data, send: search } = useBind({
        stream,
        action: 'search',
        // passive: Boolean(defaultRows),
        // data: props.data,
        // listen: JSON.stringify([page, limit, order, filters]),
        params: { page, limit, order, ...filters },
        intercept: intercept
    })
    const rows = defaultRows || data.rows || []
    const finalCount = data.count || defaultCount || (rows ? rows.length : 0)
    const finalLimit = data.limit || limit || 25
    const finalPage = page || 1
    console.log(rows)

    const handleSortModelChange = (params) => {
        if (JSON.stringify(params.sortModel) !== JSON.stringify(sortModel)) {
            setSortModel(params.sortModel);
        }
    };
    const handlePageChange = (...args) => {
        console.log(args)
        // setPage(page)
    }


    // React.useEffect(() => {
    //     console.log(apiRef)
    //     // apiRef.current.updateRowData(rows);
    //     return () => { };
    // }, [apiRef, rows]);

    const paginator = finalCount > finalLimit && <Pagination
        page={finalPage}
        onChange={setPage}
        count={finalCount}
        limit={finalLimit}
        rows={rows}
    // dark={dark}
    />
    const onColumnHeaderClick = e => {
        console.log(e)
    }

    return <div className={classes.root} style={{ height: '100vh', width: '100%' }}>
        <DataGrid
            className={classes.dataGrid}
            components={{
                loadingOverlay: LoadingOverlay,
            }}
            onColumnHeaderClick={onColumnHeaderClick}
            rowHeight={25}
            rows={rows}
            disableExtendRowFullWidth={false}
            columns={columns}
            sortingMode="server"
            autoHeight
            pageSize={finalLimit}
            rowCount={finalCount}
            paginationMode="server"
            onPageChange={handlePageChange}
            sortModel={sortModel}
            onSortModelChange={handleSortModelChange}
            pagination={false}
            loading={fetching}
        // checkboxSelection
        />
        <div style={{ position: 'sticky', bottom: 0, zIndex: 1 }}>
            {paginator}
        </div>
    </div >
}

export default Table

// else {
//     React.Children.map(children({ data: {}, Row, Cell }), row => {
//         React.Children.map(row.props.children, (cell, i) => {
//             console.log(cell.props)
//             const { field, label, render } = cell.props
//             columns.push({
//                 field: field || i,
//                 headerName: label || '',
//                 renderCell: ({ api, data, field, rowModel }) => {
//                     return render ? render(data) : data[field || i]
//                 }
//             })
//         })
//     })
// }
// const SearchTableWrapper = props => {

//     const { stream, pk = 'id', children } = props
//     const history = useHistory()

//     const BodyRow = ({
//         data,
//         linkTo = null,
//         ...props
//     }) => {
//         const handleRowClick = e => linkTo && history.push(linkTo)
//         let clickTime = 0;
//         let pos = { x: 0, y: 0 };
//         return <TableRow
//             onMouseDown={({ nativeEvent: e }) => { clickTime = Date.now(); pos.x = e.x; pos.y = e.y; }}
//             onMouseUp={({ nativeEvent: e }) => { Date.now() - clickTime < 200 && pos.x === e.x && pos.y === e.y && handleRowClick() }}
//             // onClick={handleRowClick}
//             {...props}
//         />
//     }
//     const BodyCell = props => <TableCell {...props} />

//     const HeadRow = ({ linkTo, ...props }) => <TableRow head {...props} />
//     const HeadCell = props => <TableCell head {...props} />

//     const Row = ({
//         data,
//         extraData,
//         head,
//     }) => {
//         const retrieve = useRetrieve({ stream, data, pk, passive: true, deletable: true })

//         return _.isFunction(children) ? children({
//             Row: head ? HeadRow : BodyRow,
//             Cell: head ? HeadCell : BodyCell,
//             ...retrieve,
//             ...extraData,
//         }) : 'n/a'
//     }

//     return <SearchTable Row={Row} {...props} />

// }
