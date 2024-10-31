import React from 'react';
import CommonAPI from '@modules/api/CommonAPI';
import ReduxStore from '@modules/redux/ReduxStore';

export const PriceService = {
    add,
    getCurrentPrice,
};

async function add(coin) {
    const {data} = await CommonAPI.post('/api/v1/public/price', coin);
    return {
        success: true,
        data: data,
    };
}

async function getCurrentPrice(id) {
    return ReduxStore.getState().PriceReducer.prices[id];
}
