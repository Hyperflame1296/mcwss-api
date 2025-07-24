let { APIInstance } = require('./index.js')

let api = new APIInstance();
api.start(8080, '127.0.0.1', {
    logCmdErrors: false, // log command syntax errors
    logCmdOutput: false, // log command output
    logMsgErrors: false, // log errors from the client
    logSeriousErrors: true, // log serious errors (they'd likely be JSON parse errors)
    logOther: false // log other stuff
})

try {
    api.wss.on('connection', (ws, req) => {
        api.subscribe(ws, 'PlayerMessage') // listen for PlayerMessage events 
        api.on(ws, 'PlayerMessage', msg => {
            console.log(msg) // logs any PlayerMessage event that goes through
        })
    });
} catch (err) {
    console.log(`error: ${err}`) // log any errors that occur
}