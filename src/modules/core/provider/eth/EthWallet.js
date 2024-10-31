import 'react-native-get-random-values';
import '@ethersproject/shims';
import {Logs} from '@modules/log/logs';
import {EthProvider} from '@modules/core/provider/eth/EthProvider';
import {BigNumber, ethers, Wallet} from 'ethers';
import {ProviderFactory} from '@modules/core/factory/ProviderFactory';
import {formatUnits, parseEther, parseUnits} from 'ethers/lib/utils';
import * as Bip39 from 'bip39';
import {hdkey} from 'ethereumjs-wallet';
import Web3 from 'web3';
import {
    signTypedData as web3SignTypeData,
    SignTypedDataVersion,
} from '@metamask/eth-sig-util';
import {toBuffer} from 'ethereumjs-util';
import {pbkdf2} from 'react-native-fast-crypto';

export class EthWallet implements Wallet {
    provider: EthProvider;
    data: Object;
    signer: Wallet;
    web3Signer: Web3;

    constructor(provider: EthProvider) {
        this.provider = provider;
    }

    setData(data) {
        this.data = data;
    }

    setSigner(signer) {
        this.signer = signer.connect(this.provider.provider);
        const web3 = new Web3(this.provider.provider.connection.url);
        web3.eth.accounts.wallet.add(this.signer.privateKey);
        web3.eth.defaultAccount = this.signer.address;
        this.web3Signer = web3;
    }
    async mnemonicToSeed(mnemonic, passphrase = '') {
        const mnemonicBuffer = Buffer.from(mnemonic, 'utf8');
        const saltBuffer = Buffer.from('mnemonic' + passphrase, 'utf8'); // BIP39 specifies "mnemonic" + passphrase
        const iterations = 2048; // BIP39 standard
        const keyLength = 64; // BIP39 standard length for seed
        const alg = 'sha512'; // BIP39 uses SHA512

        try {
            // Using pbkdf2.deriveAsync from your defined methods
            const seed = await pbkdf2.deriveAsync(
                mnemonicBuffer,
                saltBuffer,
                iterations,
                keyLength,
                alg,
            );

            // Convert the result to hex format if needed or use it as is
            return seed.toString('hex');
        } catch (error) {
            console.error('Error generating seed from mnemonic:', error);
            throw error;
        }
    }
    async fromMnemonic(data, mnemonic): Promise<Object> {
        try {
            const provider = await ProviderFactory.getProvider(data.chain);
            const wallet = await this.createWallet(
                mnemonic,
                0,
                provider.provider,
            );
            this.setSigner(wallet);
            return {
                success: true,
                data: {
                    ...data,
                    walletAddress: wallet.address,
                    privateKey: wallet.privateKey,
                },
            };
        } catch (e) {
            Logs.info('EthWallet: fromMnemonic', e);
            return {
                success: false,
                data: {
                    ...data,
                },
            };
        }
    }

    async createWallet(mnemonic, index, provider): Promise<Wallet> {
        const seed = await this.mnemonicToSeed(mnemonic);
        const hdNode = hdkey.fromMasterSeed(Buffer.from(seed, 'hex'));
        const node = hdNode.derivePath("m/44'/60'/0'");
        const change = node.deriveChild(0);
        const childNode = change.deriveChild(index);
        const childWallet = childNode.getWallet();
        return new Wallet(
            childWallet.getPrivateKey().toString('hex'),
            provider,
        );
    }

    async fromPrivateKey(data): Promise<Object> {
        try {
            const provider = ProviderFactory.getProvider(data.chain);
            const wallet = new ethers.Wallet(
                data.privateKey,
                provider.provider,
            );
            this.setSigner(wallet);
            return {
                success: true,
                data: {
                    ...data,
                },
            };
        } catch (e) {
            Logs.info('EthWallet: fromPrivateKey', e);
            return {
                success: false,
                data: {
                    ...data,
                },
            };
        }
    }

    async sendTransaction(transaction): Promise<Object> {
        if (transaction.tokenContractAddress) {
            return this.sendToken(transaction);
        }
        return this.sendNative(transaction);
    }

