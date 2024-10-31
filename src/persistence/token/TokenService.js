import CommonAPI from '@modules/api/CommonAPI';

export const TokenService = {
    getAllTokens,
};

async function getAllTokens() {
    const {success, data} = await CommonAPI.get('/content/tokens.json');
    return {success, data};
}
