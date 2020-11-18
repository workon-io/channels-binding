
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';

const useStyles = makeStyles({
    root: {
        marginTop: 35,
        width: '100%',
    },
});

export default props => {
    const classes = useStyles();
    const [value, setValue] = React.useState('recents');

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return (
        <BottomNavigation value={value} onChange={handleChange} className={classes.root} showLabels>
            {/* <BottomLink label="Mentions légales" to={require('src/Pages/Mentions').link('root')} />
            <BottomLink label="Traitement des données" to={require('src/Pages/DataUsing').link('root')} />
            <BottomLink label="Conditions générales d'utilisation" to={require('src/Pages/Conditions').link('root')} />
            <BottomLink label="FAQ" to={require('src/Pages/FAQ').link('root')} />
            <BottomLink label="ADMIN" to={require('src/Pages/Admin').link('root')} /> */}
        </BottomNavigation>
    );
}

const BottomLink = props => {
    return <BottomNavigationAction style={{ whiteSpace: 'nowrap', maxWidth: '100%' }} component={Link} {...props} />

}