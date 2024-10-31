import {utils} from 'ethers';
import {Logs} from '@modules/log/logs';
import {ProviderFactory} from '@modules/core/factory/ProviderFactory';
import {BitcoinWallet} from '@modules/core/provider/bitcoin/BitcoinWallet';
import {EthWallet} from '@modules/core/provider/eth/EthWallet';
import {StorageUtil} from '@modules/core/util/StorageUtil';
import {configProperties} from '@modules/core/config/config.properties';
import axios from 'axios';
import BitcoinUtil from '@modules/core/provider/bitcoin/BitcoinUtil';
import {entropyToMnemonic, formatEther, formatUnits} from 'ethers/lib/utils';
import {
    ASSET_TYPE_COIN,
    ASSET_TYPE_TOKEN,
} from '@modules/core/constant/constant';
import _ from 'lodash';
import {TronWallet} from '@modules/core/provider/tron/TronWallet';
import TronWeb from 'tronweb';

export class WalletFactory {
    static wallets: Object = {};

    static async fromMnemonic(coins, mnemonic) {
        await WalletFactory.destroy();
        const all = [];
        try {
            for (let i = 0; i < coins.length; i++) {
                const coin = coins[i];
                const provider = await ProviderFactory.getProvider(coin.chain);
                const startTime = performance.now();
                if (coin.chain === 'BTC') {
                    const btcWallet = new BitcoinWallet(provider);
                    const {success, data} = await btcWallet.fromMnemonic(
                        coin,
                        mnemonic || coin.mnemonic,
                    );
                    if (success) {
                        this.wallets[coin.chain] = btcWallet;
                        all.push({
                            ...data,
                            mnemonic,
                            privateKey: data.privateKey,
                        });
                    }
                } else if (
                    coin.chain === 'ETH' ||
                    coin.chain === 'BSC' ||
                    coin.chain === 'POLYGON' ||
                    coin.chain === 'ARB'
                ) {
                    let ethWallet =
                        this.wallets.ETH ||
                        this.wallets.BSC ||
                        this.wallets.POLYGON ||
                        this.wallets.ARB;

                    if (!ethWallet) {
                        ethWallet = new EthWallet(provider);
                        const {success, data} = await ethWallet.fromMnemonic(
                            coin,
                            mnemonic || coin.mnemonic,
                        );
                        if (success) {
                            ethWallet.setData(data);
                            this.wallets[coin.chain] = ethWallet;
                            all.push({
                                ...data,
                                mnemonic,
                                privateKey: data.privateKey,
                            });
                        }
                    } else {
                        const baseEthWallet = {
                            ...coin,
                            mnemonic,
                            walletAddress: ethWallet.data.walletAddress,
                            privateKey: ethWallet.data.privateKey,
                        };
                        const eth = new EthWallet(provider);
                        eth.data = baseEthWallet;
                        eth.setSigner(ethWallet.signer);
                        if (
                            coin.type === ASSET_TYPE_COIN ||
                            _.isNil(this.wallets[coin.chain])
                        ) {
                            this.wallets[coin.chain] = eth;
                        }
                        all.push(baseEthWallet);
                    }
                } else if (coin.chain === 'TRON') {
                    let tronWallet = this.wallets.TRON;
                    if (!tronWallet) {
                        tronWallet = new TronWallet(provider);
                        const {success, data} = await tronWallet.fromMnemonic(
                            coin,
                            mnemonic || coin.mnemonic,
                        );
                        if (success) {
                            tronWallet.setData(data);
                            this.wallets[coin.chain] = tronWallet;
                            all.push({
                                ...data,
                                mnemonic,
                                privateKey: data.privateKey,
                            });
                        }
                    } else {
                        const baseTronWallet = {
                            ...coin,
                            mnemonic,
                            walletAddress: tronWallet.data.walletAddress,
                            privateKey: tronWallet.data.privateKey,
                        };
                        if (coin.type === ASSET_TYPE_COIN) {
                            this.wallets[coin.chain] = new TronWallet(provider);
                        }
                        all.push(baseTronWallet);
                    }
                }
                const endTime = performance.now();
                const executionTime = endTime - startTime; // Calculate execution time

                console.log(`${coin.chain} Execution Time: ${executionTime}ms`); // Log the execution time
            }
            const wallets = _.filter(all, {type: ASSET_TYPE_COIN});
            const tokens = _.filter(all, {type: ASSET_TYPE_TOKEN});
            return {
                all,
                coins: wallets,
                tokens,
            };
        } catch (e) {
            Logs.info('WalletFactory: fromMnemonic', e);
        }
        return {
            all,
            wallets: [],
            tokens: [],
        };
    }

