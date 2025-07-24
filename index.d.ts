import { WebSocketServer } from 'ws';
declare module 'mcwss-api' {
    export type EventType = 
        'PlayerMessage' |
        'PlayerTravelled' |
        'PlayerTransform' |
        'PlayerTeleport' |
        'PlayerDied' |
        'PlayerBounced' |
        'EntitySpawned' |
        'ItemUsed' |
        'ItemAcquired' |
        'ItemSmelted' |
        'ItemCrafted' |
        'BlockPlaced' |
        'BlockBroken' |
        'MobKilled' |
        'MobInteracted';

    export type MessagePurpose =
        'commandRequest' |
        'commandResponse' |
        'event' |
        'error'
    
    export type WrapperOptions = {
        logCmdErrors: boolean,
        logCmdOutput: boolean,
        logMsgErrors: boolean,
        logSeriousErrors: boolean,
        logOther: boolean
    }
    export class APIInstance {
        wss: WebSocketServer | undefined;
        options: WrapperOptions;
        start(port: number, host: string, options: WrapperOptions): void;
        stop(): void;
        subscribe(ws: WebSocket, event_type: EventType): void;
        unsubscribe(ws: WebSocket, event_type: EventType): void;
        on(ws: WebSocket, event_type: EventType, cb: (msg: object) => void): void;
        on_purpose(ws: WebSocket, purpose: MessagePurpose, cb: (msg: object) => void): void;
        run_command(ws: WebSocket, command: string): void;
    }
}