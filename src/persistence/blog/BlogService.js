import React from 'react';
import CommonAPI from '@modules/api/CommonAPI';

export const BlogService = {
    list,
};

async function list(config) {
    const {success, data} = await CommonAPI.get('/api/v1/blog', config);
    return {success, data};
}
