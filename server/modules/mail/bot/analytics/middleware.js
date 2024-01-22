const { getRecipientsFromDB } = require("../utils/utils");

function mailAnalyticsMiddleware(req, res, next) {
  if (req.path !== "/getMailsAnalytics") return next();

  getRecipientsFromDB()
    .then((recipients) => {
      res.send(recipients);
    })
    .catch((err) => console.error(err));
}

module.exports = mailAnalyticsMiddleware;
