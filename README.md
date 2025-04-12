# mcwss-api
a wrapper for the MCWSS API, an undocumented API for Minecraft

- i've decided to make a wrapper for the Minecraft Bedrock WSS API
- in javascript
- this is still a very early version of it, though

# Example
```js
let api = require('mcwss-api')

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
- runs a minecraft command
```js
api.runCommand(ws, command)
```

### start
- starts the WSS
```js
api.start(port, host, opts)
```

### stop
- stops the WSS
```js
api.stop()
```

### subscribe
- listen for a specific event type
```js
api.subscribe(ws, eventType)
```

### unsubscribe
- stop listening for a specific event type
```js
api.unsubscribe(ws, eventType)
```

# Properties

### wss
- the WSS itself

### opts
- the wrapper options

# Events
- these are all of the events that worked when i tested them
- you can figure out the JSON, i'm too lazy to write that
- most of these only work for whatever client is connected to the wss (the host in most cases), so maybe test it first before you get too excited

### PlayerMessage
- the obvious one, fires every time a message sends
- this only works with messages from other players, if you are the host

### PlayerTravelled
- this fires whenever the player moves

### PlayerTransform
- as far as i know, exact same thing as PlayerTravelled, not sure what the difference is

### PlayerTeleport
- this fires whenever the player teleports (via /tp)

### PlayerDied
- this fires whenever the player dies

### PlayerBounced
- this fires whenever the player bounces on a slime block, bed, or any bounceable block

### EntitySpawned
- this fires whenever you spawn smth with a spawn egg

### ItemUsed
- this fires whenever you use an item, or place it's block

### ItemAcquired
- this fires whenever you pick up an item

### ItemSmelted
- this fires whenever you grab a cooked item out of a furnace

### ItemCrafted
- this fires whenever you craft something

### BlockPlaced
- this fires whenever you place a block

### BlockBroken
- this fires whenever you break a block

### MobKilled
- this fires whenever you kill a mob

### MobInteracted
- this fires whenever you interact with a mob (unless it has no interact function)
