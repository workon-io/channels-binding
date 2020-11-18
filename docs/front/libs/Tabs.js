import { default as MuiTabs } from '@material-ui/core/Tabs';
import SwipeableViews from 'react-swipeable-views';
import { Link, useHistory } from "react-router-dom"
import { Tab, Typography, AppBar } from '@material-ui/core';
import { Cookies } from 'libs'

const useStyles = makeStyles(theme => ({
    indicator: {
        height: 4,
        backgroundColor: theme.palette.info.main
    },
    sticky: {
        position: 'sticky',
        zIndex: 2
    },
}));

const Tabs = ({
    index,
    defaultIndex,
    onChange,
    variant = 'standard',
    cache = null,
    swipe = false,
    centered = false,
    sticky = false,
    dark = false,
    noelevation = false,
    children,
}) => {

    const history = useHistory()
    const classes = useStyles();
    const cachedIndex = _.parseInt(cache ? Cookies.get(cache, defaultIndex) : defaultIndex)
    const [currentIndex, setCurrentIndex] = React.useState(cachedIndex || 0);
    const handleChange = (e, newIndex) => {
        setCurrentIndex(newIndex);
        cache && Cookies.set(cache, newIndex)
        onChange && onChange(newIndex)
    }
    const handleChangeIndex = index => setCurrentIndex(index);
    const bar = <MuiTabs
        value={currentIndex !== -1 ? currentIndex : 0}
        classes={{
            indicator: classes.indicator
        }}
        centered={centered}
        onChange={handleChange}
        // textColor="primary"
        variant={variant}
        aria-label="full width tabs example"
    >
        {React.Children.map(children, (child, index) => {
            const handleRowClick = e => {
                // setCurrentIndex(index)
                child.props.linkTo && history.push(child.props.linkTo)
            }
            return child && child.props && <Tab onClick={handleRowClick} label={child.props.label} {...a11yProps(index)} />
        })}
    </MuiTabs>

    const tabsContent = React.Children.map(children, (child, index) => {
        return child && child.props && React.cloneElement(child, {
            ...child.props,
            currentIndex,
            index,

        }, child.props.children)
    })

    const content = swipe ? <SwipeableViews
        axis={'x'}
        index={currentIndex}
        onChangeIndex={handleChangeIndex}
    >
        {tabsContent}
    </SwipeableViews> : tabsContent

    return <>
        <AppBar
            position={sticky ? "sticky" : "relative"}
            style={{
                [_.isNumber(sticky) && 'top']: sticky,
                [noelevation && 'boxShadow']: 'none',
                zIndex: 1,
            }}
            color={dark ? "primary" : "default"}
        >
            {bar}
        </AppBar>
        {content}
    </>

    // if (component == 'appbar') {
    //     return <><AppBar position={sticky ? "sticky" : "relative"} style={{
    //         [_.isNumber(sticky) && 'top']: sticky
    //     }} color="default">{bar}</AppBar>{content}</>
    // }
    // else if (component == 'paper') {
    //     return <><Paper square>{bar}</Paper>{content}</>
    // }
    // else {
    //     return <><Paper square>{bar}</Paper>{content}</>
    // }
}

Tabs.Tab = ({ index, currentIndex, label, children }) => {

    return <TabPanel value={currentIndex} index={index}>
        {React.Children.map(children, (child, index) => {
            return child && child.props && typeof (child.props.showName) === 'function' ? children({
                open: currentIndex === index
            }) : child
        })}
    </TabPanel>
}

function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <Typography
            component="div"
            role="tabpanel"
            hidden={value !== index}
            id={`full-width-tabpanel-${index}`}
            aria-labelledby={`full-width-tab-${index}`}
            {...other}
        >
            {value === index && children}
        </Typography>
    );
}

function a11yProps(index) {
    return {
        id: `full-width-tab-${index}`,
        'aria-controls': `full-width-tabpanel-${index}`,
    };
}

export default Tabs