const express = require("express");
const path = require("path");
const table = require("../modules/DB/table");
const pool = require("../modules/DB/DB-cnx");

const api = express.Router();
api.use(table("projects"));

api.get("/px:id", (req, res) => {
  const { id } = req.params;
  pool.query(`UPDATE recipients SET count = count + 1 WHERE routeIdentifier = ${id}`, (err, result) => {
    if (err) return console.error(err);
  });
  res.sendFile(path.join(__dirname, "../modules/mail/bot/assets/1x1.png"));
});

module.exports = api;
