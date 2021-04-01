import { RouterTabs } from 'libs';
import Box from '@material-ui/core/Box';


const basePath = `${PUBLIC_PATH}demo/`

const link = (action, object) => {
    switch (action) {
        case 'root': return `${basePath}`
        case 'AsyncioLoop': return `${basePath}AsyncioLoop/`
        case 'HighFrequencyRealtimeData': return `${basePath}HighFrequencyRealtimeData/`
    }
}

const Routes = props => {

    return <>
        <Route path={link('root')} >
            <Box sx={{ display: 'flex' }}>
                <Box sx={{ flexShrink: 0 }} style={{ minWidth: 200, marginRight: 15 }}>
                    <RouterTabs orientation="vertical" routes={[
                        { label: 'Simple Reflection', to: link('root') },
                        { label: 'Asyncio Loop', to: link('AsyncioLoop') },
                        { label: 'HF Realtime', to: link('HighFrequencyRealtimeData') },
                    ]} />
                </Box>
                <Box sx={{ width: "100%" }}>
                    <Route exact path={link('root')} >
                        <Code
                            title='Simple Reflection'
                            description='Illustrates how channels-binding handles request with simple reflected response'
                            js='Pages/Demo/Codes/SimpleReflection'
                            py='bindings/simple_reflexion'
                        />
                    </Route>
                    <Route exact path={link('AsyncioLoop')} >
                        <Code
                            title='Asyncio Loop'
                            description='Illustrates how asyncio can be used to create a short interaction loop '
                            js='Pages/Demo/Codes/AsyncioLoop'
                            py='bindings/asyncio_loop'
                        />
                    </Route>
                    <Route exact path={link('HighFrequencyRealtimeData')} >
                        <Code
                            title='High Frequency Realtime Data'
                            description=''
                            js='Pages/Demo/Codes/HighFrequencyRealtimeData'
                            py='tasks/high_frequency_realtime_data'
                        />
                    </Route>
                </Box>
            </Box>
        </Route>
    </>
}

export { link, Routes }
export default { link, Routes }