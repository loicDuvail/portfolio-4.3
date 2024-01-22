const path = require('path');
require('dotenv').config({path:path.join(__dirname, '../../.env')})
const mysql2 = require("mysql2");

let e = process.env;

const poolOptions = {
  host: e.MYSQL_HOST,
  user: e.MYSQL_USER,
  password: e.MYSQL_PASSWORD,
  database: e.MYSQL_DB,
};

const pool = mysql2.createPool(poolOptions);

module.exports = pool;
