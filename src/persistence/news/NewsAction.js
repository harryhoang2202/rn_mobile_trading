import {getNewsSuccess} from '@persistence/news/NewsReducer';
import {NewsService} from '@persistence/news/NewsService';

export const NewsAction = {
    getNews,
};

function getNews() {
    return async dispatch => {
        const {success, data} = await NewsService.list({});
        if (success === true) {
            dispatch(getNewsSuccess(data));
        }
        return {success, data};
    };
}
