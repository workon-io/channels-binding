
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import BrandSvg from '../../Brand.svg'

const basePath = `${PUBLIC_PATH}`

const link = (action, object) => {
    switch (action) {
        case 'root': return `${basePath}`
    }
}

const Routes = props => {

    const classes = useStyles()

    return <>
        <Route exact path={link('root')} >
            <Container maxWidth="sm" style={{ textAlign: "center" }}>
                <Typography component="h1">
                    <img height="70" src={BrandSvg} />
                </Typography>
                <Typography component="p" style={{ fontSize: 24 }}>

                    - Build fast & easy next gen django / react websocket apps
                            <br />
                            - Benefit the native django models data binding
                            <br />
                            - Think only fonctionnal, forget abstract layers
                </Typography>
                <Typography component="p">

                    Channels Binding exposes an JSON API streaming system over
                    [channels](https://github.com/django/channels), It\'s designed to work
                    as a full featured RestAPI via websocket, http, or both protocols
                    combined. in very few code lines, with a very simple and verboseless
                    exchange structure, where each django Models would be easily binded and
                    come with native basics operations like \'retrieve\', \'search\',
                    \'update\', \'create\', \'delete\' and subscription. We could made the
                    comparaison with django restframework with the REST system. It also
                    provides react packages with ready-to-use pre configured tools and
                    components to make easy Applications UIs.
                </Typography>
            </Container>
        </Route>
    </>
}

export { link, Routes }
export default { link, Routes }

const useStyles = makeStyles(theme => ({
    root: {
        // backgroundImage: `url(${backImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center -120px',
        backgroundAttachment: 'fixed',
        minHeight: '100vh'
    },
    navbar: {
        paddingTop: 15,
        paddingBottom: 15,
        background: 'white !important',
    },
    card: {
        borderRadius: 0,
        '& > .MuiCardContent-root': {
            background: 'white'
        }
    },
    title: {
        background: theme.palette.secondary.main,
        '& .MuiCardHeader-title': {
            fontSize: 40,
            fontWeight: 'bold'
        },
        '& .MuiCardHeader-subheader': {
            fontSize: 18,
        },
        '& span, &  svg': {
            color: 'white',
        },
        '& svg': {
            fontSize: 50,
        }
    },
    infos: {
        background: `${theme.palette.secondary.main} !important`,
        color: 'white',
    }
}));