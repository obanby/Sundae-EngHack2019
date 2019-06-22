const express = require("express");
const session = require('express-session');
const path = require('path');
const bodyParser = require('body-parser');
const sms = require("../../twilio/sms");
const feelings = require("../../handler/feeling");
const User = require("../../model/user");

const api = express.Router();
api.use(session({secret: process.env.SESSIONSECRET}));

api.use(bodyParser.urlencoded({ extended: false }));
api.use(bodyParser.json());

// Set static files
api.use(express.static(path.join(__dirname, '../../assets')));

api.get("/health", (req, res) => {
  sms.send("Hi there", process.env.DEFAULT_PHONE_NUMBER);
  res.end("sundae API status [up]\n")
});

api.post("/sms", (req, res) => {
  const smsCount = req.session.counter || 0;
  let isHappyPath = true;

  if (smsCount > 0) {
    feelings.conversate(isHappyPath, req.body.From , smsCount);
  } else {
    // First message intiae the convorsation and establish path
    var addOn = JSON.parse(req.body.AddOns);
    const score = feelings.sentimentScore(addOn.results.marchex_sentiment.result.result);
    isHappyPath = feelings.determinePath(score, req.body.From, smsCount);
  }

  const date = new Date();
  const msg = {
    text: req.body.Body,
    timeStamp: `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
  }
  User.writeUserData(req.body.From, msg)
  .then(_ => {
    res.writeHead(200, { 'Content-Type': 'text/xml' })
    res.end("ok");
  })
  .catch(_ => {
    res.writeHead(500, { 'Content-Type': 'text/xml' })
    res.end("error");
  });
  req.session.counter = smsCount + 1;
});

api.post('/login', (req, res) => {
  User.findUserbyPhone(req.body.phone)
  .then(user => {
    if (user) {
      (req.body.password == user.password) ? res.json(' login success') : res.json('login failed');
    } else {
      res.end('User Not Found');
    }
  })
  .catch(err => console.error(err));
});

api.get('/data/:id', (req, res, next) => {
  User.getUserMsgs('519991990')
  .then(result => {
    console.log(result);
    res.json(result);
  })
  .catch(err => console.error(err));
});

api.get('*', (req, res) => {
  res.sendFile(__dirname, '../../assets/index.html');
});

module.exports = api;
