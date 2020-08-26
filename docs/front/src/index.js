import ReactDOM from 'react-dom';
import CssBaseline from "@material-ui/core/CssBaseline"
import { ThemeProvider } from '@material-ui/core/styles'
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
} from "react-router-dom";
import theme from './theme'
import printMe from './print.js';
import './index.css';

moment.locale('fr');

const NotFound = () => <div>Not found</div>

const Root = () => {

    const [loaded, setLoaded] = React.useState(false)

    React.useEffect(() => {
        setLoaded(true)
    }, [])

    return (
        <div className="app">
            {
                loaded ?
                    <Router>
                        <CssBaseline />
                        <ThemeProvider theme={theme}>
                        </ThemeProvider>
                    </Router>
                    :
                    <Loading center={true} />
            }
        </div>
    )
}
const renderApp = () => { ReactDOM.render(<Root />, document.getElementById('root')); }
renderApp();