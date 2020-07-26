var nodemailer = require("nodemailer");
const config = require("config");

function sendMail(receiver, payload) {
  console.log(receiver, payload);
  var transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: config.get("services.nodemailer.auth.user"),
      pass: config.get("services.nodemailer.auth.pass")
    }
  });

  const mailOptions = {
    from: "info.certfyi@gmail.com", // sender address
    to: receiver, // list of receivers
    subject: "OTP", // Subject line
    html:
      "<p>vendor is requesting to retrieve " +
      payload.amount +
      "<br/> of tokens from your phone </p><br/>" +
      "<p>please share this OTP if you want to do transaction </p>" +
      "<h4>OTP : </h4>" +
      payload.otp

    // plain text body
  };

  transporter.sendMail(mailOptions, function (err, info) {
    if (err) {
      console.log(err);
      return err;
    } else {
      console.log(info);
      return info;
    }
  });
}

module.exports = { sendMail };
