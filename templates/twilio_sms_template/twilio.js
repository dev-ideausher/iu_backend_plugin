require('dotenv').config();

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;

const sendSms = async (phone, message) => {
  const client = require('twilio')(accountSid, authToken);
  client.messages
    .create({
       body: message,
       from: process.env.TWILIO_PHONE_NUMBER,
       to: "+919648666718"
     })
    .then(message => console.log(message.sid));
}

module.exports = sendSms;