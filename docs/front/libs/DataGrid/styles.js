export default theme => ({
    root: {
        position: 'relative',
        boxShadow: '0px 2px 4px -1px rgba(0,0,0,0.2), 0px 4px 5px 0px rgba(0,0,0,0.14), 0px 1px 10px 0px rgba(0,0,0,0.12)',
    },
    table: {
        '& tr:hover': {
            outline: `1px solid ${theme.palette.secondary.main}`,
        },
        '& td, & th': {
            padding: '2px 5px 2px 5px',
            cursor: 'pointer',
        },
        '& thead ': {
            // boxShadow: '0px 0px 3px 1px rgba(0, 0, 0, 0.18)',
        },
        '& thead th': {
            background: theme.palette.primary.main,
            color: 'white',
            paddingTop: 10,
            paddingBottom: 3,
            borderBottom: 0
        },
        '& thead th span:hover, & thead th span:focus': {
            color: theme.palette.secondary.main
        },
        '& thead th:hover span, & thead th:focus span': {
            color: theme.palette.secondary.main
        },
        '& .MuiTableSortLabel-root.MuiTableSortLabel-active, & .MuiTableSortLabel-root.MuiTableSortLabel-active.MuiTableSortLabel-root.MuiTableSortLabel-active .MuiTableSortLabel-icon': {
            color: theme.palette.secondary.main
        },
        '& tbody tr:first-child td': {
            paddingTop: 10,
        },
        '& tbody tr:nth-of-type(even)': {
            backgroundColor: theme.palette.action.hover,
        },
        '& tbody tr td': {
            borderRight: '1px solid #00000014'
        },
        '& tbody tr:last-child td': {
            paddingBottom: 10,
        },
        '& td:first-child, & th:first-child': {
            paddingLeft: 10
        },
        '& td:last-child, & th:last-child': {
            paddingRight: 10,
            borderRight: 0
        }
    },
    verticalSpan: {
        position: 'absolute',
        transform: 'translateX(-50%) translateY(-50%) rotate(-90deg)',
        fontSize: 12,
        whiteSpace: 'nowrap',
        padding: '0px 5px'
    },
    selected: {
        // background: '#e8e8e8',
        backgroundColor: `${theme.palette.primary.main} !important`,
        '& td, & th': {
            color: 'white',
            // color: theme.palette.info.main,
        },
    }

})