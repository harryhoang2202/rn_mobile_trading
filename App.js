import '@walletconnect/react-native-compat';
import './shim.js';
import * as React from 'react';
import {useEffect} from 'react';
import {enableScreens} from 'react-native-screens';
import 'text-encoding';
import {Provider} from 'react-redux';
import ReduxStore from '@modules/redux/ReduxStore';
import 'react-native-gesture-handler';
import ApplicationNavigator from '@modules/navigation/ApplicationNavigator';
import '@modules/i18n/i18n';
import {SheetProvider} from 'react-native-actions-sheet';
import CommonLoading from '@components/commons/CommonLoading';
import CustomisableAlert from 'react-native-customisable-alert';
import {LogBox} from 'react-native';
import {PentaPlatform} from '@modules/core/app/PentaPlatform';
import {LogLevel, OneSignal} from 'react-native-onesignal';
import {applicationProperties} from '@src/application.properties';
import FastImage from 'react-native-fast-image';
import {StorageUtil} from '@modules/core/util/StorageUtil';

LogBox.ignoreAllLogs(true);
LogBox.ignoreLogs([
    'Non-serializable values were found in the navigation state',
]);
enableScreens();
// Remove this method to stop OneSignal Debugging
OneSignal.Debug.setLogLevel(LogLevel.Verbose);

// OneSignal Initialization
OneSignal.initialize(applicationProperties.oneSignal.appId);

// requestPermission will show the native iOS or Android notification permission prompt.
// We recommend removing the following code and instead using an In-App Message to prompt for notification permission
OneSignal.Notifications.requestPermission(true);

// Method for listening for notification clicks
OneSignal.Notifications.addEventListener('click', event => {
    console.log('OneSignal: notification clicked:', event);
});
OneSignal.Notifications.addEventListener('foregroundWillDisplay', event => {
    event.preventDefault();
    // some async work

    // Use display() to display the notification after some async work
    event.getNotification().display();
});
OneSignal.InAppMessages.addEventListener('willDisplay', event => {
    console.log('OneSignal: will display IAM: ', event);
});

OneSignal.InAppMessages.addEventListener('didDisplay', event => {
    console.log('OneSignal: did display IAM: ', event);
});

OneSignal.InAppMessages.addEventListener('willDismiss', event => {
    console.log('OneSignal: will dismiss IAM: ', event);
});

OneSignal.InAppMessages.addEventListener('didDismiss', event => {
    console.log('OneSignal: did dismiss IAM: ', event);
});
FastImage.clearMemoryCache();
FastImage.clearDiskCache();
export default function App() {
    useEffect(() => {
        (async () => {
            //await StorageUtil.clear();
            await PentaPlatform.init();
        })();
    }, []);
    return (
        <Provider store={ReduxStore}>
            <SheetProvider>
                <ApplicationNavigator />
                <CommonLoading ref={ref => CommonLoading.setRef(ref)} />
                <CustomisableAlert />
            </SheetProvider>
        </Provider>
    );
}
