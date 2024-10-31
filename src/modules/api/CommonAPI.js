import axios from 'axios';
import {applicationProperties} from '@src/application.properties';

const instance = axios.create({
    baseURL: applicationProperties.endpoints.app.url,
});
instance.defaults.headers.common.Authorization =
    'Bearer ' + applicationProperties.endpoints.app.token;
const post = async (url, params) => {
    return await instance
        .post(url, params)
        .then(res => {
            return {
                success: true,
                data: res.data,
            };
        })
        .catch(error => {
            console.log(error);
            return {
                success: false,
                data: error,
            };
        });
};
const get = async (url, params) => {
    return await instance
        .get(url, params)
        .then(res => {
            return {
                success: true,
                data: res.data,
            };
        })
        .catch(error => {
            console.log(error + url);
            return {
                success: false,
                data: error,
            };
        });
};
const remove = async (url, config) => {
    return await instance
        .delete(url, config)
        .then(res => {
            return {
                success: true,
                data: res.data,
            };
        })
        .catch(error => {
            console.log(error);
            return {
                success: false,
                data: error,
            };
        });
};
const setAuthorization = token => {
    instance.defaults.headers.common.Authorization = 'Bearer ' + token;
};
const clearAuthorization = () => {
    delete instance.defaults.headers.common.Authorization;
};
const CommonAPI = {
    post,
    get,
    remove,
    setAuthorization,
    clearAuthorization,
};
export default CommonAPI;
