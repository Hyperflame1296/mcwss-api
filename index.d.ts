declare type EventType = 
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

declare type WrapperOptions = {
    logCmdErrors: boolean,
    logCmdOutput: boolean,
    logMsgErrors: boolean,
    logSeriousErrors: boolean,
    logOther: boolean
}

