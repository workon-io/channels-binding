
const useStyles = makeStyles(theme => ({
    root: {
        
        background: theme.palette.head.main,
        // borderBottom: '1px solid rgba(224, 224, 224, 1)',
        position: 'sticky',
        top: 0,
        zIndex: 1,
        padding: theme.spacing(1),
        fontWeight: 500,
        textAlign: 'center',
        marginBottom: theme.spacing(1),

        boxShadow: '0px 0px 3px 1px rgba(0, 0, 0, 0.18)',
        // paddingTop: 20,
        // borderBottom: 0
    },
}))
const HeadTitle = props => {
    const classes = useStyles()
    return <div className={classes.root} {...props} />
}

export default HeadTitle