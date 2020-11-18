import { OverflowTip } from 'libs';
import {
    TableSortLabel,
    TableCell,
    TableRow,
    Tooltip
} from '@material-ui/core';

export default ({
    columns,
    order,
    setOrder,
    classes
}) => {

    const orderSortable = order ? _.trim(order, '-') : null
    const orderDirection = order && _.startsWith(order, '-') ? 'asc' : 'desc'

    return <TableRow style={{
        position: 'sticky',
        zIndex: 1
    }}>
        {_.map(columns, column => {

            const isSortable = column.sortable !== false && (column.sortable || column.field)
            const sortable = isSortable && _.isString(column.sortable) ? column.sortable : column.field
            const isSorted = isSortable && orderSortable === sortable
            const handleCellClick = e => {
                sortable && setOrder(
                    isSorted ? (
                        orderDirection === 'desc' ? `-${sortable}` : (
                            orderDirection === 'asc' ? null : `${sortable}`
                        )
                    ) : `${sortable}`
                )
            };
            const label = column.description ?
                <Tooltip arrow className title={column.description}><span>{column.label}</span></Tooltip>
                :
                column.label
            return <TableCell
                key={column.field || key(column)}
                align={column.align || 'left'}
                padding={column.disablePadding || 'default'}
                sortDirection={isSorted ? orderDirection : false}
                onClick={handleCellClick}
            >
                {isSortable && isSorted ?
                    <TableSortLabel
                        active={isSorted}
                        direction={orderDirection}
                    >
                        {label}
                    </TableSortLabel> : label}
            </TableCell>
        })}
    </TableRow >
}