import * as React from 'react';
import {useEffect, useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import AuthenticationStackNavigator from '@modules/navigation/AuthenticationStackNavigator';
import {withTranslation} from 'react-i18next';
import {useDispatch, useSelector} from 'react-redux';
import MainStackNavigator from '@modules/navigation/MainStackNavigator';
import {StatusBar, StyleSheet, View} from 'react-native';
import {ThemeAction} from '@persistence/theme/ThemeAction';
import {CurrencyAction} from '@persistence/currency/CurrencyAction';
import {AppLockAction} from '@persistence/applock/AppLockAction';
import CommonImage from '@components/commons/CommonImage';

function ApplicationNavigator() {
    const {theme, defaultTheme} = useSelector(state => state.ThemeReducer);
    const {loggedIn} = useSelector(state => state.UserReducer);
    const [loading, setLoading] = useState(true);
    const dispatch = useDispatch();
    useEffect(() => {
        (async () => {
            dispatch(ThemeAction.getDefault());
            dispatch(CurrencyAction.getCurrency());
            dispatch(AppLockAction.getAppLock());
            setLoading(false);
        })();
    }, []);
    if (loading === true) {
        return (
            <View style={styles.container}>
                <CommonImage
                    style={{height: 75, width: 75, tintColor: '#353333'}}
                    resizeMode="contain"
                    source={require('@assets/images/logo.png')}
                />
            </View>
        );
    }
    return (
        <NavigationContainer
            theme={{
                colors: {
                    background: theme.background,
                },
            }}>
            <StatusBar
                hidden={false}
                backgroundColor={theme.background4}
                barStyle={'light-content'}
            />
            {loggedIn ? (
                <MainStackNavigator />
            ) : (
                <AuthenticationStackNavigator />
            )}
        </NavigationContainer>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    logo: {
        fontSize: 40,
        letterSpacing: 1,
    },
});

export default withTranslation()(ApplicationNavigator);
