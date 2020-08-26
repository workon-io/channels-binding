import MUIRichTextEditor from 'mui-rte'
import { convertFromHTML, ContentState, convertToRaw } from 'draft-js'
import { stateToHTML } from "draft-js-export-html";
import HelpIcon from '@material-ui/icons/Help';
import Tooltip from '@material-ui/core/Tooltip';

const styles = makeStyles(theme => ({
    root: {
        padding: theme.spacing(0, 1),
        paddingTop: 0,
    },
}));

const TextField = ({
    label,
    value,
    defaultValue,
    onChange,
    helpText,
    ...props
}) => {
    const classes = styles();

    const contentHTML = convertFromHTML(defaultValue || value)
    const state = ContentState.createFromBlockArray(contentHTML.contentBlocks, contentHTML.entityMap)
    const content = JSON.stringify(convertToRaw(state))

    if (onChange) {
        const handleChange = state => {
            // console.log(state, stateToHTML(state.getCurrentContent()))
            // onChange(stateToHTML(state.getCurrentContent()))
        }
        return <div className={classes.root}>
            <MUIRichTextEditor
                defaultValue={content}
                label={label}
                onChange={handleChange}
                onKeyUp={e => e.keyCode === 13 && handleChange(e)}
                onFocus={e => e.stopPropagation()}
            />
        </div>
    } else {
        return <>
            {label && <>{label}: </>}
            {value || (label ? 'n/a' : '')}
        </>
    }
}

export default TextField