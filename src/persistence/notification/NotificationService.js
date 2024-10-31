import CommonAPI from '@modules/api/CommonAPI';

export const NotificationService = {
    toggleSubscribe,
};

async function toggleSubscribe(allowNotification) {
    return await CommonAPI.post('/api/v1/notification/subscribe', {
        allowNotification: allowNotification,
    });
}
