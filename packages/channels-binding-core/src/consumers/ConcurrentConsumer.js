import REConcurrentWebSocket from './REConcurrentWebSocket'

class Consumer {

    constructor(name, options) {

        this.options = _.defaults(options, {
            host: window.location.hostname,
            port: window.location.port,
            path: null,
            debug: 0,
            params: {},
            threads: 5,
            safetyLimit: true,
            protocol: window.location.protocol === 'https:' ? 'wss:' : 'ws:'
        })


        this.url = new URL(`${this.options.protocol}//${this.options.host}:${this.options.port}`)
        this.url.pathname = this.options.path || ''
        _.map(this.options.params, (value, name) => this.url.searchParams.set(name, value))
        this.name = name
        this.active = false
        this.connected = false
        this.pending = false
        this.fetching = false
        this.pending_calls = {}
        this.listeners = {}
        this.unique_listeners = {}
        this.socket = null
        this.state_listeners = {}
        this.event_limits = {}
        this.event_limits_to = null
    }

    connect() {
        if (this.connected) return;
        this.active = true;
        this.pending = true;
        this.options.debug && this.logSuccess('Connecting', this.url.href)
        this.socket = new REConcurrentWebSocket({
            url: this.url,
            threads: this.options.threads,
            onOpen: (...args) => this.onOpen(...args),
            onClose: (...args) => this.onClose(...args),
            onMessage: (...args) => this.receive(...args),
        })
        this.updateState()
    }

    onOpen() {
        this.pending = false;
        this.connected = true;
        this.options.debug && this.logSuccess('Connected')
        _.map(this.pending_calls, (data, event) => {
            delete this.pending_calls[event]
            this.send(event, data)
        })
        this.updateState()
    }

    reconnect() {
        this.close()
        this.connect()
    }

    disconnect() {
        this.close()
    }

    close() {
        this.socket && (this.socket.close())
        this.pending = false;
        this.connected = false;
        // this.active = false;
        this.updateState()
    }

    onClose(message) {
        this.pending = false;
        this.connected = false
        this.options.debug && this.logError('Closed')
        this.updateState()
    }

    send(event, data, delay) {
        this.connect()
        if (this.options.safetyLimit) {

            this.event_limits[event] ? (this.event_limits[event] += 1) : (this.event_limits[event] = 1)
            this.event_limits_to && clearTimeout(this.event_limits_to)
            this.event_limits_to = setTimeout(() => delete this.event_limits[event], 1000);
            if (this.event_limits[event] > 100) {
                throw 'Channels binding Consumer.safetyLimit => Too many event sending occured in too few ms ellasped.'
            }
        }
        try {
            if (this.connected) {
                this.options.debug && this.logInfo('Sent', event, this.options.debug > 1 && data);
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
                this.options.debug > 2 && this.logError('Not sent', 'Socket is not connected yet')
            }
        }
        catch (e) {
            this.reconnect()
        }
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

    disposeListener(event, method) {
        const key = Math.random()
        this.options.debug && this.options.debug > 2 && this.logInfo(`addListener: ${event}.${method && method.name}`);
        this.connect()
        !this.listeners[event] && (this.listeners[event] = {})
        // Replace the method ref pointer
        this.listeners[event][key] = method
        return () => {
            this.options.debug && this.options.debug > 2 && this.logInfo(`removeListener: ${event}.${method && method.name}`);
            try { delete this.listeners[event][key] }
            catch (err) { this.options.debug && this.options.debug > 2 && this.logError(`removeListener: ${event}.${method && method.name} not found.`) }
        }
    }

    addListener(event, method) {
        this.options.debug && this.options.debug > 2 && this.logInfo(`addListener: ${event}.${method && method.name}`);
        this.connect()
        !this.listeners[event] && (this.listeners[event] = {})
        // Replace the method ref pointer
        this.listeners[event][method] = method
        return () => {
            this.removeListener(event, method)
        }
    }

    removeListener(event, method) {
        this.options.debug && this.options.debug > 2 && this.logInfo(`removeListener: ${event}.${method && method.name}`);
        try { delete this.listeners[event][method] }
        catch (err) { this.options.debug && this.options.debug > 2 && this.logError(`removeListener: ${event}.${method && method.name} not found.`) }
    }

    receive(message) {
        const data = JSON.parse(message.data)
        if (data.event == 'error') {
            this.options.debug && this.logError('Error', this.options.debug > 1 && data.data)
        }
        else if (data.event) {
            this.options.debug && this.logSuccess('Receive', data.event, this.options.debug > 1 && data.data)
            _.has(this.listeners, data.event) &&
                _.map(this.listeners[data.event], method => method && method(data.data, this))

            if (_.has(this.unique_listeners, data.event)) {
                this.unique_listeners[data.event](data.data, this)
                delete this.unique_listeners[data.event]
            }
        }
    }

    addStateListener(key, callback) {
        this.state_listeners[key] = callback
    }

    removeStateListener(key) {
        this.state_listeners[key] && (delete this.state_listeners[key])
    }

    updateState() {
        _.map(this.state_listeners, callback => _.isFunction(callback) && callback(this))
    }

    setArg(name, value) {
        this.url.searchParams.set(name, value)
        this.reconnect()
    }

    unsetArg(name) {
        this.delArg(name)
    }

    delArg(name) {
        this.url.searchParams.delete(name)
        this.reconnect()
    }

    // useEventEffect(event, method, listen, condition = true) {
    //     const [fetching, setFetching] = React.useState(condition)
    //     React.useEffect(() => this.attachListener(event, method, condition, setFetching), listen || [])
    //     return fetching
    // }


    once(event, method) {
        this.options.debug && this.options.debug > 2 && this.logInfo(`once: Method ${event}.${method && method.name}`);
        this.connect()
        this.unique_listeners[event] = method
    }


    request(path, callback, options) {
        options = _.defaults(options, { method: 'GET' })
        const url = this.link(path)
        this.options.debug && this.logInfo(options.method, url, options);
        if (options.data) {
            options.body = JSON.stringify(options.data)
        }
        this.fetching = true
        this.updateState()
        fetch(url, options)
            .then(r => r.json())
            .then(callback)
            .catch(error => {
                this.logError(options.method, error);
            })
            .finally(() => {
                this.fetching = true
                this.updateState()
            })
    }

    link(path) {
        const url = new URL(this.url)
        url.pathname = url.pathname + path
        url.protocol = document.location.protocol
        return url.href
    }

    log(message, color, ...messages) {
        console.log(`%c [${_.toUpper(this.name)}] %c ${message}`, `font-weight:bolder; ${color}`, 'font-weight:bold', ...messages)
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
export default Consumer