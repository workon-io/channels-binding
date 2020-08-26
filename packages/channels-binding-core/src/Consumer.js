import REWebSocket, { globalParams } from './REWebSocket'

export default class {

    active = false
    connected = false
    pending = false
    pending_calls = {}
    listeners = {}
    unique_listeners = {}
    socket = null
    debug = 0

    constructor({ host, port, path, onStateUpdate }) {

        this.host = host || window.location.hostname
        this.port = port || window.location.port
        this.protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
        this.url = new URL(`${this.protocol}//${this.host}:${this.port}`)
        this.url.pathname = path || ''
        this.onStateUpdate = onStateUpdate
        this.connect()
    }

    updateState() {
        const { active, connected, pending } = this
        this.onStateUpdate && this.onStateUpdate({
            active, connected, pending
        })
    }

    setGlobalParams(name, value) {
        globalParams[name] = value
    }

    delGlobalParams(name, value) {
        globalParams[name] && (delete globalParams[name])
    }

    useEventEffect(event, method, listen, condition = true) {
        const [fetching, setFetching] = React.useState(condition)
        React.useEffect(() => this.attachListener(event, method, condition, setFetching), listen || [])
        return fetching
    }

    attachListener(event, method, condition = true, setFetching) {
        const handler = (...args) => {
            method && method(...args)
            setFetching && setFetching(false)
        }
        const disposer = this.addListener(event, handler)
        condition && this.send(event, options) && setFetching && setFetching(true)
        return disposer
    }


    addListener(event, method) {
        this.debug && this.debug > 1 && this.logInfo(`addListener: ${event}.${method && method.name}`);
        this.connect()
        !this.listeners[event] && (this.listeners[event] = {})
        // Replace the method ref pointer
        this.listeners[event][method] = method
        return () => {
            this.removeListener(event, method)
        }
    }

    removeListener(event, method) {
        this.debug && this.debug > 1 && this.logInfo(`removeListener: ${event}.${method && method.name}`);
        try { delete this.listeners[event][method] }
        catch (err) { this.debug && this.debug > 1 && this.logError(`removeListener: ${event}.${method && method.name} not found.`) }
    }

    once(event, method) {
        this.debug && this.logInfo(`once: Method ${event}.${method && method.name}`);
        this.connect()
        this.unique_listeners[event] = method
    }

    send(event, data, delay) {
        this.connect()
        if (this.connected) {
            this.debug && this.logInfo('Sent', event, data);
            if (delay) {
                setTimeout(() => (
                    this.socket.send(JSON.stringify({ event, data }))
                ), delay);
            }
            else {
                this.socket.send(JSON.stringify({ event, data }));
            }
        }
        else {
            this.pending_calls[event] = data
            this.debug && this.logError('Not sent', 'Socket is not connected yet')
        }
    }

    receive(message) {
        const data = JSON.parse(message.data)
        if (data.event == 'error') {
            this.debug && this.logError('Error', data.data)
        }
        else if (data.event) {
            this.debug && this.logSuccess('Receive', data.event)
            _.has(this.listeners, data.event) &&
                _.map(this.listeners[data.event], method => method && method(data.data, this))

            if (_.has(this.unique_listeners, data.event)) {
                this.unique_listeners[data.event](data.data, this)
                delete this.unique_listeners[data.event]
            }
        }
    }

    request(path, callback, options) {
        options = _.defaults(options, { method: 'GET' })
        this.debug && this.logInfo(options.method, event, options);
        fetch(this.link(path), options)
            .then(r => r.json())
            .then(callback)
            .catch(error => {
                this.logError(options.method, error);
            });
    }

    link(path) {
        const url = new URL(this.url)
        url.pathname = url.pathname + path
        url.protocol = document.location.protocol
        return url.href
    }

    connect() {
        if (this.active) return;
        this.active = true;
        this.pending = true;
        this.debug && this.logSuccess('Connecting', this.url.href)
        this.socket = new REWebSocket(this.url)
        this.socket.addEventListener('open', this.onOpen);
        this.socket.addEventListener('close', this.onClose);
        this.socket.addEventListener('message', this.receive);
        this.stateUpdate()
    }

    onOpen() {
        this.pending = false;
        this.connected = true;
        this.debug && this.logSuccess('Connected')
        _.map(this.pending_calls, (data, event) => {
            delete this.pending_calls[event]
            this.send(event, data)
        })
        this.stateUpdate()
    }

    onClose(message) {
        this.pending = false;
        this.connected = false
        this.debug && this.logError('Closed')
        this.stateUpdate()
    }

    close() {
        this.socket && (this.socket.close())
        this.pending = false;
        this.connected = false;
        this.stateUpdate()
    }

    log(message, color, ...messages) {
        console.log(`%c [${message}] %c `, `font-weight:bolder; ${color}`, 'font-weight:bold', ...messages)
    }

    logSuccess(message, ...messages) {
        this.log(message, 'background: #bada55; color: #222', ...messages)
    }

    logInfo(message, ...messages) {
        this.log(message, 'background: #222; color: #bada55', ...messages)
    }

    logError(message, ...messages) {
        this.log(message, 'background: red; color: white', ...messages)
    }

}