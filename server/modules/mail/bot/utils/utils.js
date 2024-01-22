const fs = require("fs");
const path = require("path");
const pool = require("../../../DB/DB-cnx");
const { v4 } = require("uuid");

function fill(filePath, content = { date: new Date() }) {
  fileContent = fs.readFileSync(filePath).toString();
  fileContent = eval(`\`${fileContent}\``);
  return fileContent;
}

function getFilesIn(absPath, files = []) {
  fs.readdirSync(absPath).forEach((file) => {
    let absFilePath = path.join(absPath, file);
    if (!fs.statSync(absFilePath).isDirectory()) files.push(absFilePath);
    else getFilesIn(absFilePath, files);
  });
  return files;
}

function getSuffix(fileName) {
  return fileName.substring(fileName.lastIndexOf("."));
}

function getFileName(filePath) {
  filePath = filePath.replace(/\\/g, "/");
  return filePath.substring(filePath.lastIndexOf("/"));
}

function getRecipientsFromDB() {
  return new Promise((resolve, reject) => {
    pool.query(`SELECT * FROM recipients`, (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
}

function insertNewRecipientInDB(recipient = { email: "example@gmail.com", routeIdentifier: "some string" }) {
  const { email, routeIdentifier } = recipient;
  return new Promise((resolve, reject) => {
    pool.query(
      `INSERT INTO recipients (email, routeIdentifier) VALUES ("${email}","${routeIdentifier}")`,
      (err, res) => {
        if (err) return reject(err);
        resolve(res);
      }
    );
  });
}

function getEmailRouteIdentifier(email) {
  return new Promise((resolve, reject) => {
    pool.query(`SELECT routeIdentifier FROM recipients WHERE email = "${email}"`, (err, res) => {
      if (err) return reject(err);
      if (res[0] && res[0].routeIdentifier) return resolve(res[0].routeIdentifier);

      let routeIdentifier = v4();

      insertNewRecipientInDB({ email, routeIdentifier })
        .then(() => resolve(routeIdentifier))
        .catch((err) => reject(err));
    });
  });
}

module.exports = { fill, getFilesIn, getSuffix, getFileName, getEmailRouteIdentifier, getRecipientsFromDB };
