import React from 'react';
import CommonAPI from '@modules/api/CommonAPI';

export const OrderService = {
    add,
};

async function add(params) {
    const {success, data} = await CommonAPI.post('/api/v1/order', params);
    return {success, data};
}
