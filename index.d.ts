
declare module 'mcwss-api' {
    import type { WebSocketServer, WebSocket } from "ws";
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
        | 'commandRequest'
        | 'commandResponse'
        | 'event'
        | 'error'
        | 'subscribe'
        | 'unsubscribe'

    interface EventMap {
        'PlayerMessage': PlayerMessageEvent
        'PlayerTravelled': PlayerTravelledEvent
        'PlayerTransform': PlayerTransformEvent
        'PlayerTeleported': PlayerTeleportedEvent
        'PlayerDied': PlayerDiedEvent
        'PlayerBounced': PlayerBouncedEvent
        'EntitySpawned': EntitySpawnedEvent
        'ItemUsed': ItemUsedEvent
        'ItemInteracted': ItemInteractedEvent
        'ItemEquipped': ItemEquippedEvent
        'ItemAcquired': ItemAcquiredEvent
        'ItemDropped': ItemDroppedEvent
        'ItemSmelted': ItemSmeltedEvent
        'ItemCrafted': ItemCraftedEvent
        'BlockPlaced': BlockPlacedEvent
        'BlockBroken': BlockBrokenEvent
        'MobKilled': MobKilledEvent
        'MobInteracted': MobInteractedEvent
    }
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
    /** An in-game event. */
    interface Event {
        body: object
        header: object
    }
    interface PlayerMessageEvent extends Event {
        body: {
            message: string
            receiver: string
            sender: string
            type: string
        }
        header: {
            eventName: 'PlayerMessage'
            messagePurpose: 'event'
            version: number
        }
    }
    interface PlayerTravelledEvent extends Event {
        body: {
            isUnderwater: boolean
            metersTravelled: number
            newBiome: number
            player: Player
            travelMethod: number
        }
        header: {
            eventName: 'PlayerTravelled'
            messagePurpose: 'event'
            version: number
        }
    }
    interface PlayerTransformEvent extends Event {
        body: {
            player: Player
        }
        header: {
            eventName: 'PlayerTransform'
            messagePurpose: 'event'
            version: number
        }
    }
    interface PlayerTeleportedEvent extends Event {
        body: {
            cause: number,
            itemType: number
            metersTravelled: number
            player: Player
        }
        header: {
            eventName: 'PlayerTeleported'
            messagePurpose: 'event'
            version: number
        }
    }
    interface PlayerDiedEvent extends Event {
        body: {
            cause: number
            inRaid: boolean
            killer: Entity
            player: Player
        }
        header: {
            eventName: 'PlayerDied'
            messagePurpose: 'event'
            version: number
        }
    }
    interface PlayerBouncedEvent extends Event {
        body: {
            block: Block
            bounceHeight: number
            player: Player
        }
        header: {
            eventName: 'PlayerBounced'
            messagePurpose: 'event'
            version: number
        }
    }
    interface EntitySpawnedEvent extends Event {
        body: {
            mob: EntitySingle
            player: Player
            spawnType: number
        }
        header: {
            eventName: 'EntitySpawned'
            messagePurpose: 'event'
            version: number
        }
    }
    interface ItemUsedEvent extends Event {
        body: {
            count: number
            item: Item
            player: Player
            useMethod: number
        }
        header: {
            eventName: 'ItemUsed'
            messagePurpose: 'event'
            version: number
        }
    }
    interface ItemInteractedEvent extends Event {
        body: {
            count: number
            item: ItemAdvanced
            method: number
            player: Player
            slot: number
        }
        header: {
            eventName: 'ItemInteracted'
            messagePurpose: 'event'
            version: number
        }
    }
    interface ItemEquippedEvent extends Event {
        body: {
            item: ItemAdvanced
            player: Player
            slot: number
        }
        header: {
            eventName: 'ItemEquipped'
            messagePurpose: 'event'
            version: number
        }
    }
    interface ItemAcquiredEvent extends Event {
        body: {
            acquisitionMethodId: number
            count: number
            item: Item
            player: Player
        }
        header: {
            eventName: 'ItemAcquired'
            messagePurpose: 'event'
            version: number
        }
    }
    interface ItemDroppedEvent extends Event {
        body: {
            count: number
            item: Item
            player: Player
        }
        header: {
            eventName: 'ItemDropped'
            messagePurpose: 'event'
            version: number
        }
    }
    interface ItemSmeltedEvent extends Event {
        body: {
            fuelSource: Item
            item: ItemAdvanced
            player: Player
        }
        header: {
            eventName: 'ItemSmelted'
            messagePurpose: 'event'
            version: number
        }
    }
    interface ItemCraftedEvent extends Event {
        body: {
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
        header: {
            eventName: 'ItemCrafted'
            messagePurpose: 'event'
            version: number
        }
    }
    interface BlockPlacedEvent extends Event {
        body: {
            block: Block
            count: number
            placedUnderWater: boolean
            placementMethod: number
            player: Player
            tool: ItemAdvanced
        }
        header: {
            eventName: 'BlockPlaced'
            messagePurpose: 'event'
            version: number
        }
    }
    interface BlockBrokenEvent extends Event {
        body: {
            block: Block
            count: number
            destructionMethod: number
            player: Player
            tool: ItemAdvanced
            variant: number
        }
        header: {
            eventName: 'BlockBroken'
            messagePurpose: 'event'
            version: number
        }
    }
    interface MobKilledEvent extends Event {
        body: {
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
        header: {
            eventName: 'MobKilled'
            messagePurpose: 'event'
            version: number
        }
    }
    interface MobInteractedEvent extends Event {
        body: {
            interactionType: number
            mob: Entity
            player: Player
            }
        header: {
            eventName: 'MobInteracted'
            messagePurpose: 'event'
            version: number
        }
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

    class APIInstance {
        /** The WebSocket server, if initialized. */
        wss: WebSocketServer | undefined
        /** The options for the API. */
        options: APIOptions;
        /** Start the WebSocket server. */
        start(port: number, host: string, options: APIOptions): void
        /** Stop the WebSocket server. */
        stop(): void
        /** Subscribe to an event, to listen for it. */
        subscribe(ws: WebSocket, event_type: EventType): void
        /** Unsubscribe to an event, to stop listening for it. */
        unsubscribe(ws: WebSocket, event_type: EventType): void
        /** Listen for a specified event type. */
        on<K extends keyof EventMap>(ws: WebSocket, event_type: K, cb: (msg: EventMap[K]) => void): void
        /** Listen for a specified event purpose. */
        on_purpose(ws: WebSocket, purpose: MessagePurpose, cb: (msg: object) => void): void
        /** Externally run a minecraft command. */
        run_command(ws: WebSocket, command: string | string[]): string | string[]
        /** Send JSON data to a client. */
        send(ws: WebSocket, json: object): void
        /** Send raw string/buffer data to a client. */
        send_raw(ws: WebSocket, raw: string | ArrayBufferLike): void
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
        EventMap,
        MessagePurpose,
        // events
        PlayerMessageEvent,
        PlayerTravelledEvent,
        PlayerTransformEvent,
        PlayerTeleportedEvent,
        PlayerDiedEvent,
        PlayerBouncedEvent,
        EntitySpawnedEvent,
        ItemUsedEvent,
        ItemAcquiredEvent,
        ItemDroppedEvent,
        ItemSmeltedEvent,
        ItemCraftedEvent,
        BlockPlacedEvent,
        BlockBrokenEvent,
        MobKilledEvent,
        MobInteractedEvent,
        // classes
        APIOptions,
        APIInstance,
        Vector3
    }
}