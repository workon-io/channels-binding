import SearchIcon from '@material-ui/icons/Search';
import { ListItem, ListItemIcon, ListItemText, Chip } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
    root: {
    },
    icon: {
        minWidth: 35
    },
    text: {
        whiteSpace: 'nowrap'
    },
    query: {
        color: theme.palette.warning.dark
    },
}));

const QueryItem = props => {

    const {
        data,
        filters,
        onChange,
        chip
    } = props

    if (_.isArray(data)) {
        return _.map(data, data => data.count > 0 && <QueryItem key={key} {...props} data={data} />)
    }

    const classes = useStyles();
    const handleAdd = e => {
        onChange({ ...filters, query: data })
    }
    const handleDelete = e => {
        onChange(_.omit(filters, 'query'))
    }

    const label = <span>
        <span className={classes.query}>"{data.query}"</span>
    </span>

    return chip ?
        <Chip
            icon={<SearchIcon />}
            label={label}
            onClick={handleDelete}
            onDelete={handleDelete}
            variant="outlined"
        />
        :
        <ListItem
            button
            dense={true}
            className={classes.root}
            onClick={handleAdd}
        >
            <ListItemIcon className={classes.icon}><SearchIcon /></ListItemIcon>
            <ListItemText
                className={classes.text}
                id={key(data)}
                primary={label}
            />
        </ListItem>
}

export default QueryItem