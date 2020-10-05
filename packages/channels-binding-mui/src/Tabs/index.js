import { default as MuiTabs } from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import SwipeableViews from 'react-swipeable-views';
import AppBar from '@material-ui/core/AppBar';
import Paper from '@material-ui/core/Paper';
import { Link } from "react-router-dom"

const useStyles = makeStyles(theme => ({
    indicator: {
        height: 4,
        backgroundColor: theme.palette.info.main
    },
    sticky: {
        position: 'sticky',
        zIndex: 2
    }
}));

const Tabs = ({
    index,
    defaultIndex,
    onChange,
    component = 'appbar',
    variant = 'standard',
    cache = null,
    swipe = false,
    centered = false,
    sticky = false,
    dark = false,
    children,
}) => {

    const classes = useStyles();
    const cachedIndex = _.parseInt(cache ? COOKIE.get(cache, defaultIndex) : defaultIndex)
    const [currentIndex, setCurrentIndex] = React.useState(cachedIndex || 0);
    const handleChange = (e, newIndex) => {
        setCurrentIndex(newIndex);
        cache && COOKIE.set(cache, newIndex)
        onChange && onChange(newIndex)
    }
    const handleChangeIndex = index => setCurrentIndex(index);
    const bar = <MuiTabs
        value={index || currentIndex}
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
            const linkRef = React.useRef()
            const handleRowClick = e => child.props.linkTo && linkRef.current.click()
            return child && child.props && <Tab onClick={handleRowClick} label={<>
                {child.props.label}{child.props.linkTo && <Link to={child.props.linkTo} ref={linkRef} />
                }</>} {...a11yProps(index)} />
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