import {
    getUserSuccess,
    signInSuccess,
    signOutSuccess,
} from '@persistence/user/UserReducer';
import {UserService} from '@persistence/user/UserService';
import {StorageUtil} from '@modules/core/util/StorageUtil';

export const UserAction = {
    get,
    signIn,
    signOut,
};

function get() {
    return async dispatch => {
        const user = await UserService.get();
        dispatch(getUserSuccess(user));
        return user;
    };
}

function signIn(params) {
    return async dispatch => {
        const {success, data} = await UserService.signIn(params);
        dispatch(signInSuccess(data));
        return {success, data};
    };
}

function signOut() {
    return async dispatch => {
        await StorageUtil.clear();
        const {success, data} = await UserService.signOut();
        dispatch(signOutSuccess());
    };
}