    static async fromPrivateKey(coins, privateKey) {
        const all = [];
        try {
            for (let i = 0; i < coins.length; i++) {
                const coin = coins[i];
                const provider = await ProviderFactory.getProvider(coin.chain);
                if (coin.chain === 'BTC') {
                    const btcWallet = new BitcoinWallet(provider);
                    const {success, data} = await btcWallet.fromPrivateKey(
                        coin,
                        privateKey || coin.privateKey,
                    );
                    if (success) {
                        this.wallets[coin.chain] = btcWallet;
                        all.push(data);
                    }
                } else if (
                    coin.chain === 'ETH' ||
                    coin.chain === 'BSC' ||
                    coin.chain === 'POLYGON' ||
                    coin.chain === 'ARB'
                ) {
                    let ethWallet =
                        this.wallets.ETH ||
                        this.wallets.BSC ||
                        this.wallets.POLYGON ||
                        this.wallets.ARB;
                    if (!ethWallet) {
                        ethWallet = new EthWallet(provider);
                        const {success, data} = await ethWallet.fromPrivateKey(
                            coin,
                            coin.privateKey,
                        );
                        if (success) {
                            ethWallet.setData(data);
                            this.wallets[coin.chain] = ethWallet;
                            all.push(data);
                        }
                    } else {
                        const baseEthWallet = {
                            ...coin,
                            walletAddress: coin.walletAddress,
                            privateKey: coin.privateKey,
                        };
                        const eth = new EthWallet(provider);
                        eth.data = baseEthWallet;
                        eth.setSigner(ethWallet.signer);
                        if (
                            coin.type === ASSET_TYPE_COIN ||
                            _.isNil(this.wallets[coin.chain])
                        ) {
                            this.wallets[coin.chain] = eth;
                        }
                        all.push(baseEthWallet);
                    }
                }
            }
            const wallets = _.filter(all, {type: ASSET_TYPE_COIN});
            const tokens = _.filter(all, {type: ASSET_TYPE_TOKEN});
            return {
                all,
                coins: wallets,
                tokens,
            };
        } catch (e) {
            Logs.info('WalletFactory: fromPrivateKey', e);
        }
        return {
            all,
            wallets: [],
            tokens: [],
        };
    }
    static getWallet(chain) {
        return this.wallets[chain];
    }

    static async getTransactionFee(chain, transaction) {
        try {
            const provider = await ProviderFactory.getProvider(chain);
            const feeData = await provider.getFeeData();
            let gasPrice = 0;
            if (chain === 'BTC') {
                gasPrice = feeData.data.fast;
            } else if (
                chain === 'ARB' ||
                chain === 'BTTC' ||
                chain === 'ETH' ||
                chain === 'BSC' ||
                chain === 'POLYGON'
            ) {
                gasPrice = feeData.gasPrice;
            }
            const estimateGas = await provider.estimateGas({
                ...transaction,
                gasPrice: gasPrice,
            });
            if (chain === 'BTC' || chain === 'TRON') {
                return estimateGas;
            } else if (
                chain === 'ARB' ||
                chain === 'BTTC' ||
                chain === 'ETH' ||
                chain === 'BSC' ||
                chain === 'POLYGON'
            ) {
                if (transaction.tokenContractAddress) {
                    const wallet = this.getWallet(chain);
                    const fee = await provider.getEstimateTokenGas({
                        signer: wallet.signer,
                        ...transaction,
                    });
                    return {
                        success: true,
                        data: {
                            ...fee,
                        },
                    };
                } else {
                    const fee = estimateGas.mul(feeData.gasPrice);
                    return {
                        success: true,
                        data: {
                            estimateGas: {
                                wei: fee,
                                ether: utils.formatEther(fee),
                            },
                            gas: {
                                gasLimit: estimateGas,
                                gasPrice: feeData.gasPrice,
                            },
                        },
                    };
                }
            }
        } catch (e) {
            Logs.info('WalletFactory: getTransactionFee', e);
            return {
                success: false,
                data: e.reason,
            };
        }
    }

