let { APIInstance } = require('./index.js')

let api = new APIInstance();
api.start(8080, '127.0.0.1', {
    // logging
    log_command_errors : true , // log command syntax errors into console
    log_command_output : false, // log command outputs into console
    log_message_errors : false, // log json message errors into console
    log_internal_errors: true , // log internal package errors into console
    // game stuff
    command_version: 1 // message request version, default is 1, highest is 42
})

try {
    api.wss.on('connection', (ws, req) => {
        api.subscribe(ws, 'PlayerMessage') // listen for PlayerMessage events 
        api.on(ws, 'PlayerMessage', msg => {
            if (msg.body.type !== 'say') { // to prevent an infinite loop
                console.log(msg) // logs any PlayerMessage event that goes through
                api.runCommand(ws, `say ${msg.body.message}`) // send the message back with /say!
            }
        })
    });
} catch (err) {
    console.log(`error: ${err}`) // log any errors that occur
}