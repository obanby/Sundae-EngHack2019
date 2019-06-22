const express = require("express");
const bodyParser = require('body-parser');
const sms = require("../../twilio/sms");
const feelings = require("../../handler/feeling");

const api = express.Router();
api.use(bodyParser.urlencoded({ extended: false }));

api.get("/health", (req, res) => {
  sms.send("Hi there");
  res.end("sundae API status [up]\n")
});

api.post("/sms", (req, res) => {
  var addOn = JSON.parse(req.body.AddOns);
  const score = feelings.sentimentScore(addOn.results.marchex_sentiment.result.result);
  feelings.determinePath(score, req.body.From);
  // do database stuff to store message
  res.writeHead(200, {'Content-Type': 'text/xml'})
  res.end("ok");
});

module.exports = api;
