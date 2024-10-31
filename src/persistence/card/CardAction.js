import {FeeService} from '@persistence/fee/FeeService';
import {getFeeSuccess} from '@persistence/fee/FeeReducer';
import {CardService} from '@persistence/card/CardService';
import {
    getCardsSuccess,
    getCardTypesSuccess,
} from '@persistence/card/CardReducer';

export const CardAction = {
    getCards,
    getBalances,
    getCardTypes,
};
function getCardTypes() {
    return async dispatch => {
        const {success, data} = await CardService.getCardTypes();
        if (success) {
            dispatch(getCardTypesSuccess(data));
        }
        return {success, data};
    };
}
function getCards() {
    return async dispatch => {
        const {success, data} = await CardService.getCards();
        if (success) {
            dispatch(getCardsSuccess(data));
        }
        return {success, data};
    };
}
function getBalances(cards) {
    return async dispatch => {
        const {success, data} = await CardService.getBalances(cards);
        if (success) {
            dispatch(getCardsSuccess(data));
        }
        return {success, data};
    };
}
