import CommonAPI from '@modules/api/CommonAPI';

async function list() {
    const {success, data} = await CommonAPI.get('/api/v1/price-alert');
    return {success, data};
}

async function add(params) {
    const {success, data} = await CommonAPI.post('/api/v1/price-alert', params);
    return {success, data};
}

async function saveOrder(params) {
    const {success, data} = await CommonAPI.post(
        '/api/v1/price-alert/order',
        params,
    );
    return {success, data};
}

async function remove(id) {
    const {success, data} = await CommonAPI.remove(
        '/api/v1/price-alert/' + id,
        {},
    );
    return {success, data};
}

async function getCoinList() {
    const {success, data} = await CommonAPI.get('/content/price_alert.json');
    return {success, data};
}

export const PriceAlertService = {
    list,
    add,
    remove,
    getCoinList,
    saveOrder,
};
