const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  service: "gmail",
  port: 587,
  pool: true,
  auth: {
    user: process.env.NODE_MAILER_USER,
    pass: process.env.NODE_MAILER_PASS,
  },
});

let defaultReportMail = {
  subject: "Default test mail",
  text: "This is the default test mail.",
  html: "This is the default html test mail",
  attachments: [],
};

let defaultMail = { ...defaultReportMail, to: "duvailloic1@gmail.com" };

function mail(mail = defaultMail) {
  mail.from = process.env.NODE_MAILER_USER;

  return new Promise((resolve, reject) => {
    transporter.sendMail(mail, (err, info) => {
      if (err) return reject(err);
      resolve(info);
    });
  });
}

function report(email = defaultReportMail) {
  email.to = "duvailloic1@gmail.com";
  return mail(email);
}

module.exports = { report, mail };
