const nodemailer = require("nodemailer");
const config = require("config");
const app_url = config.get("app.url");
const handlebars = require("handlebars");
const fs = require("fs");
const transporter = nodemailer.createTransport(config.get("services.nodemailer"));

handlebars.registerHelper("host_url", () => app_url);

const Templates = {
  create_user: {
    from: '"Rumsan" <no-reply@rumsan.com>',
    subject: "Welcome to the App",
    html: __dirname + "/../public/email_templates/create_user.html"
  },
  forgot: {
    from: '"Rumsan" <no-reply@rumsan.com>',
    subject: "Recover Forgot Password",
    html: __dirname + "/../public/email_templates/forgot.html"
  },
  reset_password: {
    from: '"Rumsan" <no-reply@rumsan.com>',
    subject: "Reset Password",
    html: __dirname + "/../public/email_templates/reset_password.html"
  }
};

class Messenger {
  constructor() {}

  getTemplate(name) {
    return Templates[name];
  }

  getHtmlBody(name, data) {
    let template = this.getTemplate(name);
    if (!template) return null;

    let text = fs.readFileSync(template.html, { encoding: "utf-8" });
    var hTemplate = handlebars.compile(text);
    return hTemplate(data);
  }

  send(payload) {
    let me = this;
    let template = this.getTemplate(payload.template);
    if (!template) throw new Error("No template is defined");
    if (!payload.to) throw new Error("No receipent was specified");

    if (payload.subject) {
      template.subject = payload.subject;
    }

    return transporter.sendMail({
      from: template.from,
      subject: template.subject,
      to: payload.to,
      html: me.getHtmlBody(payload.template, payload.data)
    });
  }
}

module.exports = new Messenger();
