const express = require("express");

const api = express.Router();

api.get("/health", (req, res) => {
  res.end("sundae API status [up]\n")
});



module.exports = api;
