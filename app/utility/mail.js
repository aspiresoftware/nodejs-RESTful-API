/**
 * Utitlity for sending mail
 */
var nodemailer = require("nodemailer");
var sendmailTransport = require('nodemailer-sendmail-transport');

/*
  Here we are configuring our SMTP Server details.
  STMP is mail server which is responsible for sending and recieving email.
*/
var smtpTransport = nodemailer.createTransport(sendmailTransport({
  path: '/usr/lib/sendmail'
}));
module.exports = {
  sendMail : function (req, res) {
    var mailOptions = {
      to : req.body.to,
      subject : req.body.subject,
      html : '<a href="http://expressjs.com/en/guide/using-middleware.html">Forgot Password</a>'
    };
    console.log(mailOptions);
    smtpTransport.sendMail(mailOptions, function(error, response) {
      if(error) {
        console.log(error);
        return res.status(403).send({ 'mail': 'error'});
      } else {
        console.log("Message sent: " + response.message);
        return res.status(200).send({ 'mail': 'sent'});
      }
    });
  }
};
