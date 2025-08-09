# mcwss-api
Im making a wrapper for the Minecraft WSS API, an undocumented API that lets you communicate with Minecraft Bedrock Edition through WebSockets.  
Found a bug? [Let me know](https://github.com/Hyperflame1296/mcwss-api/issues)!

### Contributors
[TensiveYT](https://youtube.com/@Hyperflamee8) (author)

### Credits
jocopa3 (for the initial event list)

### Notes
- if i find anything new, i'll add it to this package ig

### Installation
Simply run this in your command line:
```batch
npm i mcwss-api@latest
```

# Example
```javascript
let { APIInstance } = require('mcwss-api')

let api = new APIInstance();
api.start(3000, '127.0.0.1', {
    // logging
    log_command_errors : true , // log command syntax errors into console
    log_command_output : false, // log command outputs into console
    log_message_errors : true , // log json message errors into console
    log_internal_errors: true , // log internal package errors into console
    // game stuff
    command_version: 1 // message request version, default is 1, highest is 42
})
api.wss.on('connection', async ws => {
    api.afterEvents.chatSend.subscribe((msg, raw) => {
        if (msg.type === 'chat') { // to prevent an infinite loop
            console.log(msg) // logs any PlayerMessage event that goes through
            api.runCommand(`say ${msg.message}`) // send the message back with /say!
        }
    })
});
```

# Methods

### BlockTypes.getAll
Get all available block types for all clients connected to the WebSocket server.
```javascript
await api.BlockTypes.getAll()
```

### BlockTypes.getAllForOne
Get all available block types for one client connected to the WebSocket server.
```javascript
await api.BlockTypes.getAllForOne()
```

### ItemTypes.getAll
Get all available item types for all clients connected to the WebSocket server.
```javascript
await api.ItemTypes.getAll()
```

### ItemTypes.getAllForOne
Get all available block types for one client connected to the WebSocket server.
```javascript
await api.ItemTypes.getAllForOne()
```

### EntityTypes.getAll
Get all available entity types for all clients connected to the WebSocket server.
```javascript
await api.EntityTypes.getAll()
```

### EntityTypes.getAllForOne
Get all available block types for one client connected to the WebSocket server.
```javascript
await api.EntityTypes.getAllForOne()
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

### send
Send JSON data to all clients.
```javascript
api.send(json)
```

### raw
Send raw buffer/string data to a client.
```javascript
api.raw(raw)
```

### sendForOne
Send JSON data to one client.
```javascript
api.sendForOne(ws, json)
```

### rawForOne
Send raw buffer/string data to one client.
```javascript
api.rawForOne(ws, raw)
```

### subscribeCustom
Subscribe to an custom event type for all clients, to listen for events that aren't in the Events section.
```javascript
api.subscribeCustom(event_type, cb)
```

### unsubscribeCustom
Unsubscribe to an custom event type for all clients, to stop listening for events that aren't in the Events section.
```javascript
api.unsubscribeCustom(event_type, cb)
```

### subscribeCustomForOne
Subscribe to an custom event type for one client, to listen for events that aren't in the Events section.
```javascript
api.subscribeCustomForOne(ws, event_type, cb)
```

### unsubscribeCustomForOne
Unsubscribe to an custom event type for one client, to stop listening for events that aren't in the Events section.
```javascript
api.unsubscribeCustomForOne(ws, event_type, cb)
```

### onPurpose
Listen for a specified event purpose on all clients' ends.
```javascript
api.onPurpose(purpose, callback)
```

### offPurpose
Stop listening for a specified event purpose on all clients' ends.
```javascript
api.offPurpose(purpose, callback)
```

### onPurposeForOne
Listen for a specified event purpose on a single client's end.
```javascript
api.onPurposeForOne(ws, purpose, callback)
```

### offPurposeForOne
Stop listening for a specified event purpose on a single client's end.
```javascript
api.offPurposeForOne(ws, purpose, callback)
```

### runCommand
Execute an in-game command for all clients connected to the WebSocket server.
- `command` is normally a string, but you can also pass arrays into it, executing multiple commands at once.
- Note that the position at which commands are run from, is the player position of the client that's connected to the WebSocket server.
```javascript
api.runCommand(command)
```

### runCommandAsync
Execute an in-game command for all clients connected to the WebSocket server, and wait for a response.  
- `command` is normally a string, but you can also pass arrays into it, executing multiple commands at once.
- Note that the position at which commands are run from, is the player position of the client that's connected to the WebSocket server.
```javascript
await api.runCommandAsync(command)
```

### runCommandForOne
Execute an in-game command for one client connected to the WebSocket server.
- `command` is normally a string, but you can also pass arrays into it, executing multiple commands at once.
- Note that the position at which commands are run from, is the player position of the client that's connected to the WebSocket server.
```javascript
api.runCommandForOne(ws, command)
```

### runCommandAsyncForOne
Execute an in-game command for one client connected to the WebSocket server, and wait for a response.  
- `command` is normally a string, but you can also pass arrays into it, executing multiple commands at once.
- Note that the position at which commands are run from, is the player position of the client that's connected to the WebSocket server.
```javascript
await api.runCommandAsyncForOne(ws, command)
```

# Properties
### wss
The server object itself.

### options
The options for the package.

### afterEvents
All of the available event signals that you can subscribe to.

# After Events
These are all of the events that I could find.
Name on the left is what it's wrapped into, name on the right is the internal name.

### chatSend *(PlayerMessage)*
Fires every time a message gets sent in general. Not just players.
- As long as you're the host, this works for all players in the multiplayer game that you're hosting. Otherwise, it only works for all clients connected to the WebSocket server.

### playerMove *(PlayerTravelled)*
Fires whenever a player moves around.
- This only works for all clients connected to the WebSocket server.

### playerTransform *(PlayerTransform)*
This is the same thing as `playerMove`, except with no information about how & where the player moved.
- This only works for all clients connected to the WebSocket server.

### playerTeleport *(PlayerTeleported)*
Fires whenever the player in any way. (via `/tp` or the like)
- This only works for all clients connected to the WebSocket server.

### playerDie *(PlayerDied)*
Fires whenever the player dies.
- This only works for all clients connected to the WebSocket server.

### playerBounce *(PlayerBounced)*
Fires whenever the player bounces on a slime block, bed, or any other bounceable block.
- This only works for all clients connected to the WebSocket server.

### entitySpawn *(EntitySpawned)*
Fires whenever a player spawns something, via spawn egg or command.
- This only works for all clients connected to the WebSocket server.

### itemCompleteUse *(ItemUsed)*
Fires whenever a player finish using an item.
- If the item being used shoots a projectile, the `item` property will instead be the ammo used to shoot the projectile.
- This only works for all clients connected to the WebSocket server.

### itemUse *(ItemInteracted)*
Fires whenever either right-click with an item, place it's block, or begin/finish using that item.
- This only works for all clients connected to the WebSocket server.

### playerEquipItem *(ItemEquipped)*
Fires whenever you equip an item.
- Unless the item is a Shield, putting the item into the equip slot through the inventory will not work. You have to right-click with the equippable item.
- This only works for all clients connected to the WebSocket server.

### playerAcquireItem *(ItemAcquired)*
Fires whenever a player picks up an item.
- This only works for all clients connected to the WebSocket server.

### playerDropItem *(ItemDropped)*
Fires whenever a player drops an item.
- This only works for all clients connected to the WebSocket server.

### playerAcquireSmeltedItem *(ItemSmelted)*
Fires whenever a player grabs a cooked item out of a furnace.
- This only works for all clients connected to the WebSocket server.

### playerCraftItem *(ItemCrafted)*
Fires whenever a player crafts something.
- This only works for all clients connected to the WebSocket server.

### playerPlaceBlock *(BlockPlaced)*
Fires whenever a player places a block.
- This only works for all clients connected to the WebSocket server.

### playerBreakBlock *(BlockBroken)*
Fires whenever a player breaks a block.
- This only works for all clients connected to the WebSocket server.

### playerKillEntity *(MobKilled)*
Fires whenever a player kills an entity.
- This only works for all clients connected to the WebSocket server.

### playerInteractWithEntity *(MobInteracted)*
Fires whenever a player interacts with an entity, or when a player cause entities to interact with eachother.
- This only works for all clients connected to the WebSocket server.

### targetBlockHit *(TargetBlockHit)*
Fires whenever a player activates a target block.
- This only works for all clients connected to the WebSocket server.

# Purposes
These are all of the values that `messagePurpose` can have (or at least all of the ones that i've found).

```plaintext
subscribe
unsubscribe
event
error
networkRequest
commandRequest
commandResponse
data:block
data:item
data:mob
data:file
data:telemetry
data:tutorial
action:agent
chat:subscribe
chat:unsubscribe
ws:encrypt
ws:encryptionRequest
ws:encryptionResponse
```