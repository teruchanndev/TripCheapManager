const Email = require("../models/email");
const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

exports.sendEmail = (req, res, next) => {
  const msg = {
    to: req.body.to,
    from: req.body.from, // Use the email address or domain you verified above
    subject: req.body.subject,
    text: req.body.text,
    html: req.body.html,
  };
  console.log('msg: ' + msg.from);
  sgMail
  .send(msg)
  .then(() => {
    console.log('emails sent successfully!');
  }).catch(error => {
    console.log(error);
  });

}

