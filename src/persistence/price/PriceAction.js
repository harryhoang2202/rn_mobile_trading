import {getPricesSuccess} from '@persistence/price/PriceReducer';

export const PriceAction = {
    getPrices,
};

function getPrices(data) {
    return async dispatch => {
        dispatch(getPricesSuccess(data));
        return {success: true, data};
    };
}
