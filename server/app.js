//--------------- dependencies ----------------//

require("dotenv").config();
const path = require("path");
const express = require("express");
const cookieParser = require("cookie-parser");
const serve = require("./modules/static-routing/serve");
// routers
const api = require("./routers/api");
const adminRouter = require("./routers/admin/adminRouter");
// mail
require("./modules/mail/bot/mail-bot");
// analytics
const webAnalytics = require("./modules/analytics/middleware");

//--------------- server init ----------------//

const app = express();
app.use(express.json(), cookieParser(), serve("../portfolio/build"), webAnalytics());

//--------------- routers connection ----------------//

app.use("/api", api);
app.use("/admin", adminRouter);

//--------------- route creation ----------------//

app.get("/", (req, res) => res.sendFile(path.resolve("../portfolio/build/index.html")));

//--------------- starting sever ----------------//

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`\nListening on port ${PORT}... ${new Date().toUTCString()}\n`);
});
