const express = require("express");
const path = require("path");
const table = require("../modules/DB/table");
const pool = require("../modules/DB/DB-cnx");
const {report} = require('../modules/mail/mailer');

const api = express.Router();
api.use(table("projects"));

api.post('/sendMail', (req, res)=>{
  const {from, name,subject, message} = req.body;
  const text = `
  from: ${name} (${from})
  ----------------------------
  
  ${message}`;
  report({subject,text}).then(()=>res.send({ok:"ok"})).catch(err=>res.send({err}));
})

api.get("/px:id", (req, res) => {
  const { id } = req.params;
  pool.query(`UPDATE recipients SET count = count + 1 WHERE routeIdentifier = ${id}`, (err, result) => {
    if (err) return console.error(err);
  });
  res.sendFile(path.join(__dirname, "../modules/mail/bot/assets/1x1.png"));
});

module.exports = api;
