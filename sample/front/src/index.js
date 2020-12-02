import ReactDOM from 'react-dom';
import { CssBaseline } from '@material-ui/core';
import { registerConsumer } from '@channels-binding/core'
import SimpleReflection from './Samples/SimpleReflection'
import AsyncioLoop from './Samples/AsyncioLoop'
import UserList from './Samples/UserList'
import UserDetails from './Samples/UserDetails'
import UserForm from './Samples/UserForm'
import './index.css';


registerConsumer('back1', {
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
ReactDOM.render(< >
    <CssBaseline />
    <SimpleReflection />
    <AsyncioLoop />
    <UserList />
    <UserDetails />
    <UserForm />
</ >, document.getElementById('root'));