import moment from 'moment';
import {WALLET_LIST_KEY} from '@persistence/wallet/WalletConstant';
import _ from 'lodash';
import {StorageUtil} from '@modules/core/util/StorageUtil';
import {WalletFactory} from '@modules/core/factory/WalletFactory';
import {
    ASSET_TYPE_TOKEN,
    CHAIN_ID_TYPE_MAP,
} from '@modules/core/constant/constant';
import {Logs} from '@modules/log/logs';
import ReduxStore from '@modules/redux/ReduxStore';
import {PriceService} from '@persistence/price/PriceService';

export const WalletService = {
    insert,
    setActiveWallet,
    findAll,
    balance,
    addAsset,
    removeAsset,
    setActiveAsset,
    getActiveAsset,
    update,
    remove,
};

async function insert({
    name,
    type,
    defaultChain,
    mnemonic,
    privateKey,
    coins: coinsParam,
    tokens: tokenParam,
    logoURI,
    chain,
}) {
    try {
        const walletListData = await StorageUtil.getItem(WALLET_LIST_KEY);
        const walletList = walletListData ? walletListData.wallets : [];
        let coins,
            tokens = [];
        if (mnemonic) {
            const walletData = await WalletFactory.fromMnemonic(
                [...coinsParam, ...tokenParam],
                mnemonic,
            );
            coins = walletData.coins;
            tokens = walletData.tokens;
        } else if (privateKey) {
            const walletData = await WalletFactory.fromPrivateKey(
                [...coinsParam, ...tokenParam],
                privateKey,
            );
            coins = walletData.coins;
            tokens = walletData.tokens;
        }
        const activeAsset = _.find(coins, {id: 'ethereum'});
        const wallet = {
            id: moment().format('YYYYMMDDhhmmss'),
            name: name,
            type: type,
            logoUri: logoURI,
            defaultChain: defaultChain,
            mnemonic: mnemonic,
            coins: coins,
            totalBalance: 0.0,
            activeAsset: activeAsset,
            tokens: tokens,
            chain,
        };
        walletList.push(wallet);
        await StorageUtil.setItem(WALLET_LIST_KEY, {
            wallets: walletList,
            activeWallet: wallet,
        });
        return {
            success: true,
            data: {wallets: walletList, activeWallet: wallet},
        };
    } catch (error) {
        Logs.info('WalletService: insert' + error);
        return {
            success: false,
            data: {},
        };
    }
}

async function update(wallet) {
    try {
        const {wallets, activeWallet} = await StorageUtil.getItem(
            WALLET_LIST_KEY,
        );
        let index = _.findIndex(wallets, {id: wallet.id});
        wallets.splice(index, 1, wallet);
        if (activeWallet.id === wallet.id) {
            activeWallet.name = wallet.name;
        }
        await StorageUtil.setItem(WALLET_LIST_KEY, {
            wallets: wallets,
            activeWallet: activeWallet,
        });
        return {
            success: true,
            data: {wallets: wallets, activeWallet: activeWallet},
        };
    } catch (error) {
        Logs.info('WalletService: update' + error);
        return {
            success: false,
            data: error,
        };
    }
}

async function remove(wallet) {
    try {
        const {wallets, activeWallet} = await StorageUtil.getItem(
            WALLET_LIST_KEY,
        );
        if (activeWallet.id === wallet.id) {
            return;
        }
        _.remove(wallets, {id: wallet.id});
        await StorageUtil.setItem(WALLET_LIST_KEY, {
            wallets: wallets,
            activeWallet: activeWallet,
        });
        return {
            success: true,
            data: {wallets: wallets, activeWallet: activeWallet},
        };
    } catch (error) {
        Logs.info('WalletService: remove' + error);
        return {
            success: false,
            data: error,
        };
    }
}

async function setActiveWallet(wallet) {
    try {
        const {wallets} = await StorageUtil.getItem(WALLET_LIST_KEY);
        const {coins, tokens} = await WalletFactory.fromMnemonic(
            [...wallet.coins, ...wallet.tokens],
            wallet.mnemonic,
        );
        wallet.coins = coins;
        wallet.tokens = tokens;
        await StorageUtil.setItem(WALLET_LIST_KEY, {
            wallets: wallets,
            activeWallet: wallet,
        });
        return {
            success: true,
            data: {wallets: wallets, activeWallet: wallet},
        };
    } catch (error) {
        Logs.info('WalletService: setActiveWallet' + error);
        return {
            success: false,
            data: error,
        };
    }
}

async function findAll() {
    try {
        const walletData = await StorageUtil.getItem(WALLET_LIST_KEY);
        const activeWallet = walletData.activeWallet;
        const {coins, tokens} = await WalletFactory.fromPrivateKey([
            ...activeWallet.coins,
            ...activeWallet.tokens,
        ]);
        activeWallet.coins = coins;
        activeWallet.tokens = tokens;
        return {
            success: true,
            data: {
                wallets: walletData.wallets,
                activeWallet: activeWallet,
            },
        };
    } catch (error) {
        console.log(error);
        return {
            success: false,
            data: {},
        };
    }
}

