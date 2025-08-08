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
        | 'dataType'
        | 'ws:encrypt'
        | 'ws:encryptionRequest'
        | 'ws:encryptionResponse'

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
    interface Player extends EntityAdvanced {
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
        travelMethod: number
    }
    interface PlayerTransformAfterEvent {
        player: Player
    }
    interface PlayerTeleportAfterEvent {
        cause: number,
        itemType: number
        metersTravelled: number
        player: Player
    }
    interface PlayerDieAfterEvent {
        cause: number
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
        player: Player
        spawnType: number
    }
    interface ItemCompleteUseAfterEvent {
        count: number
        item: Item
        player: Player
        useMethod: number
    }
    interface ItemUseAfterEvent {
        count: number
        item: ItemAdvanced
        method: number
        player: Player
        slot: number
    }
    interface PlayerEquipItemAfterEvent {
        item: ItemAdvanced
        player: Player
        slot: number
    }
    interface PlayerAcquireItemAfterEvent {
        acquisitionMethodId: number
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
        placementMethod: number
        player: Player
        tool: ItemAdvanced
    }
    interface PlayerBreakBlockAfterEvent {
        block: Block
        count: number
        destructionMethod: number
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
        killMethodType: number
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
        command_version: number
    }
    // classes
    class APIInstance {
        BlockTypes: {
            /** 
                * Get all available block types for all clients connected to the WSS.
            */
            public async getAll(): Promise<BlockType[] | BlockType[][]>;
            /** 
                * Get all available block types for a specific client connected to the WSS.
            */
            public async getAllForOneClient(ws: WebSocket): Promise<BlockType[]>;
        }
        ItemTypes: {
            /** 
                * Get all available item types for all clients connected to the WSS.
            */
            public async getAll(): Promise<ItemType[] | ItemType[][]>;
            /** 
                * Get all available item types for a specific client connected to the WSS.
            */
            public async getAllForOneClient(ws: WebSocket): Promise<ItemType[]>;
        }
        EntityTypes: {
            /** 
                * Get all available entity types for all clients connected to the WSS.
             */
            public async getAll(): Promise<EntityType[] | EntityType[][]>;
            /** 
                * Get all available entity types for a specific client connected to the WSS.
            */
            public async getAllForOneClient(ws: WebSocket): Promise<EntityType[]>;
        }
        /** The WebSocket server, if initialized. */
        public wss: WebSocketServer | undefined
        /** The options for the API. */
        public options: APIOptions;
        public afterEvents = {
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
            playerInteractWithEntity: PlayerInteractWithEntityAfterEventSignal
        }
        /** Start the WebSocket server. */
        public start(port: number, host: string, options: APIOptions): void
        /** Stop the WebSocket server. */
        public stop(): void
        /** Subscribe to an custom event type, to listen for for any event that isn't in the Events section. */
        public subscribeCustom(ws: WebSocket, eventType: EventType): void
        /** Unsubscribe to an custom event type, to stop listening for any event that isn't in the Events section. */
        public unsubscribeCustom(ws: WebSocket, eventType: EventType): void
        /** Listen for a specified event purpose. */
        public onPurpose(ws: WebSocket, purpose: MessagePurpose, cb: (msg: object) => void): Function
        /** Stop listening for a specified event purpose. */
        public offPurpose(ws: WebSocket, cb: (msg: object) => void): void
        /** 
            * Execute an in-game command for all clients connected to the WSS.
            * - `command` is normally a string, but you can also pass arrays into it, executing multiple commands at once.
            * - Note that the position at which commands are run from, is the position of the client that's connected to the WSS.
        */
        public runCommand(command: string | string[]): string | string[];
        /** 
            * Execute an in-game command for all clients connected to the WSS, and wait for a response.  
            * - `command` is normally a string, but you can also pass arrays into it, executing multiple commands at once.
            * - Note that the position at which commands are run from, is the position of the client that's connected to the WSS.
        */
        public async runCommandAsync(command: string | string[]): Promise<object[]>;
        /** 
            * Execute an in-game command for a specific client connected to the WSS.
            * - `command` is normally a string, but you can also pass arrays into it, executing multiple commands at once.
            * - Note that the position at which commands are run from, is the position of the client that's connected to the WSS.
        */
        public runCommandForOneClient(ws: WebSocket, command: string | string[]): string | string[];
        /** 
            * Execute an in-game command for a specific client connected to the WSS, and wait for a response.  
            * - `command` is normally a string, but you can also pass arrays into it, executing multiple commands at once.
            * - Note that the position at which commands are run from, is the position of the client that's connected to the WSS.
        */
        public async runCommandAsyncForOneClient(ws: WebSocket, command: string | string[]): Promise<object | object[]>;
        /** Send JSON data to a client. */
        public send(ws: WebSocket, json: object): void
        /** Send raw string/buffer data to a client. */
        public raw(ws: WebSocket, raw: string | ArrayBufferLike): void
    }
    class ChatSendAfterEventSignal extends AfterEventSignal {
        public subscribe(callback: (msg: ChatSendAfterEvent) => void): void
        public unsubscribe(callback: (msg: ChatSendAfterEvent) => void): void
    }
    class PlayerMoveAfterEventSignal extends AfterEventSignal {
        public subscribe(callback: (msg: PlayerMoveAfterEvent) => void): void
        public unsubscribe(callback: (msg: PlayerMoveAfterEvent) => void): void
    }
    class PlayerTransformAfterEventSignal extends AfterEventSignal {
        public subscribe(callback: (msg: PlayerTransformAfterEvent) => void): void
        public unsubscribe(callback: (msg: PlayerTransformAfterEvent) => void): void
    }
    class PlayerTeleportAfterEventSignal extends AfterEventSignal {
        public subscribe(callback: (msg: PlayerTeleportAfterEvent) => void): void
        public unsubscribe(callback: (msg: PlayerTeleportAfterEvent) => void): void
    }
    class PlayerDieAfterEventSignal extends AfterEventSignal {
        public subscribe(callback: (msg: PlayerDieAfterEvent) => void): void
        public unsubscribe(callback: (msg: PlayerDieAfterEvent) => void): void
    }
    class PlayerBounceAfterEventSignal extends AfterEventSignal {
        public subscribe(callback: (msg: PlayerBounceAfterEvent) => void): void
        public unsubscribe(callback: (msg: PlayerBounceAfterEvent) => void): void
    }
    class EntitySpawnAfterEventSignal extends AfterEventSignal {
        public subscribe(callback: (msg: EntitySpawnAfterEvent) => void): void
        public unsubscribe(callback: (msg: EntitySpawnAfterEvent) => void): void
    }
    class ItemCompleteUseAfterEventSignal extends AfterEventSignal {
        public subscribe(callback: (msg: ItemCompleteUseAfterEvent) => void): void
        public unsubscribe(callback: (msg: ItemCompleteUseAfterEvent) => void): void
    }
    class ItemUseAfterEventSignal extends AfterEventSignal {
        public subscribe(callback: (msg: ItemUseAfterEvent) => void): void
        public unsubscribe(callback: (msg: ItemUseAfterEvent) => void): void
    }
    class PlayerEquipItemAfterEventSignal extends AfterEventSignal {
        public subscribe(callback: (msg: PlayerEquipItemAfterEvent) => void): void
        public unsubscribe(callback: (msg: PlayerEquipItemAfterEvent) => void): void
    }
    class PlayerAcquireItemAfterEventSignal extends AfterEventSignal {
        public subscribe(callback: (msg: PlayerAcquireItemAfterEvent) => void): void
        public unsubscribe(callback: (msg: PlayerAcquireItemAfterEvent) => void): void
    }
    class PlayerDropItemAfterEventSignal extends AfterEventSignal {
        public subscribe(callback: (msg: PlayerDropItemAfterEvent) => void): void
        public unsubscribe(callback: (msg: PlayerDropItemAfterEvent) => void): void
    }
    class PlayerCraftItemAfterEventSignal extends AfterEventSignal {
        public subscribe(callback: (msg: PlayerCraftItemAfterEvent) => void): void
        public unsubscribe(callback: (msg: PlayerCraftItemAfterEvent) => void): void
    }
    class PlayerAcquireSmeltedItemAfterEventSignal extends AfterEventSignal {
        public subscribe(callback: (msg: PlayerAcquireSmeltedItemAfterEvent) => void): void
        public unsubscribe(callback: (msg: PlayerAcquireSmeltedItemAfterEvent) => void): void
    }
    class PlayerPlaceBlockAfterEventSignal extends AfterEventSignal {
        public subscribe(callback: (msg: PlayerPlaceBlockAfterEvent) => void): void
        public unsubscribe(callback: (msg: PlayerPlaceBlockAfterEvent) => void): void
    }
    class PlayerBreakBlockAfterEventSignal extends AfterEventSignal {
        public subscribe(callback: (msg: PlayerBreakBlockAfterEvent) => void): void
        public unsubscribe(callback: (msg: PlayerBreakBlockAfterEvent) => void): void
    }
    class PlayerKillEntityAfterEventSignal extends AfterEventSignal {
        public subscribe(callback: (msg: PlayerKillEntityAfterEvent) => void): void
        public unsubscribe(callback: (msg: PlayerKillEntityAfterEvent) => void): void
    }
    class PlayerInteractWithEntityAfterEventSignal extends AfterEventSignal {
        public subscribe(callback: (msg: PlayerInteractWithEntityAfterEvent) => void): void
        public unsubscribe(callback: (msg: PlayerInteractWithEntityAfterEvent) => void): void
    }
    class TargetBlockHitAfterEventSignal extends AfterEventSignal {
        public subscribe(callback: (msg: TargetBlockHitAfterEvent) => void): void
        public unsubscribe(callback: (msg: TargetBlockHitAfterEvent) => void): void
    }
    class AfterEventSignal {
        private #internalName: EventType
        private #callbacks: ((msg: any) => void)[]
        private #apiInstance: APIInstance
        constructor(internalName=EventType, apiInstance=APIInstance)
        /** Subscribe to the event signal. */
        public subscribe(callback: (msg: any) => void): void
        /** Unsubscribe from the event signal. */
        public unsubscribe(callback: (msg: any) => void): void
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
        // classes
        APIOptions,
        APIInstance,
        Vector3
    }
}