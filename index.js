let WebSocket = require('ws');
let uuid = require('uuid');
let color = require('cli-color');
let tags = {
    info: `[${color.cyanBright('INFO')}]`,
    warn: `[${color.yellowBright('WARNING')}]`,
    error: `[${color.redBright('ERROR')}]`,
    fatal: `[${color.red('FATAL')}]`,
}
// api
class APIInstance {
    wss;
    options = {};
    constructor() {}
    // methods
    start(port, host, options) {
        try {
            this.wss = new WebSocket.Server({
                port: port,
                host: host ?? '127.0.0.1'
            });
            this.options = options ?? {};
            console.log(`${tags.info} ${color.greenBright('Server started')}; type \'${color.whiteBright(`/wsserver ${host ?? '127.0.0.1'}:${port}`)}\' on Minecraft to begin!`)
            let decoder = new TextDecoder();
            this.wss.on('connection', (ws, req) => {
                req.socket.setKeepAlive(true, 30000);
                ws.isAlive = true;
                console.log(`${tags.info} ${color.blueBright('A client has connected')}!`)
                
                ws.on('message', raw => {
                    try {
                        let msg = JSON.parse(decoder.decode(raw));
                        switch (msg.header.messagePurpose) {
                            case 'commandRequest':
                                break;
                            case 'commandResponse':
                                if (msg.body.statusCode < 0 && this.options.log_command_errors) {
                                    console.log(`${tags.error} ${color.whiteBright(msg.body.statusMessage)} | ${color.yellowBright(msg.body.statusCode)}`)
                                } else if (msg.body.statusCode >= 0 && this.options.log_command_output) {
                                    console.log(`${tags.info} ${color.whiteBright(msg.body.statusMessage)}`)
                                }
                                break;
                            case 'event':
                                break;
                            case 'error': 
                                this.options.log_message_errors ? console.log(`${tags.error} ${color.whiteBright('An error has occured.')} | ${color.yellowBright(msg.body.statusCode)}`) : void 0;
                                break;
                            default:
                                break;
                        }
                    } catch (err) {
                        this.options.log_internal_errors ? console.log(`${tags.error} ${color.whiteBright(err)}`) : void 0;
                    }
                })
                ws.on('pong', () => {
                    ws.isAlive = true; // Mark alive when pong is received
                });
                ws.on('error', err => {
                    console.log(`${tags.error} ${color.whiteBright(err)}`)
                });
                ws.on('close', () => {
                    console.log(`${tags.info} ${color.blueBright('A client has disconnected')}.`)
                });
            });
            let interval = setInterval(() => {
                this.wss.clients.forEach((ws) => {
                    if (ws.readyState !== WebSocket.OPEN) return;
            
                    ws.isAlive = false;
                    ws.ping();
                });
            }, 30000);
            this.wss.on('error', err => {
                console.log(`${tags.error} ${color.whiteBright(`SERVER ERROR - ${err}`)}`)
            });
            this.wss.on('close', () => {
                console.log(`${tags.info} ${color.blueBright('The server has closed')}.`)
                clearInterval(interval)
            });
        } catch (err) {
            this.options.log_internal_errors ? console.log(`${tags.error} - APIInstance.start - ${color.whiteBright(err)}`) : void 0;
        }
    }
    stop() {
        try {
            typeof this.wss !== 'undefined' ? this.wss.close() : console.log(`${tags.error} ${color.whiteBright(`Can\'t stop the server, as it's not started yet.`)}`);
        } catch (err) {
            this.options.log_internal_errors ? console.log(`${tags.error} - APIInstance.stop - ${color.whiteBright(err)}`) : void 0;
        }
    }
    subscribe(ws, eventType) {
        try {
            ws.send(JSON.stringify({
                header: {
                    version: this.options.command_version,
                    requestId: uuid.v4(),
                    messageType: 'commandRequest',
                    messagePurpose: 'subscribe',
                },
                body: {
                    eventName: eventType
                }
            }))
        } catch (err) {
            this.options.log_internal_errors ? console.log(`${tags.error} - APIInstance.subscribe - ${color.whiteBright(err)}`) : void 0;
        }
    }
    on(ws, eventType, cb) {
        try {
            let a = raw => {
                let msg = JSON.parse(raw.toString())

                if (msg.header.eventName === eventType || msg.body.eventName === eventType) {
                    cb(msg);
                } else return;
            }
            ws.on('message', a)
            return a;
        } catch (err) {
            this.options.log_internal_errors ? console.log(`${tags.error} - APIInstance.on - ${color.whiteBright(err)}`) : void 0;
        }
    }
    onPurpose(ws, purpose, cb) {
        try {
            let a = raw => {
                let msg = JSON.parse(raw.toString())

                if (msg.header.messagePurpose === purpose) {
                    cb(msg);
                } else return;
            }
            ws.on('message', a)
            return a;
        } catch (err) {
            this.options.log_internal_errors ? console.log(`${tags.error} - APIInstance.subscribe - ${color.whiteBright(err)}`) : void 0;
        }
    }
    unsubscribe(ws, eventType) {
        try {
            ws.send(JSON.stringify({
                header: {
                    version: this.options.command_version,
                    requestId: uuid.v4(),
                    messageType: 'commandRequest',
                    messagePurpose: 'unsubscribe',
                },
                body: {
                    eventName: eventType
                }
            }))
        } catch (err) {
            this.options.log_internal_errors ? console.log(`${tags.error} - APIInstance.unsubscribe - ${color.whiteBright(err)}`) : void 0;
        }
    }
    send(ws, json) {
        try {
            ws.send(JSON.stringify(json))
        } catch (err) {
            this.options.log_internal_errors ? console.log(`${tags.error} - APIInstance.send - ${color.whiteBright(err)}`) : void 0;
        }
    }
    raw(ws, raw) {
        try {
            ws.send(raw)
        } catch (err) {
            this.options.log_internal_errors ? console.log(`${tags.error} - APIInstance.raw - ${color.whiteBright(err)}`) : void 0;
        }
    }
    runCommand(ws, command) {
        let ret;
        try {
            if (typeof command === 'string') {
                ret = uuid.v4()
                ws.send(JSON.stringify({
                    header: {
                        version: this.options.command_version,
                        requestId: uuid.v4(),
                        messageType: 'commandRequest',
                        messagePurpose: 'commandRequest'
                    },
                    body: {
                        commandLine: command,
                        origin: {
                            type: 'player'
                        }
                    }
                }))
                return ret
            } else if (command instanceof Array) {
                ret = []
                for (let cmd of command) {
                    if (typeof cmd !== 'undefined') {
                        let id = uuid.v4()
                        ws.send(JSON.stringify({
                            header: {
                                version: this.options.command_version,
                                requestId: id,
                                messageType: 'commandRequest',
                                messagePurpose: 'commandRequest',
                            },
                            body: {
                                commandLine: cmd,
                                origin: {
                                    type: 'player'
                                }
                            }
                        }))
                        ret.push(id)
                    }
                }
            } else {
                console.log(`${tags.error} - APIInstance.runCommand - Command input must be either an Array or String.`)
                return ''
            }
            return ret
        } catch (err) {
            this.options.log_internal_errors ? console.log(`${tags.error} - APIInstance.runCommand - ${color.whiteBright(err)}`) : void 0;
            return ''
        }
    }
}
module.exports = {
    APIInstance
}