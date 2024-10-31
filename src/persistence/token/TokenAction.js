import {getAllTokensSuccess} from '@persistence/token/TokenReducer';
import {TokenService} from '@persistence/token/TokenService';

export const TokenAction = {
    getAllTokens,
};

function getAllTokens() {
    return async dispatch => {
        const {success, data} = await TokenService.getAllTokens();
        if (success === true) {
            dispatch(getAllTokensSuccess(data));
        }
        return {success, data};
    };
}
