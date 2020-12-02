import { DataGrid } from '@material-ui/data-grid';
import { useSearch } from "@channels-binding/core";
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';


export default () => {

    const [page, setPage] = React.useState(1)
    const [order, setOrder] = React.useState(null)
    const [filters, setFilters] = React.useState({})

    const { data, fetching } = useSearch({ stream: 'back1:app.User', page, order, filters })
    const { rows = [], count = 0, limit = 25 } = data

    const columns = [
        { field: 'id', headerName: 'ID', width: 70 },
        { field: 'first_name', headerName: 'First name', width: 150 },
        { field: 'last_name', headerName: 'Last name', width: 150 },
        { field: 'email', headerName: 'Email', width: 330 },
        { field: 'age', headerName: 'Age', width: 100 },
    ];

    return <Paper style={{ height: 500 }}>


        <div style={{ height: 400 }}>
            <h2>A binding sample from User model</h2>

            <TextField label="Search" onChange={e => setFilters({ query: e.target.value })} />
            <DataGrid
                loading={fetching}
                rowHeight={30}
                page={page}
                rows={rows}
                rowCount={count}
                columns={columns}
                pageSize={limit}
                onPageChange={params => setPage(params.page)}
                onSortModelChange={params => setOrder(`${params.sortModel[0].sort == 'asc' ? '' : '-'}${params.sortModel[0].field}`)}
                checkboxSelection
                sortingMode='server'
            />
        </div>
    </Paper>
}