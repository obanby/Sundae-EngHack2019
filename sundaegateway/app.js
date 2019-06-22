const express = require("express");
const dotenv = require("dotenv");

const isConfigLoaded = dotenv.config();

if (isConfigLoaded.error) {
  throw result.error
}

const api = require("./api/v1/api");
// TODO: expose static files  && do your web stuff!
const app = express();


app.use("/api/v1", api);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Listing on port ${PORT}`))