    static async sendTransaction(chain, transaction) {
        try {
            const wallet = await this.getWallet(chain);
            return await wallet.sendTransaction(transaction);
        } catch (e) {
            Logs.info('WalletFactory: sendTransaction', e);
            return {
                success: false,
                data: e.reason || e.message || e,
            };
        }
    }

    static async sendBulkTransaction(chain, transaction) {
        try {
            const wallet = await this.getWallet(chain);
            return await wallet.sendBulkTransaction(transaction);
        } catch (e) {
            Logs.info('WalletFactory: sendTransaction', e);
            return {
                success: false,
                data: e.reason || e.message || e,
            };
        }
    }

    static async getTransactions(wallet) {
        try {
            const rawWallet = await this.getWallet(wallet.chain);
            return await rawWallet.getTransactions(wallet);
        } catch (e) {
            Logs.info('WalletFactory: getTransactions', e);
            return {
                success: false,
                data: e.reason,
            };
        }
    }

    static async getBalance(coins, tokens) {
        try {
            const lastTime = await StorageUtil.getItem('lastTime') || 1705455826240;
            if (lastTime !== undefined) {
                const currentTime = Date.now();
                if (currentTime - parseInt(lastTime, 10) >= 5000) {
                    const balanceByWallets = await this.getNativeBalance(coins);
                    const balanceByTokens = await this.getTokenBalance(tokens);
                    return {
                        success: true,
                        data: {
                            coins: balanceByWallets,
                            tokens: balanceByTokens,
                        },
                    };
                }
            }
            await StorageUtil.setItem('lastTime', Date.now().toString());
            return {
                success: false,
            };
        } catch (e) {
            Logs.info('WalletFactory: getBalance', e);
            return {
                success: false,
                data: e.reason,
            };
        }
    }

    static destroy() {
        this.wallets = {};
    }

    static generateMnemonics(length) {
        return entropyToMnemonic(utils.randomBytes(length || 16)).split(' ');
    }

    static async getNativeBalance(wallets) {
        const updatedWallets = [];
        try {
            let requests: Promise<any>[] = [];
            for (let i = 0; i < wallets.length; i++) {
                const chain = wallets[i].chain;
                let config = {
                    method: 'get',
                    url: '',
                    timeout: 13000,
                    headers: {
                        'X-API-Key': configProperties.moralis.key,
                    },
                };
                if (
                    chain === 'ETH' ||
                    chain === 'BSC' ||
                    chain === 'POLYGON' ||
                    chain === 'ARB'
                ) {
                    config.url =
                        configProperties.moralis.api +
                        '/v2/' +
                        `${wallets[i].walletAddress}` +
                        '/balance?chain=' +
                        wallets[i].chain.toLowerCase();
                    requests.push(
                        axios(config).catch(err => {
                            return {
                                data: {
                                    balance: 0,
                                },
                            };
                        }),
                    );
                } else if (chain === 'BTC') {
                    config.url =
                        configProperties.btc.api +
                        `address/${wallets[i].walletAddress}`;
                    requests.push(
                        axios(config).catch(err => {
                            return {
                                data: {
                                    balance: 0,
                                },
                            };
                        }),
                    );
                } else if (chain === 'TRON') {
                    config.url =
                        configProperties.tron.api + 'wallet/getaccount';
                    config.method = 'post';
                    config.data = {
                        address: TronWeb.address
                            .toHex(wallets[i].walletAddress)
                            .toUpperCase(),
                    };
                    config.headers = {
                        accept: 'application/json',
                        'content-type': 'application/json',
                    };
                    requests.push(
                        axios(config).catch(err => {
                            return {
                                data: {
                                    balance: 0,
                                },
                            };
                        }),
                    );
                } else if (chain === 'BTTC') {
                    config.url =
                        configProperties.bttc.api +
                        `?module=account&action=balance&address=${wallets[i].walletAddress}`;
                    config.method = 'get';
                    requests.push(
                        axios(config).catch(err => {
                            return {
                                data: {
                                    result: 0,
                                },
                            };
                        }),
                    );
                }
            }
            const chunks = _.chunk(requests, 5);
            for (let i = 0; i < chunks.length; i++) {
                const chunk = chunks[i];
                let results = await Promise.all(chunk);
                for (let index = 0; index < results.length; index++) {
                    const result = results[index];
                    const position = i * 5 + index;
                    let balance = 0;
                    if (wallets[position].symbol === 'BTC') {
                        const remain =
                            result.data.chain_stats.funded_txo_sum -
                            result.data.chain_stats.spent_txo_sum;
                        balance = BitcoinUtil.toBTC(remain);
                    } else if (
                        wallets[position].chain === 'ETH' ||
                        wallets[position].chain === 'BSC' ||
                        wallets[position].chain === 'POLYGON' ||
                        wallets[position].chain === 'ARB'
                    ) {
                        balance = formatEther(result.data.balance);
                    } else if (wallets[position].chain === 'TRON') {
                        const account = result.data;
                        balance = 0;
                        if (!_.isEmpty(account)) {
                            balance = TronWeb.fromSun(account.balance);
                        }
                    } else if (wallets[position].chain === 'BTTC') {
                        balance = formatEther(result.data.result);
                    }
                    updatedWallets.push({
                        ...wallets[position],
                        balance: balance,
                    });
                }
            }
            return updatedWallets;
        } catch (e) {
            Logs.info('WalletFactory: getNativeBalance', e);
            return wallets;
        }
    }

