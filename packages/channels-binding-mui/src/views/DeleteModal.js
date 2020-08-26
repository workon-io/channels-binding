import SaveIcon from '@material-ui/icons/Save';
import Button from '@material-ui/core/Button';
import { Retrieve, Delete } from '@channels-binding/core'
import Modal from '../Modal'


const styles = makeStyles(theme => ({
    form: {
        padding: 12
    },
    saveButton: {
        flex: 'auto',
        marginLeft: 15,
        background: theme.palette.success.main,
        color: 'white',
        padding: 12
    },
    field: {
        marginBottom: 10
    }
}));

const DeleteModal = (({
    title,
    open,
    onClose,
    fetching,
    children,
    minWidth,
    onSuccess: defaultOnSuccess,
    ...props
}) => {

    const classes = styles({ minWidth })
    const onSuccess = data => {
        onClose && onClose()
        defaultOnSuccess && defaultOnSuccess()
        // setOpenSuccessSnack(true)
    }

    return <Retrieve
        {...props}
        listen={open}
        passive={!open}
    >
        {({ data: initialData, fetching }) => <Delete
            {...props}
            data={initialData}
            onSuccess={onSuccess}
        >
            {({ submit, ...deleteProps }) => {

                return <>
                    <Modal
                        open={open}
                        onClose={onClose}
                        fetching={fetching}
                        minWidth={minWidth}
                        title={_.isFunction(title) ? title(initialData) : <div>{title}</div>}
                        buttons={[
                            <Button
                                onClick={e => submit()}
                                className={classes.saveButton}
                                startIcon={<SaveIcon />}
                            > Confirm</Button>
                        ]}
                        {...props}
                    >
                        <Observer>{() => _.isFunction(children) ? children({
                            submit,
                            ...deleteProps
                        }) : children}</Observer>
                    </Modal>
                </>
            }}
        </Delete>}
    </Retrieve>
})

export default DeleteModal