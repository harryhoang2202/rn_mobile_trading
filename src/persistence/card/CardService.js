import React from 'react';
import CommonAPI from '@modules/api/CommonAPI';
import _ from 'lodash';
import {Logs} from '@modules/log/logs';

export const CardService = {
    getCards,
    getBalances,
    getCardTypes,
    getTransactions,
};
async function getTransactions(cardNo) {
    const {data} = await CommonAPI.get(
        '/api/v1/card/transactions/' + cardNo,
        {},
    );
    return {success: true, data};
}
async function getCardTypes() {
    const {data} = await CommonAPI.get('/api/v1/card/type', {});
    return {success: true, data};
}
async function getCards() {
    const {data} = await CommonAPI.get('/api/v1/card', {});
    return {success: true, data};
}
async function getBalances(cards) {
    try {
        const cardBalances = [];
        let requests = [];
        for (let i = 0; i < cards.length; i++) {
            const card = cards[i];
            requests.push(
                CommonAPI.get('/api/v1/card/balance/' + card.cardBulkNo, {}),
            );
        }
        const chunks = _.chunk(requests, 5);
        for (let i = 0; i < chunks.length; i++) {
            const chunk = chunks[i];
            let balances = await Promise.all(chunk);
            for (let index = 0; index < balances.length; index++) {
                const position = i * 5 + index;
                const result = balances[index].data;
                let balance = 0;
                if (result.success === true) {
                    balance = result.message;
                }
                cardBalances.push({...cards[position], cardBalance: balance});
            }
        }
        return {
            success: true,
            data: cardBalances,
        };
    } catch (e) {
        Logs.error(e.message);
        return {
            success: true,
            data: cards,
        };
    }
}
