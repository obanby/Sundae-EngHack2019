const express = require("express");
const api = require("./api/v1/api");

require('dotenv').config();

// TODO: expose static files  && do your web stuff!

const app = express();


app.use("/api/v1", api);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Listing on port ${PORT}`))
