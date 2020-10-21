import { registry } from '../consumers/registerConsumer'


const defaultMakeDisposer = props => {
    return () => null
}


const bind = props => {
    const {
        action,
        params = {},
        intercept = null,
        getDisposer = false,
    } = props
    let {
        event,
        stream,
        hash = null,
    } = props

    let send = () => {

        console.error(`%c [_________] %c Sending impossibe: Consumer not found`, `font - weight: bolder; 'background: #222; color: #bada55'`, 'font-weight:bold', props)
    }
    let makeDisposer = defaultMakeDisposer
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

    if (event) {
        hash && (event = `${event}#${hash}`)
        const consumer_event = _.split(event, ':')
        if (consumer_event.length >= 2) {
            consumer = registry[consumer_event[0]]
            consumerEvent = consumer_event[1]
            if (consumer) {
                makeDisposer = props => consumer.addListener(consumerEvent, incommingData => {
                    console.log('receive', consumerEvent, incommingData.reference)
                    intercept && intercept(incommingData)
                })
                send = (outcomingData, onSending) => {
                    onSending && onSending()
                    if (consumerEvent && consumer) {
                        // setFetching(true)
                        console.log('send', consumerEvent, outcomingData)
                        consumer.send(consumerEvent, outcomingData || params)
                    }
                }
            }
        }
    }
    const refresh = () => { send() }

    !getDisposer && makeDisposer()

    return {
        makeDisposer,
        stream,
        event,
        consumer,
        hash,
        send,
        refresh
    }
}


export default bind