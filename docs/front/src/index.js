import ReactDOM from 'react-dom';
import { CssBaseline } from '@material-ui/core';
import { ThemeProvider } from '@material-ui/core/styles'
import { registerConsumer } from '@channels-binding/core'
import { BrowserRouter } from "react-router-dom";
import { ScrollToTop } from 'libs'
import theme from './theme'
import Layout from './Layout';
import './index.css';

moment.locale('fr');

registerConsumer('django', {
    path: `${PUBLIC_WS_PATH}`,
    debug: DEBUG,
})

if (module.hot) {
    module.hot.accept();
    module.hot.dispose(function () {
        console.log('%c[HMR] RE-Render', 'background: #bada55; color: #222')
        document.location.reload()
    });
}
ReactDOM.render(<BrowserRouter>
    <ScrollToTop />
    <CssBaseline />
    <ThemeProvider theme={theme}>
        <Layout tabs={[
            { label: 'Home', to: require('src/Pages/Home') },
            { label: 'Getting Started', to: require('src/Pages/GettingStarted') },
            { label: 'Demo', to: require('src/Pages/Demo') },
            { label: 'API', to: require('src/Pages/API') },
        ]}>
        </Layout>
    </ThemeProvider>
</BrowserRouter>, document.getElementById('root'));