const express = require("express");

// TODO: get informatino from enviroment variables
const PORT = 3000;

const app = express();

// TODO: expose static files  && do your web stuff!


app.listen(PORT, () => console.log(`Listing on port ${PORT}`))
