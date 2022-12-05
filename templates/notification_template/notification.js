// const NotificationModel = require("../models/notificationModel");
const admin = require("firebase-admin");

exports.sendNotification = async (
  topic,
  reciever,
  title,
  message,
  notificationType,
  notificationTypeId,
  image,
  data={}
) => {
  const messaging = admin.messaging();
  var payload = {
    notification: {
      title,
      body: message,
      image:image,
    },
    "android": {
      priority:"high",
      "notification": {
        "channel_id": "high_importance_channel"
      }
    },
    data:data,
    topic: topic
  };

  messaging.send(payload).then((result) => {
    console.log(result);
  });
//   if(notificationType !== "chat"){
//     await NotificationModel.create({
//       reciever: reciever,
//       title: title,
//       body: message,
//       notificationType: notificationType,
//       notificationTypeId: notificationTypeId,
//     });
//   }
};
