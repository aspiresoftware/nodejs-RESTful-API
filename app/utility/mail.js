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
  sendUpdatedPassword : function (email, customername, newpassword) {
    var mailOptions = {
      to : email,
      subject : "Password reset successfully",
      html : '<div>Hi' + customername + ',</div><div>Your new password is <b>' + newpassword + '.</b></div><div>Thanks,<br/>Helpme Team</div>'
    };
    smtpTransport.sendMail(mailOptions);
  }
};
