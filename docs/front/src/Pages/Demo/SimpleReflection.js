import { useBind } from "@channels-binding/core";

export default () => {

    const { data, fetching } = useBind('django:simple_reflexion.ping')

    return <div>
        Ping (2s) {
            fetching ?
                '...'
                :
                <div>
                    Pong! <br />
                    Data receive: {JSON.stringify(data)}
                </div>
        }
    </div>
}
