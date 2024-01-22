const pool = require("./DB-cnx");
const { merge, copy } = require("../utils/deep");

const defaultOptions = {
  methods: { get: true, post: false, update: false, delete: false },
};

let tables = {};

/**
 * creates a middleware that has premade routes for db table methods
 * @param {string} tableName
 * @param options
 * @returns middleware
 */
function table(tableName, options = defaultOptions) {
  options = merge(copy(defaultOptions), options);
  let routes = getTableRoutes(tableName, options);
  console.log(routes);
  //------//

  getTableFields(tableName).then((fields) => (tables[tableName] = fields));
  return function tableMiddleware(req, res, next) {
    let route = routes.find(
      (route) =>
        route.path === req.path && route.method.toLowerCase().replace("update", "put") === req.method.toLowerCase()
    );
    //------//

    if (!route) return next();
    methodsDic[route.method](tableName, req, res);
  };
}

function getTableRoutes(tableName, options) {
  let routes = [];
  let m = options.methods;
  //------//

  for (const key in m) {
    if (m[key]) routes.push({ path: `/${key}_${tableName}`, method: key });
  }
  return routes;
}

async function getTableFields(tableName) {
  return new Promise((resolve, reject) => {
    pool.query(`SHOW COLUMNS FROM ${tableName}`, (err, data) => {
      if (err) return reject(err);
      resolve(data);
    });
  });
}

const methodsDic = {
  get,
  post,
  update,
  delete: deleteItem,
};

function get(tableName, req, res) {
  let PK_field = tables[tableName].filter((field) => field.Key === "PRI").map((field) => field.Field);
  const id = req.body[PK_field];

  if (!id)
    return pool.query(`SELECT * FROM ${tableName}`, (err, data) => {
      if (err) return res.status(500).send({ msg: err });
      return res.send(data);
    });

  pool.query(`SELECT * FROM ${tableName} WHERE ${PK_field}=${id}`, (err, data) => {
    if (err) return res.status(500).send({ msg: err });
    return res.send(data);
  });
}

function post(tableName, req, res) {
  let fields = tables[tableName].filter((field) => field.Key != "PRI").map((field) => field.Field);

  let missingFields = [];
  fields.forEach((field) => {
    req.body[field] || missingFields.push(field);
  });

  if (missingFields[0])
    return res.status(400).send({
      msg: `Missing column values in request body.\n ${missingFields.map((field) => `->${field}\n`)}`,
    });

  let query = `INSERT INTO ${tableName} (${fields}) VALUES (${fields.map((field) => `"${req.body[field]}"`)});`;

  pool.query(query, (err, data) => {
    if (err) return res.status(500).send({ msg: err });
    res.send({ msg: "Successful DB insertion." });
  });
}

function update(tableName, req, res) {
  let PK_field = tables[tableName].filter((field) => field.Key === "PRI").map((field) => field.Field);
  if (!req.body[PK_field]) return res.status(400).send({ msg: `Missing '${PK_field}' in request body.` });

  let fields = tables[tableName].filter((field) => field.Key != "PRI").map((field) => field.Field);

  let toUpdate = Object.keys(req.body)
    .filter((key) => fields.some((field) => field.toLowerCase() === key.toLowerCase()))
    .map((key) => new Object({ field: key, value: req.body[key] }));

  if (!toUpdate[0]) return res.status(400).send({ msg: "No fields to update where found in request body." });

  let query = `UPDATE ${tableName} SET${toUpdate.map(
    (newProp) => ` ${newProp.field} = '${newProp.value.replace(/'/g, "\\'")}'`
  )} WHERE ${PK_field} = ${req.body[PK_field]}`;

  pool.query(query, (err, data) => {
    if (err) return res.status(500).send({ msg: err });
    return res.send({ msg: `Successful update of ${tableName} where ${PK_field}=${req.body[PK_field]}.\n` + data });
  });
}

function deleteItem(tableName, req, res) {
  let PK_field = tables[tableName].filter((field) => field.Key === "PRI").map((field) => field.Field);

  let id = req.body[PK_field];
  if (!id) return res.status(400).send({ msg: `Missing "${PK_field}" from request body` });

  let query = `DELETE FROM ${tableName} WHERE ${PK_field} = ${id}`;

  pool.query(query, (err, data) => {
    if (err) return res.status(500).send({ msg: err });

    res.send({ msg: `Successful item deletion:\ntable: ${tableName}\n${PK_field}: ${id} ` });
  });
}

module.exports = table;
