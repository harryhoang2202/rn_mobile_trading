import {Logs} from '@modules/log/logs';
import {ProviderFactory} from '@modules/core/factory/ProviderFactory';
import WSSClient from '@modules/core/ws/WSClient';

export class PentaPlatform {
    static async init() {
        try {
            await initWebSocket();
            initProvider();
        } catch (e) {
            Logs.info('App: init', e);
        }
    }
}

const initProvider = () => {
    ProviderFactory.init([
        {
            chain: 'BTC',
            apiEndpoint: 'https://blockstream.info/api/',
            testnet: false,
        },
        {
            chain: 'ETH',
            chainId: 1,
            rpcUrl: 'https://rpc.ankr.com/eth',
            apiEndpoint: 'https://api.etherscan.io/api',
            apiKey: '4DUWR9JECH25G9YCXSZ6UPERZ16SRBG6WR',
            testnet: false,
        },
        {
            chain: 'BSC',
            rpcUrl: 'https://bsc-dataseed1.defibit.io/',
            chainId: 56,
            apiEndpoint: 'https://api.bscscan.com/api',
            apiKey: '1UVR5JEUSFF5JKYCQZQKPI2YZDNHQDIWTW',
            testnet: false,
        },
        {
            chain: 'POLYGON',
            rpcUrl: 'https://polygon-rpc.com',
            chainId: 137,
            apiEndpoint: 'https://api.polygonscan.com/api',
            apiKey: 'ADZI52F2INID3WJCEJPV7TEQUQUMRNE9M7',
            testnet: false,
        },
        {
            chain: 'POLYGON',
            rpcUrl: 'https://polygon-rpc.com',
            chainId: 137,
            apiEndpoint: 'https://api.polygonscan.com/api',
            apiKey: 'ADZI52F2INID3WJCEJPV7TEQUQUMRNE9M7',
            testnet: false,
        },
        {
            chain: 'TRON',
            rpcUrl: 'https://api.trongrid.io/',
            apiEndpoint: 'https://api.trongrid.io/',
            apiKey: '0327edd7-48f8-41a2-ab57-efa9f7ccfe5a',
            testnet: false,
        },
        {
            chain: 'ARB',
            rpcUrl: 'https://arb1.arbitrum.io/rpc',
            chainId: 42161,
            apiEndpoint: 'https://api.arbiscan.io/api',
            apiKey: '1U93SHXE81F6D1YZVD1A1Y7HKVB31ISCJK',
            testnet: false,
        },
    ]);
};

const initWebSocket = async () => {
    await WSSClient.connect({
        header: {},
        callBack: null,
    });
};
