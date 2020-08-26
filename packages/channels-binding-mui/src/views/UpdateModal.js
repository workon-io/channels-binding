import SaveIcon from '@material-ui/icons/Save';
import DeleteIcon from '@material-ui/icons/Delete';
import Button from '@material-ui/core/Button';
import GenericField from "../fields/Field";
import Modal from '../Modal'
import { Retrieve, Save } from '@channels-binding/core'

class State {
    @observable data = {}
    @action.bound setValue(name, value) {
        this.data = ({ ...this.data, [name]: value });
    }
}

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
    deleteButton: {
        flex: 'auto',
        background: theme.palette.error.main,
        color: 'white',
        padding: 12,
        maxWidth: 30,
        paddingRight: 0
    },
    field: {
        marginBottom: 10
    }
}));

const UpdateModal = (({
    title,
    open,
    onClose,
    fetching,
    minWidth,
    onSuccess: defaultOnSuccess,
    setOpenDelete,
    buttons = [],
    children,
    ...props
}) => {

    const classes = styles({ minWidth })
    const [state,] = React.useState(new State())
    const [openSuccessSnack, setOpenSuccessSnack] = React.useState(false)
    const setValue = (...args) => state.setValue(...args)
    const onSuccess = data => {
        onClose && onClose()
        defaultOnSuccess && defaultOnSuccess()
        // setOpenSuccessSnack(true)
    }
    const Form = observer(({ ...props }) => {
        return <div className={classes.form}>
            {props.children}
        </div>
    })

    return <Retrieve
        {...props}
        listen={open}
        passive={!open}
    // passive={!open || !props.data.id}
    >
        {({ data: initialData, fetching }) => <Save
            {...props}
            data={initialData}
            onSuccess={onSuccess}
        >
            {({ submit, success, errors }) => {

                console.log(initialData)

                const Field = observer(({ name, ...props }) => {
                    if (_.isUndefined(state.data[name])) {
                        state.data[name] = initialData[name]
                    }
                    const value = state.data[name] || ""
                    const handleChange = value => setValue(name, value);
                    const placeHolder = name || props.label
                    return <div className={classes.field}>
                        <GenericField errors={errors && errors[name]} value={value} placeHolder={placeHolder} onChange={handleChange} {...props} />
                    </div>
                })
                return <>
                    <Modal
                        open={open}
                        onClose={onClose}
                        fetching={fetching}
                        minWidth={minWidth}
                        title={_.isFunction(title) ? title(state.data) : <div>{title}</div>}
                        buttons={[
                            <Button
                                onClick={e => submit(state.data)}
                                className={classes.saveButton}
                                startIcon={<SaveIcon />}
                            > Save</Button>,
                            ...buttons,
                            setOpenDelete &&
                            <Button
                                onClick={e => setOpenDelete(true)}
                                className={classes.deleteButton}
                                startIcon={<DeleteIcon />}
                            >&nbsp;</Button>
                        ]}
                        {...props}
                    >
                        <Observer>{() => _.isFunction(children) ? children({
                            data: state.data,
                            initialData,
                            errors,
                            setValue,
                            Field,
                            Form,
                            submit: e => submit(state.data),
                        }) : children}</Observer>
                    </Modal>
                </>
            }}
        </Save>}
    </Retrieve>
})

export default UpdateModal