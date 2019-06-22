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

api.get("/health", (req, res) => {
  sms.send("Hi there", process.env.DEFAULT_PHONE_NUMBER);
  res.end("sundae API status [up]\n")
});

api.post("/sms", (req, res) => {
  if (req.body.Body.toLowerCase() === "end") {
    req.session.counter = 0;
    req.session.isHappyPath = true;
    res.writeHead(200, { 'Content-Type': 'text/xml' })
    res.end("ok");
    return;
  }

  if (req.body.Body.toLowerCase() === "start") {
    res.end("ok");
    return;
  }
  const smsCount = req.session.counter || 0;
  let isHappyPath = req.session.isHappyPath;
  if (smsCount > 0) {
    feelings.conversate(isHappyPath, req.body.From , smsCount);
  } else {
    // First message intiae the convorsation and establish path
    var addOn = JSON.parse(req.body.AddOns);
    const score = feelings.sentimentScore(addOn.results.marchex_sentiment.result.result);
    req.session.isHappyPath = feelings.determinePath(score, req.body.From, smsCount);
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
      (req.body.password == user.password) ? console.log(' login success') : res.json('login failed');
      User.getUserMsgs(user.phone)
      .then((messages) => {
        res.render('dashboard', {
          user: user,
          messages,
        })
      })
    } else {
      res.end('User Not Found');
    }
  })
  .catch(err => console.error(err));
});

api.post('/register', (req, res) => {
  User.signUpUser(req.body.phone, req.body.name, req.body.location, req.body.password)
  .then(() => {
    console.log('registered');
    sms.send(`Thank you for joining Sundae. Feel free to text us anytime to journal your day or vent :D Here is how to use. Text us and when you are done send "end" and we will start a new journal for you.`,req.body.phone);
  })
  .catch(err => console.error(err));
});

// Welcome Page
api.get('/', (req, res) => res.render('welcome'));

// Dashboard
api.get('/dashboard', (req, res) =>
  res.render('dashboard', {
    user: req.user
  })
);

// Login Page
api.get('/login', (req, res) => res.render('login'));

// Register Page
api.get('/register', (req, res) => res.render('register'));

// Logout
api.get('/logout', (req, res) => {
  // req.logout();
  res.redirect('/api/v1/login');
});

api.get('/data/:phone', (req, res, next) => {
  User.getUserMsgs('519991990')
  .then(result => {
    console.log(result);
    res.json(result);
  })
  .catch(err => console.error(err));
});

// api.get('*', (req, res) => {
//   res.sendFile(__dirname, '../../assets/index.html');
// });

module.exports = api;
