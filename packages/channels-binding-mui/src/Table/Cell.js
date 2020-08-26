import TableCell from '@material-ui/core/TableCell';
import OverflowTip from '@channels-binding/core/utils/OverflowTip';
import BooleanField from '../fields/Boolean';
import Field from '../fields/Field';

const useStyles = makeStyles(theme => ({
    root: {
    },
}));

const Cell = ({
    name,
    value,
    label,
    autowrap,
    center,
    render,
    type,
    data,
    isHead = false,
    nopadding = false,
    children,
    ...props
}) => {

    let output = value

    if (isHead) {
        output = label || (label == '' ? label : name)
    }
    else {

        _.isUndefined(data) && (data = {})

        if (name && (_.isUndefined(data[name]) || data[name] === null)) {
            output = null
        }
        else {
            output = children ? children : (_.isUndefined(value) ? data[name] : output)
        }

        if (type) {
            output = <Field type={type} value={output} {...props} />
        }
        else if (output === true || output === false) {
            output = <BooleanField value={output} />
        }
        else if (output === null) {
            output = <BooleanField value={output} />
        }
        else if (output === null) {
            output = <BooleanField value={output} />
        }
    }
    const styles = {}
    autowrap && (styles.maxWidth = autowrap)
    nopadding && (styles.padding = 0)
    return <TableCell
        key={name}
        align={center ? 'center' : props.align}
        style={styles}
    >
        {autowrap ? <OverflowTip width={autowrap}>{output}</OverflowTip> : output}
    </TableCell>

}

export default Cell