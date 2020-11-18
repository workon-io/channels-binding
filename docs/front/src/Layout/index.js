import { RouterTabs } from 'libs';
import Container from '@material-ui/core/Container';
import Card from '@material-ui/core/Card';
import Box from '@material-ui/core/Box';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import NavBar from './NavBar'
import BottomNav from './BottomNav'

export default props => {

    const classes = useStyles()

    return <div className={classes.root}>
        <NavBar />

        <Card className={classes.card}>
            {/* <CardHeader
                component={Link}
                to={require('src/Pages/Home').link('root')}
                className={classes.navbar}
                action={<Link component={'img'} src={wabtecImage} height={70} />}
                title={<img src={regionImage} />}
            /> */}
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
            <CardContent>
                {props.children}
                <BottomNav />
            </CardContent>
        </Card>
    </div>
}


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