const sentiment = require("../events/sentiment");
const sms = require("../twilio/sms");

function sentimentScore(sentimentScore) {
  return Math.round(sentimentScore);
}

function determinePath(sentimentScore, number) {
  (sentimentScore === 1) ? sentiment.emit("happyPath", number) : sentiment.emit("sadPath", number) ;
}

sentiment.on("happyPath", (pNum)=> {
  sms.send("Happy path begin babe! lets get wilding", pNum);
});

sentiment.on("sadPath", (pNum)=> {
  sms.send("No pain no gain", pNum);
});

module.exports = {
  sentimentScore: sentimentScore,
  determinePath: determinePath
}
