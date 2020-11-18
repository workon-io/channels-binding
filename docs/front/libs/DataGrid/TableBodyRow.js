import { OverflowTip } from 'libs';
import { TableCell, TableRow, Tooltip } from '@material-ui/core';
import BooleanField from '../fields/Boolean';

export default ({
    stream,
    data: defaultData,
    pk = 'id',
    intercept,
    columns,
    rowProps = data => { },
    onClick,
}) => {

    let clickTime = 0;
    let pos = { x: 0, y: 0 };
    const { data, dispatch } = usePassiveBind({ stream, action: 'retrieve', hash: defaultData[pk], data: defaultData, pk })
    usePassiveBind({ stream, action: 'updated', hash: defaultData[pk], intercept: dispatch })

    return <TableRow
        onMouseDown={({ nativeEvent: e }) => { clickTime = Date.now(); pos.x = e.x; pos.y = e.y; }}
        onMouseUp={({ nativeEvent: e }) => { Date.now() - clickTime < 200 && pos.x === e.x && pos.y === e.y && onClick(data) }}
        {...rowProps(data)}
    >
        {_.map(columns, column => <Cell
            column={column}
            data={data}
            key={column.field || key(column)}
        />)}
    </TableRow>
}

const Cell = ({ data, column }) => {
    const styles = {}
    column.ellipsis && (styles.maxWidth = column.ellipsis)
    column.nowrap && (styles.whiteSpace = 'nowrap')
    const value = _.get(data, column.field, null)
    // nopadding && (styles.padding = 0)
    const rendering = column.render ? column.render(data) : value
    const content = (rendering === true || rendering === false) ?
        <BooleanField value={rendering} />
        : (
            column.ellipsis ?
                <OverflowTip width={column.ellipsis}>{rendering}</OverflowTip>
                :
                rendering
        )
    return <TableCell
        style={styles}
        align={column.align || 'left'}
        padding={column.disablePadding || 'default'}
    >
        {
            column.tooltip ?
                <Tooltip
                    title={_.isFunction(column.tooltip) ? column.tooltip(data) : column.tooltip}
                >
                    {content}
                </Tooltip>
                :
                content
        }

    </TableCell>
}