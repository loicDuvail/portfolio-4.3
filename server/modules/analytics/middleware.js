function webAnalytics(pool = require("../DB/DB-cnx")) {
  return function mailAnalyticsMiddleware(req, res, next) {
    let ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
    if (req.path === "/") pool.query(`INSERT INTO webAnalytics (date, ip, route) VALUES ("${Date.now()}", "${ip}", "${req.path}")`);
    next();
  };
}

module.exports = webAnalytics;
