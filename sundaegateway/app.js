const express = require("express");
const api = require("./api/v1/api");

// TODO: get informatino from enviroment variables
const PORT = 3000;

const app = express();

// TODO: expose static files  && do your web stuff!

app.use("/api/v1", api);

app.listen(PORT, () => console.log(`Listing on port ${PORT}`))
