import React from 'react';
import CommonAPI from '@modules/api/CommonAPI';

export const NewsService = {
    list,
};

async function list(config) {
    const {success, data} = await CommonAPI.get('/api/v1/news', config);
    return {success, data};
}
