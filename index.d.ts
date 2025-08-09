declare module 'mcwss-api' {
    import type { WebSocketServer, WebSocket } from "ws";
    // types
    type EventType = 
        | 'PlayerMessage'
        | 'PlayerTravelled'
        | 'PlayerTransform'
        | 'PlayerTeleported'
        | 'PlayerDied'
        | 'PlayerBounced'
        | 'EntitySpawned'
        | 'ItemUsed'
        | 'ItemInteracted'
        | 'ItemEquipped'
        | 'ItemAcquired'
        | 'ItemDropped'
        | 'ItemSmelted'
        | 'ItemCrafted'
        | 'BlockPlaced'
        | 'BlockBroken'
        | 'MobKilled'
        | 'MobInteracted'
        | 'TargetBlockHit'
    type MessagePurpose =
        | 'subscribe'
        | 'unsubscribe'
        | 'event'
        | 'error'
        | 'networkRequest'
        | 'commandRequest'
        | 'commandResponse'
        | 'data:block'
        | 'data:item'
        | 'data:mob'
        | 'data:file'
        | 'data:telemetry'
        | 'data:tutorial'
        | 'action:agent'
        | 'chat:subscribe'
        | 'chat:unsubscribe'
        | 'ws:encrypt'
        | 'ws:encryptionRequest'
        | 'ws:encryptionResponse'
    type CommandVersion =
        | -1
        | 1
        | 2
        | 3
        | 4
        | 5
        | 6
        | 7
        | 8
        | 9
        | 10
        | 11
        | 12
        | 13
        | 14
        | 15
        | 16
        | 17
        | 18
        | 19
        | 20
        | 21
        | 22
        | 23
        | 24
        | 25
        | 26
        | 27
        | 28
        | 29
        | 30
        | 31
        | 32
        | 33
        | 34
        | 35
        | 36
        | 37
        | 38
        | 39
        | 40
        | 41
        | 42


    // interfaces
    /** An item enchantment. */
    interface Enchantment {
        level: number
        name: string
        type: number
    }
    /** An in-game block. */
    interface Block {
        aux: number
        id: string
        namespace: string
    }
    /** An in-game item. */
    interface Item {
        aux: number
        id: string
        namespace: string
    }
    /** A 3D vector used to get where things are in the world. */
    interface Vector3 {
        x: number
        y: number
        z: number
    }
    /** An in-game item, with alot more information. */
    interface ItemAdvanced {
        aux: number
        enchantments: Enchantment[]
        freeStackSize: number
        id: string
        maxStackSize: number
        namespace: string
        stackSize: 1
    }
    /** An in-game entity, with almost no information. */
    interface EntitySingle {
        type: number
    }
    /** An in-game entity. */
    interface Entity {
        color: number
        id?: number
        type: number
        variant: number
    }
    /** An in-game entity with alot more information. */
    interface EntityAdvanced {
        color: number
        dimension: number
        id: number
        position: Vector3
        type: number
        variant: number
        yRot: number
    }
    /** A player, usually the person who triggered an event. */
    interface Player {
        color: string
        dimension: number
        id: number
        name: string
        position: Vector3
        type: string
        variant: number
        yRot: number
    }
    interface ChatSendAfterEvent {
        message: string
        receiver: string
        sender: string
        type: string
    }
    interface PlayerMoveAfterEvent {
        isUnderwater: boolean
        metersTravelled: number
        newBiome: number
        player: Player
        vehicle?: Entity
        travelMethod: TravelMethod
    }
    interface PlayerTransformAfterEvent {
        player: Player
    }
    interface PlayerTeleportAfterEvent {
        cause: TeleportMethod,
        itemType: number
        metersTravelled: number
        player: Player
    }
    interface PlayerDieAfterEvent {
        cause: EntityDamageCause
        inRaid: boolean
        killer: Entity
        player: Player
    }
    interface PlayerBounceAfterEvent {
        block: Block
        bounceHeight: number
        player: Player
    }
    interface EntitySpawnAfterEvent {
        mob: EntitySingle
        player?: Player
        spawnType: SpawnMethod
    }
    interface ItemCompleteUseAfterEvent {
        count: number
        item: Item
        player: Player
        useMethod: ItemCompleteUseMethod
    }
    interface ItemUseAfterEvent {
        count: number
        item: ItemAdvanced
        method: ItemUseMethod
        player: Player
        slot: number
    }
    interface PlayerEquipItemAfterEvent {
        item: ItemAdvanced
        player: Player
        slot: number
    }
    interface PlayerAcquireItemAfterEvent {
        acquisitionMethodId: ItemAcquisitionMethod
        count: number
        item: Item
        player: Player
    }
    interface PlayerDropItemAfterEvent {
        count: number
        item: Item
        player: Player
    }
    interface PlayerAcquireSmeltedItemAfterEvent {
        fuelSource: Item
        item: ItemAdvanced
        player: Player
    }
    interface PlayerCraftItemAfterEvent {
        count: number
        craftedAutomatically: boolean
        endingTabId: number
        hasCraftableFilterOn: boolean
        item: ItemAdvanced
        numberOfTabsChanged: number
        player: Player
        recipeBookShown: boolean
        startingTabId: number
        usedCraftingTable: boolean
        usedSearchBar: boolean
    }
    interface PlayerPlaceBlockAfterEvent {
        block: Block
        count: number
        placedUnderWater: boolean
        placementMethod: BlockPlacementMethod
        player: Player
        tool: ItemAdvanced
    }
    interface PlayerBreakBlockAfterEvent {
        block: Block
        count: number
        destructionMethod: BlockDestructionMethod
        player: Player
        tool: ItemAdvanced
        variant: number
    }
    interface PlayerKillEntityAfterEvent {
        armorBody: ItemAdvanced
        armorFeet: ItemAdvanced
        armorHead: ItemAdvanced
        armorLegs: ItemAdvanced
        armorTorso: ItemAdvanced
        isMonster: boolean
        killMethodType: EntityDamageCause
        player: Player
        playerIsHiddenFrom: boolean
        victim: EntityAdvanced
        weapon: ItemAdvanced
    }
    interface PlayerInteractWithEntityAfterEvent {
        interactionType: number
        mob: Entity
        player: Player
    }
    interface TargetBlockHitAfterEvent {
        player: Player
        redstoneLevel: number
    }
    interface BlockType {
        aux: number,
        id: string,
        name: string
    }
    interface ItemType {
        aux: number,
        id: string,
        name: string
    }
    interface EntityType {
        id: string,
        name: string
    }
    interface APIOptions {
        /** 
            * Whether to log command syntax errors or not.
            * - Default is `true`.
        */
        log_command_errors: boolean
        /** 
            * Whether to log command responses or not.
            * - Default is `false`.
        */
        log_command_output: boolean
        /** 
            * Whether to log message error reponses or not.
            * - Default is `false`.
        */
        log_message_errors: boolean
        /** 
            * Whether to log command internal errors with the package or not.
            * - Default is `true`.
        */
        log_internal_errors: boolean
        /** 
            * The `version` of the commands to send.
            * - Default is `1`, highest is `42`.
        */
        command_version: CommandVersion
    }
    // enums
    enum TravelMethod {
        Walk = 0,
        Water = 1,
        Aerial = 2,
        Climb = 3,
        Lava = 4,
        Fly = 5,
        Ride = 6,
        Sneak = 7,
        Sprint = 8,
        Bounce = 9,
        FrostedIce = 10,
        Teleport = 11,
    }
    enum TeleportMethod {
        EndGateway = 0,
        Projectile = 1,
        ChorusFruit = 2,
        Command = 3,
        Behavior = 4
    }
    enum SpawnMethod {
        SpawnEgg = 1,
        Command = 2,
        MobSpawner = 4
    }
    enum ItemCompleteUseMethod {
        Eat = 1,
        Drink = 3,
        Throw = 4,
        Shoot = 5,
        Place = 6,
        OnBlock = 9,
        Cast = 10
    }
    enum ItemUseMethod {
        Use = 0,
        Place = 1
    }
    enum ItemAcquisitionMethod {
        Pickup = 1,
        Craft = 2,
        Chest = 3,
        Anvil = 6,
        Smelt = 7,
        Brew = 8,
        BucketFill = 9,
        Trade = 10,
        Fish = 11
    }
    enum BlockPlacementMethod {
        Place = 0
    }
    enum BlockDestructionMethod {
        Break = 0
    }
    enum EntityDamageCause {
        none = -1,
        override = 0,
        contact = 1,
        entityAttack = 2,
        projectile = 3,
        suffocation = 4,
        fall = 5,
        fire = 6,
        fireTick = 7,
        drowning = 9,
        blockExplosion = 10,
        entityExplosion = 11,
        void = 12,
        selfDestruct = 13,
        magic = 14,
        wither = 15,
        starve = 16,
        anvil = 17,
        thorns = 18,
        fallingBlock = 19,
        piston = 20,
        flyIntoWall = 21,
        magma = 22,
        fireworks = 23,
        lightning = 24,
        charging = 25,
        temperature = 26,
        stalactite = 28,
        stalagmite = 29,
        ramAttack = 30,
        sonicBoom = 31,
        campfire = 32,
        soulCampfire = 33,
        maceSmash = 34
    }
    // classes
    class APIInstance {
        BlockTypes: {
            /** 
                * Get all available block types for all clients connected to the WSS.
            */
            getAll(): Promise<BlockType[] | BlockType[][]>;
            /** 
                * Get all available block types for one client connected to the WSS.
            */
            getAllForOne(ws: WebSocket): Promise<BlockType[]>;
        }
        ItemTypes: {
            /** 
                * Get all available item types for all clients connected to the WSS.
            */
            getAll(): Promise<ItemType[] | ItemType[][]>;
            /** 
                * Get all available item types for one client connected to the WSS.
            */
            getAllForOne(ws: WebSocket): Promise<ItemType[]>;
        }
        EntityTypes: {
            /** 
                * Get all available entity types for all clients connected to the WSS.
             */
            getAll(): Promise<EntityType[] | EntityType[][]>;
            /** 
                * Get all available entity types for one client connected to the WSS.
            */
            getAllForOne(ws: WebSocket): Promise<EntityType[]>;
        }
        /** The WebSocket server, if initialized. */
        wss: WebSocketServer | undefined
        /** The options for the API. */
        options: APIOptions;
        afterEvents: {
            chatSend: ChatSendAfterEventSignal,
            playerMove: PlayerMoveAfterEventSignal,
            playerTransform: PlayerTransformAfterEventSignal,
            playerTeleport: PlayerTeleportAfterEventSignal,
            playerDie: PlayerDieAfterEventSignal,
            playerBounce: PlayerBounceAfterEventSignal,
            entitySpawn: EntitySpawnAfterEventSignal,
            itemCompleteUse: ItemCompleteUseAfterEventSignal,
            ItemUse: ItemUseAfterEventSignal,
            playerEquipItem: PlayerEquipItemAfterEventSignal,
            playerAcquireItem: PlayerAcquireItemAfterEventSignal,
            playerDropItem: PlayerDropItemAfterEventSignal,
            playerAcquireSmeltedItem: PlayerAcquireSmeltedItemAfterEventSignal,
            playerCraftItem: PlayerCraftItemAfterEventSignal,
            playerPlaceBlock: PlayerPlaceBlockAfterEventSignal,
            playerBreakBlock: PlayerBreakBlockAfterEventSignal,
            playerKillEntity: PlayerKillEntityAfterEventSignal,
            playerInteractWithEntity: PlayerInteractWithEntityAfterEventSignal,
            targetBlockHit: TargetBlockHitAfterEventSignal
        }
        /** Start the WebSocket server. */
        start(port: number, host: string, options: APIOptions): void
        /** Stop the WebSocket server. */
        stop(): void
        /** Subscribe to an custom event type for all clients, to listen for for any event that isn't in the Events section. */
        subscribeCustom(eventType: string | EventType, cb: (msg: object, raw: string | ArrayBufferLike) => void): void
        /** Unsubscribe to an custom event type for all clients, to stop listening for any event that isn't in the Events section. */
        unsubscribeCustom(eventType: string | EventType, cb: (msg: object, raw: string | ArrayBufferLike) => void): void
        /** Subscribe to an custom event type for one client, to listen for for any event that isn't in the Events section. */
        subscribeCustomForOne(ws: WebSocket, eventType: string | EventType, cb: (msg: object, raw: string | ArrayBufferLike) => void): void
        /** Unsubscribe to an custom event type for one client, to stop listening for any event that isn't in the Events section. */
        unsubscribeCustomForOne(ws: WebSocket, eventType: string | EventType, cb: (msg: object, raw: string | ArrayBufferLike) => void): void
        /** Listen for a specified event purpose on all clients' ends. */
        onPurpose(purpose: MessagePurpose, cb: (msg: object, raw: string | ArrayBufferLike) => void): (raw: string | ArrayBufferLike) => void
        /** Stop listening for a specified event purpose on all clients' ends. */
        offPurpose(cb: (raw: string | ArrayBufferLike) => void): void
        /** Listen for a specified event purpose on a single client's end. */
        onPurposeForOne(ws: WebSocket, purpose: MessagePurpose, cb: (msg: object, raw: string | ArrayBufferLike) => void): (raw: string | ArrayBufferLike) => void
        /** Stop listening for a specified event purpose a single client's end. */
        offPurposeForOne(ws: WebSocket, cb: (raw: string | ArrayBufferLike) => void): void
        /** 
            * Execute an in-game command for all clients connected to the WSS.
            * - `command` is normally a string, but you can also pass arrays into it, executing multiple commands at once.
            * - Note that the position at which commands are run from, is the position of the client that's connected to the WSS.
        */
        runCommand(command: string | string[]): string | string[];
        /** 
            * Execute an in-game command for all clients connected to the WSS, and wait for a response.  
            * - `command` is normally a string, but you can also pass arrays into it, executing multiple commands at once.
            * - Note that the position at which commands are run from, is the position of the client that's connected to the WSS.
        */
        runCommandAsync(command: string | string[]): Promise<object[]>;
        /** 
            * Execute an in-game command for one client connected to the WSS.
            * - `command` is normally a string, but you can also pass arrays into it, executing multiple commands at once.
            * - Note that the position at which commands are run from, is the position of the client that's connected to the WSS.
        */
        runCommandForOne(ws: WebSocket, command: string | string[]): string | string[];
        /** 
            * Execute an in-game command for one client connected to the WSS, and wait for a response.  
            * - `command` is normally a string, but you can also pass arrays into it, executing multiple commands at once.
            * - Note that the position at which commands are run from, is the position of the client that's connected to the WSS.
        */
        runCommandAsyncForOne(ws: WebSocket, command: string | string[]): Promise<object | object[]>;
        /** Send JSON data to all clients. */
        send(json: object): void
        /** Send raw string/buffer data to all clients. */
        raw(raw: string | ArrayBufferLike): void
        /** Send JSON data to one client. */
        sendForOne(ws: WebSocket, json: object): void
        /** Send raw string/buffer data to one client. */
        rawForOne(ws: WebSocket, raw: string | ArrayBufferLike): void
    }
    class ChatSendAfterEventSignal extends AfterEventSignal {
        subscribe(callback: (msg: ChatSendAfterEvent) => void): void
        unsubscribe(callback: (msg: ChatSendAfterEvent) => void): void
    }
    class PlayerMoveAfterEventSignal extends AfterEventSignal {
        subscribe(callback: (msg: PlayerMoveAfterEvent) => void): void
        unsubscribe(callback: (msg: PlayerMoveAfterEvent) => void): void
    }
    class PlayerTransformAfterEventSignal extends AfterEventSignal {
        subscribe(callback: (msg: PlayerTransformAfterEvent) => void): void
        unsubscribe(callback: (msg: PlayerTransformAfterEvent) => void): void
    }
    class PlayerTeleportAfterEventSignal extends AfterEventSignal {
        subscribe(callback: (msg: PlayerTeleportAfterEvent) => void): void
        unsubscribe(callback: (msg: PlayerTeleportAfterEvent) => void): void
    }
    class PlayerDieAfterEventSignal extends AfterEventSignal {
        subscribe(callback: (msg: PlayerDieAfterEvent) => void): void
        unsubscribe(callback: (msg: PlayerDieAfterEvent) => void): void
    }
    class PlayerBounceAfterEventSignal extends AfterEventSignal {
        subscribe(callback: (msg: PlayerBounceAfterEvent) => void): void
        unsubscribe(callback: (msg: PlayerBounceAfterEvent) => void): void
    }
    class EntitySpawnAfterEventSignal extends AfterEventSignal {
        subscribe(callback: (msg: EntitySpawnAfterEvent) => void): void
        unsubscribe(callback: (msg: EntitySpawnAfterEvent) => void): void
    }
    class ItemCompleteUseAfterEventSignal extends AfterEventSignal {
        subscribe(callback: (msg: ItemCompleteUseAfterEvent) => void): void
        unsubscribe(callback: (msg: ItemCompleteUseAfterEvent) => void): void
    }
    class ItemUseAfterEventSignal extends AfterEventSignal {
        subscribe(callback: (msg: ItemUseAfterEvent) => void): void
        unsubscribe(callback: (msg: ItemUseAfterEvent) => void): void
    }
    class PlayerEquipItemAfterEventSignal extends AfterEventSignal {
        subscribe(callback: (msg: PlayerEquipItemAfterEvent) => void): void
        unsubscribe(callback: (msg: PlayerEquipItemAfterEvent) => void): void
    }
    class PlayerAcquireItemAfterEventSignal extends AfterEventSignal {
        subscribe(callback: (msg: PlayerAcquireItemAfterEvent) => void): void
        unsubscribe(callback: (msg: PlayerAcquireItemAfterEvent) => void): void
    }
    class PlayerDropItemAfterEventSignal extends AfterEventSignal {
        subscribe(callback: (msg: PlayerDropItemAfterEvent) => void): void
        unsubscribe(callback: (msg: PlayerDropItemAfterEvent) => void): void
    }
    class PlayerCraftItemAfterEventSignal extends AfterEventSignal {
        subscribe(callback: (msg: PlayerCraftItemAfterEvent) => void): void
        unsubscribe(callback: (msg: PlayerCraftItemAfterEvent) => void): void
    }
    class PlayerAcquireSmeltedItemAfterEventSignal extends AfterEventSignal {
        subscribe(callback: (msg: PlayerAcquireSmeltedItemAfterEvent) => void): void
        unsubscribe(callback: (msg: PlayerAcquireSmeltedItemAfterEvent) => void): void
    }
    class PlayerPlaceBlockAfterEventSignal extends AfterEventSignal {
        subscribe(callback: (msg: PlayerPlaceBlockAfterEvent) => void): void
        unsubscribe(callback: (msg: PlayerPlaceBlockAfterEvent) => void): void
    }
    class PlayerBreakBlockAfterEventSignal extends AfterEventSignal {
        subscribe(callback: (msg: PlayerBreakBlockAfterEvent) => void): void
        unsubscribe(callback: (msg: PlayerBreakBlockAfterEvent) => void): void
    }
    class PlayerKillEntityAfterEventSignal extends AfterEventSignal {
        subscribe(callback: (msg: PlayerKillEntityAfterEvent) => void): void
        unsubscribe(callback: (msg: PlayerKillEntityAfterEvent) => void): void
    }
    class PlayerInteractWithEntityAfterEventSignal extends AfterEventSignal {
        subscribe(callback: (msg: PlayerInteractWithEntityAfterEvent) => void): void
        unsubscribe(callback: (msg: PlayerInteractWithEntityAfterEvent) => void): void
    }
    class TargetBlockHitAfterEventSignal extends AfterEventSignal {
        subscribe(callback: (msg: TargetBlockHitAfterEvent) => void): void
        unsubscribe(callback: (msg: TargetBlockHitAfterEvent) => void): void
    }
    class AfterEventSignal {
        #internalName: EventType
        #callbacks: ((msg: any) => void)[]
        #apiInstance: APIInstance
        #a: (raw: string | ArrayBufferLike, cb: (msg: object, raw: string | ArrayBufferLike) => void, id: string) => void
        constructor(internalName: EventType, apiInstance: APIInstance)
        /** Subscribe to the event signal. */
        subscribe(callback: (msg: any) => void): void
        /** Unsubscribe from the event signal. */
        unsubscribe(callback: (msg: any) => void): void
    }
    export {
        // interfaces & stuff
        EntitySingle,
        Entity,
        EntityAdvanced,
        Item,
        ItemAdvanced,
        Enchantment,
        Block,
        Player,
        EventType,
        MessagePurpose,
        // events
        ChatSendAfterEvent,
        PlayerMoveAfterEvent,
        PlayerTransformAfterEvent,
        PlayerTeleportAfterEvent,
        PlayerDieAfterEvent,
        PlayerBounceAfterEvent,
        EntitySpawnAfterEvent,
        ItemCompleteUseAfterEvent,
        ItemUseAfterEvent,
        PlayerEquipItemAfterEvent,
        PlayerAcquireItemAfterEvent,
        PlayerDropItemAfterEvent,
        PlayerCraftItemAfterEvent,
        PlayerAcquireSmeltedItemAfterEvent,
        PlayerPlaceBlockAfterEvent,
        PlayerBreakBlockAfterEvent,
        PlayerKillEntityAfterEvent,
        PlayerInteractWithEntityAfterEvent,
        TargetBlockHitAfterEvent,
        // event signals
        AfterEventSignal,
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
        // classes
        APIOptions,
        APIInstance,
        Vector3
    }
}