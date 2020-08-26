import Chip from '@material-ui/core/Chip';
import Tooltip from '@material-ui/core/Tooltip';
import TreeView from '@material-ui/lab/TreeView';
import MuiTreeItem from '@material-ui/lab/TreeItem';
import Typography from '@material-ui/core/Typography';
import FolderIcon from '@material-ui/icons/Folder';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import ArrowRightIcon from '@material-ui/icons/ArrowRight';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';

const styles = makeStyles(theme => ({
    root: {
        padding: '0px 5px',
        overflow: 'auto',
        color: theme.palette.text.secondary,
        '&:focus > $content': {
            backgroundColor: `var(--tree-view-bg-color, ${theme.palette.grey[400]})`,
            color: 'var(--tree-view-color)',
        },
        '&:focus > $content, &$selected > $content': {
            backgroundColor: '#e8f0fe !important',
            color: '#1a73e8 !important',
        },
    },
    group: {
        paddingTop: 5,
        marginLeft: 7,
        paddingLeft: 5,
        margin: '0px -3px',
        borderLeft: '1px solid ' + theme.palette.text.disabled
    },
    selected: {
        '& > $content': {
            backgroundColor: '#fee8e8 !important',
            color: '#e81a1a !important',
        }
    },
    targeted: {
        color: theme.palette.text.error,
        '& > $content': {
            backgroundColor: '#fee8e8 !important',
            color: '#e81a1a !important',
        }
    },
}));

const moves = {}

const Tree = props => {
    const {
        label,
        value,
        data,
        expanded,
        onSelect,
        onChange,
        onToggle,
        onMove,
        onClear,
        showLabel
    } = props;

    const classes = styles()
    const editable = API.company.user.is_superuser
    const selected = value

    // const getDescendantsIds = ids => _.flattenDeep(_.map(ids, id => [ id === 0 ? null : id, getDescendantsIds( _.map( parents[ id ], 'id' )) ]))



    if (onSelect || onChange) {

        const parents = { null: [] }
        _.map(data, (item, id) => {
            !parents[item.parent_id] && (parents[item.parent_id] = [])
            parents[item.parent_id].push(item)
        })

        const handleToggle = (e, nodeIds) => onToggle(nodeIds);
        const handleSelect = (e, nodeIds) => {
            const newSelected = nodeIds //_.xor( selected, nodeIds )
            // setSelected( newSelected );
            onSelect && onSelect(newSelected)
            onChange && onChange(newSelected)
            // onChange( getDescendantsIds( _.map( newSelected, _.toInteger ) ) )
        };

        const mouseMove = e => {
            if (editable) {
                const { x0, y0, node } = moves
                const x = e.clientX - x0
                const y = e.clientY - y0
                node.style.transform = `translate3d(${x}px, ${y}px, 0)`
                node.style.pointerEvents = `none`
            }
        }

        const mouseUp = e => {
            if (editable) {
                const { node, data, target } = moves
                document.removeEventListener('mousemove', mouseMove)
                document.removeEventListener('mouseup', mouseUp)
                node.style.transform = ``
                node.style.pointerEvents = ``
                if (target) onMove({
                    id: data.id,
                    parent: target.id
                })
                //     API.component.send('move_category', {
                //         id: data.id,
                //         parent: target.id
                //     })
                // }
                moves.move = false
                e.stopPropagation()
            }
        }

        const TreeItem = ({ item, children }) => {
            const classes = styles();
            const nodeId = _.toString(item.id)
            const isSelected = _.indexOf(selected, nodeId) !== -1
            const ref = React.useRef()
            const [targeted, setTargeted] = React.useState(false)

            const mouseDown = e => {
                if (editable) {
                    document.addEventListener('mousemove', mouseMove)
                    document.addEventListener('mouseup', mouseUp)
                    document.onselectstart = new Function("return false")
                    moves.x0 = e.clientX
                    moves.y0 = e.clientY
                    moves.item = item
                    moves.node = ref.current
                    moves.move = true
                    moves.target = null
                    e.stopPropagation()
                    return false
                }
            }

            const mouseOver = e => {
                if (editable && moves.move && moves.item.id !== item.id) {
                    moves.target = item
                    setTargeted(true)
                    e.stopPropagation()
                }
            }
            const mouseOut = e => {
                if (editable && moves.move && moves.item.id !== item.id) {
                    setTargeted(false)
                    e.stopPropagation()
                }
            }

            return <MuiTreeItem
                ref={ref}
                nodeId={nodeId}
                onMouseOver={mouseOver}
                onMouseOut={mouseOut}
                onMouseDown={mouseDown}
                label={item.name}
                classes={{
                    root: clsx(classes.item, isSelected && classes.selected, targeted && classes.targeted),
                    content: classes.content,
                    expanded: classes.expanded,
                    selected: classes.selected,
                    group: classes.group,
                    label: classes.label,
                    iconContainer: classes.iconContainer
                }}
            >
                {children ? children : _.map(parents[item.id], item => item && <TreeItem key={item.id} item={item} />)}
            </MuiTreeItem>
        }

        console.log('Rebuild treeView')
        return <TreeView
            className={classes.root}
            defaultCollapseIcon={<ExpandMoreIcon />}
            defaultExpandIcon={<ChevronRightIcon />}
            defaultEndIcon={<div style={{ width: 24 }} />}
            expanded={expanded}
            selected={selected}
            onNodeToggle={handleToggle}
            onNodeSelect={handleSelect}
            multiSelect
        >
            {_.map(parents[null], item => item && <TreeItem key={item.id} item={item} />)}
            <TreeItem children={null} item={{
                id: null,
                name: 'Others',
            }} />
        </TreeView>

    }
    else {
        // _.map(selected, id => {
        //     console.log(id, data[id])
        // })
        const computedValue = _.join(_.map(selected, id => data[id] && data[id].name), "+")
        const computedLabel = <>
            {label && <>{label}: </>}
            {computedValue || (label ? 'n/a' : '')}
        </>
        return computedLabel

    }
}

export default Tree;