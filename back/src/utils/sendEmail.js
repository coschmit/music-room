import nodemailer from "nodemailer";

const emailTemplate = (name, code) => {
  return `<html>
    <head>
    <title>Music-Roon - Confirm your account</title>
    <style>
   

      body {
          font-family: sans-serif !important;
          background: #fff;
          margin: 0px;
          text-align: center;
      }
      .head{
          background: #4B6C9C;
          color: #fff;
      }

      .head h1 {
          font-family: sans-serif !important;
          font-size: 50px;
          font-weight: normal;
          line-height: 100px;
          margin-top:100px;
      }
      .button {
          color: #fff;
          line-height: 50px;
          text-decoration: none;
          text-align: center;
          margin-top: 50px;
          margin-bottom: 50px;
          background-color: #333033;
      }

      .button a {
          color: #fff;
          text-decoration: none;
      }
      a {
          color: #fff;
      }
      p a {
          color: #565656;
      }
      .black a {
          color: #000;
      }
    </style>
    </head>

    <body bgcolor="#fff">
    <table bgcolor="#efefef" cellpadding="0" cellspacing="0" border-collapse="collapse" width="100%">
    <tr>
    <td align="center" style="padding: 30px;">
    <table bgcolor="#efefef" cellpadding="0" cellspacing="0" border-collapse="collapse" width="700px">
    <tr>
    <td align="center">
    <table bgcolor="#efefef" cellpadding="0" cellspacing="0" border-collapse="collapse" width="100%">
    <tr>
    <td width="50%" style="text-align: right;">
    <!--<a href="#" style="color: #868686;">View in Browser</a>-->
    </td>
    </tr>
    </table>
    <table bgcolor="#e47f02" class="head" style="background: #4B6C9C;" cellpadding="0" cellspacing="0" border="0" border-collapse="collapse" width="100%">
    <tr>
    <td style="text-align: center;" colspan="3">
    <h1>Welcome to Music-Room</h1>
  
    </td>
    </tr>
    <tr>
    <td colspan="3" style="padding: 0px 80px; font-size: 20px; text-align: center;">Hi ${name}, Welcome to Music-Room, please confirm your email address to get started.</td>
    </tr>
    <tr>
    <td width="30%">&nbsp;</td>
    <td style="text-align: center;" width="40%">
    <table cellpadding="0" cellspacing="0" border-collapse="collapse" class="button" width="100%">
    <tr>
    <td>
    <p style="font-size: 15px;">Your code: ${code} </p>
    </td>
    </tr>
    </table>
    </td>
    <td width="30%">&nbsp;</td>
    </tr>
    </body>

    </html>
    `;
};

// const transporter = nodemailer.createTransport({
//   service: "gmail",
//   auth: {
//     user: "colinschmitt472@gmail.com",
//     pass: "Colin180600",
//   },
// });
const transporter = nodemailer.createTransport({
  host: "smtp-mail.outlook.com",
  secureConnection: false, // TLS requires secureConnection to be false
  port: 587, // port for secure SMTP
  auth: {
    user: "musicroom42-dev@outlook.com",
    pass: "MusicRoom42",
  },
  tls: {
    ciphers: "SSLv3",
  },
});

export const send = (from, to, subject, body) => {
  const emailBody = {
    from: "musicroom42-dev@outlook.com",
    to: `${to}`,
    subject: `${subject}`,
    html: emailTemplate(body.name, body.code),
  };

  transporter.sendMail(emailBody, (err, info) => {
    if (err) {
      console.log("err email", err);
      return err;
    }
    console.log("info email", info);
    return info;
  });
};
