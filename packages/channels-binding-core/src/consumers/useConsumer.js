import React from 'react'
import { registry } from './registerConsumer'


const getConsumerState = consumer => ({
    consumer: consumer,
    active: consumer.active,
    fetching: consumer.fetching,
    pending: consumer.pending,
    connected: consumer.connected,
})

const useConsumer = (name) => {

    const key = Math.random()
    const consumer = registry[name]
    const [state, setState] = React.useState(getConsumerState(consumer));

    React.useEffect(() => {
        consumer && consumer.addStateListener(key, consumer => setState(getConsumerState(consumer)))
        consumer && consumer.connect()
        return () => consumer && consumer.removeStateListener(key)
    }, [])

    return state
}


export default useConsumer