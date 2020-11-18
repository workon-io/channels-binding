import StarIcon from '@material-ui/icons/Star'
import { ListItem, ListItemIcon, ListItemText, Chip } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
    root: {
        '&[aria-selected="true"]': {
            backgroundColor: theme.palette.action.selected,
        },
        '&[data-focus="true"]': {
            backgroundColor: theme.palette.action.hover,
        },
    },
    icon: {
        minWidth: 35
    },
    text: {
        whiteSpace: 'nowrap'
    },
    name: {
        color: theme.palette.success.main
    },
    nested: {
        paddingLeft: theme.spacing(4),
    },
}));

const SuggestionItem = props => {

    const {
        name,
        data,
        filters,
        onChange,
        options,
        chip,
    } = props

    if (_.has(data, 'count') && data.count <= 0) return null
    if (_.isArray(data)) {
        return _.map(data, data => <SuggestionItem key={key(data)} {...props} data={data} />)
    }

    const classes = useStyles();
    const itemOptions = _.defaults(options.items[name], {
        icon: StarIcon,
        toggle: ({ name, data, filters, remove }) => {
            const cleared = _.filter(filters[name], c => data.id != c.id)
            const newData = remove ? cleared : _.concat(cleared, [data])
            return newData.length ? { ...filters, [name]: newData } : _.omit(filters, name)
        },
    })
    const {
        toggle,
        icon,
        label: defaultLabel,
        getLabel,
    } = itemOptions
    const label = <span>{
        getLabel ?
            getLabel({ name, data, filters }) :
            <><small>{defaultLabel || _.camelCase(name)}: </small><span className={classes.name}>{data.name}</span></>
    }</span>
    const Icon = icon

    const handleAdd = e => onChange(toggle({ name, data, filters }))
    const handleDelete = e => onChange(toggle({ name, data, filters, remove: true }))

    return chip ?
        <Chip
            icon={<Icon name={name} data={data} filters={filters} />}
            label={label}
            onClick={handleDelete}
            onDelete={handleDelete}
            variant="outlined"
        />
        :
        <ListItem
            button
            dense={true}
            role="menuitem"
            component='li'
            className={classes.root}
            onClick={handleAdd}
        >
            <ListItemIcon className={classes.icon}><Icon name={name} data={data} filters={filters} /></ListItemIcon>
            <ListItemText
                className={classes.text}
                id={key(data)}
                primary={label}
            />
        </ListItem>
}

export default SuggestionItem