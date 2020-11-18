
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';

const basePath = `${PUBLIC_PATH}/`

const link = (action, object) => {
    switch (action) {
        case 'root': return `${basePath}`
    }
}

const Routes = props => {

    const classes = useStyles()

    return <>
        <Route exact path={link('root')} >
            <Card className={classes.card}>
                <CardHeader
                    className={classes.title}
                    title={'Channels Binding'}
                    subheader={<>
                        - Build fast & easy next gen django / react websocket apps
                            <br />
                            - Benefit the native django models data binding
                            <br />
                            - Think only fonctionnal, forget abstract layers
                        </>}
                />
            </Card>
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