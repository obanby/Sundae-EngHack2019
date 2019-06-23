const https = require("https");
const sentiment = require("../events/sentiment");
const sms = require("../twilio/sms");

const happyPath = [
  "You seem to be feeling positive today. Whats up?", "Did you workout today by any chance?",
  "What type of food did you have today?",
  "thanks, noted! keep it up!",
  "Here is a quote for you, hope you like it"
]

const sadPath = [
  "You seem that you are upset, would you like to talk about it?",
  "Is there anything else that upseted you today?",
  "Noted"
]

function sentimentScore(sentimentScore) {
  return Math.round(sentimentScore);
}

function determinePath(sentimentScore, pNum, smsCount) {
  if (sentimentScore === 1) {
     sentiment.emit("happyPath", pNum, smsCount);
     return true;
  }
  sentiment.emit("sadPath", pNum, smsCount);
  return false;
}

sentiment.on("happyPath", (pNum, smsCount)=> {
  if (smsCount > happyPath.length - 1 ) return;
  async function send() {
    const msg = await getHappyConversation(smsCount);
    sms.send(msg, pNum);
  }
  send();
});

sentiment.on("sadPath", (pNum, smsCount)=> {
  // TODO, reset the session
  if (smsCount > sadPath.length) return;
  async function send() {
    try {
      const msg = await getSadPathConversation(smsCount);
      const isSent = await sendAsych(msg, pNum);
    } catch(err) {
      console.log(err);
    }
  }
  send();

  if (smsCount == sadPath.length - 1) {
    getEvent("https://api.meetup.com/2/open_events.json?zip=m4c1t2&time=-1w,1w&amp;status=upcoming&topic=sports&key=2c1b297d4c4c8d91f68d53f1f16")
      .then((result) => {
        sendAsych(`Here is recomendation for sports: ${result.results[0].name}`, pNum)
        .then(_ => {
            getEvent("https://api.meetup.com/2/open_events.json?zip=m4c1t2&time=-1w,1w&amp;status=upcoming&topic=music&key=2c1b297d4c4c8d91f68d53f1f16")
              .then(result => {
                  sendAsych(`Here is a music related one: ${result.results[0].name}`, pNum)
              });
        })
      })
      .catch(err => console.log(err));
  }

});

function conversate(isHappyPath, pNum ,smsCount) {
  if (isHappyPath) {
    sentiment.emit("happyPath", pNum, smsCount);
    return;
  }
  sentiment.emit("sadPath", pNum, smsCount);
}

function getHappyConversation(index) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(happyPath[index])
      }, 0);
    });
}

function getSadPathConversation(index) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(sadPath[index])
    }, 0);
  });
}

function sendAsych(msg, pNum) {
  return new Promise((resolve, reject) => {
    sms.send(msg, pNum);
    resolve(sms);
  });
}

function getEvent(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (resp) => {
      let data = "";

      resp.on("data", (chunk) => data += chunk);
      resp
        .on("end", _ => resolve(JSON.parse(data)))
        .on("error", err => reject(err));
    });
  });
}

module.exports = {
  sentimentScore: sentimentScore,
  determinePath: determinePath,
  conversate: conversate
}
