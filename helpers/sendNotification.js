const webPush = require('web-push');

const sendNotification = (subscription, payload) => {
    webPush.sendNotification(subscription, JSON.stringify(payload))
        .then(response => {
            console.log('Notification sent')
        })
        .catch(error => console.error('Error sending notification', error));
};


module.exports = {
    sendNotification
};