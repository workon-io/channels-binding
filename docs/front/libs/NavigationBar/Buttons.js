import key from 'weak-key';
import { ButtonGroup } from '@material-ui/core';


const useStyles = makeStyles((theme) => ({

    root: {
        flexGrow: 1,
        alignSelf: 'flex-end',
        '& label': {
            padding: 12
        }
    },
}));


const Buttons = ({
    buttons,
    onChange,
    filters
}) => {

    const classes = useStyles();

    return <ButtonGroup
        className={clsx(classes.root)}
        variant="contained"
        color="primary"
        aria-label="contained primary button group"
    >
        {
            React.Children.map(_.isFunction(buttons) ? buttons({ onChange, filters }) : buttons, (button => {
                return React.cloneElement(button, { key: key(button) })
            }))
        }
    </ButtonGroup>
}

export default Buttons