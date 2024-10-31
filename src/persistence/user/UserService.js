import CommonAPI from '@modules/api/CommonAPI';
import {WalletFactory} from '@modules/core/factory/WalletFactory';
import {StorageUtil} from '@modules/core/util/StorageUtil';
import {setExternalUserId} from '@modules/core/notify/OneSignalService';

export const UserService = {
    get,
    signIn,
    signOut,
};

async function get() {
    return (await StorageUtil.getItem('USER')) || {registered: false, user: {}};
}

async function signIn() {
    StorageUtil.setItem('loggedIn', true);
    const ethWallet = await WalletFactory.getWallet('ETH');
    const message = Date.now().toString();
    const signedHash = await ethWallet.sign(message);
    const {success, data} = await CommonAPI.post('/api/v1/auth/authenticate', {
        address: ethWallet.data.walletAddress,
        signedHash,
        message,
    });
    if (success === true) {
        const user = {
            user: data,
            registered: true,
        };
        StorageUtil.setItem('USER', user);
        setExternalUserId(ethWallet.data.walletAddress);
        await CommonAPI.setAuthorization(data.access_token);
    }
    return {success, data};
}

async function signOut() {
    return await CommonAPI.post('/api/v1/auth/sign-out', {});
}
