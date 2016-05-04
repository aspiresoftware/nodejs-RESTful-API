/**
 * Utitlity for sending mail
 */
var nodemailer = require("nodemailer");
var sendmailTransport = require('nodemailer-sendmail-transport');
var success = require('./success.js');

/*
  Here we are configuring our SMTP Server details.
  STMP is mail server which is responsible for sending and recieving email.
*/
/*
 * run which sendmail command in terminal to check the path
 */
var smtpTransport = nodemailer.createTransport(sendmailTransport({
  path: '/usr/sbin/sendmail'
}));

module.exports = {
  sendUpdatedPassword : function (email, customername, newpassword, success, failure) {
    var mailOptions = {
      to : email,
      subject : "Password reset successfully",
      html : '<div>Hi ' + customername + ',</div><div>Your new password is <b>' + newpassword + '.</b></div><div>Thanks,<br/>Helpme Team</div>'
    };
    smtpTransport.sendMail(mailOptions, function(error, response) {
      if(error) {
        failure();
      } else {
        success();
      }
    });
  }
};
