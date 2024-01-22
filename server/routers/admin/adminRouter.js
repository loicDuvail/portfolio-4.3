const express = require("express");
const path = require("path");
const auth = require("../../modules/auth/auth");
const SHA256 = require("../../modules/utils/SHA256");
const Time = require("../../modules/utils/Time");
const serve = require("../../modules/static-routing/serve");
const { report } = require("../../modules/mail/mailer");
const table = require("../../modules/DB/table");
const mailAnalytics = require("../../modules/mail/bot/analytics/middleware");

const dbInterface = require("./DB-interface");

const adminRouter = express.Router();

//--------------- auth settings ----------------//

const passwordVerifier = (req) => SHA256(req.body.password || 0) === process.env.HASH;

const sessionContent_callback = (req, sessionManager) => new Object({ userName: "admin" });

// blocks the route for <blockTime> ms
function timeFilter(blockTime) {
  let currentTime = Date.now();
  return (filter = (req, res, filters) => {
    let elapsedTime_ms = Date.now() - currentTime;
    let remainingTime = blockTime - elapsedTime_ms;

    if (elapsedTime_ms > blockTime) {
      filters.splice(filters.indexOf(filter), 1);
      return true;
    }

    res.send({
      msg: `Route blocked because too many failed connection attempts, try again in ${new Date(
        remainingTime
      ).getMinutes()}min ${new Date(remainingTime % 60_000).getSeconds()}s`,
    });

    return false;
  });
}

let failedCnxs = [];
const onFailedCnx = (req, res, filters) => {
  //------ error message ------//
  if (!req.body.password) res.status(401).send({ msg: "Missing password from request body." });
  else res.status(401).send({ msg: "Invalid password" });

  failedCnxs.push({ password: req.body.password, date: Date.now() });
  failedCnxs = failedCnxs.filter((cnx) => Date.now() - cnx.date < Time.min(5).to("ms"));

  //------ security alert and route blocking if too many failed cnx attempts ------//

  let maxFailedAttemps = 5;
  if (failedCnxs.length < maxFailedAttemps) return;

  // block the login route for 5 mins
  filters.push(timeFilter(Time.min(5).to("ms")));

  // send security alert
  return report({
    subject: "Security alert",
    text:
      "Too many failed connection attempts:\n\n" +
      failedCnxs.map((cnx) => `password: "${cnx.password}", date: ${new Date(cnx.date).toUTCString()}\n\n`),
  });
};

const authOptions = {
  sessionManager: { name: "Admin" },
  fallbackRoute: "/admin/login",
};

//--------------- securing adminRouter ----------------//

adminRouter.use(auth(passwordVerifier, sessionContent_callback, onFailedCnx, authOptions));

//--------------- auto routing ----------------//

adminRouter.use(
  serve("../admin"),
  table("projects", {
    methods: { get: false, post: true, update: true, delete: true },
  })
);

//--------------- manual routing ----------------//

adminRouter.get("/", (req, res) => {
  res.sendFile(path.resolve("../admin/home/index.html"));
});

adminRouter.get("/login", (req, res) => {
  res.sendFile(path.resolve("../admin/login/login.html"));
});

//--------------- db router connection ----------------//

adminRouter.use("/DB", dbInterface);

//--------------- get mail views  ----------------//

adminRouter.use(mailAnalytics);

//--------------- router export ----------------//

module.exports = adminRouter;
