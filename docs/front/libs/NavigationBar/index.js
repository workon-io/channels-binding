import { useBind, useDebouncedState } from '@channels-binding/core'
import MenuIcon from '@material-ui/icons/Menu';
import SearchIcon from '@material-ui/icons/Search';
import CloseIcon from '@material-ui/icons/Close';
import Buttons from './Buttons';
import SuggestionItems from './SuggestionItems'
import { Loading, Cookies } from 'libs'


import {
    Popper,
    Paper,
    InputBase,
    Divider,
    IconButton,
    ClickAwayListener,
    AppBar,
    Toolbar,
    Box,
    List,
} from '@material-ui/core';


const useStyles = makeStyles((theme) => ({

    root: {
        background: 'white',
        color: theme.palette.text.primary
    },
    popper: {
        zIndex: 999,
        left: '-5px !important',
    },
    paper: {
        padding: '2px 4px',
        display: 'flex',
        alignItems: 'center',
    },
    paperPopper: {
        minHeight: 70,
        maxHeight: 400,
        overflowY: 'auto',
        display: 'block'
    },
    input: {
        marginLeft: theme.spacing(1),
        flex: 1,
        minWidth: 100
    },
    iconButton: {
        padding: 10,
    },
    divider: {
        height: 28,
        margin: 4,
    },
    suggestions: {
        width: '100%',
        backgroundColor: theme.palette.background.paper,
    },
    query: {
        color: theme.palette.warning.dark
    },
}));

const NavigationBar = ({

    event,
    cache = 'default',
    options: defaultOptions,
    filters: defaultFilters,
    onChange,
    buttons,
    beforeInput,

}) => {

    // States
    const classes = useStyles();
    const queryInputRef = React.useRef()
    const options = _.defaultsDeep(defaultOptions, {
        items: {
            query: {
                icon: SearchIcon,
                toggle: ({ data, filters, remove }) => remove ? _.omit(filters, 'query') : { ...filters, query: data },
                getLabel: ({ data, filters }) => <span className={classes.query}>"{data.query}"</span>
            }
        }
    })
    const [filters, setFilters] = React.useState(_.defaults(cache && Cookies.get(`${event}.${cache}.filters`, {}), defaultFilters))
    const [query, debouncedQuery, setQuery] = useDebouncedState(cache && Cookies.get(`${event}.${cache}.queryFilters`, ''))
    const [focus, setFocus] = React.useState(false);
    const { data, refresh, fetching } = useBind({
        data: {},
        event: event,
        passive: !(focus && query),
        params: { query, filters },
        listen: [debouncedQuery, focus]
    })
    const anchorEl = React.useRef();
    const open = Boolean(focus && query);

    // Handlers
    const handleChangeQuery = e => {
        setQuery(e.target.value)
    }
    const handleClickAway = () => setFocus(false);
    const handleFocus = () => setFocus(true);
    const handleSearch = e => setFilters({ ...filters })
    const handleChange = filters => {
        setQuery('');
        setFilters(filters)
        setFocus(false);
        queryInputRef.current.focus()
    }
    const handleClear = e => {
        setQuery('');
        setFilters({})
        setFocus(false);
    }
    const handleKeyPress = e => {
        if (e.key == 'Enter') {
            refresh()
            setFilters(filters)
        }
    }

    // Effects
    React.useEffect(() => {
        // Send new Filters on filters changes
        onChange && onChange(filters)
    }, [filters])

    React.useEffect(() => {
        onChange && !filters.query && onChange({ ...filters, query: { query: debouncedQuery } })
    }, [debouncedQuery])


    React.useEffect(() => {
        // Store current filters and query in cookies
        Cookies.set(`${event}.${cache}.filters`, filters)
        Cookies.set(`${event}.${cache}.queryFilters`, debouncedQuery)
    }, [debouncedQuery, filters])

    return <AppBar position="static" className={classes.root} onMouseOut={e => setFocus(false)}>
        <Toolbar variant="dense" disableGutters>
            <Box flexGrow={1} >
                <ClickAwayListener onClickAway={handleClickAway} >
                    <Paper className={classes.paper} ref={anchorEl} >
                        {beforeInput && beforeInput({ onChange: handleChange, filters })}
                        <SuggestionItems
                            options={options}
                            filters={filters}
                            onChange={handleChange}
                        />
                        {/* <IconButton className={classes.iconButton} aria-label="menu">
                            <MenuIcon />
                        </IconButton> */}
                        <InputBase
                            ref={queryInputRef}
                            className={classes.input}
                            placeholder="Search"
                            onFocus={handleFocus}
                            onKeyPress={handleKeyPress}
                            onChange={handleChangeQuery}
                            inputProps={{
                                value: query,
                                'aria-controls': "nested-list-subheader",
                                'aria-autocomplete': 'list',
                            }}

                        />
                        <IconButton onClick={handleSearch} type="submit" className={classes.iconButton} aria-label="search">
                            <SearchIcon />
                        </IconButton>
                        <Divider className={classes.divider} orientation="vertical" />
                        <IconButton color="primary" className={classes.iconButton} aria-label="clear" onClick={handleClear}>
                            <CloseIcon />
                        </IconButton>
                        <Popper
                            // id={id} 
                            open={open}
                            anchorEl={anchorEl.current}
                            className={classes.popper}
                            role="presentation"
                        >
                            <Paper elevation={4} className={clsx(classes.paper, classes.paperPopper)} style={{ minWidth: anchorEl.current && anchorEl.current.offsetWidth }}>
                                {(fetching || !data) ? <Loading center /> :
                                    <List
                                        className={classes.suggestions}
                                        dense={true}
                                        role="menu"
                                        component="ul"
                                        aria-labelledby="nested-list-subheader"
                                    // subheader={
                                    //     <ListSubheader component="div" id="nested-list-subheader">
                                    //         Nested List Items
                                    //     </ListSubheader>
                                    // }
                                    >
                                        <SuggestionItems
                                            options={options}
                                            onChange={handleChange}
                                            filters={filters}
                                            data={data} />
                                    </List >}
                            </Paper>
                        </Popper >
                    </Paper>
                </ClickAwayListener>
            </Box>
            <Box>
                <Buttons buttons={buttons} filters={filters} onChange={handleChange} />
            </Box>
        </Toolbar>
    </AppBar>
}

export default NavigationBar