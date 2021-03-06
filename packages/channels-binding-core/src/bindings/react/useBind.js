import { registry } from '../../consumers/registerConsumer'
import React from 'react'

const useBind = (props, options = {}) => {

    _.isString(props) && (props = {
        ...options,
        event: props
    })

    const {
        action,
        data: defaultData = {},
        params = {},
        passive = false,
        versatile = false,
        intercept = null,
        observe = null,
        delay = null,
        triggers = []
    } = props
    let {
        event,
        stream,
        hash = null,
        listen,
    } = props

    const [state, setState] = React.useState({
        data: defaultData || {},
        fetching: !passive
    });

    let send = () => {
        console.error(`%c [_________] %c Sending impossibe: Consumer not found`, `font - weight: bolder; 'background: #222; color: #bada55'`, 'font-weight:bold', props)
    }
    let dispose = () => () => { }
    let consumer = null
    let consumerEvent = null
    if (stream) {
        const stream_hash = _.split(stream, '#')
        if (stream_hash.length >= 2) {
            stream = _.trim(stream_hash[0])
            hash = _.trim(stream_hash[1])
        }
    }
    if (stream && action) {
        event = _.trim(`${stream}.${action}`)
    }

    event && hash && (event = `${event}#${hash}`)

    listen = _.isArray(listen) ? listen : (listen ? [listen] : [event, JSON.stringify(params)])

    if (event) {
        const consumer_event = _.split(event, ':')
        if (consumer_event.length >= 2) {
            consumer = registry[consumer_event[0]]
            consumerEvent = consumer_event[1]
            if (consumer) {
                send = (outcomingData, silently = false) => {
                    !silently && setState({ ...state, fetching: true })
                    // silently && setState({ ...state })
                    consumer.send(consumerEvent, outcomingData || params)
                }
                dispose = () => consumer.disposeListener(consumerEvent, incommingData => {
                    if (intercept) {
                        const result = intercept(incommingData, state.data, setCompleteData)
                        if (result === true) {
                            setCompleteData(incommingData)
                        }
                        else if (result) {
                            setCompleteData(result)
                        }
                    }
                    else {
                        setCompleteData(incommingData)
                    }
                    observe && observe(incommingData, state.data, setCompleteData)
                })

                // React.useEffect(() => {
                //     const disposer = dispose()
                //     !passive && send(params)
                //     return disposer
                // }, [consumer.connected])
            }
        }
    }

    const refresh = () => { send(params) }
    const dispatch = () => { send(params, true) }
    const setCompleteData = data => setState({ data, fetching: false })

    React.useEffect(() => {
        const disposer = dispose()
        if (!passive) {
            if (delay) {
                setTimeout(() => send(params), delay)
            }
            else {
                send(params)
            }
        }
        return disposer
    }, listen)

    versatile && React.useEffect(() => defaultData && setState({ ...state, data: defaultData || {} }), [defaultData])



    return {
        stream,
        params,
        event,
        consumer,
        hash,
        send,
        refresh,
        dispatch,
        ...state,
    }
}


export default useBind