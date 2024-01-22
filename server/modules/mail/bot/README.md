### MAIL BOT

# usage

MailBot consists of a function: mailBot(emailList:<{email,props:{}}[]>);
The emailList parameter contains all the recipients email addresses and additionnal props.
The content of the mail is defined in the "mail content" folder.
--> html: the html content of the mail is defined by the first .html file found in the "mail content" folder.
--> text: the text content of the mail is defined by the first .txt file found in the "mail content" folder.
--> subject: the subject of the mail is the html title tag content

# custom mailing

In .txt and .html files in the "mail content" folder, you can use the template litteral notation '${content.<someRecipientProperty>}'
which will be replaced onsend by the corresponding recipient property.

# analytics

To every html mail is added a single pixel image, with a unique route attributed to every recipients.
Who has oppened the mail and how many times can then be known
