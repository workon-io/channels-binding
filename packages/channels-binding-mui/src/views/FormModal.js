import SaveIcon from '@material-ui/icons/Save';
import DeleteIcon from '@material-ui/icons/Delete';
import Button from '@material-ui/core/Button';
import GenericField from "../fields/Field";
import Modal from '../Modal'
import { useForm } from '@channels-binding/core'

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

const FormModal = (({
    stream,
    data: initialObject,
    title,
    open,
    onClose,
    minWidth,
    onSuccess: defaultOnSuccess,
    onErrors: defaultOnErrors,
    buttons = [],
    Delete,
    DeleteProps = {},
    setOpenDelete: defaultSetOpenDelete,
    children,
    ...props
}) => {

    const classes = styles({ minWidth })
    const [state,] = React.useState(new State())
    const [openSuccessSnack, setOpenSuccessSnack] = React.useState(false)
    const [openDelete, setOpenDelete] = React.useState(defaultSetOpenDelete);
    const handleCloseDelete = e => setOpenDelete(false)
    const setValue = (...args) => state.setValue(...args)
    const onSuccess = data => {
        onClose && onClose()
        defaultOnSuccess && defaultOnSuccess()
        // setOpenSuccessSnack(true)
    }
    const onErrors = data => {
        defaultOnErrors && defaultOnErrors()
        // setOpenSuccessSnack(true)
    }
    const { fields, submit, success, errors, fetching, ...formData } = useForm({
        stream: stream,
        object: initialObject,
        listen: open,
        passive: !open,
        onSuccess,
        onErrors
    })

    // console.log(initialObject)

    const handleSaveClick = e => submit(state.data)

    const Form = observer(({ ...props }) => {
        return <div className={classes.form}>
            {props.children}
        </div>
    })

    const Field = observer(({ name, ...props }) => {
        if (_.isUndefined(state.data[name]) && !_.isUndefined(fields[name])) {
            state.data[name] = fields[name].value
        }
        props.value = state.data[name] || ""
        // console.log(name, props.value)
        const handleChange = value => {
            setValue(name, value);
        }
        const placeHolder = name || props.label
        return <div className={classes.field}>
            <GenericField
                errors={errors && errors[name]}
                placeholder={placeHolder}
                onChange={handleChange}
                {...props}
            />
        </div>
    })

    buttons = [
        <Button
            onClick={handleSaveClick}
            className={classes.saveButton}
            startIcon={<SaveIcon />}
        > Save</Button>,
        ...buttons,
        (defaultSetOpenDelete || Delete) && initialObject.id &&
        <Button
            onClick={e => setOpenDelete(true)}
            className={classes.deleteButton}
            startIcon={<DeleteIcon />}
        >&nbsp;</Button>
    ]

    if (_.isFunction(children)) {
        children = children({
            ...formData,
            values: state.data,
            fields,
            errors,
            setValue,
            Field,
            Form,
            submit: e => submit(state.data),
        })
    }
    else if (!children) {
        children = <Form>
            {_.map(fields, field => <Field key={field.name} {...field} />)}
        </Form>
    }
    if (_.isFunction(title)) {
        title = title(state.data)
    }
    else {
        title = <div>{title}</div>
    }
    return <Modal
        open={open}
        onClose={onClose}
        fetching={fetching}
        minWidth={minWidth}
        title={title}
        buttons={buttons}
        {...props}
    >
        <Observer>{() => children}</Observer>
        {Delete && openDelete && initialObject.id && <Delete
            // setOpenRetrieve={Retrieve && setOpenRetrieve}
            data={initialObject}
            open={openDelete}
            onClose={handleCloseDelete}
            {...DeleteProps}
        />}
    </Modal>
})

export default FormModal