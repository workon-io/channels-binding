const defaultMakeListener = props => {
    console.error(`Invalid useBind props`, props)
    return () => null
}

const useBind = props => {
    const {
        action,
        data: defaultData,
        args = {},
        passive = false,
        onData = null
    } = props
    let {
        event,
        stream,
        hash = null,
        listen,
    } = props

    const [data, setData] = React.useState(defaultData || {});
    const [fetching, setFetching] = React.useState(!passive)

    listen = _.isArray(listen) ? listen : (listen ? [listen] : [])
    let makeListener = defaultMakeListener
    let api = null
    let apiEvent = null
    if (stream) {
        const stream_hash = _.split(stream, '#')
        if (stream_hash.length >= 2) {
            stream = stream_hash[0]
            hash = stream_hash[1]
        }
    }
    if (stream && action) {
        event = `${stream}.${action}`
    }

    if (!event) {
        return {
            stream,
            event,
            api,
            hash,
            data: data,
            fetching,
            send,
            refresh
        }
    }

    if (event) {
        hash && (event = `${event}#${hash}`)
        const api_event = _.split(event, ':')
        if (api_event.length >= 2) {
            api = API[api_event[0]]
            apiEvent = api_event[1]
            if (api) {
                makeListener = props => api.addListener(apiEvent, incommingData => {
                    if (onData) {
                        onData(incommingData, data, setData)
                    }
                    else {
                        setData(incommingData)
                    }
                    setFetching(false)
                })
            }
        }
    }


    const send = outcomingData => {
        if (apiEvent && api) {
            setFetching(true)
            api.send(apiEvent, outcomingData || args)
        }
    }
    const refresh = () => { send() }


    React.useEffect(() => {
        const disposer = makeListener(props)
        !passive && send()
        return disposer
    }, listen)

    return {
        stream,
        event,
        api,
        hash,
        data: data,
        fetching,
        send,
        refresh
    }
}


export default useBind