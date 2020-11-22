require('dotenv').config();

const Amadeus = require("amadeus");
const amadeus = new Amadeus({
  clientId: process.env.development.AMADEUS_API_KEY,
  clientSecret: process.env.development.AMADEUS_API_SECRET
});

// Recommended locations similar to PAR
amadeus.referenceData.recommendedLocations.get({
    cityCodes: 'PAR',
    travelerCountryCode: 'FR'
}).then(function(response) {
    console.log(response.data);
}).catch((error) => {
    console.log("Error");
    done();
});

const sendText = (body, to) => {

const accountSid = process.env.accountSid;
const authToken = process.env.authToken;
const from = process.env.fromNumber;
const client = require('twilio')(accountSid, authToken);


return client.messages.create({body, from, to})
.then(response => console.log(response.body))
};


const sendTextToAdmin = (order_id) => {

  const adminNumber = process.env.adminNumber;

  let msg = `
  You have received an order!
  Please check the admin side and confirm the order.
  Order ID is: ${order_id}
  `;

  return sendText(msg, adminNumber)

}


module.exports = {
  sendText,
  sendTextToAdmin
};






const { updateOrderOnPickup } = require('../server/database');

require('dotenv').config();

const sid = process.env.TWILIO_SID;
const token = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(sid, token);
const phoneNumber = '+12898073394';

const sendText = function(message, number, timeToSend, orderId) {
  if (timeToSend) {
    setTimeout(function(){
      return client.messages.create({
      body: `${message}`,
      to: `${number}`,  // Text this number
      from: phoneNumber // From a valid Twilio number
      })
      .then((message) => console.log(message.sid))
      .then(() => updateOrderOnPickup(orderId));
    }, timeToSend * 60000);
  } else {
    return client.messages.create({
      body: `${message}`,
      to: `${number}`,  // Text this number
      from: phoneNumber // From a valid Twilio number
      })
  }
};
exports.sendText = sendText;