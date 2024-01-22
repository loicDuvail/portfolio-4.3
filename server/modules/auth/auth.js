const SessionManager = require("./SessionManager");
const { merge, copy } = require("../utils/deep");
const anyMatch = require("anymatch");

let defaultOptions = {
  sessionManager: {
    name: "manager",
    ...SessionManager.defaultOptions,
  },
  unprotectedRoutes: [{ path: "/login/**", method: "GET" }],
  fallbackRoute: "/",
};

function auth(
  verifier = (req) => false,
  sessionContent_callback = (req, sessionManager) => new Object({ userName: "user" }),
  onFailedCnx = (req, res) => {},
  options = defaultOptions
) {
  options = merge(copy(defaultOptions), options);

  const sessionManager = new SessionManager(options.sessionManager.name, options.sessionManager);

  return function authMiddleware(req, res, next) {
    if (isUnprotected(req, options.unprotectedRoutes)) return next();

    if (
      !sessionManager.sessionExists(req.cookies.sessionId) &&
      req.path === "/login" &&
      req.method.toLowerCase() === "post"
    )
      return login(req, res, sessionManager, verifier, sessionContent_callback, onFailedCnx);

    if (
      sessionManager.sessionExists(req.cookies.sessionId) &&
      req.path === "/logout" &&
      req.method.toLowerCase() === "post"
    )
      return logout(req, res, sessionManager);

    const { sessionId } = req.cookies;
    if (!sessionId) return res.redirect(options.fallbackRoute);

    if (sessionManager.sessionExists(sessionId)) return next();

    return res.redirect(options.fallbackRoute);
  };
}

function isUnprotected(req, unprotectedRoutes) {
  return unprotectedRoutes.some(
    (route) => anyMatch(route.path, req.path) && req.method.toLowerCase() === route.method.toLowerCase()
  );
}

// a filters is of the form (req, res, filters)=> <boolean>, with an output of false meaning blocking the ongoing request
let filters = [];
function login(req, res, sessionManager, verifier, sessionContent_callback, onFailedCnx) {
  if (filters[0] && filters.some((filter) => !filter(req, res, filters))) return;
  if (!verifier(req)) return onFailedCnx(req, res, filters);

  const session = sessionContent_callback(req, sessionManager);
  const sessionId = sessionManager.addSession(session);

  res.cookie("sessionId", sessionId).send({ msg: "ok" });
}

function logout(req, res, sessionManager) {
  const { sessionId } = req.cookies;
  sessionManager.terminateSession(sessionId, "User logged out");

  res.send({ msg: "User logged out." });
}

module.exports = auth;
