const sentiment = require("../events/sentiment");
const sms = require("../twilio/sms");

const happyPath = [
  "You seem to be feeling positive today. Whats up?",
  "thanks, noted! keep it up!",
  "Here is a quote for you, hope you like it"
]

function sentimentScore(sentimentScore) {
  return Math.round(sentimentScore);
}

function determinePath(sentimentScore, pNum, smsCount) {
  if (sentimentScore === 1) {
     sentiment.emit("happyPath", pNum, smsCount);
     return true;
  }
  sentiment.emit("sadPath", number);
  return false;
}

sentiment.on("happyPath", (pNum, smsCount)=> {
  sms.send(happyPath[smsCount], pNum);
});

sentiment.on("sadPath", (pNum)=> {
  sms.send("No pain no gain", pNum);
  // pull from recomdatino records
});

function conversate(isHappyPath, pNum ,smsCount) {
  if (isHappyPath) {
    sentiment.emit("happyPath", pNum, smsCount);
  }
}

module.exports = {
  sentimentScore: sentimentScore,
  determinePath: determinePath,
  conversate: conversate
}
