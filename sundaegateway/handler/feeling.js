const sentiment = require("../events/sentiment");
const sms = require("../twilio/sms");

const happyPath = [
  "You seem to be feeling positive today. Whats up?",
  "thanks, noted! keep it up!",
  "Here is a quote for you, hope you like it"
]

const sadPath = [
  "You seem that you are upset, would you like to talk about it?",
  "Is there anything else that upseted you today?",
  "I know you love music, here is an event near you",
  "Scorpions: $20 somewhere"
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
  if (smsCount == sadPath.length - 2) {
    sms.send(sadPath[smsCount], pNum);
    sms.send(sadPath[sadPath.length - 1], pNum);
    return;
  }
  async function send() {
    const msg = await getSadPathConversation(smsCount);
    sms.send(msg, pNum);
  }
  send();
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

module.exports = {
  sentimentScore: sentimentScore,
  determinePath: determinePath,
  conversate: conversate
}
