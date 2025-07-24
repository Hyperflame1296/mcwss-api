# mcwss-api
Im making a wrapper for the Minecraft WSS API, an undocumented API that lets you communicate with Minecraft Bedrock Edition through WebSockets.  
Found a bug? [Let me know](https://github.com/Hyperflame1296/mcwss-api/issues)!

### Contributors
[TensiveYT](https://youtube.com/@Hyperflamee8) (author)

### Credits
jocopa3 (for the event list)

### Notes
- if i find anything new, i'll add it to this package ig

# Installation
To install the package, simply nagivate to your project folder, open the command line there, and run
```plaintext
npm i mcwss-api@latest
```
# Example
```javascript
let { APIInstance } = require('mcwss-api')

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
            api.run_command(ws, `say ${msg.body.message}`) // send the message back with /say!
        })
    });
} catch (err) {
    console.log(`error: ${err}`) // log any errors that occur
}
```

# Methods

### run_command
Runs a minecraft command.
```javascript
api.run_command(ws, command)
```

### start
Starts the server. 
- This should work with any host that you own, or just localhost.
```javascript
api.start(port, host, opts)
```

### stop
Stops the server.
```javascript
api.stop()
```

### subscribe
Subscribe to an event type, to listen for it. 
- Available events are in the Events section.
```javascript
api.subscribe(ws, event_type)
```

### unsubscribe
Unsubscribe to an event type, to stop listening for it.
- Available events are in the Events section.
```javascript
api.unsubscribe(ws, event_type)
```

### on
Run a callback every time a message of a specified event type goes through.
- Available events are in the Events section.
- Make sure to run `api.subscribe(ws, event_type)` beforehand, otherwise this will not work.
```javascript
api.on(ws, event_type, callback)
```

### on_purpose
Run a callback every time a message of a specified purpose goes through.
```javascript
api.on_purpose(ws, purpose, callback)
```

### send
Sends JSON data to a client.
```javascript
api.send(ws, json)
```

### send_raw
Sends raw buffer/string data to a client.
```javascript
api.send_raw(ws, raw)
```

# Properties
### wss
The server class itself. This is useful for other raw data communication.

### options
The options for the package

# Events
These are all of the events that worked when I tested them.
- you can figure out the JSON that these return, i'm too lazy to write that lol
- Most of these only work for whatever client is connected to the wss (the host in most cases), so maybe test it first before you get too excited!

### PlayerMessage
Fires every time a message gets sent in general. Not just players.
- If you are the host, this works for messages sent by other players. Otherwise, it only works for yours.

### PlayerTravelled
This fires whenever the player moves around.

### PlayerTransform
As far as I know, exact same thing as PlayerTravelled, not sure what the difference is...

### PlayerTeleport
This fires whenever the player teleports. (via /tp or the like)

### PlayerDied
This fires whenever the player dies.

### PlayerBounced
This fires whenever the player bounces on a slime block, bed, or any other bouncy block.

### EntitySpawned
This fires whenever you spawn something with a spawn egg.

### ItemUsed
This fires whenever you use an item.

### ItemAcquired
This fires whenever you pick up an item.

### ItemDropped
This fires whenever you drop an item.

### ItemSmelted
This fires whenever you grab a cooked item out of a furnace.

### ItemCrafted
This fires whenever you craft something.

### BlockPlaced
This fires whenever you place a block.

### BlockBroken
This fires whenever you break a block.

### MobKilled
This fires whenever you kill a mob.

### MobInteracted
This fires whenever you interact with a mob. (unless it has no interact function)

# Purposes
These are all of the values that `messagePurpose` can have (or at least all of the ones that i've found).

```plaintext
commandRequest
commandResponse
event
error
```