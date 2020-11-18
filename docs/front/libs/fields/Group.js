import TreeView from '@material-ui/lab/TreeView';
import TreeItem from '@material-ui/lab/TreeItem';
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
        // '&:focus > $content, &$selected > $content': {
        //     backgroundColor: '#e8f0fe !important',
        //     color: '#1a73e8 !important',
        // },
    },
    group: {
        paddingTop: 5,
        marginLeft: 7,
        paddingLeft: 5,
        margin: '0px -3px',
        borderLeft: '1px solid '+theme.palette.text.disabled
    },
    selected: {
        '& > div': {
            backgroundColor: theme.palette.primary.main,
            color: 'white'
        }
    },
    iconContainer: {
        marginRight: 2
    }
   
}));

const Group = ({ 
    label, 
    expanded,
    selected,
    children,
    onToggle
}) => {

    const nodeId = label
    const classes = styles();
    const handleToggle = (e, nodeIds) => onToggle(nodeIds)

    return <TreeView
        className={classes.root}
        defaultCollapseIcon={<ExpandMoreIcon />}
        defaultExpandIcon={<ChevronRightIcon />}
        // defaultEndIcon={<div style={{ width: 24 }} />}
        expanded={expanded ? [nodeId] : []}
        selected={selected ? [nodeId] : []}
        onNodeToggle={handleToggle}
        onSelect={e => e.stopPropagation() }
    >
        <TreeItem
            nodeId={nodeId}  
            label={label}
            classes={{
                root: clsx(classes.item),
                content: classes.content,
                expanded: classes.expanded,
                selected: classes.selected,
                group: classes.group,
                label: classes.label,
                iconContainer: classes.iconContainer
            }}
        >
            {children}
        </TreeItem>
    </TreeView>
}

export default Group