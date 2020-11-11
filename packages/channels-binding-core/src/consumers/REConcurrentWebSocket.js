

export default (class {

    constructor(options) {

        this.open = false
        this.sockets = []
        _.map(_.range(1, options.threads), i => {
            const socket = new WebSocket(settings.url);

            socket.onopen = function (e) {
                if (!this.open) {
                    this.open = true
                    options.onOpen(e)
                }
            };

            socket.onmessage = function (event) {
            };

            socket.onclose = function (event) {
                if (event.wasClean) {
                    alert(`[close] Connection closed cleanly, code=${event.code} reason=${event.reason}`);
                } else {
                    alert('[close] Connection died');
                }
            };

            socket.onerror = function (error) {
            };
            this.sockets.push(socket)
        })
    }

})