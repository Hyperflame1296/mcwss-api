let WebSocket = require('ws');
let uuid = require('uuid');
let color = require('cli-color');
console.log(`[${color.cyanBright('INFO')}] ${color.greenBright('API installed')}!`)
// api
class APIInstance {
    wss;
    options = {};
    // constructor
    constructor() {
        process.on('uncaughtException', err => {
            console.log(`[${color.red('FATAL')}] ${color.whiteBright('Uncaught Exception')}: ${err.stack}`);
        });
        process.on('unhandledRejection', reason => {
            console.log(`[${color.red('FATAL')}] ${color.whiteBright('Unhandled Rejection')}: ${reason}`);
        });
    }
    // methods
    start(port, host, options) {
        try {
            this.wss = new WebSocket.Server({
                port: port,
                host: host ?? '127.0.0.1'
            });
            this.options = options ?? {};
            console.log(`[${color.cyanBright('INFO')}] ${color.greenBright('Server started')}; type \'${color.whiteBright(`/wsserver ${host ?? '127.0.0.1'}:${port}`)}\' on Minecraft to begin!`)
            let decoder = new TextDecoder();
            this.wss.on('connection', (ws, req) => {
                req.socket.setKeepAlive(true, 30000);
                ws.isAlive = true;
                console.log(`[${color.cyanBright('INFO')}] ${color.blueBright('A client has connected')}!`)
                
                ws.on('message', raw => {
                    try {
                        let msg = JSON.parse(decoder.decode(raw));
                        switch (msg.header.messagePurpose) {
                            case 'commandRequest':
                                break;
                            case 'commandResponse':
                                if (msg.body.statusCode < 0 && this.options.logCmdErrors) {
                                    console.log(`[${color.redBright('ERROR')}] ${color.whiteBright(msg.body.statusMessage)} | ${color.yellowBright(msg.body.statusCode)}`)
                                } else if (msg.body.statusCode >= 0 && this.options.logCmdOutput) {
                                    console.log(`[${color.cyanBright('INFO')}] ${color.whiteBright(msg.body.statusMessage)}`)
                                }
                                break;
                            case 'event':
                                break;
                            case 'error': 
                                this.options.logMsgErrors ? console.log(`[${color.redBright('ERROR')}] ${color.whiteBright('An error has occured.')} | ${color.yellowBright(msg.body.statusCode)}`) : void 0;
                                break;
                            default:
                                this.options.logOther ? console.log(msg) : void 0;
                                break;
                        }
                    } catch (err) {
                        this.options.logSeriousErrors ? console.log(`[${color.redBright('ERROR')}] ${color.whiteBright(err)}`) : void 0;
                    }
                })
                ws.on('pong', () => {
                    ws.isAlive = true; // Mark alive when pong is received
                });
                ws.on('error', err => {
                    console.log(`[${color.redBright('ERROR')}] ${color.whiteBright(err)}`)
                });
                ws.on('close', () => {
                    console.log(`[${color.cyanBright('INFO')}] ${color.blueBright('A client has disconnected')}.`)
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
                console.log(`[${color.redBright('ERROR')}] ${color.whiteBright(`SERVER ERROR - ${err}`)}`)
            });
            this.wss.on('close', () => {
                console.log(`[${color.cyanBright('INFO')}] ${color.blueBright('The server has closed')}.`)
                clearInterval(interval)
            });
        } catch (err) {
            this.options.logSeriousErrors ? console.log(`[${color.redBright('ERROR')}] - APIInstance.start - ${color.whiteBright(err)}`) : void 0;
        }
    }
    stop() {
        try {
            typeof this.wss !== 'undefined' ? this.wss.close() : console.log(`[${color.redBright('ERROR')}] ${color.whiteBright(`Can\'t stop the server, as it's not started yet.`)}`);
        } catch (err) {
            this.options.logSeriousErrors ? console.log(`[${color.redBright('ERROR')}] - APIInstance.stop - ${color.whiteBright(err)}`) : void 0;
        }
    }
    subscribe(ws, event_type) {
        try {
            ws.send(JSON.stringify({
                header: {
                    version: 1,
                    requestId: uuid.v4(),
                    messageType: 'commandRequest',
                    messagePurpose: 'subscribe',
                },
                
                body: {
                    eventName: event_type
                }
            }))
        } catch (err) {
            this.options.logSeriousErrors ? console.log(`[${color.redBright('ERROR')}] - APIInstance.subscribe - ${color.whiteBright(err)}`) : void 0;
        }
    }
    on(ws, event_type, cb) {
        try {
            ws.on('message', raw => {
                let msg = JSON.parse(raw.toString())

                if (msg.header.eventName === event_type || msg.body.eventName === event_type) {
                    cb(msg);
                } else return;
            })
        } catch (err) {
            this.options.logSeriousErrors ? console.log(`[${color.redBright('ERROR')}] - APIInstance.on - ${color.whiteBright(err)}`) : void 0;
        }
    }
    on_purpose(ws, purpose, cb) {
        try {
            ws.on('message', raw => {
                let msg = JSON.parse(raw.toString())

                if (msg.header.messagePurpose === purpose) {
                    cb(msg);
                } else return;
            })
        } catch (err) {
            this.options.logSeriousErrors ? console.log(`[${color.redBright('ERROR')}] - APIInstance.subscribe - ${color.whiteBright(err)}`) : void 0;
        }
    }
    unsubscribe(ws, event_type) {
        try {
            ws.send(JSON.stringify({
                header: {
                    version: 1,
                    requestId: uuid.v4(),
                    messageType: 'commandRequest',
                    messagePurpose: 'unsubscribe',
                },
                body: {
                    eventName: event_type
                }
            }))
        } catch (err) {
            this.options.logSeriousErrors ? console.log(`[${color.redBright('ERROR')}] - APIInstance.unsubscribe - ${color.whiteBright(err)}`) : void 0;
        }
    }
    send(ws, json) {
        try {
            ws.send(JSON.stringify(json))
        } catch (err) {
            this.options.logSeriousErrors ? console.log(`[${color.redBright('ERROR')}] - APIInstance.send - ${color.whiteBright(err)}`) : void 0;
        }
    }
    send_raw(ws, raw) {
        try {
            ws.send(raw)
        } catch (err) {
            this.options.logSeriousErrors ? console.log(`[${color.redBright('ERROR')}] - APIInstance.send_raw - ${color.whiteBright(err)}`) : void 0;
        }
    }
    run_command(ws, command) {
        let ret;
        try {
            if (typeof command === 'string') {
                ret = uuid.v4()
                ws.send(JSON.stringify({
                    header: {
                        version: 1,
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
                                version: 1,
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
                console.log(`[${color.redBright('ERROR')}] - APIInstance.run_command - Command input must be either an Array or String.`)
            }
            return ret
        } catch (err) {
            this.options.logSeriousErrors ? console.log(`[${color.redBright('ERROR')}] - APIInstance.run_command - ${color.whiteBright(err)}`) : void 0;
        }
    }
}
module.exports = {
    APIInstance
}