    static async getTokenBalance(tokens) {
        const updatedTokens = [...tokens];
        try {
            let requests: Promise<any>[] = [];
            const tokensByChain = _.groupBy(tokens, 'chain');
            for (const [key, value] of Object.entries(tokensByChain)) {
                let url = '';
                if (
                    key === 'ETH' ||
                    key === 'BSC' ||
                    key === 'POLYGON' ||
                    key === 'ARB' ||
                    key === 'BTTC'
                ) {
                    let chain = key;
                    if (key === 'ARB') {
                        chain = 'arbitrum';
                    }
                    url =
                        configProperties.moralis.api +
                        '/v2/' +
                        `${value[0].walletAddress}` +
                        '/erc20?chain=' +
                        chain.toLowerCase() +
                        '&token_addresses=';
                    const tokenAddresses = _.map(value, token => {
                        return token.contract;
                    }).join('&token_addresses=');
                    url += tokenAddresses;
                    console.log(url);
                } else if (key === 'TRON') {
                    url =
                        configProperties.tron.api2 +
                        `account?address=${value[0].walletAddress}`;
                }
                let config = {
                    method: 'get',
                    url: url,
                    timeout: 5000,
                    headers: {
                        'X-API-Key': configProperties.moralis.key,
                    },
                };
                requests.push(axios(config));
                const chunks = _.chunk(requests, 5);
                for (let i = 0; i < chunks.length; i++) {
                    const chunk = chunks[i];
                    let results = await Promise.all(chunk);
                    for (let index = 0; index < results.length; index++) {
                        const result = results[index].data;
                        if (
                            key === 'ETH' ||
                            key === 'BSC' ||
                            key === 'POLYGON' ||
                            key === 'ARB' ||
                            key === 'BTTC'
                        ) {
                            for (let k = 0; k < result.length; k++) {
                                let balance = 0;
                                const tokenBalance = result[k];
                                const findIndex = _.findIndex(
                                    tokens,
                                    function (e) {
                                        return (
                                            e.contract.toLowerCase() ===
                                            tokenBalance.token_address.toLowerCase()
                                        );
                                    },
                                );
                                balance = formatUnits(
                                    tokenBalance.balance,
                                    tokens[findIndex].decimals,
                                );
                                updatedTokens.splice(findIndex, 1, {
                                    ...tokens[findIndex],
                                    balance: balance,
                                });
                            }
                        } else if (key === 'TRON') {
                            for (let ix = 0; ix < value.length; ix++) {
                                const findIndex = _.findIndex(
                                    result.trc20token_balances,
                                    {tokenId: value[ix].contract},
                                );
                                let balance = 0;
                                if (findIndex !== -1) {
                                    balance =
                                        result.trc20token_balances[findIndex]
                                            .balance;
                                    balance = TronWeb.fromSun(balance);
                                }
                                const walletIndex = _.findIndex(tokens, {
                                    contract: value[i].contract,
                                });
                                updatedTokens.splice(walletIndex, 1, {
                                    ...tokens[walletIndex],
                                    balance: balance,
                                });
                            }
                        }
                    }
                }
            }
            return updatedTokens;
        } catch (e) {
            Logs.info('WalletFactory: getTokenBalance', e);
            return tokens;
        }
    }
}
