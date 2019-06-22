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
  "Noted, here are some recomendations"
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
    //getting recommendation
    //var meetup = 'https://api.meetup.com/2/open_events.xml?zip=m4c1t2&time=-1w,1w,&amp;status=upcoming&key=ABDE12456AB2324445';
    const https = require("https");
    https.get("https://api.meetup.com/2/open_events.json?zip=m4c1t2&time=-1w,1w&amp;status=upcoming&topic=sports&key=2c1b297d4c4c8d91f68d53f1f16", (result) => console.log(result));
    
    // Get bunch of api values and send them sequentially
    sms.send("Here is recomendation for sports", result.name);
    const https = require("https");
    https.get("https://api.meetup.com/2/open_events.json?zip=m4c1t2&time=-1w,1w&amp;status=upcoming&topic=music&key=2c1b297d4c4c8d91f68d53f1f16", (result) => console.log(result));
    
    sms.send("Here is a music related one", result.name);
    
    const https = require("https");
    https.get("https://api.meetup.com/2/open_events.json?zip=m4c1t2&time=-1w,1w&amp;status=upcoming&key=2c1b297d4c4c8d91f68d53f1f16", (result) => console.log(result));
    
    sms.send("Here is a random event that could be fun to cheer you up!", result.name);
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
