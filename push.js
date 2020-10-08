const webPush = require('web-push');
 
const vapidKeys = {
   "publicKey": "BL56IBIPZKPGR45WELzjsgNuXQwS2RdUByao1VvZ2XtyufB6UTiZoALTpODyC44fKzkjnxxoO88_SedmmDL7GOo",
   "privateKey": "zjzMwasSMQJBe3alQlv4mNtoQUxrDD399oBKFn1cr_Y"
};
 
 
webPush.setVapidDetails(
   'mailto:example@yourdomain.org',
   vapidKeys.publicKey,
   vapidKeys.privateKey
)
const pushSubscription = {
   "endpoint": "https://fcm.googleapis.com/fcm/send/fFwDUuG2i7s:APA91bFh8yXKycNEXPw9crM5DoOQIkP02TdZ9HL0P1NhwCcis7oZhc8iCQzxQxhzH7NHQq1JMnDkJXEzmbzD_Onnh7CWjIw5Vr19HB-HsBWou3xUCxwYGmYg-pjL1BiZJxfCnSplrWY_",
   "keys": {
       "p256dh": "BNZ6b54iSl8goccKqs7jLy3BytuVGsnCD7A1WLV2CyfSktVHvUlksnaLHfidqmiGIHyf0InKgRec1SM2tEiN1og=",
       "auth": "AbPoNoybc7TuIlO3ttxAMg=="
   }
};
const payload = "Hot Match: Arsenal FC VS Liverpool FC at 2020-07-15T19:00:00Z, Support your favorite team, don't miss it.";
 
const options = {
   gcmAPIKey: '1018983067630',
   TTL: 60
};
webPush.sendNotification(
   pushSubscription,
   payload,
   options
);
