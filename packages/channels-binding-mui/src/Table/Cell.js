import TableCell from '@material-ui/core/TableCell';
import OverflowTip from '@channels-binding/core/utils/OverflowTip';
import BooleanField from '../fields/Boolean';
import Field from '../fields/Field';

const useStyles = makeStyles(theme => ({
    root: {
        position: 'sticky',
        zIndex: 1
    },
    verticalSpan: {
        position: 'absolute',
        transform: 'translateX(-50%) translateY(-50%) rotate(-90deg)',
        fontSize: 12,
        whiteSpace: 'nowrap',
        padding: '0px 5px'
    }
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
    head = false,
    nopadding = false,
    vertical = false,
    verticalHead = false,
    verticalBody = false,
    children,
    ...props
}) => {

    const classes = useStyles()
    const ref = React.useRef()
    const spanRef = React.useRef()
    const [height, setHeight] = React.useState(null)
    const [translateX, setTranslateX] = React.useState(-50)
    const isVertical = (vertical || (head && verticalHead) || (!head && verticalBody))
    let output = value

    if (head) {
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
    height && (styles.height = height)

    React.useEffect(() => {
        if (ref.current && spanRef.current) {
            isVertical && setHeight(spanRef.current.offsetWidth)
            isVertical && setTranslateX(50 + spanRef.current.offsetHeight * 5 / ref.current.offsetWidth)
        }
    }, [])

    const content = autowrap ? <OverflowTip width={autowrap}>{output}</OverflowTip> : output
    return <TableCell
        key={name}
        align={center ? 'center' : props.align}
        style={styles}
        className={classes.root}
        ref={ref}
    >
        {
            isVertical ? <span
                ref={spanRef}
                className={classes.verticalSpan}
                style={{
                    transform: `translateX(-${translateX}%) translateY(-50%) rotate(-90deg)`
                }}
            >
                {content}
            </span> : content
        }

    </TableCell>

}

export default Cell