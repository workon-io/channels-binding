import { useBind } from "@channels-binding/core";
import Paper from '@material-ui/core/Paper';

export default () => {

    const { data, fetching } = useBind('back1:simple_reflexion.ping')

    return <Paper>
        <h2>A simple request.reflect example</h2>
        Ping (2s) {
            fetching ?
                '...'
                :
                <div>
                    Pong! <br />
                    Data receive: {JSON.stringify(data)}
                </div>
        }
    </Paper>
}
