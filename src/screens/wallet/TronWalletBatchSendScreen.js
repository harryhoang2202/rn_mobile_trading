import React, {useEffect, useRef, useState} from 'react';
import {
    RefreshControl,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    TextInput,
    View,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import CommonBackButton from '@components/commons/CommonBackButton';
import CommonText from '@components/commons/CommonText';
import {useTranslation} from 'react-i18next';
import Clipboard from '@react-native-clipboard/clipboard';
import CommonLoading from '@components/commons/CommonLoading';
import {WalletAction} from '@persistence/wallet/WalletAction';
import Balance from '@components/Balance';
import CommonGradientButton from '@components/commons/CommonGradientButton';
import {WalletFactory} from '@modules/core/factory/WalletFactory';
import CommonAlert from '@components/commons/CommonAlert';

export default function TronWalletBatchSendScreen({navigation}) {
    const {activeWallet} = useSelector(state => state.WalletReducer);
    const dispatch = useDispatch();
    const {t} = useTranslation();
    const {theme} = useSelector(state => state.ThemeReducer);
    const {fee} = useSelector(state => state.FeeReducer);
    const [destination, setDestination] = useState('');
    const [value, setValue] = useState('');
    const [maxAmount, setMaxAmount] = useState(0);
    const [toFiat, setToFiat] = useState(0);
    const [estimatedGasFee, setEstimatedGasFee] = useState({});
    const [serviceFee, setServiceFee] = useState(0);
    const actionSheetRef = useRef(null);
    const actionCamera = useRef(null);
    const [refreshing, setRefreshing] = useState(false);
    useEffect(() => {
        (async () => {})();
    }, []);
    const onRefresh = async () => {
        CommonLoading.show();
        dispatch(WalletAction.balance()).then(() => {
            CommonLoading.hide();
        });
    };
    const reset = () => {
        setToFiat('');
        setValue('');
        setEstimatedGasFee({});
        setServiceFee(0);
        setDestination(0);
        dispatch(WalletAction.balance());
    };

    const fetchCopiedText = async () => {
        const text = await Clipboard.getString();
        setDestination(text);
    };
    const onSendPress = async () => {
        const recipients = parseAddressAmountPairs(destination);
        try {
            CommonLoading.show();
            for (const recipient of recipients) {
                const params = {
                    to: recipient.address,
                    value: recipient.amount,
                    privateKey: activeWallet.activeAsset.privateKey,
                };
                const tx = await WalletFactory.sendBulkTransaction(
                    activeWallet.activeAsset.chain,
                    params,
                );
            }
            CommonAlert.show({
                title: t('alert.success'),
                message: t('tx.your_transaction_has_been_sent'),
            });
            reset();
        } catch (error) {
            console.error('Error:', error);
        } finally {
            CommonLoading.hide();
        }
    };
    const parseAddressAmountPairs = inputString => {
        const lines = inputString.trim().split('\n');
        const addressAmountPairs = [];

        for (const line of lines) {
            const [address, amount] = line.trim().split(' ');
            addressAmountPairs.push({address, amount});
        }

        return addressAmountPairs;
    };
    return (
        <View style={[styles.container]}>
            <SafeAreaView
                style={[styles.container, {backgroundColor: theme.background}]}>
                <View style={[styles.header]}>
                    <View style={styles.leftHeader}>
                        <CommonBackButton
                            color={theme.text}
                            onPress={async () => {
                                navigation.goBack();
                            }}
                        />
                    </View>
                    <View style={styles.contentHeader}>
                        <CommonText style={styles.headerTitle}>
                            {t('send.send_transaction')}{' '}
                            {activeWallet.activeAsset.symbol}
                        </CommonText>
                    </View>
                    <View style={[styles.rightHeader, {width: 150}]}>
                        <Balance
                            symbol={activeWallet.activeAsset.symbol}
                            style={styles.headerTitle}>
                            {activeWallet.activeAsset.balance}
                        </Balance>
                    </View>
                </View>
                <ScrollView
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                        />
                    }>
                    <View style={styles.content}>
                        <View
                            style={[
                                styles.inputView,
                                {backgroundColor: theme.inputBackground},
                            ]}>
                            <TextInput
                                style={[styles.input, {color: theme.inputText}]}
                                onChangeText={v => setDestination(v)}
                                value={destination}
                                numberOfLines={1}
                                returnKeyType="done"
                                placeholderTextColor="gray"
                                autoCompleteType={'off'}
                                autoCapitalize={'none'}
                                autoCorrect={false}
                                multiline={true}
                            />
                        </View>
                    </View>
                    <View style={styles.buttonContainer}>
                        <CommonGradientButton
                            text={t('tx.next')}
                            onPress={onSendPress}
                        />
                    </View>
                </ScrollView>
            </SafeAreaView>
        </View>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
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
    gradient: {
        width: '100%',
        height: '100%',
    },
    title: {
        fontWeight: 'bold',
        fontSize: 15,
    },
    inputView: {
        minHeight: 200,
        backgroundColor: '#FAFAFA',
        paddingHorizontal: 5,
        borderRadius: 10,
        fontSize: 14,
        marginVertical: 10,
        marginBottom: 0,
        marginHorizontal: 10,
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    input: {flex: 1, color: 'black'},
    moreBtn: {
        justifyContent: 'center',
        marginRight: 20,
        paddingLeft: 10,
    },
    moreBtn2: {
        justifyContent: 'center',
        marginRight: 10,
    },
    toFiat: {
        marginLeft: 20,
        marginTop: 10,
        fontSize: 28,
        fontWeight: 'bold',
    },
    fiatContainer: {
        flexDirection: 'row',
        height: 50,
        alignItems: 'center',
        paddingHorizontal: 10,
    },
    buttonContainer: {
        height: 70,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 10,
        marginTop: 10,
    },
    cameraContainer: {
        margin: 10,
        backgroundColor: 'black',
        height: 500,
    },
    confirmTx: {
        width: '100%',
    },
    confirmTxItem: {
        height: 40,
        width: '100%',
        marginVertical: 5,
        paddingHorizontal: 10,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    middleHeader: {
        flex: 1,
    },
    max: {
        textTransform: 'capitalize',
        fontWeight: 'bold',
    },
    totalOfferAmount: {
        color: '#616161',
    },
    confirmTxHeader: {
        height: 50,
        width: '100%',
    },
    confirmTxButton: {
        marginVertical: 10,
        paddingHorizontal: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    gapBackground: {
        height: 50,
        width: '100%',
        position: 'absolute',
        top: 0,
    },
});
