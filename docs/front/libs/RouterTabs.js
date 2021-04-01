import SwipeableViews from 'react-swipeable-views';
import { Tabs, Tab, Typography, AppBar } from '@material-ui/core';
import { useRouteMatch, useLocation } from "react-router-dom";
import key from 'weak-key';


const RouterTabs = ({
    routes: defaultRoutes = [],
    onChange,
    variant = 'standard',
    centered = false,
    sticky = false,
    dark = false,
    noelevation = false,
    children,
    ...props
}) => {

    const location = useLocation();
    const history = useHistory()
    const classes = useStyles();
    const [index, setIndex] = React.useState(0)
    const routes = defaultRoutes //_.filter(defaultRoutes, r => r)

    React.useEffect(() => {
        let index = 0
        _.map(routes, (route, i) => _.startsWith(location.pathname, decodeURIComponent(route.to)) && (index = i))
        setIndex(index)
    }, [location, routes]);

    const handleRowClick = route => e => history.push(route.to)

    return <AppBar
        position={sticky ? "sticky" : "relative"}
        style={{
            [_.isNumber(sticky) && 'top']: sticky,
            [noelevation && 'boxShadow']: 'none',
            zIndex: 1,
        }}
        color={dark ? "primary" : "default"}
    >
        <Tabs
            value={index}
            centered={centered}
            classes={{
                indicator: classes.indicator
            }}
            variant={variant}
            {...props}
        >
            {_.map(routes, (route, index) => {
                return <Tab
                    classes={{
                        root: classes.tab
                    }}
                    style={{ minWidth: 0 }}
                    key={key(route)}
                    onClick={handleRowClick(route)}
                    label={route.label}
                    {...a11yProps(index)}
                />
            })}
        </Tabs>
    </AppBar>
}

const useStyles = makeStyles(theme => ({
    indicator: {
        height: 4,
        backgroundColor: theme.palette.info.main
    },
    sticky: {
        position: 'sticky',
        zIndex: 2
    },
    tab: {
        padding: '6px 12px !important',
        position: 'relative !important',
    }
}));

function a11yProps(index) {
    return {
        id: `full-width-tab-${index}`,
        'aria-controls': `full-width-tabpanel-${index}`,
    };
}

export default RouterTabs