const path = require("path");
const fs = require("fs");
const { mail } = require("../mailer");
const { fill, getFilesIn, getSuffix, getFileName, getEmailRouteIdentifier } = require("./utils/utils");

let settings = {};
// {id:<some string>, email:<the email to link px route to>}
(function loadSettings() {
  settings = JSON.parse(fs.readFileSync(path.join(__dirname, "./settings.json")).toString());
})();

function getMailContent() {
  let mailContent = {};
  let files = getFilesIn(path.join(__dirname, "./mail content"));
  let attachments = getFilesIn(path.join(__dirname, "./mail content/attachments"));

  let htmlPath = files.find((file) => getSuffix(file) === ".html");
  let textPath = files.find((file) => getSuffix(file) === ".txt");
  let subject = fs
    .readFileSync(htmlPath)
    .toString()
    .match(/(?<=<title>).*(?=<\/title>)/g)[0];

  mailContent.html = { path: htmlPath };
  mailContent.text = { path: textPath };
  mailContent.subject = subject;
  mailContent.attachments = attachments.map((atch) => new Object({ path: atch, filename: getFileName(atch) }));

  return mailContent;
}

async function mailGroup(
  emailList = [{ email: "duvailloic1@gmail.com", props: { name: "Duvail Loic" } }],
  mailTemplate
) {
  if (!emailList[0]) return;

  let recipient = emailList.pop();

  let personalizedMail = mailTemplate;
  if (mailTemplate.html.path) personalizedMail.html = fill(mailTemplate.html.path, recipient.props);
  if (mailTemplate.text.path) personalizedMail.text = fill(mailTemplate.text.path, recipient.props);
  else personalizedMail.text = "";
  personalizedMail.to = recipient.email;

  if (personalizedMail.html)
    await getEmailRouteIdentifier(recipient.email)
      .then((id) => {
        personalizedMail.html = personalizedMail.html.replace(
          "<body>",
          `<body>\n<img src="${settings.analytics.route + id}"/>`
        );
      })
      .catch((err) => console.error(err));

  console.log(`mailing ${recipient.email}...`);

  mail(personalizedMail)
    .then(() => {
      console.log(`Success, ${emailList.length} mails remaining\n`);
      mailGroup(emailList, mailTemplate);
    })
    .catch((err) => {
      console.error(err);
      console.log(recipient);
      mailGroup(emailList, mailTemplate);
    });
}

function mailBot(emailList) {
  let mailTemplate = getMailContent();
  mailGroup(emailList, mailTemplate);
}

module.exports = mailBot;
