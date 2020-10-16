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
        consumer && consumer.connect()
        consumer && consumer.addStateListener(key, consumer => setState(getConsumerState(consumer)))
        return () => consumer && consumer.removeStateListener(key, consumer => setState(getConsumerState(consumer)))
    }, [])

    return state
}


export default useConsumer