    async sendNative(transaction): Promise<Object> {
        try {
            const {to, value, gasPrice, gasLimit, takerFee, takerAddress} =
                transaction;
            let tx,
                txFee = '';
            tx = await this.executeNative(
                to,
                parseEther(value.toString()),
                gasPrice,
                gasLimit,
            );
            let takerAmount = 0;
            if (takerFee && takerAddress) {
                takerAmount = (takerFee * parseEther(value.toString())) / 100;
                await tx.wait(3);
                txFee = await this.executeNative(
                    takerAddress,
                    takerAmount,
                    gasPrice,
                    gasLimit,
                );
            }
            return {
                success: true,
                data: {
                    ...transaction,
                    takerAmount: formatUnits(takerAmount.toString()),
                    tx,
                    txFee,
                },
            };
        } catch (e) {
            Logs.info('EthWallet: sendNative', e);
            return {
                success: false,
                data: e.reason,
            };
        }
    }

    async executeNative(to, value, gasPrice, gasLimit) {
        return await this.signer.sendTransaction({
            to: to,
            value: value,
            gasPrice: gasPrice,
            gasLimit: gasLimit,
        });
    }

    async sendToken(transaction): Promise<Object> {
        try {
            let tx,
                txFee = '';
            const {
                value,
                takerFee,
                takerAddress,
                decimals,
                tokenContractAddress,
                gasLimit,
                gasPrice,
            } = transaction;
            console.log(
                'gasPrice',
                formatUnits(
                    BigNumber.from(gasPrice).toBigInt().toString(),
                    'gwei',
                ),
            );
            console.log('gasLimit', BigNumber.from(gasLimit).toBigInt());
            tx = await this.executeToken({
                ...transaction,
                value: parseUnits(value.toString(), decimals).toString(),
            });
            await this.signer.sendTransaction({...tx, gasLimit, gasPrice});
            let takerAmount = 0;
            if (takerFee && takerAddress) {
                takerAmount =
                    (takerFee * parseUnits(value.toString(), decimals)) / 100;
                txFee = await this.executeToken({
                    ...transaction,
                    to: takerAddress,
                    value: takerAmount.toString(),
                    tokenContractAddress,
                });
                await this.signer.sendTransaction({
                    ...txFee,
                    gasLimit,
                    gasPrice,
                });
            }
            return {
                success: true,
                data: {
                    ...transaction,
                    takerAmount: formatUnits(takerAmount.toString(), decimals),
                    tx,
                    txFee,
                },
            };
        } catch (e) {
            Logs.info('EthWallet: sendToken', e);
            return {
                success: false,
                data: e.reason,
            };
        }
    }

    async executeToken(transaction) {
        const {to, value, tokenContractAddress} = transaction;
        return await this.provider.transferToken({
            signer: this.signer,
            tokenContractAddress,
            to,
            value,
        });
    }

    async getTransactions(wallet): Promise<Object> {
        try {
            const provider = await ProviderFactory.getProvider(wallet.chain);
            return {
                success: true,
                data: await provider.getTransactions(wallet),
            };
        } catch (e) {
            Logs.info('EthWallet: getTransactions', e);
            return {
                success: false,
                data: [],
            };
        }
    }

    async sign(dataToSign) {
        return this.web3Signer.eth.accounts.sign(
            dataToSign,
            this.data.privateKey,
        ).signature;
    }

    async signTypedData(dataToSign: any) {
        // console.log('private key', this.privateKey);
        console.log(this.data.privateKey);
        let privateKeyBuffer = toBuffer(this.data.privateKey);
        // console.log('privateKeyBuffer', privateKeyBuffer);
        // console.log('dataToSign', dataToSign);
        // console.log('sig', sig);
        return web3SignTypeData({
            privateKey: privateKeyBuffer,
            data: dataToSign,
            version: SignTypedDataVersion.V3,
        });
        // return (this.client.eth.accounts.sign(dataToSign, this.privateKey)).signature;
    }

    async signTransaction(transactionObject) {
        return (
            await this.web3Signer.eth.accounts.signTransaction(
                transactionObject,
                this.data.privateKey,
            )
        ).rawTransaction;
    }

    async sendRawTransaction(tx) {
        return this.web3Signer.eth.sendSignedTransaction(tx);
    }
}
