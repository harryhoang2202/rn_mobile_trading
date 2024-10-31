import {BlogService} from '@persistence/blog/BlogService';
import {getBlogsSuccess} from '@persistence/blog/BlogReducer';

export const BlogAction = {
    getBlogs,
};

function getBlogs() {
    return async dispatch => {
        const {success, data} = await BlogService.list({});
        if (success === true) {
            dispatch(getBlogsSuccess(data));
        }
        return {success, data};
    };
}
