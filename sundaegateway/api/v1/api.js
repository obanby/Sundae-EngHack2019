const express = require("express");
const path = require('path');
const bodyParser = require('body-parser');
const sms = require("../../twilio/sms");
const feelings = require("../../handler/feeling");
const User = require("../../model/user");

const api = express.Router();
api.use(bodyParser.urlencoded({ extended: false }));

// Set static files
api.use(express.static(path.join(__dirname, '../../assets')));

api.use(bodyParser.json());

api.get("/health", (req, res) => {
  sms.send("Hi there", process.env.DEFAULT_PHONE_NUMBER);
  res.end("sundae API status [up]\n")
});

api.post("/sms", (req, res) => {
  var addOn = JSON.parse(req.body.AddOns);
  const score = feelings.sentimentScore(addOn.results.marchex_sentiment.result.result);
  feelings.determinePath(score, req.body.From);
  // do database stuff to store message
  // User.writeUserData(phone, msg);
  res.writeHead(200, { 'Content-Type': 'text/xml' })
  res.end("ok");
});

api.post('/login', (req, res) => {
  User.findUserbyPhone(req.body.phone, (user) => {
    if (user) {
      if (req.body.password == user.password) {
        res.json(' login success');
      } else {
        res.json('login failed');
      } 
    } else {
      res.end('User Not Found');
    }
    
  })
});

api.get('/data', async (req, res, next) => {
  // User.getUserMsg('5199999', (err, data) => {
  //   if (err) {
  //     console.log(err);
  //     res.end();
  //     return;
  //   }
  //   res.json(data);
  // });
  User.getUserMsg('519991990', (data) => {
    let messages = data.val();
    let keys = Object.keys(messages);
    const newMsgs = keys.map((key) => {
      return {
        text: messages[key].text,
        timeStamp: messages[key].timeStamp,
      }
    });
    console.log(newMsgs, '111s');
    res.json(newMsgs);
  });
});


api.get('*', (req, res) => {
  res.sendFile(__dirname, '../../assets/index.html');
});

module.exports = api;
