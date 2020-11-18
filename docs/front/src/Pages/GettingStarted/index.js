
import Install from './Install'

const basePath = `${PUBLIC_PATH}getting-started/`

const link = (action, object) => {
    switch (action) {
        case 'root': return `${basePath}`
    }
}

const Routes = props => {

    return <>
        <Route exact path={link('root')} >
            <Install />
        </Route>
    </>
}

export { link, Routes }
export default { link, Routes }