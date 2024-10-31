import _ from 'lodash';
import {StorageUtil} from '@modules/core/util/StorageUtil';

export const WalletConnectService = {
    add,
    get,
    remove,
};

async function add(params) {
    const walletConnectSites =
        (await StorageUtil.getItem('WALLET_CONNECT_SITES')) || {};
    const newWalletConnectSites = {
        ...walletConnectSites,
        ...params,
    };
    await StorageUtil.setItem('WALLET_CONNECT_SITES', newWalletConnectSites);
    const metadataList = [];
    _.forOwn(newWalletConnectSites, function (value, key) {
        metadataList.push({
            ...value.pairingProposal.params.proposer.metadata,
            id: key,
        });
    });
    console.log(metadataList);
    return {
        success: true,
        data: {
            walletConnectSites: newWalletConnectSites,
            history: metadataList,
        },
    };
}

async function get() {
    try {
        //await StorageUtil.deleteItem('WALLET_CONNECT_SITES');
        const walletConnectSites =
            (await StorageUtil.getItem('WALLET_CONNECT_SITES')) || {};
        const metadataList = [];
        _.forOwn(walletConnectSites, function (value, key) {
            metadataList.push({
                ...value.pairingProposal.params.proposer.metadata,
                id: key,
            });
        });
        return {
            success: true,
            data: {
                walletConnectSites,
                history: metadataList,
            },
        };
    } catch (e) {
        console.log(e.message);
    }
}

async function remove(uri) {
    const walletConnectSites =
        (await StorageUtil.getItem('WALLET_CONNECT_SITES')) || {};
    const newSites = {...walletConnectSites};
    _.unset(newSites, uri);
    await StorageUtil.setItem('WALLET_CONNECT_SITES', newSites);
    const metadataList = [];
    _.forOwn(newSites, function (value, key) {
        metadataList.push({
            ...value.pairingProposal.params.proposer.metadata,
            id: uri,
        });
    });

    return {
        success: true,
        data: {
            walletConnectSites: newSites,
            history: metadataList,
        },
    };
}
