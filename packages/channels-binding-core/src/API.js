import Consumer from './Consumer'

const registry = {}

const register = (name, {
    host,
    port,
    path,
    onStateUpdate

}) => {

    const consumer = new Consumer({
        host,
        port,
        path,
        onStateUpdate
    })
    registry[name] = consumer
}


const makeApi = (name, options, targetClass) => {

    export { register }
    export default registry