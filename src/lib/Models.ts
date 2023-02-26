export enum Mode { Whisper, Shout };

export enum OasisNetworkStatus { 
    INITIALIZING,
    WALLET_NOT_CONNECTED,
    PROVIDER_NOT_FOUND, 
    ON_DIFFERENT_NETWORK, 
    ON_EMERALD_PARATIME, 
    ON_SAPPHIRE_PARATIME
};

export interface Currency {
    name: string,
    symbol: string,
    decimals: number
};

export interface Network {
    name: string,
    chainIdHex: string,
    chainIdDecimal: number,
    rpcUrls: string[],
    blockExplorerUrls: string[],
    nativeCurrency: Currency
}

export type Message = { from: string; text: string; timestamp: bigint };
