const { v4 } = require("uuid");
const Time = require("../utils/Time");
const { merge, copy } = require("../utils/deep");

const defaultOptions = {
  ageInterval: Time.sec(10).to("ms"),
  defaultLifetime: Time.hour(2).to("ms"),
  vocalize: true,
};

class SessionManager {
  #options;
  #sessions = [];
  #interval;
  #name;
  static defaultOptions = defaultOptions;

  constructor(name, options = defaultOptions) {
    this.#name = name;
    this.#options = merge(copy(SessionManager.defaultOptions), options);
    this.#age(this.#options.ageInterval);
  }

  #log(msg) {
    if (!this.#options.vocalize) return;

    console.log(`---- Session manager: ${this.#name} ----`);
    console.log(msg + "\n");
  }

  #logSession(session, prefix) {
    if (!this.#options.vocalize) return;
    if (!session) return;

    let msg = `${prefix || "session"} (${new Date().toUTCString()}):\n`;
    Object.keys(session).forEach((key) => {
      msg += `    ${key}: ${session[key]}\n`;
    });
    //remove last line jump
    msg = msg.slice(0, -1);
    this.#log(msg);
  }

  addSession(session = { userId: 1, userName: "test-user" }, lifetime = this.#options.defaultLifetime) {
    const sessionId = v4();

    session.sessionId = sessionId;
    session.lifetime = lifetime;

    this.#sessions.push(session);

    this.#logSession(session, "NEW SESSION");

    return sessionId;
  }

  getSession(sessionId) {
    const session = this.#sessions.find((sess) => sess.sessionId === sessionId);
    if (!session) {
      this.#log(`Couldn't find session: id=${sessionId}`);
      return false;
    }

    return session;
  }

  getSessions() {
    return this.#sessions;
  }

  sessionExists(sessionId) {
    return this.#sessions.some((session) => session.sessionId === sessionId);
  }

  terminateSession(id, cause) {
    const session = this.#sessions.find((session) => session.sessionId === id);
    const sessionIndex = this.#sessions.indexOf(session);
    if (sessionIndex === -1) {
      this.#log(`Couldn't find session to terminate it: ${session}`);
    }
    this.#sessions.splice(sessionIndex, 1);
    this.#logSession(session, "SESSION TERMINATED, cause: " + cause);

    if (!this.#sessions[0]) this.#log("NO ACTIVE SESSIONS");
  }

  #age(interval_ms = Time.sec(10).to("ms")) {
    // clear previous interval if existing to avoid simultaneous aging processes
    this.#stopAging();

    this.#interval = setInterval(() => {
      let sessionsToTermninate = [];

      this.#sessions.forEach((session) => {
        session.lifetime -= interval_ms;
        if (session.lifetime <= 0) sessionsToTermninate.push(session);
      });

      sessionsToTermninate.forEach((session) => this.terminateSession(session.sessionId, "session timed out"));
    }, interval_ms);
  }

  #stopAging() {
    clearInterval(this.#interval);
  }
}

module.exports = SessionManager;
