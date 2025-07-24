# mcwss-api
- Im making a wrapper for the Minecraft WSS API, an undocumented API that lets you communicate with Minecraft Bedrock Edition through WebSockets.

- Made by [TensiveYT](https://youtube.com/@Hyperflamee8)!

### Contributors
(none yet)

### Notes
- if i find anything new, i'll add it to this package ig

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
        })
    });
} catch (err) {
    console.log(`error: ${err}`) // log any errors that occur
}
```

# Methods

### runCommand
- Runs a minecraft command.
```javascript
api.runCommand(ws, command)
```

### start
- Starts the server. 
- This should work with any host that you own, or just localhost.
```javascript
api.start(port, host, opts)
```

### stop
- Stops the server.
```javascript
api.stop()
```

### subscribe
- Subscribe to an event type, to listen for it. 
- Available events are in the Events section.
```javascript
api.subscribe(ws, event_type)
```

### unsubscribe
- Unsubscribe to an event type, to stop listening for it.
- Available events are in the Events section.
```javascript
api.unsubscribe(ws, eventType)
```

# Properties
### wss
- The server class itself. This is useful for other raw data communication.

### options
- The options for the package

# Events
- These are all of the events that worked when I tested them.
- you can figure out the JSON, i'm too lazy to write that lol
- Most of these only work for whatever client is connected to the wss (the host in most cases), so maybe test it first before you get too excited!

### PlayerMessage
- the obvious one, fires every time a message sends
- If you are the host, this works for messages sent by other players. Otherwise, it only works for yours.

### PlayerTravelled
- This fires whenever the player moves around.

### PlayerTransform
- As far as I know, exact same thing as PlayerTravelled, not sure what the difference is...

### PlayerTeleport
- This fires whenever the player teleports. (via /tp or the like)

### PlayerDied
- This fires whenever the player dies.

### PlayerBounced
- This fires whenever the player bounces on a slime block, bed, or any other bouncy block.

### EntitySpawned
- This fires whenever you spawn something with a spawn egg.

### ItemUsed
- This fires whenever you use an item, or place it's block.

### ItemAcquired
- This fires whenever you pick up an item.

### ItemSmelted
- This fires whenever you grab a cooked item out of a furnace.

### ItemCrafted
- This fires whenever you craft something.

### BlockPlaced
- This fires whenever you place a block.

### BlockBroken
- This fires whenever you break a block.

### MobKilled
- This fires whenever you kill a mob.

### MobInteracted
- This fires whenever you interact with a mob. (unless it has no interact function)