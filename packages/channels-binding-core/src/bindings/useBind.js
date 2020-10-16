import { registry } from '../consumers/registerConsumer'
import React from 'react'

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
        onData = null,
        handleData = null
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
    let consumer = null
    let consumerEvent = null
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
            consumer,
            hash,
            data: data,
            fetching,
            send,
            refresh
        }
    }

    if (event) {
        hash && (event = `${event}#${hash}`)
        const consumer_event = _.split(event, ':')
        if (consumer_event.length >= 2) {
            consumer = registry[consumer_event[0]]
            consumerEvent = consumer_event[1]
            if (consumer) {
                makeListener = props => consumer.addListener(consumerEvent, incommingData => {
                    if (onData) {
                        onData(incommingData, data, setData)
                    }
                    else {
                        setData(incommingData)
                        handleData && handleData(incommingData, data, setData)
                    }
                    setFetching(false)
                })
            }
        }
    }


    const send = outcomingData => {
        if (consumerEvent && consumer) {
            setFetching(true)
            consumer.send(consumerEvent, outcomingData || args)
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
        consumer,
        hash,
        data: data,
        fetching,
        send,
        refresh
    }
}


export default useBind