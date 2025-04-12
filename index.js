let WebSocket = require('ws');
let uuid = require('uuid');
let color = require('cli-color');
module.exports = (function() {
    console.log(`[${color.cyanBright('INFO')}] ${color.greenBright('API installed')}!`)
        
    let wss;
    let opts = {}

    // private tools

    function async_pause(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // methods
    
    /**
        * @description start the WSS
        * @param {number} port the port to host the server from
        * @param {string} host the address to host the server from
        * @param {WrapperOptions} opt API wrapper options
        * @returns {void}
    */
    function start(port, host, opt={}) {
        try {
            wss = new WebSocket.Server({
                port: port,
                host: host ?? '127.0.0.1'
            });
            opts = opt;
            console.log(`[${color.cyanBright('INFO')}] ${color.greenBright('Server started')}; type \'${color.whiteBright(`/wsserver ${host ?? '127.0.0.1'}:${port}`)}\' on Minecraft to begin!`)
            let decoder = new TextDecoder();
            wss.on('connection', (ws, req) => {
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
                                if (msg.body.statusCode < 0 && opts.logCmdErrors) {
                                    console.log(`[${color.redBright('ERROR')}] ${color.whiteBright(msg.body.statusMessage)} | ${color.yellowBright(msg.body.statusCode)}`)
                                } else if (msg.body.statusCode >= 0 && opts.logCmdOutput) {
                                    console.log(`[${color.cyanBright('INFO')}] ${color.whiteBright(msg.body.statusMessage)}`)
                                }
                                break;
                            case 'event':
                                break;
                            case 'error': 
                                opts.logMsgErrors ? console.log(`[${color.redBright('ERROR')}] ${color.whiteBright('An error has occured.')} | ${color.yellowBright(msg.body.statusCode)}`) : void 0;
                                break;
                            default:
                                opts.logOther ? console.log(msg) : void 0;
                                break;
                        }
                    } catch (err) {
                        opts.logSeriousErrors ? console.log(`[${color.redBright('ERROR')}] ${color.whiteBright(err)}`) : void 0;
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
                wss.clients.forEach((ws) => {
                    if (ws.readyState !== WebSocket.OPEN) return;
            
                    ws.isAlive = false;
                    ws.ping();
                });
            }, 30000);
            wss.on('error', err => {
                console.log(`[${color.redBright('ERROR')}] ${color.whiteBright(`SERVER ERROR - ${err}`)}`)
            });
            wss.on('close', () => {
                console.log(`[${color.cyanBright('INFO')}] ${color.blueBright('The server has closed')}.`)
                clearInterval(interval)
            });
            module.exports.wss = wss;
        } catch (err) {
            opts.logSeriousErrors ? console.log(`[${color.redBright('ERROR')}] ${color.whiteBright(err)}`) : void 0;
        }
    }

    /**
        * @description stop the WSS
        * @returns {void}
    */
    function stop() {
        try {
            typeof wss !== 'undefined' ? wss.close() : console.log(`[${color.redBright('ERROR')}] ${color.whiteBright(`Can\'t stop the server, as it's not started yet.`)}`);
        } catch (err) {
            opts.logSeriousErrors ? console.log(`[${color.redBright('ERROR')}] ${color.whiteBright(err)}`) : void 0;
        }
    }

    /**
        * @description subscribe to an event type
        * @param {WebSocket} ws the client to send the subscription event to
        * @param {EventType} eventType the event type
        * @returns {void}
    */
    function subscribe(ws, eventType) {
        try {
            ws.send(JSON.stringify({
                header: {
                    version: 1,
                    requestId: uuid.v4(),
                    messageType: 'commandRequest',
                    messagePurpose: 'subscribe',
                },
                
                body: {
                    eventName: eventType
                }
            }))
        } catch (err) {
            opts.logSeriousErrors ? console.log(`[${color.redBright('ERROR')}] ${color.whiteBright(err)}`) : void 0;
        }
    }

    /**
        * @description listen to an event type
        * @param {WebSocket} ws the client to add the listener to
        * @param {EventType} eventType the event type
        * @param {(msg: string) => void} cb the listener callback
        * @returns {void}
    */
    function on(ws, eventType, cb) {
        try {
            ws.on('message', raw => {
                let msg = JSON.parse(raw.toString())

                if (msg.header.eventName === eventType || msg.body.eventName === eventType) {
                    cb(msg);
                } else return;
            })
        } catch (err) {
            opts.logSeriousErrors ? console.log(`[${color.redBright('ERROR')}] ${color.whiteBright(err)}`) : void 0;
        }
    }

    /**
        * @description unsubscribe from an event type
        * @param {WebSocket} ws the client to send the unsubscription event to
        * @param {EventType} eventType the event type
        * @returns {void}
    */
    function unsubscribe(ws, eventType) {
        try {
            ws.send(JSON.stringify({
                header: {
                    version: 1,
                    requestId: uuid.v4(),
                    messageType: 'commandRequest',
                    messagePurpose: 'unsubscribe',
                },
                
                body: {
                    eventName: eventType
                }
            }))
        } catch (err) {
            opts.logSeriousErrors ? console.log(`[${color.redBright('ERROR')}] ${color.whiteBright(err)}`) : void 0;
        }
    }

    /**
        * @description runs an in-game command
        * @param {WebSocket} ws the client to send the event to
        * @param {string} command the command to run
        * @returns {void}
    */
    async function runCommand(ws, command) {
        try {
            if (typeof command === 'string') {
                ws.send(JSON.stringify({
                    header: {
                        version: 1,
                        requestId: uuid.v4(),
                        messageType: 'commandRequest',
                        messagePurpose: 'commandRequest',
                    },
                    body: {
                        commandLine: command,
                        origin: {
                            type: 'player'
                        }
                    }
                }));
            } else if (typeof command === 'object') {
                if (command instanceof Array) {
                    for (let i = 0; i < command.length; i++) {
                        i !== 0 && i % 100 === 0 ? await async_pause(50) : void 0;
                        let cmd = command[i];
                        if (typeof cmd !== 'undefined') {
                            ws.send(JSON.stringify({
                                header: {
                                    version: 1,
                                    requestId: uuid.v4(),
                                    messageType: 'commandRequest',
                                    messagePurpose: 'commandRequest',
                                },
                                body: {
                                    commandLine: cmd,
                                    origin: {
                                        type: 'player'
                                    }
                                }
                            }));
                        }
                    }
                } else {
                    console.log(`[${color.redBright('ERROR')}] runCommand - Command input must be either an Array or String.`)
                }
            } else {
                console.log(`[${color.redBright('ERROR')}] runCommand - Command input must be either an Array or String.`)
            }
        } catch (err) {
            opts.logSeriousErrors ? console.log(`[${color.redBright('ERROR')}] ${color.whiteBright(err)}`) : void 0;
        }
    }

    process.on('uncaughtException', err => {
        console.log(`[${color.red('FATAL')}] ${color.whiteBright('Uncaught Exception')}: ${err.stack}`);
    });
    process.on('unhandledRejection', reason => {
        console.log(`[${color.red('FATAL')}] ${color.whiteBright('Unhandled Rejection')}: ${reason}`);
    });

    return {
        subscribe, unsubscribe, start, stop, runCommand, on,
        wss, opts
    }
})()