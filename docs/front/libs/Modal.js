import EditIcon from '@material-ui/icons/Edit';
import CloseIcon from '@material-ui/icons/Close';


import { IconButton, LinearProgress, Button, Drawer } from '@material-ui/core';


const styles = makeStyles(theme => ({
    root: {
        position: 'relative',
    },
    drawerPaper: ({ minWidth }) => ({
        minWidth: minWidth
    }),
    drawerHeader: {
        display: 'flex',
        alignItems: 'center',
        padding: theme.spacing(0, 0),
        // necessary for content to be below app bar
        // ...theme.mixins.toolbar,
        justifyContent: 'flex-start',
        background: theme.palette.primary.main,
        color: 'white',
        '& svg': {
            color: 'white',
        },
        '& > button': {
            borderRadius: 0
        }
    },
    sectionHeader: {
        background: 'white',
        borderBottom: '1px solid rgba(224, 224, 224, 1)',
        position: 'sticky',
        top: 0,
        zIndex: 1,
        padding: theme.spacing(1),
        fontWeight: 500,
        textAlign: 'center',
        marginBottom: theme.spacing(1)
    },
    button: {
        flex: 'auto',
        background: theme.palette.secondary.main,
        color: 'white',
        padding: 12,
    },
    backButton: {
        marginRight: 15,
        padding: 12
    },
}));

const Modal = ({
    title,
    open,
    onClose,
    fetching,
    children,
    minWidth,
    buttons = []
}) => {

    const classes = styles({ minWidth })
    const handleClose = onClose
    const paperRef = React.useRef()

    if (paperRef.current) {
        paperRef.current.style.minWidth = Math.max(paperRef.current.offsetWidth, minWidth) + 'px'
    }

    return <Drawer
        anchor={'right'}
        open={open}
        onClose={onClose}
        PaperProps={{
            ref: paperRef
        }}
        classes={{
            root: classes.drawer,
            paper: classes.drawerPaper,
        }}
    >
        <div className={classes.drawerHeader}>
            <IconButton onClick={handleClose} className={classes.backButton}>
                <CloseIcon />
            </IconButton>
            <div>{title}</div>
            {_.map(buttons, button => button && React.isValidElement(button) && <React.Fragment key={key(button)}>
                {React.cloneElement(button, {
                    className: clsx(
                        classes.button,
                        button.props && button.props.className
                    )
                })}
            </React.Fragment>)}
        </div>
        {fetching ? <LinearProgress /> : <div style={{ height: 4 }}></div>}
        {children}
    </Drawer>
}

export default Modal


{/* <DialogTitle>{title}</DialogTitle>
<DialogContent>
    <Observer>{() => _.isFunction(children) ? children({ Field, setValue, values: state.data }) : children}</Observer>
</DialogContent> */}