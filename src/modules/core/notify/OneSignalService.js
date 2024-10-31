import {OneSignal} from 'react-native-onesignal';

export const setExternalUserId = externalUserId => {
    OneSignal.logout();
    OneSignal.login(externalUserId);
};
