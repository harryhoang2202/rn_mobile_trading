import {StorageUtil} from '@modules/core/util/StorageUtil';

async function getAppLock() {
    const appLock = await StorageUtil.getItem('AppLock');
    return (
        appLock || {
            appLock: true,
            autoLock: 60,
            biometryLock: false,
            appLockText: 'app_lock.away1minute',
        }
    );
}

async function setAppLock(appLock) {
    await StorageUtil.setItem('AppLock', appLock);
    return appLock;
}

export const AppLockService = {
    setAppLock,
    getAppLock,
};
