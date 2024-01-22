const express = require("express");
const path = require("path");
const serve = require("../../modules/static-routing/serve");

let dbInterface = express.Router();
dbInterface.use(serve("./modules/DB/DB-interface"));
dbInterface.get("/", (req, res) => {
  res.sendFile(path.resolve("./modules/DB/DB-interface/index.html"));
});

module.exports = dbInterface;
