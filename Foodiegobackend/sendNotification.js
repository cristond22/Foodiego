require('dotenv').config();
const admin = require('firebase-admin');

admin.initializeApp({
  credential: admin.credential.cert({
    type: process.env.FIREBASE_TYPE,
    project_id: process.env.FIREBASE_PROJECT_ID,
    private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
    private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    client_email: process.env.FIREBASE_CLIENT_EMAIL,
    client_id: process.env.FIREBASE_CLIENT_ID,
  }),
});

const messaging = admin.messaging();

// Example FCM Token and message
const registrationToken = 'cuqNXOffKHhnD9hGR0aCTM:APA91bFdzzCO3eidhX54oWU-LVkEIIULGWSCI1v0kvm_obLBxWzBV_9zzRlNoMqpl3XUBh6uxg3JkfORXYy09mPZPsDgb8BOOPvISXSXiC3ufaNCLm1f_KY';

const message = {
  token: registrationToken,
  notification: {
    title: '🔥 Foodiego Alert!',
    body: 'Your order is being cooked now!',
  },
};

messaging
  .send(message)
  .then((response) => {
    console.log('✅ Successfully sent message:', response);
  })
  .catch((error) => {
    console.error('❌ Error sending message:', error);
  });
