import {Core} from '@walletconnect/core';
import {Web3Wallet} from '@walletconnect/web3wallet';

export let web3wallet;

export async function createWeb3Wallet() {
    const core = new Core({
        //logger: "debug",
        projectId: '7b6e0bd9fe7379154288cbff433bcaee',
        relayUrl: 'wss://relay.walletconnect.com',
    });
    web3wallet = await Web3Wallet.init({
        core, // <- pass the shared `core` instance
        metadata: {
            name: 'PentaWallet',
            description: 'PentaWallet',
            url: 'www.pentawallet.com',
            icons: ['https://pentawallet.herokuapp.com/logo.png'],
        },
    });
}

export async function onConnect({uri}) {
    try {
        await web3wallet.core.pairing.pair({uri: uri});
    } catch (e) {
        console.log('Error');
        console.log(e);
    }
}