async function addAsset(asset) {
    try {
        const walletData = await StorageUtil.getItem(WALLET_LIST_KEY);
        const wallets = walletData.wallets;
        const activeWallet = walletData.activeWallet;
        const chain = CHAIN_ID_TYPE_MAP[asset.chainId];
        const wallet = _.find(activeWallet.coins, {chain: chain});
        const tokens = activeWallet.tokens;
        let token = {
            id: asset.tokenId,
            symbol: asset.symbol.toUpperCase(),
            name: asset.name,
            cid: asset.symbol.toUpperCase(),
            chain: chain,
            type: ASSET_TYPE_TOKEN,
            decimals: asset.decimals,
            contract: asset.address || null,
            privateKey: wallet.privateKey,
            balance: 0,
            unconfirmedBalance: 0,
            active: true,
            logoURI: asset.logoURI || null,
            walletAddress: wallet.walletAddress,
        };
        token = (await WalletFactory.getTokenBalance([token]))[0];
        tokens.push(token);
        activeWallet.tokens = tokens;
        let index = _.findIndex(wallets, {id: activeWallet.id});
        wallets.splice(index, 1, activeWallet);
        await StorageUtil.setItem(WALLET_LIST_KEY, {
            wallets: wallets,
            activeWallet: activeWallet,
        });
        PriceService.add({id: token.id});
        return {
            success: true,
            data: {wallets: wallets, activeWallet: activeWallet},
        };
    } catch (error) {
        console.log(error);
        return {
            success: false,
            data: {},
        };
    }
}

async function removeAsset(asset) {
    try {
        const walletData = await StorageUtil.getItem(WALLET_LIST_KEY);
        const wallets = walletData.wallets;
        const activeWallet = walletData.activeWallet;
        const tokens = activeWallet.tokens;
        _.remove(tokens, {contract: asset.address});
        activeWallet.tokens = tokens;
        let index = _.findIndex(wallets, {id: activeWallet.id});
        wallets.splice(index, 1, activeWallet);
        await StorageUtil.setItem(WALLET_LIST_KEY, {
            wallets: wallets,
            activeWallet: activeWallet,
        });
        return {
            success: true,
            data: {wallets: wallets, activeWallet: activeWallet},
        };
    } catch (error) {
        console.log(error);
        return {
            success: false,
            data: {},
        };
    }
}

async function balance() {
    try {
        const {activeWallet, wallets} = await StorageUtil.getItem(
            WALLET_LIST_KEY,
        );
        const {success, data} = await WalletFactory.getBalance(
            activeWallet.coins,
            activeWallet.tokens,
        );
        if (success) {
            activeWallet.coins = data.coins;
            activeWallet.tokens = data.tokens;
            activeWallet.activeAsset = _.find([...data.coins, ...data.tokens], {
                symbol: activeWallet.activeAsset.symbol,
                chain: activeWallet.activeAsset.chain,
            });
            const {prices} = ReduxStore.getState().PriceReducer;
            activeWallet.totalBalance = Object.values([
                ...data.coins,
                ...data.tokens,
            ]).reduce((sum, o) => {
                const price = prices[o.id] ? prices[o.id][0] : 0;
                return sum + price * o.balance;
            }, 0.0);
            await StorageUtil.setItem(WALLET_LIST_KEY, {activeWallet, wallets});
        }
        return {
            success,
            data: {
                activeWallet: activeWallet,
            },
        };
    } catch (error) {
        Logs.info('WalletService: balance' + error);
        return {
            success: false,
            data: error,
        };
    }
}

async function setActiveAsset(asset) {
    try {
        const {activeWallet, wallets} = await StorageUtil.getItem(
            WALLET_LIST_KEY,
        );
        activeWallet.activeAsset = asset;
        let index = _.findIndex(wallets, {id: activeWallet.id});
        wallets.splice(index, 1, activeWallet);
        await StorageUtil.setItem(WALLET_LIST_KEY, {
            wallets: wallets,
            activeWallet: activeWallet,
        });
        return {
            success: true,
            data: {wallets: wallets, activeWallet: activeWallet},
        };
    } catch (error) {
        console.log(error);
        return {
            success: false,
            data: error,
        };
    }
}

async function getActiveAsset(chain, tokenId) {
    try {
        const {activeWallet, wallets} = await StorageUtil.getItem(
            WALLET_LIST_KEY,
        );
        let nativeWallet = _.find(activeWallet.coins, {chain: chain});
        if (!_.isNil(tokenId)) {
            console.log(JSON.stringify(activeWallet.tokens));
            nativeWallet = _.find(activeWallet.tokens, {id: tokenId});
        }
        activeWallet.activeAsset = nativeWallet;
        let index = _.findIndex(wallets, {id: activeWallet.id});
        wallets.splice(index, 1, activeWallet);
        await StorageUtil.setItem(WALLET_LIST_KEY, {
            wallets: wallets,
            activeWallet: activeWallet,
        });
        return {
            success: true,
            data: {wallets: wallets, activeWallet: activeWallet},
        };
    } catch (error) {
        console.log(error);
        return {
            success: false,
            data: error,
        };
    }
}
