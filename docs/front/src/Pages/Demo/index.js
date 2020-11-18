import { RouterTabs } from 'libs';
import Box from '@material-ui/core/Box';
import Code from 'src/Code'


const basePath = `${PUBLIC_PATH}demo/`

const link = (action, object) => {
    switch (action) {
        case 'root': return `${basePath}`
        case 'AsyncioLoop': return `${basePath}AsyncioLoop/`
    }
}

const Routes = props => {

    return <Box sx={{ display: 'flex' }}>
        <Box sx={{ flexShrink: 0 }} style={{ minWidth: 200, marginRight: 15 }}>
            <RouterTabs orientation="vertical" routes={[
                { label: 'Simple Reflection', to: link('root') },
                { label: 'Asyncio Loop', to: link('AsyncioLoop') },
                { label: 'Simple Reflection', to: link('root') },
                { label: 'Asyncio Loop', to: link('AsyncioLoop') },
                { label: 'Simple Reflection', to: link('root') },
                { label: 'Asyncio Loop', to: link('AsyncioLoop') },
                { label: 'Simple Reflection', to: link('root') },
                { label: 'Asyncio Loop', to: link('AsyncioLoop') },
            ]} />
        </Box>
        <Box sx={{ width: "100%" }}>
            <Route exact path={link('root')} >
                <Code
                    title='Simple Reflection'
                    description='Illustrates how channels-binding handles request with simple reflected response'
                    js='Pages/Demo/SimpleReflection'
                    py='bindings/simple_reflexion'
                />
            </Route>
            <Route exact path={link('AsyncioLoop')} >
                <Code
                    title='Asyncio Loop'
                    description='Illustrates how asyncio can be used to create a short interaction loop '
                    js='Pages/Demo/AsyncioLoop'
                    py='bindings/asyncio_loop'
                />
            </Route>
        </Box>
    </Box>
}

export { link, Routes }
export default { link, Routes }