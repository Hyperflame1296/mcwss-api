# mcwss-api
Im making a wrapper for the Minecraft WSS API, an undocumented API that lets you communicate with Minecraft Bedrock Edition through WebSockets.  
Found a bug? [Let me know](https://github.com/Hyperflame1296/mcwss-api/issues)!

### Contributors
[TensiveYT](https://youtube.com/@Hyperflamee8) (author)

### Credits
jocopa3 (for the initial event list)

### Notes
- if i find anything new, i'll add it to this package ig

# Example
```javascript
let { APIInstance } = require('mcwss-api')

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
                api.run_command(ws, `say ${msg.body.message}`) // send the message back with /say!
            }
        })
    });
} catch (err) {
    console.log(`error: ${err}`) // log any errors that occur
}
```

# Methods

### run_command
Execute a command in Minecraft.
- `command` is normally a string, but you can also pass arrays into it, executing multiple commands at once.
```javascript
api.run_command(ws, command)
```

### start
Start the server. 
- This should work with any host that you own, or just localhost.
```javascript
api.start(port, host, opts)
```

### stop
Stop the server.
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
Send JSON data to a client.
```javascript
api.send(ws, json)
```

### send_raw
Send raw buffer/string data to a client.
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
This is the exact same thing as PlayerTravelled, except with no information about how & where the player moved.

### PlayerTeleported
This fires whenever the player teleports. (via /tp or the like)

### PlayerDied
This fires whenever the player dies.

### PlayerBounced
This fires whenever the player bounces on a slime block, bed, or any other bouncy block.

### EntitySpawned
This fires whenever you spawn something, via spawn egg or command.

### ItemUsed
This fires whenever you finish using an item.

### ItemInteracted
This fires whenever either right-click with an item, place it's block, or begin/finish using that item.

### ItemEquipped
This fires whenever you equip an item.
- Unless the item being equipped is a Shield, putting the item into the equip slot through the inventory will not work.
- You need to use the right-click equip feature.

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