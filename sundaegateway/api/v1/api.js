const express = require("express");
const bodyParser = require('body-parser');
const sms = require("../../twilio/sms");

const api = express.Router();
api.use(bodyParser.urlencoded({ extended: false }));

api.get("/health", (req, res) => {
  sms.send("Hi there");
  res.end("sundae API status [up]\n")
});

api.post("/sms", (req, res) => {
  var addOn = JSON.parse(req.body.AddOns);
  const sentimentScore = addOn.results.marchex_sentiment.result.result;
  const twiml = sms.messageResponse();
  twiml.message(req.body.Body);
  res.writeHead(200, {'Content-Type': 'text/xml'})
  res.end(twiml.toString());
});

module.exports = api;
