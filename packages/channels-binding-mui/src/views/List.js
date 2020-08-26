import Table from '../Table';
import { useSearch, useBind } from '@channels-binding/core'

const styles = makeStyles(theme => ({
    root: {
        position: 'relative'
    },
    add: {
        position: 'fixed',
        right: '5px',
        bottom: '5px',
    },
}));

const List = ({
    bind,
    filters,
    columns,
    details,
    save,
    fields,
    ...props

}) => {

    const classes = styles();
    const [page, setPage] = React.useState(1)
    const [limit, setLimit] = React.useState(20)
    const [order, setOrder] = React.useState(null)
    const { data, fetching } = useSearch({
        bind,
        data: props.data,
        listen: [page, limit, order, filters],
        extraData: { page, limit, order, ...filters }
    })
    const Details = details || null
    const Save = save || null

    const BodyRow = ({ children, ...props }) => {
        const [open, setOpen] = React.useState(false);
        const [openSave, setOpenSave] = React.useState(false);
        const handleRowClick = e => setOpen(true)
        const handleRowDoubleClick = e => setOpenSave(true)
        const handleClose = e => setOpen(false)
        const handleCloseSave = e => setOpenSave(false)
        // const data = props.data
        const { data, fetch, fetching } = useBind({ bind, data: props.data })
        return <Table.BodyRow
            onClick={handleRowClick}
            onDoubleClick={handleRowDoubleClick}
            selected={open || openSave}
            {...props}
            data={data}
        >
            {open && Details && <Details setOpenSave={Save && setOpenSave} data={data} open={open} onClose={handleClose} />}
            {openSave && Save && <Save data={data} open={openSave} onClose={handleCloseSave} />}
        </Table.BodyRow>
    }

    return <div className={classes.root}>
        <Table
            {...props}
            {...data}
            fetching={fetching}
            limit={limit}
            page={page}
            order={order}
            onPageChange={setPage}
            // onOrderChange={setOrder}
            columns={_.isFunction(columns) ? columns(data) : columns}
            BodyRow={BodyRow}
        />
    </div>
};

export default List