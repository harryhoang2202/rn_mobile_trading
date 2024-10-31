import {PriceAlertService} from '@persistence/pricealert/PriceAlertService';
import {
    addPriceAlertSuccess,
    getCoinListSuccess,
    getPriceAlertListSuccess,
    removePriceAlertSuccess,
} from '@persistence/pricealert/PriceAlertReducer';

export const PriceAlertAction = {
    list,
    add,
    remove,
    getCoinList,
};

function getCoinList() {
    return async dispatch => {
        const {success, data} = await PriceAlertService.getCoinList();
        if (success === true) {
            dispatch(getCoinListSuccess(data));
        }
        return {success, data};
    };
}

function list() {
    return async dispatch => {
        const {success, data} = await PriceAlertService.list();
        if (success === true) {
            dispatch(getPriceAlertListSuccess(data));
        }
        return {success, data};
    };
}

function add(priceAlert) {
    return async dispatch => {
        const {success, data} = await PriceAlertService.add(priceAlert);
        if (success === true) {
            dispatch(addPriceAlertSuccess(data));
        }
        return {success, data};
    };
}

function remove(id) {
    return async dispatch => {
        const {success, data} = await PriceAlertService.remove(id);
        if (success === true) {
            dispatch(removePriceAlertSuccess(id));
        }
        return {success, data};
    };
}
