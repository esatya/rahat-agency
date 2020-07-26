const config = require('config');

const accountSid = config.get('services.twilio.accountId');
const authToken = config.get('services.twilio.authToken');
const twilioNumber = config.get('services.twilio.number');
const client = require('twilio')(accountSid, authToken);

function sendSMS(receiver, payload) {
  console.log('sending SMS', receiver);

  client.messages
    .create({
      body: `vendor wants to retrieve ${payload.token} token.
       If you want to continue transaction please share this OTP: ${payload.otp}`,
      from: twilioNumber,
      to: receiver,
    })
    .then((message) => console.log(message.sid))
    .catch((e) => {
      console.log('error', e);
    });
}

module.exports = { sendSMS };
