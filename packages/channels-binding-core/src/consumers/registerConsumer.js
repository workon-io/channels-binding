import Consumer from './Consumer'
import ConcurrentConsumer from './ConcurrentConsumer'

const registry = {}

const registerConsumer = (name, ...args) => {

    registry[name] = new Consumer(name, ...args)
}

export { registry }
export default registerConsumer