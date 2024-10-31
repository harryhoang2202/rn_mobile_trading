import React, {useEffect, useRef} from 'react';
import {
    ActivityIndicator,
    Platform,
    SafeAreaView,
    StyleSheet,
    View,
} from 'react-native';
import {useSelector} from 'react-redux';
import CommonText from '@components/commons/CommonText';
import WebView from 'react-native-webview';
import CommonBackButton from '@components/commons/CommonBackButton';

export default function NewsDetailScreen({navigation, route}) {
    const {item} = route.params;
    const {theme} = useSelector(state => state.ThemeReducer);
    const webRef = useRef(null);
    useEffect(() => {
        (async () => {})();
    }, []);

    return (
        <View style={styles.container}>
            <SafeAreaView style={styles.container}>
                <View style={[styles.header]}>
                    <View style={styles.leftHeader}>
                        <CommonBackButton
                            onPress={async () => {
                                navigation.goBack();
                            }}
                        />
                    </View>
                    <View style={styles.contentHeader}>
                        <CommonText style={styles.headerTitle}>
                            {item.title}
                        </CommonText>
                    </View>
                </View>
                <View style={styles.content}>
                    <WebView
                        ref={webRef}
                        originWhitelist={['*']}
                        source={{uri: item.url}}
                        setSupportMultipleWindows={false}
                        renderLoading={() => (
                            <ActivityIndicator size="large" color="#0000ff" />
                        )}
                        incognito={true}
                    />
                </View>
            </SafeAreaView>
        </View>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        height: 48,
        paddingHorizontal: 10,
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    leftHeader: {
        width: 30,
        height: '100%',
        justifyContent: 'center',
        alignItems: 'flex-start',
    },
    contentHeader: {
        flex: 1,
        justifyContent: 'center',
        height: '100%',
    },
    rightHeader: {
        width: 30,
        height: '100%',
        alignItems: 'flex-end',
        justifyContent: 'center',
    },
    headerTitle: {
        fontSize: 15,
        fontWeight: 'bold',
    },
    content: {
        flex: 1,
    },
    item: {
        width: '100%',
        borderBottomWidth: 0.5,
    },
    row: {
        minHeight: 90,
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    leftItemContainer: {
        height: '100%',
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    iconContainer: {
        width: 42,
        height: 42,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    rightItemContainer: {
        height: '100%',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    browserContainer: {
        flex: 1,
        paddingTop: Platform.OS === 'android' ? 0 : 48,
    },
    sessionRequestContainer: {
        width: '100%',
        marginBottom: Platform.OS === 'android' ? 0 : 170,
    },
    titleContainer: {
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
    },
    contentContainer: {
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 10,
        minHeight: 200,
    },
    buttonContainer: {
        flex: 1,
        paddingHorizontal: 10,
        flexDirection: 'row',
        alignItems: 'center',
    },
    haftButton: {
        width: '50%',
        height: 55,
        justifyContent: 'center',
        alignItems: 'center',
    },
    browserHeader: {
        height: 30,
        width: '100%',
        flexDirection: 'row',
        paddingHorizontal: 10,
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    gapBackground: {
        height: 50,
        width: '100%',
        position: 'absolute',
        top: 0,
    },
    gradient: {
        width: '100%',
        height: '100%',
    },
});