import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import DeleteIcon from '@material-ui/icons/Delete';
import Divider from '@material-ui/core/Divider';
import Card from '@material-ui/core/Card';
import { default as MuiBox } from '@material-ui/core/Box';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import EditIcon from '@material-ui/icons/Edit';
import { Retrieve } from '@channels-binding/core'
import Tabs from '../Tabs';
import Modal from '../Modal'
import Field from '../fields/Field'



const styles = makeStyles(theme => ({
    saveButton: {
        flex: 'auto',
        marginLeft: 15,
        background: theme.palette.info.main,
        color: 'white',
        padding: 12
    },
    deleteButton: {
        flex: 'auto',
        background: theme.palette.error.main,
        color: 'white',
        padding: 12,
        maxWidth: 30,
        paddingRight: 0
    },
    pane: {
        position: 'relative',
        // minHeight: 300,
        fontSize: 16,
        flex: 'auto',
        padding: theme.spacing(2),
        // textAlign: 'center',
        color: theme.palette.text.secondary,
    },
}));

const RetrieveModal = ({
    title,
    open,
    onClose,
    fetching,
    Update,
    UpdateProps = {},
    Delete,
    DeleteProps = {},
    setOpenUpdate: defaultSetOpenUpdate,
    setOpenDelete: defaultSetOpenDelete,
    minWidth,
    buttons = [],
    children,
    ...props
}) => {
    const classes = styles({ minWidth })
    const [openUpdate, setOpenUpdate] = React.useState(defaultSetOpenUpdate);
    const [openDelete, setOpenDelete] = React.useState(defaultSetOpenDelete);
    const handleCloseUpdate = e => setOpenUpdate(false)
    const handleCloseDelete = e => setOpenDelete(false)

    return <Retrieve
        {...props}
        listen={open}
        passive={!open}
    >
        {({ data, fetching }) => <Modal
            open={open}
            onClose={onClose}
            fetching={fetching}
            minWidth={minWidth}
            title={_.isFunction(title) ? title(data) : <div>{title}</div>}
            buttons={[
                (defaultSetOpenUpdate || Update) &&
                <Button
                    onClick={e => setOpenUpdate(true)}
                    className={classes.saveButton}
                    startIcon={<EditIcon />}
                > Edit</Button>,
                ...buttons,
                (defaultSetOpenDelete || Delete) &&
                <Button
                    onClick={e => setOpenDelete(true)}
                    className={classes.deleteButton}
                    startIcon={<DeleteIcon />}
                ></Button>
            ]}
        >
            {children({
                data, fetching,
                Tabs, Tab, Box, Pane, Value, Buttons
            })}
            {Update && openUpdate && <Update
                // setOpenRetrieve={Retrieve && setOpenRetrieve}
                setOpenDelete={Delete && setOpenDelete}
                data={data}
                open={openUpdate}
                onClose={handleCloseUpdate}
                {...UpdateProps}
            />}
            {Delete && openDelete && <Delete
                // setOpenRetrieve={Retrieve && setOpenRetrieve}
                data={data}
                open={openDelete}
                onClose={handleCloseDelete}
                {...DeleteProps}
            />}
        </Modal>}
    </Retrieve>
}

RetrieveModal.defaultProps = {
    minWidth: 500,
}


const Tab = Tabs.Tab

const Box = (({ label, children }) => {
    return <MuiBox display="flex" p={0} bgcolor="background.paper" >{children}</MuiBox>
})

const Pane = (({ label, children }) => {
    const classes = styles()
    return <Card elevation={0} className={classes.pane}>
        {label && <Typography variant="h5" >{label}</Typography >}
        {children}
    </Card>
})

const Value = (({ type, label, children }) => {
    const classes = styles()
    return <>
        {label}: <b><Field type={type} value={children || 'n/a'} /></b>
        <Divider />
    </>
})

const Buttons = (({ label, children }) => {
    const classes = styles()
    return <List className={classes.buttons} dense={true}>
        <ListItem alignItems="flex-end" justifyContent="flex-end">
            {children}
        </ListItem>
    </List>
})

export default RetrieveModal