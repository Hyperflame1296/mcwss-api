# mcwss-api
Im making a wrapper for the Minecraft WSS API, an undocumented API that lets you communicate with Minecraft Bedrock Edition through WebSockets.  
Found a bug? [Let me know](https://github.com/Hyperflame1296/mcwss-api/issues)!

### Contributors
[TensiveYT](https://youtube.com/@Hyperflamee8) (author)

### Credits
jocopa3 (for the initial event list)

### Notes
- if i find anything new, i'll add it to this package ig

### Instalation
Simply run this in your command line:
```batch
npm i mcwss-api@latest
```

# Example
```javascript
let { APIInstance } = require('mcwss-api')

let api = new APIInstance();
api.start(8080, 'localhost', {
    // logging
    log_command_errors : true , // log command syntax errors into console
    log_command_output : false, // log command outputs into console
    log_message_errors : false, // log json message errors into console
    log_internal_errors: true , // log internal package errors into console
    // game stuff
    command_version: 1 // message request version, default is 1, highest is 42
})

api.wss.on('connection', ws => {
    api.afterEvents.chatSend.subscribe(msg => {
        if (msg.body.type !== 'say') { // to prevent an infinite loop
            console.log(msg) // logs any PlayerMessage event that goes through
            api.runCommand(`say ${msg.body.message}`) // send the message back with /say!
        }
    })
});
```

# Methods

### runCommand
Execute an in-game command for all clients connected to the WSS.
- `command` is normally a string, but you can also pass arrays into it, executing multiple commands at once.
- Note that the position at which commands are run from, is the position of the client that's connected to the WSS.
```javascript
api.runCommand(command)
```

### runCommandAsync
Execute an in-game command for all clients connected to the WSS, and wait for a response.  
***WARNING!*** - This method could be unsafe because some commands can resolve the wrong responses.
- `command` is normally a string, but you can also pass arrays into it, executing multiple commands at once.
- Note that the position at which commands are run from, is the position of the client that's connected to the WSS.
```javascript
await api.runCommandAsync(command)
```

### runCommandForOneClient
Execute an in-game command for a specific client connected to the WSS.
- `command` is normally a string, but you can also pass arrays into it, executing multiple commands at once.
- Note that the position at which commands are run from, is the position of the client that's connected to the WSS.
```javascript
api.runCommandForOneClient(ws, command)
```

### runCommandAsyncForOneClient
Execute an in-game command for a specific client connected to the WSS, and wait for a response.  
***WARNING!*** - This method could be unsafe because some commands can resolve the wrong responses.

- `command` is normally a string, but you can also pass arrays into it, executing multiple commands at once.
- Note that the position at which commands are run from, is the position of the client that's connected to the WSS.
```javascript
await api.runCommandAsyncForOneClient(ws, command)
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

### subscribeCustom
Subscribe to an custom event type, to listen for events that aren't in the Events section.
```javascript
api.subscribeCustom(event_type)
```

### unsubscribeCustom
Unsubscribe to an custom event type, to stop listening for events that aren't in the Events section.
```javascript
api.unsubscribeCustom(event_type)
```

### onPurpose
Listen for a specified event purpose.
```javascript
api.onPurpose(purpose, callback)
```

### offPurpose
Stop listening for a specified event purpose.
```javascript
api.offPurpose(purpose, callback)
```

### send
Send JSON data to a client.
```javascript
api.send(ws, json)
```

### raw
Send raw buffer/string data to a client.
```javascript
api.raw(ws, raw)
```

# Properties
### wss
The server object itself.

### options
The options for the package.

### afterEvents
All of the available event signals that you can subscribe to.

# Internal Event Names
These are all of the events that are wrapped and renamed in the `afterEvents` object.
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
subscribe
unsubscribe
event
error
commandRequest
commandResponse
data:block
data:item
data:mob
ws:encrypt
ws:encryptionRequest
ws:encryptionResponse
```