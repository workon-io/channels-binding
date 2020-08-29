
import TableBody from '@material-ui/core/TableBody';
import TableHead from '@material-ui/core/TableHead';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import LinearProgress from '@material-ui/core/LinearProgress';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import Pagination from '../Table/Pagination'
import Table from '../Table/Table'
import TableRow from '../Table/Row'
import TableCell from '../Table/Cell'
import { useSearch, Retrieve } from '@channels-binding/core'

const useStyles = makeStyles(theme => ({
    root: {
        position: 'relative',
        boxShadow: '0px 2px 4px -1px rgba(0,0,0,0.2), 0px 4px 5px 0px rgba(0,0,0,0.14), 0px 1px 10px 0px rgba(0,0,0,0.12)',
    },
    Create: {
        marginBottom: 65
    },
    add: {
        position: 'absolute',
        right: 5,
        bottom: -45,
        zIndex: 10,
    },
}));




const SearchTableWrapper = ({
    children,
    rows,
    ...props

}) => {

    const classes = useStyles();
    // const Retrieve = Retrieve || null
    // const Update = Update || null

    const BodyRow = ({
        data,
        View: Retrieve,
        ViewProps: RetrieveProps = {},
        Update,
        UpdateProps = {},
        Form,
        FormProps = {},
        Delete,
        DeleteProps = {},
        ...props
    }) => {

        const [openRetrieve, setOpenRetrieve] = React.useState(false);
        const [openUpdate, setOpenUpdate] = React.useState(false);
        const [openDelete, setOpenDelete] = React.useState(false);
        const [openForm, setOpenForm] = React.useState(false);
        const handleRowClick = e => setOpenRetrieve(Boolean(Retrieve))
        const handleRowDoubleClick = e => setOpenUpdate(Boolean(Update))
        const handleCloseRetrieve = e => setOpenRetrieve(false)
        const handleCloseUpdate = e => setOpenUpdate(false)
        const handleCloseDelete = e => setOpenDelete(false)

        return <>
            <TableRow
                onClick={handleRowClick}
                onDoubleClick={handleRowDoubleClick}
                selected={openRetrieve || openUpdate || openDelete}
                {...props}
            />
            {(openRetrieve || openUpdate || openDelete) && <tr style={{ display: 'none' }}><td colSpan='100%'>
                {Retrieve && openRetrieve && <Retrieve
                    setOpenUpdate={Update && setOpenUpdate}
                    setOpenDelete={Delete && setOpenDelete}
                    data={data}
                    open={openRetrieve}
                    onClose={handleCloseRetrieve}
                    {...RetrieveProps}
                />}
                {Update && openUpdate && <Update
                    setOpenRetrieve={Retrieve && setOpenRetrieve}
                    setOpenDelete={Delete && setOpenDelete}
                    data={data}
                    open={openUpdate}
                    onClose={handleCloseUpdate}
                    {...UpdateProps}
                />}
                {Form && openForm && <Form
                    setOpenForm={Form && setOpenForm}
                    data={data}
                    open={openForm}
                    onClose={handleCloseDelete}
                    {...FormProps}
                />}
                {Delete && openDelete && <Delete
                    setOpenRetrieve={Retrieve && setOpenRetrieve}
                    data={data}
                    open={openDelete}
                    onClose={handleCloseDelete}
                    {...DeleteProps}
                />}
            </td></tr>}
        </>
    }
    const BodyCell = props => <TableCell
        {...props}
    />

    const HeadRow = props => <TableRow
        isHead {...props}
    />
    const HeadCell = props => <TableCell
        isHead {...props}
    />

    const RowWrapper = props => {
        return (rows || children)({
            Row: props.isHead ? HeadRow : BodyRow,
            Cell: props.isHead ? HeadCell : BodyCell,
            ...props
        })
    }
    const wrapper = {
        classes,
        RowWrapper,
        ...props
    }

    return <SearchTable {...wrapper} />

};

const SearchTable = ({
    stream: defaultStream,
    filters,
    classes,
    RowWrapper,
    dark,
    paginationTop = false,
    onCreateRefresh = true,
    Create,
    CreateProps = {},
    ...props

}) => {

    const [page, setPage] = React.useState(1)
    const [limit, setLimit] = React.useState(20)
    const [order, setOrder] = React.useState(null)
    const [openCreate, setOpenCreate] = React.useState(false);
    const handleAddClick = e => {
        e.stopPropagation()
        setOpenCreate(true);
    }
    const handleCloseRetrieve = e => setOpenCreate(false)

    const { data, refresh, fetching, stream } = useSearch({
        stream: defaultStream,
        data: props.data,
        listen: [page, limit, order, filters],
        args: { page, limit, order, ...filters }
    })
    const { count, rows, } = data
    const paginator = count > limit && <Pagination
        page={data.page || page}
        onChange={setPage}
        count={count}
        limit={data.limit || limit}
        rows={rows}
        dark={dark}
    />

    if (onCreateRefresh) {
        CreateProps.onSuccess = refresh
    }

    return <div className={classes.root} >
        {paginationTop && paginator}
        <Table
            dark={dark}
            {...props}
            CreateProps={CreateProps}
            className={clsx(
                Create && classes.Create,
            )}
        >
            <TableHead>
                <RowWrapper isHead data={{}} />
                <tr style={{ position: 'relative' }}><td colSpan={'100%'} style={{ position: 'absolute', left: 0, right: 0, height: 4, padding: 0 }}>{fetching && <LinearProgress />}</td></tr>
            </TableHead>
            <TableBody>
                {_.map(data.rows, (rowData, i) => <Retrieve
                    // key={i}
                    // key={key(rowData)}
                    key={rowData.id}
                    stream={stream}
                    data={rowData}
                    passive
                >
                    {({ data }) => <RowWrapper
                        data={data}
                        refresh={refresh}
                    />}
                </Retrieve>
                )}
            </TableBody>
        </Table>
        <div style={{ position: 'sticky', bottom: 0 }}>
            {paginator}
        </div>
        {Create && <Fab
            className={classes.add}
            onClick={handleAddClick}
            color="primary"
            size="small"
            aria-label="add">
            <AddIcon />
        </Fab>}
        {openCreate && <div>
            {Create && <Create
                data={{}}
                open={openCreate}
                onClose={handleCloseRetrieve}
                {...CreateProps}
            />}
        </div>}
    </div >
}

export default SearchTableWrapper