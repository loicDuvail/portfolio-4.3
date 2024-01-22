const pool = require("../modules/DB/DB-cnx");
const { getFilesIn } = require("../modules/mail/bot/utils/utils");
const path = require("path");
const fs = require("fs");

function init() {
  const sqlFiles = getFilesIn(path.join(__dirname, "./SQL"));
  sqlFiles.forEach((sqlFile) => {
    let sql = fs.readFileSync(sqlFile).toString();
    pool.query(sql, (err, info) => {
      if (err) return console.error(err);
      console.log(info);
    });
  });
}

module.exports = init;