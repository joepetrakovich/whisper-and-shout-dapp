import MetaMaskOnBoarding from '@metamask/onboarding';
import { ethers } from 'ethers';
import { OasisNetworkStatus, type Network } from './Models';
import { readable, type Readable } from 'svelte/store';

export const OASIS_EMERALD_TESTNET: Network = {
    name: "Oasis Emerald Testnet",
    chainIdHex:  "0xa515",
    chainIdDecimal: 42261,
    rpcUrls: ["https://testnet.emerald.oasis.dev"],
    blockExplorerUrls: ["https://testnet.explorer.emerald.oasis.dev"],
    nativeCurrency: {
        name: "TEST", 
        symbol: "TEST",
        decimals: 18
    }
}

export const OASIS_SAPPHIRE_TESTNET: Network = {
    name: "Oasis Sapphire Testnet",
    chainIdHex:  "0x5aff",
    chainIdDecimal: 23295,
    rpcUrls: ["https://testnet.sapphire.oasis.dev"],
    blockExplorerUrls: ["https://testnet.explorer.sapphire.oasis.dev"],
    nativeCurrency: {
        name: "TEST", 
        symbol: "TEST",
        decimals: 18
    }
}

export function addNetwork(network: Network) {
    return window.ethereum.request({
        method: "wallet_addEthereumChain",
        params: [{
            chainId: network.chainIdHex,
            rpcUrls: network.rpcUrls,
            chainName: network.name,
            nativeCurrency: network.nativeCurrency,
            blockExplorerUrls: network.blockExplorerUrls
        }]
    });
}

export function switchNetwork(chainId: string) {
    return window.ethereum.request({
         method: 'wallet_switchEthereumChain',
         params: [{ chainId: chainId }]
    });
}

async function getOasisNetworkConnectionStatus(): Promise<OasisNetworkStatus> {
    try {    
        if (!MetaMaskOnBoarding.isMetaMaskInstalled()) {
            return OasisNetworkStatus.PROVIDER_NOT_FOUND;
        }

        const provider = new ethers.BrowserProvider(window.ethereum);
        const network = await provider.getNetwork();

        if (!window.ethereum.selectedAddress) {
            return OasisNetworkStatus.WALLET_NOT_CONNECTED;
        }

        if (network.chainId.toString() === OASIS_EMERALD_TESTNET.chainIdDecimal.toString()) {
            return OasisNetworkStatus.ON_EMERALD_PARATIME;
        }

        if (network.chainId.toString() === OASIS_SAPPHIRE_TESTNET.chainIdDecimal.toString()) {
            return OasisNetworkStatus.ON_SAPPHIRE_PARATIME;
        }
        
        return OasisNetworkStatus.ON_DIFFERENT_NETWORK;

    } catch (error) {
        console.error(`An error occurred while trying to connect to the Oasis network: ${error}`);
        return OasisNetworkStatus.PROVIDER_NOT_FOUND;
    }
}

export function createOasisNetworkWatcherStore(): Readable<OasisNetworkStatus> {
    const store = readable<OasisNetworkStatus>(OasisNetworkStatus.INITIALIZING, set => {

        const interval = setInterval(async () => {
            set(await getOasisNetworkConnectionStatus());
        }, 1000);

        return () => clearInterval(interval); 
    });

    return store;
}

export function createAccountWatcherStore(): Readable<string> {
    const store = readable<string>('Connecting...', set => {

        const interval = setInterval(async () => {
            if (window.ethereum) {
                set(window.ethereum.selectedAddress);
            }
        }, 1000);

        return () => clearInterval(interval); 
    });

    return store;
}