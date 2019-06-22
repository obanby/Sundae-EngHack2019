const accountSid = process.env.TWILIO_ACCOUNTSID;
const authToken  = process.env.TWILIO_AUTHTOKEN;

const client = require("twilio")(accountSid, authToken);
const MessagingResponse = require("twilio").twiml.MessagingResponse;

async function send(msg, number) {
  try {
    const msgId  = await client.messages.create({
        to:   number,
        from: "+16474902192",
        body: msg
      });
  } catch(err) {
    console.log(`error occured ${err}`)
  }
}

function messageResponse() {
  return  (new MessagingResponse);
}

module.exports = {
  send: send,
  messageResponse: messageResponse
}
