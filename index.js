let WebSocket = require('ws');
let color = require('cli-color');
let crypto = require('node:crypto')
let _version = require('./package.json').version
let fetch = require('node-fetch')
let tags = {
    info: `[${color.cyanBright('INFO')}]`,
    warn: `[${color.yellowBright('WARNING')}]`,
    error: `[${color.redBright('ERROR')}]`,
    fatal: `[${color.red('FATAL')}]`,
}
console.log(`${tags.info} - ${color.greenBright('API loaded')}; version: ${color.cyanBright(_version)}`); // log the version of the package
let check_for_updates = async() => {
    let a = (await fetch(`https://registry.npmjs.com/mcwss-api`)).text()
    return a.then(raw => {
        let json = JSON.parse(raw)
        if (json['dist-tags'].latest !== _version) {
            console.log(`${tags.info} - ${color.greenBright('A new version of the API is available')}! ${color.white('(' + json['dist-tags'].latest + ')')}`); // log the version of the package
            return true
        } else return false
    })
}
// api
class APIInstance {
    wss;
    options = {};
    afterEvents = {
        chatSend: new AfterEventSignal('PlayerMessage', this),
        playerMove: new AfterEventSignal('PlayerTravelled', this),
        playerTransform: new AfterEventSignal('PlayerTransform', this),
        playerTeleport: new AfterEventSignal('PlayerTeleported', this),
        playerDie: new AfterEventSignal('PlayerDied', this),
        playerBounce: new AfterEventSignal('PlayerBounced', this),
        entitySpawn: new AfterEventSignal('EntitySpawned', this),
        itemCompleteUse: new AfterEventSignal('ItemUsed', this),
        itemUse: new AfterEventSignal('ItemInteracted', this),
        playerEquipItem: new AfterEventSignal('ItemEquipped', this),
        playerAcquireItem: new AfterEventSignal('ItemAcquired', this),
        playerDropItem: new AfterEventSignal('ItemDropped', this),
        playerAcquireSmeltedItem: new AfterEventSignal('ItemSmelted', this),
        playerCraftItem: new AfterEventSignal('ItemCrafted', this),
        playerPlaceBlock: new AfterEventSignal('BlockPlaced', this),
        playerBreakBlock: new AfterEventSignal('BlockBroken', this),
        playerKillEntity: new AfterEventSignal('MobKilled', this),
        playerInteractWithEntity: new AfterEventSignal('MobInteracted', this),
        targetBlockHit: new AfterEventSignal('TargetBlockHit', this)
    }
    BlockTypes = {
        getAll: async() => {
            let final = [];

            for (let ws of this.wss.clients) {
                if (ws.readyState !== WebSocket.OPEN) continue;

                let requestId = crypto.randomUUID({ disableEntropyCache: true });

                let wait = id => {
                    return new Promise((resolve, reject) => {
                        let timer = setTimeout(() => {
                            ws.off('message', handler);
                            this.options.log_internal_errors
                                ? reject(new Error(`${tags.error} - APIInstance.BlockTypes.getAll - Timed out waiting for block data response!`))
                                : reject();
                        }, 10000);

                        function handler(data) {
                            let msg;
                            try {
                                msg = JSON.parse(data);
                            } catch {
                                return;
                            }

                            if (msg?.header?.messagePurpose === 'data' && msg?.header?.dataType === 'block' && msg?.header?.requestId === id) {
                                clearTimeout(timer);
                                ws.off('message', handler);
                                resolve(msg.body);
                            }
                        }

                        ws.on('message', handler);
                    });
                };

                try {
                    ws.send(JSON.stringify({
                        header: {
                            version: this.options.command_version,
                            requestId,
                            messagePurpose: 'data:block'
                        }
                    }));
                } catch (err) {
                    if (this.options.log_internal_errors) {
                        console.log(`${tags.error} - APIInstance.BlockTypes.getAll - ${color.whiteBright(err)}`);
                    }
                    continue;
                }

                let result = await wait(requestId);
                final.push(result);
            }

            return final.length <= 1 ? final[0] : final;
        },
        getAllForOne: async ws => {
            if (ws.readyState !== WebSocket.OPEN) return;

            let requestId = crypto.randomUUID({ disableEntropyCache: true });

            let wait = id => {
                return new Promise((resolve, reject) => {
                    let timer = setTimeout(() => {
                        ws.off('message', handler);
                        this.options.log_internal_errors
                            ? reject(new Error(`${tags.error} - APIInstance.BlockTypes.getAllForOne - Timed out waiting for block data response!`))
                            : reject();
                    }, 10000);

                    function handler(data) {
                        let msg;
                        try {
                            msg = JSON.parse(data);
                        } catch {
                            return;
                        }

                        if (msg?.header?.messagePurpose === 'data' && msg?.header?.dataType === 'block' && msg?.header?.requestId === id) {
                            clearTimeout(timer);
                            ws.off('message', handler);
                            resolve(msg.body);
                        }
                    }

                    ws.on('message', handler);
                });
            };

            try {
                ws.send(JSON.stringify({
                    header: {
                        version: this.options.command_version,
                        requestId,
                        messagePurpose: 'data:block'
                    }
                }));
            } catch (err) {
                if (this.options.log_internal_errors) {
                    console.log(`${tags.error} - APIInstance.BlockTypes.getAllForOne - ${color.whiteBright(err)}`);
                }
                return;
            }

            let result = await wait(requestId);
            return result;
        }
    }
    ItemTypes = {
        getAll: async() => {
            let final = [];

            for (let ws of this.wss.clients) {
                if (ws.readyState !== WebSocket.OPEN) continue;

                let requestId = crypto.randomUUID({ disableEntropyCache: true });

                let wait = id => {
                    return new Promise((resolve, reject) => {
                        let timer = setTimeout(() => {
                            ws.off('message', handler);
                            this.options.log_internal_errors
                                ? reject(new Error(`${tags.error} - APIInstance.ItemTypes.getAll - Timed out waiting for item data response!`))
                                : reject();
                        }, 10000);

                        function handler(data) {
                            let msg;
                            try {
                                msg = JSON.parse(data);
                            } catch {
                                return;
                            }

                            if (msg?.header?.messagePurpose === 'data' && msg?.header?.dataType === 'item' && msg?.header?.requestId === id) {
                                clearTimeout(timer);
                                ws.off('message', handler);
                                resolve(msg.body);
                            }
                        }

                        ws.on('message', handler);
                    });
                };

                try {
                    ws.send(JSON.stringify({
                        header: {
                            version: this.options.command_version,
                            requestId,
                            messagePurpose: 'data:item'
                        }
                    }));
                } catch (err) {
                    if (this.options.log_internal_errors) {
                        console.log(`${tags.error} - APIInstance.ItemTypes.getAll - ${color.whiteBright(err)}`);
                    }
                    continue;
                }

                let result = await wait(requestId);
                final.push(result);
            }

            return final.length <= 1 ? final[0] : final;
        },
        getAllForOne: async ws => {
            if (ws.readyState !== WebSocket.OPEN) return;

            let requestId = crypto.randomUUID({ disableEntropyCache: true });

            let wait = id => {
                return new Promise((resolve, reject) => {
                    let timer = setTimeout(() => {
                        ws.off('message', handler);
                        this.options.log_internal_errors
                            ? reject(new Error(`${tags.error} - APIInstance.ItemTypes.getAllForOne - Timed out waiting for item data response!`))
                            : reject();
                    }, 10000);

                    function handler(data) {
                        let msg;
                        try {
                            msg = JSON.parse(data);
                        } catch {
                            return;
                        }

                        if (msg?.header?.messagePurpose === 'data' && msg?.header?.dataType === 'item' && msg?.header?.requestId === id) {
                            clearTimeout(timer);
                            ws.off('message', handler);
                            resolve(msg.body);
                        }
                    }

                    ws.on('message', handler);
                });
            };

            try {
                ws.send(JSON.stringify({
                    header: {
                        version: this.options.command_version,
                        requestId,
                        messagePurpose: 'data:item'
                    }
                }));
            } catch (err) {
                if (this.options.log_internal_errors) {
                    console.log(`${tags.error} - APIInstance.ItemTypes.getAllForOne - ${color.whiteBright(err)}`);
                }
                return;
            }

            let result = await wait(requestId);
            return result;
        }
    }
    EntityTypes = {
        getAll: async() => {
            let final = [];

            for (let ws of this.wss.clients) {
                if (ws.readyState !== WebSocket.OPEN) continue;

                let requestId = crypto.randomUUID({ disableEntropyCache: true });

                let wait = id => {
                    return new Promise((resolve, reject) => {
                        let timer = setTimeout(() => {
                            ws.off('message', handler);
                            this.options.log_internal_errors
                                ? reject(new Error(`${tags.error} - APIInstance.EntityTypes.getAll - Timed out waiting for mob data response!`))
                                : reject();
                        }, 10000);

                        function handler(data) {
                            let msg;
                            try {
                                msg = JSON.parse(data);
                            } catch {
                                return;
                            }

                            if (msg?.header?.messagePurpose === 'data' && msg?.header?.dataType === 'mob' && msg?.header?.requestId === id) {
                                clearTimeout(timer);
                                ws.off('message', handler);
                                resolve(msg.body);
                            }
                        }

                        ws.on('message', handler);
                    });
                };

                try {
                    ws.send(JSON.stringify({
                        header: {
                            version: this.options.command_version,
                            requestId,
                            messagePurpose: 'data:mob'
                        }
                    }));
                } catch (err) {
                    if (this.options.log_internal_errors) {
                        console.log(`${tags.error} - APIInstance.EntityTypes.getAll - ${color.whiteBright(err)}`);
                    }
                    continue;
                }

                let result = await wait(requestId);
                final.push(result);
            }

            return final.length <= 1 ? final[0] : final;
        },
        getAllForOne: async ws => {
            if (ws.readyState !== WebSocket.OPEN) return;

            let requestId = crypto.randomUUID({ disableEntropyCache: true });

            let wait = id => {
                return new Promise((resolve, reject) => {
                    let timer = setTimeout(() => {
                        ws.off('message', handler);
                        this.options.log_internal_errors
                            ? reject(new Error(`${tags.error} - APIInstance.EntityTypes.getAllForOne - Timed out waiting for mob data response!`))
                            : reject();
                    }, 10000);

                    function handler(data) {
                        let msg;
                        try {
                            msg = JSON.parse(data);
                        } catch {
                            return;
                        }

                        if (msg?.header?.messagePurpose === 'data' && msg?.header?.dataType === 'mob' && msg?.header?.requestId === id) {
                            clearTimeout(timer);
                            ws.off('message', handler);
                            resolve(msg.body);
                        }
                    }

                    ws.on('message', handler);
                });
            };

            try {
                ws.send(JSON.stringify({
                    header: {
                        version: this.options.command_version,
                        requestId,
                        messagePurpose: 'data:mob'
                    }
                }));
            } catch (err) {
                if (this.options.log_internal_errors) {
                    console.log(`${tags.error} - APIInstance.EntityTypes.getAllForOne - ${color.whiteBright(err)}`);
                }
                return;
            }

            let result = await wait(requestId);
            return result;
        }
    }
    constructor() {
        console.log(`${tags.info} - ${color.greenBright('API initialized')}!`); // log the version of the package
        console.log(`${tags.info} - ${color.greenBright('Checking for updates')}...`); // log the version of the package
        check_for_updates()
    }
    // methods
    start(port, host, options) {
        try {
            this.wss = new WebSocket.Server({
                port: port,
                host: host ?? '127.0.0.1'
            });
            this.options = options ?? {};
            console.log(`${tags.info} - ${color.greenBright('API started')}; type \'${color.whiteBright(`/wsserver ${host ?? '127.0.0.1'}:${port}`)}\' on Minecraft to begin!`)
            let decoder = new TextDecoder();
            this.wss.on('connection', (ws, req) => {
                req.socket.setKeepAlive(true, 30000);
                ws.isAlive = true;
                console.log(`${tags.info} - ${color.blueBright('A client has connected')}!`)
                
                ws.on('message', raw => {
                    try {
                        let msg = JSON.parse(decoder.decode(raw));
                        switch (msg.header.messagePurpose) {
                            case 'commandRequest':
                                break;
                            case 'commandResponse':
                                if (msg.body.statusCode < 0 && this.options.log_command_errors) {
                                    console.log(`${tags.error} - ${color.whiteBright(msg.body.statusMessage)} | ${color.yellowBright(msg.body.statusCode)}`)
                                } else if (msg.body.statusCode >= 0 && this.options.log_command_output) {
                                    console.log(`${tags.info} - ${color.whiteBright(msg.body.statusMessage)}`)
                                }
                                break;
                            case 'error': 
                                this.options.log_message_errors ? console.log(`${tags.error} - ${color.whiteBright(msg.body.statusMessage ?? 'An error has occured.')} | ${color.yellowBright(msg.body.statusCode)}`) : void 0;
                                break;
                            default:
                                break;
                        }
                    } catch (err) {
                        this.options.log_internal_errors ? console.log(`${tags.error} - ${color.whiteBright(err)}`) : void 0;
                    }
                })
                ws.on('pong', () => {
                    ws.isAlive = true; // Mark alive when pong is received
                });
                ws.on('error', err => {
                    console.log(`${tags.error} - ${color.whiteBright(err)}`)
                });
                ws.on('close', () => {
                    console.log(`${tags.info} - ${color.blueBright('A client has disconnected')}.`)
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
                console.log(`${tags.error} - ${color.whiteBright(`SERVER ERROR`)} - ${color.whiteBright(`${err}`)}`)
            });
            this.wss.on('close', () => {
                console.log(`${tags.info} - ${color.blueBright('The server has closed')}.`)
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
    onPurpose(purpose, cb) {
        for (let ws of this.wss.clients) {
            if (ws.readyState !== WebSocket.OPEN) return;
            try {
                let a = raw => {
                    let msg = JSON.parse(raw.toString())

                    if (msg.header.messagePurpose === purpose) {
                        cb(msg, raw);
                    } else return;
                }
                ws.on('message', a)
                return a;
            } catch (err) {
                this.options.log_internal_errors ? console.log(`${tags.error} - APIInstance.onPurpose - ${color.whiteBright(err)}`) : void 0;
            }
        };
    }
    offPurpose(cb) {
        for (let ws of this.wss.clients) {
            if (ws.readyState !== WebSocket.OPEN) return;
            try {
                ws.off('message', cb)
                return;
            } catch (err) {
                this.options.log_internal_errors ? console.log(`${tags.error} - APIInstance.offPurpose - ${color.whiteBright(err)}`) : void 0;
            }
        }
    }
    onPurposeForOne(ws, purpose, cb) {
        if (ws.readyState !== WebSocket.OPEN) return;
        try {
            let a = raw => {
                let msg = JSON.parse(raw.toString())
                if (msg.header.messagePurpose === purpose) {
                    cb(msg, raw);
                } else return;
            }
            ws.on('message', a)
            return a;
        } catch (err) {
            this.options.log_internal_errors ? console.log(`${tags.error} - APIInstance.onPurpose - ${color.whiteBright(err)}`) : void 0;
        }
    }
    offPurposeForOne(ws, cb) {
        if (ws.readyState !== WebSocket.OPEN) return;
        try {
            ws.off('message', cb)
            return;
        } catch (err) {
            this.options.log_internal_errors ? console.log(`${tags.error} - APIInstance.offPurpose - ${color.whiteBright(err)}`) : void 0;
        }
    }
    unsubscribeCustom(eventType, cb) {
        for (let ws of this.wss.clients) {
            if (ws.readyState !== WebSocket.OPEN) return;
            try {
                ws.send(JSON.stringify({
                    header: {
                        version: this.options.command_version,
                        requestId: crypto.randomUUID({ disableEntropyCache: true }),
                        messageType: 'commandRequest',
                        messagePurpose: 'unsubscribe',
                    },
                    body: {
                        eventName: eventType
                    }
                }))
                let a = raw => {
                    let msg = JSON.parse(raw.toString())
                    if (msg.header.eventName === eventType) {
                        cb(msg);
                    } else return;
                }
                ws.off('message', a)
            } catch (err) {
                this.options.log_internal_errors ? console.log(`${tags.error} - APIInstance.unsubscribeCustom - ${color.whiteBright(err)}`) : void 0;
            }
        }
    }
    subscribeCustom(eventType, cb) {
        for (let ws of this.wss.clients) {
            if (ws.readyState !== WebSocket.OPEN) return;
            try {
                ws.send(JSON.stringify({
                    header: {
                        version: this.options.command_version,
                        requestId: crypto.randomUUID({ disableEntropyCache: true }),
                        messageType: 'commandRequest',
                        messagePurpose: 'subscribe',
                    },
                    body: {
                        eventName: eventType
                    }
                }))
                let a = raw => {
                    let msg = JSON.parse(raw.toString())
                    if (msg.header.eventName === eventType) {
                        cb(msg.body, raw);
                    } else return;
                }
                ws.on('message', a)
            } catch (err) {
                this.options.log_internal_errors ? console.log(`${tags.error} - APIInstance.subscribeCustom - ${color.whiteBright(err)}`) : void 0;
            }
        }
    }
    unsubscribeCustomForOne(ws, eventType, cb) {
        if (ws.readyState !== WebSocket.OPEN) return;
        try {
            ws.send(JSON.stringify({
                header: {
                    version: this.options.command_version,
                    requestId: crypto.randomUUID({ disableEntropyCache: true }),
                    messageType: 'commandRequest',
                    messagePurpose: 'unsubscribe',
                },
                body: {
                    eventName: eventType
                }
            }))
            let a = raw => {
                let msg = JSON.parse(raw.toString())
                if (msg.header.eventName === eventType) {
                    cb(msg);
                } else return;
            }
            ws.off('message', a)
        } catch (err) {
            this.options.log_internal_errors ? console.log(`${tags.error} - APIInstance.unsubscribeCustomForOne - ${color.whiteBright(err)}`) : void 0;
        }
    }
    subscribeCustomForOne(ws, eventType, cb) {
        if (ws.readyState !== WebSocket.OPEN) return;
        try {
            ws.send(JSON.stringify({
                header: {
                    version: this.options.command_version,
                    requestId: crypto.randomUUID({ disableEntropyCache: true }),
                    messageType: 'commandRequest',
                    messagePurpose: 'subscribe',
                },
                body: {
                    eventName: eventType
                }
            }))
            let a = raw => {
                let msg = JSON.parse(raw.toString())
                if (msg.header.eventName === eventType) {
                    cb(msg);
                } else return;
            }
            ws.on('message', a)
        } catch (err) {
            this.options.log_internal_errors ? console.log(`${tags.error} - APIInstance.subscribeCustomForOne - ${color.whiteBright(err)}`) : void 0;
        }
    }
    send(json) {
        for (let ws of this.wss.clients) {
            if (ws.readyState !== WebSocket.OPEN) return;
            try {
                ws.send(JSON.stringify(json))
            } catch (err) {
                this.options.log_internal_errors ? console.log(`${tags.error} - APIInstance.send - ${color.whiteBright(err)}`) : void 0;
            }
        };
    }
    raw(raw) {
        for (let ws of this.wss.clients) {
            if (ws.readyState !== WebSocket.OPEN) return;
            try {
                ws.send(raw)
            } catch (err) {
                this.options.log_internal_errors ? console.log(`${tags.error} - APIInstance.raw - ${color.whiteBright(err)}`) : void 0;
            }
        };
    }
    sendForOne(ws, json) {
        if (ws.readyState !== WebSocket.OPEN) return;
        try {
            ws.send(JSON.stringify(json))
        } catch (err) {
            this.options.log_internal_errors ? console.log(`${tags.error} - APIInstance.send - ${color.whiteBright(err)}`) : void 0;
        }
    }
    rawForOne(ws, raw) {
        if (ws.readyState !== WebSocket.OPEN) return;
        try {
            ws.send(raw)
        } catch (err) {
            this.options.log_internal_errors ? console.log(`${tags.error} - APIInstance.raw - ${color.whiteBright(err)}`) : void 0;
        }
    }
    runCommand(command) {
        let ret = []
        for (let ws of this.wss.clients) {
            if (ws.readyState !== WebSocket.OPEN) return;
            try {
                if (typeof command === 'string') {
                    let id = crypto.randomUUID({ disableEntropyCache: true })
                    ws.send(JSON.stringify({
                        header: {
                            version: this.options.command_version,
                            requestId: id,
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
                    ret.push(id)
                } else if (Array.isArray(command)) {
                    let r = []
                    for (let cmd of command) {
                        if (typeof cmd !== 'undefined') {
                            let id = crypto.randomUUID({ disableEntropyCache: true })
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
                            r.push(id)
                        }
                    }
                    ret.push(r)
                } else {
                    console.log(`${tags.error} - APIInstance.runCommand - Command input must be either an Array or String.`)
                }
            } catch (err) {
                this.options.log_internal_errors ? console.log(`${tags.error} - APIInstance.runCommand - ${color.whiteBright(err)}`) : void 0;
            }
        }
        return ret.length <= 1 ? ret[0] : ret.flat();
    }
    runCommandForOne(ws, command) {
        let ret;
        if (ws.readyState !== WebSocket.OPEN) return;
        try {
            if (typeof command === 'string') {
                ret = crypto.randomUUID({ disableEntropyCache: true })
                ws.send(JSON.stringify({
                    header: {
                        version: this.options.command_version,
                        requestId: ret,
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
            } else if (Array.isArray(command)) {
                ret = []
                for (let cmd of command) {
                    if (typeof cmd !== 'undefined') {
                        let id = crypto.randomUUID({ disableEntropyCache: true })
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
                console.log(`${tags.error} - APIInstance.runCommandForOne - Command input must be either an Array or String.`)
            }
        } catch (err) {
            this.options.log_internal_errors ? console.log(`${tags.error} - APIInstance.runCommandForOne - ${color.whiteBright(err)}`) : void 0;
        }
        return ret;
    }
    async runCommandAsync(command) {
        let final = [];
        for (let ws of this.wss.clients) {
            if (ws.readyState !== WebSocket.OPEN) continue;
            let wait = id => {
                return new Promise((resolve, reject) => {
                    let timer = setTimeout(() => {
                        ws.off('message', handler);
                        this.options.log_internal_errors
                            ? reject(new Error(`${tags.error} - APIInstance.runCommandAsync - Timed out waiting for commandResponse!`))
                            : reject();
                    }, 10000);
                    function handler(data) {
                        let msg;
                        try {
                            msg = JSON.parse(data);
                        } catch {
                            return;
                        }
                        if (msg?.header?.messagePurpose === 'commandResponse' && msg?.header?.requestId === id) {
                            clearTimeout(timer);
                            ws.off('message', handler);
                            resolve(msg);
                        }
                    }
                    ws.on('message', handler);
                });
            };
            if (typeof command === 'string') {
                let id = this.runCommandForOne(ws, command);
                let result = await wait(id);
                final.push(result);
            } else if (Array.isArray(command)) {
                let results = [];
                for (let cmd of command) {
                    if (typeof cmd !== 'string') continue;
                    let id = this.runCommandForOne(ws, cmd);
                    let result = await wait(id);
                    results.push(result);
                }
                final.push(results);
            } else {
                console.log(`${tags.error} - APIInstance.runCommandAsync - Command input must be either an Array or String.`);
                continue
            }
        }
        return final.flat().length <= 1 ? final.flat()[0] : final.flat();
    }
    async runCommandAsyncForOne(ws, command) {
        if (ws.readyState !== WebSocket.OPEN) return;
        let wait = id => {
            return new Promise((resolve, reject) => {
                let timer = setTimeout(() => {
                    ws.off('message', handler);
                    this.options.log_internal_errors
                        ? reject(new Error(`${tags.error} - APIInstance.runCommandAsyncForOne - Timed out waiting for commandResponse!`))
                        : reject();
                }, 10000);
                function handler(data) {
                    let msg;
                    try {
                        msg = JSON.parse(data);
                    } catch {
                        return;
                    }
                    if (msg?.header?.messagePurpose === 'commandResponse' && msg?.header?.requestId === id) {
                        clearTimeout(timer);
                        ws.off('message', handler);
                        resolve(msg);
                    }
                }
                ws.on('message', handler);
            });
        };
        if (typeof command === 'string') {
            let id = this.runCommandForOne(ws, command);
            let result = await wait(id);
            return result;
        } else if (Array.isArray(command)) {
            let results = [];
            for (let cmd of command) {
                if (typeof cmd !== 'string') continue;
                let id = this.runCommandForOne(ws, cmd);
                let result = await wait(id);
                results.push(result);
            }
            return results;
        } else {
            console.log(`${tags.error} - APIInstance.runCommandAsyncForOne - Command input must be either an Array or String.`);
            return;
        }
    }
}
class AfterEventSignal {
    #internalName;
    #callbacks = new Set();
    #apiInstance;
    #a;
    constructor(internalName, apiInstance=new APIInstance()) {
        this.#internalName = internalName;
        this.#apiInstance = apiInstance;
        this.#a = (raw, cb, id) => {
            let msg = JSON.parse(raw.toString())
            if (msg.header.eventName === this.#internalName) {
                cb(msg.body, raw);
            } else return;
        }
    }
    subscribe(callback) {
        this.#callbacks.add(callback);
        if (this.#callbacks.size === 1) {
            this.#apiInstance.wss.clients.forEach(ws => {
                if (ws.readyState === WebSocket.OPEN) {
                    try {
                        let id = crypto.randomUUID({ disableEntropyCache: true })
                        ws.send(JSON.stringify({
                            header: {
                                version: this.#apiInstance.options.command_version,
                                requestId: id,
                                messageType: 'commandRequest',
                                messagePurpose: 'subscribe',
                            },
                            body: {
                                eventName: this.#internalName
                            }
                        }))
                        ws.on('message', raw => this.#a(raw, callback, id))
                    } catch (err) {
                        this.#apiInstance.options.log_internal_errors ? console.log(`${tags.error} - AfterEventSignal.subscribe - ${color.whiteBright(err)}`) : void 0;
                    }
                }
            })
        }
    }
    unsubscribe(callback) {
        this.#callbacks.delete(callback);
        if (this.#callbacks.size === 0) {
            this.#apiInstance.wss.clients.forEach(ws => {
                if (ws.readyState === WebSocket.OPEN) {
                    try {
                        let id = crypto.randomUUID({ disableEntropyCache: true })
                        ws.send(JSON.stringify({
                            header: {
                                version: this.#apiInstance.command_version,
                                requestId: id,
                                messageType: 'commandRequest',
                                messagePurpose: 'unsubscribe',
                            },
                            body: {
                                eventName: this.#internalName
                            }
                        }))
                        ws.off('message', raw => this.#a(raw, callback, id))
                    } catch (err) {
                        this.#apiInstance.options.log_internal_errors ? console.log(`${tags.error} - AfterEventSignal.unsubscribe - ${color.whiteBright(err)}`) : void 0;
                    }
                }
            })
        }
    }
    subscribeForOne(ws, callback) {
        this.#callbacks.add(callback);
        if (this.#callbacks.size === 1) {
            if (ws.readyState === WebSocket.OPEN) {
                try {
                    let id = crypto.randomUUID({ disableEntropyCache: true })
                    ws.send(JSON.stringify({
                        header: {
                            version: this.#apiInstance.options.command_version,
                            requestId: id,
                            messageType: 'commandRequest',
                            messagePurpose: 'subscribe',
                        },
                        body: {
                            eventName: this.#internalName
                        }
                    }))
                    ws.on('message', raw => this.#a(raw, callback, id))
                } catch (err) {
                    this.#apiInstance.options.log_internal_errors ? console.log(`${tags.error} - AfterEventSignal.subscribeForOne - ${color.whiteBright(err)}`) : void 0;
                }
            }
        }
    }
    unsubscribeForOne(ws, callback) {
        this.#callbacks.delete(callback);
        if (this.#callbacks.size === 0) {
            if (ws.readyState === WebSocket.OPEN) {
                try {
                    let id = crypto.randomUUID({ disableEntropyCache: true })
                    ws.send(JSON.stringify({
                        header: {
                            version: this.#apiInstance.command_version,
                            requestId: id,
                            messageType: 'commandRequest',
                            messagePurpose: 'unsubscribe',
                        },
                        body: {
                            eventName: this.#internalName
                        }
                    }))
                    ws.off('message', raw => this.#a(raw, callback, id))
                } catch (err) {
                    this.#apiInstance.options.log_internal_errors ? console.log(`${tags.error} - AfterEventSignal.unsubscribeForOne - ${color.whiteBright(err)}`) : void 0;
                }
            }
        }
    }
}
class ChatSendAfterEventSignal extends AfterEventSignal {
    #internalName;
    #callbacks;
    #apiInstance;
    #a;
    constructor() {
        super('')
        throw `${tags.error} - ${color.whiteBright(`Class ${this.constructor.name} does not have a valid constructor.`)}`
    }
    subscribe() {}
    unsubscribe() {}
    subscribeForOne() {}
    unsubscribeForOne() {}
}
class PlayerMoveAfterEventSignal extends AfterEventSignal {
    #internalName;
    #callbacks;
    #apiInstance;
    #a;
    constructor() {
        super('')
        throw `${tags.error} - ${color.whiteBright(`Class ${this.constructor.name} does not have a valid constructor.`)}`
    }
    subscribe() {}
    unsubscribe() {}
    subscribeForOne() {}
    unsubscribeForOne() {}
}
class PlayerTransformAfterEventSignal extends AfterEventSignal {
    #internalName;
    #callbacks;
    #apiInstance;
    #a;
    constructor() {
        super('')
        throw `${tags.error} - ${color.whiteBright(`Class ${this.constructor.name} does not have a valid constructor.`)}`
    }
    subscribe() {}
    unsubscribe() {}
    subscribeForOne() {}
    unsubscribeForOne() {}
}
class PlayerTeleportAfterEventSignal extends AfterEventSignal {
    #internalName;
    #callbacks;
    #apiInstance;
    #a;
    constructor() {
        super('')
        throw `${tags.error} - ${color.whiteBright(`Class ${this.constructor.name} does not have a valid constructor.`)}`
    }
    subscribe() {}
    unsubscribe() {}
    subscribeForOne() {}
    unsubscribeForOne() {}
}
class PlayerDieAfterEventSignal extends AfterEventSignal {
    #internalName;
    #callbacks;
    #apiInstance;
    #a;
    constructor() {
        super('')
        throw `${tags.error} - ${color.whiteBright(`Class ${this.constructor.name} does not have a valid constructor.`)}`
    }
    subscribe() {}
    unsubscribe() {}
    subscribeForOne() {}
    unsubscribeForOne() {}
}
class PlayerBounceAfterEventSignal extends AfterEventSignal {
    #internalName;
    #callbacks;
    #apiInstance;
    #a;
    constructor() {
        super('')
        throw `${tags.error} - ${color.whiteBright(`Class ${this.constructor.name} does not have a valid constructor.`)}`
    }
    subscribe() {}
    unsubscribe() {}
    subscribeForOne() {}
    unsubscribeForOne() {}
}
class EntitySpawnAfterEventSignal extends AfterEventSignal {
    #internalName;
    #callbacks;
    #apiInstance;
    #a;
    constructor() {
        super('')
        throw `${tags.error} - ${color.whiteBright(`Class ${this.constructor.name} does not have a valid constructor.`)}`
    }
    subscribe() {}
    unsubscribe() {}
    subscribeForOne() {}
    unsubscribeForOne() {}
}
class ItemCompleteUseAfterEventSignal extends AfterEventSignal {
    #internalName;
    #callbacks;
    #apiInstance;
    #a;
    constructor() {
        super('')
        throw `${tags.error} - ${color.whiteBright(`Class ${this.constructor.name} does not have a valid constructor.`)}`
    }
    subscribe() {}
    unsubscribe() {}
    subscribeForOne() {}
    unsubscribeForOne() {}
}
class ItemUseAfterEventSignal extends AfterEventSignal {
    #internalName;
    #callbacks;
    #apiInstance;
    #a;
    constructor() {
        super('')
        throw `${tags.error} - ${color.whiteBright(`Class ${this.constructor.name} does not have a valid constructor.`)}`
    }
    subscribe() {}
    unsubscribe() {}
    subscribeForOne() {}
    unsubscribeForOne() {}
}
class PlayerEquipItemAfterEventSignal extends AfterEventSignal {
    #internalName;
    #callbacks;
    #apiInstance;
    #a;
    constructor() {
        super('')
        throw `${tags.error} - ${color.whiteBright(`Class ${this.constructor.name} does not have a valid constructor.`)}`
    }
    subscribe() {}
    unsubscribe() {}
    subscribeForOne() {}
    unsubscribeForOne() {}
}
class PlayerAcquireItemAfterEventSignal extends AfterEventSignal {
    #internalName;
    #callbacks;
    #apiInstance;
    #a;
    constructor() {
        super('')
        throw `${tags.error} - ${color.whiteBright(`Class ${this.constructor.name} does not have a valid constructor.`)}`
    }
    subscribe() {}
    unsubscribe() {}
    subscribeForOne() {}
    unsubscribeForOne() {}
}
class PlayerDropItemAfterEventSignal extends AfterEventSignal {
    #internalName;
    #callbacks;
    #apiInstance;
    #a;
    constructor() {
        super('')
        throw `${tags.error} - ${color.whiteBright(`Class ${this.constructor.name} does not have a valid constructor.`)}`
    }
    subscribe() {}
    unsubscribe() {}
    subscribeForOne() {}
    unsubscribeForOne() {}
}
class PlayerCraftItemAfterEventSignal extends AfterEventSignal {
    #internalName;
    #callbacks;
    #apiInstance;
    #a;
    constructor() {
        super('')
        throw `${tags.error} - ${color.whiteBright(`Class ${this.constructor.name} does not have a valid constructor.`)}`
    }
    subscribe() {}
    unsubscribe() {}
    subscribeForOne() {}
    unsubscribeForOne() {}
}
class PlayerAcquireSmeltedItemAfterEventSignal extends AfterEventSignal {
    #internalName;
    #callbacks;
    #apiInstance;
    #a;
    constructor() {
        super('')
        throw `${tags.error} - ${color.whiteBright(`Class ${this.constructor.name} does not have a valid constructor.`)}`
    }
    subscribe() {}
    unsubscribe() {}
    subscribeForOne() {}
    unsubscribeForOne() {}
}
class PlayerPlaceBlockAfterEventSignal extends AfterEventSignal {
    #internalName;
    #callbacks;
    #apiInstance;
    #a;
    constructor() {
        super('')
        throw `${tags.error} - ${color.whiteBright(`Class ${this.constructor.name} does not have a valid constructor.`)}`
    }
    subscribe() {}
    unsubscribe() {}
    subscribeForOne() {}
    unsubscribeForOne() {}
}
class PlayerBreakBlockAfterEventSignal extends AfterEventSignal {
    #internalName;
    #callbacks;
    #apiInstance;
    #a;
    constructor() {
        super('')
        throw `${tags.error} - ${color.whiteBright(`Class ${this.constructor.name} does not have a valid constructor.`)}`
    }
    subscribe() {}
    unsubscribe() {}
    subscribeForOne() {}
    unsubscribeForOne() {}
}
class PlayerKillEntityAfterEventSignal extends AfterEventSignal {
    #internalName;
    #callbacks;
    #apiInstance;
    #a;
    constructor() {
        super('')
        throw `${tags.error} - ${color.whiteBright(`Class ${this.constructor.name} does not have a valid constructor.`)}`
    }
    subscribe() {}
    unsubscribe() {}
    subscribeForOne() {}
    unsubscribeForOne() {}
}
class PlayerInteractWithEntityAfterEventSignal extends AfterEventSignal {
    #internalName;
    #callbacks;
    #apiInstance;
    #a;
    constructor() {
        super('')
        throw `${tags.error} - ${color.whiteBright(`Class ${this.constructor.name} does not have a valid constructor.`)}`
    }
    subscribe() {}
    unsubscribe() {}
    subscribeForOne() {}
    unsubscribeForOne() {}
}
class TargetBlockHitAfterEventSignal extends AfterEventSignal {
    #internalName;
    #callbacks;
    #apiInstance;
    #a;
    constructor() {
        super('')
        throw `${tags.error} - ${color.whiteBright(`Class ${this.constructor.name} does not have a valid constructor.`)}`
    }
    subscribe() {}
    unsubscribe() {}
    subscribeForOne() {}
    unsubscribeForOne() {}
}
// enums
const TravelMethod = {
    Walk: 0,
    Water: 1,
    Aerial: 2,
    Climb: 3,
    Lava: 4,
    Fly: 5,
    Ride: 6,
    Sneak: 7,
    Sprint: 8,
    Bounce: 9,
    FrostedIce: 10,
    Teleport: 11
}
const TeleportMethod = {
    EndGateway: 0,
    Projectile: 1,
    ChorusFruit: 2,
    Command: 3,
    Behavior: 4
}
const SpawnMethod = {
    SpawnEgg: 1,
    Command: 2,
    MobSpawner: 4
}
const ItemCompleteUseMethod = {
    Eat: 1,
    Drink: 3,
    Throw: 4,
    Shoot: 5,
    Place: 6,
    OnBlock: 9,
    Cast: 10
}
const ItemUseMethod = {
    Use: 0,
    Place: 1
}
const ItemAcquisitionMethod = {
    Pickup: 1,
    Craft: 2,
    Chest: 3,
    Anvil: 6,
    Smelt: 7,
    Brew: 8,
    BucketFill: 9,
    Trade: 10,
    Fish: 11
}
const BlockPlacementMethod = {
    Place: 0
}
const BlockDestructionMethod = {
    Break: 0
}
const EntityDamageCause = {
    none: -1,
    override: 0,
    contact: 1,
    entityAttack: 2,
    projectile: 3,
    suffocation: 4,
    fall: 5,
    fire: 6,
    fireTick: 7,
    drowning: 9,
    blockExplosion: 10,
    entityExplosion: 11,
    void: 12,
    selfDestruct: 13,
    magic: 14,
    wither: 15,
    starve: 16,
    anvil: 17,
    thorns: 18,
    fallingBlock: 19,
    piston: 20,
    flyIntoWall: 21,
    magma: 22,
    fireworks: 23,
    lightning: 24,
    charging: 25,
    temperature: 26,
    stalactite: 28,
    stalagmite: 29,
    ramAttack: 30,
    sonicBoom: 31,
    campfire: 32,
    soulCampfire: 33,
    maceSmash: 34
}
module.exports = {
    // classes
    APIInstance,
    AfterEventSignal,
    // enums
    TravelMethod,
    TeleportMethod,
    SpawnMethod,
    ItemCompleteUseMethod,
    ItemUseMethod,
    ItemAcquisitionMethod,
    BlockPlacementMethod,
    BlockDestructionMethod,
    EntityDamageCause,
    // event signals
    ChatSendAfterEventSignal,
    PlayerMoveAfterEventSignal,
    PlayerTransformAfterEventSignal,
    PlayerTeleportAfterEventSignal,
    PlayerDieAfterEventSignal,
    PlayerBounceAfterEventSignal,
    EntitySpawnAfterEventSignal,
    ItemCompleteUseAfterEventSignal,
    ItemUseAfterEventSignal,
    PlayerEquipItemAfterEventSignal,
    PlayerAcquireItemAfterEventSignal,
    PlayerDropItemAfterEventSignal,
    PlayerCraftItemAfterEventSignal,
    PlayerAcquireSmeltedItemAfterEventSignal,
    PlayerPlaceBlockAfterEventSignal,
    PlayerBreakBlockAfterEventSignal,
    PlayerKillEntityAfterEventSignal,
    PlayerInteractWithEntityAfterEventSignal,
    TargetBlockHitAfterEventSignal,
}