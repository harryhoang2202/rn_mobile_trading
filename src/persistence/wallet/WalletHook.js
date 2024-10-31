import {useEffect, useState} from 'react';
import {useSelector} from 'react-redux';
import _ from 'lodash';
import {vcoin} from '@modules/core/constant/constant';

export default function useWalletHook() {
    const {activeWallet} = useSelector(state => state.WalletReducer);
    const [wallets, setWallets] = useState({});
    const [vCoin, setVCoin] = useState({});
    useEffect(() => {
        const walletObject = {};
        _.forEach(
            [...activeWallet.coins, ...activeWallet.tokens],
            function (item) {
                walletObject[item.id] = item;
            },
        );
        setWallets(walletObject);
        setVCoin(walletObject[vcoin.id]);
    }, [activeWallet.coins, activeWallet.tokens]);

    return {
        wallets,
        vcoin: vCoin,
    };
}
export function useWalletList() {
    const {activeWallet} = useSelector(state => state.WalletReducer);
    const [wallets, setWallets] = useState([]);
    useEffect(() => {
        const orderedWallets = _.orderBy(
            [...activeWallet.coins, ...activeWallet.tokens],
            ['order', 'id'],
            ['asc', 'desc'],
        );
        console.log(orderedWallets);
        setWallets(orderedWallets);
    }, [activeWallet.coins, activeWallet.tokens]);

    return {
        wallets,
    };
}
